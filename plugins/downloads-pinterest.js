import axios from 'axios'
import baileys from '@whiskeysockets/baileys'
import cheerio from 'cheerio'

let handler = async (m, { conn, text, args, usedPrefix }) => {
    if (!text) return m.reply(`👁️‍🗨️ Atención: Necesito lo que deseas buscar en Pinterest para activarlo en las cámaras...`)
    
    try {
        await m.react('🕹️') // monitoreo activo

        if (text.includes("https://")) {
            let i = await dl(args[0])
            let isVideo = i.download.includes(".mp4")
            await conn.sendMessage(
                m.chat,
                { [isVideo ? "video" : "image"]: { url: i.download }, caption: `🎥 Vigilancia completada: ${i.title}\n🔔 Mantén las luces encendidas y las puertas cerradas...` },
                { quoted: m }
            )
        } else {
            const results = await pins(text)
            if (!results.length) {
                return conn.reply(m.chat, `⚡ ALERTA: No se encontraron resultados para "${text}". Los animatrónicos podrían estar ocultando algo.`, m)
            }

            const medias = results.slice(0, 10).map(img => ({ type: 'image', data: { url: img.image_large_url } }))
            await conn.sendSylphy(m.chat, medias, {
                caption: `🎥 Pinterest - Vigilancia 🎥\n\n👻 Búsqueda » "${text}"\n🔔 Resultados encontrados » ${medias.length}\n\n⚠️ Mantén las cámaras activas y no pierdas de vista los pasillos...`,
                quoted: m
            })
            await m.react('✅')
        }

    } catch (e) {
        await m.react('❌')
        conn.reply(m.chat, `⚠︎ ERROR en el sistema de vigilancia.\n> Usa *${usedPrefix}report* para alertar al equipo de mantenimiento.\n\n${e}`, m)
    }
}

handler.help = ['pinterest']
handler.command = ['pinterest', 'pin']
handler.tags = ["download"]
handler.group = true

export default handler

async function dl(url) {
    try {
        let res = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }).catch(e => e.response)
        let $ = cheerio.load(res.data)
        let tag = $('script[data-test-id="video-snippet"]')
        if (tag.length) {
            let result = JSON.parse(tag.text())
            return {
                title: result.name,
                download: result.contentUrl
            }
        } else {
            let json = JSON.parse($("script[data-relay-response='true']").eq(0).text())
            let result = json.response.data["v3GetPinQuery"].data
            return {
                title: result.title,
                download: result.imageLargeUrl
            }
        }
    } catch {
        return { msg: "⚡ Error, inténtalo de nuevo más tarde" }
    }
}

const pins = async (judul) => {
    const link = `https://id.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${encodeURIComponent(judul)}%26rs%3Dtyped&data=%7B%22options%22%3A%7B%22query%22%3A%22${encodeURIComponent(judul)}%22%7D%7D`
    const headers = {
        'accept': 'application/json, text/javascript, */*; q=0.01',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'x-requested-with': 'XMLHttpRequest'
    }
    try {
        const res = await axios.get(link, { headers })
        if (res.data?.resource_response?.data?.results) {
            return res.data.resource_response.data.results.map(item => {
                if (item.images) {
                    return {
                        image_large_url: item.images.orig?.url || null
                    }
                }
                return null
            }).filter(img => img !== null)
        }
        return []
    } catch (error) {
        console.error('Error:', error)
        return []
    }
              }
