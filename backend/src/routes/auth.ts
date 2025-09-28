import { Router } from "express";
import { verifyFirebaseToken } from "../middlewares/authMiddleware";

const router = Router();


import { Request, Response } from "express";
router.get("/profile", verifyFirebaseToken, async (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({ uid: user.uid, email: user.email, name: user.name || null });
});

export default router;
