var en = require('../libs/en');
module.exports = function (params, callback) {
    callback(`${en.getLastLevelData('codesCount')}\n${en.getLastLevelData('bonusesCount')}`);
};