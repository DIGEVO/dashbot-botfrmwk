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

bot.dialog('/BusinessDialog', [(session) => {

    // // const cacheData = module.exports.cache.get(userId) || { paused: false, name: undefined, address: undefined };
    // // if (!cacheData.paused)
    // //     session.beginDialog('/BusinessDialog');
    // // else
    // //     next();
    // const userId = session.message.user.id;
    // const cacheData = module.exports.cache.get(userId) || { paused: false, name: undefined, address: undefined };

    // if (!cacheData.paused)
    // {}


    const userId = session.message.user.id;
    const cacheData = flow.cache.get(userId) || { paused: false };

    flow.cache.set(userId, {
        paused: cacheData.paused,
        name: utils.getName(session.message),
        address: session.message.address
    });

    console.log(`-> ${userId}`);

    // session.send(`Hola ${session.message.user.name.split(" ", 1)[0]}, ` +
    //     `me dijiste: ${session.message.text}`);

    session.endDialog(`Hola ${session.message.user.name.split(" ", 1)[0]}, ` +
        `me dijiste: ${session.message.text}`);
}]);


