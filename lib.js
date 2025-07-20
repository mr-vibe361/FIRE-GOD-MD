const config = require('../config');

function applyFireEffects(sock) {
    // Enhanced typing indicators
    const originalSendPresenceUpdate = sock.sendPresenceUpdate.bind(sock);
    sock.sendPresenceUpdate = async (update, jid) => {
        if (config.theme.effects.presenceUpdate === 'burning') {
            if (update === 'composing') {
                await originalSendPresenceUpdate('composing', jid);
                await new Promise(resolve => setTimeout(resolve, 500));
                await originalSendPresenceUpdate('paused', jid);
                await new Promise(resolve => setTimeout(resolve, 300));
                await originalSendPresenceUpdate('composing', jid);
            }
        }
        return originalSendPresenceUpdate(update, jid);
    };

    // Message send effects
    const originalSendMessage = sock.sendMessage.bind(sock);
    sock.sendMessage = async (jid, content, options) => {
        // Add fire emoji to the beginning of all text messages
        if (content.text) {
            content.text = `🔥 ${content.text}`;
        }
        
        // Add fire effect to stickers
        if (content.sticker) {
            content.sticker = {
                ...content.sticker,
                ...config.stickerConfig
            };
        }
        
        return originalSendMessage(jid, content, options);
    };

    return sock;
}

module.exports = { applyFireEffects };
