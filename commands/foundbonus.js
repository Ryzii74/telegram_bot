var en = require('../libs/en');
module.exports = function (params, callback) {
    var text = en.getBonusesHints(callback);
    text && callback(text);
};