module.exports.getLastPoint = getLastPoint;
function getLastPoint(callback) {
    require('request').get('http://46.101.140.237:3000/points/getLast/test', function (err, response, data) {
        if (err) return callback('Ошибка получения координат');

        try {
            data = JSON.parse(data);
            if (!data.success) {
                console.log(data.error);
                return callback("Сервис ответил ошибкой")
            }

            callback(null, data.data);
        }
        catch (e) {
            callback("Данные какие-то странные");
        }
    });
}

module.exports.findCoordinates = function (text) {
    return false;
};

module.exports.getRoute = function (coordinates, callback) {
    getLastPoint((err, data) => {
        if (err) return callback("Ошибка построения пути!");

        callback(null, `http://static-maps.yandex.ru/1.x/?lang=en-US&l=map&size=600,400&pt=${data.lng},${data.lat},flag~${coordinates.lng},${coordinates.lon},flag`);
    });
};