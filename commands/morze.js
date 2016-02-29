module.exports = function (params, callback) {
    var letters = params.replace('—', '--').split(' ');

    var words = { ru : '', en : '' };
    letters.forEach(function (letter) {
        words.ru += symbols[letter] && symbols[letter].ru || '?';
        words.en += symbols[letter] && symbols[letter].en || '?';
    });

    callback(words.ru + ' ' + words.en);
};

var symbols = {
    '.----' : { ru : '1', en : '1' },
    '..---' : { ru : '2', en : '2' },
    '...--' : { ru : '3', en : '3' },
    '....-' : { ru : '4', en : '4' },
    '.....' : { ru : '5', en : '5' },
    '-....' : { ru : '6', en : '6' },
    '--...' : { ru : '7', en : '7' },
    '---..' : { ru : '8', en : '8' },
    '----.' : { ru : '9', en : '9' },
    '-----' : { ru : '0', en : '0' },
    '.-.-'  : { ru : 'я' },
    '.--'   : { ru : 'в', en : 'w' },
    '.--.'  : { ru : 'п', en : 'p' },
    '.---'  : { ru : 'й', en : 'j' },
    '-'     : { ru : 'т', en : 't' },
    '-.'    : { ru : 'н', en : 'n' },
    '-..'   : { ru : 'д', en : 'd' },
    '--'    : { ru : 'м', en : 'm' },
    '-.-'   : { ru : 'к', en : 'k' },
    '-.-.'  : { ru : 'ц', en : 'c' },
    '-...'  : { ru : 'б', en : 'b' },
    '-..-'  : { ru : 'ь', en : 'x' },
    '-.--'  : { ru : 'ы', en : 'y' },
    '--.'   : { ru : 'г', en : 'g' },
    '--..'  : { ru : 'з', en : 'z' },
    '--.-'  : { ru : 'щ', en : 'q' },
    '--.--' : { ru : 'ъ' },
    '---'   : { ru : 'о', en : 'o' },
    '---.'  : { ru : 'ч' },
    '----'  : { ru : 'ш' },
    '.-..'  : { ru : 'л', en : 'l' },
    '.-.'   : { ru : 'р', en : 'r' },
    '..--'  : { ru : 'ю' },
    '..-..' : { ru : 'э' },
    '..-.'  : { ru : 'ф', en : 'f' },
    '..-'   : { ru : 'у', en : 'u' },
    '...-'  : { ru : 'ж', en : 'v' },
    '....'  : { ru : 'х', en : 'h' },
    '...'   : { ru : 'с', en : 's' },
    '..'    : { ru : 'и', en : 'i' },
    '.'     : { ru : 'е', en : 'e' },
    '.-'    : { ru : 'а', en : 'a' }
};