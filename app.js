'use strict';

const builder = require('botbuilder');

const utils2 = require('./businesslogic/utils');

const dashbotwrap = require('./dashbotwrapper');
const middleware = require('./middleware');
const utils = require('./utils');
const flow = require('./conversationflow');

require('dotenv').config();

const bot = dashbotwrap.setDashbot(utils2.initBot());

middleware.initMiddleware(bot);
middleware.addIncomingMessageHandler(utils.saveIncomingMessage);

bot.dialog('/', flow.getWaterfall());

bot.dialog('BusinessDialog', [(session) => {
    session.endDialog(`Hola ${utils.getName(session.message)}, ` +
        `me dijiste: ${session.message.text}`);
}]);


