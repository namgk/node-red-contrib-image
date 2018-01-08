var Imaging = require('../src/Imaging')
var utils = require('../src/utils')

describe('Imaging module', () => {
  describe('"imageDiff"', () => {
    it('should calculate difference between two images', () => {
    	var imageDiff = new Imaging.ImageDiff()
    	var readFile = utils.readFile
    	var img0 = "test/0.jpg";
			var img1 = "test/1.jpg";

    	var promises = [readFile(img0), readFile(img1), readFile(img1),  readFile(img0)]
			return Promise.all(promises).then(buffers=>{
				buffers.forEach((buffer,i)=>{
					imageDiff.onInput({payload: buffer}).then(_msg=>{
						console.log(i, _msg.image_distance, _msg.image_diff)
					}).catch(_e=>{
						console.log(_e)
					})
				})
			}).catch(_e=>{
				console.log(_e)
			})
    }).timeout(5000)
  })

  describe('"png encoder"', () => {
    it('should encode a buffer into png format', () => {
    	var pngEncoder = new Imaging.PngEncoder()
    	var readFile = utils.readFile
    	var img0 = "test/0.jpg";

    	readFile(img0).then(buffer => {
    		pngEncoder.onInput(buffer, pngBuffer => {
    			
    		})
    	})

    })
  })
})