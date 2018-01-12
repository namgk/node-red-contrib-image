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
  var that = this
  Jimp.read(Buffer.from(msg.payload, 'base64'), (err, image)=>{
    if (that.lastImage){
      that.distance = Jimp.distance(image, that.lastImage) // 0-1, 0: identical
      that.diff = Jimp.diff(image, that.lastImage, that.threshold).percent
    }
    msg.image_distance = that.distance
    msg.image_diff = that.diff
    that.lastImage = image
    cb(msg)
  })
}

function ImageSave(config){
  this.config = config
}

ImageSave.prototype.onInput = function(msg, cb) {
  var that = this
  Jimp.read(Buffer.from(msg.payload, 'base64'), (err, image)=>{
    if (err){
      cb(err)
      return
    }

    image.write(that.config.destination)
    cb()
  })
}

function ImageGrayscale(config){
  this.config = config
}

ImageGrayscale.prototype.onInput = function(msg, cb) {
  var that = this
  Jimp.read(Buffer.from(msg.payload, 'base64'), (err, image)=>{
    if (err && that.onError)
      that.onError(err)
    else
      image.greyscale().getBase64(Jimp.MIME_PNG, (err, base64Str)=>{
        cb({payload: base64Str.replace("data:image/png;base64,", "")})
      })
  })
}

module.exports = {
  ImageDiff: ImageDiff,
  ImageSave: ImageSave,
  ImageGrayscale: ImageGrayscale
}