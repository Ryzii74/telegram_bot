var request = require('request');

module.exports.callMethod  = callMethod;
module.exports.sendMessageToChat = function (message) {
    callMethod({
        method : 'sendMessage',
        form : {
            chat_id : global.config.game.chat_id,
            text : message
        }
    });
};

var counter = 0;
function callMethod (data, callback) {
    request({url : global.config.bot.url + data.method, form : data.form || {}}, function (err, response, body) {
        counter++;
        if (err || response.statusCode != 200) {
            console.log('error in response ' + data.method);
            err && console.log(err);

            if (counter < 10) setTimeout(function () {
                callMethod(data, callback);
            }, 3000);
            return;
        }

        counter = 0;

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