module.exports.exec = function (text) {
    var length = text.length - 0;
    text = text.replace(/\*/g, '');

    var letters = [];
    for (var i = 0; i < text.length; i++) {
        var letter = letters.filter(function (el) { return el.letter == text[i]; })[0];
        if (!letter) {
            letters.push({
                letter : text[i],
                count : 1,
                test : new RegExp(text[i], 'g')
            });
        } else {
            letter.count++;
        }
    }
    console.log(letters);

    var lettersLength = letters.length;
    return global.WORDS_ARRAY.filter(function (word) {
        if (word.length !== length) return false;
        for (var i = 0, max = lettersLength; i < max; i++) {
            var letter = letters[i];
            if ((word.match(letter.test) || []).length < letter.count) return false;
        }

        return true;
    }).join('\n') || "Слов не найдено";
};