var videoshow = require('../')

var subtitles = __dirname + '/../test/fixtures/subtitles.srt'
var audio = __dirname + '/../test/fixtures/song.mp3'
var logo = __dirname + '/../test/fixtures/logo.png'
var logoParams = {
  start: 5,
  end: 20,
  xAxis: 20,
  yAxis: 20
}

var images = [
  __dirname + '/../test/fixtures/step_1.png',
  __dirname + '/../test/fixtures/step_2.png',
  __dirname + '/../test/fixtures/step_3.png',
  __dirname + '/../test/fixtures/step_4.png',
  __dirname + '/../test/fixtures/step_5.png'
]

videoshow(images)
  .subtitles(subtitles)
  .audio(audio)
  .logo(logo, logoParams)
  .save('video.mp4')
  .on('start', function (command) {
    console.log('ffmpeg process started:', command)
  })
  .on('error', function (err) {
    console.error('Error:', err)
  })
  .on('end', function (output) {
    console.log('Video created in:', output)
  })
