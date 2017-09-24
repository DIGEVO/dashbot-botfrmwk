'use strict';

const builder = require('botbuilder');
const NodeCache = require('node-cache');
require('dotenv').config();

module.exports = {
    getWaterflow: () => [module.exports.firstStep, module.exports.finalStep]
    ,

    cache: new NodeCache({ stdTTL: process.env.TTL }),

    firstStep(session, args, next) {
        const channelId = session.message.address.channelId;
        const userId = session.message.user.id;

        if (channelId === 'directline' && userId === 'DashbotChannel') {
            module.exports.sendMessage(session);
            next();
        } else {
            const cacheData = module.exports.cache.get(userId) || { paused: false };
            if (!cacheData.paused)
                session.beginDialog(process.env.BUSINESSDIALOG);
            else
                next();
        }
    },

    finalStep(session, args, next) {
        session.endDialog();
    },

    sendMessage(session) {
        const msg = JSON.parse(session.message.text);
        const cacheData = module.exports.cache.get(msg.userId) || { paused: false, name: undefined, address: undefined };

        //TODO tener en cuenta el estado q tengo...arreglar mensaje tb.
        cacheData.paused = msg.paused;
        module.exports.cache.set(msg.userId, cacheData);

        let errorMsg = undefined;
        const name = cacheData.name ? ` ${cacheData.name}` : '';
        const text = module.exports.getText(msg);

        if (cacheData.address) {
            session.library.send(new builder.Message().text(text).address(cacheData.address));
        } else {
            errorMsg = `Error: No se pudo enviar el mensaje: "${msg.text}" ` +
                `al cliente "${msg.userId}" porque la dirección del mismo no aparece en la base de datos.`;
            console.error(errorMsg);
        }

        session.send(errorMsg || (msg.text ? 'Mensaje enviado.' : 'Detención/Activación del bot.'));
    },

    getText: msg => msg.text || (msg.paused ?
        `Hola${name}, a partir de este momento hablarás con una persona` :
        `Hola${name}, a partir de este momento hablarás con la plataforma`)

};