/**
 * Слайд 14: Request Body (тело запроса)
 * - application/x-www-form-urlencoded: пары ключ=значение, разделённые &
 * - multipart/form-data: для файлов и форм с файлами
 */
import express from "express";
import path from "path";
import multer from "multer";

const PORT = 3014;
const app = express();

// Парсинг application/x-www-form-urlencoded (как в HTML-формах)
app.use(express.urlencoded({ extended: true }));
// Парсинг application/json
app.use(express.json());

// POST /profile — форма urlencoded (тело: name=John&email=john@example.com)
app.post("/profile", (req, res) => {
	res.json({
		body: req.body,
		contentType: req.headers["content-type"],
	});
});

// Multer для multipart/form-data (загрузка файлов)
const upload = multer({ dest: path.join(__dirname, "uploads") });

app.post("/upload", upload.single("avatar"), (req, res) => {
	// req.file — загруженный файл, req.body — текстовые поля формы
	res.json({
		body: req.body,
		file: req.file
			? {
					fieldname: req.file.fieldname,
					originalname: req.file.originalname,
					filename: req.file.filename,
					size: req.file.size,
				}
			: null,
	});
});

app.listen(PORT, () =>
	console.log(
		`Request body: http://localhost:${PORT}\n  POST /profile (urlencoded)\n  POST /upload (multipart, field: avatar)`,
	),
);
