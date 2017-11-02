'use strict';

const rp = require('request-promise-native');
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
        rp
            .post({
                method: 'POST',
                auth: { 'bearer': process.env.DIALOGFLOW_TOKEN },
                uri: process.env.URL,
                body: {
                    query: session.message.text,
                    sessionId: 'dashbot-integration'
                },
                json: true
            })
            .then(data => data.result.metadata.intentName ? {
                name: data.result.metadata.intentName,
                inputs: Object.keys(data.result.parameters)
                    .map(k => ({ name: k, value: data.result.parameters[k] }))
                    .filter(kv => kv.value)
            } : undefined)
            .then(intent => dashbot.logMessage({
                text: session.message.text,
                userId: session.message.user.id,
                intent: intent
            }))
            .catch(error => console.error(error));
    },

    saveOutgoingMessageIntoDashbot: (event, next) => {
        dashbot.logMessage({
            text: event.text,
            userId: event.address.user.id,
            incoming: false
        });
    }
};