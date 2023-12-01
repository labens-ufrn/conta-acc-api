import { Express } from "express";
import p, { Controller } from "pomme-ts";
import { generateRoutesOutputPlugin } from "pomme-ts/dist/plugins/generateRoutesOutput";

import { userHeadersMw } from "./core/middlewares/user-headers-mw";
import { decodeJwtCoreMw } from "./core/middlewares/decode-jwt";
import { httpContextMw } from "./core/middlewares/http-context-mw";
import { healthRoutes } from "./modules/health/routes";
import { userController } from "./modules/user/user-controller";
import { managerController } from "./modules/manager/manager-controller";
import { courseController } from "./modules/course/course-controller";
import { resolutionController } from "./modules/resolution/resolution-controller";
import { categoriesController } from "./modules/categories/categories-controller";
import { activitiesController } from "./modules/activities/activities-controller";

const controllers: Controller[] = [
  userController,
  managerController,
  courseController,
  resolutionController,
  categoriesController,
  activitiesController,
];

export async function setRoutes(app: Express) {
  app.use("/", healthRoutes);

  const server = p
    .server()
    .withApp(app)
    .withMiddlewares([userHeadersMw, decodeJwtCoreMw, httpContextMw])
    .withControllers(controllers)
    .withPlugins([
      generateRoutesOutputPlugin({
        homeWithLastChecksum: true,
        limit: 1,
        outputPath: "/.sdk-spec",
      }),
    ])
    .build();

  return server;
}
