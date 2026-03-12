/**
 * Валидация через AJV (JSON Schema).
 * Быстрый валидатор по схеме JSON Schema.
 */
import express from "express";
import Ajv, { type JSONSchemaType, type ValidateFunction } from "ajv";
import addFormats from "ajv-formats";

const PORT = 3022;
const app = express();

app.use(express.json());

interface UserBody {
	name: string;
	email: string;
	age?: number;
}

const userSchema: JSONSchemaType<UserBody> = {
	type: "object",
	properties: {
		name: { type: "string", minLength: 1, maxLength: 100 },
		email: { type: "string", format: "email" },
		age: { type: "number", minimum: 0, nullable: true },
	},
	required: ["name", "email"],
	additionalProperties: false,
};

const ajv = new Ajv();
addFormats(ajv);
const validateUser = ajv.compile(userSchema);

function ajvBodyMiddleware<T>(validateFn: ValidateFunction<T>): express.RequestHandler {
	return (req, res, next) => {
		if (!validateFn(req.body)) {
			res.status(400).json({
				error: "Validation failed",
				details: validateFn.errors,
			});
			return;
		}
		next();
	};
}

app.post("/user", ajvBodyMiddleware(validateUser), (req, res) => {
	const body = req.body as UserBody;
	res.status(201).json({ ok: true, user: body });
});

app.listen(PORT, () =>
	console.log(`ajv: http://localhost:${PORT}/user (POST JSON: name, email, age?)`),
);
