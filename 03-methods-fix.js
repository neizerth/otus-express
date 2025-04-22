// npm i -D nodemon
// npx nodemon 03-methods-fix.js
const express = require("express");

const PORT = 3000;
const app = express();

const data = [];

// Без этого backend не будет распознавать JSON в теле запроса
app.use(express.json());

app.get("/", (req, res) => {
  res.send(data);
});

app.post("/", (req, res) => {
  console.log(req.body, typeof req.body);

  try {
    if (req.body) {
      data.push(req.body);
    }
  } catch (e) {
    console.error(e);
  }
  res.send(data);
});

app.listen(PORT, () => console.log(`Hello from ${PORT}`));
