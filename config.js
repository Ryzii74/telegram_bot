const testChat = "-33965431";
const playersList = {
    ryzii : 59745477,
    kiseniya : 174422325,
    vental : 63910101,
    sloyArtur : 51822055,
    sloyNikita : 55787756,
    lyolya : 33916907,
    mashaMitina : 102450639,
    mitin : 33750740,
    aiv : 51493810,
    pich : 109884847,
    wanz : 46171958,
    mihan : 44549083
};

module.exports = function () {
    return {
        playersList: playersList,
        ownerId: playersList.ryzii,

        bot: {
            url: "https://api.telegram.org/bot115498454:AAFPBBUy6Em-8DkDfp38UfBuH7sP28v6vV8/",
            bot: '@testryziibot'
        },

        system: {
            userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36",
            url: {
                start: 'http://',
                end: '/gameengines/encounter/play/'
            },
            login: "/Login.aspx"
        },

        game: {
            host: 'chel.en.cx',
            id: '53921',
            chat_id: "-6170572",
            auth: {
                Login: "ryzii",
                Password: "",
                socialAssign: 0,
                EnButton1: "Вход",
                ddlNetwork: 1
            },
            players: [
                playersList.ryzii,
                playersList.kiseniya
            ]
        },

        path_to_commands: './commands/'
    };
}
