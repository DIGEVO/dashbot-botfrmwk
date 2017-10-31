'use strict';

require('dotenv').config();

const flow = require('../conversationflow');
const dashbot = require('../dashbot');

const self = module.exports = {
    getName: message => message.user.name ?
        message.user.name.split(" ", 1)[0] :
        'usuario'
    ,

    saveIncomingMessageIntoCache: (session, next) => {
        const userId = session.message.user.id;
        const cacheData = flow.cache.get(userId) || { paused: false };

        flow.cache.set(userId, {
            paused: cacheData.paused,
            name: self.getName(session.message),
            address: session.message.address
        });
    },

    saveIncomingMessageIntoDashbot: (session, next) => {
        dashbot.logMessage(
            session.message.text, 
            session.message.user.id,
            session.message.address.conversation.id
        );
    },

    saveOutgoingMessageIntoDashbot: (event, next) => {
        dashbot.logMessage(
            event.text, 
            event.address.user.id,
            event.address.conversation.id,
            false
        );
    }
};