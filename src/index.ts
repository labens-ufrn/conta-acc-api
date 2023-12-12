import "dotenv/config";
import { createServer } from "http";
import { appConfig } from "./config";
import { configureHttpServer } from "./core/server/server-handlers";
import { expressApp } from "./app";

const httpServer = createServer(expressApp);

httpServer.listen(appConfig.port);
configureHttpServer(httpServer);
