global.WORDS = {};
global.WORDS_ARRAY = [];

module.exports = {
    init : function () {
        require('fs').readFile(require('path').resolve(__dirname, 'newwords.txt'), 'utf8', function (err, data) {
            if (err) return console.log(err);
            data.split('\r\n').forEach(function (el) {
                if (el.length === 0 || el.indexOf(' ') !== -1 || el.indexOf('-') !== -1) return;
                WORDS[el] = true;
                WORDS_ARRAY.push(el);
            });
            console.log('WORDS loaded');
        });
    },

    findWords : function (words) {
        var result = [];
        var max = words.length;
        while (words[0].start + words[0].length <= words[0].word.length) {
            var word = generateWord(words);
            if (findWord(word)) result.push(word);

            words[max - 1].start++;
            var next = true;
            for (var i = max - 1; i > 0 && next; i--) {
                next = false;
                if (words[i].start + words[i].length > words[i].word.length) {
                    next = true;
                    words[i - 1].start++;
                    words[i].start = 0;
                }
            }
        }

        return result;
    }
};

function generateWord(words) {
    return words.reduce(function (sum, el) {
        return sum + el.word.slice(el.start, el.start + el.length);
    }, '');
}

function findWord(word) {
    return WORDS.hasOwnProperty(word);
}