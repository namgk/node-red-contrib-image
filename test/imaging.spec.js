var Imaging = require('../src/Imaging')
var utils = require('../src/utils')
var fs = require('fs')
var Promise  = require('es6-promise');

describe('Imaging module', () => {
  describe('"imageDiff"', () => {
    it('should calculate difference between two images', () => {
    	var imageDiff = new Imaging.ImageDiff()
    	var img0 = fs.readFileSync("test/0.jpg.txt", 'utf8');
    	var img1 = fs.readFileSync("test/1.jpg.txt", 'utf8');

    	var inputMsgs = [img0, img1, img1, img0]

    	var promise = Promise.resolve()
    	for (var i = 0; i < inputMsgs.length; i++){
    		(i=>{
    			promise = promise.then(()=>{
	    			return new Promise((resolve, reject)=>{
							imageDiff.onInput({payload: inputMsgs[i]}, (_msg)=>{
								console.log(i, _msg.image_distance, _msg.image_diff)
								try {
									if (i %2 === 0){
										require('chai').assert(_msg.image_distance === _msg.image_diff)
									} else {
										require('chai').assert(_msg.image_distance === 0.265625)
									}
									resolve()
								} catch(e){
									reject()
								}
							})
	    			})
    			})
    		})(i)
    	}
    	return promise
    })
  })

  describe('"image save"', () => {
    it('should save image from data:urls', (done) => {
    	var imageSave = new Imaging.ImageSave({destination: "test/0.out.jpg"})
    	var img0 = fs.readFileSync("test/0.jpg.txt", 'utf8');
			imageSave.onInput({payload: img0}, (err)=>{
				done(err)
			})
    })
  })
})
