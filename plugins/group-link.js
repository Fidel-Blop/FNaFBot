var handler = async (m, { conn, args }) => {
    let group = m.chat
    const pp = await conn.profilePictureUrl(group, 'image').catch((_) => 'https://files.catbox.moe/xr2m6u.jpg')
    let link = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(group)
    let message = `
🎵 𝗔𝗟𝗘𝗥𝗧𝗔 𝗗𝗘 𝗜𝗡𝗩𝗜𝗧𝗔𝗖𝗜Ó𝗡 🎵

👁️‍🗨️ Enlace de acceso a la sala:
> \`Link:\` ${link}

⚠️ Recuerda: las cámaras están activas. Los animatrónicos vigilan cada llegada...`
    await conn.sendMessage(group, { image: { url: pp }, caption: message.trim() })
}

handler.help = ['link']
handler.tags = ['grupo']
handler.command = ['link', 'enlace']
handler.group = true
handler.botAdmin = true

export default handler
