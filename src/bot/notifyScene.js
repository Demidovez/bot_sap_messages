const Scene = require("telegraf/scenes/base");

createSignInScene = () => {
  const notifyScene = new Scene("NotifyScene");

  notifyScene.start((ctx) =>
    ctx.reply(
      "Добро пожаловать! Бот будет Вам присылать уведомления о новых сообщениях в SAP ТОРО."
    )
  );

  notifyScene.on("text", async (ctx) => {
    ctx.reply(
      "Бот пока только присылает сообщения из SAP. Ожидайте создания..."
    );
  });

  return notifyScene;
};

module.exports = createSignInScene;
