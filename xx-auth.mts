// npm install @auth/express
// node --loader ts-node/esm xx-express-auth.mts
import { ExpressAuth } from "@auth/express";
import GitHub from "@auth/express/providers/github";
import express from "express";

const PORT = 3000;
const app = express();

app.set("view engine", "pug");

// http://localhost:3000/
app.get("/", (req, res) => {
  res.render("07-index", {
    pageTitle: "Pug works for us",
    pageContent: "Шаблонизатор, которого мы заслужили",
  });
});

app.use("/auth", ExpressAuth({ providers: [GitHub] }));

app.listen(PORT, () => console.log(`Hello from ${PORT}`));
