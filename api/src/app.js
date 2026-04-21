import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./docs/swagger.js";
import routes from "./routes/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) =>
  res.json({ status: "Online", message: "Cabeleleila Leila API" }),
);

app.use(routes);
app.use(errorMiddleware);

export default app;
