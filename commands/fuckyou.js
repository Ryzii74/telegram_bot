module.exports = function (params, callback, senderId) {
    if (senderId !== global.config.ownerId) return callback('Для вас недоступна данная команда!');

    callback('Сам дурак!');
    process.exit(0);
};