import { search, download } from 'aptoide-scraper'

var handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) return conn.reply(m.chat, `👁️‍🗨️ Advertencia: Necesito el nombre de la APK para rastrearla en las cámaras...`, m)
    
    try {
        await m.react('🕹️') // monitoreo activo
        
        let searchA = await search(text)
        let data5 = await download(searchA[0].id)
        
        let txt = `🎥 乂 APTOIDE - MONITOREO 乂 🎥\n\n`
        txt += `👻 Nombre : ${data5.name}\n`
        txt += `👻 Package : ${data5.package}\n`
        txt += `👻 Última actualización : ${data5.lastup}\n`
        txt += `👻 Tamaño : ${data5.size}\n\n`
        txt += `🔔 Mantén las cámaras activas y no pierdas de vista los pasillos...`
        
        await conn.sendFile(m.chat, data5.icon, 'thumbnail.jpg', txt, m)
        
        if (data5.size.includes('GB') || data5.size.replace(' MB', '') > 999) {
            return await conn.reply(m.chat, `⚡ ALERTA: El archivo es demasiado pesado para los sistemas de vigilancia.`, m)
        }
        
        await conn.sendMessage(m.chat, {
            document: { url: data5.dllink },
            mimetype: 'application/vnd.android.package-archive',
            fileName: data5.name + '.apk',
            caption: null
        }, { quoted: m })
        
        await m.react('✅') // descarga exitosa
        
    } catch (error) {
        await m.react('❌') // fallo en descarga
        return conn.reply(m.chat, `⚠︎ ERROR en el sistema de cámaras.\n> Usa *${usedPrefix}report* para alertar al equipo de mantenimiento.\n\n${error.message}`, m)
    }
}

handler.tags = ['descargas']
handler.help = ['apkmod']
handler.command = ['apk', 'modapk', 'aptoide']
handler.group = true
handler.premium = true

export default handler
