'use strict';

const builder = require('botbuilder');

require('dotenv').config();

const utils = require('./businesslogic/utils');

// Create chat connector for communicating with the Bot Framework Service
const connector = utils.getConnector(builder);
// var connector = new builder.ChatConnector({
//     appId: process.env.MicrosoftAppId,
//     appPassword: process.env.MicrosoftAppPassword,
//     stateEndpoint: process.env.BotStateEndpoint,
//     openIdMetadata: process.env.BotOpenIdMetadata
// });

var restify = require('restify');
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
// Listen for messages from users 
server.post('/api/messages', connector.listen());


const bot = new builder.UniversalBot(connector, {
    localizerSettings: {
        defaultLocale: process.env.DEFAULT_LOCALE
    }
});

bot.dialog('/', (session) =>
    session.send(`Hola1212 ${session.message.user.name.split(" ", 1)[0]}, me dijiste: ${session.message.text}`));





