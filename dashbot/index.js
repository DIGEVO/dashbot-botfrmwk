'use strict';

require('dotenv').config();

const dashbot = require('dashbot')(process.env.DASHBOT_API_KEY_GENERIC).generic;

const self = module.exports = {
    dashbotMessage: (text, userId, conversationId) => ({
        "text": text,
        "userId": userId
        // ,
        // "conversationId": conversationId
    }),

    logMessage: (text, userId, conversationId, incoming = true) =>
        self.logFuns[incoming](self.dashbotMessage(text, userId, conversationId))
    ,

    logFuns: {
        true: dashbot.logIncoming,
        false: dashbot.logOutgoing
    }
};
