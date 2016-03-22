var associations = require('../libs/tasks/association');
module.exports = function (params, callback) {
    if (params.length === 0) return callback('Неверные исходные данные!');

    var words = params.split(' ');
    if (!words.length || !words[0]) return callback('Неверные исходные данные!')

    associations.get(words[0], words[1], (err, data) => {
        callback(err || data.join('\n') || 'Ассоциации не найдены');
    });
};