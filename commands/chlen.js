var chlen = require('../libs/tasks/chlen');
module.exports = function (params, callback) {
    var words = [];
    var data = params.split(' ');
    if (data.length % 2 === 1 || data.length === 0) return callback('Неверные исходные данные!');

    for (var i = 0; i < data.length; i+=2) {
        words.push({
            word : data[i].toLowerCase(),
            length : Number(data[i + 1]),
            start : 0
        });
    }
    var text = chlen.findWords(words);
    text && callback(text.join(' ') || "Ни одного слова не найдено!");
};