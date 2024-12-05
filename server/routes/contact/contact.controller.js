;(function () {
  'use strict';

  module.exports.index = function () {
    return function (req, res) {

      let webChatUUID = process.env.WEB_CHAT_UUID || 'script_30142320647759e09fcf50.58043359';
      let webChatChannel = process.env.WEB_CHAT_CHANNEL || 'JCSB Webchat';
      let webChatChannelUUID = process.env.WEB_CHAT_CHANNEL_UUID || '-gQ6XyBuR02jGgGRk_Mazw';
      let webChatTenant = process.env.WEB_CHAT_TENANT || 'aG1jdHN4MTAx';

      return res.render('contact.njk', {
        webChatUUID: webChatUUID,
        webChatChannel: webChatChannel,
        webChatChannelUUID: webChatChannelUUID,
        webChatTenant: webChatTenant,
      });
    };
  };
})();
