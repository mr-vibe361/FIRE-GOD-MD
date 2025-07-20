module.exports = {
    name: "FIRE-GOD-MD",
    prefix: ".",
    sessionName: "fire-god-session",
    openaiKey: process.env.OPENAI_KEY || "",
    ownerNumber: process.env.OWNER_NUMBER || "1234567890@s.whatsapp.net",
    
    // Fire God MD specific configurations
    theme: {
        colors: {
            primary: "#FF4500", // OrangeRed
            secondary: "#FF8C00", // DarkOrange
            accent: "#FFD700" // Gold
        },
        effects: {
            typingEffect: "flaming",
            presenceUpdate: "burning"
        }
    },
    
    // Enhanced group features
    group: {
        welcomeMessage: "🔥 *FIRE GOD* welcomes @user to the inferno! 🔥",
        goodbyeMessage: "⚡ @user has been consumed by the flames! ⚡",
        rules: "1. No spam\n2. Respect all members\n3. Keep it SFW",
        adminOnlyCommands: ['kick', 'promote', 'demote']
    },
    
    // Enhanced sticker settings
    stickerConfig: {
        packName: "FIRE-GOD",
        authorName: "FIRE GOD MD",
        categories: ['🔥', '⚡', '👑'],
        quality: 70,
        effect: "fire-border"
    },
    
    // Auto-reply enhancements
    autoReply: {
        status: true,
        message: "🔥 *FIRE GOD MD* is processing your request...",
        delay: 2000
    },
    
    // AI settings
    ai: {
        model: "gpt-4",
        temperature: 0.8,
        personality: "You are FIRE GOD, a powerful and mystical entity with deep knowledge of all things. Respond with wisdom but with occasional dramatic fire-related metaphors."
    }
}
