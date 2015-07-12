var utils = require('./utils');
utils.callMethod({method : 'getMe'}, function (err, data) {
    /*utils.callMethod({
        method : 'getUpdates',
        form : {
            offset : 0
        }
    }, function (err, data) {
        console.log(data);
    })*/
    utils.callMethod({method : 'unsetWebhook', form : {url : 'https://ya1.ru'}}, function (err, data) {
        console.log(data);
    })
});