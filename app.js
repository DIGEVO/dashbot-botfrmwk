'use strict';

const builder = require('botbuilder');

// require('dotenv').config();

 const utils = require('./businesslogic/utils');

// const connector = utils.getConnector(builder);

// utils.startServer(connector);

// const bot = utils.getBot(builder, connector);

const bot = utils.initBot();

bot.dialog('/', (session) =>
    session.send(`Holaxx ${session.message.user.name.split(" ", 1)[0]}, me dijiste: ${session.message.text}`));





