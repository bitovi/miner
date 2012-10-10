var expect = require('expect.js');
var miner = require('../lib/miner.js');
var http = require('http');

var response = 'Echo!\n';
var port = 1337;
// var server = require('child_process').fork('./test/server');

describe('Local', function () {
	it('Creates a default URL', function (done) {
		miner.local({}, function (err, url) {
			expect(url).to.be('http://localhost');
			done();
		});
	});

	it('Uses custom port and reaches host', function (done) {
		miner.local({ port : port }, function (err, url) {
			expect(url).to.be('http://localhost:' + port);
//			http.request('http://localhost', function(data) {
//				console.log(data);
//				done();
//			});
			done();
		});
	});

	it.skip('Uses custom hostname and port', function () {

	});

	it.skip('Uses OS hostname', function () {

	});
});

describe('Localtunnel', function() {
	it.skip('Opens localtunnel, returns URL', function() {
		miner.localtunnel({
			port : 8080
		}, function(error, url, process) {
			console.log(arguments);
			expect(url).to.contain('localtunnel.com');
			expect(error).to.be(null);
			process.kill();
			done();
		});
	});
});

describe('Pagekite', function() {
	it('Opens pagekite, returns URL', function(done) {
		miner.pagekite({
			name : 'daff',
			port : 8080
		}, function(error, url, process) {
			expect(error).to.be(null);
			expect(url).to.contain('pagekite.me');
			process.kill();
			done();
		});
	});
});

//describe('Showoff.io')
