var handler = async (m, { conn, usedPrefix, command }) => {
  if (!db.data.chats[m.chat].economy && m.isGroup) {
    return m.reply(`⚠️ Los comandos de *Economía* están desactivados.\n\nUn *administrador* puede activarlos con:\n» *${usedPrefix}economy on*`)
  }

  const user = global.db.data.users[m.sender]
  if (!user) return
  user.lastmine = user.lastmine || 0
  user.coin = user.coin || 0
  user.exp = user.exp || 0
  user.health = user.health || 100
  user.pickaxedurability = user.pickaxedurability || 100

  if (user.health < 5)
    return conn.reply(m.chat, `⚠️ No tienes suficiente salud para aventurarte en la *mina embrujada*.\n> Usa *"${usedPrefix}heal"* para repararte.`, m)

  const gap = 10 * 60 * 1000
  const now = Date.now()
  if (now < user.lastmine) {
    const restante = user.lastmine - now
    return conn.reply(m.chat, `⌛ Debes esperar *${formatTime(restante)}* antes de volver a excavar en la mina, los animatrónicos acechan.`, m)
  }

  user.lastmine = now + gap
  const evento = pickRandom(eventos)
  let monedas, experiencia, salud

  if (evento.tipo === 'victoria') {
    monedas = Math.floor(Math.random() * 2001) + 7000
    experiencia = Math.floor(Math.random() * 91) + 10
    salud = Math.floor(Math.random() * 3) + 1
    user.coin += monedas
    user.exp += experiencia
    user.health -= salud
  } else {
    monedas = Math.floor(Math.random() * 2001) + 3000
    experiencia = Math.floor(Math.random() * 41) + 10
    salud = Math.floor(Math.random() * 5) + 1
    user.coin -= monedas
    user.exp -= experiencia
    user.health -= salud
    if (user.coin < 0) user.coin = 0
    if (user.exp < 0) user.exp = 0
  }

  if (user.health < 0) user.health = 0
  const mensaje = `🌙 ${evento.mensaje} *¥${monedas.toLocaleString()} ${currency}*\n❤️ Salud restante: ${user.health}\n💰 Monedas: ¥${user.coin.toLocaleString()}`
  await conn.reply(m.chat, mensaje, m)
}

handler.help = ['minar']
handler.tags = ['economy']
handler.command = ['minar', 'miming', 'mine']
handler.group = true

export default handler

function formatTime(ms) {
  const totalSec = Math.ceil(ms / 1000)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60
  const parts = []
  if (minutes > 0) parts.push(`${minutes} minuto${minutes !== 1 ? 's' : ''}`)
  parts.push(`${seconds} segundo${seconds !== 1 ? 's' : ''}`)
  return parts.join(' ')
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

const eventos = [
  { tipo: 'victoria', mensaje: 'Has encontrado una veta de oro mientras sombras se movían tras ti. Ganaste.' },
  { tipo: 'victoria', mensaje: 'Descubriste una cámara secreta llena de gemas que brillan bajo la luz tenue. Ganaste.' },
  { tipo: 'victoria', mensaje: 'Un antiguo animatrónico dejó caer monedas a tu paso, recogiste el botín, ganaste.' },
  { tipo: 'victoria', mensaje: 'Excavaste un túnel oscuro y hallaste un cofre olvidado. Ganaste.' },
  { tipo: 'victoria', mensaje: 'Los cristales en la cueva emitían un resplandor extraño; encontraste un tesoro oculto, ganaste.' },
  { tipo: 'derrota', mensaje: 'Un sonido metálico te sobresaltó y perdiste parte de tus minerales. Perdiste.' },
  { tipo: 'derrota', mensaje: 'La mina tembló y parte del botín quedó atrapado bajo los escombros. Perdiste.' },
  { tipo: 'derrota', mensaje: 'Un animatrónico apareció y tu pico resbaló. Escapaste con las manos vacías. Perdiste.' },
  { tipo: 'derrota', mensaje: 'Caíste en una trampa olvidada por los antiguos mineros y perdiste varias gemas. Perdiste.' }
]
