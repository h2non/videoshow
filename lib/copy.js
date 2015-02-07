var fs = require('fs')

module.exports = function copy(src, dest, cb) {
  fs.createReadStream(src)
    .on('error', cb)
    .on('end', cb)
    .pipe(fs.createWriteStream(dest))
}
