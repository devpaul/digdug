var SauceLabsTunnel = require('../SauceLabsTunnel');
var rimraf = require('rimraf');
var pathUtil = require('path');
var target = pathUtil.join(__dirname, 'saucelabs');
var tunnel = new SauceLabsTunnel({
	directory: target,
//	proxy: 'http://localhost:8888'
});

rimraf(target, function () {
	tunnel.download()
		.then(function (response) {
			console.log('Download complete');
			console.log(response);
		}, function (error) {
			console.log(error);
		}, function (update) {
			if(!update || update.type !== 'data') { return; }
			console.log('chunk: ' + update.chunk.length + ' loaded: ' + update.loaded + ' total: ' + update.total);
		});
});