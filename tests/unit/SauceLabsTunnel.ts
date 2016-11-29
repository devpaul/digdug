import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { cleanup } from '../support/cleanup';
import SauceLabsTunnel from 'src/SauceLabsTunnel';

let tunnel: SauceLabsTunnel;

registerSuite({
	name: 'SauceLabsTunnel',

	afterEach() {
		const promise = cleanup(tunnel);
		tunnel = null;
		return promise;
	},

	beforeEach() {
		tunnel = new SauceLabsTunnel();
	},

	'#auth'() {
		tunnel.username = 'foo';
		tunnel.accessKey = 'bar';
		assert.equal(tunnel.auth, 'foo:bar');
	},

	'#executable': {
		'unknown platform'() {
			tunnel.platform = 'foo';
			assert.equal(tunnel.executable, 'java');
		},

		'osx'() {
			tunnel.platform = 'osx';
			tunnel.architecture = 'foo';
			const executable = /\.\/sc-\d+\.\d+(?:\.\d+)?-osx\/bin\/sc/;
			assert.match(tunnel.executable, executable);
		},

		'linux'() {
			tunnel.platform = 'linux';
			assert.equal(tunnel.executable, 'java');
		},

		'x64'() {
			tunnel.architecture = 'x64';
			const executable = /\.\/sc-\d+\.\d+(?:\.\d+)?-linux\/bin\/sc/;
			assert.match(tunnel.executable, executable);
		},

		'win'() {
			tunnel.platform = 'win32';
			const executable = /\.\/sc-\d+\.\d+(?:\.\d+)?-win32\/bin\/sc\.exe/;
			assert.match(tunnel.executable, executable);
		}
	},

	'#extraCapabilities'() {
		assert.deepEqual(tunnel.extraCapabilities, {});
		tunnel.tunnelId = 'foo';
		assert.deepEqual(tunnel.extraCapabilities, { 'tunnel-identifier': 'foo' });
	},

	'#isDownloaded'() {
		tunnel.platform = 'foo';
		assert.isFalse(tunnel.isDownloaded);
	},

	'#url': {
		unknown() {
			tunnel.platform = 'foo';
			tunnel.architecture = 'bar';
			assert.equal(tunnel.url, 'https://saucelabs.com/downloads/Sauce-Connect-3.1-r32.zip');
		},

		mac() {
			tunnel.platform = 'darwin';
			const url = /https:\/\/saucelabs\.com\/downloads\/sc-\d+\.\d+(?:\.\d+)?-osx\.zip/;
			assert.match(tunnel.url, url);
		},

		linux() {
			tunnel.platform = 'linux';
			tunnel.architecture = 'x64';
			const url = /https:\/\/saucelabs\.com\/downloads\/sc-\d+\.\d+(?:\.\d+)?-linux\.tar\.gz/;
			assert.match(tunnel.url, url);
		}
	}
});