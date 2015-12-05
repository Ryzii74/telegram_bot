var utils = require('../utils');

module.exports = function (params, callback) {
    var words = params.split(' ');
    if (words.length < 2) return callback('Неверно заданы аргументы!');

    global.config.game.players.forEach(function (player) {
        utils.callMethod({
            method: 'sendMessage',
            form: {
                chat_id: global.config.playersList[words[0]] || words[0],
                text: words.splice(1).join(' ')
            }
        });
    });
};