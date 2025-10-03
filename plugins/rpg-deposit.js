let handler = async (m, { args, usedPrefix, command }) => {
  if (!db.data.chats[m.chat].economy && m.isGroup) {
    return m.reply(`⚠️ *Sistema de Economía Desactivado*\n\nUn *administrador* puede activarlo con:\n» *${usedPrefix}economy on*`, m)
  }

  let user = global.db.data.users[m.sender]

  if (!args[0]) 
    return m.reply(`👻 Ingresa la cantidad de *${currency}* que deseas depositar en la bóveda segura del pizzería.`, m)

  if (args[0] < 1) 
    return m.reply(`❌ Ingresa una cantidad válida de *${currency}*.`, m)

  // Depositar todo
  if (args[0].toLowerCase() === 'all') {
    let count = parseInt(user.coin)
    user.coin -= count
    user.bank += count
    await m.reply(`💰 Has depositado *¥${count.toLocaleString()} ${currency}* en el banco de Freddy’s.\n> Tu dinero está ahora a salvo de los animatrónicos 👀`, m)
    return
  }

  // Validar cantidad numérica
  if (!Number(args[0])) 
    return m.reply(`❌ Debes depositar una cantidad válida.\n> Ejemplo 1 » *${usedPrefix + command} 25000*\n> Ejemplo 2 » *${usedPrefix + command} all*`, m)

  let count = parseInt(args[0])

  if (!user.coin) 
    return m.reply(`⚠️ No tienes suficientes *${currency}* en tu Cartera para depositar.`, m)

  if (user.coin < count) 
    return m.reply(`⚠️ Solo tienes *¥${user.coin.toLocaleString()} ${currency}* en la Cartera.`, m)

  user.coin -= count
  user.bank += count

  await m.reply(`🔒 Has depositado *¥${count.toLocaleString()} ${currency}* en la bóveda segura de Freddy’s.\n> Ahora tu dinero está protegido de los animatrónicos maliciosos 👹`, m)
}

handler.help = ['depositar']
handler.tags = ['rpg']
handler.command = ['deposit', 'depositar', 'd', 'dep']
handler.group = true

export default handler
