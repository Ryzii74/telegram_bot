var config = require('./config');
var request = require('request');

module.exports.callMethod  = callMethod;
module.exports.sendMessageToChat = function (message) {
    callMethod({
        method : 'sendMessage',
        form : {
            chat_id : config.game.chat_id,
            text : message
        }
    });
};

function callMethod (data, callback) {
    request({url : config.bot.url + data.method, form : data.form || {}}, function (err, response, body) {
        var json = JSON.parse(body);
        if (err || response.statusCode != 200 || !json || !json.ok) {
            console.log('error in response ' + data.method);
            err && console.log(err);
            json && console.log(json);
        }

        callback && callback(err, json);
    });
};