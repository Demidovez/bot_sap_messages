const Scene = require("telegraf/scenes/base");
const { Markup, Extra } = require("telegraf");

createSignInScene = () => {
  const signIn = new Scene("SignIn");

  signIn.enter(async (ctx) => {
    await ctx.reply(
      "Введите код входа:",
      Extra.markup((m) => m.removeKeyboard())
    );
  });

  signIn.on("text", async (ctx) => {
    const code = Number(ctx.message.text);

    if (code && code == 787878) {
      //   await Helper.addBotUser(ctx.message.from).then(() => {
      //     ctx.scene.leave();
      //   });
      ctx.scene.leave();
    } else {
      await ctx.reply("Неверно!");
      ctx.scene.reenter();
    }
  });

  return signIn;
};

module.exports = createSignInScene;
