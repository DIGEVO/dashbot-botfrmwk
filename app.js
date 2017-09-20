'use strict';

const builder = require('botbuilder');
const utils = require('./businesslogic/utils');
const dashbotwrap = require('./businesslogic/dashbotwrapper');

const bot = dashbotwrap.setDatbot(utils.initBot());

bot.dialog('/', (session) => {
    session.send(`Hola ${session.message.user.name.split(" ", 1)[0]}, `+
    `me dijiste: ${session.message.text}, ${JSON.stringify(session.message.user)}, ` +
    `${session.message.address.channelId}`);    
}
);





