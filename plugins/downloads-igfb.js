const handler = async (m, { args, conn, usedPrefix }) => {
try {
    if (!args[0]) return conn.reply(m.chat, `👁️‍🗨️ Atención: Necesito un enlace de Instagram/Facebook para poder vigilarlo...`, m)
    
    let data = []
    
    try {
        await m.react('🕹️') // simulando vigilancia activa
        const api = `${global.APIs.vreden.url}/api/igdownload?url=${encodeURIComponent(args[0])}`
        const res = await fetch(api)
        const json = await res.json()
        if (json.resultado?.respuesta?.datos?.length) {
            data = json.resultado.respuesta.datos.map(v => v.url)
        }
    } catch {}
    
    if (!data.length) {
        try {
            const api = `${global.APIs.delirius.url}/download/instagram?url=${encodeURIComponent(args[0])}`
            const res = await fetch(api)
            const json = await res.json()
            if (json.status && json.data?.length) {
                data = json.data.map(v => v.url)
            }
        } catch {}
    }
    
    if (!data.length) return conn.reply(m.chat, `⚡ ALERTA: Los animatrónicos se han llevado el contenido... no se pudo obtener.`, m)
    
    for (let media of data) {
        await conn.sendFile(m.chat, media, 'instagram.mp4', `🎥 Vigilancia completada... todo está bajo control. 👻`, m)
        await m.react('✅')
    }

} catch (error) {
    await m.react('❌')
    await m.reply(`⚠︎ ERROR en la cámara de seguridad.\n> Usa *${usedPrefix}report* para alertar al equipo de mantenimiento.\n\n${error.message}`)
}}

handler.command = ['instagram', 'ig', 'facebook', 'fb']
handler.tags = ['descargas']
handler.help = ['instagram', 'ig', 'facebook', 'fb']
handler.group = true

export default handler
