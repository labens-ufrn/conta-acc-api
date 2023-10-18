import { RequestHandler } from "express";

export function catchAsyncErrors(fn: RequestHandler): RequestHandler {
  return (req, res, next): void => {
    const routePromise: any = fn(req, res, next);

    if (routePromise.catch) {
      routePromise.catch((err: Error): void => next(err));
    }
  };
}
