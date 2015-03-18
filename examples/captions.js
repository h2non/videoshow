var videoshow = require('../')

var audio = __dirname + '/../test/fixtures/song.mp3'

var options = {
  transition: true,
  useSubRipSubtitles: false,
  subtitleStyle: {
    Fontname: 'Verdana',
    Fontsize: '24',
    PrimaryColour: '11861244'
  }
}

var images = [
  {
    path: __dirname + '/../test/fixtures/step_1.png',
    caption: 'This is a sample subtitle'
  }, {
    path: __dirname + '/../test/fixtures/step_2.png',
    caption: 'Another sample text',
    loop: 5
  }, {
    path: __dirname + '/../test/fixtures/step_3.png',
    caption: 'Fast caption',
    captionStart: 2,
    captionEnd: 3
  }, {
    path: __dirname + '/../test/fixtures/step_4.png',
    loop: 3
  }, {
    path: __dirname + '/../test/fixtures/step_5.png',
    caption: 'Bye bye'
  }
]

videoshow(images, options)
  .audio(audio)
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
