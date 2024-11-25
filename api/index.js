const express = require('express')
const { Telegraf } = require('telegraf');

const app = express();

app.use(express.json())

// Função para criar um bot
let bots = []


function createBot(token, welcomeMessage) {
    const bot = new Telegraf(token);
    bot.start((ctx) => ctx.reply(welcomeMessage));
    bot.on('text', (ctx) => {
        ctx.reply(welcomeMessage);
    });
    bot.launch();
    
    return bot;
}


function SearchBot(token) {
    for (let i in bots) {
        if (bots[i].token == token) {
            return bots[i]
        }
    }
    return;
}

app.get("/", (req, res)=>{
    res.send("Hello word")
})

app.post("/bot", (req, res) => {
    const { text } = req.body
    const token = "8144116187:AAHliMicOx90JBD8TO3DsbseZRuQr_XmLC8"
    const bot = SearchBot(token)
    if (!bot) {
        bots.push({
            index: bots.length,
            token,
            bot: createBot(token, text)
        })
        console.log("create ok")
    } else {
        const stopBot = bot.bot
        stopBot.stop()
        bots[bot.index] = {
            index: bot.index,
            token,
            bot: createBot(token, text)
        }
        console.log("update ok")
    }

    
    res.send()
})


app.listen(3000, () => {
    console.log("rodando")
})


