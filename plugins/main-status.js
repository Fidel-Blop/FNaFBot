import { cpus as _cpus, totalmem, freemem, platform, hostname } from 'os'
import { execSync } from 'child_process'
import { sizeFormatter } from 'human-readable'

let format = sizeFormatter({ 
    std: 'JEDEC', 
    decimalPlaces: 2, 
    keepTrailingZeroes: false, 
    render: (literal, symbol) => `${literal} ${symbol}B` 
})

let handler = async (m, { conn }) => {
    let totalUsers = Object.keys(global.db.data.users).length
    let totalChats = Object.keys(global.db.data.chats).length
    let totalPlugins = Object.values(global.plugins).filter((v) => v.help && v.tags).length
    let totalBots = global.conns.filter(conn => conn.user && conn.ws.socket && conn.ws.socket.readyState !== 3).length
    let totalCommands = Object.values(global.db.data.users).reduce((acc, user) => acc + (user.commands || 0), 0)

    let system = `☠ 𝗘𝗦𝗧𝗔𝗗𝗢 𝗗𝗘 𝗟𝗔 𝗣𝗜𝗭𝗭𝗘𝗥𝗜𝗔 ⚡\n\n◇ *Comandos ejecutados* » ${toNum(totalCommands)}\n◇ *Usuarios registrados* » ${totalUsers.toLocaleString()}\n◇ *Grupos registrados* » ${totalChats.toLocaleString()}\n◇ *Plugins cargados* » ${totalPlugins}\n◇ *Bots activos* » ${totalBots}\n\n💀 *Estado del Servidor* 👀\n\n◆ *Sistema* » ${platform()}\n◆ *CPU* » ${_cpus().length} cores\n◆ *RAM Total* » ${format(totalmem())}\n◆ *RAM Usada* » ${format(totalmem() - freemem())}\n◆ *Arquitectura* » ${process.arch}\n◆ *Host ID* » ${hostname().slice(0, 8)}...\n\n*❑ Uso de Memoria NODEJS*\n\n◈ *RAM utilizada* » ${format(process.memoryUsage().rss)}\n◈ *Heap reservado* » ${format(process.memoryUsage().heapTotal)}\n◈ *Heap usado* » ${format(process.memoryUsage().heapUsed)}\n◈ *Módulos nativos* » ${format(process.memoryUsage().external)}\n◈ *Buffers de datos* » ${format(process.memoryUsage().arrayBuffers)}\n\n⚠️ Los animatrónicos podrían estar observando tu servidor...`

    await conn.reply(m.chat, system, m)
}

handler.help = ['estado']
handler.tags = ['info']
handler.command = ['estado', 'status']

export default handler

function toNum(number) {
    if (number >= 1000 && number < 1000000) {
        return (number / 1000).toFixed(1) + 'k'
    } else if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + 'M'
    } else {
        return number.toString()
    }
}
