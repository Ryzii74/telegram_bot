var caesar = require('../libs/tasks/caesar');
module.exports = function (params, callback) {
    if (params.length === 0) return callback('Неверные исходные данные!');
    callback(caesar.exec(params));
};