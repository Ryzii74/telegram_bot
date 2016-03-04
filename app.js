global.config = require('./config');
var Telegram = require('./telegram');
var offset = 0;

require('./libs/tasks/chlen').init();
//require('./libs/server')();

Telegram.init(function (err, messages) {
    messages.forEach(function (message) {
        newMessage(message.message);
    });
});

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
    if (message.command === '/') message.command = 'empty';

    try {
        require(global.config.path_to_commands + message.command)(message.args, function (text) {
            Telegram.sendMessage({
                chat_id : message.chat.id,
                text : text,
                reply_to_message_id : message.message_id
            });
        }, message.from.id);
    }
    catch (e) {
        Telegram.sendMessage({
            text : "Неверно указан метод!",
            reply_to_message_id : message.message_id
        });
        console.log(e.message);
        console.log(e.stack);
    }
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
            message.command = message.text.split(' ')[0].split('@')[0];
            message.args = message.text.replace(message.command + ' ', '').replace(message.command, '');

            require(global.config.path_to_commands + message.command)(
                (message.text === '/getid') ? message.chat.id : message.args, function (text) {
                Telegram.sendMessage({
                    chat_id : message.chat.id,
                    text : text,
                    reply_to_message_id: message.message_id
                });
            }, message.from.id);
        } else {
            require(global.config.path_to_commands + 'code')(message.text, function (text) {
                Telegram.forwardMessage({
                    from_chat_id: message.chat.id,
                    message_id: message.message_id
                }, function () {
                    Telegram.sendMessage({ text : text });
                });

                Telegram.sendMessage({
                    chat_id: message.chat.id,
                    text: text,
                    reply_to_message_id: message.message_id
                });
            });
        }
    }
    catch (e) {
        Telegram.sendMessage({
            chat_id : message.chat.id,
            text : "Неверно указан метод!",
            reply_to_message_id : message.message_id
        });
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