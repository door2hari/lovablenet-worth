# Personal Finance Tracker – Complete Usage Guide

## 1. 🚀 Cloning & Setup

```bash
git clone https://github.com/<your-username>/lovablenet-worth.git
cd lovablenet-worth
npm install
```

---

## 2. 🗄️ Supabase Database Setup

1. **Create a project** at [supabase.com](https://supabase.com).
2. **Get your Supabase URL and anon key**.
3. **Update** `src/integrations/supabase/client.ts` with your credentials.
4. **Set up the database schema:**
   - Go to Supabase SQL Editor.
   - Run the SQL in `supabase/init.sql` or use the SQL block below.

---

## 3. 🔐 Authentication Setup

- Enable Email Auth in Supabase.
- Add your local and production URLs to Supabase Auth redirect URLs:
  - `http://localhost:8080`
  - `https://<your-username>.github.io/lovablenet-worth`

---

## 4. 🧑‍💻 Local Development

```bash
npm run dev
```
- Visit [http://localhost:8080](http://localhost:8080)
- For mobile testing, use your local IP (e.g., `http://192.168.1.100:8080`).

---

## 5. 🌐 Deployment to GitHub Pages

1. **Set homepage in `package.json`:**
   ```json
   "homepage": "https://<your-username>.github.io/lovablenet-worth"
   ```
2. **Build and deploy:**
   ```bash
   npm run deploy
   ```
3. **Enable GitHub Pages** in repo settings (branch: `gh-pages`).

---

## 6. 📱 PWA & Mobile Installation

- Open your deployed site on mobile.
- On Android: Chrome menu → "Add to Home screen".
- On iOS: Safari share → "Add to Home Screen".

---

## 7. 🛠️ Useful Scripts

- `npm run dev` – Start dev server
- `npm run build` – Build for production
- `npm run preview` – Preview production build
- `npm run deploy` – Deploy to GitHub Pages
- `npm run lint` – Lint code

---

## 8. 🏗️ Customization

- **Add asset/debt types:** Update enums in Supabase and types in `src/types/`.
- **Theming:** Edit `tailwind.config.ts` and `src/index.css`.

---

## 9. 🚨 Troubleshooting

- **Auth issues:** Check Supabase redirect URLs.
- **Build issues:** Check dependencies and TypeScript errors.
- **Mobile issues:** Ensure PWA manifest and service worker are valid.

---

## 10. 🤝 Contributing

- Fork, branch, code, PR!

---

## 11. 🗄️ Example Supabase SQL (for quick setup)

See `supabase/init.sql` or use the SQL in the original README for full schema and RLS policies.

---

## 12. 📄 License

MIT

---

**You’re all set for future development, database setup, and deployment!**