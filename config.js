const testChat = "-33965431";
const playersList = {
    ryzii : 59745477,
    kiseniya : 174422325,
    vental : 63910101,
    sloyArtur : 51822055,
    sloyRuslan : 'Grizzly174',
    sloyNikita : 55787756,
    lyolya : 33916907,
    mashaMitina : 102450639,
    mitin : 33750740,
    aiv : 51493810
};

module.exports = {
    playersList : playersList,

    bot : {
        url : "https://api.telegram.org/bot115498454:AAFPBBUy6Em-8DkDfp38UfBuH7sP28v6vV8/",
        bot : '@testryziibot'
    },

    system : {
        userAgent : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36",
        url : {
            start : 'http://',
            end : '/gameengines/encounter/play/'
        },
        login : "/Login.aspx"
    },

    game : {
        host : 'demo.en.cx',
        id : '23373',
        chat_id : testChat,
        auth : {
            Login : "",
            Password : "",
            socialAssign : 0,
            EnButton1 : "Вход",
            ddlNetwork : 1
        },
        players : [
            playersList.ryzii,
            playersList.kiseniya
        ]
    },

    path_to_commands : './commands/',
    path_to_private_commands : './privateCommands/'
};
