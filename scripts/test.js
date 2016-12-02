#!/usr/bin/env node

/**
 * Environment Variables
 *
 * INTERNARGS: provide additional arguments to the intern-client command
 */

var shell = require('shelljs');
var path = require('path');
var exec = require('./common').exec;
var exitGracefully = require('./common').exitGracefully;

var dir = path.join(__dirname, '..');

shell.cd(dir);
shell.echo('### Testing DigDug');

exec('./node_modules/.bin/tsc -p ./tsconfig.tests.json')
	.then(function () {
		var internArgs = process.env.INTERNARGS ? ' ' + process.env.INTERNARGS : '';
		var cmd = './node_modules/.bin/intern-client config=dist/tests/intern' + internArgs;
		console.log(cmd);
		return exec(cmd);
	})
	.catch(exitGracefully);
