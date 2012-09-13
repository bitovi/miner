var test = require('./lib/services/pagekite');

test({ name : 'daff' }, function(err, url, process) {
	console.log('Pagekite started, go to ' + url);
	setTimeout(function() {
		console.log('killing process');
		process.kill();
	}, 10000);
});
