var measures = [ 3600000, 60000, 1000 ]

exports.stringify = function (data) {
  var buf = data.map(function (s) {
    var track = ''

    if (!isNaN(s.startTime) && !isNaN(s.endTime)) {
      s.startTime = msTime(parseInt(s.startTime, 10))
      s.endTime = msTime(parseInt(s.endTime, 10))
    }

    track += s.id + '\n'
    track += s.startTime + ' --> ' + s.endTime + '\n'
    track += s.text + '\n'

    return track + '\n'
  })

  return buf.join('\n\n')
}

function msTime(val) {
  var time = measures.map(function (measure) {
    var res = (val / measure >> 0).toString()
    if (res.length < 2) {
      res = '0' + res
    }
    val %= measure
    return res
  })

  var ms = val.toString()
  if (ms.length < 3) {
    for (var i = 0, l = ms.length; i <= 2 - l; i += 1) {
      ms = '0' + ms
    }
  }

  return time.join(':') + ',' + ms
}
