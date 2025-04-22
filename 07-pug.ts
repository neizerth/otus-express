// npm i pug
import express from "express";

const PORT = 3000;
const app = express();

app.set("view engine", "pug");

// http://localhost:3000/
app.get("/", (req, res) => {
  res.render("07-index", {
    pageTitle: "Pug works for us",
    pageContent: "Шаблонизаторы, совместимые с Express",
  });
});

app.listen(PORT, () => console.log(`Hello from ${PORT}`));
