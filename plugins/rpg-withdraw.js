let handler = async (m, { args, usedPrefix, command }) => {
  if (!db.data.chats[m.chat].economy && m.isGroup) 
    return m.reply(`《✦》Los comandos de *Economía* están desactivados en este grupo.\n\nUn administrador puede activarlos con el comando:\n» *${usedPrefix}economy on*`)

  let user = global.db.data.users[m.sender]

  if (!args[0]) 
    return m.reply(`❀ Ingresa la cantidad de *${currency}* que deseas retirar.`)

  let count
  if (args[0] == 'all') {
    count = parseInt(user.bank)
  } else if (!Number(args[0])) {
    return m.reply(`ꕥ Debes retirar una cantidad válida.\n > Ejemplo 1 » *${usedPrefix + command} ¥25000*\n> Ejemplo 2 » *${usedPrefix + command} all*`)
  } else {
    count = parseInt(args[0])
  }

  if (!user.bank || user.bank < count) 
    return m.reply(`ꕥ Solo tienes *¥${user.bank.toLocaleString()} ${currency}* en el Banco.`)

  // Riesgo FNaF: 20% de perder parte del dinero si un animatrónico aparece
  let perdido = 0
  if (Math.random() < 0.2) {
    perdido = Math.floor(count * (Math.random() * 0.3 + 0.1)) // entre 10% y 40%
    count -= perdido
  }

  user.bank -= count + perdido
  user.coin += count

  let mensaje = `❀ Retiraste *¥${count.toLocaleString()} ${currency}* del banco.`
  if (perdido > 0) {
    mensaje += `\n👻 ¡Un animatrónico te sorprendió y se llevó *¥${perdido.toLocaleString()} ${currency}*!`
  }
  mensaje += `\nAhora puedes usarlo, pero cuidado, podrían robártelo en los pasillos oscuros...`

  await m.reply(mensaje)
}

handler.help = ['retirar']
handler.tags = ['rpg', 'fnaf']
handler.command = ['withdraw', 'retirar', 'with']
handler.group = true

export default handler
