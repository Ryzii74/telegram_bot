module.exports = function (params, callback, senderId) {
    if (senderId !== global.config.ownerId) return callback('Для вас недоступна данная команда!');
    var result = '';
    result += `Логин - ${global.config.choosedLogin}\n`;
    result += `Чат - ${global.config.choosedChat}\n`;
    result += `Игра - http://${global.config.game.host}/GameDetails.aspx?gid=${global.config.game.id}`;

    callback(result);
};