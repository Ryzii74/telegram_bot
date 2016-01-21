var anagramma = require('../libs/tasks/anagramma');
module.exports = function (params, callback) {
    if (params.length === 0) return callback('Неверные исходные данные!');
    callback(anagramma.exec(params));
};