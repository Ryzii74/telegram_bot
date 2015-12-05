var utils = require('../utils');

module.exports = function (params, callback) {
    global.config.game.players.forEach(function (player) {
        utils.callMethod({
            method: 'sendMessage',
            form: {
                chat_id: player,
                text: params
            }
        });
    });
};