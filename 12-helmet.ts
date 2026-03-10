// npm i helmet
import express from "express";
import helmet from "helmet";

const PORT = 3012;
const app = express();

// Helmet устанавливает безопасные HTTP-заголовки по умолчанию
app.use(helmet());

// Опционально: кастомизация (например, отключить X-Content-Type-Options для старых API)
// app.use(
//   helmet({
//     contentSecurityPolicy: false,
//     crossOriginEmbedderPolicy: false,
//   }),
// );

app.get("/", (_req, res) => {
	res.send("Ответ с защищёнными заголовками — проверь в DevTools → Network");
});

app.listen(PORT, () => console.log(`Helmet example: http://localhost:${PORT}`));
