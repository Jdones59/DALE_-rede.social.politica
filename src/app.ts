import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import lawRoutes from "./modules/laws/law.routes";
import debateRoutes from "./modules/debates/debate.routes";
import commentRoutes from "./modules/comments/comment.routes";
import friendshipRoutes from "./modules/friendship/friendship.routes";
import voteRoutes from "./modules/votes/vote.routes";

import authMiddleware from "./utils/authMiddleware";

const app = express();

app.use(cors());
app.use(express.json());

// Rotas públicas
app.use("/auth", authRoutes);

// Rotas privadas
app.use("/users", authMiddleware, userRoutes);
app.use("/laws", authMiddleware, lawRoutes);
app.use("/debates", authMiddleware, debateRoutes);
app.use("/comments", authMiddleware, commentRoutes);
app.use("/friendships", authMiddleware, friendshipRoutes);
app.use("/votes", authMiddleware, voteRoutes);

// Global error handler
app.use(
  (err: Error & { status?: number }, req: Request, res: Response, next: NextFunction) => {
    console.error("🔥 ERRO NO SERVIDOR:", err);

    return res.status(err.status || 500).json({
      status: "error",
      message: err.message || "Erro interno no servidor",
    });
  }
);

app.get("/", (req: Request, res: Response) => {
  res.send("Backend funcionando com PostgreSQL + Prisma + Docker.");
});

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date() });
});

export default app;
