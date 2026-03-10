// npm i jsonwebtoken
// npm i -D @types/jsonwebtoken
import express from "express";
import jwt from "jsonwebtoken";

const PORT = 3010;
const SECRET = "your-secret-key";
const app = express();

app.use(express.json());

// http://localhost:3010/login
app.post("/login", (req, res) => {
	const { username, password } = req.body ?? {};
	if (username === "admin" && password === "supersecret") {
		const token = jwt.sign(
			{ username, iat: Math.floor(Date.now() / 1000) },
			SECRET,
			{ expiresIn: "1h" },
		);
		res.json({ token });
	} else {
		res.status(401).json({ error: "Invalid credentials" });
	}
});

function authMiddleware(
	req: express.Request,
	res: express.Response,
	next: express.NextFunction,
) {
	const auth = req.headers.authorization;
	const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
	if (!token) {
		res.status(401).json({ error: "No token" });
		return;
	}
	try {
		const payload = jwt.verify(token, SECRET) as { username: string };
		(req as express.Request & { jwtUser: string }).jwtUser = payload.username;
		next();
	} catch {
		res.status(401).json({ error: "Invalid token" });
		return;
	}
}

// http://localhost:3010/protected
app.get("/protected", authMiddleware, (req, res) => {
	const user = (req as express.Request & { jwtUser?: string }).jwtUser;
	res.send({
		time: new Date(),
		user,
	});
});

app.listen(PORT, () => console.log(`Hello from ${PORT}`));
