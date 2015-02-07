var fs = require('fs')
var fw = require('fw')
var os = require('os')
var path = require('path')
var uuid = require('lil-uuid')
var union = require('lodash.merge')
var ffmpeg = require('fluent-ffmpeg')
var EventEmitter = require('events').EventEmitter

var copy = require('./copy')
var video = require('./video')
var merge = require('./merge')
var defaults = require('./options').defaults

module.exports = save

function save(videoshow, output) {
  var bus = new EventEmitter

  process.nextTick(function () {
    render(videoshow, output, bus)
  })

  return bus
}

function render(videoshow, output, bus) {
  var images = videoshow.images
  var params = videoshow.params
  var options = videoshow.videoParams

  var jobs = convertImages(images, params)
  var process = mergeParts(bus, options, output).bind(videoshow)

  fw.series(jobs, process)
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

function mergeParts(bus, options, output) {
  var forwardEvent = proxyEvent(bus)

  return function (err, images) {
    if (err) return bus.emit('error', err)

    var cleanup = mergeHandler(images, output, forwardEvent)
    var end = cleanup('end')
    var error = cleanup('error')

    var audio = this.audioFile
    var subtitles = this.subtitlesPath

    merge(images, output, options)
      .on('start', forwardEvent('start'))
      .on('codecData', forwardEvent('codecData'))
      .on('progress', forwardEvent('progress'))
      .on('error', error)
      .on('end', function () {
        if (audio) {
          addAudio(images, audio, subtitles, end, error)
        } else {
          end()
        }
      })
  }

  function addAudio(images, audio, subtitles, end, error) {
    renderAudio(output, audio, images, subtitles, function (err) {
      if (err) return error(err)
      end()
    })
  }
}

function renderAudio(video, audio, images, subtitles, cb) {
  var length = calculateVideoLength(images)

  var options = [
    '-map 0:0',
    '-map 1:0',
    '-t ' + length
  ]

  if (subtitles) {
    options.push('-vf subtitles=' + subtitles)
  }

  renderVideo(video, audio, options, cb)
}

function renderVideo(video, input, options, cb) {
  var output = randomName()

  copy(video, output, function (err) {
    if (err) return cb(err)

    ffmpeg(output)
      .input(input)
      .outputOptions(options)
      .on('error', end)
      .on('end', end)
      .save(video)
  })

  function end(err) {
    fs.unlink(output, function () {
      cb(err)
    })
  }
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
      fs.unlink(file, done)
    }
  }), cb)
}

function calculateVideoLength(images) {
  return images.reduce(function (acc, image) {
    return acc + (image.loop || defaults.loop)
  }, 0)
}

function randomName() {
  return path.join(os.tmpdir(), 'videoshow-' + uuid())
}
