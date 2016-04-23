var Telegram = require('./../../telegram');
var enRequest = require('./request');
var parser = require('./parser');
var _ = require('underscore');

var times = [60, 180, 300];
var Level = require('./level');

function Game() {
    this.reconnect = false;
    this.stopLogging = false;
    this.state = 'wait';
    this.levels = [];
    this.start = {
        time : {
            value : 30000,
            send : [],
            message : ''
        },
        message : '',
        messageSent : ''
    };
}

Game.prototype.updateStartState = function ($, body) {
    var state = parser.getStartState($, body);
    if (!state && !this.reconnect) {
        this.login(() => {
            this.updateStartState($, body);
        });
    }

    if (state.error) {
        return Telegram.sendMessage({ text : state.error });
    }

    if (state.started) {
        this.state = 'started';
    }

    this.start.message = state.message;
    this.start.time.value = state.time;

    if (!this.start.messageSent) {
        this.start.messageSent = true;
        return Telegram.sendMessage({ text : this.start.message });
    }

    checkTimerMessage(this.start.time, 'До начала игры осталось: ');
};

Game.prototype.addLevel = function (levelState) {
    var level = new Level(levelState);
    this.levels.push(level);

    var message = `Задание ${level.levelNumber}\n`;
    message += `${level.getters.task()}\n\n`;
    message += `${level.getters.hints()}\n\n`;
    message += level.getters.time();
    message += `\n${level.getters.codesCount()}`;
    message += `\n${level.getters.bonusesTasks()}`;
    if (level.blockageInfo) message += `\n${level.blockageInfo}`;

    message += `\n\n${level.getters.messages()}`;
    return message && Telegram.sendMessage({ text : message });
};

Game.prototype.findNewHints = function (levelState) {
    var newCount = levelState.hints.filter(function (item) { return item.text; }).length;
    var oldCount = game.levels.slice(-1)[0].hints.filter(function (item) { return item.text; }).length;

    if (oldCount < newCount) {
        var message = '';
        for (var i = oldCount; i < newCount; i++) {
            if (levelState.hints[i].text) {
                message += `Подсказка №${i + 1}. ${levelState.hints[i].text}\n`;
            }
        }
        message && Telegram.sendMessage({ text : message });
    }
};

Game.prototype.updateLevelState = function ($, body) {
    var levelState = parser.getLevelState($, body);

    if (levelState.stopped) {
        if (!this.reconnect) return this.login(function () {
            this.update();
        }.bind(this));

        if (this.state !== 'stop') Telegram.sendMessage({ text : 'Такое ощущение, что игра кончилась' });
        this.state = 'stop';
        this.stop();
        return;
    }

    if ((this.levels.length === 0 ||
        this.levels.slice(-1)[0].levelId !== levelState.levelId) && !levelState.isBlocked)
    {
        return this.addLevel(levelState);
    }

    if (this.levels.length === 0) return;

    this.findNewHints(levelState);

    var lastLevel = this.levels.slice(-1)[0];
    lastLevel.task = levelState.task;
    lastLevel.time.value  = levelState.time;
    lastLevel.time.message = levelState.timeMessage;
    lastLevel.codesCount = levelState.codesCount;
    lastLevel.codesLeft = levelState.codesLeft;
    this.prevBonuses = lastLevel.bonuses;
    lastLevel.bonuses = levelState.bonuses;
    lastLevel.allCodes = levelState.allCodes;
    lastLevel.messages = levelState.messages;

    lastLevel.hints.forEach(function (item, index) {
        if (levelState.hints[index].text) {
            item.text = levelState.hints[index].text;
            delete item.message;
            delete item.value;
            delete item.send;
        } else {
            item.message = levelState.hints[index].message;
            item.value = levelState.hints[index].value;
        }
    });

    checkTimerMessage(lastLevel.time, 'До конца уровня осталось: ');


    lastLevel.hints.forEach(function (hint, index) {
        if (hint.text) return;
        checkTimerMessage(hint, 'До подсказки #' + (index + 1) + ' осталось: ');
    });
};

Game.prototype.login = function (callback) {
    this.reconnect = true;

    if (this.stopLogging) return;
    console.log('login to en');
    require('request').post({
        url : global.config.system.url.start + global.config.game.host + global.config.system.login,
        form : global.config.game.auth,
        headers : {
            "Cookie" : "lang=ru;",
            "User-Agent" : global.config.system.userAgent,
            "Host" : global.config.game.host
        }
    }, (err, response, data) => {
        this.reconnect = false;

        if (err || !response.headers['set-cookie']) {
            console.log(err, response.headers['set-cookie'], data);
            return console.log('Не удалось залогиниться!');
        }

        this.cookies = response.headers['set-cookie'].map(function (el) { return el.split(';')[0]; }).join('; ');
        callback();
    });
};

Game.prototype.update = function (data, callback) {
    var _this = this;
    enRequest(data || {}, this.cookies, (err, $, body) => {
        if (err) return console.log('Не удалось распарсить страницу', err);

        _this.isStarted() ? _this.updateLevelState($, body) : _this.updateStartState($, body);
        callback && callback($, body);
    });
};

Game.prototype.init = function (params, callback) {
    this.login(() => {
        if (this.state !== 'wait') return callback('Бот уже проинициализировал игру! ' + this.start.message);

        this.state = 'notstart';
        callback('Я к Вашим услугам!');

        this.update();
        this.requestInterval = setInterval(this.update.bind(this), global.config.system.gameUpdatingInterval);
    });
};

Game.prototype.getStartMessage = function (params, callback) {
    callback(this.start.message);
};

Game.prototype.stop = function (callback) {
    this.stopLogging = true;
    this.state = 'wait';
    this.levels = [];
    this.start = {
        time : {
            value : 30000,
            send : [],
            message : ''
        },
        message : '',
        messageSent : ''
    };

    clearInterval(this.requestInterval);
    if (callback) {
        callback('Приятно было с Вами поиграть!');
    } else {
        Telegram.sendMessage({ text : 'Приятно было с Вами поиграть' });
    }
};

Game.prototype.isStarted = function (callback) {
    if (this.state === 'wait') {
        callback && callback('Сначала надо стартовать игру!');
        return false;
    }

    if (this.state === 'notstart') {
        callback && callback(this.start.message);
        return false;
    }

    return true;
};

Game.prototype.sendCode = function (code, callback) {
    if (!this.isStarted(callback)) return;

    var _this = this;
    var lastLevel = this.levels.slice(-1)[0];
    var levelId = lastLevel.levelId;

    if (lastLevel.blockageInfo) {
        return callback('Блокировка ответов! ' + lastLevel.blockageInfo);
    }

    this.update({
        LevelId : lastLevel.levelId,
        LevelNumber : lastLevel.LevelNumber,
        "LevelAction.Answer" : code
    }, function ($, body, codes) {
        if ($('.aside #incorrect').length > 0) {
            return callback('Код не принят');
        }

        if ($('.aside .color_correct').length > 0) {
            var lastLevel = _this.levels.slice(-1)[0];
            var message = 'Код принят! ';
            if (levelId == lastLevel.levelId) {
                message += lastLevel.codesLeft;

                for (var i = 0; i < lastLevel.bonuses.length; i++) {
                    if (lastLevel.bonuses[i].completed === true &&
                        _this.prevBonuses[i].completed === false)
                    {
                        var bonus = lastLevel.bonuses[i];
                        message += '\nБонусный код "' + bonus.name + '" принят, награда - ' + bonus.reward;
                        message += '\nПодсказка бонуса: ';
                        message += (bonus.task !== '') ? bonus.task : 'отсутствует';
                    }
                }
            } else {
                message += "Новый уровень!";
            }

            return callback(message);
        }

        if (_this.state !== 'stop') {
            callback('Ошибка отправки кода');
        } else {
            callback('Игра окончена');
        }
    });
};

var game = new Game();

module.exports.getLastLevelData = function (params, callback) {
    if (!params.name) {
        callback && callback('Ошибка указания параметров запроса!');
        return 'Ошибка указания параметров запроса!';
    }

    if (!game.isStarted()) {
        callback && callback('Игра еще не началась!');
        return 'Игра еще не началась!';
    }

    var level = game.levels.slice(-1)[0];
    if (!level) {
        callback && callback('Уровень не найден!');
        return 'Уровень не найден!';
    }

    return level.getters[params.name](callback);
};
module.exports.getStartMessage = function (params, callback) {
    game.getStartMessage(params, callback);
};
module.exports.init = function (params, callback) {
    game.init(params, callback);
};
module.exports.stop = function (callback) {
    game.stop(callback);
};
module.exports.sendCode = function (params, callback) {
    game.sendCode(params, callback);
};
module.exports.getLevels = function () {
    return game.levels;
};

function checkTimerMessage(obj, message) {
    times.forEach(function (time) {
        if (obj.value < time && obj.send.indexOf(time) === -1) {
            obj.send.push(time);
            Telegram.sendMessage({ text : message + Math.floor(time / 60) + ' минут' });
        }
    });
}