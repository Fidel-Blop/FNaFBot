const handler = async (m, { isOwner, isAdmin, conn, text, participants, args, command }) => {
const pesan = args.join` `
const oi = `📢 *[MENSAJE DEL SISTEMA]*: ${pesan}`
let teks = `📡 *[TRANSMISIÓN DE VIGILANCIA - FNaF SYSTEM]* 📡\n  *DETECTADOS ${participants.length} MIEMBROS* 🕹️\n\n ${oi}\n\n╭── ✦ 𝅄 ꒷꒦꒷꒦ ✦ ──╮\n`
for (const mem of participants) {
teks += `│ 👁️ @${mem.id.split('@')[0]}\n`
}
teks += `╰── ✦ 𝅄 ꒷꒦꒷꒦ ✦ ──╯\n`
teks += `📍 Sistema en línea: *${botname}* | Versión: *${vs}*`

conn.sendMessage(m.chat, { text: teks, mentions: participants.map((a) => a.id) })
}

handler.help = ['todos']
handler.tags = ['group']
handler.command = ['todos', 'invocar', 'tagall']
handler.admin = true
handler.group = true

export default handler
