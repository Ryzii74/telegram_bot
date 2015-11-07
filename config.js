var playersList = {
    ryzii : 59745477,
    kiseniya : 'Kiseniya',
    vental : 63910101,
    sloyArtur : 51822055,
    sloyRuslan : 'Grizzly174',
    sloyNikita : 55787756
};

module.exports = {
    bot : {
        url : "https://api.telegram.org/bot115498454:AAFPBBUy6Em-8DkDfp38UfBuH7sP28v6vV8/",
        bot : '@testryziibot'
    },

    game : {
        //url : 'http://demo.en.cx/gameengines/encounter/play/23373',
        url : 'http://chel.en.cx/gameengines/encounter/play/50948',
        host : 'chel.en.cx',
        //chat_id : "-33965431",
        chat_id : "-33965431",
        //referer : "http://demo.en.cx/gameengines/encounter/play/23373",
        referer : "http://chel.en.cx/GameDetails.aspx?gid=50948",
        cookie :   "GUID=f6af7916%2D561b%2D460f%2D9d3a%2Db2773918ff10; __utmt_t0=1; check=1; atoken=uid%3d1416666%26iss%3d0%26iscd%3d1%26tkn%3d719387eda0d25411c161267649c5b0584c8345ef; _ym_visorc_11409715=w; lang=ru; __utma=197665149.1157910272.1420107378.1437196256.1437199161.83; __utmb=197665149.12.10.1437199161; __utmc=197665149; __utmz=197665149.1434693275.71.9.utmcsr=vk.com|utmccn=(referral)|utmcmd=referral|utmcct=/en454000; Domain=chel%2Een%2Ecx; stoken=v4j54pyyxbzuhqypseryyddv",
        //cookie : "GUID=f6af7916%2D561b%2D460f%2D9d3a%2Db2773918ff10; __utma=142023398.1745113043.1436693934.1436693934.1436693934.1; __utmc=142023398; __utmz=142023398.1436693934.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmt_t0=1; check=1; atoken=uid%3d181101%26iss%3d0%26iscd%3d1%26tkn%3db71f0c7459d1f31483ff37183c1cf17536c8f3fb; lang=ru; __utma=197665149.1157910272.1420107378.1437196256.1437199161.83; __utmb=197665149.7.10.1437199161; __utmc=197665149; __utmz=197665149.1434693275.71.9.utmcsr=vk.com|utmccn=(referral)|utmcmd=referral|utmcct=/en454000; _ym_visorc_11409715=w; Domain=chel%2Een%2Ecx; stoken=v4j54pyyxbzuhqypseryyddv",
        players : [
            playersList.kiseniya,
            playersList.ryzii,
            playersList.vental,
            playersList.sloyRuslan,
            playersList.sloyNikita,
            playersList.sloyArtur
        ]
    },

    path_to_commands : './commands/',
    path_to_private_commands : './privateCommands/'
};
