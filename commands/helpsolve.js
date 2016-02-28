module.exports = function (params, callback) {
    var text = '';

    text += 'an / anagramma - анаграмма (* - любая буква)';
    text += '\nchlen - расчлененки ( слово кол-воБукв слово кол-воБукв)';
    text += '\nцезарь - шифр цезаря (фраза)';
    text += '\nmask - поиск по маске (? - одна буква, * - любое количество букв)';

    callback(text);
};