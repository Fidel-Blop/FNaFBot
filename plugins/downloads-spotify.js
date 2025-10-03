import axios from "axios"

const handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) return m.reply("👁️‍🗨️ Atención: Por favor, DJ Music Man necesita el nombre de una canción o artista para activar la vigilancia musical...")
    
    try {
        await m.react('🕹️') // vigilancia activada

        const isUrl = /https?:\/\/(open\.)?spotify\.com\/track\/[a-zA-Z0-9]+/.test(text)
        let trackUrl = text
        let info = null
        let data = null

        if (!isUrl) {
            const search = await axios.get(`${global.APIs.delirius.url}/search/spotify?q=${encodeURIComponent(text)}&limit=1`)
            const result = Array.isArray(search.data?.data) ? search.data.data[0] : null
            if (!result || !result.url) throw new Error("⚡ ALERTA: No se encontraron resultados en los sistemas de vigilancia.")
            trackUrl = result.url
            info = { title: result.title || "Desconocido", artist: result.artist || "Desconocido", album: result.album || null, duration: result.duration || null, popularity: result.popularity || null, release: result.publish || null, image: result.image || null, url: result.url }
        }

        const res = await axios.get(`${global.APIs.delirius.url}/download/spotifydl?url=${encodeURIComponent(trackUrl)}`)
        const d = res.data?.data
        if (!res.data?.status || !d?.url) throw new Error("⚡ ALERTA: No se pudo obtener el audio desde las cámaras de vigilancia.")
        data = { 
            title: d.title || info?.title || "Desconocido", 
            artist: d.author || info?.artist || "Desconocido", 
            album: info?.album || "Desconocido", 
            duration: info?.duration || `${Math.floor(d.duration / 60000)}:${String(Math.floor((d.duration % 60000) / 1000)).padStart(2, '0')}`, 
            popularity: info?.popularity || "Desconocido", 
            release: info?.release || "Desconocido", 
            type: d.type, 
            source: d.source, 
            image: d.image || info?.image, 
            download: d.url, 
            url: info?.url || trackUrl 
        }

        const caption = `🎵 乂 VIGILANCIA MUSICAL 乂\n\n> 👻 Autor » *${data.artist}*\n${data.album && data.album !== "Desconocido" ? `> ❑ Álbum » *${data.album}*\n` : ''}${data.duration ? `> ⴵ Duración » *${data.duration}*\n` : ''}${data.popularity && data.popularity !== "Desconocido" ? `> ✰ Popularidad » *${data.popularity}*\n` : ''}${data.release && data.release !== "Desconocido" ? `> ☁︎ Publicado » *${data.release}*\n` : ''}${data.url ? `> 🜸 Enlace » ${data.url}` : ''}\n\n⚠️ Mantén las cámaras encendidas y las puertas cerradas mientras se reproduce...`

        await conn.sendMessage(m.chat, {
            text: caption,
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: true,
                    containsAutoReply: true,
                    renderLargerThumbnail: true,
                    title: '✧ Freddy Fazbear Music • Vigilancia ✧',
                    body: dev,
                    mediaType: 1,
                    thumbnailUrl: data.image,
                    mediaUrl: data.url,
                    sourceUrl: data.url,
                }
            }
        }, { quoted: m })

        await conn.sendMessage(m.chat, { audio: { url: data.download }, fileName: `${data.title}.mp3`, mimetype: 'audio/mpeg' }, { quoted: m })
        await m.react('✅')

    } catch (err) {
        await m.react('❌')
        m.reply(`⚠︎ ERROR en el sistema de vigilancia.\n> Usa *${usedPrefix}report* para alertar al equipo de seguridad.\n\n${err.message}`)
    }
}

handler.help = ["spotify"]
handler.tags = ["download"]
handler.command = ["spotify", "splay"]
handler.group = true

export default handler
