import SeleniumTunnel from 'src/SeleniumTunnel';
import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';

registerSuite({
	name: 'unit/SeleniumTunnel',

	config: {
		'name only': function() {
			const tunnel = new SeleniumTunnel({ drivers: ['chrome'] });
			assert.isFalse(tunnel.isDownloaded);
		},

		'config object': function() {
			const tunnel = new SeleniumTunnel({
				drivers: [
					{ executable: 'README.md', url: '', seleniumProperty: '' }
				]
			});
			Object.defineProperty(tunnel, 'artifact', { value: '.' });
			Object.defineProperty(tunnel, 'directory', { value: '.' });
			assert.isTrue(tunnel.isDownloaded);
		},

		'invalid name': function() {
			assert.throws(function() {
				const tunnel = new SeleniumTunnel({ drivers: <any>['foo'] });
				Object.defineProperty(tunnel, 'artifact', { value: '.' });
				Object.defineProperty(tunnel, 'directory', { value: '.' });
				tunnel.isDownloaded;
			}, /Invalid driver/);
		},

		'config object with invalid name': function() {
			assert.throws(function() {
				const tunnel = new SeleniumTunnel({
					drivers: [{ name: 'foo' }]
				});
				Object.defineProperty(tunnel, 'artifact', { value: '.' });
				Object.defineProperty(tunnel, 'directory', { value: '.' });
				tunnel.isDownloaded;
			}, /Invalid driver/);
		},

		'debug args': (function() {
			function createTest(version: string, hasDebugArg: boolean) {
				return function() {
					const tunnel = new SeleniumTunnel({
						version,
						verbose: true
					});
					console.log = () => {};
					const args = tunnel['_makeArgs']();
					console.log = oldLog;
					const indexOfDebug = args.indexOf('-debug');
					assert.notEqual(
						indexOfDebug,
						-1,
						'expected -debug arg to be present'
					);
					if (hasDebugArg) {
						assert.equal(
							args[indexOfDebug + 1],
							'true',
							"-debug should have 'true' value"
						);
					} else {
						assert.notEqual(
							args[indexOfDebug + 1],
							'true',
							"-debug should not have 'true' value"
						);
					}
				};
			}

			let oldLog = console.log;

			return {
				afterEach() {
					console.log = oldLog;
				},
				'3.0.0': createTest('3.0.0', false),
				'3.0.1': createTest('3.0.1', false),
				'3.1.0': createTest('3.1.0', true),
				'3.2.0': createTest('3.2.2', true),
				'3.3.0': createTest('3.3.0', true),
				'3.4.0': createTest('3.4.0', true),
				'3.4.9': createTest('3.4.9', true),
				'3.5.0': createTest('3.5.0', false)
			};
		})()
	}
});
