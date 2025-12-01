Importar leis do Planalto para o PostgreSQL (Prisma)
==================================================

Este script faz uma coleta inicial de links na página de legislação do Planalto e importa registros mínimos para a tabela `Law` do banco (Prisma).

Aviso importante
- O crawler atual é simples — é recomendado rodar em modo de teste com `--limit` antes de importar tudo. Ajuste a lógica se quiser extrair campos mais precisos.
- Respeite o robots.txt e as políticas do site.

Como testar localmente
----------------------

1) Garanta que o banco esteja configurado e rodando (variável `DATABASE_URL` apontando para o PostgreSQL).
2) Gere o client do Prisma e aplique migrations (se necessário):

```powershell
cd backend
npx prisma generate
npx prisma migrate dev --name add_initial_laws_import
```

3) Rodar o script em modo de desenvolvimento (usa ts-node-dev):

```powershell
npm run import:planalto -- --limit=50
```

Parâmetros úteis
- `--start=<url>` : página inicial para iniciar a coleta (ex: `--start=https://www4.planalto.gov.br/legislacao/leis`).
- `--limit=N` : limite de itens processados (bom para testar antes de rodar o job completo).

Logs e verificação
- O script imprime linhas indicando `Inserted law:` ou `Updated existing law:` para cada URL processada.
- Você pode verificar as leis inseridas usando o Prisma Studio: `npx prisma studio` ou consultando o banco.

API: rota /leis

	- GET /leis?page=1&perPage=50  -> retorna um objeto { data: [...], page, perPage, total }
	- GET /leis/:id -> retorna um único objeto de lei no formato compatível com o frontend

Observação: a API fornece mapeamento para a forma esperada pelo frontend: _id, numero, titulo, descricao, texto, ano, url, createdAt

Testando localmente (exemplo):

```bash
# listar página 1 com 50 por página
curl "http://localhost:3001/leis?page=1&perPage=50" | jq

# obter uma lei específica
curl "http://localhost:3001/leis/123" | jq
```

Próximos passos recomendados
- Melhorar heurística de detecção/extração (número da lei, data de publicação, resumo).
- Adicionar download/extração de texto de PDFs quando necessário.
- Implementar um job agendado com checkpoint/resume para processar grandes volumes.
