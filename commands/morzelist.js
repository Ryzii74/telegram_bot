module.exports = function (params, callback) {
    var text = '';

    text += '.    = e / e';
    text += '\n..   = и / i';
    text += '\n...  = с / s';
    text += '\n.... = х / h';
    text += '\n...- = ж / v';
    text += '\n..-  = у / u';
    text += '\n..-. = ф / f';
    text += '\n..-..= э';
    text += '\n..-- = ю';
    text += '\n.-.  = р / r';
    text += '\n.-.. = л / l';
    text += '\n.-.- = я';
    text += '\n.--  = в / w';
    text += '\n.--. = п / p';
    text += '\n.--- = й / j';
    text += '\n-    = т / t';
    text += '\n-.   = н / n';
    text += '\n-..  = д / d';
    text += '\n-... = б / b';
    text += '\n-..- = ь / x';
    text += '\n-.-  = к / k';
    text += '\n-.-. = ц / c';
    text += '\n-.-- = ы / y';
    text += '\n--   = м / m';
    text += '\n--.  = г / g';
    text += '\n--.. = з / z';
    text += '\n--.- = щ / q';
    text += '\n--.--= ъ';
    text += '\n---  = о / o';
    text += '\n---. = ч';
    text += '\n---- = ш';

    text += '\n';

    text += '\n.---- = 1';
    text += '\n..--- = 2';
    text += '\n...-- = 3';
    text += '\n....- = 4';
    text += '\n..... = 5';
    text += '\n-.... = 6';
    text += '\n--... = 7';
    text += '\n---.. = 8';
    text += '\n----. = 9';
    text += '\n----- = 0';


    callback(text);
};