const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const db = require('./database.js'); // Importar la lógica de la base de datos

const flowPrincipal = addKeyword(['Hola', 'inicio', 'empezar', 'hi', 'ole']).addAnswer(
    [
        "Bienvenido", 
        "-Opción 1",
        "-Opción 2",
        "-Opción 3"
    ],
    {capture:true},
    (ctx, {fallback})=>{
        const numero = ctx.from;
        const [, tarea, fecha] = ctx.body.split(';'); // Separar por ";"
        
        db.addTask(numero, tarea.trim(), fecha.trim(), (err) => {
            if (err) {
                return(fallback)
            } else {
                console.log(`Tarea registrada: "${tarea.trim()}" para la fecha: ${fecha.trim()}`);
            }
        });
       

        console.log(ctx)
    }
)

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
