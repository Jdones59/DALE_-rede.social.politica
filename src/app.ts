import express from "express";
import cors from "cors";

import lawRoutes from "./modules/laws/law.routes";
import authRoutes from "./modules/auth/auth.routes";
import voteRoutes from "./modules/votes/vote.routes";
import friendshipRoutes from "./modules/friendship/friendship.routes";
import debateRoutes from "./modules/debates/debate.routes";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas principais
app.use("/api/laws", lawRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/friends", friendshipRoutes);
app.use("/api/debates", debateRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("🔥 API rodando com sucesso!");
});

export default app;
