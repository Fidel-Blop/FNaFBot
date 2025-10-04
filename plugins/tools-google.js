import fetch from 'node-fetch'

let handler = async (m, { text, usedPrefix, args }) => {
if (!text) return m.reply(`🎭 *[ACCESO DENEGADO]* 🎭\n\nDebes proporcionar un término de búsqueda en el sistema de cámaras.\n\nEjemplo: ${usedPrefix}google Animatronics`)

const apiUrl = `${global.APIs.delirius.url}/search/googlesearch?query=${encodeURIComponent(text)}`
let maxResults = Number(args[1]) || 3

try {
  await m.react('🕒') // simulando "cargando cámaras"
  const response = await fetch(apiUrl)
  if (!response.ok) throw new Error('No se pudo conectar con la API de vigilancia.')

  const result = await response.json()
  if (!result.status || !Array.isArray(result.data) || !result.data.length) {
    await m.react('✖️')
    return m.reply('🔦 *[SIN REGISTROS EN EL SISTEMA]* 🔦\n\nNo se detectaron movimientos en las cámaras.')
  }

  let replyMessage = `🎮 *[REGISTROS DEL SISTEMA DE BÚSQUEDA]* 🎮\n\n🔍 Término: *${text}*\n────────────────────\n`

  result.data.slice(0, maxResults).forEach((item, index) => {
    replyMessage += `📟 *Archivo #${index + 1}*\n`
    replyMessage += `👁️ Título: *${item.title || 'Sin título'}*\n`
    replyMessage += `📋 Descripción: ${item.description ? `*${item.description}*` : '_Sin descripción_'}\n`
    replyMessage += `🔗 URL: ${item.url || '_Sin url_'}\n`
    replyMessage += `────────────────────\n`
  })

  await m.reply(replyMessage.trim())
  await m.react('✔️') // ✅ acceso concedido
} catch (error) {
  await m.react('✖️')
  m.reply(`⚠️ *[ERROR EN LOS ARCHIVOS DEL SISTEMA]* ⚠️\n\nEl acceso ha fallado...\n\n> Usa *${usedPrefix}report* para informar el problema.\n\nDetalles: ${error.message}`)
}}

handler.help = ['google']
handler.command = ['google']
handler.group = true

export default handler
