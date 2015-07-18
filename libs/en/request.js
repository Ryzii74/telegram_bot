var request = require('request');
var cheerio = require('cheerio');
var config = require('../../config');

module.exports = function (data, callback) {
    request.post({
        url : config.game.url,
        form : data,
        headers : {
            cookie : config.game.cookie,
            "User-Agent" : "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.134 Safari/537.36",
            "Referer" : config.game.referer,
            "Host" : config.game.host
        }
    }, function (err, request, body) {
        var $ = cheerio.load(body);
        callback && callback($, body);
    });
};