var fs = require('fs')
var fw = require('fw')
var os = require('os')
var path = require('path')
var uuid = require('lil-uuid')
var union = require('lodash.merge')
var ffmpeg = require('fluent-ffmpeg')
var EventEmitter = require('events').EventEmitter

var subrip = require('./subrip')
var substation = require('./substation')
var copy = require('./copy')
var video = require('./video')
var merge = require('./merge')
var options = require('./options')
var defaults = options.defaults
var applyVideoOptions = options.applyVideo

module.exports = render

function render(videoshow) {
  var bus = new EventEmitter

  process.nextTick(function () {
    processVideo(videoshow, bus)
  })

  return bus
}

function processVideo(videoshow, bus) {
  var imageJobs = convertImages(videoshow)
  var merge = mergeParts(videoshow, bus)

  fw.series(imageJobs, merge)
}

function convertImages(videoshow) {
  var params = options.define(videoshow.params)

  return videoshow.images.map(function (image) {
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
    var ender = cleanup('end')
    var error = cleanup('error')
    var options = videoshow.videoParams

    merge(images, output, options)
      .on('start', forwardEvent('start'))
      .on('codecData', forwardEvent('codecData'))
      .on('progress', forwardEvent('progress'))
      .on('error', error)
      .on('end', end)

    function end() {
      var options = null
      if (videoshow.audioFile) {
        options = audioOptions(videoshow)
      }
      renderVideo(videoshow, options, forwardEvent, handler)
    }

    function handler(err) {
      if (err) return error(err)
      ender()
    }
  }
}

function audioOptions(videoshow) {
  var length = calculateVideoLength(videoshow)
  var params = videoshow.audioParams

  var options = [
    '-map 0:0',
    '-map 1:0',
    '-t ' + length
  ]

  if (params) {
    if (params.fade) {
      options.push('-af afade=t=in:ss=0:st=' + (params.delay || 0) + ':d=3')
      options.push('-af afade=t=out:st=' + (length - 3) + ':d=3')
    }
  }

  return options
}

function renderVideo(videoshow, options, forwardEvent, cb) {
  var tempfile = randomName()
  var output = videoshow.output
  var audio = videoshow.audioFile
  var videoParams = videoshow.videoParams
  var audioParams = videoshow.audioParams
  var params = videoshow.params
  var videoOptions = union({}, params, videoParams)
  var subtitles = getImageSubtitles(videoshow) || videoshow.subtitlesPath
  options = options || []

  copy(output, tempfile, function (err) {
    if (err) return cb(err)

    var video = ffmpeg(tempfile)
    videoOptions.loop = null
    applyVideoOptions(video, videoOptions)

    if (audio) {
      video.input(audio)
      if (audioParams.delay) {
        video.inputOptions('-itsoffset ' + audioParams.delay)
      }
    }

    videoOptions.inputs.forEach(function (input) {
      video.input(input)
    })

    if (subtitles) {
      options.push('-vf subtitles=\'' + subtitles + '\'')
    }

    if (videoOptions.pixelFormat) {
      options.push("-pix_fmt " + videoOptions.pixelFormat);
    }

    video
      .outputOptions(options)
      .on('error', clean(end))
      .on('end', clean(end))
      .on('start', forwardEvent('start'))
      .on('progress', forwardEvent('progress'))
      .on('codecData', forwardEvent('codecData'))
      .save(output)
  })

  function end(err) {
    if (subtitles !== videoshow.subtitlesPath) {
      remove(subtitles)
    }

    if (!err && videoOptions.logo) {
      return addLogo(cb)
    }

    cb.apply(null, arguments)
  }

  function addLogo(cb) {
    copy(output, tempfile, function (err) {
      if (err) return cb(err)

      var logo = ffmpeg(tempfile)
      applyVideoOptions(logo, videoOptions)
      logo
        .input(videoOptions.logo)
        .complexFilter(logoFilter(videoshow))
        .on('error', clean(cb))
        .on('end', clean(cb))
        .on('start', forwardEvent('start'))
        .on('progress', forwardEvent('progress'))
        .on('codecData', forwardEvent('codecData'))
        .save(output)
    })
  }

  function clean(cb) {
    return function (err, stdout, stderr) {
      remove(tempfile, function () {
        if (err) {
          remove(output)
        }
        cb(err, stdout, stderr)
      })
    }
  }
}

function logoFilter(videoshow) {
  var logo = videoshow.params.logo
  var params = videoshow.params.logoParams || {}
  var length = calculateVideoLength(videoshow)

  var xAxis = params.xAxis || 10
  var yAxis = params.yAxis || 10
  var logoStart = params.start || (length > 30 ? 10 : length * 0.20).toFixed(0)
  var logoEnd = params.end || (length > 30 ? length - 10 : length * 0.80).toFixed(0)

  if (logoEnd < 0) {
    logoEnd = length + logoEnd
  }

  return [
    '[0:v][1:v]',
    'overlay=', xAxis, ':', yAxis, ':',
    'enable=between',
    '(t\\,', logoStart, '\\,', logoEnd, ')'
  ].join('')
}

function getImageSubtitles(videoshow) {
  var filepath = null
  var params = options.define(videoshow.params)
  var extension = '.ass'

  var length = 0
  var subtitles = videoshow.images
  .map(function (image, index) {
    var offset = calculateOffsetDelay(index)
    if (image.caption) {
      return renderCaption(image, length++, offset, params)
    }
  })
  .filter(function (caption) {
    return caption != null
  })

  if (!subtitles.length) {
    return
  }

  if (params.useSubRipSubtitles) {
    extension = '.srt'
    subtitles = subrip.stringify(subtitles)
  } else {
    subtitles = substation.stringify(subtitles, params.subtitleStyle)
  }

  filepath = randomName() + extension
  fs.writeFileSync(filepath, subtitles)

  if (os.platform() === 'win32') {
    filepath = filepath.replace(/\\/g, "\\\\")
    filepath = filepath.replace(/:/g, "\\:")
  }

  return filepath

  function calculateOffsetDelay(index) {
    return videoshow.images.slice(0, index).reduce(function (prev, current) {
      return prev + ((current.loop || params.loop) * 1000)
    }, 0)
  }
}

function renderCaption(image, index, offset, params) {
  var loop = (+image.loop || +params.loop) * 1000
  var delay = +image.captionDelay || +params.captionDelay || 1000
  var startTime = offset + (+image.captionStart || 1000)
  var endTime = offset + (+image.captionEnd || (loop - delay))

  var subtitleMeta = {
    id: index,
    startTime: startTime,
    endTime: endTime,
    text: image.caption
  }

  return subtitleMeta
}

function mergeHandler(images, output, forwardEvent) {
  return function cleanup(event) {
    var forward = forwardEvent(event)
    return function handler(err) {
      var args = arguments
      removeFiles(images, function () {
        if (event === 'error') {
          forward.apply(null, args)
        } else {
          forward(output)
        }
      })
    }
  }
}

function proxyEvent(bus) {
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

function calculateVideoLength(videoshow) {
  var images = videoshow.images
  return images.reduce(function (acc, image) {
    return acc + (image.loop || videoshow.params.loop || defaults.loop)
  }, 0)
}

function remove(file, cb) {
  fs.unlink(file, cb || function () {})
}

function randomName() {
  return path.join(os.tmpdir(), 'videoshow-' + uuid())
}
