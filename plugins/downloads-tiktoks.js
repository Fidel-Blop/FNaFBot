import axios from 'axios'

const handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) return conn.reply(m.chat, '👁️ Atención: Ingresa un término de búsqueda o un enlace de TikTok para activar el monitoreo...')

    const isUrl = /(?:https:?\/{2})?(?:www\.|vm\.|vt\.|t\.)?tiktok\.com\/([^\s&]+)/gi.test(text)

    try {
        await m.react('🕹️') // Vigilancia activada

        if (isUrl) {
            const res = await axios.get(`https://www.tikwm.com/api/?url=${encodeURIComponent(text)}?hd=1`)
            const data = res.data?.data;
            if (!data?.play) return conn.reply(m.chat, '⚡ ALERTA: Enlace inválido o sin contenido descargable.', m)

            const { title, duration, author, created_at, type, images, music, play } = data
            const caption = createCaption(title, author, duration, created_at)

            if (type === 'image' && Array.isArray(images)) {
                const medias = images.map(url => ({ type: 'image', data: { url }, caption }))
                await conn.sendSylphy(m.chat, medias, { quoted: m })
                if (music) {
                    await conn.sendMessage(m.chat, { audio: { url: music }, mimetype: 'audio/mp4', fileName: 'tiktok_audio.mp4' }, { quoted: m })
                }
            } else {
                await conn.sendMessage(m.chat, { video: { url: play }, caption }, { quoted: m })
            }

        } else {
            const res = await axios({
                method: 'POST',
                url: 'https://tikwm.com/api/feed/search',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Cookie': 'current_language=en',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
                },
                data: { keywords: text, count: 20, cursor: 0, HD: 1 }
            })
            const results = res.data?.data?.videos?.filter(v => v.play) || []
            if (results.length < 2) return conn.reply(m.chat, '⚡ ALERTA: Se requieren al menos 2 resultados válidos para la vigilancia.', m)

            const medias = results.slice(0, 10).map(v => ({ type: 'video', data: { url: v.play }, caption: createSearchCaption(v) }))
            await conn.sendSylphy(m.chat, medias, { quoted: m })
        }

        await m.react('✅') // Vigilancia completada

    } catch (e) {
        await m.react('❌') // Fallo de vigilancia
        await conn.reply(m.chat, `⚠︎ ERROR en el sistema de vigilancia de TikTok.\n> Usa *${usedPrefix}report* para alertar al equipo de seguridad.\n\n${e.message}`, m)
    }
}

function createCaption(title, author, duration, created_at = '') {
    return `🎵 乂 VIGILANCIA TIKTOK 乂\n\n> 👻 Título › \`${title || 'No disponible'}\`\n> ☕︎ Autor › *${author?.nickname || author?.unique_id || 'No disponible'}*\n> ✰ Duración › *${duration || 'No disponible'}s*\n${created_at ? `> ☁︎ Creado › ${created_at}\n` : ''}> 𝅘𝅥𝅮 Música › [${author?.nickname || 'No disponible'}] original sound - ${author?.unique_id || 'unknown'}\n⚠️ Mantén las cámaras encendidas mientras se reproduce...`
}

function createSearchCaption(data) {
    return `🎵 乂 VIGILANCIA TIKTOK 乂\n\n> Título › ${data.title || 'No disponible'}\n> ☕︎ Autor › ${data.author?.nickname || 'Desconocido'} ${data.author?.unique_id ? `@${data.author.unique_id}` : ''}\n> ✧︎ Duración › ${data.duration || 'No disponible'}\n> 𝅘𝅥𝅮 Música › ${data.music?.title || `[${data.author?.nickname || 'No disponible'}] original sound - ${data.author?.unique_id || 'unknown'}`}\n⚠️ Observa con precaución: animatrónicos podrían estar cerca...`
}

handler.help = ['tiktok', 'tt']
handler.tags = ['downloader']
handler.command = ['tiktok', 'tt', 'tiktoks', 'tts']
handler.group = true

export default handler
