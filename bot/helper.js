const puppeteer = require("puppeteer");
const path = require("path");

const users = {
  me: {
    id: 321438949,
    planners: ["A10", "I70"],
    workersPlace: [
      "AD100101",
      "AF100101",
      "AH100101",
      "AL100101",
      "AP100101",
      "AR100101",
      "AS100101",
    ],
    name: "Демидовец",
    isActive: true,
  },
  // gaponenko: {
  //   id: 1023248374,
  //   planners: ["A10", "I70"],
  //   workersPlace: [
  //     "AD100101",
  //     "AF100101",
  //     "AH100101",
  //     "AL100101",
  //     "AP100101",
  //     "AR100101",
  //     "AS100101",
  //   ],
  //   name: "Гапоненко",
  //   isActive: true,
  // },
  karas: {
    id: 1002055422,
    planners: ["-"],
    workersPlace: ["AD100101"],
    name: "Караткевич",
    isActive: true,
  },
  // rybkov: {
  //   id: 472036723,
  //   planners: ["A10", "I70"],
  //   workersPlace: [
  //     "AD100101",
  //     "AF100101",
  //     "AH100101",
  //     "AL100101",
  //     "AP100101",
  //     "AR100101",
  //     "AS100101",
  //   ],
  //   name: "Рябков",
  //   isActive: true,
  // },
  grinevich: {
    id: 568021778,
    planners: ["A10", "I70"],
    workersPlace: [
      "AD100101",
      "AF100101",
      "AH100101",
      "AL100101",
      "AP100101",
      "AR100101",
      "AS100101",
    ],
    name: "Гриневич",
    isActive: true,
  },
  makashin: {
    id: 310597397,
    planners: ["A10", "I70"],
    workersPlace: [
      "AD100101",
      "AF100101",
      "AH100101",
      "AL100101",
      "AP100101",
      "AR100101",
      "AS100101",
    ],
    name: "Макашин",
    isActive: true,
  },
  dasha: {
    id: 1164414206,
    planners: ["!!!!!!!"],
    workersPlace: ["AD100101", "WE100101", "EF100101", "ET100101", "ES100101"],
    name: "Демидкова",
    isActive: true,
  },
  boris_kalyagin: {
    id: 343615451,
    planners: ["!!!!!!!"],
    workersPlace: ["WE100101", "EF100101", "ET100101", "ES100101"],
    name: "Борис Калягин",
    isActive: true,
  },
  guz: {
    id: 966658349,
    planners: ["A10", "I70", "A30"],
    workersPlace: [
      "AD100101",
      "AF100101",
      "AH100101",
      "AL100101",
      "AP100101",
      "AR100101",
      "AS100101",
    ],
    name: "Гуз А.",
    isActive: true,
  },
  stepanov: {
    id: 1059152940,
    planners: ["A10"],
    workersPlace: ["AD100101", "AR100101", "AS100101", "ER100101", "GA100101"],
    name: "Степанов",
    isActive: true,
  },
  romanenko: {
    id: 508581460,
    planners: ["A10"],
    workersPlace: ["AD100101", "AR100101", "AS100101", "ER100101", "GA100101"],
    name: "Романенко",
    isActive: true,
  },
  karebo: {
    id: 554840851,
    planners: ["A10"],
    workersPlace: ["AD100101", "AR100101", "AS100101", "ER100101", "GA100101"],
    name: "Каребо",
    isActive: true,
  },
  tihomirov: {
    id: 474019866,
    planners: ["!!!!!!"],
    workersPlace: ["AL100101", "MP100101"],
    name: "Тихамиров",
    isActive: true,
  },
  gandlevsky: {
    id: 474019866,
    planners: ["!!!!!!"],
    workersPlace: ["AL100101", "MP100101"],
    name: "Гандлевский",
    isActive: true,
  },
  maevskiy: {
    id: 623543191,
    planners: ["!!!!!!"],
    workersPlace: ["AL100101", "MP100101"],
    name: "Маевский",
    isActive: true,
  },
  zahvey: {
    id: 735725849,
    planners: ["!!!!!!"],
    workersPlace: ["AL100101", "MP100101"],
    name: "Захвей",
    isActive: true,
  },
  myadelez: {
    id: 901476542,
    planners: ["-"],
    workersPlace: ["AF100101", "AH100101", "IW100101"],
    name: "Мяделец",
    isActive: true,
  },
};

class HelperBot {
  static async sendPhoto(bot, db, QMNUM, INGRP, ARBPL) {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      defaultViewport: { width: 1280, height: 1280 },
    });

    const page = await browser.newPage();

    await page.goto(`file:${path.join(__dirname, "../html/index.html")}`, {
      waitUntil: "networkidle0",
    });

    await page.screenshot({ path: "notification.png" });

    const [MY_GEWERK, _] = ARBPL ? await db.getGewerkInfo(ARBPL) : "";

    for (let user in users) {
      if (
        users[user].isActive &&
        (users[user].planners.length === 0 ||
          users[user].planners.includes(INGRP) ||
          users[user].workersPlace.length === 0 ||
          users[user].workersPlace.includes(MY_GEWERK))
      ) {
        bot.telegram.sendPhoto(
          users[user].id,
          {
            source: "./notification.png",
          },
          {
            parse_mode: "Markdown",
          }
        );

        // bot.telegram.sendMessage(
        //   321438949,
        //   "Отправленно уведомление по № " +
        //     QMNUM +
        //     " для " +
        //     users[user].name +
        //     " [" +
        //     INGRP +
        //     ", " +
        //     MY_GEWERK +
        //     "]",
        //   {
        //     disable_notification: true,
        //   }
        // );
      }
    }

    // bot.telegram.sendMessage(
    //   321438949,
    //   "Сообщение пришло # " + QMNUM + " [" + INGRP + ", " + MY_GEWERK + "]",
    //   {
    //     disable_notification: true,
    //   }
    // );

    await browser.close();
  }
}

module.exports = HelperBot;
