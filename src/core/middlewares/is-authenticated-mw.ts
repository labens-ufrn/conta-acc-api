import { NextFunction, Request, Response } from "express";

export function isAuthenticatedMw(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).send({
      message: "Unauthorized",
    });
  }
  next();
}
