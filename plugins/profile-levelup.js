import { canLevelUp, xpRange } from '../lib/levelling.js'
import db from '../lib/database.js'

let handler = async (m, { conn }) => {
    let mentionedJid = await m.mentionedJid
    let who = mentionedJid[0] || (m.quoted ? await m.quoted.sender : m.sender)
    let user = global.db.data.users[who]
    let name = await (async () => user.name?.trim() || 
        (await conn.getName(who).then(n => typeof n === 'string' && n.trim() ? n : who.split('@')[0]).catch(() => who.split('@')[0]))
    )()

    if (!user) {
        await conn.sendMessage(m.chat, { text: "☠️ ERROR: No se encontraron datos del sobreviviente..." }, { quoted: m })
        return
    }

    let { min, xp } = xpRange(user.level, global.multiplier)
    let before = user.level * 1

    while (canLevelUp(user.level, user.exp, global.multiplier)) user.level++

    if (before !== user.level) {
        // ✦ Mensaje de subida de nivel estilo FNAF
        let txt = `🌌 ¡ALERTA! Nivel ascendiente detectado en Freddy's Night 🌌\n\n` +
                  `👤 *Jugador:* ${name}\n` +
                  `💀 *Nivel anterior:* ${before}\n` +
                  `🔦 *Nivel nuevo:* ${user.level}\n` +
                  `⏳ *Fecha:* ${new Date().toLocaleString('id-ID')}\n\n` +
                  `> 📝 Nota: Sobrevive más noches y gana más experiencia para subir de nivel...`
        await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
    } else {
        let users = Object.entries(global.db.data.users).map(([key, value]) => ({ ...value, jid: key }))
        let sortedLevel = users.sort((a, b) => (b.level || 0) - (a.level || 0))
        let rank = sortedLevel.findIndex(u => u.jid === who) + 1

        // ✦ Información de usuario estilo FNAF
        let txt = `🌙 *~ Freddy’s Status Report ~* 🌙\n\n` +
                  `👤 *Sobreviviente:* ${name}\n` +
                  `💀 *Nivel:* ${user.level}\n` +
                  `🔦 *Experiencia:* ${user.exp}\n` +
                  `⏱️ *Progreso:* ${user.exp - min} => ${xp} (${Math.floor(((user.exp - min) / xp) * 100)}%)\n` +
                  `🏆 *Ranking en la noche:* #${rank} de ${sortedLevel.length}\n` +
                  `🎮 *Comandos usados:* ${user.commands || 0}`
        await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
    }
}

handler.help = ['levelup']
handler.tags = ['rpg']
handler.command = ['nivel', 'lvl', 'level', 'levelup']
handler.group = true

export default handler
