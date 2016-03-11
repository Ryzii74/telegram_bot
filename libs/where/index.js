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
    var reg = /([\d]+)°[\s]+([\d]+)'[\s]([\d.]+)"/g;
    var matches = [], found;
    while (found = reg.exec(text)) {
        text = text.split(found[0])[1];
        matches.push(found);
    }

    if (!matches.length) return false;

    var coords = [];
    for (var i = 0; i < matches.length; i+=2) {
        coords.push({
            lat : calcCoord(matches[i]),
            lng : calcCoord(matches[i + 1])
        })
    }

    return coords;
};

function calcCoord(arr) {
    return Number(arr[1]) + Number(arr[2]) / 60 + Number(arr[3]) / 3600
}

module.exports.getRoute = function (coordinates, callback) {
    getLastPoint((err, data) => {
        if (err) return callback("Ошибка построения пути!");

        var route = `http://static-maps.yandex.ru/1.x/?lang=en-US&l=map&size=600,400&pt=${data.lng},${data.lat},flag`;
        coordinates.forEach(coords => {
            route += `~${coords.lng},${coords.lon},flag`
        });

        callback(null, route);
    });
};