var en = require('../libs/en');
module.exports = function (params, callback) {
    en.getLastLevelData({ name : "bonusesTasks" }, callback);
};