module.exports = function (params, callback, senderId) {
    if (senderId !== global.config.ownerId) return callback('Для вас недоступна данная команда!');
    var result = global.config.chooseChat(params);
    if (result.success) {
        callback(`Готово! Id чата для игры - ${global.config.game.chat_id}`);
    } else {
        callback(result.error);
    }
};