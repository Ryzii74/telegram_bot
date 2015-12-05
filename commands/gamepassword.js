module.exports = function (params, callback, senderId) {
    if (senderId !== global.config.ownerId) return callback('Для вас недоступна данная команда!');
    global.config.game.auth.Login = params;
    callback(`Готово! Логин для входа в игру - ${global.config.game.auth.Login}`);
};