var request = require('request');
var offset;

module.exports.init = function (callback) {
    offset = 0;
    getMe(function () {
        getUpdates(callback);
    });
};

module.exports.sendMessage = function (params) {
    if (!params.text) return;

    params.chat_id = params.chat_id || global.config.game.chat_id;
    callMethod({
        method: 'sendMessage',
        form: params
    });
};

module.exports.getMe = getMe;
function getMe (callback) {
    callMethod({method : 'getMe'}, callback);
}

module.exports.forwardMessage = function (params, callback) {
    params.chat_id = params.chat_id || global.config.game.chat_id;
    callMethod({
        method: 'forwardMessage',
        form: params
    }, callback);
};

module.exports.getUpdates = getUpdates;
function getUpdates (callback) {
      callMethod({
          method : 'getUpdates',
          form : {
              offset : offset,
              timeout : 100
          }
      }, function (err, data) {
          if (err || !data.ok) {
              err && console.log('telegram request error', err);
              data && console.log('telegram request data', data);
              return;
          }

          data.result.forEach(function (message) {
              offset = message.update_id + 1;
          });

          callback(null, data.result);
          getUpdates(callback);
      });
}

var counter = 0;
function callMethod (data, callback) {
    request({url : global.config.bot.url + data.method, form : data.form || {}}, function (err, response, body) {
        counter++;
        if (err || response.statusCode != 200) {
            console.log(new Date(), 'error in response ' + data.method);
            if (err) {
                console.log(err);
            } else {
                console.log(body);
            }

            try {
                if (body) {
                    body = JSON.parse(body);
                    if (!body.ok && body.error_code === 400) return;
                }
            } catch (e) {}

            if (counter < 500) setTimeout(function () {
                callMethod(data, callback);
            }, 5000);
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
}