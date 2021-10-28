const connection = require("@sap/hana-client").createConnection();
const config = require("../config");

const conn_params_SD1 = {
  serverNode: config.SERVER_NODE_SD1,
  databaseName: config.DATABASE_NAME_SD1,
  uid: config.UID_SD1,
  pwd: config.PWD_SD1,
};

const conn_params_SQ1 = {
  serverNode: config.SERVER_NODE_SQ1,
  databaseName: config.DATABASE_NAME_SQ1,
  uid: config.UID_SQ1,
  pwd: config.PWD_SQ1,
};

const conn_params_SP1 = {
  serverNode: config.SERVER_NODE_SP1,
  databaseName: config.DATABASE_NAME_SP1,
  uid: config.UID_SP1,
  pwd: config.PWD_SP1,
};

class Database {
  constructor(SYSID) {
    let conn_params = {};

    switch (SYSID) {
      case "SD1":
        conn_params = conn_params_SD1;
        break;
      case "SQ1":
        conn_params = conn_params_SQ1;
        break;
      case "SP1":
        conn_params = conn_params_SP1;
        break;
      default:
        conn_params = conn_params_SD1;
    }

    connection.connect(conn_params, (err) => {
      if (err) throw err;
    });
  }

  disconnect() {
    connection.disconnect();
  }

  async getNotify(id) {
    let notify = {};

    await new Promise((resolve, reject) => {
      connection.exec(
        "SELECT TOP 1 * FROM VIQMEL WHERE QMNUM = ?",
        [id],
        (err, result) => {
          if (err) reject(err);

          resolve(result[0]);
        }
      );
    })
      .then(
        (result) => (notify = result),
        (err) => console.log("ERROR: " + err)
      )
      .catch(() => console.log("Not found!"));

    return notify;
  }

  async getTypeNotification(QMGRP, QMCOD) {
    let typeNotification = "";

    await new Promise((resolve, reject) => {
      connection.exec(
        "SELECT TOP 1 KURZTEXT FROM QPCT WHERE CODEGRUPPE = ? AND SPRACHE = 'R' AND CODE = ?",
        [QMGRP, QMCOD],
        (err, result) => {
          if (err) reject(err);

          resolve(result[0] ? result[0].KURZTEXT : "");
        }
      );
    })
      .then(
        (result) => (typeNotification = result),
        (err) => console.log("ERROR: " + err)
      )
      .catch(() => console.log("Not found!"));

    return typeNotification;
  }

  async getLocationInfo(TPLNR) {
    let desc = "";

    await new Promise((resolve, reject) => {
      connection.exec(
        "SELECT TOP 1 * FROM IFLOTX WHERE TPLNR = ? AND SPRAS = 'R'",
        [TPLNR],
        (err, result) => {
          if (err) reject(err);

          resolve(result.length ? result[0].PLTXT : "");
        }
      );
    })
      .then(
        (result) => (desc = result),
        (err) => console.log("ERROR: " + err)
      )
      .catch(() => console.log("Not found!"));

    return desc;
  }

  async getEquipmentInfo(EQUNR) {
    let desc = "";

    await new Promise((resolve, reject) => {
      connection.exec(
        "SELECT TOP 1 * FROM EQKT WHERE EQUNR = ? AND SPRAS = 'R'",
        [EQUNR],
        (err, result) => {
          if (err) reject(err);

          resolve(result.length ? result[0].EQKTX : "");
        }
      );
    })
      .then(
        (result) => (desc = result),
        (err) => console.log("ERROR: " + err)
      )
      .catch(() => console.log("Not found!"));

    return desc;
  }

  async getIngrpInfo(INGRP) {
    let desc = "";

    await new Promise((resolve, reject) => {
      connection.exec(
        "SELECT TOP 1 * FROM T024I WHERE INGRP = ?",
        [INGRP],
        (err, result) => {
          if (err) reject(err);

          resolve(result.length ? result[0].INNAM : "");
        }
      );
    })
      .then(
        (result) => (desc = result),
        (err) => console.log("ERROR: " + err)
      )
      .catch(() => console.log("Not found!"));

    return desc;
  }

  async getGewerkInfo(ARBPL) {
    let info = [];

    await new Promise((resolve, reject) => {
      connection.exec(
        "SELECT TOP 1 c.ARBPL, x.KTEXT FROM CRHD c LEFT JOIN CRTX x ON c.OBJID = x.OBJID WHERE c.OBJID = ? AND x.SPRAS = 'R'",
        [ARBPL],
        (err, result) => {
          if (err) reject(err);

          resolve(result.length ? [result[0].ARBPL, result[0].KTEXT] : []);
        }
      );
    })
      .then(
        (result) => (info = result),
        (err) => console.log("ERROR: " + err)
      )
      .catch(() => console.log("Not found!"));

    return info;
  }

  async getCountAttaches(QMNUM) {
    let countFiles = 0;

    await new Promise((resolve, reject) => {
      connection.exec(
        "SELECT COUNT(*) FROM DRAD WHERE OBJKY = ?",
        [QMNUM],
        (err, result) => {
          if (err) reject(err);

          resolve(result.length ? result[0]["COUNT(*)"] : 0);
        }
      );
    })
      .then(
        (result) => (countFiles = result),
        (err) => console.log("ERROR: " + err)
      )
      .catch(() => console.log("Not found!"));

    return countFiles;
  }
}

module.exports = Database;
