var en = require('../libs/en');
module.exports = function (params, callback) {
    var text = en.getCodesCount(callback);
    text && callback(text);
};