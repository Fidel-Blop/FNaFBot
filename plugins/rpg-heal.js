let handler = async (m, { conn, usedPrefix, command }) => {
  if (!db.data.chats[m.chat].economy && m.isGroup) {
    return m.reply(`⚠️ *Economía Desactivada*\n\nUn *administrador* puede activarla con:\n» *${usedPrefix}economy on*`, m)
  }

  let user = global.db.data.users[m.sender]
  if (!user) return conn.reply(m.chat, `⚠️ El animatrónico no se encuentra en la base de datos.`, m)
  if (user.health >= 100) return conn.reply(m.chat, `✨ Tu salud ya está al máximo. Los engranajes funcionan perfectamente.`, m)
  if (user.coin <= 0) return conn.reply(m.chat, `⚡ No tienes suficientes ${currency} para activar el mantenimiento de tus sistemas.`, m)

  const faltante = 100 - user.health
  const disponible = Math.floor(user.coin / 50)
  const curable = Math.min(faltante, disponible)

  user.health += curable
  user.coin -= curable * 50
  user.lastHeal = Date.now()

  const info = `🩺 Mantenimiento completado.\n> Te has reparado *${curable} punto${curable !== 1 ? 's' : ''}* de salud.\n💰 ${currency} restantes: ¥${user.coin.toLocaleString()}\n❤️ Salud actual: ${user.health}\n⚠️ Los sistemas observan cada movimiento, ¡mantente alerta!`
  await conn.sendMessage(m.chat, { text: info }, { quoted: m })
}

handler.help = ['heal']
handler.tags = ['rpg']
handler.command = ['heal', 'curar']
handler.group = true

export default handler
