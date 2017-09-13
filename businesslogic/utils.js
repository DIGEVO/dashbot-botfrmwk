'use strict';

require('dotenv').config();

module.exports = {
    /**
     * 
     * @param {*} connector 
     */
    startServer(connector) {
        if (process.env.NODE_ENV == 'development') {
            var restify = require('restify');
            var server = restify.createServer();
            server.listen(process.env.PORT, function () {
                console.log(`test bot endpont at http://localhost:${process.env.PORT}/api/messages`);
            });
            server.post('/api/messages', connector.listen());
            return {};
        } else {
            return { default: connector.listen() };
        }
    },
    /**
     * 
     * @param {*} builder 
     */
    getConnector(builder) {
        const botbuilder_azure = require('botbuilder-azure');
        return process.env.NODE_ENV == 'development' ?
            new builder.ChatConnector() :
            new botbuilder_azure.BotServiceConnector({
                appId: process.env['MicrosoftAppId'],
                appPassword: process.env['MicrosoftAppPassword'],
                stateEndpoint: process.env['BotStateEndpoint'],
                openIdMetadata: process.env['BotOpenIdMetadata']
            });
    },
    /**
     * 
     */
    getLUISModel: () => 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/' +
        `${process.env.LUIS_APP}?subscription-key=${process.env.LUIS_KEY}&timezoneOffset=0&verbose=true`,
    /**
     * 
     */
    dashbotApiMap: {
        'webchat': process.env.DASHBOT_API_KEY_GENERIC,
        'skype': process.env.DASHBOT_API_KEY_GENERIC,
        'emulator': process.env.DASHBOT_API_KEY_GENERIC,
    }
};