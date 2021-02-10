var request = require('request');

module.exports.get = get;
function get(word1, word2, callback) {
    getWord(word1, (err, word1Data) => {
        if (err || !word2) return callback(err, word1Data);

        getWord(word2, (err, word2Data) => {
            if (err) return callback(err);

            return getRepeats(word1Data, word2Data, callback);
        });
    });
}

function getWord(word, callback) {
    request.post('https://sociation.org/ajax/word_associations/', {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36',
            'Origin': 'https://sociation.org',
            'Referrer': 'ttps://sociation.org/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'cors',
            'X-Requested-With': 'XMLHttpRequest',
        },
        form : {
            word : word,
            max_count : 0
        },
    }, (err, response, data) => {
        if (err || !data) return callback(err || 'response error, no data');

        data = JSON.parse(data);
        if (data.error) return callback(data.error);

        if (!data.associations) return callback('no associations for word ' + word);
        return callback(null, data.associations.map(word => word.name).sort());
    });
}

function getRepeats(word1Data, word2Data, callback) {
    var result = [];
    word1Data.forEach(word => {
        if (word2Data.indexOf(word) !== -1) result.push(word);
    });

    callback(null, result);
}
