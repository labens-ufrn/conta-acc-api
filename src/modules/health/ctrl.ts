import { Request, Response } from "express";

export async function getHealthz(req: Request, res: Response): Promise<any> {
  return res.json({ success: true });
}
