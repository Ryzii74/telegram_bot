var request = require('request');
var cheerio = require('cheerio');
var config = require('../../config');

module.exports = function (data, callback) {
    request.post({
        url : config.game.url,
        form : data,
        headers : {
            cookie : config.game.cookie,
            "User-Agent" : config.game.userAgent,
            "Referer" : config.game.referer,
            "Host" : config.game.host
        }
    }, function (err, request, body) {
        var $ = cheerio.load(body);
        callback && callback($, body);
    });
};