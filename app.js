var utils = require('./utils');
var config = require('./config');
var offset = 0;

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
    if (message.from.id === message.chat.id) return gotPrivateMessage(message);
    gotChatMessage(message);
}

function gotChatMessage(message) {
    if (!message.text) return;

    message.command = message.text.split(' ')[0];
    message.args = message.text.replace(message.command + ' ', '').replace(message.command, '');

    try {
        require(config.path_to_commands + message.command)(message.args, function (text) {
            sendMessage(message.chat.id, text, message.message_id);
        });
    }
    catch (e) {
        console.log('<- ERROR START ------------------------------------------------------------------------------>');
        console.log(e.message);
        console.log(e.stack);
        console.log('<- ERROR END -------------------------------------------------------------------------------->');
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
    if (config.game.players.indexOf(message.from.id) === -1
        && config.game.players.indexOf(message.from.username) === -1
        && message.text !== '/getid') {
        console.log('-------------------------------------');
        console.log('bad player try to send message to bot');
        console.log(message);
        console.log('-------------------------------------');
        return;
    }

    try {
        if (message.text[0] && message.text[0] === '/') {
            require(config.path_to_commands + message.text)(
                (message.text === '/getid') ? message.chat.id : message.text, function (text) {
                sendMessage(message.chat.id, text, message.message_id);
            });
        } else {
            require(config.path_to_commands + 'code')(message.text, function (text) {
                utils.callMethod({
                    method: 'forwardMessage',
                    form: {
                        chat_id: config.game.chat_id,
                        from_chat_id: message.chat.id,
                        message_id: message.message_id
                    }
                }, function () {
                    sendMessage(config.game.chat_id, text, message.message_id);
                });

                sendMessage(message.chat.id, text, message.message_id);
            });
        }
    }
    catch (e) {
        console.log('<- ERROR START ------------------------------------------------------------------------------>');
        console.log(e.message);
        console.log(e.stack);
        console.log('<- ERROR END -------------------------------------------------------------------------------->');
    }
}