define([
	'intern!object',
	'intern/chai!assert',
	'intern/dojo/node!../../BrowserStackTunnel',
	'intern/dojo/Promise'
], function (
	registerSuite,
	assert,
	BrowserStackTunnel,
	Promise
) {
	var tunnel;
	var missingCredentials;

	registerSuite({
		name: 'integration/BrowserStack',

		beforeEach: function () {
			tunnel = new BrowserStackTunnel();
			missingCredentials = !tunnel.accessKey || !tunnel.username;
		},

		getBrowsers: function () {
			if (missingCredentials) {
				this.skip('missing credentials. Please provide BrowserStack credentials with the ' +
					'BROWSERSTACK_ACCESS_KEY and BROWSERSTACK_USERNAME environment variables');
				return;
			}
			return tunnel.getBrowsers()
				.then(function (browsers) {
					assert.isArray(browsers);
					browsers.forEach(function (environment) {
						assert.property(environment, 'os_version');
						assert.property(environment, 'browser');
						assert.property(environment, 'os');
						assert.property(environment, 'device');
						assert.property(environment, 'browser_version');
					});
				});
		},

		localizeEnvironment: {
			latest: function () {
				if (missingCredentials) {
					this.skip('missing credentials. Please provide BrowserStack credentials with the ' +
						'BROWSERSTACK_ACCESS_KEY and BROWSERSTACK_USERNAME environment variables');
					return;
				}
				var environment = { browserName: 'chrome', version: 'latest' };
				return tunnel.localizeEnvironment(environment)
					.then(function (actual) {
						assert.isObject(actual);
						assert.notStrictEqual(actual.version, 'latest');
						assert.notStrictEqual(actual.version, 'previous');
					});
			},

			previous: function () {
				if (missingCredentials) {
					this.skip('missing credentials. Please provide BrowserStack credentials with the ' +
						'BROWSERSTACK_ACCESS_KEY and BROWSERSTACK_USERNAME environment variables');
					return;
				}
				var environment = { browserName: 'chrome', version: 'previous' };
				var latestEnvironment = { browserName: 'chrome', version: 'latest' };
				return Promise.all([
					tunnel.localizeEnvironment(latestEnvironment),
					tunnel.localizeEnvironment(environment)
				]).then(function (environments) {
					var latest = environments[0];
					var previous = environments[1];

					assert.isObject(previous);
					assert.notStrictEqual(previous.version, 'latest');
					assert.notStrictEqual(previous.version, 'previous');
					assert.notStrictEqual(previous.version, latest.version);
					assert.strictEqual(parseFloat(previous.version) + 1, parseFloat(latest.version));
				});
			}
		}
	});
});
