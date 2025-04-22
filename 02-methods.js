const express = require("express");

const PORT = 3000;
const app = express();

const data = [];

app.get("/", (req, res) => {
  res.send(data);
});

app.post("/", (req, res) => {
  console.log(req.body, typeof req.body);

  if (req.body) {
    data.push(req.body);
  }

  res.send(data);
});

app.listen(PORT, () => console.log(`Hello from ${PORT}`));
