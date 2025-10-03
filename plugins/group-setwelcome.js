import fetch from 'node-fetch'
import fs from 'fs'
import { generarBienvenida, generarDespedida } from './_welcome.js'

const handler = async (m, { conn, command, usedPrefix, text, groupMetadata }) => {
  const value = text ? text.trim() : ''
  const chat = global.db.data.chats[m.chat]

  if (command === 'setgp') {
    return m.reply(
`📟 *[Panel de Control del Grupo - FNaF Edition]* 📟

Selecciona la categoría que deseas ajustar en el sistema de vigilancia:

🎭 *Opciones Disponibles:*
• ${usedPrefix}gpname <nuevo nombre>  
   ⇢ Cambia el nombre del grupo  
• ${usedPrefix}gpdesc <nueva descripción>  
   ⇢ Modifica la descripción del grupo  
• ${usedPrefix}gpbanner <imagen>  
   ⇢ Establece nueva imagen para el grupo (responde a una imagen)  
• ${usedPrefix}setwelcome <mensaje>  
   ⇢ Configura el mensaje de bienvenida  
• ${usedPrefix}setbye <mensaje>  
   ⇢ Configura el mensaje de despedida  
• ${usedPrefix}testwelcome  
   ⇢ Simula la alerta de bienvenida  
• ${usedPrefix}testbye  
   ⇢ Simula la alerta de despedida  

⚠️ *Recuerda:* puedes usar variables dinámicas:  
   {usuario} = Nombre del usuario  
   {grupo} = Nombre del grupo  
   {desc} = Descripción del grupo`
    )
  }

  try {
    switch (command) {
      case 'setwelcome': {
        if (!value) return m.reply(
`🚨 *Error de Configuración*  
Debes ingresar un mensaje para la bienvenida.  

Ejemplo:  
${usedPrefix}setwelcome Bienvenido {usuario} a {grupo}!`
        )
        chat.sWelcome = value
        m.reply(`✅ *Mensaje de bienvenida actualizado correctamente.*\nUsa ${usedPrefix}testwelcome para simular la alerta.`)
        break
      }

      case 'setbye': {
        if (!value) return m.reply(
`🚨 *Error de Configuración*  
Debes ingresar un mensaje para la despedida.  

Ejemplo:  
${usedPrefix}setbye Adiós {usuario}, te extrañaremos en {grupo}!`
        )
        chat.sBye = value
        m.reply(`✅ *Mensaje de despedida actualizado correctamente.*\nUsa ${usedPrefix}testbye para simular la alerta.`)
        break
      }

      case 'testwelcome': {
        if (!chat.sWelcome) return m.reply('⚠️ No hay mensaje de bienvenida configurado.')
        const { pp: ppWel, caption: captionWel, mentions: mentionsWel } = await generarBienvenida({ conn, userId: m.sender, groupMetadata, chat })
        await conn.sendMessage(m.chat, { image: { url: ppWel }, caption: `📹 *[CÁMARA 01 - ENTRADA]*\n\n${captionWel}`, mentions: mentionsWel }, { quoted: m })
        try { fs.unlinkSync(ppWel) } catch {}
        break
      }

      case 'testbye': {
        if (!chat.sBye) return m.reply('⚠️ No hay mensaje de despedida configurado.')
        const { pp: ppBye, caption: captionBye, mentions: mentionsBye } = await generarDespedida({ conn, userId: m.sender, groupMetadata, chat })
        await conn.sendMessage(m.chat, { image: { url: ppBye }, caption: `📹 *[CÁMARA 03 - SALIDA]*\n\n${captionBye}`, mentions: mentionsBye }, { quoted: m })
        try { fs.unlinkSync(ppBye) } catch {}
        break
      }
    }
  } catch (e) {
    m.reply(`⚠️ Se ha producido un fallo en el sistema.\n> Reporta el error con *${usedPrefix}report*.\n\n${e.message}`)
  }
}

handler.help = ['setwelcome', 'setbye', 'testwelcome', 'testbye']
handler.tags = ['group']
handler.command = ['setgp', 'setwelcome', 'setbye', 'testwelcome', 'testbye']
handler.admin = true
handler.group = true

export default handler
