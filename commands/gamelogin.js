module.exports = function (params, callback, senderId) {
    if (senderId !== global.config.ownerId) return callback('Для вас недоступна данная команда!');
    if (!global.config.logins.hasOwnProperty(params)) return callback('Плохой выбор для регистрации, чувак!');
    global.config.game.auth.login = global.config.logins[params].login;
    global.config.game.auth.password = global.config.logins[params].password;
    callback(`Готово! Логин для входа в игру - ${params}`);
};