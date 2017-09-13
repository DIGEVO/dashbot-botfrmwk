'use strict';

const builder = require('botbuilder');
const utils = require('./businesslogic/utils');

const bot = utils.initBot();

bot.dialog('/', (session) =>
    session.send(`Holaxx ${session.message.user.name.split(" ", 1)[0]}, me dijiste: ${session.message.text}`));





