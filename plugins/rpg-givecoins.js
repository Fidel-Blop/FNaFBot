async function handler(m, { conn, args, usedPrefix, command }) {
  if (!db.data.chats[m.chat].economy && m.isGroup) {
    return m.reply(`⚠️ *Economía Desactivada*\n\nUn *administrador* puede activarla con:\n» *${usedPrefix}economy on*`, m)
  }

  let mentionedJid = await m.mentionedJid
  const who = m.quoted ? await m.quoted.sender : (mentionedJid && mentionedJid[0]) || (args[1] ? (args[1].replace(/[@ .+-]/g, '') + '@s.whatsapp.net') : '')   

  if (!args[0]) return m.reply(`🎭 Debes indicar a quién deseas transferir *${currency}*.\n> Ejemplo » *${usedPrefix + command} 25000 @mencion*`)
  if (!isNumber(args[0]) && args[0].startsWith('@')) return m.reply(`⚡ Primero indica la cantidad que deseas transferir, seguido del destinatario.\n> Ejemplo: *${usedPrefix + command} 1000 @mencion*`)
  if (!who) return m.reply(`⚡ Debes mencionar a alguien para enviar *${currency}*.`)
  if (!(who in global.db.data.users)) return m.reply(`⚡ El animatrónico que intentas pagar no existe en la base de datos.`)

  let user = global.db.data.users[m.sender]
  let recipient = global.db.data.users[who]
  let count = Math.min(Number.MAX_SAFE_INTEGER, Math.max(10, (isNumber(args[0]) ? parseInt(args[0]) : 10)))

  if (typeof user.bank !== 'number') user.bank = 0
  if (user.bank < count) return m.reply(`⚠️ No tienes suficientes *${currency}* en el banco para transferir.`)

  user.bank -= count
  if (typeof recipient.bank !== 'number') recipient.bank = 0
  recipient.bank += count   
  if (isNaN(user.bank)) user.bank = 0

  let name = await (async () => global.db.data.users[who].name || (async () => { 
    try { 
      const n = await conn.getName(who); 
      return typeof n === 'string' && n.trim() ? n : who.split('@')[0] 
    } catch { return who.split('@')[0] } 
  })())()

  m.reply(`💰 Una transferencia silenciosa se realiza en la oscuridad...\n> Enviaste *¥${count.toLocaleString()} ${currency}* a *${name}*\n> Ahora tu banco contiene *¥${user.bank.toLocaleString()} ${currency}*`, null, { mentions: [who] })
}

handler.help = ['pay']
handler.tags = ['rpg']
handler.command = ['pay', 'coinsgive', 'givecoins']
handler.group = true

export default handler

function isNumber(x) {
  return !isNaN(x)
}
