import mongoose from "mongoose";

export async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("📦 Database conectado!");
  } catch (err) {
    console.error("Erro ao conectar banco:", err);
  }
}
