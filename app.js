'use strict';

const builder = require('botbuilder');
const utils = require('./businesslogic/utils');
const dashbotwrap = require('./businesslogic/dashbotwrapper');
const flow = require('./businesslogic/conversationflow');

require('dotenv').config();

const bot = dashbotwrap.setDatbot(utils.initBot());

bot.dialog('/', [
    flow.firstStep,
    flow.finalStep
]);

bot.dialog('/prueba', [(session) => {
    console.log(`---< ${session.message.user.id}`);
    const userId = session.message.user.id;
    cache.set(userId, session.message.address);

    session.send('pruebs......');
}]);

bot.dialog('/BusinessDialog', [(session) => {
    console.log(`---< ${session.message.user.id}`);

    session.send(`Hola6565 ${session.message.user.name.split(" ", 1)[0]}, ` +
        `me dijiste: ${session.message.text}, ${JSON.stringify(session.message.user)}, ` +
        `${session.message.address.channelId}`);

    session.endDialog();
}]);


