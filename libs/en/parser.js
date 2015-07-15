module.exports.getStartState = getStartState;
module.exports.getLevelState = getLevelState;

function getStartState($) {
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

    levelState.levelId = $('.aside form input[name="LevelId"]').val();
    levelState.levelNumber = $('.aside form input[name="LevelNumber"]').val();
    levelState.time = Number($('h3.timer').text().match(/"StartCounter":([\d]+)/)[1]);
    levelState.task = taskData.task;
    levelState.hints = taskData.hints;
    levelState.timeMessage = $('h3.timer span').text();

    return levelState;
}

function getTaskParts($, body) {
    var parts = body.split('<div class="spacer"></div>');
    var task = '';
    var hints = [];

    parts.forEach(function (part) {
        var header = part.match(/<h3>([\s\S\d]+)<\/h3>/);
        var cursiv = part.match(/<span class="color_dis">([\s\S\d]+)<\/span>/);

        if (header && header[1].indexOf('Задание') !== -1) {
            task = parseHtmlString(part, header);
        }

        if (header && header[1].indexOf('Подсказка') !== -1) {
            hints.push({text : parseHtmlString(part, header)});
        }

        if (cursiv && cursiv[1].indexOf('Подсказка') !== -1) {
            hints.push({time : parseHtmlString(cursiv[1].match(/<span class="bold_off"[\s\S\d]+>([\s\S\d]+)<\/span>/)[1])});
        }
    });

    return {
        task : task,
        hints : hints
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