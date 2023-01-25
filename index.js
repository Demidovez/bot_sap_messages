const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Telegraf, Stage, Extra, session } = require("telegraf");
const createNotifyScene = require("./bot/notifyScene");
const createSignInScene = require("./bot/signinScene");
const config = require("./config");
const HelperBot = require("./bot/helper");
const Database = require("./database");
const Helper = require("./helper");

// Создаем соединение с ботом
const bot = new Telegraf(config.BOT_TOKEN);

// Создаем веб-сервер
const app = express();

// Делаем наш парсинг в формате json
app.use(bodyParser.json());

// Добавляем дополнительные зоголовки для запросов
app.use(cors());

// Парсит запросы по типу: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Создаем сцены
const notifyScene = createNotifyScene();
const signIn = createSignInScene();
const stage = new Stage([notifyScene, signIn]);

// Настраиваем бота
bot.use(session());
bot.use(stage.middleware());

bot.on("message", (ctx) => {
  bot.telegram.sendMessage(
    321438949,
    "Сообщение от " + ctx.message.from.id + ": " + ctx.message.text
  );
});

// Запускаем бота
bot.launch();

// Создаем подключение к БД Sap HANA
const db = new Database("SP1");

//  Достаем из БД все проблемы
app.post("/event_sap", async (req, res) => {
  res.json("OK");

  const [SYSID, ...data] = req.body.data.split("||");

  if (SYSID === "SP1") {
    await Helper.fillTamplateHtml(db, data);

    HelperBot.sendPhoto(bot, db, data[0], data[19], data[20]);
  }
});

// Устанавливаем порт, и слушаем запросы
app
  .listen(5010, () => {
    console.log("Сервер запущен на 5010 порту");
  })
  .on("error", (e) => {
    console.error(e.message);
    db.disconnect();
    throw e;
  });
