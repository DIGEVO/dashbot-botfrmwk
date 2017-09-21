'use strict';

const builder = require('botbuilder');
const utils = require('./businesslogic/utils');
const dashbotwrap = require('./businesslogic/dashbotwrapper');

const NodeCache = require('node-cache');
require('dotenv').config();

const cache = new NodeCache({ stdTTL: process.env.TTL || 7200 });

const bot = dashbotwrap.setDatbot(utils.initBot());

bot.dialog('/', [
    proxy
]);

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

function proxy(session, args, next) {
    const channelId = session.message.address.channelId;
    const userId = session.message.user.id;

    if (channelId === 'directline' && userId === 'DashbotChannel') {
        const msg = JSON.parse(session.message.text);
        const userCachedData = cache.get(msg.userId) || { paused: false, address: undefined };

        userCachedData.paused = msg.paused;
        cache.set(msg.userId, userCachedData);
        let error = false;
        let errorMsg = '';
        let response = '';

        if (msg.text) {
            if (userCachedData.address) {
                bot.send(new builder.Message().text(msg.text).address(userCachedData.address));
            } else {
                error = true;
                errorMsg = `error: can't send message: ${msg.text}, client's address is missing.`;
                console.error(errorMsg);
            }
        }

        if (error) {
            response = errorMsg;
        } else {
            response = msg.text ? 'Message was sent.' : 'Pause/Activate bot';
        }

     //   session.send();
        session.endDialog(response);
    }
    else {
        console.log(`b4: ${session.message.address}`);
        cache.set(userId, { paused: false, address: session.message.address });
        session.beginDialog('/prueba');
    }
}

