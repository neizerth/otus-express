// npm i pug
import express from "express";
import basisAuth from "express-basic-auth";

const PORT = 3008;
const app = express();

const authMiddleware = basisAuth({
	users: { admin: "supersecret" },
});

// app.use(authMiddleware);

// http://localhost:3000/
app.get("/admin", authMiddleware, (_req, res) => {
	res.send({
		time: new Date(),
	});
});

app.listen(PORT, () => console.log(`Hello from ${PORT}`));
