var request = require('request');
var cheerio = require('cheerio');
var config = require('./config');
var utils = require('./utils');

module.exports.sendCode = sendCode;
module.exports.init = init;

var game = {
    state : 'wait',
    levelId : 0,
    levelNumber : 0,
    task : 0,
    time : 0,
    hints : []
};
var requestInterval = null;

function init () {
    stateRequest(function (message) {
        message = 'Всем привет, я к Вашим услугам! ' + message;
        utils.sendMessageToChat(message);
    });

    requestInterval = setInterval(function () {
        stateRequest();
    }, 60000);
}

function stateRequest(callback) {
    enRequest(function () {
        var $ = cheerio.load(body);

        var $timeError = $('#Panel_lblGameError');
        if ($timeError.length > 0) {
            return callback && callback($timeError.text());
        }

        var $timeToStart = $('#Panel_TimerHolder');
        if ($timeToStart.length > 0) {
            var text = $timeToStart.text();
            var time = Number(text.match(/"StartCounter":([\d]+)/)[1]);
            var minutes = Math.floor(time / 60);
            var seconds = time - minutes * 60;

            return callback && callback('Игра начнется через ' + minutes + 'минут ' + seconds + 'секунд');
        }

        callback && callback('Игра уже идет');

        var levelId = $('.aside form input[name="LevelId"]').val();
        if (game.state === 'wait' || game.levelId !== levelId) {
            updateGameState($, levelId);
        }
    });
}

function sendCode (code, callback) {
    enRequest()
}

function enRequest (data, callback) {
    request.post({
        url : config.game.url,

        headers : {
            cookie : "atoken=uid%3d155137%26iss%3d0%26iscd%3d1%26tkn%3df05fc2bee9b494da841c1ce232730c9771fc44b0; GUID=fec7537b%2D4a20%2D4457%2Daeb3%2D2651bb28a7d7; stoken=hlsu2bbh2b1uxzjc2ljezq1n; __utma=142023398.1745113043.1436693934.1436693934.1436693934.1; __utmb=142023398.1.10.1436693934; __utmc=142023398; __utmz=142023398.1436693934.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmt_t0=1; stoken=hlsu2bbh2b1uxzjc2ljezq1n; lang=ru; Domain=demo.en.cx; __utma=194284216.967903958.1436693709.1436693709.1436693709.1; __utmb=194284216.46.10.1436693709; __utmc=194284216; __utmz=194284216.1436693709.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)",
            "User-Agent" : "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.132 Safari/537.36",
            "Referer" : "http://demo.en.cx/GameDetails.aspx?gid=23362"
        }
    }, callback);
}

function updateGameState($, levelId) {
    game.state = 'started';
    game.levelId = levelId;
    game.levelNumber = $('.aside form').eq(0).find('input[name="LevelNumber"]').val();

    utils.sendMessageToChat('Задание ' + game.levelNumber);
}