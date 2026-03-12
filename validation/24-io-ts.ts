/**
 * Валидация через io-ts — runtime-типы и decode (удобно для TypeScript).
 */
import express from "express";
import * as t from "io-ts";
import { pipe } from "fp-ts/function";
import { fold } from "fp-ts/Either";
import { PathReporter } from "io-ts/PathReporter";

const PORT = 3024;
const app = express();

app.use(express.json());

const UserBody = t.intersection([
	t.type({
		name: t.string,
		email: t.string,
	}),
	t.partial({ age: t.number }),
]);

type UserBody = t.TypeOf<typeof UserBody>;

function ioTsBody<A>(codec: t.Type<A>): express.RequestHandler {
	return (req, res, next) => {
		const result = codec.decode(req.body);
		pipe(
			result,
			fold(
				(_errors) => {
					res.status(400).json({
						error: "Validation failed",
						details: PathReporter.report(result),
					});
				},
				(decoded) => {
					req.body = decoded;
					next();
				},
			),
		);
	};
}

app.post("/user", ioTsBody(UserBody), (req, res) => {
	const body = req.body as UserBody;
	res.status(201).json({ ok: true, user: body });
});

app.listen(PORT, () =>
	console.log(`io-ts: http://localhost:${PORT}/user (POST JSON: name, email, age?)`),
);
