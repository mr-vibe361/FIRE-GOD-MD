require('dotenv').config();
const { Boom } = require('@hapi/boom');
const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@adiwajshing/baileys');
const qrcode = require('qrcode-terminal');
const config = require('./config');
const { handleCommands } = require('./handlers/commands');
const { handleEvents } = require('./handlers/events');
const { applyFireEffects } = require('./lib/fireEffects');
const logger = require('./utils/logger');

// Fire God MD ASCII Art
console.log(`
███████╗██╗██████╗ ███████╗     ██████╗  ██████╗ ██████╗ 
██╔════╝██║██╔══██╗██╔════╝    ██╔════╝ ██╔═══██╗██╔══██╗
█████╗  ██║██████╔╝█████╗      ██║  ███╗██║   ██║██║  ██║
██╔══╝  ██║██╔══██╗██╔══╝      ██║   ██║██║   ██║██║  ██║
██║     ██║██║  ██║███████╗    ╚██████╔╝╚██████╔╝██████╔╝
╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝     ╚═════╝  ╚═════╝ ╚═════╝ 
`);

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState(config.sessionName);
    
    const sock = makeWASocket({
        printQRInTerminal: true,
        auth: state,
        logger: logger,
        browser: ['FIRE-GOD-MD', 'Firefox', '3.0.0'],
        getMessage: async (key) => {
            // Fire God MD message retrieval enhancement
            return {
                conversation: "🔥 FIRE GOD MD is processing your request..."
            };
        }
    });

    // Apply fire effects to connection
    applyFireEffects(sock);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            qrcode.generate(qr, { small: true });
            logger.info('🔥 Scan the QR code to ignite FIRE GOD MD!');
        }

        if (connection === 'close') {
            const shouldReconnect = (new Boom(lastDisconnect?.error))?.output?.statusCode !== DisconnectReason.loggedOut;
            logger.warn(`Connection extinguished! ${shouldReconnect ? 'Reigniting...' : 'Please relogin.'}`);
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            logger.info('🔥 FIRE GOD MD is now blazing across WhatsApp!');
        }
    });

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('messages.upsert', async (m) => {
        await handleCommands(sock, m);
        await handleEvents(sock, m);
    });
}

connectToWhatsApp().catch(err => logger.error('Inferno startup failed:', err));
