var videoshow = require('../')

var audio = __dirname + '/../test/fixtures/song.mp3'

var audioParams = {
  fade: true,
  delay: 2 // seconds
}

var images = [
  __dirname + '/../test/fixtures/step_1.png',
  __dirname + '/../test/fixtures/step_2.png',
  __dirname + '/../test/fixtures/step_3.png',
  __dirname + '/../test/fixtures/step_4.png',
  __dirname + '/../test/fixtures/step_5.png'
]

videoshow(images)
  .audio(audio, audioParams)
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
