/**
 * Слайд 12: Массив в query — повторение параметра и вариант с []
 * 1) Один ключ повторяется: ?values=1&values=2&values=3
 * 2) Квадратные скобки: ?values[]=1&values[]=2&values[]=3
 */
import express from "express";

const PORT = 3012;
const app = express();

// express по умолчанию даёт массив при повторении ключа или values[]
app.get("/api/resource", (req, res) => {
	const { values } = req.query;
	// values может быть string | string[] в зависимости от формата запроса
	const valuesArray = Array.isArray(values) ? values : values ? [values] : [];
	res.json({
		valuesRaw: values,
		valuesArray,
	});
});

app.listen(PORT, () =>
	console.log(
		`Array repeat: http://localhost:${PORT}/api/resource?values=1&values=2&values=3`,
	),
);
