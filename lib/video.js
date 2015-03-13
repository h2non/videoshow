var ffmpeg = require('fluent-ffmpeg')
var options = require('./options')

module.exports = video

function video(image, params, output) {
  var video = ffmpeg(image.path)
  params = options.define(params)

  if (image.loop) {
    params.loop = image.loop
  }

  options.applyVideo(video, params)

  if (image.filters) {
    video.videoFilters(image.filters)
  }

  if ((params.transition && image.transition !== false) || image.transition) {
    video.videoFilters(transitionFilter(image, params))
  }

  video.save(output)

  return video
}

function transitionFilter(image, params) {
  var duration = image.transitionDuration || params.transitionDuration
  var loop = image.loop || params.loop

  return [
    'fade=t=in:st=0:d=' + duration,
    'fade=out:st=' + (loop - duration) + ':d=' + duration
  ]
}
