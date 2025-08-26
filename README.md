GODZILLA Memecoin Website (Static)

Deploy to Vercel

1. Push this project to a Git repo (GitHub/GitLab).
2. On Vercel, import the repo.
3. Framework preset: Other.
4. Root directory: repository root (leave as is).
5. Build Command: none.
6. Output Directory: (leave empty).

This repo includes `vercel.json` configured to:
- Serve `web/index.html` at `/`
- Serve `web/generator/index.html` at `/generator`
- Expose static assets under `/web/**`

Local structure:
- `web/` contains all site files
- `web/public/` contains images/assets

If you deploy under a different root, update `vercel.json` paths accordingly.

