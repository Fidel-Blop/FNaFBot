let handler = async (m, { conn, command, usedPrefix }) => {
if (!global.db.data.chats[m.chat].economy && m.isGroup) {
return m.reply(`《✦》Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`)
}
let user = global.db.data.users[m.sender]
if (!user) global.db.data.users[m.sender] = user = { coin: 0, exp: 0, health: 100, lastAdventure: 0 }
if (user.coin == null) user.coin = 0
if (user.exp == null) user.exp = 0
if (user.health == null) user.health = 100
if (user.lastAdventure == null) user.lastAdventure = 0

if (user.health < 5)
return conn.reply(m.chat, `⚠️ No tienes suficiente salud para aventurarte de nuevo.\n> Usa *"${usedPrefix}heal"* para curarte.`, m)

const cooldown = 20 * 60 * 1000
const now = Date.now()
if (now < user.lastAdventure) {
const restante = user.lastAdventure - now
const wait = formatTime(restante)
return conn.reply(m.chat, `⌛ Debes esperar *${wait}* para usar *${usedPrefix + command}* nuevamente.`, m)
}
user.lastAdventure = now + cooldown

const evento = pickRandom(aventuras)
let monedas, experiencia, salud

if (evento.tipo === 'victoria') {
monedas = Math.floor(Math.random() * 3001) + 15000
experiencia = Math.floor(Math.random() * 81) + 40
salud = Math.floor(Math.random() * 6) + 10
user.coin += monedas
user.exp += experiencia
user.health -= salud
} else if (evento.tipo === 'derrota') {
monedas = Math.floor(Math.random() * 2001) + 7000
experiencia = Math.floor(Math.random() * 41) + 40
salud = Math.floor(Math.random() * 6) + 10
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

const resultado = `👁️ ${evento.mensaje} ${evento.tipo === 'neutro' ? '' : evento.tipo === 'victoria' ? `🪙 Ganaste *¥${monedas.toLocaleString()} ${currency}*` : `💀 Perdiste *¥${monedas.toLocaleString()} ${currency}*`}`
await conn.reply(m.chat, resultado, m)
await global.db.write()
}

handler.tags = ['rpg']
handler.help = ['adventure', 'aventura']
handler.command = ['adventure', 'aventura']
handler.group = true

export default handler

function formatTime(ms) {
const totalSec = Math.ceil(ms / 1000)
const min = Math.floor((totalSec % 3600) / 60)
const sec = totalSec % 60
const txt = []
if (min > 0) txt.push(`${min} minuto${min !== 1 ? 's' : ''}`)
txt.push(`${sec} segundo${sec !== 1 ? 's' : ''}`)
return txt.join(' ')
}

function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]
}

const aventuras = [
    // 15 victorias FNAF
    { tipo: 'victoria', mensaje: '🎉 Lograste evadir a Freddy en la oficina y sobreviviste la noche con todos los animatrónicos calmados,' },
    { tipo: 'victoria', mensaje: '📹 Recogiste todas las piezas de la pizarra de seguridad sin ser detectado por Bonnie,' },
    { tipo: 'victoria', mensaje: '🔒 Cerraste todas las puertas a tiempo antes de que Chica entrara y sobreviviste,' },
    { tipo: 'victoria', mensaje: '🏃‍♂️ Detectaste los movimientos de Foxy y evitas que salga de Pirate Cove,' },
    { tipo: 'victoria', mensaje: '🛡️ Rescataste a un guardia atrapado y derrotaste a los animatrónicos rebeldes,' },
    { tipo: 'victoria', mensaje: '👻 Neutralizaste la cámara fantasma que intentaba hackear la seguridad de Freddy’s,' },
    { tipo: 'victoria', mensaje: '💡 Desactivaste las luces parpadeantes y mantuviste a los animatrónicos alejados de tu oficina,' },
    { tipo: 'victoria', mensaje: '🕹️ Recogiste todas las monedas del modo arcade sin activar trampas animatrónicas,' },
    { tipo: 'victoria', mensaje: '⭐ Evitaste que Golden Freddy apareciera en la oficina y sobreviviste intacto,' },
    { tipo: 'victoria', mensaje: '⚡ Lograste reiniciar los sistemas de seguridad justo antes de la invasión de los animatrónicos,' },
    { tipo: 'victoria', mensaje: '👀 Atravesaste el pasillo oscuro sin ser detectado por ningún animatrónico,' },
    { tipo: 'victoria', mensaje: '🍕 Sobornaste a un animatrónico con partes de pizza y lograste pasar sin problemas,' },
    { tipo: 'victoria', mensaje: '🔑 Encontraste la entrada secreta a los sótanos de Freddy y evadiste a todos los enemigos,' },
    { tipo: 'victoria', mensaje: '📦 Recogiste todas las cámaras grabadas y las armas ocultas antes del ataque de los animatrónicos,' },
    { tipo: 'victoria', mensaje: '🏆 Completaste el turno nocturno sin perder salud ni monedas,' },

    // 15 derrotas FNAF
    { tipo: 'derrota', mensaje: '😱 Freddy te atrapó en la oficina y perdiste algunas monedas en el pánico,' },
    { tipo: 'derrota', mensaje: '🐰 Bonnie te sorprende en el pasillo y sufres daños en la salud,' },
    { tipo: 'derrota', mensaje: '🍗 Chica entra antes de tiempo y te roba parte de tus recursos,' },
    { tipo: 'derrota', mensaje: '🏃‍♂️ Foxy escapa de Pirate Cove y te obliga a perder experiencia al esquivarlo,' },
    { tipo: 'derrota', mensaje: '👻 Golden Freddy aparece de repente y pierdes la mitad de tus monedas,' },
    { tipo: 'derrota', mensaje: '💻 La cámara fantasma hackea tu consola y pierdes puntos de experiencia,' },
    { tipo: 'derrota', mensaje: '💡 Las luces parpadean y no logras controlar a los animatrónicos, perdiendo salud,' },
    { tipo: 'derrota', mensaje: '⚡ Un animatrónico te embiste en el pasillo y pierdes monedas y salud,' },
    { tipo: 'derrota', mensaje: '🔒 Fallas al cerrar la puerta a tiempo y Chica te quita experiencia,' },
    { tipo: 'derrota', mensaje: '👁️ Fuiste atrapado por el espectro de Freddy y pierdes recursos valiosos,' },
    { tipo: 'derrota', mensaje: '⚙️ Olvidas reiniciar los sistemas y Foxy te castiga, perdiendo salud y monedas,' },
    { tipo: 'derrota', mensaje: '🏚️ Un animatrónico te persigue por las cámaras y pierdes XP al escapar,' },
    { tipo: 'derrota', mensaje: '🌌 Se corta la energía justo cuando atacan varios animatrónicos, perdiendo todo el botín,' },
    { tipo: 'derrota', mensaje: '💥 No logras esquivar a Bonnie y Chica, y pierdes experiencia,' },
    { tipo: 'derrota', mensaje: '👑 Golden Freddy aparece inesperadamente y te obliga a retirarte, perdiendo monedas,' },

    // 3 neutros
    { tipo: 'neutro', mensaje: '👀 Observas los animatrónicos desde las cámaras sin sufrir cambios en tus recursos.' },
    { tipo: 'neutro', mensaje: '🕹️ Revisas la oficina y todo parece normal, sin incidentes.' },
    { tipo: 'neutro', mensaje: '🎧 Escuchas ruidos extraños, pero logras pasar la noche intacto.' }
]
