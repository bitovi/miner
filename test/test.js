var expect = require('expect.js');
var miner = require('../lib/miner.js');
var connect = require('connect');
var request = require('request');
var os = require('os');

describe("Miner test suite", function() {
	var isTravis = process.env['TRAVIS'] === 'true';
	var responseContent = 'Echo!\n';
	var port = 1337;
	var server;

	before(function(done) {
		server = connect().use(function (req, res) {
			res.writeHead(200, { 'Content-Type': 'text/plain' });
			res.end(responseContent);
		}).listen(port).on('listening', done);
	});

	after(function(done) {
		server.close(done);
	});

	describe('Default', function () {
		it('Creates a default URL', function (done) {
			miner.local({}, function (err, url) {
				expect(url).to.be('http://localhost');
				done();
			});
		});

		it('Uses custom port and reaches host', function (done) {
			miner.local({ port : port }, function (error, url) {
				expect(error).to.be.null;
				expect(url).to.be('http://localhost:' + port);
				request(url, function (error, response, body) {
					expect(error).to.be.null;
					expect(body).to.be(responseContent);
					done();
				});
			});
		});

		it('Uses OS hostname', function (done) {
			miner.local({
				port : port,
				useOsHostname: true
			}, function (error, url) {
				expect(error).to.be.null;
				expect(url).to.be('http://' + os.hostname() + ':' + port);

				// Travis won't let us access os.hostname(), only localhost
				if(isTravis) {
					return done();
				}

				request(url, function (error, response, body) {
					expect(error).to.be.null;
					expect(body).to.be(responseContent);
					done();
				});
			});
		});
	});

	describe('Localtunnel', function() {
		// Localtunnel is currently offline
		it.skip('Opens localtunnel, returns URL', function(done) {
			miner.localtunnel({
				port: port
			}, function(error, url, process) {
				expect(error).to.be.null;
				expect(url).to.contain('localtunnel.com');
				request(url, function (error, response, body) {
					expect(error).to.be.null;
					expect(body).to.equal(responseContent);
					process.kill();
					done();
				});
			});
		});
	});

	describe('Browserstack', function() {
		it.skip('Starts Browserstack tunnel with key and makes request to local server', function() {

		});
	});

	if(!isTravis) {
		// TODO figure out how to set up Pagekite in Travis
		describe('Pagekite', function() {
			it('Opens pagekite, returns URL', function(done) {
				miner.pagekite({
					name: 'miner',
					port: port
				}, function(error, url, process) {
					expect(error).to.be.null;
					expect(url).to.contain('pagekite.me');
					request(url, function (error, response, body) {
						expect(error).to.be.null;
						expect(body).to.equal(responseContent);
						process.kill();
						done();
					});
				});
			});
		});
	}
});
