var handler = async (m, { conn, participants, usedPrefix, command }) => {
    let mentionedJid = await m.mentionedJid
    let user = mentionedJid && mentionedJid.length ? mentionedJid[0] : m.quoted && await m.quoted.sender ? await m.quoted.sender : null
    if (!user) return conn.reply(m.chat, `⚠️ ❀ Debes mencionar a un intruso que quieras expulsar del grupo… Los animatrónicos no permitirán que quede libre.`, m)

    try {
        const groupInfo = await conn.groupMetadata(m.chat)
        const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
        const ownerBot = global.owner[0][0] + '@s.whatsapp.net'

        if (user === conn.user.jid) return conn.reply(m.chat, `🛑 No puedo eliminarme a mí mismo… los animatrónicos tampoco me dejarían.`, m)
        if (user === ownerGroup) return conn.reply(m.chat, `⚠️ No puedo eliminar al creador del grupo… incluso los animatrónicos lo respetan.`, m)
        if (user === ownerBot) return conn.reply(m.chat, `⚠️ No puedo eliminar al propietario del bot. Su presencia es inquebrantable.`, m)

        await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
        conn.reply(m.chat, `🔪 El intruso ${user.split('@')[0]} ha sido expulsado… los animatrónicos vigilan que no regrese.`, m)
    } catch (e) {
        conn.reply(m.chat, `⚠︎ Ha ocurrido un error en la operación.\n> Usa *${usedPrefix}report* para reportarlo.\n\n${e.message}`, m)
    }
}

handler.help = ['kick']
handler.tags = ['grupo']
handler.command = ['kick', 'echar', 'hechar','sacar', 'ban']
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler
