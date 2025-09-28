import { Request, Response, NextFunction } from "express";
import { auth } from "../firebaseAdmin";

export const verifyFirebaseToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) return res.status(401).json({ error: "Unauthorized: No token" });

  try {
    const decoded = await auth.verifyIdToken(token);
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};
