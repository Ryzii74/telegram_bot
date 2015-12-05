module.exports = function (params, callback, senderId) {
    if (senderId !== global.config.ownerId) return callback('Для вас недоступна данная команда!');
    global.config.game.id = params;
    callback(`Готово! Id игры - ${global.config.game.id}`);
};