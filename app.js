global.config = require('./config');
var utils = require('./utils');
var offset = 0;

require('./libs/tasks/chlen').init();
//require('./libs/server')();

utils.callMethod({method : 'getMe'}, function (err, data) {
    makeRequest();
});

function makeRequest() {
    utils.callMethod({
        method : 'getUpdates',
        form : {
            offset : offset,
            timeout : 100
        }
    }, function (err, data) {
        if (err || !data.ok) {
            err && console.log('telegram request error', err);
            data && console.log('telegram request data', data);
        } else {
            data.result.forEach(function (message) {
                newMessage(message.message);
                offset = message.update_id + 1;
            });
        }

        makeRequest();
    });
}

function newMessage(message) {
    console.log('------------------------');
    console.log(message.from, message.text);
    if (message.text) message.text = message.text.replace(global.config.bot.bot, '');
    if (message.from.id === message.chat.id) return gotPrivateMessage(message);
    gotChatMessage(message);
}

function gotChatMessage(message) {
    if (!message.text) return;
    if (message.chat.id != global.config.game.chat_id) {
        console.log('-------------------------------------');
        console.log('bad conf try to send message to bot');
        console.log(message);
        console.log('-------------------------------------');
        return;
    }

    message.command = message.text.split(' ')[0];
    message.args = message.text.replace(message.command + ' ', '').replace(message.command, '');

    try {
        require(global.config.path_to_commands + message.command)(message.args, function (text) {
            sendMessage(message.chat.id, text, message.message_id);
        }, message.from.id);
    }
    catch (e) {
        sendMessage(global.config.game.chat_id, "Неверно указан метод!", message.message_id);
        console.log(e.message);
        console.log(e.stack);
    }
}

function sendMessage(chat_id, text, message_reply_id) {
    if (!text) return;
    utils.callMethod({
        method: 'sendMessage',
        form: {
            chat_id: chat_id,
            text: text,
            reply_to_message_id: message_reply_id
        }
    });
}

function gotPrivateMessage(message) {
    if (global.config.game.players.indexOf(message.from.id) === -1
        && global.config.game.players.indexOf(message.from.username) === -1
        && message.text !== '/getid') {
        console.log('-------------------------------------');
        console.log('bad player try to send message to bot');
        console.log(message);
        console.log('-------------------------------------');
        return;
    }

    try {
        if (message.text[0] && message.text[0] === '/') {
            message.command = message.text.split(' ')[0];
            message.args = message.text.replace(message.command + ' ', '').replace(message.command, '');

            require(global.config.path_to_commands + message.command)(
                (message.text === '/getid') ? message.chat.id : message.args, function (text) {
                sendMessage(message.chat.id, text, message.message_id);
            }, message.from.id);
        } else {
            require(global.config.path_to_commands + 'code')(message.text, function (text) {
                utils.callMethod({
                    method: 'forwardMessage',
                    form: {
                        chat_id: global.config.game.chat_id,
                        from_chat_id: message.chat.id,
                        message_id: message.message_id
                    }
                }, function () {
                    sendMessage(global.config.game.chat_id, text, message.message_id);
                });

                sendMessage(message.chat.id, text, message.message_id);
            });
        }
    }
    catch (e) {
        sendMessage(message.chat.id, "Неверно указан метод!", message.message_id);
        console.log(e.message);
        console.log(e.stack);
    }
}

process.on('uncaughtException', function(err) {
    console.log('------------------------');
    console.log('Caught exception: ' + err);
    console.log(err.stack);
    console.log('------------------------');
});

process.stdin.on('readable', function() {
    var chunk = process.stdin.read();
    if (chunk !== null) {
        gotChatMessage({
            text : chunk.toString().replace("\n", ''),
            chat : {
                id : global.config.game.chat_id,
                message_id: 0
            },
            from : {
                id : global.config.ownerId
            }
        });
    }
});