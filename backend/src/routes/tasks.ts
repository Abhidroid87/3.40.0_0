import { Router } from "express";
import { verifyFirebaseToken } from "../middlewares/authMiddleware";
import { db } from "../firebaseAdmin";

const router = Router();


import { Request, Response } from "express";
router.post("/", verifyFirebaseToken, async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { title, description } = req.body;

  try {
    const ref = await db.collection("tasks").add({
      title,
      description,
      userId: user.uid,
      createdAt: new Date(),
    });

    res.json({ id: ref.id, title, description });
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" });
  }
});

export default router;
