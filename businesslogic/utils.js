'use strict';

require('dotenv').config();

module.exports = {
    /**
     * 
     * @param {*} connector 
     */

    startServer(connector) {
        var restify = require('restify');
        var server = restify.createServer();
        server.listen(
            process.env.port || process.env.PORT || 3978,
            () => console.log('%s listening to %s', server.name, server.url));
        server.post('/api/messages', connector.listen());
    },
    /**
     * 
     * @param {*} builder 
     */
    getConnector(builder) {
        return new builder.ChatConnector({
            appId: process.env.MicrosoftAppId,
            appPassword: process.env.MicrosoftAppPassword,
            stateEndpoint: process.env.BotStateEndpoint,
            openIdMetadata: process.env.BotOpenIdMetadata
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