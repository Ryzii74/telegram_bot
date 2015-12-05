module.exports = function (params, callback, senderId) {
    if (senderId !== global.config.ownerId) return callback('Для вас недоступна данная команда!');
    global.config.game.host = params;
    callback(`Готово! Домен игры - ${global.config.game.host}`);
};