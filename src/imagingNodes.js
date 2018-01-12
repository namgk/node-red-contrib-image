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

var Imaging = require('./Imaging');

module.exports = function(RED) {
  "use strict";

  function ImageDiffNode(n) {
    RED.nodes.createNode(this,n);

    var imageDiff = new Imaging.ImageDiff(n)
    var node = this

    node.on("input",function(msg) {
      if (typeof msg.payload !== 'string'){
        return
      }
      imageDiff.onInput(msg, node.send.bind(node))
    })
  }

  RED.nodes.registerType("diff", ImageDiffNode);

  function ImageSaveNode(n) {
    RED.nodes.createNode(this,n);

    var imageSave = new Imaging.ImageSave(n)
    var node = this

    node.on("input",function(msg) {
      if (typeof msg.payload !== 'string'){
        return
      }
      imageSave.onInput(msg)
    })
  }

  RED.nodes.registerType("save", ImageSaveNode);

  function ImageGrayscaleNode(n) {
    RED.nodes.createNode(this,n);

    var imageGrayscale = new Imaging.ImageGrayscale(n)
    var node = this

    imageGrayscale.onError = node.error

    node.on("input",function(msg) {
      if (typeof msg.payload !== 'string'){
        return
      }
      imageGrayscale.onInput(msg, node.send.bind(node))
    })
  }

  RED.nodes.registerType("grayscale", ImageGrayscaleNode);
}
