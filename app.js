'use strict';

const builder = require('botbuilder');
const utils = require('./businesslogic/utils');
const dashbotwrap = require('./businesslogic/dashbotwrapper');

const NodeCache = require('node-cache');
require('dotenv').config();

const cache = new NodeCache({ stdTTL: process.env.TTL || 7200 });

const bot = dashbotwrap.setDatbot(utils.initBot());

bot.dialog('/', [(session, args, next) => {
    const channelId = session.message.address.channelId;
    const userId = session.message.user.id;

    if (channelId === 'directline' && userId === 'DashbotChannel') {
        const msg = JSON.parse(session.message.text);
        const userCachedData = cache.get(msg.userId) || { paused: false, address: undefined };
        console.log(`--> ${JSON.stringify(userCachedData)}`);
        console.log(`--> ${JSON.stringify(session.message)}`);
        if (userCachedData.paused && userCachedData.address) {
            console.log(`after: ${userCachedData.address} - ${JSON.stringify(userCachedData)} - ${JSON.stringify(session.message)}`);

            bot.send(new builder.Message()
                .text('probando....')
                .address(userCachedData.address)
                .textLocale('es-ES'));
        } else {
            //TODO queda por ver q hacer en este punto..
            console.log(`...malo malo: ${msg.text || 'vacio'}`);
        }
    }
    else {
        console.log('-*-*-*-*-*-*-*-*');
        // console.log(`b4: ${session.message.address}`);
        // cache.set(userId, { paused: false, address: session.message.address });
        // session.beginDialog('/BusinessDialog');
        //session.endDialog();
    }
}]);

bot.dialog('/prueba', [(session) => {
    console.log(`---< ${session.message.user.id}`);
    session.send('pruebs......');
}]);

bot.dialog('/BusinessDialog', [(session) => {
    console.log(`---< ${session.message.user.id}`);
    session.send(`Hola6565 ${session.message.user.name.split(" ", 1)[0]}, ` +
        `me dijiste: ${session.message.text}, ${JSON.stringify(session.message.user)}, ` +
        `${session.message.address.channelId}`);
}]);





