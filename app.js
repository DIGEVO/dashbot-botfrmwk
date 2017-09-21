'use strict';

const builder = require('botbuilder');
const utils = require('./businesslogic/utils');
const dashbotwrap = require('./businesslogic/dashbotwrapper');
const botresponse = require('./businesslogic/botresponse');

require('dotenv').config();

const bot = dashbotwrap.setDatbot(utils.initBot());

bot.dialog('/', [botresponse.proxy]);

bot.dialog('/prueba', [(session) => {
    console.log(`---< ${session.message.user.id}`);
    session.send('pruebs......');
}]);

bot.dialog('/BusinessDialog', [(session) => {
    console.log(`---< ${session.message.user.id}`);

    session.send(`Hola6565 ${session.message.user.name.split(" ", 1)[0]}, ` +
        `me dijiste: ${session.message.text}, ${JSON.stringify(session.message.user)}, ` +
        `${session.message.address.channelId}`);

    session.endDialog();
}]);


