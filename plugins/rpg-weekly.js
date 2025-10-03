var handler = async (m, { conn, usedPrefix }) => {
  if (!db.data.chats[m.chat].economy && m.isGroup) 
    return m.reply(`《✦》Los comandos de *Economía* están desactivados en este grupo.\n\nUn administrador puede activarlos con el comando:\n» *${usedPrefix}economy on*`)

  let user = global.db.data.users[m.sender]
  const gap = 604800000 // 7 días
  const now = Date.now()

  user.weeklyStreak = user.weeklyStreak || 0
  user.lastWeeklyGlobal = user.lastWeeklyGlobal || 0
  user.coin = user.coin || 0
  user.exp = user.exp || 0
  user.lastweekly = user.lastweekly || 0

  if (now < user.lastweekly) {
    const wait = formatTime(Math.floor((user.lastweekly - now) / 1000))
    return conn.reply(m.chat, `⏳ Ya has reclamado tu recompensa semanal.\n> Puedes reclamarlo de nuevo en *${wait}*`, m)
  }

  // Se pierde la racha si estuvo inactivo mucho tiempo
  const lost = user.weeklyStreak >= 1 && now - user.lastWeeklyGlobal > gap * 1.5
  if (lost) user.weeklyStreak = 0

  const canClaimWeeklyGlobal = now - user.lastWeeklyGlobal >= gap
  if (canClaimWeeklyGlobal) {
    user.weeklyStreak = Math.min(user.weeklyStreak + 1, 30)
    user.lastWeeklyGlobal = now
  }

  // Base de recompensa
  let coins = Math.min(40000 + (user.weeklyStreak - 1) * 5000, 185000)
  let expRandom = Math.floor(Math.random() * (200 - 50 + 1)) + 50

  // Riesgo de animatrónicos si la racha es alta
  if (user.weeklyStreak >= 5 && Math.random() < 0.1) {
    const perdida = Math.floor(coins * 0.2)
    coins -= perdida
    user.coin -= perdida
    conn.reply(m.chat, `👻 ¡Cuidado! Un animatrónico se ha activado y robó parte de tu recompensa: -¥${perdida.toLocaleString()} ${currency}`, m)
  }

  user.coin += coins
  user.exp += expRandom
  user.lastweekly = now + gap

  let nextReward = Math.min(40000 + user.weeklyStreak * 5000, 185000).toLocaleString()
  let msg = `> Semana *${user.weeklyStreak + 1}* » *+¥${nextReward}*`
  if (lost) msg += `\n> ⚠️ ¡Has perdido tu racha de semanas debido a un apagón en la pizzería!`

  conn.reply(m.chat, `🎉 Has sobrevivido otra semana en la pizzería y reclamaste tu recompensa semanal de *¥${coins.toLocaleString()} ${currency}* (Semana *${user.weeklyStreak}*)\n${msg}`, m)
}

handler.help = ['weekly', 'semanal']
handler.tags = ['rpg', 'fnaf']
handler.command = ['weekly', 'semanal']
handler.group = true

export default handler

function formatTime(t) {
  const d = Math.floor(t / 86400)
  const h = Math.floor((t % 86400) / 3600)
  const m = Math.floor((t % 3600) / 60)
  const s = t % 60
  if (d) return `${d} día${d !== 1 ? 's' : ''} ${h} hora${h !== 1 ? 's' : ''} ${m} minuto${m !== 1 ? 's' : ''}`
  if (h) return `${h} hora${h !== 1 ? 's' : ''} ${m} minuto${m !== 1 ? 's' : ''} ${s} segundo${s !== 1 ? 's' : ''}`
  if (m) return `${m} minuto${m !== 1 ? 's' : ''} ${s} segundo${s !== 1 ? 's' : ''}`
  return `${s} segundo${s !== 1 ? 's' : ''}`
}
