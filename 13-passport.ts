// npm i passport passport-local express-session
// npm i -D @types/passport @types/passport-local @types/express-session
import express from "express";

declare global {
	namespace Express {
		interface User {
			id: number;
			username: string;
		}
	}
}
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

const PORT = 3013;
const app = express();

app.use(express.json());
app.use(
	session({
		secret: "secret",
		resave: false,
		saveUninitialized: false,
	}),
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
	new LocalStrategy((username, password, done) => {
		if (username === "admin" && password === "supersecret") {
			done(null, { id: 1, username: "admin" });
		} else {
			done(null, false);
		}
	}),
);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user: Express.User, done) => done(null, user));

app.post("/login", (req, res, next) => {
	passport.authenticate("local", (err: unknown, user?: Express.User | false) => {
		if (err) return next(err);
		if (!user) return res.status(401).json({ error: "Invalid credentials" });
		req.logIn(user, (e) => (e ? next(e) : res.json({ ok: true })));
	})(req, res, next);
});

app.get("/", (req, res) => {
	if (!req.isAuthenticated()) {
		res.status(401).json({ error: "Not authenticated" });
		return;
	}
	res.json({ user: req.user });
});

app.post("/logout", (req, res) => {
	req.logout((err) => (err ? res.sendStatus(500) : res.json({ ok: true })));
});

app.listen(PORT, () => console.log(`Passport: http://localhost:${PORT}`));
