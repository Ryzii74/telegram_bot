var textError = 'ни одного не помню, простите(';

module.exports = function (params, callback) {
    require('request').get({
        url : 'http://www.anekdots.com/ajax-rand-doc/?prev=442007&sectiontype=13701&prev=1734707',
        headers : {
            Host : "www.anekdots.com",
            Referer : "http://www.anekdots.com/%D0%A1%D0%BB%D1%83%D1%87%D0%B0%D0%B9%D0%BD%D1%8B%D0%B9_%D0%B0%D0%BD%D0%B5%D0%BA%D0%B4%D0%BE%D1%82/"
        }
    }, function (err, response, body) {
        if (err || !body) return callback(textError);

        body = body.replace('\n');
        var $ = require('cheerio').load(body);
        callback($('.marg10').text() || textError);
    });
};