var en = require('../libs/en');
module.exports = function (params, callback) {
    var text = en.getBonusesTasks(callback);
    text && callback(text);
};