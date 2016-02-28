module.exports = function (params, callback, senderId) {
    if (senderId !== global.config.ownerId) return callback('Для вас недоступна данная команда!');
    var result = global.config.chooseChat(params);
    if (result.success) {
        callback(`Готово! Логин для игры - ${params}`);
    } else {
        callback(result.error);
    }
};