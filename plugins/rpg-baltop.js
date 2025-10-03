let handler = async (m, { conn, args, participants, usedPrefix }) => {
if (!db.data.chats[m.chat].economy && m.isGroup) {
return m.reply(`⚠️ 《✦》Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con:\n» *${usedPrefix}economy on*`)
}

// Filtrar solo miembros del grupo
const groupJids = participants.map(p => p.id)
const users = Object.entries(global.db.data.users)
    .filter(([jid]) => groupJids.includes(jid))
    .map(([jid, data]) => ({ ...data, jid }))

if (users.length === 0) return m.reply('⚠️ No hay usuarios registrados en este grupo.')

const sorted = users.sort((a, b) => ((b.coin || 0) + (b.bank || 0)) - ((a.coin || 0) + (a.bank || 0)))
const totalPages = Math.ceil(sorted.length / 10)
const page = Math.max(1, Math.min(parseInt(args[0]) || 1, totalPages))
const startIndex = (page - 1) * 10
const endIndex = startIndex + 10

let text = `🕹️ *「 FNaF Economy Board 」* 🕹️\n\n⚡ Aquí están los animatrónicos y jugadores más ricos del grupo:\n\n`
const slice = sorted.slice(startIndex, endIndex)

for (let i = 0; i < slice.length; i++) {
    const { jid, coin, bank } = slice[i]
    const total = (coin || 0) + (bank || 0)
    let name = await (async () => global.db.data.users[jid].name?.trim() || (await conn.getName(jid).then(n => typeof n === 'string' && n.trim() ? n : jid.split('@')[0]).catch(() => jid.split('@')[0])))()
    text += `🎭 ${startIndex + i + 1} » *${name}*\n`
    text += `💰 Cartera → *¥${coin.toLocaleString()}*\n🏦 Banco → *¥${bank.toLocaleString()}*\n👑 Total → *¥${total.toLocaleString()} ${currency}*\n`
    text += `────────────────────────\n`
}

text += `\n🕰️ Página *${page}* de *${totalPages}*\n⚠️ Recuerda: ¡los animatrónicos también observan tu dinero! 👀`
await conn.reply(m.chat, text.trim(), m, { mentions: conn.parseMention(text) })
}

handler.help = ['baltop']
handler.tags = ['rpg']
handler.command = ['baltop', 'eboard', 'economyboard']
handler.group = true

export default handler
