var SauceLabsTunnel = require('../SauceLabsTunnel');
var rimraf = require('rimraf');
var pathUtil = require('path');
var target = pathUtil.join(__dirname, 'saucelabs');
var tunnel = new SauceLabsTunnel({
	directory: target,
//	proxy: 'http://localhost:8888'
});

rimraf(target, testNewDownload);


function testNewDownload() {
	var promise = tunnel.newDownload();
	attachDownloadHandlers(promise);
}

function testDownload() {
	var promise = tunnel.download();
	attachDownloadHandlers(promise);
}

function attachDownloadHandlers(promise) {
	promise.then(onComplete, onError);

	function onComplete() {
		console.log('download complete');
	}

	function onError(info) {
		console.log(info);
	}
}
