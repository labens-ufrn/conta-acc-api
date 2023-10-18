import { appConfig } from "@src/config";
import { Server } from "http";

export function onError(
  error: NodeJS.ErrnoException,
  port: number | string | boolean
): void {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind: string =
    typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);

      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);

      break;
    default:
      throw error;
  }
}

export function onUnhandledRejection(
  reason: Error | any,
  promise: Promise<any>
): void {
  console.error(`Unhandled Rejection at:${promise} reason: ${reason}`);
}

export function onUncaughtException(err: Error, origin: string): void {
  console.error(`Unhandled Exception at: ${err} origin: ${origin}`);
}

export async function onListening(
  serverInstance: Server,
  port: number
): Promise<void> {
  console.info(`Running HTTP Server at http://localhost:${port}`);
}

export function configureHttpServer(httpServer: Server) {
  httpServer.on("error", (error: Error): void =>
    onError(error, appConfig.port)
  );
  httpServer.on("listening", () => onListening(httpServer, appConfig.port));
  process.on("uncaughtException", onUncaughtException.bind(httpServer));
  process.on("unhandledRejection", onUnhandledRejection.bind(httpServer));

  const closeServers = async () => {
    console.info("[K8S] Closing HTTP Server");
    httpServer.close(async (err) => {
      if (err) {
        console.error("[] Error closing HTTP Server", err);
      }
      console.info("[] HTTP Server closed");
      console.info("[] Closing MongoDB");
      // await disconnectMongoDB(); // TODO: Uncomment this line
      console.info("[] Closing Redis");
      // await disconnectRedis(); // TODO: Uncomment this line
    });

    httpServer.addListener("close", () => {
      console.info("[] HTTP Server closed");
    });

    process.on("SIGTERM", closeServers);
  };
}
