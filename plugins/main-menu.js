import fetch from 'node-fetch'

let handler = async (m, { conn, args }) => {
let mentionedJid = await m.mentionedJid
let userId = mentionedJid && mentionedJid[0] ? mentionedJid[0] : m.sender
let totalreg = Object.keys(global.db.data.users).length
let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length
    
let txt = `̮̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮   ̮
︶•︶°︶•︶°︶•︶°︶•︶°︶•︶°︶
> 🎥👁️ ¡Hola, guardia nocturno! @${userId.split('@')[0]}  
Soy *${botname}* y desde la *Cámara de Seguridad* te entrego el **panel de comandos**.  
Mantén la calma, los animatrónicos pueden estar escuchando...

╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ؕ͜─ׄ͜─֬͜─֟͜─֫͜─ׄ͜─ؕ͜─݊͜┈ࠦ͜┅ࠡ͜͜┈࠭͜͜۰۰͜۰
│🔦 *Tipo de Unidad* » ${(conn.user.jid == global.conn.user.jid ? 'Central Principal' : 'Sub-Sistema')}
│👤 *Usuarios Registrados* » ${totalreg.toLocaleString()}
│⚙️ *Versión del Sistema* » ${vs}
│📂 *Módulos Activos* » ${totalCommands}
│🖥️ *Librería Base* » ${libreria}
╰ׅ┈ࠢ͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ  ⋮֔   ᩴ ⋰╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜┈ࠢ͜╯ׅ

╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴🪙 *ECONOMÍA FNaF* 🪙╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
> ✿ Comandos para ganar *tokens de la pizzería*.  
Úsalos con cuidado... no querrás llamar demasiado la atención de Rockstar Freddy.

✦ *#w • #work • #trabajar*  
> ⸙ Gana fichas limpiando la pizzería o revisando cámaras.  

✦ *#slut • #prostituirse*  
> ⸙ Opción cuestionable... incluso Foxy te juzgará por esto.  

✦ *#coinflip • #flip • #cf* + [cantidad] <cara/cruz>  
> ⸙ Apuesta fichas lanzando una ficha de arcade.  

✦ *#crime • #crimen*  
> ⸙ Intenta robar en la máquina de tickets... cuidado con la Marioneta.  

✦ *#roulette • #rt* + [red/black] [cantidad]  
> ⸙ Apuesta fichas en la ruleta de premios.  

✦ *#casino • #apostar • #slot* + [cantidad]  
> ⸙ Prueba suerte en la tragaperras de la pizzería.  

✦ *#balance • #bal • #bank* + <usuario>  
> ⸙ Ver cuántas fichas guardaste en la caja fuerte del guardia.  

✦ *#deposit • #dep • #depositar • #d* + [cantidad] | all  
> ⸙ Deposita fichas en la bóveda de seguridad.  

✦ *#withdraw • #with • #retirar* + [cantidad] | all  
> ⸙ Retira fichas... con riesgo de que alguien te vea.  

✦ *#economyinfo • #einfo*  
> ⸙ Estado de tu economía nocturna.  

✦ *#givecoins • #pay • #coinsgive* + [usuario] [cantidad]  
> ⸙ Entrega fichas a otro guardia (o animatrónico, si te atreves).  

✦ *#miming • #minar • #mine*  
> ⸙ Minar fichas entre los restos del backstage.  

✦ *#daily • #diario*  
> ⸙ Reclama tu paga diaria por sobrevivir un turno.  

✦ *#cofre • #coffer*  
> ⸙ Abre un cofre olvidado en la oficina.  

✦ *#weekly • #semanal*  
> ⸙ Bono semanal por no renunciar al trabajo.  

✦ *#monthly • #mensual*  
> ⸙ Bono mensual — si llegas vivo.  

✦ *#steal • #robar • #rob* + [@mencion]  
> ⸙ Intenta robar fichas a otro empleado (arriesgado).  

✦ *#economyboard • #eboard • #baltop* + <pagina>  
> ⸙ Ranking de economía en la pizzería.  

✦ *#aventura • #adventure*  
> ⸙ Explora la pizzería en busca de tokens y exp.  

✦ *#curar • #heal*  
> ⸙ Restaura tu salud en la sala médica.  

✦ *#cazar • #hunt*  
> ⸙ Caza animatrónicos descompuestos para fichas.  

✦ *#fish • #pescar*  
> ⸙ Pesca en los estanques de utilería del local.  

✦ *#mazmorra • #dungeon*  
> ⸙ Explora zonas oscuras y bloqueadas de la pizzería.  

╰ׅ͜─֟͜─͜─ٞ͜─͜─๊͜─͜─๋͜─⃔═̶፝֟͜═̶⃔─๋͜─͜─͜─๊͜─ٞ͜─͜─֟͜┈ࠢ͜╯ׅ
╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴📥 *DOWNLOAD SYSTEM* 📥╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
> ✿ Módulos de *Descarga de Archivos* desde distintas fuentes externas.  
⚠️ Ten cuidado... algunos enlaces podrían estar “malditos” en el sistema.

✦ *#tiktok • #tt* + [Link] / [búsqueda]  
> ⸙ Descarga grabaciones virales desde la red… incluso aquellas que nunca debieron compartirse.  

✦ *#mediafire • #mf* + [Link]  
> ⸙ Recupera archivos olvidados en MediaFire… ¿seguro que quieres abrirlos?  

✦ *#mega • #mg* + [Link]  
> ⸙ Extrae datos encriptados desde MEGA. A veces contienen cosas… extrañas.  

✦ *#play • #play2 • #ytmp3 • #ytmp4* + [Canción] / [Link]  
> ⸙ Descarga música o videos desde YouTube. Perfecto para ambientar tu turno nocturno.  

✦ *#facebook • #fb* + [Link]  
> ⸙ Obtén grabaciones de Facebook. Algunas parecen cámaras de seguridad viejas…  

✦ *#twitter • #x* + [Link]  
> ⸙ Descarga transmisiones extrañas desde Twitter/X.  

✦ *#ig • #instagram* + [Link]  
> ⸙ Recupera reels de Instagram… aunque la Marioneta dice que no los abras a medianoche.  

✦ *#pinterest • #pin* + [búsqueda] / [Link]  
> ⸙ Encuentra imágenes en Pinterest. Algunas podrían mostrar a los animatrónicos fuera de lugar.  

✦ *#image • #imagen* + [búsqueda]  
> ⸙ Busca imágenes en Google. Úsalas como referencia de las cámaras de la pizzería.  

✦ *#apk • #modapk* + [búsqueda]  
> ⸙ Descarga aplicaciones ocultas desde Aptoide. ¿Un minijuego de Freddy tal vez?  

✦ *#ytsearch • #search* + [búsqueda]  
> ⸙ Rastrear videos en YouTube. A veces aparecen grabaciones “no listadas” de la pizzería.  

╰ׅ͜─֟͜─͜─ٞ͜─͜─๊͜─͜─๋͜─⃔═̶፝֟͜═̶⃔─๋͜─͜─͜─๊͜─ٞ͜─͜─֟͜┈ࠢ͜╯ׅ

╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴🔌 *SOCKETS SYSTEM* 🔌╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
> ✿ Módulo para registrar y controlar tu propio Bot.  
☠️ Advertencia: manipular los *sockets* puede despertar procesos… dormidos.

✦ *#qr • #code*  
> ⸙ Genera un Sub-Bot mediante código QR/Code. Como activar un animatrónico desde consola.  

✦ *#bots • #botlist*  
> ⸙ Ver cuántos bots (o “unidades activas”) siguen funcionando dentro del sistema.  

✦ *#status • #estado*  
> ⸙ Comprobar el estado actual del bot.  
📡 Como chequear las cámaras… ¿el sistema sigue vivo?  

✦ *#p • #ping*  
> ⸙ Mide el tiempo de respuesta. Cada milisegundo cuenta… cuando los pasillos están oscuros.  

✦ *#join* + [Invitación]  
> ⸙ Conectar al bot a un nuevo grupo. Como mover un animatrónico a otra sala.  

✦ *#leave • #salir*  
> ⸙ Forzar al bot a retirarse de un grupo.  
🚪 “Unit offline”.  

✦ *#logout*  
> ⸙ Cierra la sesión del bot.  
🛑 Precaución: podría no volver a encenderse.  

✦ *#setpfp • #setimage*  
> ⸙ Cambiar la imagen de perfil. Como darle nueva máscara a un animatrónico.  

✦ *#setstatus* + [estado]  
> ⸙ Configura el estado del bot. Mensajes en la consola del sistema.  

✦ *#setusername* + [nombre]  
> ⸙ Renombra al bot. Cuidado: algunos nombres ya están “tomados” por entidades viejas.  

╰ׅ͜─֟͜─͜─ٞ͜─͜─๊͜─͜─๋͜─⃔═̶፝֟͜═̶⃔─๋͜─͜─͜─๊͜─ٞ͜─͜─֟͜┈ࠢ͜╯ׅ
╰ׅ͜─֟͜─͜─ٞ͜─͜─๊͜─͜─๋͜─⃔═̶፝֟͜═̶⃔─๋͜─͜─͜─๊͜─ٞ͜─͜─֟͜┈ࠢ͜╯ׅ

╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴⚙️ *UTILITIES SYSTEM* ⚙️╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
> ✿ Módulo de *Utilidades* para el operador.  
🖥️ Cada comando es como abrir una vieja terminal en Fazbear Entertainment…  

✦ *#help • #menu*  
> ⸙ Muestra el manual del sistema. (Aunque algunas páginas parecen… arrancadas).  

✦ *#calcular • #cal*  
> ⸙ Calcula ecuaciones. Como los viejos minijuegos de arcade escondidos.  

✦ *#delmeta*  
> ⸙ Restablece el pack y autor de tus stickers. “Default parameters restored”.  

✦ *#getpic • #pfp* + [@usuario]  
> ⸙ Accede a la imagen de perfil de un usuario. Como revisar cámaras de seguridad.  

✦ *#say* + [texto]  
> ⸙ El bot repite tu mensaje. Como una voz robótica en los parlantes del local.  

✦ *#setmeta* + [autor] | [pack]  
> ⸙ Configura el pack/autor de stickers. Nuevo “branding” aplicado.  

✦ *#sticker • #s • #wm* + {citar img/video}  
> ⸙ Convierte imagen/video en sticker.  
📸 “Rendering asset…”  

✦ *#toimg • #img* + {citar sticker}  
> ⸙ Transforma stickers a imágenes. Como restaurar archivos dañados.  

✦ *#brat • #bratv • #qc • #emojimix*  
> ⸙ Genera stickers con texto. Mensajes ocultos en la pared.  

✦ *#gitclone* + [Link]  
> ⸙ Descarga un repositorio de GitHub.  
🗄️ Archivos como expedientes secretos.  

✦ *#enhance • #remini • #hd*  
> ⸙ Mejora la calidad de imágenes. “ENHANCE… acercando pasillo cámara 3A…”  

✦ *#letra • #style*  
> ⸙ Cambia el estilo de las letras. Como tipografías de archivos viejos.  

✦ *#read • #readviewonce*  
> ⸙ Ver imágenes de “solo una vez”.  
👁️ “ViewOnce bypassed”.  

✦ *#ss • #ssweb*  
> ⸙ Screenshot de páginas web. “Snapshot de sistemas externos”.  

✦ *#translate • #traducir • #trad*  
> ⸙ Traduce idiomas.  
📖 Archivos internos no siempre están en inglés…  

✦ *#ia • #gemini*  
> ⸙ Pregunta a la IA.  
🤖 “Assistant protocol online…”  

✦ *#tourl • #catbox*  
> ⸙ Convierte archivos en links. Transferencia remota habilitada.  

✦ *#wiki • #wikipedia*  
> ⸙ Busca en la base de datos pública.  
📚 Aunque algunos temas parecen… alterados.  

✦ *#dalle • #flux*  
> ⸙ Genera imágenes con IA. Como recreaciones de recuerdos difusos.  

✦ *#npmdl • #nmpjs*  
> ⸙ Descarga paquetes de NPMJS.  
📦 “Package retrieved successfully”.  

✦ *#google*  
> ⸙ Realiza búsquedas en Google.  
🔎 Porque no todo está en los archivos internos de Fazbear…  

╰ׅ͜─֟͜─͜─ٞ͜─͜─๊͜─͜─๋͜─⃔═̶፝֟͜═̶⃔─๋͜─͜─͜─๊͜─ٞ͜─͜─֟͜┈ࠢ͜╯ׅ

╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴🗂️ *PROFILES DATABASE* 🗂️╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
> ✿ Comandos de *Perfil*. Cada usuario tiene su propio “expediente” en el sistema de Fazbear Entertainment.

✦ *#leaderboard • #lboard • #top* + <Página>  
> ⸙ Consulta el *ranking* de usuarios más activos. Como la lista de empleados con más turnos cumplidos.  

✦ *#level • #lvl* + <@Mencion>  
> ⸙ Ver tu nivel y experiencia. Tu “registro de servicio nocturno”.  

✦ *#marry • #casarse* + <@Mencion>  
> ⸙ Vincularte con alguien. Contratos internos, más permanentes de lo que parece…  

✦ *#profile* + <@Mencion>  
> ⸙ Accede a tu archivo personal. Fotografía, registros y observaciones.  

✦ *#setbirth* + [fecha]  
> ⸙ Establece tu fecha de nacimiento. Datos añadidos al expediente.  

✦ *#setdescription • #setdesc* + [Descripción]  
> ⸙ Personaliza tu ficha. “Notas adicionales”.  

✦ *#setgenre* + Hombre | Mujer  
> ⸙ Define tu género. Parámetro de registro biométrico.  

✦ *#delgenre • #delgenero*  
> ⸙ Elimina tu género del sistema. (Los archivos quedan incompletos).  

✦ *#delbirth* + [fecha]  
> ⸙ Elimina tu fecha de nacimiento del archivo.  

✦ *#divorce*  
> ⸙ Finaliza tu vínculo. “Contrato roto”.  

✦ *#setfavourite • #setfav* + [Personaje]  
> ⸙ Establece tu personaje favorito. Tu *animatrónico reclamado*.  

✦ *#deldescription • #deldesc*  
> ⸙ Elimina tu descripción del archivo.  

✦ *#prem • #vip*  
> ⸙ Acceso a Membresía Premium. Como un pase especial… reservado a clientes “importantes”.  

╰ׅ͜─֟͜─͜─ٞ͜─͜─๊͜─͜─๋͜─⃔═̶፝֟͜═̶⃔─๋͜─͜─͜─๊͜─ٞ͜─͜─֟͜┈ࠢ͜╯ׅ╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴🔒 *GROUP CONTROL SYSTEM* 🔒╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
> ✿ Comandos para *Administradores*.  
📋 Piensa en esto como el **panel de seguridad del guardia nocturno**, con opciones de control y alerta.

✦ *#tag • #hidetag • #invocar • #tagall* + [mensaje]  
> ⸙ Menciona a todos los usuarios del grupo. Broadcast como altavoz del local.  

✦ *#detect • #alertas* + [enable/disable]  
> ⸙ Activa o desactiva alertas. “Promote/Demote log system”.  

✦ *#antilink • #antienlace* + [enable/disable]  
> ⸙ Sistema antienlaces. Bloqueo de accesos externos.  

✦ *#bot* + [enable/disable]  
> ⸙ Activa o desactiva al bot. Encendido/apagado de sistemas automáticos.  

✦ *#close • #cerrar*  
> ⸙ Cierra el grupo. Solo administradores con “llave maestra” pueden hablar.  

✦ *#demote* + <@usuario>  
> ⸙ Revoca privilegios de admin. Acceso restringido.  

✦ *#economy* + [enable/disable]  
> ⸙ Activa/desactiva economía. Terminal financiera local.  

✦ *#gacha* + [enable/disable]  
> ⸙ Activa/desactiva juegos. Arcade encendido/apagado.  

✦ *#welcome • #bienvenida* + [enable/disable]  
> ⸙ Mensajes de bienvenida/despedida. Como anuncios automáticos en altavoz.  

✦ *#setbye* + [texto]  
> ⸙ Configura mensaje de despedida. “Registro de salida del empleado”.  

✦ *#setprimary* + [@bot]  
> ⸙ Establece el bot principal del grupo. Control central.  

✦ *#setwelcome* + [texto]  
> ⸙ Configura mensaje de bienvenida.  

✦ *#kick* + <@usuario>  
> ⸙ Expulsa a un usuario. “Acceso denegado”.  

✦ *#nsfw* + [enable/disable]  
> ⸙ Activa o bloquea comandos NSFW. (Zona restringida).  

✦ *#onlyadmin* + [enable/disable]  
> ⸙ Solo admins pueden usar comandos. Nivel de seguridad alto.  

✦ *#open • #abrir*  
> ⸙ Reabre el grupo. Todos pueden hablar.  

✦ *#promote* + <@usuario>  
> ⸙ Asciende a administrador. Entrega de tarjeta de acceso.  

✦ *#add • #añadir • #agregar* + {número}  
> ⸙ Invita a un usuario. “Nueva credencial generada”.  

✦ *admins • admin* + [texto]  
> ⸙ Menciona a los administradores. Llamado de emergencia al staff.  

✦ *#restablecer • #revoke*  
> ⸙ Restablece el enlace del grupo. Como reiniciar las puertas de seguridad.  

✦ *#addwarn • #warn* + <@usuario>  
> ⸙ Advertir a un usuario. Registro de conducta.  

✦ *#unwarn • #delwarn* + <@usuario>  
> ⸙ Quita advertencias. Expediente limpiado.  

✦ *#advlist • #listadv*  
> ⸙ Lista de usuarios advertidos. Archivos con reportes.  

✦ *#inactivos • #kickinactivos*  
> ⸙ Detecta y elimina inactivos. “Purge protocol”.  

✦ *#listnum • #kicknum* [texto]  
> ⸙ Elimina usuarios según prefijo de país.  

✦ *#gpbanner • #groupimg*  
> ⸙ Cambia imagen del grupo. Nuevo logotipo.  

✦ *#gpname • #groupname* [texto]  
> ⸙ Cambia el nombre del grupo. Archivo renombrado.  

✦ *#gpdesc • #groupdesc* [texto]  
> ⸙ Cambia la descripción del grupo. Notas internas.  

✦ *#del • #delete* + {citar mensaje}  
> ⸙ Elimina mensajes. Evidencia borrada.  

✦ *#linea • #listonline*  
> ⸙ Lista de usuarios conectados. “Tracking online subjects”.  

✦ *#gp • #infogrupo*  
> ⸙ Muestra información del grupo. Archivo completo.  

✦ *#link*  
> ⸙ Muestra enlace de invitación. “Generated Invite Protocol”.  

╰ׅ͜─֟͜─͜─ٞ͜─͜─๊͜─͜─๋͜─⃔═̶፝֟͜═̶⃔─๋͜─͜─͜─๊͜─ٞ͜─͜─֟͜┈ࠢ͜╯ׅ

╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴𐔌 🪷*ANIME*🪷 𐦯╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
> ✿ Comandos de reacciones de anime.

✦ *#angry • #enojado* + <mencion>
> ⸙ Estar enojado

✦ *#bath • #bañarse* + <mencion>
> ⸙ Bañarse

✦ *#bite • #morder* + <mencion>
> ⸙ Muerde a alguien

✦ *#bleh • #lengua* + <mencion>
> ⸙ Sacar la lengua

✦ *#blush • #sonrojarse* + <mencion>
> ⸙ Sonrojarte

✦ *#bored • #aburrido* + <mencion>
> ⸙ Estar aburrido

✦ *#clap • #aplaudir* + <mencion>
> ⸙ Aplaudir

✦ *#coffee • #cafe • #café* + <mencion>
> ⸙ Tomar café

✦ *#cry • #llorar* + <mencion>
> ⸙ Llorar por algo o alguien

✦ *#cuddle • #acurrucarse* + <mencion>
> ⸙ Acurrucarse

✦ *#dance • #bailar* + <mencion>
> ⸙ Sacate los pasitos prohíbidos

✦ *#dramatic • #drama* + <mencion>
> ⸙ Drama

✦ *#drunk • #borracho* + <mencion>
> ⸙ Estar borracho

✦ *#eat • #comer* + <mencion>
> ⸙ Comer algo delicioso

✦ *#facepalm • #palmada* + <mencion>
> ⸙ Darte una palmada en la cara

✦ *#happy • #feliz* + <mencion>
> ⸙ Salta de felicidad

✦ *#hug • #abrazar* + <mencion>
> ⸙ Dar un abrazo

✦ *#impregnate • #preg • #preñar • #embarazar* + <mencion>
> ⸙ Embarazar a alguien

✦ *#kill • #matar* + <mencion>
> ⸙ Toma tu arma y mata a alguien

✦ *#kiss • #muak* + <mencion>
> ⸙ Dar un beso

✦ *#kisscheek • #beso* + <mencion>
> ⸙ Beso en la mejilla

✦ *#laugh • #reirse* + <mencion>
> ⸙ Reírte de algo o alguien

✦ *#lick • #lamer* + <mencion>
> ⸙ Lamer a alguien

✦ *#love • #amor • #enamorado • #enamorada* + <mencion>
> ⸙ Sentirse enamorado

✦ *#pat • #palmadita • #palmada* + <mencion>
> ⸙ Acaricia a alguien

✦ *#poke • #picar* + <mencion>
> ⸙ Picar a alguien

✦ *#pout • #pucheros* + <mencion>
> ⸙ Hacer pucheros

✦ *#punch • #pegar • #golpear* + <mencion>
> ⸙ Dar un puñetazo

✦ *#run • #correr* + <mencion>
> ⸙ Correr

✦ *#sad • #triste* + <mencion>
> ⸙ Expresar tristeza

✦ *#scared • #asustado • #asustada* + <mencion>
> ⸙ Estar asustado

✦ *#seduce • #seducir* + <mencion>
> ⸙ Seducir a alguien

✦ *#shy • #timido • #timida* + <mencion>
> ⸙ Sentir timidez

✦ *#slap • #bofetada* + <mencion>
> ⸙ Dar una bofetada

✦ *#sleep • #dormir* + <mencion>
> ⸙ Tumbarte a dormir

✦ *#smoke • #fumar* + <mencion>
> ⸙ Fumar

✦ *#spit • #escupir* + <mencion>
> ⸙ Escupir

✦ *#step • #pisar* + <mencion>
> ⸙ Pisar a alguien

✦ *#think • #pensar* + <mencion>
> ⸙ Pensar en algo

✦ *#walk • #caminar* + <mencion>
> ⸙ Caminar

✦ *#wink • #guiñar* + <mencion>
> ⸙ Guiñar el ojo

✦ *#cringe • #avergonzarse* + <mencion>
> ⸙ Sentir vergüenza ajena

✦ *#smug • #presumir* + <mencion>
> ⸙ Presumir con estilo

✦ *#smile • #sonreir* + <mencion>
> ⸙ Sonreír con ternura

✦ *#highfive • #5* + <mencion>
> ⸙ Chocar los cinco

✦ *#bully • #bullying* + <mencion>
> ⸙ Molestar a alguien

✦ *#handhold • #mano* + <mencion>
> ⸙ Tomarse de la mano

✦ *#wave • #ola • #hola* + <mencion>
> ⸙ Saludar con la mano

✦ *#ppcouple • #ppcp*
> ⸙ Genera imágenes para amistades o parejas.
╰ׅ͜─֟͜─͜─ٞ͜─͜─๊͜─͜─๋͜─⃔═̶፝֟͜═̶⃔─๋͜─͜─͜─๊͜─ٞ͜─͜─֟͜┈ࠢ͜╯`.trim()
await conn.sendMessage(m.chat, { 
text: txt,
contextInfo: {
mentionedJid: [userId],
isForwarded: true,
forwardedNewsletterMessageInfo: {
newsletterJid: channelRD.id,
serverMessageId: '',
newsletterName: channelRD.name
},
externalAdReply: {
title: botname,
body: textbot,
mediaType: 1,
mediaUrl: redes,
sourceUrl: redes,
thumbnail: await (await fetch(banner)).buffer(),
showAdAttribution: false,
containsAutoReply: true,
renderLargerThumbnail: true
}}}, { quoted: m })
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help']

export default handler
