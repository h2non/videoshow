var measures = [ 3600000, 60000, 1000 ]

var msTime = module.exports = function (val, leadingZeros) {
  leadingZeros = leadingZeros || 2

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
    for (var i = 0, l = ms.length; i <= leadingZeros - l; i += 1) {
      ms = '0' + ms
    }
  }

  return time.join(':') + ',' + ms
}

msTime.substation = function (val) {
  var time = msTime(val, true)
  return time.replace(',', '.').slice(1)
}
