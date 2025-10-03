let handler = async (m, { conn, command, usedPrefix }) => {
  if (!global.db.data.chats[m.chat].economy && m.isGroup) {
    return m.reply(`⚠️ *Sistema de Economía Desactivado*\n\nUn *administrador* puede activarlo con:\n» *${usedPrefix}economy on*`, m)
  }

  let user = global.db.data.users[m.sender]
  if (!user) global.db.data.users[m.sender] = user = { coin: 0, exp: 0, lastFish: 0 }

  const cooldown = 12 * 60 * 1000
  const ahora = Date.now()

  if (ahora < user.lastFish) {
    const restante = user.lastFish - ahora
    const wait = formatTimeMs(restante)
    return conn.reply(m.chat, `⏳ Las sombras de los animatrónicos vigilan... debes esperar *${wait}* antes de intentar pescar de nuevo.`, m)
  }

  user.lastFish = ahora + cooldown
  const evento = pickRandom(eventos)
  let monedas, experiencia

  if (evento.tipo === 'victoria') {
    monedas = Math.floor(Math.random() * 2001) + 11000
    experiencia = Math.floor(Math.random() * 61) + 30
    user.coin += monedas
    user.exp += experiencia
  } else {
    monedas = Math.floor(Math.random() * 2001) + 5000
    experiencia = Math.floor(Math.random() * 31) + 30
    user.coin -= monedas
    user.exp -= experiencia
    if (user.exp < 0) user.exp = 0
    if (user.coin < 0) user.coin = 0
  }

  const resultado = `🎣 ${evento.mensaje} ${evento.tipo === 'victoria' ? `ganaste *¥${monedas.toLocaleString()} ${currency}* 🪙` : `perdiste *¥${monedas.toLocaleString()} ${currency}* 😱`}`
  await conn.reply(m.chat, resultado, m)
  await global.db.write()
}

handler.tags = ['rpg']
handler.help = ['pescar', 'fish']
handler.command = ['pescar', 'fish']
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
  { tipo: 'victoria', mensaje: '¡Un animatrónico dejó caer un extraño pez mecánico!'},
  { tipo: 'victoria', mensaje: '¡Has atrapado un Pez Luminiscente de la oficina abandonada!'},
  { tipo: 'victoria', mensaje: '¡Una sombra se mueve y aparece un Pez Fantasma en la línea!'},
  { tipo: 'victoria', mensaje: '¡Has conseguido un Pez Animatrónico Dorado!'},
  { tipo: 'victoria', mensaje: '¡El Pez Sombrío te ha dado una recompensa valiosa!'},
  // Derrota
  { tipo: 'derrota', mensaje: 'Una corriente oscura arrastra tu línea, no pescaste nada.'},
  { tipo: 'derrota', mensaje: 'Un animatrónico travieso rompe tu línea, perdiste tu captura.'},
  { tipo: 'derrota', mensaje: 'El agua estaba inquieta y tu anzuelo quedó vacío.'},
  { tipo: 'derrota', mensaje: 'Algo grande muerde, pero se escapa entre las sombras.'}
]
