const handler = async (m, { conn, usedPrefix, command }) => {
  if (!global.db.data.chats[m.chat]?.economy && m.isGroup) {
    return m.reply(`《✦》Los comandos de *Economía* están desactivados en este grupo.\n\nUn administrador puede activarlos con el comando:\n» *${usedPrefix}economy on*`)
  }

  const user = global.db.data.users[m.sender]
  user.lastrob = user.lastrob || 0

  if (Date.now() < user.lastrob) {
    const restante = user.lastrob - Date.now()
    return conn.reply(m.chat, `⌛ Debes esperar *${formatTime(restante)}* para usar *${usedPrefix + command}* nuevamente.`, m)
  }

  const mentionedJid = m.mentionedJid
  const who = mentionedJid?.[0] || m.quoted?.sender
  if (!who) return conn.reply(m.chat, `❌ Debes mencionar a alguien para intentar robarle.`, m)
  if (!(who in global.db.data.users)) return conn.reply(m.chat, `❌ El usuario no está en la base de datos.`, m)

  const target = global.db.data.users[who]
  const name = await (async () => {
    try {
      const n = await conn.getName(who)
      return typeof n === 'string' && n.trim() ? n : who.split('@')[0]
    } catch {
      return who.split('@')[0]
    }
  })()

  // Solo se puede robar si estuvo más de 1 hora inactivo
  if ((Date.now() - (target.lastwork || 0)) < 3600000) {
    return conn.reply(m.chat, `⏳ Solo puedes robar a *${name}* si estuvo más de 1 hora inactivo.`, m)
  }

  // Probabilidades de éxito
  const porcentajeExito = 0.6 // 60% de éxito
  const falloCritico = 0.1 // 10% de fallo crítico (pierde parte de sus monedas)

  const chance = Math.random()
  let mensaje = ''
  let robAmount = Math.floor(Math.random() * 1001) + 2000 // cantidad base a robar

  if (chance <= porcentajeExito) {
    // Éxito
    user.coin += robAmount
    target.coin = Math.max(0, target.coin - robAmount)
    mensaje = `🎃 ¡Éxito! Lograste robar *¥${robAmount.toLocaleString()} ${currency}* a *${name}* sin que los animatrónicos te atraparan.`
  } else if (chance <= porcentajeExito + falloCritico) {
    // Fallo crítico
    const perdio = Math.floor(Math.random() * 500) + 500
    user.coin = Math.max(0, user.coin - perdio)
    mensaje = `👻 ¡Fallaste catastróficamente! Los animatrónicos te atraparon y perdiste *¥${perdio.toLocaleString()} ${currency}*.`
  } else {
    // Fallo normal
    mensaje = `⚠️ Intentaste robar a *${name}*, pero los guardias de seguridad (animatrónicos) te sorprendieron. No perdiste monedas pero fracasaste.`
  }

  user.lastrob = Date.now() + 7200000 // cooldown 2 horas

  conn.reply(m.chat, mensaje, m)
}

handler.help = ['rob']
handler.tags = ['rpg', 'fnaf']
handler.command = ['robar', 'steal', 'rob']
handler.group = true
export default handler

function formatTime(ms) {
  const totalSec = Math.ceil(ms / 1000)
  const hours = Math.floor(totalSec / 3600)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60
  const parts = []
  if (hours) parts.push(`${hours} hora${hours !== 1 ? 's' : ''}`)
  if (minutes) parts.push(`${minutes} minuto${minutes !== 1 ? 's' : ''}`)
  parts.push(`${seconds} segundo${seconds !== 1 ? 's' : ''}`)
  return parts.join(' ')
}
