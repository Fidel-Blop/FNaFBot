let handler = async (m, { conn, usedPrefix, command }) => {
  if (!db.data.chats[m.chat].economy && m.isGroup) {
    return m.reply(`《✦》Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`)
  }

  let user = global.db.data.users[m.sender]
  user.lastcrime = user.lastcrime || 0
  user.coin = user.coin || 0
  const cooldown = 8 * 60 * 1000
  const ahora = Date.now()

  if (ahora < user.lastcrime) {
    const restante = user.lastcrime - ahora
    const wait = formatTimeMs(restante)
    return conn.reply(m.chat, `ꕥ Debes esperar *${wait}* para usar *${usedPrefix + command}* de nuevo.`, m)
  }

  user.lastcrime = ahora + cooldown
  const evento = pickRandom(crimenFNaF)
  let cantidad
  if (evento.tipo === 'victoria') {
    cantidad = Math.floor(Math.random() * 1501) + 6000
    user.coin += cantidad
  } else {
    cantidad = Math.floor(Math.random() * 1501) + 4000
    user.coin -= cantidad
    if (user.coin < 0) user.coin = 0
  }

  await conn.reply(m.chat, `❀ ${evento.mensaje} *¥${cantidad.toLocaleString()} ${currency}*`, m)
}

handler.tags = ['economy']
handler.help = ['crimen']
handler.command = ['crimen', 'crime']
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

const crimenFNaF = [
  // Victorias
  { tipo: 'victoria', mensaje: "Te deslizaste por el pasillo oscuro de la pizzería sin ser detectado y robaste la caja registradora, ganaste." },
  { tipo: 'victoria', mensaje: "Hackeaste la cámara de seguridad para distraer a los animatrónicos y vaciaste la bóveda, ganaste." },
  { tipo: 'victoria', mensaje: "Encontraste la oficina de mantenimiento vacía y tomaste monedas de los bolsillos de seguridad, ganaste." },
  { tipo: 'victoria', mensaje: "Usaste un disfraz de animatrónico para pasar desapercibido y conseguir el botín, ganaste." },
  { tipo: 'victoria', mensaje: "Mientras los animatrónicos se movían, lograste extraer el efectivo de la caja sin ser visto, ganaste." },
  { tipo: 'victoria', mensaje: "Te escondiste en la sala de recreo y vaciaste las monedas de la máquina de juegos, ganaste." },
  { tipo: 'victoria', mensaje: "Manipulaste el sistema de sonido para distraer a los animatrónicos y tomar el dinero, ganaste." },
  { tipo: 'victoria', mensaje: "Te deslizaste por los conductos de ventilación y accediste a la cámara del tesoro, ganaste." },
  { tipo: 'victoria', mensaje: "Lograste abrir un cofre de la pizzería mientras Freddy estaba ocupado, ganaste." },
  { tipo: 'victoria', mensaje: "Recogiste monedas de los pasillos sin activar las alarmas, ganaste." },
  { tipo: 'victoria', mensaje: "Hackeaste el sistema de dispensadores y recogiste monedas acumuladas, ganaste." },
  { tipo: 'victoria', mensaje: "Mientras Chica estaba distraída, robaste los tickets de la sala de juegos, ganaste." },
  { tipo: 'victoria', mensaje: "Freddy no te detectó mientras vaciabas la caja de la oficina, ganaste." },
  { tipo: 'victoria', mensaje: "Lograste abrir la caja fuerte del restaurante sin activar la alarma, ganaste." },
  { tipo: 'victoria', mensaje: "Usaste la oscuridad de la pizzería para vaciar un compartimento secreto de monedas, ganaste." },
  // Derrotas
  { tipo: 'derrota', mensaje: "Un animatrónico te sorprendió en el pasillo y tu robo fue frustrado, perdiste." },
  { tipo: 'derrota', mensaje: "Intentaste abrir la caja de seguridad mientras Freddy patrullaba… y fallaste, perdiste." },
  { tipo: 'derrota', mensaje: "Chica te atrapó mientras vaciabas la máquina de juegos, perdiste." },
  { tipo: 'derrota', mensaje: "El sistema de cámaras detectó tu movimiento y tu intento de robo falló, perdiste." },
  { tipo: 'derrota', mensaje: "Bonnie te encontró y tu dinero desapareció entre sus garras, perdiste." },
  { tipo: 'derrota', mensaje: "Te atraparon manipulando los conductos de ventilación, perdiste." },
  { tipo: 'derrota', mensaje: "Mientras Freddy avanzaba, tu intento de robo fue frustrado, perdiste." },
  { tipo: 'derrota', mensaje: "Intentaste robar monedas de la sala de recreo, pero la alarma se activó, perdiste." },
  { tipo: 'derrota', mensaje: "Un destello de luz reveló tu posición y los animatrónicos te persiguieron, perdiste." },
  { tipo: 'derrota', mensaje: "Fuiste atrapado intentando hackear la cámara de seguridad, perdiste." },
  { tipo: 'derrota', mensaje: "Chica te sorprendió tomando monedas de la máquina de premios, perdiste." },
  { tipo: 'derrota', mensaje: "Bonnie apareció de repente y tu botín se perdió, perdiste." },
  { tipo: 'derrota', mensaje: "Freddy regresó antes de tiempo y tu intento falló, perdiste." },
  { tipo: 'derrota', mensaje: "Las luces parpadearon y perdiste de vista el dinero, perdiste." },
  { tipo: 'derrota', mensaje: "Un sonido metálico te alertó tarde y tu robo fue frustrado, perdiste." }
]
