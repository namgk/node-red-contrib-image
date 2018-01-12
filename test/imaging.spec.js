var Imaging = require('../src/Imaging')
var utils = require('../src/utils')
var fs = require('fs')
var Promise  = require('es6-promise');

describe('Imaging module', () => {
  describe('"imageDiff"', () => {
    it('should calculate difference between two images', () => {
      var imageDiff = new Imaging.ImageDiff()
      var INPUT_IMG_BASE64 = fs.readFileSync("test/0.jpg.txt", 'utf8');
      var img1 = fs.readFileSync("test/1.jpg.txt", 'utf8');

      var inputMsgs = [INPUT_IMG_BASE64, img1, img1, INPUT_IMG_BASE64]

      var promise = Promise.resolve()
      for (var i = 0; i < inputMsgs.length; i++){
        (i=>{
          promise = promise.then(()=>{
            return new Promise((resolve, reject)=>{
              imageDiff.onInput({payload: inputMsgs[i]}, (_msg)=>{
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
    var destination = "test/0.out.jpg"
    const INPUT_IMG_BASE64 = fs.readFileSync("test/0.jpg.txt", 'utf8');
    
    before(function() {
      fs.unlinkSync(destination)
    })

    it('should save image from data:urls', (done) => {
      var imageSave = new Imaging.ImageSave({destination: destination})
      imageSave.onInput({payload: INPUT_IMG_BASE64}, (err)=>{
        if (err){
          done(err)
        } else {
          try {
            require('chai').assert(fs.existsSync(destination))
            done()
          } catch (e){
            done(1)
            return
          }
        }
      })
    })
  })

  describe('"image grayscale"', () => {
    const TEST_REFERENCE = "test/0.grayscale.ref.txt"
    const INPUT_IMG_BASE64 = fs.readFileSync("test/0.jpg.txt", 'utf8');

    it('should turn image into grayscale', (done) => {
      var imageGrayscale = new Imaging.ImageGrayscale()
      imageGrayscale.onInput({payload: INPUT_IMG_BASE64}, (msg)=>{
        try {
          require('chai').assert(msg.payload === fs.readFileSync(TEST_REFERENCE, 'utf8'))
          done()
        } catch (e){
          done(1)
        }
      })
    })
  })
})
