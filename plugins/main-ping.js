import speed from 'performance-now'
import { spawn, exec, execSync } from 'child_process'

let handler = async (m, { conn }) => {
    let timestamp = speed()
    let sentMsg = await conn.reply(m.chat, '❀ Conectando con la pizzería... ⚡', m)
    let latency = speed() - timestamp

    exec(`neofetch --stdout`, (error, stdout, stderr) => {
        let child = stdout.toString("utf-8")
        let ssd = child.replace(/Memory:/, "Ram:")

        let result = `☠ 𝗣𝗜𝗡𝗚 𝗔𝗟 𝗠𝗢𝗡𝗦𝗧𝗥𝗢 ⚠\n> Tiempo de respuesta ⴵ ${latency.toFixed(4).split(".")[0]}ms\n${ssd}\n\n💀 Cuidado... los animatrónicos te están observando 👀`
        conn.sendMessage(m.chat, { text: result, edit: sentMsg.key }, { quoted: m })
    })
}

handler.help = ['ping']
handler.tags = ['info']
handler.command = ['ping', 'p']

export default handler
