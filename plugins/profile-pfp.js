let handler = async (m, { conn }) => {
    let mentionedJid = await m.mentionedJid
    let who = await m.quoted?.sender || mentionedJid?.[0]

    if (!who) return conn.sendMessage(m.chat, { 
        text: '🌙 ERROR: Debes mencionar al sobreviviente para ver su perfil… ⚠️' 
    }, { quoted: m })

    let name = await (async () => global.db.data.users[who].name || 
        (async () => { 
            try { 
                const n = await conn.getName(who); 
                return typeof n === 'string' && n.trim() ? n : who.split('@')[0] 
            } catch { 
                return who.split('@')[0] 
            } 
        })()
    )()

    let pp = await conn.profilePictureUrl(who, 'image')
        .catch(() => 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg')

    await m.react('🕒')
    await conn.sendFile(
        m.chat, 
        pp, 
        'profile.jpg', 
        `🔦 ¡Atención! Foto de perfil del sobreviviente:\n\n👤 *${name}*\n⚠️ Recuerda: Freddy está observando…`, 
        m
    )
    await m.react('✔️')
}

handler.help = ['pfp']
handler.tags = ['sticker']
handler.command = ['pfp', 'getpic']

export default handler
