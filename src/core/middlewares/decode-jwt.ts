import { courseModel } from "@src/modules/course/model-course";
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
  req.course = undefined;
  req.courseId = undefined;
  req.userId = undefined;

  try {
    const res = verifyJwt({ token: jwtToken });
    req.userJwtDecoded = res;
    req.userId = res.id;
    req.courseId = res.courseId;
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
  const course =
    (await courseModel.findFirst({
      where: {
        id: req.courseId,
      },
    })) ?? null;

  req.user = user;
  req.course = course;
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
