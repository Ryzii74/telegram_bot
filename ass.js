const prompt = require('prompt');
const association = require('./commands/ass');

prompt.start();

function getAssociation() {
    prompt.get(['word1', 'word2'], function (err, result) {
        if (err) return onErr(err);

        association(`${result.word1} ${result.word2}`, (data) => {
            console.log('Результат:');
            console.log(data.split('\n').join('\t'));
            getAssociation();
        });
    });
}

getAssociation();

function onErr(err) {
    console.log(err);
    return 1;
}