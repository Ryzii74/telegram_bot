module.exports.getStartState = getStartState;
module.exports.getLevelState = getLevelState;

function getStartState($, body) {
    var state = {
        started : false,
        time : 30000,
        message : ''
    };

    var $timeError = $('#Panel_lblGameError');
    if ($timeError.length > 0) {
        state.message = $timeError.text();
        return state;
    }

    if ($('#txtLogin').length > 0) {
        return false;
    }

    if (body.indexOf('/simplelogin.aspx?') !== -1) {
        state.error = 'Не удалось залогиниться в движке!';
        return state;
    }


    var $timeToStart = $('#Panel_TimerHolder');
    if ($timeToStart.length > 0) {
        state.time = Number($timeToStart.text().match(/"StartCounter":([\d]+)/)[1]);
        state.message = 'Игра начнется через ' + getTimeString(state.time);
        return state;
    }

    state.started = true;
    state.message = 'Выполняйте задание!';
    return state;
}

function getLevelState($, body) {
    var levelState = {
        stopped : false
    };

    if ($('.aside').length === 0) return { stopped : true };

    var taskData = getTaskParts($, body);

    levelState.messages = $('.globalmess').text();
    levelState.name = $('.content h2').text().split(':')[1] || 'не указано';
    levelState.allCodes = $('h3:contains("сектор")').length && $('h3:contains("сектор")').next().text().replace(/\t/g, '').replace(/\r\n\r\n \r\n\r\n/g, '\r\n') || 'На уровне 1 сектор';
    levelState.isBlocked = $('.aside .blocked').length > 0;
    levelState.blockageInfo = $('.aside .blockageinfo').text().replace( /\s+$/g, '').replace( /^\s+/g, '').replace('\n', ' ') || '';
    levelState.levelId = $('.aside form input[name="LevelId"]').val();
    levelState.levelNumber = $('.aside form input[name="LevelNumber"]').val();
    levelState.time = ($('h3.timer').length > 0) ? Number($('h3.timer').text().match(/"StartCounter":([\d]+)/)[1]) : 99999999;
    levelState.task = taskData.task;
    levelState.hints = taskData.hints;
    levelState.timeMessage = $('h3.timer span').text() || "без автоперехода";
    levelState.codesCount = taskData.codesCount;
    levelState.codesLeft = taskData.codesLeft;
    levelState.bonuses = taskData.bonuses;

    return levelState;
}

function getTaskParts($, body) {
    var parts = body.split('<div class="spacer"></div>');
    var task = '';
    var hints = [];
    var bonuses = [];
    var codesCount = "На уровне 1 код";
    var codesLeft = "осталось закрыть 1";

    parts.forEach(function (part) {
        var header = part.match(/<h3>([\s\S\d]+)<\/h3>/);
        var bonusHeader = part.match(/<h3 class="color_bonus">([\s\S\d]+)<\/h3>/);
        var bonusCorrectHeader = part.match(/<h3 class="color_correct">([\s\S\d]+)<\/h3>/);
        var cursiv = part.match(/<span class="color_dis">([\s\S\d]+)<\/span>/);

        if (header && header[1] && header[1].indexOf('Задание') !== -1) {
            task = parseHtmlString(part, header);
        }

        if (header && header[1] && header[1].indexOf('Подсказка') !== -1) {
            hints.push({text : parseHtmlString(part, header)});
        }

        if (cursiv && cursiv[1] && cursiv[1].indexOf('Подсказка') !== -1) {
            hints.push({
                value : cursiv[1].match(/"StartCounter":([\d]+)/)[1],
                send : [],
                message : parseHtmlString(cursiv[1].match(/<span class="bold_off"[\s\S\d]+>([\s\S\d]+)<\/span>/)[1])
            });
        }

        if (header && header[1] && header[1].indexOf('сектор') !== -1) {
            codesCount = 'На уровне ' + header[1].match(/([\d]+)/)[1] + ' секторов';
            codesLeft = header[1].match(/>\(([\s\S\d]+)\)</) && header[1].match(/>\(([\s\S\d]+)\)</)[1] || 'Необходимо закрыть все';
        }

        if (bonusHeader && bonusHeader[1] && bonusHeader[1].indexOf('Бонус') !== -1) {
            var bonus = {
                completed : false,
                name : parseHtmlString(bonusHeader[1].split(':')[1]),
                task : parseHtmlString(part.replace(/<h3([\s\S\d]+)<\/h3>/, '')),
                reward : 0
            };
            bonuses.push(bonus);
        }


        if (bonusCorrectHeader && bonusCorrectHeader[1]) {
            var name = bonusCorrectHeader[1].split(':');
            name = name[1] || name[0];
            name = name.split('<span')[0];

            var bonus = {
                completed : true,
                name : parseHtmlString(name),
                task : parseHtmlString(part.replace(/<h3([\s\S\d]+)<\/h3>/, '')),
                reward : bonusCorrectHeader[1].match(/награда ([\d\s\S]+)\)</) && bonusCorrectHeader[1].match(/награда ([\d\s\S]+)\)</)[1] || 'нету'
            };
            bonuses.push(bonus);
        }
    });

    return {
        codesCount : codesCount,
        codesLeft : codesLeft,
        task : task,
        hints : hints,
        bonuses : bonuses
    };
}

function parseHtmlString(message, header) {
    return message.replace(header && header[0], '')
        .replace(/<br\/>/g, '\n')
        .replace(/<p>/g, '')
        .replace(/<div>/g, '')
        .replace(/<\/div>/g, '')
        .replace(/<\/html>/g, '')
        .replace(/<\/body>/g, '')
        .replace(/<\/p>/g, '')
        .replace( /<!--[\s\S\d]+-->/g, '')
        .replace( /\s+$/g, '')
        .replace( /^\s+/g, '');
}
function parseHtmlString(message, header) {
    if (!message) return '';
    return message.replace(header && header[0], '')
        .replace(/<br\/>/g, '\n')
        .replace(/<p>/g, '')
        .replace(/<div>/g, '')
        .replace(/<\/div>/g, '')
        .replace(/<\/html>/g, '')
        .replace(/<\/body>/g, '')
        .replace(/<\/p>/g, '')
        .replace( /<!--[\s\S\d]+-->/g, '')
        .replace( /\s+$/g, '')
        .replace( /^\s+/g, '');
}

function getTimeString(time) {
    var minutes = Math.floor(time / 60);
    var seconds = time - minutes * 60;

    return minutes + ' минут ' + seconds + ' секунд';
}