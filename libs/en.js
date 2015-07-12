var request = require('request');
var cheerio = require('cheerio');
var config = require('./../config');
var utils = require('./../utils');

module.exports.sendCode = sendCode;
module.exports.init = init;
module.exports.stop = stop;
module.exports.getTask = getTask;

var inited = false;
var game = {
    state : 'wait',
    stateMessage : 'Игра еще не началась!',
    levelId : 0,
    levelNumber : 0,
    task : 0,
    time : 0,
    hints : []
};

var requestInterval = null;
function init () {
    inited = true;
    enRequest(null, function () {
        utils.sendMessageToChat('Всем привет, я к Вашим услугам!');
    });

    requestInterval = setInterval(function () {
        enRequest(null);
    }, 5000);
}

function stop(callback) {
    inited = false;
    clearInterval(requestInterval);
    callback('Приятно было с Вами поиграть!');
}

function getTask(callback) {
    if (!inited) {
        return callback('Сначала надо стартовать игру!');
    }
    callback(game.task);
}

function sendCode (code, callback) {
    if (!inited) {
        return callback('Сначала надо стартовать игру!');
    }

    enRequest({
        LevelId : game.levelId,
        LevelNumber : game.LevelNumber,
        "LevelAction.Answer" : code
    }, function ($, body) {
        if ($('.aside #incorrect').length > 0) {
            return callback('Код не принят');
        }

        if ($('.aside .color_correct').length > 0) {
            return callback('Код принят');
        }

        if (game.state !== 'stop') {
            callback('Ошибка отправки кода');
        } else {
            callback('Игра окончена');
        }
    });
}

function enRequest (data, callback) {
    request.post({
        url : config.game.url,
        form : data,
        headers : {
            cookie : config.game.cookie,
            "User-Agent" : "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.132 Safari/537.36",
            "Referer" : config.game.referer
        }
    }, function (err, request, body) {
        var $ = cheerio.load(body);

        if (updateGameState($)) utils.sendMessageToChat(game.stateMessage);
        updateLevelState($, body);

        callback && callback($, body);
    });
}

function updateGameState($) {
    if (game.state !== 'wait') return false;

    var $timeError = $('#Panel_lblGameError');
    if ($timeError.length > 0) {
        game.stateMessage = $timeError.text();
        return true;
    }

    var $timeToStart = $('#Panel_TimerHolder');
    if ($timeToStart.length > 0) {
        var text = $timeToStart.text();
        var time = Number(text.match(/"StartCounter":([\d]+)/)[1]);
        var minutes = Math.floor(time / 60);
        var seconds = time - minutes * 60;

        game.stateMessage = 'Игра начнется через ' + minutes + 'минут ' + seconds + 'секунд';
        return true;
    }

    game.state = 'started';
    game.stateMessage = 'Игра уже стартовала';
    return false;
}

function updateLevelState($, body) {
    if ($('.aside').length === 0) {
        if (game.state !== 'stop') utils.sendMessageToChat('Такое ощущение, что игра кончилась');
        game.state = 'stop';
        return;
    }

    var levelId = $('.aside form input[name="LevelId"]').val();
    var levelChanged = levelId != game.levelId;

    var taskData = getTaskParts($, body);
    game.task = taskData.task;
    game.levelId = levelId;
    game.levelNumber = $('.aside form input[name="LevelNumber"]').val();

    var hints = taskData.hints;
    var newCount = hints.filter(function (item) { return item.text; }).length;
    var oldCount = game.hints.filter(function (item) { return item.text; }).length;
    var newHints = null;

    if (oldCount < newCount) newHints = oldCount;
    game.hints = hints;

    if (levelChanged) {
        var message = 'Задание ' + game.levelNumber;
        message += game.task;
        hints.forEach(function (item, index) {
            if (item.text) {
                message += 'Подсказка #' + (index + 1) + '. ' + item.text + '\n';
            } else {
                message += 'Подсказка #' + (index + 1) + ' через ' + item.time + '\n';
            }
        });
        return message && utils.sendMessageToChat(message);
    }

    if (newHints != null) {
        var message = '';
        for (var i = oldCount; i < game.hints.length; i++) {
            if (game.hints[i].text) {
                message += 'Подсказка №' + (i + 1) + '. ' + game.hints[i].text + '\n';
            }
        }
        message && utils.sendMessageToChat(message);
    }
}

function getHints($) {
    return [];
}

function getTaskParts($, body) {
    var parts = body.split('<div class="spacer"></div>');
    var task = '';
    var hints = [];
    parts.forEach(function (part) {
        var header = part.match(/<h3>([\s\S\d]+)<\/h3>/);
        var cursiv = part.match(/<span class="color_dis">([\s\S\d]+)<\/span>/);
        if (header && header[1].indexOf('Задание') !== -1) {
            task = part
                .replace(header[0], '')
                .replace(/<br\/>/g, '\n')
                .replace(/<p>/g, '')
                .replace(/<\/p>/g, '');
        }
        if (header && header[1].indexOf('Подсказка') !== -1) {
            hints.push({text : part
                .replace(header[0], '')
                .replace(/<br\/>/g, '\n')
                .replace(/<p>/g, '')
                .replace(/<\/p>/g, '')});
        }
        if (cursiv && cursiv[1].indexOf('Подсказка') !== -1) {
            hints.push({time : cursiv[1].match(/<span class="bold_off"[\s\S\d]+>([\s\S\d]+)<\/span>/)[1]});
        }
    });

    return {
        task : task,
        hints : hints
    };
}