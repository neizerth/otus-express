// npm i pug
import express from "express";
import basisAuth from "express-basic-auth";

const PORT = 3008;
const app = express();

app.use(
  basisAuth({
    users: { admin: "supersecret" },
  })
);

// http://localhost:3000/
app.get(
  "/admin",
  basisAuth({
    users: { admin: "supersecret" },
  }),
  (req, res) => {
    res.send({
      time: new Date(),
    });
  }
);

app.listen(PORT, () => console.log(`Hello from ${PORT}`));
