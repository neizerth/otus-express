// npm i multer
import express from "express";
import multer from "multer";
import cors from "cors";
import * as path from "node:path";

const storage = multer.diskStorage({
	destination(_req, _file, cb) {
		cb(null, "./uploads/");
	},
	filename(_req, file, cb) {
		cb(
			null,
			`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
		);
	},
});

const upload = multer({ storage });

const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.post("/upload", upload.single("avatar"), (req, res) => {
	res.send({
		time: new Date(),
		file: req.file,
	});
});

app.listen(PORT, () => console.log(`Hello from ${PORT}`));
