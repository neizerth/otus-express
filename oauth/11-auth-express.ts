/**
 * OAuth через @auth/express (Auth.js) — вход через GitHub.
 *
 * Нужны переменные окружения:
 *   AUTH_SECRET   — openssl rand -hex 32
 *   GITHUB_ID     — Client ID из GitHub OAuth App
 *   GITHUB_SECRET — Client Secret
 *
 * Callback URL в настройках GitHub App:
 *   http://localhost:3111/auth/callback/github
 */
// npm i @auth/express
import { ExpressAuth, getSession } from "@auth/express";
import GitHub from "@auth/express/providers/github";
import express from "express";

const PORT = 3111;
const app = express();

const authConfig = {
	providers: [
		GitHub({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET,
		}),
	],
	secret: process.env.AUTH_SECRET,
};

app.use("/auth/*", ExpressAuth(authConfig));

// http://localhost:3111/
app.get("/", async (req, res) => {
	const session = await getSession(req, authConfig);
	if (session?.user) {
		const name = session.user.name ?? session.user.email ?? "user";
		res.send(
			`<h1>OAuth</h1><p>Привет, <strong>${name}</strong></p><p><a href="/auth/signout">Выйти</a></p>`,
		);
		return;
	}
	res.send(
		`<h1>OAuth</h1><p><a href="/auth/signin/github">Войти через GitHub</a></p>`,
	);
});

app.listen(PORT, () => {
	const missing = ["AUTH_SECRET", "GITHUB_ID", "GITHUB_SECRET"].filter(
		(k) => !process.env[k],
	);
	if (missing.length) {
		console.warn(`Задайте переменные: ${missing.join(", ")}`);
	}
	console.log(
		`auth-express: http://localhost:${PORT}\n  GET / — старт\n  GET /auth/signin/github — вход`,
	);
});
