let handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.quoted) {
    return conn.reply(m.chat, `❀ Music Man dice: Debes citar un sticker para convertirlo a imagen.`, m)
  }
  await m.react('🕒')
  let xx = m.quoted
  let imgBuffer = await xx.download()   
  if (!imgBuffer) {
    await m.react('✖️')
    return conn.reply(m.chat, `ꕥ Music Man dice: No se pudo descargar el sticker.`, m)
  }
  await conn.sendMessage(m.chat, { image: imgBuffer, caption: '❀ Music Man dice: ¡Aquí tienes tu imagen! 🔴' }, { quoted: m })
  await m.react('✔️')
}

handler.help = ['toimg']
handler.tags = ['tools']
handler.command = ['toimg', 'jpg', 'img'] 

export default handler
