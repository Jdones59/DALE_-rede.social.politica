import { config } from "dotenv";
config();
import mongoose from "mongoose";
import app from "./app";

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("📦 MongoDB conectado com sucesso!");

    const port = process.env.PORT || 3333;
    app.listen(port, () => {
      console.log(`🚀 Servidor rodando na porta ${port}`);
    });
  } catch (err) {
    console.error("Erro na inicialização:", err);
    process.exit(1);
  }
}

startServer();
