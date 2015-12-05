module.exports = function (params, callback, senderId, chatId) {
    if (senderId !== global.config.ownerId) return callback('Для вас недоступна данная команда!');
    global.config.game.chat_id = chatId;
    callback(`Готово! Id чата игры - ${global.config.game.chat_id}`);
};