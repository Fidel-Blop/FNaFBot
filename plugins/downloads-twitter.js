import axios from 'axios'
import cheerio from 'cheerio'

let handler = async (m, { conn, args, text, usedPrefix }) => {
    if (!text) {
        return conn.reply(m.chat, `👁️ ALERTA: Olvidaste el link de la imagen/video de Twitter/X. No puedo activar las cámaras.`, m)
    }

    try {
        await m.react('🕹️') // Cámara activada

        const result = await twitterScraper(text)
        if (!result.status) return conn.reply(m.chat, `⚡ ERROR: No se pudo obtener el contenido de Twitter/X`, m)

        if (result.data.type === 'video') {
            let caption = `🎬 乂 TWITTER/X - VIGILANCIA ACTIVADA 乂

> ✦ Título » ${result.data.title}
> ⴵ Duración » ${result.data.duration}
> 🜸 URL original » ${text}
⚠️ Mantén las cámaras encendidas, los animatrónicos podrían estar cerca...`

            await conn.sendFile(m.chat, result.data.dl[0].url, "video.mp4", caption, m)
            await m.react('✅') // Descarga completada
        } else {
            await conn.sendMessage(m.chat, {
                image: { url: result.data.imageUrl },
                caption: `🖼️ 乂 TWITTER/X - VIGILANCIA ACTIVADA 乂\n\n> 🜸 URL original » ${text}\n⚠️ Observa con precaución: el entorno es impredecible.`
            }, { quoted: m })
            await m.react('✅')
        }
    } catch (e) {
        await m.react('❌')
        return conn.reply(m.chat, `⚠︎ SISTEMA DE VIGILANCIA FALLÓ.\n> Usa *${usedPrefix}report* para alertar al equipo.\n\n${e.message}`, m)
    }
}

handler.command = ["x", "twitter", "xdl"]
handler.help = ["twitter"]
handler.tags = ["downloader"]
handler.group = true

export default handler

async function twitterScraper(url) {
    return new Promise(async (resolve, reject) => {
        try {
            const twitterUrlMatch = url.match(/(https:\/\/x.com\/[^?]+)/)
            const tMatch = url.match(/t=([^&]+)/)
            const twitterUrl = twitterUrlMatch ? twitterUrlMatch[1] : ''
            const t = tMatch ? tMatch[1] : ''
            const urlnya = encodeURIComponent(`${twitterUrl}?t=${t}&s=19`)

            const response = await axios.post("https://savetwitter.net/api/ajaxSearch", `q=${urlnya}&lang=en`)
            const $ = cheerio.load(response.data.data)
            const isVideo = $('.tw-video').length > 0
            const twitterId = $('#TwitterId').val()

            if (isVideo) {
                const videoThumbnail = $('.tw-video .thumbnail .image-tw img').attr('src')
                const data = []
                $('.dl-action a').each((i, elem) => {
                    const quality = $(elem).text().trim()
                    const url = $(elem).attr('href')
                    if ($(elem).hasClass('action-convert')) {
                        const audioUrl = $(elem).attr('data-audioUrl')
                        data.push({
                            quality: quality,
                            url: audioUrl || 'URL not found',
                        })
                    } else {
                        data.push({
                            quality: quality,
                            url: url
                        })
                    }
                })
                const title = $('.tw-middle h3').text().trim()
                const videoDuration = $('.tw-middle p').text().trim()
                resolve({
                    status: true,
                    data: {
                        type: "video",
                        title: title,
                        duration: videoDuration,
                        twitterId: twitterId,
                        videoThumbnail: videoThumbnail,
                        dl: data
                    }
                })
            } else {
                const imageUrl = $('.photo-list .download-items__thumb img').attr('src')
                const downloadUrl = $('.photo-list .download-items__btn a').attr('href')
                resolve({
                    status: true,
                    data: {
                        type: "image",
                        twitterId: twitterId,
                        imageUrl: imageUrl,
                        dl: downloadUrl
                    }
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
