/**
 * Слайд 10: Query Parameters
 * Параметры, передаваемые в URL после знака вопроса (?).
 * Пример: https://example.com/api/resource?param1=value1&param2=value2
 */
import express from "express";

const PORT = 3010;
const app = express();

// GET /api/resource?param1=value1&param2=value2
app.get("/api/resource", (req, res) => {
	// req.query — объект с query-параметрами
	const { param1, param2 } = req.query;
	res.json({
		param1,
		param2,
		allQuery: req.query,
	});
});

app.listen(PORT, () =>
	console.log(`Query params example: http://localhost:${PORT}/api/resource?param1=value1&param2=value2`),
);
