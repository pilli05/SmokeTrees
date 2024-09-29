const sqlite = require("sqlite3").verbose();

const db = new sqlite.Database("UserDataBase", (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Connected to the database");
  }
});

module.exports = db;
