import fetch from 'node-fetch'
import { lookup } from 'mime-types'

let handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) return conn.reply(m.chat, '👁️‍🗨️ Atención: Necesito un enlace de Mediafire para iniciar la vigilancia...', m)
    if (!/^https:\/\/www\.mediafire\.com\//i.test(text)) return conn.reply(m.chat, '⚡ ALERTA: Enlace inválido. Revisa tus cámaras y vuelve a intentarlo.', m)
    
    try {
        await m.react('🕹️') // simulando monitoreo activo
        
        const res = await fetch(`${global.APIs.delirius.url}/download/mediafire?url=${encodeURIComponent(text)}`)
        const json = await res.json()
        const data = json.data
        
        if (!json.status || !data?.filename || !data?.link) {
            throw '⚡ ALERTA: Los animatrónicos impidieron obtener el archivo desde Delirius.'
        }
        
        const filename = data.filename
        const filesize = data.size || 'desconocido'
        const mimetype = data.mime || lookup(data.extension?.toLowerCase()) || 'application/octet-stream'
        const dl_url = data.link.includes('u=') ? decodeURIComponent(data.link.split('u=')[1]) : data.link
        
        const caption = `🎥 MEDIAFIRE - DESCARGA EN VIGILANCIA 🎥\n\n👻 Nombre » ${filename}\n👻 Peso » ${filesize}\n👻 MimeType » ${mimetype}\n👻 Enlace original » ${text}\n\n🔔 Mantén las luces encendidas y no pierdas de vista los pasillos...`
        
        await conn.sendMessage(m.chat, { document: { url: dl_url }, fileName: filename, mimetype, caption }, { quoted: m })
        await m.react('✅')
        
    } catch (e) {
        await m.react('❌')
        return conn.reply(m.chat, `⚠︎ ERROR en la cámara de seguridad.\n> Usa *${usedPrefix}report* para alertar al equipo de mantenimiento.\n\n${e.message}`, m)
    }
}

handler.command = ['mf', 'mediafire']
handler.help = ['mediafire']
handler.tags = ['descargas']
handler.group = true
handler.premium = true

export default handler
