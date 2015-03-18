var substation = require('ass-stringify')
var merge = require('lodash.merge')
var msTime = require('./mstime')

var captionParams = {
  'Marked': 'Marked=0',
  'Start': '0:00:01.18',
  'End': '0:00:06.85',
  'Style': 'DefaultVCD',
  'Name': 'NTP',
  'MarginL': '0000',
  'MarginR': '0000',
  'MarginV': '0000',
  'Effect': null,
  'Text': null
}

var defaultParams = {
  'Script Info': {
    'Title': 'Videoshow video',
    'ScriptType': 'v4',
    'Collisions': 'Normal',
    'PlayResY': '600',
    'PlayDepth': '0',
    'Timer': '100,0000'
  },
  'Empty': {},
  'V4 Styles': {
    'Format': [
      'Name',
      'Fontname',
      'Fontsize',
      'PrimaryColour',
      'SecondaryColour',
      'TertiaryColour',
      'BackColour',
      'Bold',
      'Italic',
      'BorderStyle',
      'Outline',
      'Shadow',
      'Alignment',
      'MarginL',
      'MarginR',
      'MarginV',
      'AlphaLevel',
      'Encoding'
    ],
    'Style': {
      'Name': 'DefaultVCD',
      'Fontname': 'Arial',
      'Fontsize': '28',
      'PrimaryColour': '11861244',
      'SecondaryColour': '11861244',
      'TertiaryColour': '11861244',
      'BackColour': '-2147483640',
      'Bold': '-1',
      'Italic': '0',
      'BorderStyle': '1',
      'Outline': '1',
      'Shadow': '2',
      'Alignment': '2',
      'MarginL': '30',
      'MarginR': '30',
      'MarginV': '30',
      'AlphaLevel': '0',
      'Encoding': '0'
    }
  },
  'Events': {
    'Format': [
      'Marked',
      'Start',
      'End',
      'Style',
      'Name',
      'MarginL',
      'MarginR',
      'MarginV',
      'Effect',
      'Text'
    ]
  }
}

exports.stringify = function (captions, styles) {
  var params = mergeParams(styles)

  captions.forEach(function (caption) {
    var subtitle = merge({}, captionParams, {
      Start: msTime.substation(+caption.startTime),
      End: msTime.substation(+caption.endTime),
      Text: caption.text
    })

    var body = params[params.length - 1].body
    body.push({
      key: 'Dialogue',
      value: subtitle
    })
  })

  return substation(params)
}

function mergeParams(styles) {
  var params = merge({}, defaultParams)
  merge(params['V4 Styles'].Style, styles)

  return Object.keys(params).map(function (key) {
    var body = params[key]
    var map = { section: key }

    map.body = Object.keys(body).map(function (prop) {
      return {
        key: prop,
        value: body[prop]
      }
    })

    return map
  })
}
