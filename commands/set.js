module.exports = function (params, callback, senderId) {
    if (senderId !== global.config.ownerId) return callback('Для вас недоступна данная команда!');

    var data = params.split(' ');
    var command = data[0];
    var value = data[1];
    if (!command || !value) return callback("Ошибка ввода данных");

    var result = global.config.methods[command](value);

    if (result.success) {
        callback('Выполнено!');
    } else {
        callback(result.error);
    }
};