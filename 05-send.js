const express = require("express");
const cors = require("cors");
const path = require("path");

const PORT = 3000;
const app = express();

const STATIC = path.join(__dirname, "./static");

const data = [
  {
    email: "ivan@doma.com",
  },
];

// Без этого backend не будет распознавать JSON в теле запроса
app.use(express.json());

// Подключаем cors
app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(path.join(STATIC, "./index.html"));
});

app.get("/subscribers", (req, res) => {
  res.send(data);
});

app.listen(PORT, () => console.log(`Hello from ${PORT}`));
