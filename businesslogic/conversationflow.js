'use strict';

const NodeCache = require('node-cache');
require('dotenv').config();

const utils = require('./utils');

const cache = new NodeCache({ stdTTL: process.env.TTL || 7200 });

module.exports = {
    firstStep(session, args, next) {
        session.dialogData.activeBot = true;
        const channelId = session.message.address.channelId;
        const userId = session.message.user.id;

        if (channelId !== 'directline' || userId !== 'DashbotChannel') next();

        const msg = JSON.parse(session.message.text);
        console.log(`1: ${msg.userId}`);
        const userCachedData = cache.get(msg.userId) || { paused: false, address: undefined };

        userCachedData.paused = msg.paused;
        cache.set(msg.userId, userCachedData);

        let errorMsg = undefined;
        const name = utils.getName(session.message);
        const greetting = utils.getGreetting(session.message);
        const text =
            msg.text ||
            (msg.paused ?
                `Hola ${name}, ${greetting}, a partir de este momento hablarás con una persona` :
                `Hola ${name}, ${greetting}, a partir de este momento hablarás con la plataforma`);

        if (userCachedData.address) {
            bot.send(new builder.Message().text(text).address(userCachedData.address));
        } else {
            errorMsg = `Error: No se pudo enviar el mensaje: "${msg.text}" ` +
                `al cliente "${msg.userId}" porque la dirección del mismo no aparece en la base de datos.`;
            console.error(errorMsg);
        }

        session.send(errorMsg || (msg.text ? 'Mensaje enviado.' : 'Detención/Activación del bot.'));
        session.dialogData.activeBot = false;
    },

    secondStep(session, args, next) {
        if (session.dialogData.activeBot) next();

        console.log(`2: ${userId}`);
        cache.set(userId, { paused: false, address: session.message.address });
        session.beginDialog('/prueba');
    },

    finalStep(session, args, next){
        session.endDialog();
    }
    //,

    // proxy: (session, args, next) => {
    //     const channelId = session.message.address.channelId;
    //     const userId = session.message.user.id;

    //     if (channelId === 'directline' && userId === 'DashbotChannel') {
    //         const msg = JSON.parse(session.message.text);
    //         console.log(`1: ${msg.userId}`);
    //         const userCachedData = cache.get(msg.userId) || { paused: false, address: undefined };

    //         userCachedData.paused = msg.paused;
    //         cache.set(msg.userId, userCachedData);

    //         let errorMsg = undefined;
    //         const name = utils.getName(session.message);
    //         const greetting = utils.getGreetting(session.message);
    //         const text =
    //             msg.text ||
    //             (msg.paused ?
    //                 `Hola ${name}, ${greetting}, a partir de este momento hablarás con una persona` :
    //                 `Hola ${name}, ${greetting}, a partir de este momento hablarás con la plataforma`);

    //         if (userCachedData.address) {
    //             bot.send(new builder.Message().text(text).address(userCachedData.address));
    //         } else {
    //             errorMsg = `Error: No se pudo enviar el mensaje: "${msg.text}" ` +
    //                 `al cliente "${msg.userId}" porque la dirección del mismo no aparece en la base de datos.`;
    //             console.error(errorMsg);
    //         }

    //         session.endDialog(errorMsg || (msg.text ? 'Mensaje enviado.' : 'Detención/Activación del bot.'));
    //     }
    //     else {
    //         console.log(`2: ${userId}`);
    //         cache.set(userId, { paused: false, address: session.message.address });
    //         session.beginDialog('/prueba');
    //     }
    // }
};