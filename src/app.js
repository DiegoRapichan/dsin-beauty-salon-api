import express from "express";
import routes from "./routes/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js"; // IMPORTAÇÃO AQUI

const app = express();

app.use(express.json());
app.use(routes);
app.use(errorMiddleware);

export default app;
