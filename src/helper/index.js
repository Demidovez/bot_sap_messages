const fs = require("fs");
const path = require("path");

class Helper {
  // Проверяем бот-пользователя в БД
  static async checkUser(user) {
    if (user) {
      return {
        isHaveAccess: true,
      };
    }

    return {
      isHaveAccess: false,
    };
  }

  static getNotifyStatus(phase, phaseOld) {
    let status = "";

    switch (phase === phaseOld ? 0 : parseInt(phase)) {
      case 0:
        status = "Сообщение изменено";
        break;
      case 1:
        status = "Сообщение сохранено";
        break;
      case 3:
        status = "Сообщение создано";
        break;
      case 4:
        status = "Сообщение закрыто";
        break;
      case 5:
        status = "Сообщение удалено";
        break;
      default:
        status = "Сообщение создано";
    }

    return status;
  }

  static getNotifyIcon(phase, phaseOld) {
    let icon = "";

    switch (phase === phaseOld ? 0 : parseInt(phase)) {
      case 0:
        icon = "notifi_change";
        break;
      case 1:
        icon = "notifi_only_save";
        break;
      case 3:
        icon = "notifi_create";
        break;
      case 4:
        icon = "notifi_done";
        break;
      case 5:
        icon = "notifi_delete";
        break;
      default:
        icon = "notifi_create";
    }

    return icon;
  }

  static correctDescNotifi(desc) {
    return desc
      .split(">X*")
      .map((line) =>
        line.indexOf("UTC+3") != -1
          ? "<span class='info-line'>" + line.replace("UTC+3", "") + "</span>"
          : line.split(">X ").join("").split(">X=").join("")
      )
      .join("");
  }

  static correctDate(dateStr, timeStr) {
    return (
      dateStr.replace(/(....)(..)(..)/, "$3.$2.$1") +
      " " +
      timeStr.replace(/(..)(..)(..)/, "$1:$2:$3")
    );
  }

  static async fillTamplateHtml(db, data = []) {
    const [
      QMNUM,
      QMTXT,
      EQUNR,
      AUFNR,
      QMGRP,
      QMCOD,
      QMNAM,
      QMDAT,
      MZEIT,
      ERNAM,
      STRMN,
      STRUR,
      AENAM,
      BEZDT,
      BEZUR,
      PHASE,
      PHASE_OLD,
      LXTX,
      TPLNR,
      INGRP,
      ARBPL,
    ] = data;

    let contentHtml = fs.readFileSync(
      path.join(__dirname, "../html/template.html"),
      "utf8"
    );

    const MY_TYPE = await db.getTypeNotification(QMGRP, QMCOD);
    const MY_TMDESC = TPLNR ? await db.getLocationInfo(TPLNR) : "";
    const MY_EODESC = EQUNR ? await db.getEquipmentInfo(EQUNR) : "";
    const MY_INDESC = INGRP ? await db.getIngrpInfo(INGRP) : "";
    const [MY_GEWERK, MY_GEWDESC] = ARBPL ? await db.getGewerkInfo(ARBPL) : "";
    const MY_COUNT_ATTACH = await db.getCountAttaches(QMNUM);

    const listToReplace = {
      "[[ICON_NOTIFI]]": this.getNotifyIcon(PHASE, PHASE_OLD),
      "[[NOTIFI]]": this.getNotifyStatus(PHASE, PHASE_OLD),
      "[[NOM_NOTIFI]]": parseFloat(QMNUM),
      "[[IS_HIDE_TYPE]]": QMGRP ? "" : "hide",
      "[[TYPE]]": MY_TYPE,
      "[[IS_HIDE_TM]]": TPLNR ? "" : "hide",
      "[[TM]]": TPLNR,
      "[[TITLE_TM]]": MY_TMDESC,
      "[[IS_HIDE_EO]]": EQUNR ? "" : "hide",
      "[[EO]]": EQUNR,
      "[[TITLE_EO]]": MY_EODESC,
      "[[IS_HIDE_ORDER]]": AUFNR ? "" : "hide",
      "[[ORDER]]": parseFloat(AUFNR),
      "[[DATE_NOTIFI]]": this.correctDate(QMDAT, MZEIT),
      "[[DATE_CREATE]]": this.correctDate(STRMN, STRUR),
      "[[IS_HIDE_DATE_MODIFY]]": PHASE_OLD ? "" : "hide",
      "[[DATE_MODIFY]]": this.correctDate(BEZDT, BEZUR),
      "[[TITLE]]": QMTXT,
      "[[IS_HIDE_DESC]]": LXTX ? "" : "hide",
      "[[DESC]]": this.correctDescNotifi(LXTX),
      "[[PLANNER_CODE]]": INGRP,
      "[[PLANNER_TITLE]]": MY_INDESC,
      "[[WORKERS_CODE]]": MY_GEWERK,
      "[[WORKERS_TITLE]]": MY_GEWDESC,
      "[[IS_HIDE_AUTHOR]]": QMNAM ? "" : "hide",
      "[[AUTHOR]]": QMNAM,
      "[[CREATOR]]": ERNAM,
      "[[IS_HIDE_MODIFIER]]": PHASE_OLD ? "" : "hide",
      "[[MODIFIER]]": AENAM,
      "[[IS_HIDE_FILES]]": MY_COUNT_ATTACH ? "" : "hide",
      "[[FILES]]": MY_COUNT_ATTACH,
    };

    for (const field in listToReplace) {
      contentHtml = contentHtml.replace(field, listToReplace[field]);
    }

    fs.writeFileSync(path.join(__dirname, "../html/index.html"), contentHtml);
  }
}

module.exports = Helper;
