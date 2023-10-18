import express from "express";
import "express-async-errors";
import { configureCommonMw } from "./core/middlewares/configure-common-mw";
import { setRoutes } from "./routes";

const app = express();
configureCommonMw(app);

Promise.all([])
  .then(() => {
    setRoutes(app);
  })
  .catch((err) => {
    console.error(`Error starting services before routes server: ${err}`);
  });

export { app as expressApp };
