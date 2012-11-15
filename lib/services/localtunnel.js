var spawn = require('child_process').spawn;
var winston = require('winston');
var getEnv = function(addEnv) {
	var result = {};
	Object.keys(process.env).forEach(function(key) {
		result[key] = process.env[key];
	});
	Object.keys(addEnv || {}).forEach(function(key) {
		result[key] = addEnv[key];
	});
	return result;
};

// http://progrium.com/localtunnel/
module.exports = function(config, callback) {
	var createProcess = function(runInstaller) {
		var buffer = '';
		var errors = '';
		var cb = function() {
			if(callback) {
				callback.apply(this, arguments);
				callback = null;
			}
		};
		var args = [ '-k', config.ssh || '~/.ssh/id_rsa.pub', config.port || 80 ];
		// Load rubyopt.rb to set STDOUT.sync = true to disable annoying Ruby output buffering
		var localtunnel = spawn(config.executable || 'localtunnel', args, {
			env : getEnv({
				RUBYOPT : '-r ' + __dirname + '/../../resources/rubyopt.rb'
			})
		});
		var timeout = setTimeout(function() {
			localtunnel.kill('SIGHUP');
			cb(new Error('Process timed out'));
		}, config.timeout || 30000);

		var stdoutListener = function(data) {
			// winston.debug('LOCALTUNNEL: ' + data.toString());
			buffer += data.toString();
			var matches = buffer.match(/http:\/\/(.*)\.localtunnel\.com/);
			if(matches !== null) {
				clearTimeout(timeout);
				localtunnel.stdout.removeListener('data', stdoutListener);
				return cb(null, matches[0], localtunnel);
			}
		};

		winston.debug('Started localtunnel', {
			args : args,
			pid : localtunnel.pid
		});

		if(config.pipe) {
			localtunnel.stdout.pipe(process.stdout, { end : false });
		}

		localtunnel.on('exit', function(code) {
			if( code === 127 && runInstaller) {
				winston.debug('Localtunnel not found. Running: gem install localtunnel');
				var installer = spawn(config.gem || 'gem', [ 'install', 'localtunnel' ]);
				installer.on('exit', function(code) {
					if(code !== 0) {
						return cb(new Error('Localtunnel installer exited with ' + code))
					}
					createProcess(false);
				});
			} else if(code !== 0) {
				cb(new Error('Localtunnel process exited with ' + code + '\n' + errors));
			}
		});

		localtunnel.stdout.on('data', stdoutListener);

		localtunnel.stderr.on('data', function(data) {
			winston.error('LOCALTUNNEL ERROR: ' + data.toString());
			errors += data.toString();
		});
	}
	createProcess(true);
}