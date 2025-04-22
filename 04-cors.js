// npm i cors
const express = require("express");
const cors = require("cors");

const PORT = 3000;
const app = express();

const data = [];

// Без этого backend не будет распознавать JSON в теле запроса
app.use(express.json());

// Подключаем cors
app.use(cors());

app.get("/", (req, res) => {
  console.log(req.query);
  console.log(req.params);

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
