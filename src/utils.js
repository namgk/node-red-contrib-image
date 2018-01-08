var fs = require("fs");
var Promise  = require('es6-promise');

var readFile = function (file) {
  return new Promise(function (resolve, reject) {
		var lines = Buffer.from([]);
  	var rs = fs.createReadStream(file)
		.on('readable', function () {
	    var chunk;
	    while (null !== (chunk = rs.read())) {
	      lines = Buffer.concat([lines,chunk]);
	    }
		})
		.on('error', function(err) {
			reject(err)
		})
		.on('end', function() {
		  resolve(lines)
		})
  })
}

module.exports = {
	readFile: readFile
}