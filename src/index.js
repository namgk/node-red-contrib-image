var fs = require("fs");
var os = require("os");
var path = require("path");
var Jimp = require("jimp");

var utils = require('./utils')

var Promise  = require('es6-promise');

var img0 = "../test/0.png";
var img1 = "../test/1.png";

var readFile = utils.readFile

var promises = [readFile(img0).then(buffer=>{
	return Jimp.read(buffer)
}), readFile(img1).then(buffer=>{
	return Jimp.read(buffer)
})]

Promise.all(promises).then(images=>{
  var distance = Jimp.distance(images[0], images[1]) // 0-1, 0: identical
  var diff = Jimp.diff(images[0], images[1], 0.6).percent
  console.log(distance, diff)
}).catch(e=>{
  errcb(e)
})
