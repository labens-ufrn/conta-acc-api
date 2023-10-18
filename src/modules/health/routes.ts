import { catchAsyncErrors } from "@src/core/utils/router";
import { Router } from "express";
import { getHealthz } from "./ctrl";

const routes: Router = Router();

routes.get("/v1-healthz", catchAsyncErrors(getHealthz));

export { routes as healthRoutes };
