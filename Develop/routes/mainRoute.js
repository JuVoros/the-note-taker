const express = require("express");
const fs = require("fs");
const app = express();

// uuid
const UUID = () => {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};

app.get("/", (req, res) => {
  console.log(`${req.method} data received.`);

  const dbData = JSON.parse(fs.readFileSync("./db/db.json"));
  res.json(dbData);
});

app.post("/", (req, res) => {
  console.log(`${req.method} data received.`);

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: UUID(),
    };

    let dbData = JSON.parse(fs.readFileSync("./db/db.json"));
    dbData.push(newNote);
    fs.writeFile("./db/db.json", JSON.stringify(dbData, null, 4), (err) => {
        err ? console.error(err) : console.log("\nData written");
    });

    const response = {
      status: "success!!",
      body: newNote,
    };

    res.json(response);
  } else {
    res.json("Problem occured, error in posting the note");
  }
});

app.delete("/:id", (req, res) => {
  console.log(`${req.method} data received.`);

  const id = req.params.id;
  let data = JSON.parse(fs.readFileSync("./db/db.json"));

  for (let i = 0; i < data.length; i++) {
    if (data[i].id === id) {
      data.splice(i, 1);
    }
  }

  fs.writeFile("./db/db.json", JSON.stringify(data, null, 4), (err) => {
    err ? console.error(err) : console.log("\nData deleted");
  });

  const response = {
    status: "completed!",
    body: id,
  };

  res.json(response);
});

module.exports = app;
