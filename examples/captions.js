var videoshow = require('../')

var audio = __dirname + '/../test/fixtures/song.mp3'

var options = {
  loop: 5,
  captionDelay: 350,
  transition: true,
  useSubRipSubtitles: false, // Use ASS/SSA subtitles instead 
  subtitleStyle: {
    Fontname: 'Verdana',
    Fontsize: '26',
    PrimaryColour: '11861244',
    SecondaryColour: '11861244',
    TertiaryColour: '11861244',
    BackColour: '-2147483640',
    Bold: '2',
    Italic: '0',
    BorderStyle: '2',
    Outline: '2',
    Shadow: '3',
    Alignment: '1', // left, middle, right
    MarginL: '40',
    MarginR: '60',
    MarginV: '40'
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
