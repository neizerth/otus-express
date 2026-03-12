/**
 * Валидация через celebrate — middleware для Joi (body, params, query, headers).
 */
import express from "express";
import { celebrate, Joi, errors, Segments } from "celebrate";

const PORT = 3021;
const app = express();

app.use(express.json());

app.post(
	"/user",
	celebrate({
		[Segments.BODY]: Joi.object({
			name: Joi.string().min(1).max(100).required(),
			email: Joi.string().email().required(),
			age: Joi.number().integer().min(0).optional(),
		}),
	}),
	(req, res) => {
		res.status(201).json({ ok: true, user: req.body });
	},
);

app.get(
	"/search",
	celebrate({
		[Segments.QUERY]: Joi.object({
			q: Joi.string().required(),
			limit: Joi.number().integer().min(1).max(100).default(10),
		}),
	}),
	(req, res) => {
		res.json({ q: req.query.q, limit: req.query.limit });
	},
);

app.use(errors());

app.listen(PORT, () =>
	console.log(
		`celebrate: http://localhost:${PORT}\n  POST /user (body)\n  GET /search?q=...&limit=10`,
	),
);
