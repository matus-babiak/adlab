import { useState } from 'react';

function parseNum(str) {
  if (str == null || str === '') return NaN;
  const s = String(str).replace(/\s/g, '').replace(',', '.');
  return parseFloat(s) || NaN;
}
function fmtEur(n) {
  return Math.abs(n).toLocaleString('sk-SK', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' €';
}
function fmtPct(n) {
  return n.toLocaleString('sk-SK', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' %';
}

const STEPS = [
  'Škálujte po krokoch: najskôr +10–20 % budgetu, vyhodnoťte po 5–7 dňoch.',
  'Prestaňte škálovať, keď ROAS klesne pod breakeven alebo zisk prestane rásť.',
  'Pri vysokej elasticite zvyšujte budget pomalšie a testujte nové auditóriá.',
  'Sledujte frekvenciu a únavu kreatív pri škálovaní.',
  'Porovnajte scenáre s reálnymi dátami po každom scale-up.',
];

export default function ScenareSkalovania() {
  const [spend, setSpend] = useState('');
  const [roas, setRoas] = useState('');
  const [elasticity, setElasticity] = useState('5');

  const spendNum = parseNum(spend);
  const roasNum = parseNum(roas) || 400;
  const elasticityNum = parseNum(elasticity);
  const el = isNaN(elasticityNum) || elasticityNum < 0 ? 5 : elasticityNum;
  const hasSpend = !isNaN(spendNum) && spendNum > 0;
  const currentRev = hasSpend ? (roasNum / 100) * spendNum : 0;

  function roasAtScale(mult) {
    const budgetIncreasePct = (mult - 1) * 100;
    const totalDrop = (budgetIncreasePct / 10) * el;
    return Math.max(50, roasNum - totalDrop);
  }
  function revenueAtScale(mult) {
    const newSpend = spendNum * mult;
    const newRoas = roasAtScale(mult);
    return (newRoas / 100) * newSpend;
  }

  const safeStepPct = Math.max(10, Math.min(20, 50 - el * 2));
  const scenarios = [
    { label: 'Aktuálny stav', mult: 1 },
    { label: '+10 %', mult: 1.1 },
    { label: '+20 %', mult: 1.2 },
    { label: '+50 %', mult: 1.5 },
  ];

  return (
    <>
      <section className="pt-12 pb-8 md:pt-16 md:pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight mb-2">
            <span className="text-gradient">Scenáre škálovania</span>
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Aktuálny výdavok, ROAS a odhad elasticity. Predpoveď ROAS a príjmu pri +10 %, +20 %, +50 % rozpočte.
          </p>
        </div>
      </section>
      <section className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="glass-card rounded-2xl p-8 md:p-10">
            <h2 className="sr-only">Scenáre škálovania</h2>
            <div className="mb-8">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6">Vstupné hodnoty</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Aktuálny výdavok (€)</label>
                  <input type="text" inputMode="decimal" placeholder="3000" value={spend} onChange={(e) => setSpend(e.target.value.replace(',', '.'))} className="w-full px-4 py-3 rounded-xl bg-secondary border border-input text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Aktuálny ROAS (%)</label>
                  <input type="text" inputMode="decimal" placeholder="500" value={roas} onChange={(e) => setRoas(e.target.value.replace(',', '.'))} className="w-full px-4 py-3 rounded-xl bg-secondary border border-input text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Elasticita (pokles ROAS)</label>
                  <input type="text" inputMode="decimal" placeholder="5" value={elasticity} onChange={(e) => setElasticity(e.target.value.replace(',', '.'))} className="w-full px-4 py-3 rounded-xl bg-secondary border border-input text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background" />
                  <span className="text-xs text-muted-foreground">% pokles na každých 10 % budgetu</span>
                </div>
              </div>
            </div>
            {hasSpend && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="metric-box">
                    <div className="metric-label">Odporúčaný bezpečný krok</div>
                    <div className="metric-value text-accent">+{safeStepPct} %</div>
                    <div className="text-xs text-muted-foreground mt-1">Navýšte budget o {safeStepPct} %, sledujte ROAS 5–7 dní.</div>
                  </div>
                  <div className="metric-box">
                    <div className="metric-label">Aktuálny príjem (€)</div>
                    <div className="metric-value">{fmtEur(currentRev)}</div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Scenáre pri vyššom rozpočte</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 pr-4 text-muted-foreground font-semibold">Zmena budgetu</th>
                          <th className="text-right py-2 pr-4 text-muted-foreground font-semibold">Nový výdavok (€)</th>
                          <th className="text-right py-2 pr-4 text-muted-foreground font-semibold">Odhad ROAS (%)</th>
                          <th className="text-right py-2 text-muted-foreground font-semibold">Odhad príjem (€)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scenarios.map((s) => (
                          <tr key={s.label} className="border-b border-border/50">
                            <td className="py-3 pr-4">{s.label}</td>
                            <td className="text-right py-3 pr-4">{fmtEur(spendNum * s.mult)}</td>
                            <td className="text-right py-3 pr-4">{fmtPct(roasAtScale(s.mult))}</td>
                            <td className="text-right py-3">{fmtEur(revenueAtScale(s.mult))}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="pt-4 border-t border-border/50">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Kroky: ako škálovať a kedy prestať</h4>
                  <div className="rec-list">
                    {STEPS.map((t, i) => (
                      <div key={i} className="rec-item">
                        <span className="rec-num">{i + 1}</span>
                        <span className="text-sm text-foreground leading-relaxed">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {!hasSpend && <p className="text-center text-muted-foreground text-sm">Zadajte výdavok, ROAS a elasticitu.</p>}
          </div>
        </div>
      </section>
    </>
  );
}
