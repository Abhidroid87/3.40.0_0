import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import tasksRoutes from "./routes/tasks";
import aiRoutes from "./routes/ai";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/tasks", tasksRoutes);
app.use("/ai", aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
