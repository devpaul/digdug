import * as registerSuite from 'intern!object';
import ChromeConfig, { factory } from 'src/configs/ChromeConfig';
import { DriverFile } from 'src/SeleniumTunnel';
import checkRemote from '../../support/checkRemote';
import Test = require('intern/lib/Test');

let driverConfigs: { [ key: string ]: Promise<DriverFile> } = {
	'linux x64': factory({
		platform: 'linux',
		architecture: 'x64'
	}),
	'linux 32-bit': factory({
		platform: 'linux',
		arch: 'x86'
	}),
	mac: factory({
		platform: 'darwin'
	}),
	windows: factory({
		platform: 'win32'
	})
};

registerSuite({
	name: 'integration/configs/ChromeConfig',

	'latest exists': (() => {
		const tests: { [ key: string ]: any } = {};
		for (let name in driverConfigs) {
			tests[name] = function () {
				const promise = driverConfigs[name];
				return promise.then(function (driverFile: DriverFile) {
					return checkRemote(driverFile.url);
				});
			};
		}
		return tests;
	})(),

	'default is using latest': (() => {
		const tests: { [ key: string ]: any } = {};
		for (let name in driverConfigs) {
			tests[`for ${ name }`] = function (this: Test) {
				const promise = driverConfigs[name];
				return promise.then((driverFile: ChromeConfig) => {
					const defaultConfig = new ChromeConfig();
					if (driverFile.version !== defaultConfig.version) {
						this.skip(`not using latest. Current ${ defaultConfig.version }. Latest ${ driverFile.version }`);
					}
				});
			};
		}
		return tests;
	})()
});
