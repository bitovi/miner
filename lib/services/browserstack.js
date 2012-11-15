// http://www.browserstack.com/local-testing#cmd-tunnel
// java -jar BrowserStackTunnel.jar <KEY> host1,port1,ssl_flag,host2,port2,ssl_flag...
// java -jar BrowserStackTunnel.jar CuCzN6aEMzLAei1izNLR localhost,3000,0

// http://www.browserstack.com/BrowserStackTunnel.jar
var spawn = require('child_process').spawn;
var winston = require('winston');
var fs = require('fs');

module.exports = function (config, callback) {
	var jarFile = __dirname + '/../../resources/BrowserStackTunnel.jar';
	var options = {
		host : config.host || 'localhost',
		port : config.port || 80,
		ssl : config.ssl || 0
	};
	var cb = function() {
		if(callback) {
			callback.apply(this, arguments);
			callback = null;
		}
	};
	var flags = [options.host, options.port, options.ssl].join(',');
	var browserstack = spawn(config.java || 'java', [ '-jar', jarFile, config.key, flags]);

	var buffer = '';
	var timeout = setTimeout(function() {
		browserstack.kill();
		cb(new Error('Process timed out'));
	}, config.timeout || 30000);

	browserstack.on('exit', function(code) {
		if(code !== 0) {
			cb(new Error('Process exited with ' + code + '\n'));
		}
	});

	browserstack.stdout.on('data', function(data) {
		buffer += data.toString();
		var matches = buffer.match(new RegExp('.*localhost:' + options.port + '.*'));
		if(matches !== null) {
			clearTimeout(timeout);
			cb(null, matches[0], browserstack);
		}
	});

	browserstack.stderr.on('data', function(data) {
		winston.error('BROWSERSTACK ERROR: ' + data.toString());
	});
}
