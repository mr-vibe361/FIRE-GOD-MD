const config = require('../config');
const { handleAI } = require('./ai');
const { createSticker } = require('./stickers');
const { promoteUser, demoteUser, kickUser } = require('./admin');
const logger = require('../utils/logger');

async function handleCommands(sock, m) {
    try {
        const msg = m.messages[0];
        if (!msg.message) return;
        
        const text = msg.message.conversation || 
                     msg.message.extendedTextMessage?.text || 
                     msg.message.imageMessage?.caption || '';
        const isCmd = text.startsWith(config.prefix);
        const command = isCmd ? text.slice(config.prefix.length).trim().split(/ +/).shift().toLowerCase() : '';
        const args = isCmd ? text.slice(config.prefix.length + command.length).trim().split(/ +/) : [];
        const from = msg.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const sender = msg.key.participant || msg.key.remoteJid;
        
        // Fire God MD Auto-reply with delay
        if (config.autoReply.status && !isCmd && !isGroup) {
            setTimeout(async () => {
                await sock.sendMessage(from, { 
                    text: config.autoReply.message,
                    mentions: [sender]
                });
            }, config.autoReply.delay);
            return;
        }
        
        // Enhanced mention reply with fire effect
        if (msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.includes(sock.user.id.split(':')[0] + '@s.whatsapp.net')) {
            const query = text.replace(/@\d+/g, '').trim();
            await sock.sendMessage(from, { 
                text: `🔥 *FIRE GOD hears your call!* 🔥\nProcessing your request...`,
                mentions: [sender]
            });
            await handleAI(sock, from, query, sender);
            return;
        }
        
        if (!isCmd) return;
        
        // FIRE GOD MD Command processing
        switch(command) {
            case 'sticker':
            case 's':
                await createSticker(sock, msg);
                break;
                
            case 'ai':
                const query = args.join(' ');
                await handleAI(sock, from, query, sender);
                break;
                
            case 'promote':
                if (isGroup && config.group.adminOnlyCommands.includes('promote')) {
                    await promoteUser(sock, from, sender, args[0]);
                }
                break;
                
            case 'demote':
                if (isGroup && config.group.adminOnlyCommands.includes('demote')) {
                    await demoteUser(sock, from, sender, args[0]);
                }
                break;
                
            case 'kick':
                if (isGroup && config.group.adminOnlyCommands.includes('kick')) {
                    await kickUser(sock, from, sender, args[0]);
                }
                break;
                
            case 'fire':
                await sock.sendMessage(from, {
                    text: `🔥🔥🔥 *FIRE GOD POWER* 🔥🔥🔥\nThe flames grow stronger!`,
                    mentions: isGroup ? [sender] : []
                });
                break;
                
            case 'help':
                await showHelp(sock, from, isGroup);
                break;
                
            default:
                await sock.sendMessage(from, {
                    text: `❌ Unknown command: ${command}\nUse ${config.prefix}help for commands list`
                });
        }
    } catch (error) {
        logger.error('Command handler error:', error);
        await sock.sendMessage(from, {
            text: `💥 *FIRE GOD ERROR* 💥\nThe flames faltered!\nError: ${error.message}`
        });
    }
}

async function showHelp(sock, jid, isGroup = false) {
    const helpText = `
*${config.name} COMMANDS* 🔥

*General Commands:*
${config.prefix}sticker - Convert media to sticker
${config.prefix}ai <query> - Consult the FIRE GOD's wisdom
${config.prefix}fire - Show FIRE GOD power

${isGroup ? `
*Group Commands:*
${config.prefix}promote @user - Make user admin
${config.prefix}demote @user - Remove admin
${config.prefix}kick @user - Remove user
` : ''}

*Owner Commands:*
${config.prefix}restart - Restart bot
${config.prefix}stats - Show bot stats

🔥 *FIRE GOD MD* 🔥 v3.0
    `;
    
    await sock.sendMessage(jid, { text: helpText });
}

module.exports = { handleCommands };
