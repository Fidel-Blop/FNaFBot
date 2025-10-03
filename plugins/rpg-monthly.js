var handler = async (m, { conn, usedPrefix }) => {
  if (!db.data.chats[m.chat].economy && m.isGroup) 
    return m.reply(`⚠️ Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`)

  let user = global.db.data.users[m.sender]
  const gap = 2592000000 // 30 días
  const now = Date.now()

  user.monthlyStreak = user.monthlyStreak || 0
  user.lastMonthlyGlobal = user.lastMonthlyGlobal || 0
  user.coin = user.coin || 0
  user.exp = user.exp || 0
  user.lastmonthly = user.lastmonthly || 0

  if (now < user.lastmonthly) {
    const wait = formatTime(Math.floor((user.lastmonthly - now) / 1000))
    return conn.reply(m.chat, `⌛ Ya reclamaste tu recompensa mensual.\n> Podrás hacerlo de nuevo en *${wait}* antes de que los animatrónicos vuelvan a la pizzería.`, m)
  }

  const lost = user.monthlyStreak >= 1 && now - user.lastMonthlyGlobal > gap * 1.5
  if (lost) user.monthlyStreak = 0

  const canClaimGlobal = now - user.lastMonthlyGlobal >= gap
  if (canClaimGlobal) {
    user.monthlyStreak = Math.min(user.monthlyStreak + 1, 8)
    user.lastMonthlyGlobal = now
  }

  const coins = Math.min(60000 + (user.monthlyStreak - 1) * 5000, 95000)
  const expRandom = Math.floor(Math.random() * (500 - 100 + 1)) + 100
  user.coin += coins
  user.exp += expRandom
  user.lastmonthly = now + gap

  let next = Math.min(60000 + user.monthlyStreak * 5000, 95000).toLocaleString()
  let msg = `> Mes *${user.monthlyStreak + 1}* » *+${next}*`
  if (lost) msg += `\n> 💀 ¡Has perdido tu racha de meses! Los animatrónicos acecharon tu recompensa.`

  conn.reply(m.chat, `🎉 「Monthly Reward」\nHas reclamado tu recompensa mensual de *+${coins.toLocaleString()} ${currency}* (Mes *${user.monthlyStreak}*)\n${msg}`, m)
}

handler.help = ['monthly', 'mensual']
handler.tags = ['rpg']
handler.command = ['monthly', 'mensual']
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
