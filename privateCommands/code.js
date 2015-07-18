var en = require('../libs/en');
module.exports = function (code, callback) {
    en.sendCode(code.split(' ')[0], function (text) {
        callback(text);
    });
};