import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

export async function userHeadersMw(
  req: Request,
  res: Response,
  next
): Promise<void> {
  req.reqIpAddress = (req.headers["x-internal-user-ip"] ||
    req.headers["x-connecting-ip"] ||
    req.headers["x-true-client-ip"] ||
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    "") as string;
  req.reqIpCountry = (req.headers["x-internal-country"] ||
    req.headers["x-ip-country"] ||
    req.headers["cf-ipcountry"] ||
    "br") as string;
  req.currency = (req.headers["x-currency"] || "brl") as string;
  req.language = (req.headers["x-language"] || "pt") as string;
  req.reqUserAgent = (req.headers["user-agent"] || "unknown") as string;
  req.requestId = (req.headers["x-request-id"] || uuidv4()) as string;
  next();
}
