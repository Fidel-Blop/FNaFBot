var handler = async (m, { conn, usedPrefix, command }) => {
if (!db.data.chats[m.chat].economy && m.isGroup) {
return m.reply(`⚠️ 《✦》Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con:\n» *${usedPrefix}economy on*`)
}

let user = global.db.data.users[m.sender]
let now = Date.now()
let gap = 86400000
user.lastcofre = user.lastcofre || 0
user.coin = user.coin || 0
user.exp = user.exp || 0

if (now < user.lastcofre) {
let wait = formatTime(Math.floor((user.lastcofre - now) / 1000))
return conn.reply(m.chat, `⚠️ Los animatrónicos vigilan la oficina...\nDebes esperar *${wait}* para abrir otro cofre.`, m)
}

let reward = Math.floor(Math.random() * (60000 - 40000 + 1)) + 40000
let expGain = Math.floor(Math.random() * (111)) + 50
user.coin += reward
user.exp += expGain
user.lastcofre = now + gap

conn.reply(m.chat, `🎁 ${pickRandom(cofres)}\n> Has recibido *¥${reward.toLocaleString()} ${currency}*.`, m)
}

handler.help = ['cofre']
handler.tags = ['economía']
handler.command = ['coffer', 'cofre', 'abrircofre', 'cofreabrir']
handler.group = true

export default handler

function formatTime(totalSec) {
const h = Math.floor(totalSec / 3600)
const m = Math.floor((totalSec % 3600) / 60)
const s = totalSec % 60
const txt = []
if (h > 0) txt.push(`${h} hora${h !== 1 ? 's' : ''}`)
if (m > 0 || h > 0) txt.push(`${m} minuto${m !== 1 ? 's' : ''}`)
txt.push(`${s} segundo${s !== 1 ? 's' : ''}`)
return txt.join(' ')
}
function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]
}

const cofres = [
"Encontraste un cofre oxidado en la oficina principal de Freddy, con un brillo inquietante en su interior.",
"Hallaste un cofre cubierto de telarañas en el pasillo oscuro de Chica.",
"Un cofre se abre solo al activar la cámara de seguridad del restaurante abandonado.",
"Descubriste un cofre con restos de luces parpadeantes junto al escenario de los animatrónicos.",
"Te topaste con un cofre que emite un extraño sonido metálico en la cocina de Bonnie.",
"Un cofre cayó desde el conducto de ventilación y revela monedas antiguas y polvo.",
"Encontraste un cofre en la oficina de vigilancia, custodiado por una sombra que se mueve.",
"Hallaste un cofre entre los animatrónicos desactivados, sus ojos parpadean al abrirlo.",
"Te adentraste en el almacén y hallaste un cofre lleno de piezas mecánicas y joyas.",
"Un cofre sangrante se encuentra en el escenario principal, sus cerraduras chirrían al abrirlo.",
"Descubriste un cofre flotando en la cámara oscura, rodeado de neblina verde.",
"Te topaste con un cofre detrás del escenario de Freddy, custodiado por un animatrónico fantasma.",
"Encontraste un cofre antiguo en la sala de mantenimiento, con inscripciones de advertencia.",
"Un cofre se abre con un chasquido en el conducto de ventilación mientras un animatrónico observa.",
"Hallaste un cofre junto a la caja registradora, con monedas brillantes que desaparecen lentamente."
]
