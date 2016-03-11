module.exports = function (params, callback) {
    require('../libs/where').getLastPoint((err, data) => {
        if (err) return callback(err);

        callback(`http://static-maps.yandex.ru/1.x/?lang=en-US&ll=${data.lng},${data.lat}&z=13&l=map&size=600,300&pt=${data.lng},${data.lat},flag`);
    });
};