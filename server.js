// INCLUDES

var http = require('http');
var fs = require('fs');
var path = require('path');
var SSH = require('simple-ssh');
var faye = require('faye');


// WEBSERVER (localhost/index.html)

var httpserver = http.createServer(function (request, response) {
  var filePath = 'www/' + request.url;
  if (filePath == 'www/') {
    filePath = 'www/index.html';
  }

  if (filePath == 'www/faye-browser-min.js.map') {
    filePath = 'faye-browser-min.js.map'	
  }

  var extname = path.extname(filePath);
  var contentType = 'text/html'
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
  }

  path.exists(filePath, function(exists) {
    if (exists) {
      fs.readFile(filePath, function(error, content) {
        if (error) {
          response.writeHead(500);
          response.end();
        } else {
          response.writeHead(200, {'Content-Type': contentType});
          response.end(content, 'utf-8');
        }
      });
    } else {
      response.writeHead(404);
      response.end();
    }
  });

})

httpserver.listen(80);

// FAYESERVER (sending stuff to clients)

var bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});
bayeux.attach(httpserver);

var sendFaye = function (mon) {
  bayeux.getClient().publish('/ssh', JSON.stringify(mon));
}

// SSH (talk to the ubus on a single node)

var rxSSH;

var mon = {
  hardware: {},
  system: {},
  adhoc: {},
  date: {}
}

var ssh = new SSH({
    host: '10.63.84.66',
    user: 'root',
    pass: 'fm1204'
});

ssh
  .exec("ubus -v call system board", {
    out: function(rxSSH) {
      try {
        mon.hardware = JSON.parse(rxSSH);
      } catch (e) {
        console.log('[ERR]---------- error parsing hardware data');
      }
      console.log(mon.hardware);
    }
  })

  .exec("ubus -v call system info", {
    out: function(rxSSH) {
      try {
        mon.system = JSON.parse(rxSSH);
      } catch (e) {
        console.log('[ERR]---------- error parsing system data');
      }
      console.log(mon.system);
    }
  })

  .exec("ubus -v call network.device status '{ \"name\": \"wlan0\" }'", {
    out: function(rxSSH) {
      try {
        mon.adhoc = JSON.parse(rxSSH);
      } catch (e) {
        console.log('[ERR]---------- error parsing adhoc data');
      }
      console.log(mon.adhoc);
    }
  })
.start();

ssh.on('end', function(){
  var now = new Date();
  mon.date = now;
  console.log('[SSH]---------- connection closed');
  bayeux.getClient().publish('/ssh', JSON.stringify(mon));
});
