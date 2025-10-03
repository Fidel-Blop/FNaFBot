let handler = async (m, { conn, command, usedPrefix }) => {
  if (!global.db.data.chats[m.chat].economy && m.isGroup) {
    return m.reply(`⚠️ *Sistema de Economía Desactivado*\n\nUn *administrador* puede activarlo con:\n» *${usedPrefix}economy on*`, m)
  }

  let user = global.db.data.users[m.sender]
  if (!user) global.db.data.users[m.sender] = user = { health: 100, coin: 0, exp: 0, lastDungeon: 0 }

  if (user.health < 5)
    return conn.reply(m.chat, `⚠️ Tu salud es demasiado baja para adentrarte en la oficina abandonada...\n> Usa *${usedPrefix}heal* antes de enfrentarte a los animatrónicos.`, m)

  const cooldown = 18 * 60 * 1000
  const ahora = Date.now()

  if (ahora < user.lastDungeon) {
    const restante = user.lastDungeon - ahora
    const wait = formatTimeMs(restante)
    return conn.reply(m.chat, `⏳ Debes esperar *${wait}* antes de volver a la oficina.\n> Los animatrónicos descansan, pero vigilan...`, m)
  }

  user.lastDungeon = ahora + cooldown
  const evento = pickRandom(eventos)
  let monedas, experiencia, salud

  if (evento.tipo === 'victoria') {
    monedas = Math.floor(Math.random() * 3001) + 12000
    experiencia = Math.floor(Math.random() * 71) + 30
    salud = Math.floor(Math.random() * 3) + 8
    user.coin += monedas
    user.exp += experiencia
    user.health -= salud
  } else if (evento.tipo === 'derrota') {
    monedas = Math.floor(Math.random() * 2001) + 6000
    experiencia = Math.floor(Math.random() * 31) + 40
    salud = Math.floor(Math.random() * 3) + 8
    user.coin -= monedas
    user.exp -= experiencia
    user.health -= salud
    if (user.coin < 0) user.coin = 0
    if (user.exp < 0) user.exp = 0
  } else {
    experiencia = Math.floor(Math.random() * 61) + 30
    user.exp += experiencia
  }

  if (user.health < 0) user.health = 0

  const resultado = `🎮 ${evento.mensaje} ${evento.tipo === 'trampa' ? '' : evento.tipo === 'victoria' ? `ganaste. *${monedas.toLocaleString()} ${currency}* 🪙` : `perdiste. *${monedas.toLocaleString()} ${currency}* 😱`}`

  await conn.reply(m.chat, resultado.trim(), m)
  await global.db.write()
}

handler.tags = ['rpg']
handler.help = ['dungeon', 'mazmorra']
handler.command = ['dungeon', 'mazmorra']
handler.group = true

export default handler

function formatTimeMs(ms) {
  const totalSec = Math.ceil(ms / 1000)
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  const partes = []
  if (min) partes.push(`${min} minuto${min !== 1 ? 's' : ''}`)
  partes.push(`${sec} segundo${sec !== 1 ? 's' : ''}`)
  return partes.join(' ')
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

const eventos = [
  // Victoria
  { tipo: 'victoria', mensaje: 'Lograste esquivar al animatrónico guardián y encontraste una bolsa de monedas,' },
  { tipo: 'victoria', mensaje: 'Descubriste una sala secreta llena de chucherías y ganancias,' },
  { tipo: 'victoria', mensaje: 'El fantasma del antiguo vigilante te deja un bono de experiencia,' },
  { tipo: 'victoria', mensaje: 'Encuentras una consola de seguridad que te otorga recursos extra,' },
  { tipo: 'victoria', mensaje: 'Superaste la noche sin ser detectado, y recibes un premio especial,' },
  { tipo: 'victoria', mensaje: 'Derrotaste a un animatrónico rebelde y recolectaste suministros valiosos,' },
  { tipo: 'victoria', mensaje: 'Logras abrir la caja fuerte de la oficina abandonada, hallando monedas,' },
  { tipo: 'victoria', mensaje: 'Recoges un paquete de recompensas olvidado por el guardia anterior,' },
  { tipo: 'victoria', mensaje: 'Triunfas sobre el mini-juego de seguridad y obtienes una recompensa,' },
  { tipo: 'victoria', mensaje: 'Encuentras un cofre oculto detrás del escenario de Freddy, lleno de monedas,' },
  // Derrota
  { tipo: 'derrota', mensaje: 'Un animatrónico te sorprende y huyes perdiendo parte de tu botín,' },
  { tipo: 'derrota', mensaje: 'Te quedaste atrapado en la sala de cámaras y pierdes dinero al escapar,' },
  { tipo: 'derrota', mensaje: 'Una trampa de seguridad se activa y tus recursos se ven reducidos,' },
  { tipo: 'derrota', mensaje: 'Fracasa tu intento de recolectar monedas en el escenario principal,' },
  { tipo: 'derrota', mensaje: 'Un animatrónico agresivo te derriba y pierdes parte del botín,' },
  // Trampa
  { tipo: 'trampa', mensaje: 'Activaste una trampa, pero logras evadir el daño y aprendes los patrones de los animatrónicos.' },
  { tipo: 'trampa', mensaje: 'Las luces parpadean y pierdes tiempo explorando la oficina, pero sobrevives.' },
  { tipo: 'trampa', mensaje: 'Un sonido extraño te desorienta, pero tu ingenio te mantiene con vida.' }
]
