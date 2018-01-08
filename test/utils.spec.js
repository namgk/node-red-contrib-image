var utils = require('../src/utils')
var assert = require('chai').assert;

describe('Utils module', () => {
  describe('"read file"', () => {
    it('should read a file', (done) => {
    	var readFile = utils.readFile
    	var img0 = "test/textFileTest";

    	readFile(img0).then(buffer=>{
    		var fileContent = "line 1\nline 2"
				assert(buffer.toString() === fileContent)
				done()
			}).catch(_e=>{
				console.log(_e)
				done(1)
			})
		})
  })
})