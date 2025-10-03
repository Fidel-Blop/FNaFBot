let handler = async (m, { conn, usedPrefix, command }) => {
  if (!global.db.data.chats[m.chat].economy && m.isGroup) {
    return m.reply(`⚠️ Los comandos de *Economía* están desactivados.\n\nUn *administrador* puede activarlos con:\n» *${usedPrefix}economy on*`, m)
  }

  let user = global.db.data.users[m.sender]
  if (!user) {
    global.db.data.users[m.sender] = { exp: 0, coin: 0, health: 100, lastHunt: 0 }
    user = global.db.data.users[m.sender]
  }

  user.coin = user.coin || 0
  user.exp = user.exp || 0
  user.health = user.health || 100
  user.lastHunt = user.lastHunt || 0

  if (user.health < 5)
    return conn.reply(m.chat, `⚠️ No tienes suficiente salud para aventurarte en la *noche de caza*. Usa *"${usedPrefix}heal"* para repararte.`, m)

  const cooldown = 15 * 60 * 1000
  const now = Date.now()
  if (now < user.lastHunt) {
    const restante = user.lastHunt - now
    return conn.reply(m.chat, `⌛ Debes esperar *${formatTime(restante)}* antes de aventurarte de nuevo en la noche.`, m)
  }

  user.lastHunt = now + cooldown
  const evento = pickRandom(eventos)
  let monedas, experiencia, salud

  if (evento.tipo === 'victoria') {
    monedas = Math.floor(Math.random() * 10001) + 1000
    experiencia = Math.floor(Math.random() * 91) + 30
    salud = Math.floor(Math.random() * 5) + 3
    user.coin += monedas
    user.exp += experiencia
    user.health -= salud
  } else {
    monedas = Math.floor(Math.random() * 2001) + 4000
    experiencia = Math.floor(Math.random() * 41) + 30
    salud = Math.floor(Math.random() * 5) + 3
    user.coin -= monedas
    user.exp -= experiencia
    user.health -= salud
    if (user.coin < 0) user.coin = 0
    if (user.exp < 0) user.exp = 0
  }

  if (user.health < 0) user.health = 0

  conn.reply(m.chat, `🌙 ${evento.mensaje} *¥${monedas.toLocaleString()} ${currency}*\n❤️ Salud restante: ${user.health}\n💰 Monedas: ¥${user.coin.toLocaleString()}\n⚠️ La noche acecha...`, m)
}

handler.tags = ['rpg']
handler.help = ['cazar', 'hunt']
handler.command = ['cazar', 'hunt']
handler.group = true

export default handler

function formatTime(ms) {
  const totalSec = Math.ceil(ms / 1000)
  const min = Math.floor((totalSec % 3600) / 60)
  const sec = totalSec % 60
  const parts = []
  if (min > 0) parts.push(`${min} minuto${min !== 1 ? 's' : ''}`)
  parts.push(`${sec} segundo${sec !== 1 ? 's' : ''}`)
  return parts.join(' ')
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

const eventos = [
  { tipo: 'victoria', mensaje: 'Has sobrevivido a la patrulla de animatrónicos y encontrado un botín en la oficina, ganaste.' },
  { tipo: 'victoria', mensaje: 'Te escondiste de los guardias mecánicos y recolectaste suministros valiosos, ganaste.' },
  { tipo: 'victoria', mensaje: 'Exploraste la cocina abandonada y hallaste monedas escondidas, ganaste.' },
  { tipo: 'victoria', mensaje: 'Lograste evadir cámaras de seguridad y atrapaste un premio oculto, ganaste.' },
  { tipo: 'victoria', mensaje: 'Has logrado sobrevivir a la sala de juego y recogiste objetos raros, ganaste.' },
  { tipo: 'derrota', mensaje: 'Un animatrónico te sorprendió y escapaste sin nada, perdiste.' },
  { tipo: 'derrota', mensaje: 'Tropezaste con un cable expuesto y tu botín se perdió, perdiste.' },
  { tipo: 'derrota', mensaje: 'La alarma se activó y los guardias te obligaron a huir, perdiste.' },
  { tipo: 'derrota', mensaje: 'Te atrapó un animatrónico en el pasillo y tu intento de caza falló, perdiste.' }
]
