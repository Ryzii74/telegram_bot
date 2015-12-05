module.exports = function (params, callback, senderId) {
    if (senderId !== global.config.ownerId) return callback('Для вас недоступна данная команда!');
    global.config.game.auth.Password = params;
    callback(`Готово! Пароль для входа в игру - ${global.config.game.auth.Password}`);
};