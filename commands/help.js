module.exports = function (params, callback) {
    var text = '';

    text += 'task - задание';
    text += '\nhints - информация о подсказках';
    text += '\ntime - оставшееся время на уровень';
    text += '\nstarttime - время до начала игры';
    text += '\nbonus - бонусы на уровне';
    text += '\nfoundbonus - подсказки с уже введенных бонусных кодов';
    text += '\nc (rus/en), code, просто "/" - вбить код';
    text += '\ncodes - информация по кодам';
    text += '\nsectors - полный список секторов';
    text += '\nsectorsleft - список оставшихся секторов';
    text += '\nhelp - помощь по командам движка';
    text += '\nhelpsolve - помощь по вспомогательным командам';

    callback(text);
};