/**
 * Слайд 13: Path Parameters (шаблоны пути)
 * Параметры встроены в сам путь URL.
 * Route: /users/:userId/books/:bookId
 * Request: http://localhost:3000/users/34/books/8989
 * req.params: { "userId": "34", "bookId": "8989" }
 */
import express from "express";

const PORT = 3013;
const app = express();

app.get("/users/:userId/books/:bookId", (req, res) => {
	res.json({
		params: req.params,
		userId: req.params.userId,
		bookId: req.params.bookId,
	});
});

app.listen(PORT, () =>
	console.log(
		`Path params: http://localhost:${PORT}/users/34/books/8989`,
	),
);
