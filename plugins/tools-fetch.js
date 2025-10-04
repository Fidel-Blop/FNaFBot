import fetch from 'node-fetch'
import { format } from 'util'

let handler = async (m, { conn, usedPrefix, text }) => {
if (m.fromMe) return
if (!/^https?:\/\//.test(text)) 
  return m.reply(`🎭 *[ACCESO DENEGADO]* 🎭\n\nIngresa la *URL* que deseas inspeccionar en el sistema de cámaras.`)

let url = text
await m.react('🕒') // animación de carga como si fuera la pantalla de seguridad

let res = await fetch(url)
if (res.headers.get('content-length') > 100 * 1024 * 1024 * 1024) {
throw `⚠️ *ARCHIVO DEMASIADO PESADO* ⚠️\n\nContent-Length: ${res.headers.get('content-length')}`
}

if (!/text|json/.test(res.headers.get('content-type'))) 
  return conn.sendFile(m.chat, url, 'file', `📂 *Archivo detectado en el sistema.*\n\n🗂️ Origen: ${text}`, m)

let txt = await res.buffer()
try {
  txt = format(JSON.parse(txt + ''))
} catch (e) {
  txt = txt + ''
} finally {
  m.reply(`📟 *[ACCESO A LOS ARCHIVOS DEL SISTEMA]* 📟\n\n${txt.slice(0, 65536)}`)
  await m.react('✔️') // ✅ como confirmación de que el "sistema" funcionó
}}

handler.help = ['get']
handler.tags = ['tools']
handler.command = ['fetch', 'get']

export default handler
