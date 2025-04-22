// npm i multer
import express from "express";
import multer from "multer";
import cors from "cors";

const upload = multer({ dest: "uploads/" });

const PORT = 3000;
const app = express();

app.use(cors());

// http://localhost:3000/
app.post("/upload", upload.single("avatar"), (req, res) => {
  res.send({
    time: new Date(),
    file: req.file,
  });
});

app.listen(PORT, () => console.log(`Hello from ${PORT}`));
