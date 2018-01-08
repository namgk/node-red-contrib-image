/**
 * Copyright 2014 Sense Tecnic Systems, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
var Jimp = require("jimp")
var fs = require('fs')
var PNG = require('pngjs').PNG
var StreamToBuffer = require("stream-to-buffer");

function ImageDiff(config) {
  this.distance = 1
  this.diff = 1
  this.lastImage = null
  this.threshold = config && config.diffThreshold ? config.diffThreshold : 0.6
  this.width = config && config.width ? config.width : 640
  this.height = config && config.height ? config.height : 480
}

ImageDiff.prototype.onInput = function(msg, cb) {

  var img_png = new PNG({width: this.width, height: this.height})
  img_png.data = Buffer.from(msg.payload)

  var that = this
  StreamToBuffer(img_png.pack(), (err, buffer)=>{
    Jimp.read(buffer, (err, image)=>{
      if (that.lastImage){
        that.distance = Jimp.distance(image, that.lastImage) // 0-1, 0: identical
        that.diff = Jimp.diff(image, that.lastImage, that.threshold).percent
      }
      msg.image_distance = that.distance
      msg.image_diff = that.diff
      that.lastImage = image
      cb(msg)
    })
  })
}

function PngEncoder(config){

}

PngEncoder.prototype.onInput = function(msg, cb) {
  var img_png = new PNG({width: this.width, height: this.height})
  img_png.data = Buffer.from(msg.payload)
  return PNG.sync.write(img_png);
}

module.exports = {
  ImageDiff: ImageDiff
}