var utils = require('./utils');
var config = require('./config');

utils.callMethod({method : 'getMe'}, function (err, data) {
    utils.callMethod({method : 'setWebhook', form : {url : config.server_url + ':' + config.server_port + '/'}}, function (err, data) {
        console.log(data);
    })
});

var http = require('http');
function onRequest(request, responder) {
    var data = '';
    request.on('data', function(chunk){
        data += chunk.toString();
    });
    request.on('end', function () {
        console.log(request.url);
        console.log(data);
    });
}
http.createServer(onRequest).listen(config.server_port);

function standartRequest(request, responder) {
    responder.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    responder.write("Все правильно работает!");
    responder.end();
}
http.createServer(standartRequest).listen(81);

