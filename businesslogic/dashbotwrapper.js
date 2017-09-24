'use strict';

require('dotenv').config();

module.exports = {
    setDatbot(bot) {
        const dashbotApiMap = {
            'facebook': process.env.DASHBOT_API_KEY_GENERIC,
            'webchat': process.env.DASHBOT_API_KEY_GENERIC,
            'skype': process.env.DASHBOT_API_KEY_GENERIC,
            'emulator': process.env.DASHBOT_API_KEY_GENERIC
        };
        const dashbot = require('dashbot')(dashbotApiMap).microsoft;
        dashbot.setFacebookToken(process.env.FACEBOOK_PAGE_TOKEN)
        bot.use(dashbot);

        return bot;
    }
};

