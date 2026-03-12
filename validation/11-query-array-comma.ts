/**
 * Слайд 11: Массив в query — один ключ, значения через запятую
 * Пример: https://example.com/api/resource?values=1,2,3
 * Подходит для данных без спецсимволов (пробелов, запятых и т.д.), например для чисел.
 */
import express from "express";

const PORT = 3011;
const app = express();

app.get("/api/resource", (req, res) => {
	const { values } = req.query;
	// values приходит строкой "1,2,3" — разбиваем в массив
	const valuesArray =
		typeof values === "string" ? values.split(",").map((v) => v.trim()) : [];
	res.json({
		valuesRaw: values,
		valuesArray,
	});
});

app.listen(PORT, () =>
	console.log(
		`Array comma example: http://localhost:${PORT}/api/resource?values=1,2,3`,
	),
);
