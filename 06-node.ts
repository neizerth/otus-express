// npm i -D ts-node
// nodemon 06-node.ts
import express from "express";

const PORT = 3000;
const app = express();

// http://localhost:3000/
app.get("/", (req, res) => {
  res.send("Home route content");
});

app.listen(PORT, () => console.log(`Hello from ${PORT}`));
