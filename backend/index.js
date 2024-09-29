const express = require("express");
const PORT = 8000;
const app = express();
const db = require("./database/db");

const cors = require("cors");

app.use(cors());
app.use(express.json());

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS User(id INTEGER PRIMARY KEY,  name VARCHAR(100))"
  );
});

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS Address(id INTEGER PRIMARY KEY, address VARCHAR(500), userId INTEGER,  FOREIGN KEY(userId) REFERENCES User(id))"
  );
});

app.post("/register", (req, res) => {
  const { name, address } = req.body;

  if (!name || !address) {
    return res
      .status(400)
      .json({ status: false, message: "Please fill all fields" });
  }

  db.run("INSERT INTO User (name) VALUES (?)", [name], function (error) {
    if (error) {
      return res
        .status(500)
        .json({ status: false, message: "Error adding User Name" });
    }

    const userId = this.lastID;

    db.run(
      "INSERT INTO Address (address, userId) VALUES (?, ?)",
      [address, userId],
      (error) => {
        if (error) {
          return res
            .status(500)
            .json({ status: false, message: "Error adding User Address" });
        }
        return res.status(201).json({
          status: true,
          message: "User and address created successfully",
        });
      }
    );
  });
});

app.get("/userNamesList", (req, res) => {
  db.all(
    "SELECT User.name, Address.address FROM User LEFT JOIN Address ON User.id = Address.userId",
    (error, row) => {
      if (error) {
        return res
          .status(500)
          .json({ status: false, message: "Error fetching user list" });
      }
      return res.status(200).json({ data: row });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
