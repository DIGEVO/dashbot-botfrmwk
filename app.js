'use strict';

const builder = require('botbuilder');
const utils = require('./businesslogic/utils');
const dashbotwrap = require('./businesslogic/dashbotwrapper');

const NodeCache = require('node-cache');
require('dotenv').config();

const cache = new NodeCache({ stdTTL: process.env.TTL || 7200 });

const bot = dashbotwrap.setDatbot(utils.initBot());

bot.dialog('/', (session, args, next) => {
    //si el canal es directline y el usuario es dashbotchannel => es en vivo,
    //sino invoco al dialogo según lógica...
    const channelId = session.message.address.channelId;
    const userId = session.message.user.userId;
    userCachedData = cache.get(userId) || { paused: false };

    if ((channelId === 'directline' && userId === 'DashbotChannel') || userCachedData.paused) {
        //reenviar lo q viene de dashbot...
        console.log(`dashbot: ${session.message.text}`);
        session.send('okok');
    }
    else {
        session.beginDialog('/BusinessDialog');
    }
});

bot.dialog('/BusinessDialog', (session) => {
    session.send(`Hola ${session.message.user.name.split(" ", 1)[0]}, ` +
        `me dijiste: ${session.message.text}, ${JSON.stringify(session.message.user)}, ` +
        `${session.message.address.channelId}`);
});





