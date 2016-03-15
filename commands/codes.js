var en = require('../libs/en');
module.exports = function (params, callback) {
    callback(`${en.getLastLevelData({ name : 'codesCount' })}\n${en.getLastLevelData({ name : 'bonusesCount' })}`);
};