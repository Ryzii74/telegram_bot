var request = require('request');
var cheerio = require('cheerio');
var config = require('../../config');

module.exports = function (data, cookies, callback) {
    var url = config.system.url.start + config.game.host + config.system.url.end;
    request.post({
        url : url + config.game.id,
        form : data,
        headers : {
            cookie : cookies,
            "User-Agent" : config.system.userAgent,
            "Referer" : url + config.game.id,
            "Host" : config.game.host
        }
    }, function (err, request, body) {
        var $ = cheerio.load(body);
        callback && callback($, body);
    });
};