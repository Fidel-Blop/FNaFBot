import moment from 'moment-timezone'

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
if (!text) return conn.reply(m.chat, `❀ El animatrónico no detecta ningún número... ingresa el número del objetivo para enviar la invitación.`, m)
if (text.includes('+')) return conn.reply(m.chat, `ꕥ El número no debe contener el símbolo *+*. Los animatrónicos lo odian.`, m)
if (isNaN(text)) return conn.reply(m.chat, `ꕥ Solo números, sin espacios ni códigos de país. Los sensores del animatrónico no reconocen otra cosa.`, m)

let group = m.chat
let link = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(group)
let tag = m.sender ? '@' + m.sender.split('@')[0] : 'Animatrónico'
const chatLabel = m.isGroup ? (await conn.getName(m.chat) || 'Grupal') : 'Privado'
const horario = `${moment.tz('America/Caracas').format('DD/MM/YYYY hh:mm:ss A')}`

// Mensaje con estilo FNaF
const invite = `
🎵 𝗔𝗟𝗘𝗥𝗧𝗔 𝗗𝗘 𝗜𝗡𝗩𝗜𝗧𝗔𝗖𝗜𝗢𝗡 🎵

⚠︎ Usuario que envía » ${tag}
⚠︎ Ubicación del grupo » ${chatLabel}
⚠︎ Fecha y hora » ${horario}

👁️ ¡Ojo! Este enlace permite acceder al grupo:
${link}

❗ Recuerda: los animatrónicos vigilan cada movimiento...
`

await conn.reply(`${text}@s.whatsapp.net`, invite.trim(), m, { mentions: [m.sender] })
m.reply(`❀ El enlace de invitación ha sido enviado. Mantente alerta... los animatrónicos siempre observan.`)
}

handler.help = ['invite']
handler.tags = ['group']
handler.command = ['add', 'agregar', 'añadir']
handler.group = true
handler.botAdmin = true

export default handler
