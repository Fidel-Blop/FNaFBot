import fetch from 'node-fetch'

let handler = async (m, { text, usedPrefix, conn }) => {
  if (!text) 
    return m.reply(`❀ Music Man dice: ¡Escribe el nombre de la canción para buscarla! 🎵`)

  try {
    await m.react('🕒') // reloj mientras carga

    const res = await fetch(`${global.APIs.delirius.url}/search/lyrics?query=${encodeURIComponent(text)}`)
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`)

    const json = await res.json()
    if (!json.status || !json.data?.lyrics) {
      await m.react('✖️')
      return m.reply('ꕥ Music Man no pudo encontrar la canción 😢')
    }

    let { title, artists, lyrics, image, url } = json.data

    // Limitar tamaño para evitar exceder el límite de mensaje
    let caption = `🎵 Music Man encontró la canción 🎵\n\n` +
                  `*Título:* ${title}\n` +
                  `*Artista:* ${artists}\n\n` +
                  `🎶 Letra:\n${lyrics}`

    if (caption.length > 4000) caption = caption.slice(0, 3990) + '...'

    caption += `\n\n⚡ [Ver en Musixmatch](${url})`

    // Enviar mensaje con imagen de portada y letra
    await conn.sendMessage(
      m.chat, 
      { image: { url: image }, caption, mentions: [m.sender] }, 
      { quoted: m }
    )

    await m.react('✔️') // check al finalizar

  } catch (error) {
    await m.react('✖️')
    return conn.reply(
      m.chat, 
      `⚠︎ Music Man tuvo un problema 😵\n> Usa *${usedPrefix}report* para informarlo\n\n${error.message}`, 
      m
    )
  }
}

handler.command = ['lyrics']
handler.help = ['lyrics']
handler.tags = ['tools']

export default handler
