module.exports = function (params, callback, senderId) {
    var result = `Логин - ${global.config.choosedLogin}\n`;
    result += `Чат - ${global.config.choosedChat}\n`;
    result += `Игра - http://${global.config.game.host}/GameDetails.aspx?gid=${global.config.game.id}`;

    callback(result);
};