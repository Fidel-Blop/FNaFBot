import axios from 'axios'

let handler = async (m, { conn, usedPrefix, text }) => {
  if (!text) {
    return conn.reply(m.chat, `🎭 *[SISTEMA DE SEGURIDAD - FREDDY FAZBEAR]* 🎭\n\nPor favor, ingresa una *IP* para verificar en los registros de vigilancia.\n\nEjemplo: ${usedPrefix}ip 8.8.8.8`, m)
  }
  try {
    await m.react('🕒') // simulando análisis de red
    const res = await axios.get(`http://ip-api.com/json/${text}?fields=status,message,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,isp,org,as,mobile,hosting,query`)
    const data = res.data
    if (String(data.status) !== "success") {
      throw new Error(data.message || "Falló la conexión con la base de datos de seguridad.")
    }

    let ipsearch = `🔦 *[REGISTRO DE RED - FREDDY FAZBEAR]* 🔦
» IP Monitoreada : ${data.query}
» País : ${data.country}
» Código de País : ${data.countryCode}
» Provincia : ${data.regionName}
» Código de Provincia : ${data.region}
» Ciudad : ${data.city}
» Distrito : ${data.district || 'N/A'}
» Código Postal : ${data.zip}
» Zona Horaria : ${data.timezone}
» ISP : ${data.isp}
» Organización : ${data.org}
» AS : ${data.as}
» Dispositivo Móvil : ${data.mobile ? "Sí" : "No"}
» Hosting : ${data.hosting ? "Sí" : "No"}

⚠️ *Alerta*: Mantén la vigilancia activa. Movimientos sospechosos pueden aparecer en cualquier cámara.`
    conn.reply(m.chat, ipsearch, m)
    await m.react('✔️')
  } catch (error) {
    await m.react('✖️')
    conn.reply(m.chat, `⚠️ *[ERROR EN EL SISTEMA DE VIGILANCIA]* ⚠️\n> Usa *${usedPrefix}report* para informar.\n\n${error.message}`, m)
  }
}

handler.help = ['ip <direccion ip>']
handler.tags = ['owner']
handler.command = ['ip']

export default handler
