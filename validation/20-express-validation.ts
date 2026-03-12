/**
 * Валидация через express-validation (правила на Joi).
 * Поддерживает: body, params, query, headers, cookies.
 */
import express from "express";
import { validate, ValidationError, Joi } from "express-validation";

const PORT = 3020;
const app = express();

app.use(express.json());

const createUserValidation = {
	body: Joi.object({
		name: Joi.string().min(1).max(100).required(),
		email: Joi.string().email().required(),
		age: Joi.number().integer().min(0).optional(),
	}),
};

app.post(
	"/user",
	validate(createUserValidation, {}, { abortEarly: false }) as unknown as express.RequestHandler,
	(req, res) => {
		res.status(201).json({ ok: true, user: req.body });
	},
);

app.use((err: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
	if (err instanceof ValidationError) {
		res.status(err.statusCode).json(err);
		return;
	}
	next(err);
});

app.listen(PORT, () =>
	console.log(`express-validation: http://localhost:${PORT}/user (POST JSON: name, email, age?)`),
);
