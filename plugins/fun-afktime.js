export async function before(m, { conn }) {
    const primaryBot = global.db.data.chats[m.chat].primaryBot
    if (primaryBot && conn.user.jid !== primaryBot) throw !1

    const user = global.db.data.users[m.sender]
    user.coin = user.coin || 0
    user.exp = user.exp || 0

    const formatTiempo = (ms) => {
        if (typeof ms !== 'number' || isNaN(ms)) return 'desconocido'
        const h = Math.floor(ms / 3600000)
        const min = Math.floor((ms % 3600000) / 60000)
        const s = Math.floor((ms % 60000) / 1000)
        const parts = []
        if (h) parts.push(`${h} ${h === 1 ? 'hora' : 'horas'}`)
        if (min) parts.push(`${min} ${min === 1 ? 'minuto' : 'minutos'}`)
        if (s || (!h && !min)) parts.push(`${s} ${s === 1 ? 'segundo' : 'segundos'}`)
        return parts.join(' ')
    }

    // Manejo de usuario que vuelve de AFK
    if (typeof user.afk === 'number' && user.afk > -1) {
        const ms = Date.now() - user.afk
        const horas = Math.floor(ms / 3600000)
        const coins = horas * 200
        const exps = horas * 30
        user.coin += coins
        user.exp += exps
        const tiempo = formatTiempo(ms)
        const recompensa = coins > 0 ? `\n○ Recompensa » *${coins} ${currency}*` : ''
        await conn.reply(m.chat, 
`👁️ SISTEMA DE VIGILANCIA:
❀ ${await conn.getName(m.sender)} ya no está AFK.
○ Motivo » *${user.afkReason || 'sin especificar'}*
○ Tiempo inactivo » *${tiempo}* ${recompensa}
⚠️ Las cámaras indican que los animatrónicos podrían moverse.`, m)
        user.afk = -1
        user.afkReason = ''
    }

    // Aviso de usuarios mencionados que están AFK
    const quoted = m.quoted ? await m.quoted.sender : null
    const jids = [...new Set([...(await m.mentionedJid || []), ...(quoted ? [quoted] : [])])]

    for (const jid of jids) {
        const target = global.db.data.users[jid]
        if (!target || typeof target.afk !== 'number' || target.afk < 0) continue
        const ms = Date.now() - target.afk
        const tiempo = formatTiempo(ms)
        await conn.reply(m.chat, 
`🔔 ALERTA DE CÁMARA:
ꕥ El usuario ${await conn.getName(jid)} está AFK.
○ Motivo: ${target.afkReason || 'sin especificar'}
○ Tiempo inactivo: ${tiempo}
⚠️ Mantén las luces encendidas, los animatrónicos podrían moverse.`, m)
    }

    return true
}
