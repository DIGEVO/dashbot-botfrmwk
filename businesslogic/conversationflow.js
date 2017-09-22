'use strict';

const builder = require('botbuilder');

const NodeCache = require('node-cache');
require('dotenv').config();

const utils = require('./utils');

//const cache = new NodeCache({ stdTTL: process.env.TTL || 7200 });

module.exports = {
    cache: new NodeCache({ stdTTL: 0 }),

    firstStep(session, args, next) {
        const channelId = session.message.address.channelId;
        const userId = session.message.user.id;

        if (channelId === 'directline' && userId === 'DashbotChannel') {
            module.exports.sendMessage(session);
            next();
        } else {
            session.beginDialog('/prueba');
        }
    },

    finalStep(session, args, next) {
        console.log('ending dialog');
        session.endDialog();
    },

    sendMessage(session) {
        const msg = JSON.parse(session.message.text);
        const cacheData = module.exports.cache.get(msg.userId) || { name: undefined, address: undefined };

        let errorMsg = undefined;
        const name = cacheData.name ? ` ${cacheData.name}` : '';
        const greetting = utils.getGreetting(session.message);
        const text =
            msg.text ||
            (msg.paused ?
                `Hola${name}, ${greetting}, a partir de este momento hablarás con una persona` :
                `Hola${name}, ${greetting}, a partir de este momento hablarás con la plataforma`);

        if (cacheData.address) {
            session.library.send(new builder.Message().text(text).address(address));
        } else {
            errorMsg = `Error: No se pudo enviar el mensaje: "${msg.text}" ` +
                `al cliente "${msg.userId}" porque la dirección del mismo no aparece en la base de datos.`;
            console.error(errorMsg);
        }

        session.send(errorMsg || (msg.text ? 'Mensaje enviado.' : 'Detención/Activación del bot.'));
    }
};
