import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default function authMiddleware(
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Token não fornecido." });
    }

    // Esperado: "Bearer TOKENAQUI"
    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
    return res.status(401).json({ error: "Formato do token inválido." });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("❌ ERRO: JWT_SECRET não foi definido no .env!");
      return res.status(500).json({
        error: "Erro interno: JWT_SECRET ausente no backend.",
      });
    }

    const decoded = jwt.verify(token, secret);

    req.user = decoded;

    return next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expirado." });
    }

    return res.status(401).json({ error: "Token inválido." });
  }
}
