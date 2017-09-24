'use strict';

module.exports = {
    initMiddleware: bot => bot.use({
        botbuilder: processIncomingMessage,
        send: processOutgoingMessage
    }),

    addIncomingMessageHandler(functionHandler) {
        inMsgFuns.push(functionHandler);
    },

    addOutgoingMessageHandler(functionHandler) {
        outMsgFuns.push(functionHandler);
    }
};

var inMsgFuns = [];
var outMsgFuns = [];

function processIncomingMessage(session, next) {
    processMessages(session, next, inMsgFuns, 'incoming');
}

function processOutgoingMessage(event, next) {
    processMessages(event, next, outMsgFuns, 'outgoing');
}

function processMessages(param1, param2, arrFuns, msg) {
    let errorMsg = '';

    arrFuns.forEach((fun, i) => {
        try {
            fun(param1, () => { });
        } catch (error) {
            errorMsg.concat(`Error on ${msg} message function ${i}: ${error}\n`);
        }
    });

    if (errorMsg !== '') console.error(errorMsg);

    param2();
}
