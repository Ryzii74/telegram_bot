var en = require('../libs/en');
module.exports = function (code, callback) {
    en.sendCode(code, function (text) {
        callback(text);
    });
};