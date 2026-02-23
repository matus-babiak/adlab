# Adlab – PPC kalkulačky (React)

React SPA s kalkulačkami pre PPC a e-commerce: ROAS, optimalizátor rozpočtu, e-shop metriky, pacing, únava kreatív, scenáre škálovania.

## Technológie

- **React 18** + **Vite 5**
- **React Router 6**
- **Tailwind CSS 3** (PostCSS)

## Spustenie

**Dôležité:** Aplikáciu spúšťaj výhradne cez Vite (`npm run dev`). Otvorenie `index.html` cez Live Server alebo priamo v prehliadači **nebude fungovať** (MIME type / JSX).

```bash
npm install
npm run dev
```

Otvor [http://localhost:5173](http://localhost:5173). Pri prvom spustení sa môže prehliadač otvoriť sám (`open: true`). Ak stránka neide:
- Skús **http://127.0.0.1:5173**
- Over, že v termináli beží `npm run dev` (Vite musí bežať)
- Dočasne vypni antivírus/firewall pre localhost

## Build pre produkciu

```bash
npm run build
```

Výstup je v priečinku `dist/`. Aplikácia je SPA – na serveri nastav fallback na `index.html` (napr. Netlify, Vercel, alebo `npx serve dist`).

## Štruktúra

- `src/main.jsx` – vstupný bod
- `src/App.jsx` – routy
- `src/components/Layout.jsx` – spoločný header a footer (pillar vs kalkulačky)
- `src/pages/` – Index, RoasKalkulacka, OptimalizatorRozpoctu, EcomKalkulacka, PacingScenare, UnavaKreativ, ScenareSkalovania
- `src/index.css` – Tailwind + vlastné triedy (glass-card, pillar-card, metric-box, …)

