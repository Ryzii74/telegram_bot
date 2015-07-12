var utils = require('./utils');
var config = require('./config');
var en = require('./en');
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
        isPrivate : false
    };

    if (message.from.id === message.chat.id) {
        result.isPrivate = true;
    }

    if (message.text) {
        result.text = (result.isPrivate) ? message.text : message.text.replace(config.bot.name + ' ', '');

        message.command = message.text.split(' ')[0];
        message.args = message.text.replace(message.command + ' ', '');

        try {
            require(config.path_to_commands + message.command)(message.args, function (text) {
                text && utils.callMethod({
                    method : 'sendMessage',
                    form : {
                        chat_id : message.chat.id,
                        text : text,
                        reply_to_message_id : message.message_id
                    }
                });
            });
        }
        catch (e) {
            console.log('Неправильная команда');
        }
    } else {
        console.log('Сообщение не текстовое');
    }
}

en.init();