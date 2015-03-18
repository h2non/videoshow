var msTime = require('./mstime')

exports.stringify = function (data) {
  var buf = data.map(function (s) {
    var track = []

    if (!isNaN(s.startTime) && !isNaN(s.endTime)) {
      s.startTime = msTime(+s.startTime)
      s.endTime = msTime(+s.endTime)
    }

    track.push(s.id)
    track.push(s.startTime + ' --> ' + s.endTime)
    track.push(s.text)

    return track.join('\n')
  })

  return buf.join('\n\n')
}
