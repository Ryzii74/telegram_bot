module.exports = function (params, callback, senderId) {
    if (senderId !== global.config.ownerId) return callback('Для вас недоступна данная команда!');
    var result = '';
    result += `Логин - ${global.config.choosedLogin}`;
    result += `Чат - ${global.config.choosedChat}`;
    result += `Id игры - ${global.config.game.id}`;
    result += `Host игры - ${global.config.game.host}`;

    callback(result);
};