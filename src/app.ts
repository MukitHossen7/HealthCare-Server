import cors from "cors";
import express, { Request, Response } from "express";

import config from "./config";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import notFound from "./middlewares/notFound";
import routes from "./routes/routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/v1", routes);

app.get("/", (req: Request, res: Response) => {
  res.send({
    success: true,
    message: "Welcome to Health Care Server",
    environment: config.NODE_ENV,
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
