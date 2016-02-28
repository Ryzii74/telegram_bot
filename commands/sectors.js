var en = require('../libs/en');
module.exports = function (params, callback) {
    var text = en.getAllCodes(callback);
    text && callback(text);
};