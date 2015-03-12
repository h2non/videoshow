# videoshow [![Build Status](https://api.travis-ci.org/h2non/videoshow.svg?branch=master)][travis] [![Code Climate](https://codeclimate.com/github/h2non/videoshow/badges/gpa.svg)](https://codeclimate.com/github/h2non/videoshow) [![NPM](https://img.shields.io/npm/v/videoshow.svg)][npm] [![Dependency Status](https://gemnasium.com/h2non/videoshow.svg)][gemnasium]

<img src="https://github.com/h2non/videoshow/blob/master/test/fixtures/norris.gif" width="180" align="right" />

Simple programmatic interface for node/io.js to **create straightforward slide show videos based from a series of images** using [ffmpeg](http://ffmpeg.org)

You can easily **create videos** from **images** with optional **audio**, **subtitles** and **fade-in/out effects**.
Take a look to [examples](https://github.com/h2non/videoshow/tree/master/examples) to see some supported features

Still beta

## Requirements

- **[ffmpeg](http://ffmpeg.org)** with additional compilation flags `--enable-libass --enable-libmp3lame`

## Install

```bash
npm install videoshow
```

## Usage

```js
var videoshow = require('videoshow')

var images = [
  'step1.jpg',
  'step2.jpg',
  'step3.jpg',
  'step4.jpg'
]

var videoOptions = {
  fps: 25,
  loop: 5, // seconds
  videoBitrate: 1024,
  videoCodec: 'libx264',
  size: '640x?',
  audioBitrate: '128k',
  audioChannels: 2,
  format: 'mp4'
}

videoshow(images, videoOptions)
  .audio('song.mp3')
  .save('video.mp4')
```

## API

### videoshow(images, [ options ])
Return: `Videoshow`

Videoshow constructor. You should pass an `array<string>` or `array<object>` or `array<ReadableStream>` with the desired images,
and optionally passing the video render `options` object per each image.

Image formats supported are: `jpg`, `png`, `gif`, `bmp`

```js
videoshow([ 'image1.jpg', 'image2.jpg', 'image3.jpg'])
  .save('video.mp4')
  .on('error', function () {})
  .on('end', function () {})
```

Images could be a collection as well:
```js
videoshow([{
    path: 'image1.jpg',
    caption: 'Hello world as video subtitle'
  }, {
    path: 'image2.jpg',
    caption: 'This is a sample subtitle',
    loop: 10 // long caption
  }])
  .save('video.mp4')
  .on('error', function () {})
  .on('end', function () {})
```

#### videoshow#audio(path)

Define the audio file path to use. It supports multiple formats and codecs such as `acc`, `mp3` or `ogg`

#### videoshow#subtitles(path)

Define the [SubRip subtitles](http://en.wikipedia.org/wiki/SubRip#SubRip_text_file_format)
file path to load. It should be a `.srt` file

#### videoshow#save(path)
Return: `EventEmitter`

Render and write the final video in the given path

#### videoshow#filter(filter)

Add custom filter to the video

#### videoshow#imageOptions(options)

Add specific image rendering options

#### videoshow#options(options)

Add custom video rendering options

#### videoshow#flag(argument)

Add a custom CLI flag to pass to `ffmpeg`

### videoshow.VERSION
Type: `string`

Current package semantic version

### videoshow.ffmpeg
Type: `function`

[fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg) API constructor

## License

[MIT](http://opensource.org/licenses/MIT) © Tomas Aparicio

[travis]: http://travis-ci.org/h2non/videoshow
[gemnasium]: https://gemnasium.com/h2non/videoshow
[npm]: http://npmjs.org/package/videoshow
