var handler = async (m, { conn, usedPrefix }) => {
  if (!db.data.chats[m.chat].economy && m.isGroup) 
    return m.reply(`⚠️ *Sistema de Economía Desactivado*\n\nUn *administrador* puede activarlo con:\n» *${usedPrefix}economy on*`, m)

  let user = global.db.data.users[m.sender]
  let now = Date.now()
  let gap = 86400000 // 24 horas
  let maxStreak = 200

  user.streak = user.streak || 0
  user.lastDailyGlobal = user.lastDailyGlobal || 0
  user.lastDaily = user.lastDaily || 0
  user.coin = user.coin || 0
  user.exp = user.exp || 0

  if (now < user.lastDaily) {
    let wait = formatTime(Math.floor((user.lastDaily - now) / 1000))
    return conn.reply(m.chat, `🔔 Ya reclamaste tu *Daily* de hoy.\n> Vuelve en *${wait}* antes de que los animatrónicos te alcancen… 👀`, m)
  }

  // Comprobar si se perdió la racha
  let lostStreak = user.streak >= 1 && now - user.lastDailyGlobal > gap * 1.5
  if (lostStreak) user.streak = 0

  // Incrementar racha si puede reclamar global
  let canClaimGlobal = now - user.lastDailyGlobal >= gap
  if (canClaimGlobal) {
    user.streak = Math.min(user.streak + 1, maxStreak)
    user.lastDailyGlobal = now
  }

  let reward = Math.min(20000 + (user.streak - 1) * 5000, 1015000)
  let expRandom = Math.floor(Math.random() * 81) + 20 // Exp aleatoria entre 20 y 100
  user.coin += reward
  user.exp += expRandom
  user.lastDaily = now + gap

  let nextReward = Math.min(20000 + user.streak * 5000, 1015000).toLocaleString()
  let msg = `🎯 Día *${user.streak + 1}* » Recompensa: *¥${nextReward}*`
  if (lostStreak) msg += `\n💀 ¡Los animatrónicos se burlan de ti, perdiste tu racha! 😱`

  conn.reply(m.chat, 
    `🎪 *Freddy's Daily Bonus* 🎪\n\n👤 Usuario: *${user.name}*\n💰 Coins recibidos: *¥${reward.toLocaleString()} ${currency}*\n⚡ Experiencia obtenida: *${expRandom}*\n${msg}\n\n🕒 ¡Cuidado! Cada día sin reclamar, los animatrónicos se acercan… 👁️`, 
    m
  )
}

handler.help = ['daily']
handler.tags = ['rpg']
handler.command = ['daily', 'diario']
handler.group = true

export default handler

function formatTime(t) {
  const h = Math.floor(t / 3600)
  const m = Math.floor((t % 3600) / 60)
  const s = t % 60
  const parts = []
  if (h) parts.push(`🕒 ${h} hora${h !== 1 ? 's' : ''}`)
  if (m || h) parts.push(`⏱️ ${m} minuto${m !== 1 ? 's' : ''}`)
  parts.push(`⏳ ${s} segundo${s !== 1 ? 's' : ''}`)
  return parts.join(' ')
}
