import { Request, Response } from "express";
import httpContext from "express-http-context";

export async function httpContextMw(
  req: Request,
  res: Response,
  next
): Promise<void> {
  httpContext.set("reqUserJwtToken", req.jwtToken);
  httpContext.set("reqUserIp", req.reqIpAddress);
  httpContext.set("reqUserCountry", req.reqIpCountry);
  httpContext.set("reqUserUserAgent", req.reqUserAgent);
  httpContext.set("reqUserLanguage", req.language);
  httpContext.set("reqUserCurrency", req.currency);
  httpContext.set("reqRequestId", req.requestId);
  httpContext.set("reqUserId", req.userId);
  next();
}
