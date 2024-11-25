/*
const express = require('express')
const { Telegraf } = require('telegraf');

const app = express();

app.use(express.json())


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
    res.json(bots)
})

app.post("/bot", (req, res) => {
    const { text } = req.body
    const token = "8144116187:AAHliMicOx90JBD8TO3DsbseZRuQr_XmLC8"
    const bot = SearchBot(token)
    console.log(bot)
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


*/



const express = require('express');
const { Telegraf } = require('telegraf');
require('dotenv').config();
const app = express();
app.use(express.json());

let bots = [];


app.get("/", (req, res) => {
    res.json(bots)
});





function createBot(token, text, webhookUrl) {
    try {
        const bot = new Telegraf(token);
        // Configurações do bot
        bot.start((ctx) => ctx.reply(text));
        bot.on('text', (ctx) => {
            ctx.reply(text);
        });
        bot.telegram.setWebhook(`${webhookUrl}/bot/${token}`);
        return bot;
    } catch (error) {
        console.log("Erro ao criar bot: ", error)
    }

}








function SearchBot(token) {
    return bots.find(bot => bot.token === token);
}




// Endpoint para criar ou atualizar um bot
app.post("/bot", (req, res) => {
    const { text } = req.body;
    const token = "8144116187:AAHliMicOx90JBD8TO3DsbseZRuQr_XmLC8"; // Substitua pelo seu token
    const webhookUrl = process.env.URL; // Substitua pelo URL da Vercel

    const existingBot = SearchBot(token);

    if (!existingBot) {
        try {
            const bot = createBot(token, text, webhookUrl)
            bots.push({
                index: bots.length,
                token,
                bot
            });
            console.log("Bot criado com webhook");
        } catch (error) {
            console.log("Não foi possivel criar o bot: ", error)
        }
    } else {
        try {
            const bot = createBot(token, text, webhookUrl);
            bots[existingBot.index] = {
                index: existingBot.index,
                token,
                bot
            }
            console.log("Bot atualizado")
        } catch (error) {
            console.log("Não foi possivel atualizar erro:", error)
        }

    }

    res.status(200).json({ message: "Bot configurado com webhook" });
});






// Endpoint para processar atualizações do Telegram via webhook
app.post("/bot/:token", (req, res) => {
    const { token } = req.params;
    const bot = SearchBot(token);

    if (!bot) {
        return res.status(404).json({ error: "Bot não encontrado" });
    }
    bot.bot.handleUpdate(req.body); // Processa a atualização do Telegram
    res.status(200).send("OK");
});





// Inicializa o servidor
app.listen(3000, () => {
    console.log("Servidor rodando");
});




