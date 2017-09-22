'use strict';

require('dotenv').config();

module.exports = {
    initBot() {
        console.log('iiiiiiiiiiii');
        const builder = require('botbuilder');
        const connector = module.exports.getConnector(builder);
        console.log('iiiiiiiiiiii 2');
        module.exports.startServer(connector);
        console.log('iiiiiiiiiiii 3');
        return module.exports.getBot(builder, connector);
    },

    startServer(connector) {
        var restify = require('restify');
        var server = restify.createServer();
        server.listen(
            process.env.port || process.env.PORT || 3978,
            () => console.log('%s listening to %s', server.name, server.url));
        server.post('/api/messages', connector.listen());
    },

    getConnector(builder) {
        return new builder.ChatConnector({
            appId: process.env.MicrosoftAppId,
            appPassword: process.env.MicrosoftAppPassword,
            stateEndpoint: process.env.BotStateEndpoint,
            openIdMetadata: process.env.BotOpenIdMetadata
        });
    },

    getLUISModel: () => 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/' +
        `${process.env.LUIS_APP}?subscription-key=${process.env.LUIS_KEY}&timezoneOffset=0&verbose=true`
    ,

    dashbotApiMap: {
        'facebook': process.env.DASHBOT_API_KEY_GENERIC,
        'webchat': process.env.DASHBOT_API_KEY_GENERIC,
        'skype': process.env.DASHBOT_API_KEY_GENERIC,
        'emulator': process.env.DASHBOT_API_KEY_GENERIC,
    },

    getBot(builder, connector) {
        return new builder.UniversalBot(connector, {
            localizerSettings: {
                defaultLocale: process.env.DEFAULT_LOCALE
            }
        });
    },

    getName: message => message.user.name.split(" ", 1)[0]
    ,

    getGreetting: message => {
        const date = new Date(message.timestamp);
        const userLocalTime = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
        const hour = userLocalTime.getHours();
        return hour < 12 ? 'buenos días' : hour >= 19 ? 'buenas noches' : 'buenas tardes';
    }
};