
let buatall = 1
let handler = async (m, { conn, args, usedPrefix, command }) => {
if (!db.data.chats[m.chat].economy && m.isGroup) {
return m.reply(`⚠️ 《✦》Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con:\n» *${usedPrefix}economy on*`)
}

const user = global.db.data.users[m.sender]
let Aku = Math.floor(Math.random() * 101) // Número del bot (animatrónico)
let Kamu = Math.floor(Math.random() * 55) // Número del jugador
let count = args[0]

const userName = await (async () => global.db.data.users[m.sender].name || (async () => { 
    try { 
        const n = await conn.getName(m.sender); 
        return typeof n === 'string' && n.trim() ? n : m.sender.split('@')[0] 
    } catch { return m.sender.split('@')[0] } 
})())()

const tiempoEspera = 15 * 1000
const ahora = Date.now()
if (user.lastApuesta && ahora - user.lastApuesta < tiempoEspera) {
    const restante = user.lastApuesta + tiempoEspera - ahora
    const tiempoRestante = formatTime(restante)
    return conn.reply(m.chat, `⚠️ Los animatrónicos te observan... Debes esperar *${tiempoRestante}* antes de apostar de nuevo.`, m)
}
user.lastApuesta = ahora

count = count ? /all/i.test(count) ? Math.floor(global.db.data.users[m.sender].limit / buatall) : parseInt(count) : args[0] ? parseInt(args[0]) : 1
count = Math.max(1, count)

if (args.length < 1) {
    return conn.reply(m.chat, `🎰 Ingresa la cantidad de *${currency}* que deseas apostar contra los animatrónicos\n> Ejemplo: *${usedPrefix + command} 100*`, m)
}

if (user.coin >= count) {
    user.coin -= count
    let resultado = ''
    let ganancia = 0

    if (Aku > Kamu) {
        resultado = `💀 Los animatrónicos te atraparon en la oficina... *Perdiste ¥${formatNumber(count)} ${currency}*.`
    } else if (Aku < Kamu) {
        ganancia = count * 2
        user.coin += ganancia
        resultado = `🏆 Sobreviviste a la noche y escapaste con ¥${formatNumber(ganancia)} ${currency}*.`
    } else {
        ganancia = count
        user.coin += ganancia
        resultado = `🤝 Empate con los animatrónicos... Recuperaste tu apuesta ¥${formatNumber(ganancia)} ${currency}*.`
    }

    const replyMsg = `🎲 \`Se encienden las cámaras de seguridad...\`\n\n➠ *Animatrónico*: ${Aku}\n➠ *${userName}*: ${Kamu}\n\n${resultado}`
    conn.reply(m.chat, replyMsg.trim(), m)
} else {
    conn.reply(m.chat, `⚠️ No tienes suficiente dinero para apostar *¥${formatNumber(count)} ${currency}*!`, m)
}}

handler.help = ['apostar']
handler.tags = ['economy']
handler.command = ['apostar', 'casino']
handler.group = true

export default handler

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
function formatTime(ms) {
    if (ms <= 0 || isNaN(ms)) return 'Ahora'
    const totalSec = Math.ceil(ms / 1000)
    const min = Math.floor(totalSec / 60)
    const sec = totalSec % 60
    const partes = []
    if (min) partes.push(`${min} minuto${min !== 1 ? 's' : ''}`)
    partes.push(`${sec} segundo${sec !== 1 ? 's' : ''}`)
    return partes.join(' ')
          }
