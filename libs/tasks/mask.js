module.exports.exec = function (text) {
    var reg = new RegExp(text.replace('*', '\\S*').replace('?', '\\S'), 'gi');

    return global.WORDS_ARRAY.filter(function (word) {
        return reg.exec(word);
    }).join('\n') || "Слов не найдено";
};