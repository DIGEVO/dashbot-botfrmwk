'use strict';

require('dotenv').config();

const flow = require('../conversationflow');

module.exports = {
    getName: message => message.user.name.split(" ", 1)[0]
    ,

    saveIncomingMessage: (session, next) => {
        const userId = session.message.user.id;
        const cacheData = flow.cache.get(userId) || { paused: false };

        flow.cache.set(userId, {
            paused: cacheData.paused,
            name: module.exports.getName(session.message),
            address: session.message.address
        });
    }
};