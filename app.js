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
    const userId = session.message.user.id;
    const msg = JSON.parse(session.message.text);

    const userCachedData = cache.get(msg.userId) || { paused: false };

    if ((channelId === 'directline' && userId === 'DashbotChannel') || userCachedData.paused) {
        //reenviar lo q viene de dashbot...
        // console.log(`dashbot: ${session.message.text}`);
        // session.send('okok');
        //  cache.set(userId, {paused: true, id: '', conver});
        //   const msg = new builder.Message();
        //   msg.address()
        console.log(`after: ${userCachedData.address} - ${JSON.stringify(userCachedData)} - ${JSON.stringify(session.message)}`);

        bot.send(new builder.Message()
            .text('probando....')
            .address(userCachedData.address)
            .textLocale('es-ES'));
    }
    else {
        console.log(`b4: ${session.message.address}`);
        cache.set(userId, { paused: false, address: session.message.address });
        session.beginDialog('/BusinessDialog');
    }
});

bot.dialog('/BusinessDialog', (session) => {
    session.send(`Hola ${session.message.user.name.split(" ", 1)[0]}, ` +
        `me dijiste: ${session.message.text}, ${JSON.stringify(session.message.user)}, ` +
        `${session.message.address.channelId}`);
});





