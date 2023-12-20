import { appConfig } from "@src/config";
import { Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

type GenerateJwtProps = {
  id: string;
  courseId: string;
  studentId: string;
  createdAt: string | Date;
  metadata?: Record<string | number, string | number>;
  expire?: string;
  secret?: string;
  deviceId?: string;
  fingerPrint?: string;
  rememberMe?: boolean;
  reqUserAgent: string;
  reqIpAddress: string;
  reqIpCountry: string;
};

export interface DecodedJwt extends JwtPayload {
  id: string;
  createdAt: string;
  dataTime: string;
  deviceId?: string;
  fingerPrint?: string;
  reqUserAgent?: string;
  reqIpAddress?: string;
  reqIpCountry?: string;
}

export function generateJwt(props: GenerateJwtProps) {
  let {
    id,
    courseId,
    studentId,
    createdAt,
    metadata,
    expire,
    secret,
    reqUserAgent,
    reqIpCountry,
    reqIpAddress,
    fingerPrint,
    deviceId,
    rememberMe = true,
  } = props;

  const expireDays = expire || appConfig.jwtExpInDays || "356";
  secret = secret || appConfig.jwtSecret;
  // ip = ip || getIP(req);
  const expireSeconds = Number(expireDays) * 24 * 60 * 60; // days to seconds

  const ts = Date.now() + Number(expireSeconds);

  let token: string;
  try {
    // send login token
    token = jwt.sign(
      {
        id: String(id),
        courseId: String(courseId),
        studentId: String(studentId),
        createdAt:
          createdAt instanceof Date ? createdAt.toISOString() : createdAt,
        dataTime: Date.now(),
        deviceId,
        fingerPrint,
        reqIpCountry,
        reqIpAddress,
        reqUserAgent,
      },
      secret,
      { expiresIn: `${expireDays}d` }
    );
  } catch (e) {
    console.error(e);
  }

  return { token, ts };
}

export function verifyJwt({
  token,
  secret,
  deviceId,
  fingerPrint,
  reqIpCountry,
  reqIpAddress,
  reqUserAgent,
  ignoreExpiration = false,
}: {
  token: string;
  secret?: string;
  deviceId?: string;
  fingerPrint?: string;
  reqIpCountry?: string;
  reqIpAddress?: string;
  reqUserAgent?: string;
  ignoreExpiration?: boolean;
}): Request["userJwtDecoded"] {
  try {
    const tokenDecoded = jwt.verify(token, secret || appConfig.jwtSecret, {
      ignoreExpiration,
      clockTolerance: 120,
    });
    return tokenDecoded as Request["userJwtDecoded"];
  } catch (e) {
    console.error(`[verifyJwt] error decoding token ${token} ${e}`);
    throw e;
  }
}
