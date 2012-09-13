# Miner

Miner digs local tunnels to share your localhost on the web.

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

```javascript
  var miner = require('miner');
  miner.localtunnel({
    port : 8080
  }, function(error, url, process) {
    process.kill();
  });
```

## Pagekite

```javascript
  var miner = require('miner');
  miner.pagekite({
    name : 'myname',
    port : 8080
  }, function(error, url, process) {
    process.kill();
  });
```
