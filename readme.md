# Miner

Miner wraps localhost tunelling services to easily expose your Node server to the web.
The default service interface looks like this:

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

Currently supported services:

## Default tunnel


## Localtunnel

[Localtunnel](http://localtunnel.com) is a free localhost tunelling service. Ruby and the `gem` command need
to be in your path for it to work. If the Gem is not installed it will be installed automatically.
The following options are available:

* `ssh` - The location of your SSH public key (default: `~/.ssh/id_rsa.pub`)
* `port` - The port to share (default: `80`)
* `timeout` - The timeout (in *ms*) after which the process will be killed if
it hasn't reported back a valid URL (default: `30000`)
* `gem` - The Gem executable (default: `gem`)
* `executable` - The localtunnel executable (default: `localtunnel`)

```javascript
  var miner = require('miner');
  miner.localtunnel({
    port : 8080
  }, function(error, url, process) {
    process.kill();
  });
```

## Pagekite

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


## Showoff.io

