var en = require('../libs/en');
module.exports = function (params, callback) {
    var text = en.getTask(callback);
    text && callback(text);
};