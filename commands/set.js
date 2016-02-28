module.exports = function (params, callback, senderId) {
    if (senderId !== global.config.ownerId) return callback('Для вас недоступна данная команда!');
    var [command, value] = params.split(' ');
    var result = global.config.methods[command](value);

    if (result.success) {
        callback('Выполнено!');
    } else {
        callback(result.error);
    }
};