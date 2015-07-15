var en = require('../libs/en');
module.exports = function (params, callback) {
    var text = en.getHints(callback);
    text && callback(text);
};