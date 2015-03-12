var videoshow = require('../')

var audio = __dirname + '/../test/fixtures/song.mp3'

var options = {
  transition: true
}

var images = [
  {
    path: __dirname + '/../test/fixtures/step_1.png',
    caption: 'This is a sample text'
  }, {
    path: __dirname + '/../test/fixtures/step_2.png',
    caption: 'Another sample text'
  }, {
    path: __dirname + '/../test/fixtures/step_3.png'
  }, {
    path: __dirname + '/../test/fixtures/step_4.png',
    transition: false
  }, {
    path: __dirname + '/../test/fixtures/step_5.png',
    transition: false
  }
]

videoshow(images, options)
  .audio(audio)
  .save('audio.mp4')
  .on('error', function (err) {
    console.error('Error:', err)
  })
  .on('end', function (output) {
    console.log('Video created in:', output)
  })
