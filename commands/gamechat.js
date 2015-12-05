module.exports = function (params, callback, senderId) {
    if (senderId !== global.config.ownerId) return callback('Для вас недоступна данная команда!');
    global.config.game.chat_id = params;
    callback(`Готово! Id чата для игры - ${global.config.game.chat_id}`);
};