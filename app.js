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

        let errorMsg = undefined;
        const name = getName(session.message);
        const greetting = getGreetting(session.message);
        const text =
            msg.text ||
            (msg.paused ?
                `Hola ${name}, ${greetting}, a partir de este momento hablarás con una persona` :
                `Hola ${name}, ${greetting}, a partir de este momento hablarás con la plataforma`);

        if (userCachedData.address) {
            bot.send(new builder.Message().text(text).address(userCachedData.address));
        } else {
            errorMsg = `Error: No se puso enviar el mensaje: "${msg.text}" ` +
                `al cliente "${msg.userId}" porque la dirección del mismo no aparece en la base de datos.`;
            console.error(errorMsg);
        }

        session.endDialog(errorMsg || (msg.text ? 'Mensaje enviado.' : 'Detención/Activación del bot.'));
    }
    else {
        cache.set(userId, { paused: false, address: session.message.address });
        session.beginDialog('/prueba');
    }
}

function getName(message) {
    return message.user.name.split(" ", 1)[0];
}

function getGreetting(message) {
    const date = new Date(message.timestamp);
    const userLocalTime = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    const hour = userLocalTime.getHours();
    return hour < 12 ? 'buenos días' : hour >= 19 ? 'buenas noches' : 'buenas tardes';
}
