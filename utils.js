var config = require('./config');
var request = require('request');

module.exports.callMethod  = function (data, callback) {
    request({url : config.bot_url + data.method, form : data.form || {}}, function (err, response, body) {
        var json = JSON.parse(body);
        if (err || response.statusCode != 200 || !json || !json.ok) {
            console.log('error in response ' + data.method);
            err && console.log(err);
            json && console.log(json);
        }

        callback(err, json);
    });
};