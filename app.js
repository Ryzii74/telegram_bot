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
            err && console.log(err);
            data && console.log(data);

            return makeRequest();
        }

        var messages = data.result;
        messages.forEach(function (message) {
            newMessage(message.message);
            offset = message.update_id + 1;
        });

        makeRequest();
    });
}

function newMessage(message) {
    var result = {
        isPrivate: false
    };

    if (message.from.id === message.chat.id) {
        try {
            if (message.text[0] && message.text[0] === '/') {
                require(config.path_to_commands + message.text)((message.text === '/getid') ? message.chat.id : message.text, function (text) {
                    if (!text) return;
                    utils.callMethod({
                        method: 'sendMessage',
                        form: {
                            chat_id: message.chat.id,
                            text: text,
                            reply_to_message_id: message.message_id
                        }
                    });
                });
            } else {
                require(config.path_to_private_commands + 'code')(message.text, function (text) {
                    utils.callMethod({
                        method: 'forwardMessage',
                        form: {
                            chat_id: config.game.chat_id,
                            from_chat_id: message.chat.id,
                            message_id: message.message_id
                        }
                    }, function () {
                        if (!text) return;
                        utils.callMethod({
                            method: 'sendMessage',
                            form: {
                                chat_id: config.game.chat_id,
                                text: text,
                                reply_to_message_id: message.message_id
                            }
                        });
                    });

                    if (!text) return;
                    utils.callMethod({
                        method: 'sendMessage',
                        form: {
                            chat_id: message.chat.id,
                            text: text,
                            reply_to_message_id: message.message_id
                        }
                    });
                });
            }
        }
        catch (e) {
            console.log('<- ERROR START ------------------------------------------------------------------------------>');
            console.log(e.message);
            console.log(e.stack);
            console.log('<- ERROR END -------------------------------------------------------------------------------->');
        }
        return;
    }

    if (message.text) {
        console.log(message.text);
        result.text = (result.isPrivate) ? message.text : message.text.replace(config.bot.name + ' ', '');

        message.command = message.text.split(' ')[0];
        message.args = message.text.replace(message.command + ' ', '').replace(message.command, '');

        try {
            require(config.path_to_commands + message.command)(message.args, function (text) {
                text && utils.callMethod({
                    method: 'sendMessage',
                    form: {
                        chat_id: message.chat.id,
                        text: text,
                        reply_to_message_id: message.message_id
                    }
                });
            });
        }
        catch (e) {
            console.log('<- ERROR START ------------------------------------------------------------------------------>');
            console.log(e.message);
            console.log(e.stack);
            console.log('<- ERROR END -------------------------------------------------------------------------------->');
        }
    } else {
        console.log('Сообщение не текстовое');
    }
}