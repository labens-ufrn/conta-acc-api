import { NextFunction, Request, Response } from "express";

export const isAuthenticatedRoleMw =
  (roles: string | string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).send({
        message: "Unauthorized",
      });
    }
    if (typeof roles === "string") {
      roles = [roles];
    }

    const hasRole = roles
      .map((role) => role.toLowerCase())
      .includes(req.user.role.toLowerCase());

    if (!hasRole) {
      return res.status(403).send({
        message: "Forbidden",
      });
    }

    next();
  };
