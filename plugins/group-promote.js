var handler = async (m, { conn, usedPrefix, command, text, groupMetadata, isAdmin }) => {
    let mentionedJid = await m.mentionedJid
    let user = mentionedJid && mentionedJid.length ? mentionedJid[0] : m.quoted && await m.quoted.sender ? await m.quoted.sender : null
    if (!user) return conn.reply(m.chat, `🎭 ¡Atención! Debes mencionar a un usuario para que reciba privilegios en esta sala...`, m)
    
    try {
        const groupInfo = await conn.groupMetadata(m.chat)
        const ownerGroup = groupInfo.owner || m.chat.split('-')[0] + '@s.whatsapp.net'
        
        if (user === ownerGroup || groupInfo.participants.some(p => p.id === user && p.admin))
            return conn.reply(m.chat, '⚠️ El animatrónico mencionado ya tiene poderes de supervisor.', m)
        
        await conn.groupParticipantsUpdate(m.chat, [user], 'promote')
        
        await conn.reply(m.chat, `🎵 ¡Atención! ${user.split('@')[0]} ha sido promovido a administrador del grupo.\n🕹️ Ahora vigilará la sala con nosotros.`, m)
    } catch (e) {
        conn.reply(m.chat, `⚠︎ Se ha producido un fallo en el sistema de vigilancia.\n> Usa *${usedPrefix}report* para reportarlo.\n\n${e.message}`, m)
    }
}

handler.help = ['promote']
handler.tags = ['grupo']
handler.command = ['promote', 'promover']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
