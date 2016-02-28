var en = require('../libs/en');
module.exports = function (params, callback) {
    var text = en.getAllCodesLeft(callback);
    text && callback(text);
};