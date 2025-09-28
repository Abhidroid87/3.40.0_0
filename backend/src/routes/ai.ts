import { Router } from "express";
import { verifyFirebaseToken } from "../middlewares/authMiddleware";

import fetch from "node-fetch";
import { Request, Response } from "express";
const router = Router();

router.post("/gemini", verifyFirebaseToken, async (req: Request, res: Response) => {
  const { prompt } = req.body;

  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to call Gemini API" });
  }
});

export default router;
