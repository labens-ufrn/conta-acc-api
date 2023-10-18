import { domainModel } from "@src/modules/domain/model-domain";
import { verifyJwt } from "@src/modules/user/helper-jwt";
import { userModel } from "@src/modules/user/model-user";
import { NextFunction, Request, Response } from "express";

export async function decodeJwtCoreMw(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { headers = {}, cookies = {}, query, body } = req;

  let jwtToken =
    query["jwtToken"] ??
    body["jwtToken"] ??
    headers["x-jwt-token"] ??
    headers["authorization"] ??
    cookies["jwtToken"];

  if (!jwtToken) {
    return next();
  }

  if (jwtToken.startsWith("Bearer ")) {
    jwtToken = jwtToken.replace("Bearer ", "");
  }

  req.user = undefined;
  req.domain = undefined;
  req.domainId = undefined;
  req.userId = undefined;

  try {
    const res = verifyJwt({ token: jwtToken });
    req.userJwtDecoded = res;
    req.userId = res.id;
    req.domainId = res.domainId;
  } catch (error) {
    console.error("error decoding jwt token", error);
  }

  if (!req.userId) {
    return next();
  }

  const user =
    (await userModel.findFirst({
      where: {
        id: req.userId,
      },
    })) ?? null;
  const domain =
    (await domainModel.findFirst({
      where: {
        id: req.domainId,
      },
    })) ?? null;

  req.user = user;
  req.domain = domain;
  req.userId = String(user?.id);
  req.jwtToken = jwtToken;
  await setLastSeen({ userId: req.userId });

  if (!req.user) {
    delete req.userId;
    delete req.userJwtDecoded;
  }

  return next();
}

async function setLastSeen({ userId }: { userId?: string }) {
  if (!userId) {
    return;
  }
  try {
    await userModel.update({
      where: {
        id: userId,
      },
      data: {
        lastLogin: new Date(),
      },
    });
  } catch (error) {
    console.error(`Error updating user last seen time ${userId}`, error);
  }
}
