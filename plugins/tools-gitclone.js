import fetch from 'node-fetch'

const regex = /^(?:https:\/\/|git@)github\.com\/([^\/]+)\/([^\/]+?)(?:\.git)?$/i
const handler = async (m, { conn, usedPrefix, text }) => {
if (!text) return conn.reply(m.chat, '🎭 *[ACCESO DENEGADO]* 🎭\n\nIngresa un enlace o nombre del *repositorio de GitHub* para acceder a los archivos del sistema.', m)

try {
  await m.react('🕒') // ⏳ como si se estuviera cargando la cámara
  let info = ''
  let image
  let zipBuffer, zipName
  let repos = []

  const match = text.match(regex)
  if (match) {
    const [, user, repo] = match
    const repoRes = await fetch(`https://api.github.com/repos/${user}/${repo}`)
    const zipRes = await fetch(`https://api.github.com/repos/${user}/${repo}/zipball`)
    const repoData = await repoRes.json()
    zipName = zipRes.headers.get('content-disposition')?.match(/filename=(.*)/)?.[1]
    if (!zipName) zipName = `${repo}-${user}.zip`
    zipBuffer = await zipRes.buffer()
    repos.push(repoData)
    image = 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745610598914.jpeg' // imagen fija tipo “cámara rota”
  } else {
    const res = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(text)}`)
    const json = await res.json()
    if (!json.items.length) return conn.reply(m.chat, '🔦 *[SIN RESULTADOS EN EL SISTEMA]* 🔦', m)
    repos = json.items
    image = await (await fetch(repos[0].owner.avatar_url)).buffer()
  }

  info += repos.map((repo, index) => `📟 *[ARCHIVO #${index + 1}]* 📟
🗂️ Creador: ${repo.owner.login}
🖥️ Nombre: ${repo.name}
📅 Creado: ${formatDate(repo.created_at)}
⏳ Última actualización: ${formatDate(repo.updated_at)}
👁️ Visitas: ${repo.watchers}
🪓 Bifurcado: ${repo.forks}
⭐ Estrellas: ${repo.stargazers_count}
🚨 Issues: ${repo.open_issues}
📋 Descripción: ${repo.description ? repo.description : 'Sin descripción registrada'}
🔗 Enlace de acceso: ${repo.clone_url}`).join('\n────────────────────\n')

  await conn.sendFile(m.chat, image, 'github_info.jpg', `🎮 *[REGISTROS DEL SISTEMA - CÁMARAS ACTIVAS]* 🎮\n\n${info.trim()}`, m)

  if (zipBuffer && zipName) {
    await conn.sendFile(m.chat, zipBuffer, zipName, null, m)
  }

  await m.react('✔️') // ✅ sistema completo
} catch (e) {
  await m.react('✖️')
  conn.reply(m.chat, `⚠️ *[ERROR EN LOS ARCHIVOS DEL SISTEMA]* ⚠️\n\nEl acceso ha fallado...\n\n> Usa *${usedPrefix}report* para informar el problema.\n\nDetalles: ${e.message}`, m)
}}

handler.help = ['gitclone']
handler.tags = ['github', 'tools']
handler.command = ['gitclone']
handler.group = true

export default handler

function formatDate(n, locale = 'es') {
  const d = new Date(n)
  return d.toLocaleDateString(locale, { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric', 
    hour: 'numeric', 
    minute: 'numeric', 
    second: 'numeric' 
  })
}
