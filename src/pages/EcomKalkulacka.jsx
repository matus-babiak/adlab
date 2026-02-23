import { useState } from 'react';

function parseNum(str) {
  if (str == null || str === '') return NaN;
  const s = String(str).replace(/\s/g, '').replace(',', '.');
  return parseFloat(s) || NaN;
}

export default function EcomKalkulacka() {
  const [revenue, setRevenue] = useState('');
  const [cogs, setCogs] = useState('');
  const [adSpend, setAdSpend] = useState('');
  const [conversions, setConversions] = useState('');

  const rev = parseNum(revenue) || 0;
  const cogsNum = parseNum(cogs) || 0;
  const ad = parseNum(adSpend) || 0;
  const conv = parseNum(conversions) || 0;
  const grossProfit = rev - cogsNum;
  const netProfit = grossProfit - ad;
  const cac = conv > 0 ? ad / conv : 0;
  const roas = ad > 0 ? (rev / ad) * 100 : 0;

  return (
    <>
      <section className="pt-12 pb-8 md:pt-16 md:pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight mb-2">
            <span className="text-gradient">E-shop</span> kalkulačka
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Finančné metriky, P&L, reklama a CAC. Základné metriky pre e-commerce.
          </p>
        </div>
      </section>
      <section className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="glass-card rounded-2xl p-8 md:p-10">
            <h2 className="sr-only">E-shop kalkulačka</h2>
            <div className="mb-8">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6">Vstupné hodnoty</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Príjem / tržby (€)</label>
                  <input type="text" inputMode="decimal" placeholder="0" value={revenue} onChange={(e) => setRevenue(e.target.value.replace(',', '.'))} className="w-full px-4 py-3 rounded-xl bg-secondary border border-input text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Náklady na tovar COGS (€)</label>
                  <input type="text" inputMode="decimal" placeholder="0" value={cogs} onChange={(e) => setCogs(e.target.value.replace(',', '.'))} className="w-full px-4 py-3 rounded-xl bg-secondary border border-input text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Výdavok na reklamu (€)</label>
                  <input type="text" inputMode="decimal" placeholder="0" value={adSpend} onChange={(e) => setAdSpend(e.target.value.replace(',', '.'))} className="w-full px-4 py-3 rounded-xl bg-secondary border border-input text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Počet konverzií / nákupov</label>
                  <input type="text" inputMode="decimal" placeholder="0" value={conversions} onChange={(e) => setConversions(e.target.value.replace(',', '.'))} className="w-full px-4 py-3 rounded-xl bg-secondary border border-input text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="metric-box">
                <div className="metric-label">Hrubý zisk (€)</div>
                <div className={`metric-value ${grossProfit >= 0 ? 'text-accent' : 'text-destructive'}`}>
                  {grossProfit.toLocaleString('sk-SK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €
                </div>
              </div>
              <div className="metric-box">
                <div className="metric-label">Čistý zisk (€)</div>
                <div className={`metric-value ${netProfit >= 0 ? 'text-accent' : 'text-destructive'}`}>
                  {netProfit.toLocaleString('sk-SK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €
                </div>
              </div>
              <div className="metric-box">
                <div className="metric-label">CAC (€)</div>
                <div className="metric-value">{conv > 0 ? cac.toLocaleString('sk-SK', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '—'} €</div>
              </div>
              <div className="metric-box">
                <div className="metric-label">ROAS (%)</div>
                <div className="metric-value">{ad > 0 ? roas.toFixed(0) : '—'} %</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
