import FormData from "form-data"
import { fileTypeFromBuffer } from "file-type"
import axios from "axios"
import fetch from "node-fetch"

const handler = async (m, { conn, command, usedPrefix, text, args }) => {
try {
const q = m.quoted ? m.quoted : m
const mime = (q.msg || q).mimetype || ''
const username = await (async () => global.db.data.users[m.sender].name || (async () => { try { const n = await conn.getName(m.sender); return typeof n === 'string' && n.trim() ? n : m.sender.split('@')[0] } catch { return m.sender.split('@')[0] } })())()

switch (command) {
case 'dalle': {
if (!args[0]) return conn.reply(m.chat, `🎭 *[ALERTA EN EL SISTEMA DE CÁMARAS]* 🎭\n\nIngresa una descripción para generar la imagen del archivo secreto...`, m)
const promptDalle = args.join(' ')
if (promptDalle.length < 5) return conn.reply(m.chat, `⚠️ *Entrada demasiado corta*...\nEl sistema no puede procesar descripciones tan vagas.` , m)
await m.react('🕒')
const dalleURL = `https://eliasar-yt-api.vercel.app/api/ai/text2img?prompt=${encodeURIComponent(promptDalle)}`
const dalleRes = await axios.get(dalleURL, { responseType: 'arraybuffer' })
await conn.sendMessage(m.chat, { image: Buffer.from(dalleRes.data), caption: `📸 *Imagen generada desde la base de datos de Freddy Fazbear’s...*\n\n> Descripción: ${promptDalle}` }, { quoted: m })
await m.react('✔️')
break
}

case 'flux': {
if (!text) return conn.reply(m.chat, `🎬 Ingresa un término para generar la imagen en los *Archivos Flux* del turno nocturno.`, m)
await m.react('🕒')
const result = await fluximg.create(text)
if (result?.imageLink) {
await conn.sendMessage(m.chat, { image: { url: result.imageLink }, caption: `📟 *Monitor de Seguridad – Flux Image* 📟\n\n🔎 Prompt: ${text}` }, { quoted: m })
await m.react('✔️')
} else throw new Error("No se pudo crear la imagen, la cámara se apagó...")
break
}

case 'ia': case 'chatgpt': {
if (!text) return conn.reply(m.chat, `🎤 Ingresa una petición para el *Chat del Guardián Nocturno*.`, m)
await m.react('🕒')
const basePrompt = `Tu nombre es ${botname}, fuiste desarrollada en los archivos de ${etiqueta}. Versión actual ${vs}. Hablas en Español y siempre te diriges a ${username}. Tu estilo es divertido pero inquietante, con un aire propio de Five Nights at Freddy’s.`
const url = `${global.APIs.delirius.url}/ia/gptprompt?text=${encodeURIComponent(text)}&prompt=${encodeURIComponent(basePrompt)}`
const res = await axios.get(url)
if (!res.data?.status || !res.data?.data) throw new Error('Respuesta inválida de Delirius')
await conn.sendMessage(m.chat, { text: `📟 *Conexión establecida con el sistema de Freddy’s...*\n\n${res.data.data}` }, { quoted: m })
await m.react('✔️')
break
}

case 'luminai': case 'gemini': case 'bard': {
if (!text) return conn.reply(m.chat, `📡 Ingresa tu petición para los *archivos secretos* del animatrónico.`, m)
await m.react('🕒')
const apiMap = { luminai: 'qwen-qwq-32b', gemini: 'gemini', bard: 'grok-3-mini' }
const endpoint = apiMap[command]
const url = `${global.APIs.zenzxz.url}/ai/${endpoint}?text=${encodeURIComponent(text)}`
const res = await axios.get(url)
const output = res.data?.response || res.data?.assistant
if (!res.data?.status || !output) throw new Error(`La conexión con ${command} falló... las luces parpadean en la oficina.`)
await conn.sendMessage(m.chat, { text: `🗂️ *[ARCHIVO ${command.toUpperCase()} DESCARGADO]* 🗂️\n\n${output}` }, { quoted: m })
await m.react('✔️')
break
}
}} catch (error) {
await m.react('✖️')
conn.reply(m.chat, `🚨 *ERROR EN EL SISTEMA DE SEGURIDAD* 🚨\n\n> Usa *${usedPrefix}report* para informarlo.\n\n${error.message}`, m)
}}

handler.command = ['gemini', 'bard', 'openai', 'dalle', 'flux', 'ia', 'chatgpt', 'luminai']
handler.help = ['gemini', 'bard', 'openai', 'dalle', 'flux', 'ia', 'chatgpt', 'luminai']
handler.tags = ['tools']
handler.group = true

export default handler

const fluximg = { defaultRatio: "2:3", create: async (query) => {
const config = { headers: { accept: "*/*", authority: "1yjs1yldj7.execute-api.us-east-1.amazonaws.com", "user-agent": "Postify/1.0.0" }}
const url = `https://1yjs1yldj7.execute-api.us-east-1.amazonaws.com/default/ai_image?prompt=${encodeURIComponent(query)}&aspect_ratio=${fluximg.defaultRatio}`
const res = await axios.get(url, config)
return { imageLink: res.data.image_link }
}}
