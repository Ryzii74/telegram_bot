var utils = require('./../../utils');
var enRequest = require('./request');
var parser = require('./parser');

var times = [60, 180, 300];


function Level (data) {
    this.levelId = data.levelId;
    this.levelNumber = data.levelNumber;
    this.task = data.task;
    this.time = {
        value : data.time,
        send : [],
        message : data.timeMessage
    };
    markAlreaddyHinted(this.time);
    this.blockageInfo = data.blockageInfo;
    this.hints = data.hints;
    this.hints.forEach(function (hint) {
        if (hint.text) return;
        markAlreaddyHinted(hint);
    });

    this.bonuses = data.bonuses;
    this.codesCount = data.codesCount;
    this.codesLeft = data.codesLeft;

    console.log(this.bonuses);
}

function markAlreaddyHinted(obj) {
    times.forEach(function (time) {
        if (time > obj.value) { obj.send.push(time); }
    });
}

function Game() {
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

Game.prototype.updateStartState = function ($) {
    var state = parser.getStartState($);
    if (state.started) {
        this.state = 'started';
    }

    console.log(state);

    this.start.message = state.message;
    this.start.time.value = state.time;

    if (!this.start.messageSent) {
        this.start.messageSent = true;
        return utils.sendMessageToChat(this.start.message);
    }

    checkTimerMessage(this.start.time, 'До начала игры осталось: ');
};

Game.prototype.getLevelTime = function (callback) {
    if (!this.isStarted(callback)) return;
    return 'До окончания задания: ' + this.levels.slice(-1)[0].time.message || "без автоперехода";
};

Game.prototype.getHints = function (callback) {
    if (!this.isStarted(callback)) return;
    var message = '';
    this.levels.slice(-1)[0].hints.forEach(function (item, index) {
        if (item.text) {
            message += 'Подсказка #' + (index + 1) + '.\n' + item.text + '\n';
        } else {
            message += 'Подсказка #' + (index + 1) + ' через ' + item.message + '\n';
        }
    });

    return message || 'Подсказок нет!';
};

Game.prototype.addLevel = function (levelState) {
    var level = new Level(levelState);
    /*level.hints.forEach(function (hint) {
        hint.time = {
            send : [],
            value : hint
        }
    });*/
    this.levels.push(level);

    var message = 'Задание ' + level.levelNumber;
    message += '\n' + this.getTask() + '\n\n';
    message += this.getHints();
    message += '\n\n';
    message += this.getLevelTime();
    message += '\n' + this.getCodesCount();
    message += '\n' + this.getBonusesCount();
    message += this.getBonusesTasks();
    if (level.blockageInfo) message += '\n' + level.blockageInfo;

    return message && utils.sendMessageToChat(message);
};

Game.prototype.getBonusesTasks = function () {
    var lastLevel = this.levels.slice(-1)[0];
    if (!lastLevel) return 'Уровень не найден!';

    var result = '';
    lastLevel.bonuses.forEach(function (bonus) {
        if (!bonus.task) return;
        result += '\n\nЗадание на "' + bonus.name + '"';
        result += '\n' + bonus.task;
    });

    return result;
};

Game.prototype.getBonusesCount = function () {
    var lastLevel = this.levels.slice(-1)[0];
    if (!lastLevel) return 'Уровень не найден!';

    return 'Бонусов выполнено ' + lastLevel.bonuses.filter(function (bonus) { return bonus.completed; }).length + ' из ' + lastLevel.bonuses.length;
};

Game.prototype.getCodesCount = function () {
    var lastLevel = this.levels.slice(-1)[0];
    if (!lastLevel) return 'Уровень не найден!';

    var message = lastLevel.codesCount;
    message += '\n' + lastLevel.codesLeft;
    message += '\n' + this.getBonusesCount();

    return message;
};

Game.prototype.findNewHints = function (levelState) {
    var newCount = levelState.hints.filter(function (item) { return item.text; }).length;
    var oldCount = game.levels.slice(-1)[0].hints.filter(function (item) { return item.text; }).length;

    if (oldCount < newCount) {
        var message = '';
        for (var i = oldCount; i < newCount; i++) {
            if (levelState.hints[i].text) {
                message += 'Подсказка №' + (i + 1) + '. ' + levelState.hints[i].text + '\n';
            }
        }
        message && utils.sendMessageToChat(message);
    }
};

Game.prototype.updateLevelState = function ($, body) {
    var levelState = parser.getLevelState($, body);

    if (levelState.stopped) {
        if (this.state !== 'stop') utils.sendMessageToChat('Такое ощущение, что игра кончилась');
        this.state = 'stop';
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
    lastLevel.bonuses = levelState.bonuses;

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

    lastLevel.hints.filter(function (item) { return !item.text; }).forEach(function (hint, index) {
        checkTimerMessage(hint, 'До подсказки #' + (index + 1) + ' осталось: ');
    });
};

Game.prototype.update = function (data, callback) {
    var _this = this;

    data = data || {};

    enRequest(data, function ($, body) {
        if (!_this.isStarted()) {
            _this.updateStartState($);
        }

        if (_this.isStarted()) {
            _this.updateLevelState($, body);
        }

        callback && callback($, body);
    });
};

Game.prototype.init = function (params, callback) {
    if (this.state !== 'wait') return callback('Бот уже проинициализировал игру! ' + this.start.message);
    callback('Я к Вашим услугам!');

    this.update();

    var _this = this;
    this.requestInterval = setInterval(function () {
        _this.update();
    }, 5000);
};

Game.prototype.getStartMessage = function (params, callback) {
    callback(this.start.message);
};

Game.prototype.stop = function (callback) {
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
    callback('Приятно было с Вами поиграть!');
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
        return callback();
        //return callback('Блокировка ответов! ' + lastLevel.blockageInfo);
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
            var message = (levelId == lastLevel.levelId) ? lastLevel.codesLeft : "Новый уровень!";
            return callback('Код принят! ' + message);
        }

        if (_this.state !== 'stop') {
            callback('Ошибка отправки кода');
        } else {
            callback('Игра окончена');
        }
    });
};

Game.prototype.getTask = function getTask(callback) {
    if (!this.isStarted(callback)) return;
    return this.levels.slice(-1)[0].task;
};

var game = new Game();

module.exports.getStartMessage = function (params, callback) {
    game.getStartMessage(params, callback);
};
module.exports.getTask = function (callback) {
    return game.getTask(callback);
};
module.exports.getCodesCount = function (callback) {
    callback(game.getCodesCount());
};
module.exports.getBonusesTasks = function (callback) {
    callback(game.getBonusesTasks());
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
module.exports.getHints = function (callback) {
    return game.getHints(callback);
};
module.exports.getTime = function (callback) {
    return game.getLevelTime(callback);
};

function checkTimerMessage(obj, message) {
    times.forEach(function (time) {
        if (obj.value < time && obj.send.indexOf(time) === -1) {
            obj.send.push(time);
            utils.sendMessageToChat(message + Math.floor(time / 60) + ' минут');
        }
    });
}