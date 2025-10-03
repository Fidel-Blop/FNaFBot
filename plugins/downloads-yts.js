import yts from 'yt-search'

var handler = async (m, { text, conn, args, command, usedPrefix }) => {
    if (!text) return conn.reply(m.chat, `👁️ ALERTA: Debes ingresar un término de búsqueda en YouTube. Las cámaras no detectaron nada.`, m)

    try {
        await m.react('🕹️') // Procesando búsqueda

        let results = await yts(text)
        let tes = results.all

        let teks = results.all.map(v => {
            switch (v.type) {
                case 'video':
                    return `🎬 乂 YOUTUBE - VIGILANCIA ACTIVADA 乂

❀ *${v.title}*
> ✦ Canal » *${v.author.name}*
> ⴵ Duración » *${v.timestamp}*
> ✐ Subido » *${v.ago}*
> ✰ Vistas » *${v.views}*
> 🜸 Enlace » ${v.url}
⚠️ Mantén las cámaras encendidas. Los animatrónicos podrían moverse mientras reproduces esto...`
            }
        }).filter(v => v).join('\n\n••••••••••••••••••••••••••••••••••••\n\n')

        await conn.sendFile(m.chat, tes[0].thumbnail, 'yts.jpeg', teks, m)
        await m.react('✅') // Búsqueda completada
    } catch (e) {
        await m.react('❌')
        conn.reply(m.chat, `⚠︎ SISTEMA DE VIGILANCIA FALLÓ.\n> Usa *${usedPrefix}report* para alertar al equipo.\n\n` + e.message, m)
    }
}

handler.help = ['ytsearch']
handler.tags = ['descargas']
handler.command = ['ytbuscar', 'ytsearch', 'yts']
handler.group = true

export default handler
