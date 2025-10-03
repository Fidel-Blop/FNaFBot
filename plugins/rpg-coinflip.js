const handler = async (m, { conn, text, command, usedPrefix }) => {
  if (!db.data.chats[m.chat].economy && m.isGroup) return conn.reply(m.chat, 
    `《✦》Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`, m)
  
  const user = global.db.data.users[m.sender]
  if (!text) return conn.reply(m.chat, `❀ Debes apostar una cantidad válida.\n> Ejemplo » *${usedPrefix + command} 150 (cara/cruz).*`, m)
  
  const args = text.trim().split(/\s+/)
  if (!args[0] || !args[1]) return conn.reply(m.chat, `❀ Formato incorrecto, debes poner la cantidad y luego cara/cruz.\n> Ejemplo » *${usedPrefix + command} 150 cruz*`, m)
  
  const cantidad = parseFloat(args[0])
  const eleccion = args[1].toLowerCase()
  
  if (isNaN(cantidad)) return conn.reply(m.chat, `ꕥ Cantidad inválida, ingresa un número válido.\n> Ejemplo » *${usedPrefix + command} 200 cruz*`, m)
  if (Math.abs(cantidad) < 100) return conn.reply(m.chat, `ꕥ La cantidad mínima para apostar es *100 ${currency}*.`, m)
  if (!['cara', 'cruz'].includes(eleccion)) return conn.reply(m.chat, `ꕥ Elección inválida. Solo se admite *cara* o *cruz*.\n> Ejemplo » *${usedPrefix + command} 200 cara*`, m)
  if (cantidad > user.coin) return conn.reply(m.chat, `ꕥ No tienes suficientes *${currency}* para apostar, tienes *¥${user.coin.toLocaleString()} ${currency}*.`, m)
  
  const resultado = Math.random() < 0.5 ? 'cara' : 'cruz'
  const acierto = resultado === eleccion
  const cambio = acierto ? cantidad : -cantidad
  user.coin += cambio
  if (user.coin < 0) user.coin = 0

  // Mensajes temáticos de FNaF
  const victorias = [
    "La moneda cae mientras el reloj marca la 12… un resplandor te guía: ¡ganaste!",
    "Una risa metálica resuena en la pizzería… y tu apuesta se multiplica.",
    "Luces parpadeantes muestran el resultado… ¡ganaste!",
    "Un animatrónico parece aplaudir silenciosamente tu victoria.",
    "El zumbido de los ventiladores te tranquiliza: tu apuesta se duplica.",
    "Desde el pasillo oscuro se ve un brillo: ¡tu elección fue correcta!",
    "El sonido de engranajes te anuncia… tu victoria.",
    "Las sombras bailan en las paredes y la moneda cae a tu favor.",
    "Un susurro en la oficina dice: 'Buen trabajo', y tu premio se suma.",
    "La cámara de seguridad muestra un fantasma celebrando tu acierto.",
    "Tu apuesta se multiplica mientras los relojes fallan y marcan la suerte.",
    "Un destello de luz revela que tu elección fue correcta.",
    "Un rugido apagado de un animatrónico confirma tu victoria.",
    "La pizzería se llena de ruidos mecánicos… ¡y tu moneda también!",
    "Sientes que algo te observa… y la moneda cae a tu favor."
  ]

  const derrotas = [
    "La moneda cae mientras escuchas pasos detrás… perdiste tu apuesta.",
    "Un chirrido metálico resuena… la moneda se va en tu contra.",
    "Luces parpadeantes muestran tu error… perdiste.",
    "Un animatrónico te observa y tu apuesta se desvanece.",
    "El zumbido de los ventiladores te recuerda que fallaste.",
    "Desde el pasillo oscuro, la moneda no cae como esperabas.",
    "El sonido de engranajes anuncia tu derrota silenciosa.",
    "Las sombras bailan y tu apuesta desaparece.",
    "Un susurro en la oficina dice: 'Fallaste', y tu dinero se reduce.",
    "La cámara de seguridad muestra un fantasma burlándose de ti.",
    "Tu apuesta se pierde mientras los relojes marcan tu mala suerte.",
    "Un destello de luz revela que tu elección fue incorrecta.",
    "Un rugido apagado de un animatrónico confirma tu derrota.",
    "La pizzería se llena de ruidos mecánicos… y tu moneda desaparece.",
    "Sientes que algo te observa… y tu moneda se pierde."
  ]

  const mensaje = acierto ? pickRandom(victorias) + `\n> Ganaste *¥${formatNumber(cambio)} ${currency}*!\n> Tu elección fue *${capitalize(eleccion)}*` 
                          : pickRandom(derrotas) + `\n> Perdiste *¥${formatNumber(Math.abs(cambio))} ${currency}*!\n> Tu elección fue *${capitalize(eleccion)}*`

  return conn.reply(m.chat, `「✿」 Resultado de tu apuesta\n\n` +
    `➠ *${botname}* lanzó la moneda...\n` +
    `➠ *${capitalize(eleccion)}* fue tu elección\n\n` +
    mensaje, m)
}

handler.help = ['cf']
handler.tags = ['economy']
handler.command = ['cf', 'suerte', 'coinflip', 'flip']
handler.group = true

export default handler

function capitalize(txt) {
  return txt.charAt(0).toUpperCase() + txt.slice(1)
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
