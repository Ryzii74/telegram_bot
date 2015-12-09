module.exports.exec = function (text) {
    var result = '';
    var firstSymbol = 'а'.charCodeAt(0);
    var lastSymbol = 'я'.charCodeAt(0);
    for (var i = 1; i <= 32; i++) {
        var newWord = [];
        for (var j = 0; j < text.length; j++) {
            var symbolCode = text.charCodeAt(j) + i;
            if (symbolCode > lastSymbol) symbolCode = symbolCode % lastSymbol + firstSymbol - 1;
            newWord.push(String.fromCharCode(symbolCode));
        }
        result += newWord.join('') + '\n';
    }

    return result;
};