var mask = require('../libs/tasks/mask');
module.exports = function (params, callback) {
    if (params.length === 0) return callback('Неверные исходные данные!');
    callback(mask.exec(params));
};