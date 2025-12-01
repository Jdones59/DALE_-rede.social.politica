import app from "./app";

// Server entrypoint should import the central `app` (defined in src/app.ts)
// Keep the API server on PORT 4000 by default (frontend runs on 3000).
// docker-compose sets PORT=3001 for the backend in this repo, so choose 3001 as default.
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
