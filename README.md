# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## SEO: Crawling, Indexing and Ranking (what was added)

I added basic SEO assets to help crawlers and improve sharing/ranking:

- `index.html`: improved title, description, keywords, Open Graph and Twitter meta tags, JSON-LD (SoftwareApplication) structured data, preconnects and canonical link.
- `public/robots.txt`: allows crawling and points to `sitemap.xml`.
- `public/sitemap.xml`: simple sitemap with the home page (add more routes if you deploy multiple pages).

Notes & verification:

- Host the site (e.g. Vercel, Netlify). Then verify `https://<your-site>/robots.txt` and `https://<your-site>/sitemap.xml` are reachable.
- Use Google Search Console to submit the sitemap and monitor indexing.
- For best SEO (rich previews and indexing), consider server-side rendering or prerendering the app routes so crawlers receive full HTML (this project is currently a client-side SPA).

If you want, I can also:

- Generate a full sitemap with all app routes.
- Add meta tags per page (if you add routes) and implement SSR/prerender.
