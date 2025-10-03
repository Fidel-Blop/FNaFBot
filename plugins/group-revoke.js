var handler = async (m, { conn }) => {
    let res = await conn.groupRevokeInvite(m.chat)
    let gruf = m.chat
    let newLink = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(gruf)

    conn.reply(
        m.sender, 
        `🎭 El viejo acceso ha sido sellado...\n🔑 Un nuevo pasaje ha sido generado:\n\n${newLink}\n\n⚠️ Recuerda: cada enlace restablecido es como abrir otra puerta en la pizzería... nunca sabes quién entrará.`,
        m
    )
}

handler.help = ['revoke']
handler.tags = ['grupo']
handler.command = ['revoke', 'restablecer']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
