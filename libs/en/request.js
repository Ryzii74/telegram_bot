var request = require('request');
var cheerio = require('cheerio');

module.exports = function (data, cookies, callback) {
    var url = global.config.system.url.start + global.config.game.host + global.config.system.url.end;
    request.post({
        url : url + global.config.game.id,
        form : data,
        headers : {
            cookie : cookies,
            "User-Agent" : global.config.system.userAgent,
            "Referer" : url + global.config.game.id,
            "Host" : global.config.game.host
        }
    }, function (err, request, body) {
        if (err || !body) return callback(err || 'no_body');

        var $ = cheerio.load(body);
        callback && callback(null, $, body);
    });
};