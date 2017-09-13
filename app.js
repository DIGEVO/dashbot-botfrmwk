'use strict';

const builder = require('botbuilder');
const utils = require('./businesslogic/utils');
const dashbotwrap = require('./businesslogic/dashbotwrapper');

const bot = dashbotwrap.setDatbot(utils.initBot());

// const dashbot = require('dashbot')(utils.dashbotApiMap).microsoft;


// bot.use(dashbot);

bot.dialog('/', (session) =>
    session.send(`Hola ${session.message.user.name.split(" ", 1)[0]}, me dijiste: ${session.message.text}`));





