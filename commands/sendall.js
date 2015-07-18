var utils = require('../utils');
var config = require('../config');

module.exports = function (params, callback) {
    config.game.players.forEach(function (player) {
        utils.callMethod({
            method: 'sendMessage',
            form: {
                chat_id: player,
                text: params
            }
        });
    });
};