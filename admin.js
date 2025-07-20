const config = require('../config');
const logger = require('../utils/logger');

async function promoteUser(sock, groupJid, senderJid, userJid) {
    try {
        if (!userJid) {
            await sock.sendMessage(groupJid, { text: "Please mention a user to promote" });
            return;
        }
        
        await sock.groupParticipantsUpdate(
            groupJid,
            [userJid.replace('@s.whatsapp.net', '') + '@s.whatsapp.net'],
            "promote"
        );
        
        await sock.sendMessage(groupJid, {
            text: `🔥 @${userJid.split('@')[0]} has been blessed with admin powers by @${senderJid.split('@')[0]}!`,
            mentions: [userJid, senderJid]
        });
    } catch (error) {
        logger.error('Promote error:', error);
        await sock.sendMessage(groupJid, {
            text: `Failed to promote user. Only group admins can use this command.`
        });
    }
}

async function demoteUser(sock, groupJid, senderJid, userJid) {
    // Similar implementation to promoteUser but with "demote" action
}

async function kickUser(sock, groupJid, senderJid, userJid) {
    // Similar implementation with "remove" action
}

module.exports = { promoteUser, demoteUser, kickUser };
