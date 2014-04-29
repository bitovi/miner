# Miner

[![Build Status](https://travis-ci.org/daffl/miner.png?branch=master)](https://travis-ci.org/daffl/miner)

Miner wraps localhost tunelling services to easily expose your Node server to the web. As always installation is as easy as

> npm install miner

The Miner service interface looks like this:

```javascript
  var miner = require('miner');
  miner.<servicename>(configuration, function(error, url, process) {
    error // -> An Error instance on errors
    url // -> The tunnel URL
    process // -> The ChildProcess object if applicable
  });
```

See the [ChildProcess documentation](http://nodejs.org/api/child_process.html#child_process_class_childprocess)
for more information about the `process` object.

## Quick Start

Lets create the basic NodeJS HTTP server example and make it available to the web via
[Localtunnel](http://progrium.com/localtunnel/):

    var http = require('http');
    var miner = require('miner');
    var port = 1337;

    http.createServer(function (req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Hello World\n');
    }).listen(port, '127.0.0.1');
    console.log('Server running at http://127.0.0.1:1337/');

    miner.localtunnel({
      port: port
    }, function(error, url, process) {
      if(error) {
        console.log('ERROR', error);
        return;
      }
      console.log('Your server is now available to the world at:');
      console.log(url);
    });

Just visit the url to see the server output.

## Tunneling services

### Default tunnel

The default tunnel is a dummy tunelling service that returns the URL for a given hostname and port. That way you
can use the miner interface even when just connecting to a local server.

* `port` - The port to share (default: none `80`)
* `hostname` - The hostname to use (default: `localhost`)
* `useOsHostname` - Use the system hostname if set to `true` and `hostname` is not set

```javascript
  var miner = require('miner');
  miner.local({
    port : 8080
  }, function(error, url) {
    url // -> http://localhost:8080
  });
```

### Localtunnel

[Localtunnel](http://localtunnel.me) allows you to easily share a web service on your local development machine without messing with DNS and firewall settings. The following options are available:

* `subdomain` A *string* value requesting a specific subdomain on the proxy server. **Note** You may not actually receive this name depending on availablily.
* `local_host` Proxy to this hostname instead of `localhost`. This will also cause the `Host` header to be re-written to this value in proxied requests.

```javascript
  var miner = require('miner');
  miner.localtunnel({
    port : 8080
  }, function(error, url, tunnel) {
    tunnel.close();
  });
```

The `tunnel` instance returned to your callback emits the following events

|event|args|description|
|----|----|----|
|error|err|fires when an error happens on the tunnel|
|close||fires when the tunnel has closed|

The `tunnel instance has the following methods

|method|args|description|
|----|----|----|
|close||close the tunnel|


### Pagekite

[Pagekite](https://pagekite.net/) is a reliable way to make localhost part of the Web.
Sign up for the free one month trial [here](https://pagekite.net/signup/).
To use the wrapper Pagekite needs to be installed and initialized with your user information.
After that it can be initializedwith these optiosn:

* `name` - Your pagekite username
* `domain` - Your pagekite domain (default: `.pagekite.me`)
* `port` - The port to share (default: `80`)
* `timeout` - The timeout (in *ms*) after which the process will be killed if
it hasn't reported back a valid URL (default: `30000`)
* `executable` - The pagekite executable (default: `pagekite.py`)

```javascript
  var miner = require('miner');
  miner.pagekite({
    name : 'myname',
    port : 8080
  }, function(error, url, process) {
    process.kill();
  });
```


### Browserstack

[BrowserStack](http://browserstack.com) is a cross browser testing tool. With their API it also provides
[command line tunneling](http://www.browserstack.com/local-testing#cmd-tunnel).
You need a Browserstack account with API access and have to provide your
[private key](http://www.browserstack.com/local-testing#cmd-tunnel) to the miner service. Unlike other
services it will not provide a publicly acessible URL but the given URL will be accessible on your BrowserStack
 instances.

* `key` - Your browserstack command line tunnel key
* `host` - The hostname to share another internal server (default: `localhost`)
* `port` - The port to share (default: `80`)
* `timeout` - The timeout (in *ms*) after which the process will be killed if
* `ssl` - The optional SSL port (default: `0`)
it hasn't reported back a valid URL (default: `30000`)
* `java` - The java executable (default: `java`)

```javascript
  var miner = require('miner');
  miner.browserstack({
    port : 8080,
    key: '<your API key>'
  }, function(error, url, process) {
    process.kill();
  });
```

## Changelog

__0.1.0__

- Initial release
