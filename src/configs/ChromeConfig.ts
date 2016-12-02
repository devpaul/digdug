import { mixin, compareVersions } from '../util';
import { format } from 'util';
import { DriverFile, DriverProperties, DriverFactory } from '../SeleniumTunnel';
import { KwArgs } from '../interfaces';
import request = require('dojo/request');
import { IResponse } from 'dojo/request';

const LOOKUP_URL = 'https://chromedriver.storage.googleapis.com';

const factory: DriverFactory = function(config: DriverProperties = {}): Promise<DriverFile> | never {
	if (config.version === 'latest') {
		return lookupLatest(config.platform, config.arch)
			.then(function (version: string) {
				const driver = new ChromeConfig(config);
				driver.version = version;
				return driver;
			});
	}

	return Promise.resolve(new ChromeConfig(config));
};

export { factory };

function lookupLatest(platform: string, architecture: string): Promise<string> {
	const artifact = getArtifact(platform, architecture);
	const fileRegex = new RegExp(`<Key>([^<]+?)/${ artifact }</Key>`, 'g');

	return request(LOOKUP_URL, {})
		.then(function (result: IResponse) {
			let fileMatch: [ string, string ];
			let version: string = null;
			while (fileMatch = <any> fileRegex.exec(<string> result.data)) {
				const [ , fileVersion ] = fileMatch;
				if (!version || compareVersions(version, fileVersion) < 0) {
					version = fileVersion;
				}
			}
			return version;
		});
}

function getArtifact(platform: string = process.platform, architecture: string = process.arch): string {
	if (platform === 'linux') {
		const arch = (architecture === 'x64' ? '64' : '32');
		platform = `linux${ arch }`;
	}
	else if (platform === 'darwin') {
		platform = 'mac32';
	}
	else {
		platform = 'win32';
	}

	return `chromedriver_${ platform }.zip`;
}

/**
 * Artifact configuration information for the Chrome driver
 * @param config {Object} mixin properties
 */
export default class ChromeConfig implements DriverFile {
	constructor(config?: KwArgs) {
		mixin(this, config);
	}

	version: string = '2.22';

	baseUrl: string = 'https://chromedriver.storage.googleapis.com';

	platform: string = process.platform;

	arch: string = process.arch;

	get artifact() {
		return getArtifact(this.platform, this.arch);
	}

	get url() {
		return format(
			'%s/%s/%s',
			this.baseUrl,
			this.version,
			this.artifact
		);
	}

	get executable() {
		return this.platform === 'win32' ? 'chromedriver.exe' : 'chromedriver';
	}

	get seleniumProperty() {
		return 'webdriver.chrome.driver';
	}
}
