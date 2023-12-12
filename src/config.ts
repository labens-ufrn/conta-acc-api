const nodeEnv = process.env.NODE_ENV || "development";
const isDevelopment: boolean =
  !process.env.NODE_ENV || nodeEnv === "development";
const isProduction: boolean = nodeEnv === "production";
const isTesting: boolean = nodeEnv === "test";

export const appName: string = process.env.APP_NAME ?? "conta-acc-api";

const development = {
  isTesting,
  isDevelopment,
  isProduction,
  jwtExpInDays: process.env.JWT_EXP_IN_DAYS ?? "365",
  jwtSecret: process.env.JWT_SECRET || "JWT_SECRET",
  routePathPrefix: process.env.ROUTE_PATH_PREFIX ?? "/",
  port: 3061,
  database: {
    uri:
      process.env.DATABASE_URL ??
      "postgresql://johndoe:randompassword@localhost:5432/contaacc_development?schema=public",
  },
  secret: process.env.SECRET ?? "@QEGTUI",
  encryptionKey:
    process.env.ENCRYPTION_KEY ?? "ZWH5RwuA0YhMyKWwXPJPZgKHHEDRtGXP",
  redis: {
    uri: process.env.REDIS_URI ?? "redis://0.0.0.0:6379",
    prefix: process.env.REDIS_PREFIX ?? "conta-acc-rest_",
    timeout: parseInt(process.env.REDIS_TIMEOUT ?? "10000"), // 10 seconds
    maxRetires: parseInt(process.env.REDIS_MAX_RETRIES ?? "10"),
  },
  httpTimeout: parseInt(process.env.HTTP_CLIENT_TIMEOUT ?? "10000"),
  storage: {
    default: process.env.DEFAULT_STORAGE || "fs",
    tempPath: process.env.TEMP_STORAGE_PATH || "/tmp",
  },
};

const production = {
  isTesting,
  isDevelopment,
  isProduction,
  jwtExpInDays: process.env.JWT_EXP_IN_DAYS ?? "365",
  jwtSecret: process.env.JWT_SECRET || "JWT_SECRET",
  routePathPrefix: process.env.ROUTE_PATH_PREFIX ?? "/",
  port: 3061,
  database: {
    uri:
      process.env.DATABASE_URL ??
      "postgresql://johndoe:randompassword@localhost:5432/contaacc_backend?schema=public",
  },
  secret: process.env.SECRET ?? "@QEGTUI",
  encryptionKey:
    process.env.ENCRYPTION_KEY ?? "ZWH5RwuA0YhMyKWwXPJPZgKHHEDRtGXP",
  redis: {
    uri: process.env.REDIS_URI ?? "redis://0.0.0.0:6379",
    prefix: process.env.REDIS_PREFIX ?? "contaacc-rest_",
    timeout: parseInt(process.env.REDIS_TIMEOUT ?? "10000"), // 10 seconds
    maxRetires: parseInt(process.env.REDIS_MAX_RETRIES ?? "10"),
  },
  httpTimeout: parseInt(process.env.HTTP_CLIENT_TIMEOUT ?? "10000"),
  storage: {
    default: process.env.DEFAULT_STORAGE || "fs",
    tempPath: process.env.TEMP_STORAGE_PATH || "/tmp",
  },
};

const configMap = {
  production,
  development,
};

export const appConfig: typeof production = configMap[nodeEnv];

console.log(process.env.PORT);
appConfig.port =
  typeof process.env.PORT === "undefined"
    ? appConfig.port
    : parseInt(process.env.PORT);
