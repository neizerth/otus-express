/**
 * Валидация через Joi «вручную» — schema.validate() в middleware (без celebrate/express-validation).
 */
import express from "express";
import Joi from "joi";

const PORT = 3025;
const app = express();

app.use(express.json());

const userSchema = Joi.object({
	name: Joi.string().min(1).max(100).required(),
	email: Joi.string().email().required(),
	age: Joi.number().integer().min(0).optional(),
});

function joiBody(schema: Joi.ObjectSchema): express.RequestHandler {
	return (req, res, next) => {
		const { error, value } = schema.validate(req.body, { abortEarly: false });
		if (error) {
			res.status(400).json({
				error: "Validation failed",
				details: error.details.map((d) => ({ path: d.path, message: d.message })),
			});
			return;
		}
		req.body = value;
		next();
	};
}

app.post("/user", joiBody(userSchema), (req, res) => {
	res.status(201).json({ ok: true, user: req.body });
});

app.listen(PORT, () =>
	console.log(`joi: http://localhost:${PORT}/user (POST JSON: name, email, age?)`),
);
