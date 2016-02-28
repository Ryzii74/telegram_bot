module.exports = function (params, callback, senderId) {
    if (senderId !== global.config.ownerId) return callback('Для вас недоступна данная команда!');
    var config = JSON.parse(JSON.stringify(global.config.game));
    callback(JSON.stringify(config))
};