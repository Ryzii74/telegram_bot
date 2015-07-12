var request = require('request');
var cheerio = require('cheerio');
var config = require('./config');
var utils = require('./utils');

module.exports.sendCode = sendCode;
module.exports.init = init;

var game = {
    state : 'wait',
    stateMessage : 'Игра еще не началась!',
    levelId : 0,
    levelNumber : 0,
    task : 0,
    time : 0,
    hints : [],
    levelChanged : false
};

var requestInterval = null;
function init () {
    enRequest(function () {
        var message = 'Всем привет, я к Вашим услугам! ' + game.stateMessage;
        utils.sendMessageToChat(message);
    });

    requestInterval = setInterval(function () {
        enRequest();
    }, 60000);
}

function sendCode (code, callback) {
    enRequest({
        LevelId : game.levelId,
        LevelNumber : game.LevelNumber,
        "LevelAction.Answer" : code
    }, callback);
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
        updateGameState($);
        updateLevelState($);
    });
}

function updateGameState($) {
    if (game.state !== 'wait') return;

    var $timeError = $('#Panel_lblGameError');
    if ($timeError.length > 0) {
        return game.stateMessage = $timeError.text();
    }

    var $timeToStart = $('#Panel_TimerHolder');
    if ($timeToStart.length > 0) {
        var text = $timeToStart.text();
        var time = Number(text.match(/"StartCounter":([\d]+)/)[1]);
        var minutes = Math.floor(time / 60);
        var seconds = time - minutes * 60;

        return game.stateMessage = 'Игра начнется через ' + minutes + 'минут ' + seconds + 'секунд';
    }

    game.state = 'started';
    game.stateMessage = 'Игра уже стартовала';
}

function updateLevelState($) {
    var levelId = $('.aside form input[name="LevelId"]').val();
    if (levelId !== game.levelId) game.levelChanged = true;

    game.task = getTask();
    game.levelId = levelId;
    game.levelNumber = $('.aside form input[name="LevelNumber"]').val();

    var hints = getHints();
    var newCount = hints.filter(function (item) { return item.text; }).length;
    var oldCount = game.hints.filter(function (item) { return item.text; }).length;
    if (oldCount < newCount) game.newHints = oldCount;
    game.hints = hints;

    if (game.levelChanged) {
        var message = 'Задание ' + game.levelNumber;
        message += game.task;
        hints.forEach(function (item, index) {
            if (item.text) {
                message += 'Подсказка #' + index + '. ' + item.text;
            } else {
                message += 'Подсказка #' + index + ' через ' + item.time;
            }
        });
        return message && utils.sendMessageToChat(message);
    }

    if (game.newHints) {
        var message = '';
        for (var i = oldCount + 1; i < game.hints.length; i++) {
            if (game.hints[i].text) {
                message += 'Подсказка №' + i + '. ' + game.hints[i].text;
            }
        }
        message && utils.sendMessageToChat(message);
    }
}

function getHints($) {
    return [];
}

function getTask() {

}