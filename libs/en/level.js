var _ = require('underscore');

module.exports = Level;
function Level (data) {
    this.messages = data.messages;
    this.name = data.name;
    this.levelId = data.levelId;
    this.levelNumber = data.levelNumber;
    this.task = data.task;
    this.allCodes = data.allCodes;
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

    this.getters = {
        task : callback => {
            return returnSomeData(`Название: ${this.name}\n${this.task || 'Возможно задание пустое'}`, callback);
        },
        codesCount : callback => {
            return returnSomeData(`${this.codesCount}\n${this.codesLeft}`, callback);
        },
        bonusesCount : callback => {
            var completedBonusesCount = this.bonuses.filter(function (bonus) { return bonus.completed; }).length;
            return returnSomeData(`Бонусов выполнено ${completedBonusesCount} из ${this.bonuses.length}`, callback);
        },
        bonusesTasks : callback => {
            var result = '';
            this.bonuses.forEach(function (bonus) {
                if (!bonus.task || bonus.completed) return;
                result += 'Задание на "' + bonus.name + '"\n';
                result += bonus.task + '\n\n';
            });
            if (result === '') result = 'Невыполненных бонусов с заданиями нет';
            result = this.getters.bonusesCount() +'\n' + result;

            return returnSomeData(result, callback);
        },
        allCodes : callback => {
            return returnSomeData(this.allCodes, callback);
        },
        allCodesLeft : callback => {
            var data = {
                start : -1,
                end : -1,
                result : []
            };

            this.allCodes
                .replace( /^\s+/g, '')
                .replace( /\s+$/g, '')
                .split('\r\n')
                .forEach(function (code, index) {
                    if (code.indexOf('код не введён') === -1) {
                        checkQueue(data);
                        return;
                    }

                    var text = code.split(':')[0].replace('Сектор ', '');
                    if (Number(text) !== index + 1) {
                        checkQueue(data);
                        data.result.push(text);
                        return;
                    }

                    if (data.start === -1) {
                        data.start = Number(text);
                        return;
                    }

                    data.end = Number(text);
                });

            checkQueue(data);

            return returnSomeData(data.result.join(', '), callback);
        },
        bonusesHints : callback => {
            var result = '';
            this.bonuses.forEach(function (bonus) {
                if (!bonus.completed || !bonus.task) return;
                result += 'Бонус "' + bonus.name + '"\n';
                result += bonus.task + '\n\n';
            });
            if (result === '') result = 'Выполненных бонусов с подсказками нет';
            result = this.getters.bonusesCount() +'\n' + result;

            return returnSomeData(result, callback);
        },
        time : callback => {
            return returnSomeData(`До окончания задания: ${this.time.message || "без автоперехода"}`, callback);
        },
        hints : callback => {
            var message = '';
            this.hints.forEach(function (item, index) {
                if (item.text) {
                    message += 'Подсказка #' + (index + 1) + '.\n' + item.text + '\n';
                } else {
                    message += 'Подсказка #' + (index + 1) + ' через ' + item.message + '\n';
                }
            });

            return returnSomeData(message || 'Подсказок нет!', callback);
        },
        messages : callback => {
            return returnSomeData(`Сообщения: ${this.messages || "нет"}`, callback);
        }
    };
}

function checkQueue(data) {
    if (data.start === -1) return;

    if (data.end === -1) data.result.push(data.start);

    if (data.start + 1 === data.end) {
        data.result.push(data.start);
        data.result.push(data.end);
    }

    if (data.start + 1 < data.end) data.result.push(data.start + '-' + data.end);

    data.start = -1;
    data.end = -1;
}

function returnSomeData(data, callback) {
    if (callback) {
        return data && callback(data);
    } else {
        return data;
    }
}

function markAlreaddyHinted(obj) {
    var times = [60, 180, 300];
    times.forEach(function (time) {
        if (time > obj.value) { obj.send.push(time); }
    });
}