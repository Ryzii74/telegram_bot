var en = require('../libs/en');
module.exports = function (params, callback) {
    var text = en.getTime(callback);
    text && callback(text);
};