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
        if (err || response.statusCode != 200) {
            console.log('error in response ' + data.method);
            err && console.log(err);
            return body && console.log(body);
        }

        try {
            var json = JSON.parse(body);
            if (!json || !json.ok) return;

            callback && callback(err, json);
        } catch (e) {
            console.log('bad callMethod answer');
            console.log(body);
        }
    });
};