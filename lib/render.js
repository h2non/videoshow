var fs = require('fs')
var fw = require('fw')
var os = require('os')
var path = require('path')
var uuid = require('lil-uuid')
var union = require('lodash.merge')
var ffmpeg = require('fluent-ffmpeg')
var EventEmitter = require('events').EventEmitter

var subrip = require('./subrip')
var copy = require('./copy')
var video = require('./video')
var merge = require('./merge')
var options = require('./options')
var applyVideoOptions = options.applyVideo
var defaults = options.defaults

module.exports = render

function render(videoshow) {
  var bus = new EventEmitter

  process.nextTick(function () {
    processVideo(videoshow, bus)
  })

  return bus
}

function processVideo(videoshow, bus) {
  var images = videoshow.images
  var params = videoshow.params

  var imageJobs = convertImages(images, params)
  var videoJob = mergeParts(videoshow, bus)

  fw.series(imageJobs, videoJob)
}

function convertImages(images, params) {
  return images.map(function (image) {
    var output = randomName()
    return function (done) {
      video(image, params, output)
        .on('error', done)
        .on('end', function () {
          done(null, output)
        })
    }
  })
}

function mergeParts(videoshow, bus) {
  var forwardEvent = proxyEvent(bus)
  var output = videoshow.output

  return function (err, images) {
    if (err) return bus.emit('error', err)

    var cleanup = mergeHandler(images, output, forwardEvent)
    var end = cleanup('end')
    var error = cleanup('error')
    var options = videoshow.videoParams

    merge(images, output, options)
      .on('start', forwardEvent('start'))
      .on('codecData', forwardEvent('codecData'))
      .on('progress', forwardEvent('progress'))
      .on('error', error)
      .on('end', function () {
        if (videoshow.audioFile) {
          renderVideoWithAudio(videoshow, handler)
        } else {
          renderVideo(videoshow, null, handler)
        }
      })

    function handler(err) {
      if (err) return error(err)
      end()
    }
  }
}

function renderVideoWithAudio(videoshow, cb) {
  var length = calculateVideoLength(videoshow.images)

  var options = [
    '-map 0:0',
    '-map 1:0',
    '-t ' + length
  ]

  renderVideo(videoshow, options, cb)
}

function renderVideo(videoshow, options, cb) {
  var tempfile = randomName()
  var output = videoshow.output
  var audio = videoshow.audioFile
  var videoParams = videoshow.videoParams
  var params = videoshow.params
  var videoOptions = union({}, params, videoParams)
  options = options || []

  copy(output, tempfile, function (err) {
    if (err) return cb(err)

    var subtitles = getImageSubtitles(videoshow) || videoshow.subtitlesPath
    if (subtitles) options.push(subtitlesOption(videoshow, subtitles))

    var video = ffmpeg(tempfile)
    applyVideoOptions(video, videoOptions)

    if (audio) video.input(audio)

    video
      .outputOptions(options)
      .on('error', end)
      .on('end', end)
      .save(output)

    function end(err) {
      remove(tempfile, function () {
        if (subtitles !== videoshow.subtitlesPath) {
          remove(subtitles)
        }
        cb(err)
      })
    }
  })
}

function subtitlesOption(videoshow, subtitles) {
  var captionStyle = videoshow.params.captionStyle
  return '-vf subtitles='
    + subtitles
    + (captionStyle ? ':force_style=\'' + captionStyle + '\'' : '')
}

function getImageSubtitles(videoshow) {
  var filepath = null
  var params = options.define(videoshow.params)

  var subtitles = videoshow.images
    .filter(function (image) {
      return image.caption
    })
    .map(function (image, index) {
      return renderCaption(image, index + 1, calculateOffset(index), params)
    })
    .join('')

  function calculateOffset(index) {
    return videoshow.images.slice(0, index).reduce(function (prev, current) {
      return prev + ((current.loop || params.loop) * 1000)
    }, 0)
  }

  if (subtitles) {
    filepath = randomName() + '.srt'
    fs.writeFileSync(filepath, subtitles)
  }

  return filepath
}

function renderCaption(image, index, offset, params) {
  var loop = (image.loop || params.loop) * 1000

  var subtitleMeta = {
    id: index,
    startTime: offset + (image.captionStart || 1000),
    endTime: offset + (image.captionEnd || (loop < 1500 ? loop : loop - 1000)),
    text: image.caption
  }

  return subrip.stringify([ subtitleMeta ])
}

function mergeHandler(images, output, forwardEvent) {
  return function cleanup(event) {
    var forward = forwardEvent(event)
    return function (err) {
      removeFiles(images, function () {
        forward(event === 'error' ? err : output)
      })
    }
  }
}

function proxyEvent(bus) {
  return function (event) {
    return function (value) {
      bus.emit(event, value)
    }
  }
}

function removeFiles(files, cb) {
  fw.parallel(files.map(function (file) {
    return function (done) {
      remove(file, done)
    }
  }), cb)
}

function calculateVideoLength(images) {
  return images.reduce(function (acc, image) {
    return acc + (image.loop || defaults.loop)
  }, 0)
}

function remove(file, cb) {
  fs.unlink(file, cb || function () {})
}

function randomName() {
  return path.join(os.tmpdir(), 'videoshow-' + uuid())
}
