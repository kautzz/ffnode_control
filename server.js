// INCLUDES

var http = require('http');
var fs = require('fs');
var path = require('path');
var SSH = require('simple-ssh');
var faye = require('faye');


// WEBSERVER

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

// FAYESERVER

var bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});
bayeux.attach(httpserver);

// SSH

var rxSSH;
var ssh = new SSH({
    host: '10.63.84.66',
    user: 'root',
    pass: 'admin'
});

ssh.exec('ubus -v call system board', {
  out: function(stdout) {
    rxSSH = stdout;
    console.log(rxSSH);
    bayeux.getClient().publish('/ssh', rxSSH);
  }
}).start();

