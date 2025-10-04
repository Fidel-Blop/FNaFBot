let handler = async (m, { conn, text }) => {
let id = m.chat
conn.math = conn.math ? conn.math : {}
if (id in conn.math) {
clearTimeout(conn.math[id][3])
delete conn.math[id]
m.reply('🔇 El eco de la última ecuación se desvanece en los pasillos...')
}
if (!text) {
return m.reply(`🎭 *ERROR en la consola de seguridad...* \n\n📟 Ingresa una ecuación para continuar con los cálculos del turno nocturno.`)
}
let val = text.replace(/[^0-9\-\/+*×÷πEe()piPI/]/g, '').replace(/×/g, '*').replace(/÷/g, '/').replace(/π|pi/gi, 'Math.PI').replace(/e/gi, 'Math.E').replace(/\/+/g, '/').replace(/\++/g, '+').replace(/-+/g, '-')
let format = val.replace(/Math\.PI/g, 'π').replace(/Math\.E/g, 'e').replace(/\//g, '÷').replace(/\*×/g, '×')
try {
await m.react('🕒')
let result = (new Function('return ' + val))()
if (!result) throw result
await m.reply(`📟 *Monitor de Seguridad – Registro Matemático* 📟\n\n🔢 Ejercicio detectado: *${format}*\n⚙️ Resultado procesado: _${result}_\n\n🎶 (Se escucha un ruido metálico en la cocina...)`)
await m.react('✔️')
} catch (e) {
await m.react('✖️')
return m.reply(`🚨 *¡Advertencia en el sistema!* 🚨\n\nEl formato ingresado es incorrecto.\n\n🗂️ Símbolos permitidos:\n0-9 | -, +, ×, ÷, *, /, π, e, (, )\n\n💡 *Consejo del Guardián*: No dejes que los errores te distraigan... las cámaras siguen grabando.`)
}}

handler.help = ['cal']
handler.tags = ['tools']
handler.command = ['cal', 'calc', 'calcular', 'calculadora']
handler.group = true
handler.exp = 5

export default handler
