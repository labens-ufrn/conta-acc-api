import { Express, json } from "express";
import cors from "cors";
import httpContext from "express-http-context";

export function configureCommonMw(app: Express) {
  app.disable("x-powered-by");
  app.use(json({ limit: process.env.JSON_MAX_SIZE ?? "20mb" }));
  app.use(httpContext.middleware);

  if (process.env.DISABLE_CORS !== "true") {
    app.use(cors({ origin: true, credentials: true, maxAge: 10000000 }));
  }
}
