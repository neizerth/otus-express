/**
 * Валидация через Yup — схема и validate() в middleware.
 */
import express from "express";
import * as yup from "yup";

const PORT = 3023;
const app = express();

app.use(express.json());

const userSchema = yup.object({
	name: yup.string().required().min(1).max(100),
	email: yup.string().email().required(),
	age: yup.number().integer().min(0).optional(),
});

type UserBody = yup.InferType<typeof userSchema>;

function yupBody<T>(schema: yup.Schema<T>): express.RequestHandler {
	return async (req, res, next) => {
		try {
			req.body = await schema.validate(req.body, { abortEarly: false });
			next();
		} catch (err) {
			if (err instanceof yup.ValidationError) {
				res.status(400).json({
					error: "Validation failed",
					details: err.errors,
					inner: err.inner?.map((e) => ({ path: e.path, message: e.message })),
				});
				return;
			}
			next(err);
		}
	};
}

app.post("/user", yupBody(userSchema), (req, res) => {
	const body = req.body as UserBody;
	res.status(201).json({ ok: true, user: body });
});

app.listen(PORT, () =>
	console.log(`yup: http://localhost:${PORT}/user (POST JSON: name, email, age?)`),
);
