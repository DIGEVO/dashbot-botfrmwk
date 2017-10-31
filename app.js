'use strict';

const builder = require('botbuilder');

const botutils = require('./botutils');
const flow = require('./conversationflow');
const middleware = require('./middleware');
const utils = require('./utils');

require('dotenv').config();

const bot = botutils.initBot();

middleware.initMiddleware(bot);
middleware.addIncomingMessageHandler(utils.saveIncomingMessageIntoCache);
middleware.addIncomingMessageHandler(utils.saveIncomingMessageIntoDashbot);
middleware.addOutgoingMessageHandler(utils.saveOutgoingMessageIntoDashbot);

bot.dialog('/', flow.getWaterfall());

bot.dialog('BusinessDialog', [(session) => {
    session.endDialog(`Hola ${utils.getName(session.message)}, ` +
        `me dijiste: ${session.message.text}`);
}]);


