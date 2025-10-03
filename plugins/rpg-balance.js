let handler = async (m, { conn, usedPrefix }) => {
if (!db.data.chats[m.chat].economy && m.isGroup) {
return m.reply(`👻 《✦》Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`)
}
let mentionedJid = await m.mentionedJid
let who = mentionedJid[0] ? mentionedJid[0] : m.quoted ? await m.quoted.sender : m.sender
let name = await (async () => global.db.data.users[who].name || (async () => { try { const n = await conn.getName(who); return typeof n === 'string' && n.trim() ? n : who.split('@')[0] } catch { return who.split('@')[0] } })())()
if (!(who in global.db.data.users)) return m.reply(`⚠️ El usuario no se encuentra en mi base de datos.`)
let user = global.db.data.users[who]
let coin = user.coin || 0
let bank = user.bank || 0
let total = (user.coin || 0) + (user.bank || 0)

const texto = `🕹️ *Balance de ${name}* 🕹️

👁️ Cartera » *¥${coin.toLocaleString()} ${currency}*  
🏦 Banco » *¥${bank.toLocaleString()} ${currency}*  
💰 Total » *¥${total.toLocaleString()} ${currency}*

⚠️ ¡Cuidado con los animatronicos! Deposita tu dinero en el banco usando *#deposit* para mantenerlo seguro durante la noche.`
await conn.reply(m.chat, texto, m)
}

handler.help = ['bal']
handler.tags = ['rpg']
handler.command = ['bal', 'balance', 'bank'] 
handler.group = true 

export default handler
