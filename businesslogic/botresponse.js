'use strict';

const NodeCache = require('node-cache');
require('dotenv').config();

const cache = new NodeCache({ stdTTL: process.env.TTL || 7200 });

module.exports = {
    // begingTheFeed(session, args, next) {
    //     session.dialogData. = args.entities;
    //     session.dialogData.intent = args.intent;
    //     next();
    // }
    getWaterfalls(){}
};
