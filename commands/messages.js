var en = require('../libs/en');
module.exports = function (params, callback) {
    var text = en.getMessages();
    text && callback(text);
};