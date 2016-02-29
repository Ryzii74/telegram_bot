module.exports = function (params, callback) {
    var text = '';

    text += '.    = e / e';
    text += '..   = и / i';
    text += '...  = с / s';
    text += '.... = х / h';
    text += '...- = ж / v';
    text += '..-  = у / u';
    text += '..-. = ф / f';
    text += '..-..= э';
    text += '..-- = ю';
    text += '.-.  = р / r';
    text += '.-.. = л / l';
    text += '.-.- = я';
    text += '.--  = в / w';
    text += '.--. = п / p';
    text += '.--- = й / j';
    text += '-    = т / t';
    text += '-.   = н / n';
    text += '-.-  = к / k';
    text += '-.-. = ц / c';
    text += '--   = м / m';
    text += '';
    text += '-..  = д / d';
    text += '-... = б / b';
    text += '-..- = ь / x';
    text += '-.-- = ы / y';
    text += '--.  = г / g';
    text += '--.. = з / z';
    text += '--.- = щ / q';
    text += '--.--= ъ';
    text += '---  = о / o';
    text += '---. = ч';
    text += '---- = ш';


    callback(text);
};