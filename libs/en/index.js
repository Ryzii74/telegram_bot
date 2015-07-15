var utils = require('./../../utils');
var enRequest = require('./request');
var parser = require('./parser');

function Level (data) {
    this.levelId = data.levelId;
    this.levelNumber = data.levelNumber;
    this.task = data.task;
    this.time = {
        value : data.time,
        send : [],
        message : data.timeMessage
    };
    this.hints = [];
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

    this.start.message = state.message;
    this.start.time.value = state.time;

    if (!this.start.messageSent) {
        this.start.messageSent = true;
        return utils.sendMessageToChat(this.start.message);
    }

    return checkTimerMessage(this.start.time, this.start.message);
};

Game.prototype.getLevelTime = function (callback) {
    if (!this.isStarted(callback)) return;
    return 'До окончания задания: ' + this.levels.slice(-1)[0].time.message;
};

Game.prototype.getHints = function (callback) {
    if (!this.isStarted(callback)) return;
    var message = '';
    this.levels.slice(-1)[0].hints.forEach(function (item, index) {
        if (item.text) {
            message += 'Подсказка #' + (index + 1) + '.\n' + item.text + '\n';
        } else {
            message += 'Подсказка #' + (index + 1) + ' через ' + item.time + '\n';
        }
    });

    return message;
};

Game.prototype.addLevel = function (levelState) {
    var level = new Level({
        levelId : levelState.levelId,
        levelNumber : levelState.levelNumber,
        task : levelState.task,
        hints : levelState.hints,
        time : {
            value : levelState.time,
            send : [],
            message : levelState.timeMessage
        }
    });
    /*level.hints.forEach(function (hint) {
        hint.time = {
            send : [],
            value : hint
        }
    });*/
    this.levels.push(level);

    var message = 'Задание ' + level.levelNumber;
    message += '\n' + this.getTask();
    message += this.getHints();
    message += '\n\n';
    message += this.getLevelTime();

    return message && utils.sendMessageToChat(message);
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

    if (this.levels.length === 0 ||
        this.levels.slice(-1)[0].levelId !== levelState.levelId)
    {
        return this.addLevel(levelState);
    }

    this.findNewHints(levelState);

    var lastLevel = this.levels.slice(-1)[0];
    lastLevel.task = levelState.task;
    lastLevel.hints = levelState.hints;
    lastLevel.time.value = levelState.time;
    lastLevel.time.message = levelState.timeMessage;

    checkTimerMessage(lastLevel.time, lastLevel.time.message);
    /*lastLevel.hints.filter(function (item) { return item.text; }).forEach(function (hint) {

    });*/
};

Game.prototype.update = function () {
    var _this = this;
    enRequest({}, function ($, body) {
        if (!_this.isStarted()) {
            _this.updateStartState($);
        }

        if (_this.isStarted()) {
            _this.updateLevelState($, body);
        }
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
    enRequest({
        LevelId : lastLevel.levelId,
        LevelNumber : lastLevel.LevelNumber,
        "LevelAction.Answer" : code
    }, function ($, body) {
        if ($('.aside #incorrect').length > 0) {
            return callback('Код не принят');
        }

        if ($('.aside .color_correct').length > 0) {
            return callback('Код принят');
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
    var times = [60, 180, 300];
    times.forEach(function (time) {
        if (obj.value < time && obj.send.indexOf(time) === -1) {
            obj.send.push(time);
            return utils.sendMessageToChat(message);
        }
    });
}