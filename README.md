# Painel LED — Pacotes de Trabalho

Dashboard web para importar a planilha de pacotes de trabalho (Jira/exportação
similar) e visualizar:

- % de necessidades atendidas e % de requisitos atendidos, com filtro por
  projeto e por período (data de início)
- Nome dos membros, tarefas por status, quantidade de tarefas e horas
  trabalhadas por pessoa

Tudo roda no navegador — o arquivo importado nunca sai do seu computador
(não há backend nem upload para servidor).

## Rodando localmente

```bash
npm install
npm run dev
```

Abra o endereço que aparecer no terminal (normalmente http://localhost:5173).

## Deploy na Vercel

**Opção 1 — pelo site:**
1. Suba esta pasta para um repositório no GitHub (crie um repo vazio e faça
   `git init`, `git add .`, `git commit -m "dashboard"`, `git push`).
2. Em https://vercel.com/new, importe o repositório.
3. A Vercel detecta automaticamente que é um projeto Vite — não precisa mudar
   nenhuma configuração. Clique em **Deploy**.

**Opção 2 — pela CLI, sem precisar de GitHub:**
```bash
npm install -g vercel
vercel
```
Siga as perguntas no terminal (login na Vercel, nome do projeto) e ele já
publica.

## Planilha esperada

Colunas reconhecidas (aceita o export original, sem precisar renomear nada):

`ID, Tipo, Assunto, Status, Atribuição, Prioridade, Data de início, Sprint,
Tempo gasto, Data de conclusão, Projeto`

- "Atendido" para Necessidade/Requisito = status **Confirmada**. Para mudar
  esse critério, edite `ATENDIDO_STATUS` em `src/lib/metrics.ts`.
- Formatos de data aceitos: `DD/MM/AAAA`, `AAAA-MM-DD`, ou data nativa do
  Excel.
