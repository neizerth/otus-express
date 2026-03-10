// OAuth 2.0 demo: один сервер — провайдер и клиент, без внешних сервисов
import express from "express";
import { randomBytes } from "crypto";

const PORT = 3011;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const CLIENT_ID = "demo-client";
const CLIENT_SECRET = "demo-secret";
const REDIRECT_URI = `http://localhost:${PORT}/callback`;

const codes = new Map<string, { redirectUri: string }>();
const tokens = new Map<string, string>(); // token -> userId

function exchangeCode(code: string, redirectUri: string): string | null {
	const data = codes.get(code);
	if (!data || data.redirectUri !== redirectUri) return null;
	codes.delete(code);
	const token = randomBytes(24).toString("hex");
	tokens.set(token, "demo-user");
	return token;
}

// Провайдер: выдать code и редирект обратно
app.get("/oauth/authorize", (req, res) => {
	const { client_id, redirect_uri, response_type } = req.query;
	if (response_type !== "code" || client_id !== CLIENT_ID) {
		res.status(400).send("Invalid request");
		return;
	}
	const code = randomBytes(16).toString("hex");
	codes.set(code, { redirectUri: String(redirect_uri) });

	const back = new URL(redirect_uri as string);
	back.searchParams.set("code", code);
	res.redirect(back.toString());
});

// Провайдер: обмен code на token
app.post("/oauth/token", (req, res) => {
	const { grant_type, code, client_id, client_secret, redirect_uri } = req.body ?? {};
	if (
		grant_type !== "authorization_code" ||
		client_id !== CLIENT_ID ||
		client_secret !== CLIENT_SECRET
	) {
		res.status(400).json({ error: "invalid_grant" });
		return;
	}
	const token = exchangeCode(code, redirect_uri);
	if (!token) {
		res.status(400).json({ error: "invalid_grant" });
		return;
	}
	res.json({ access_token: token, token_type: "Bearer" });
});

// Провайдер: данные по токену
app.get("/oauth/user", (req, res) => {
	const token = req.headers.authorization?.replace("Bearer ", "");
	const userId = token ? tokens.get(token) : null;
	if (!userId) {
		res.status(401).json({ error: "Invalid token" });
		return;
	}
	res.json({ id: userId, name: "Demo User" });
});

// Клиент: старт
app.get("/", (_req, res) => {
	const url = new URL("/oauth/authorize", `http://localhost:${PORT}`);
	url.searchParams.set("client_id", CLIENT_ID);
	url.searchParams.set("redirect_uri", REDIRECT_URI);
	url.searchParams.set("response_type", "code");
	res.send(`<h1>OAuth</h1><p><a href="${url}">Войти</a></p>`);
});

// Клиент: callback — обмен code на token без fetch (общая логика)
app.get("/callback", (req, res) => {
	const code = req.query.code as string | undefined;
	if (!code) {
		res.status(400).send("No code");
		return;
	}
	const token = exchangeCode(code, REDIRECT_URI);
	if (!token) {
		res.status(400).send("Invalid code");
		return;
	}

	const user = tokens.get(token);
	res.send(
		`<h1>Готово</h1><p>Вы вошли как <strong>${user ?? "?"}</strong></p><a href="/">Ещё раз</a>`,
	);
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
