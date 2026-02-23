import { useState } from 'react';

const CX = 40; const CY = 44; const R = 34; const START_ANG = -200; const END_ANG = 20;
function polarToXY(angleDeg, r) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
}
function arcPath(startDeg, endDeg, r) {
  const s = polarToXY(startDeg, r);
  const e = polarToXY(endDeg, r);
  const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

function fmtEur(n) {
  const formatted = Math.abs(n).toLocaleString('sk-SK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (n < 0 ? '−' : '') + formatted + ' €';
}
function fmtPct(n) {
  return n.toLocaleString('sk-SK', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' %';
}

const ROAS_TIPS = {
  excellent: { colorClass: 'text-accent', icon: '🌟', label: 'Výborné', barColor: '#00FF80', summary: 'Vynikajúce ROAS! Vaša reklama je vysoko zisková. Škálujte agresívne.', tips: ['Škálujte úspešné kampane o 20–50 %', 'Testujte lookalike auditóriá', 'Zvážte expanziu do nových kanálov'] },
  good: { colorClass: 'text-accent', icon: '✅', label: 'Dobré', barColor: '#00FF80', summary: 'Dobré ROAS! Kampane sú ziskové a stabilné.', tips: ['A/B testujte kreativy', 'Optimalizujte landing page', 'Zvážte navýšenie rozpočtu o 10–20 %'] },
  average: { colorClass: 'text-primary', icon: '⚠️', label: 'Priemerné', barColor: '#FFD700', summary: 'Nad breakevenom, no pod cieľom. Optimalizujte pred škálovaním.', tips: ['Zúžte targeting', 'Otestujte nové reklamné texty', 'Pozastavte podvýkonné skupiny'] },
  weak: { colorClass: 'text-destructive', icon: '🚫', label: 'Slabé', barColor: '#FF6B4A', summary: 'Pod breakevenom. Zredukujte výdavky a prehodnoťte stratégiu.', tips: ['Pozastavte neúčinné kampane', 'Overte conversion tracking', 'Zvážte konzultáciu s PPC špecialistom'] },
};

export default function RoasKalkulacka() {
  const [cost, setCost] = useState('');
  const [rev, setRev] = useState('');
  const [targetRoas, setTargetRoas] = useState('800');

  const parseNum = (v) => {
    if (v == null || v === '') return NaN;
    const s = String(v).replace(/\s/g, '').replace(',', '.');
    return parseFloat(s) || NaN;
  };
  const costNum = parseNum(cost);
  const revNum = parseNum(rev);
  const targetNum = parseNum(targetRoas) || 800;
  const breakeven = targetNum / 2;
  const hasInput = costNum > 0;
  const roas = hasInput ? (revNum / costNum) * 100 : 0;
  const profit = hasInput ? revNum - costNum : 0;
  const perEur = hasInput ? revNum / costNum : 0;

  let tier = ROAS_TIPS.weak;
  if (roas >= 1000) tier = ROAS_TIPS.excellent;
  else if (roas >= 800) tier = ROAS_TIPS.good;
  else if (roas >= 400) tier = ROAS_TIPS.average;

  const maxScale = Math.max(1200, targetNum * 1.2);
  const gaugePct = hasInput ? Math.min(1, roas / maxScale) : 0;
  const gaugeAngle = START_ANG + gaugePct * (END_ANG - START_ANG);
  const needleTip = polarToXY(gaugeAngle, R - 10);
  const barPct = hasInput ? Math.min(100, (roas / targetNum) * 100) : 0;

  const handleCopy = () => {
    const text = `${tier.summary}\n\nOdporúčania:\n${tier.tips.map((t, i) => `${i + 1}. ${t}`).join('\n')}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <section className="pt-12 pb-8 md:pt-16 md:pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight mb-2">
            <span className="text-gradient">ROAS</span> kalkulačka
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Zadajte náklady na reklamu a príjem z reklamy. Zobrazí sa ROAS, zisk a odporúčania.
          </p>
        </div>
      </section>
      <section className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="glass-card rounded-2xl p-8 md:p-10">
            <h2 className="sr-only">ROAS kalkulačka</h2>
            <div className="mb-8">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6">Vstupné hodnoty</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Náklady na reklamu</label>
                  <div className="relative">
                    <input type="text" inputMode="decimal" placeholder="0,00" value={cost} onChange={(e) => setCost(e.target.value.replace(',', '.'))} className="w-full px-4 py-3 pr-12 rounded-xl bg-secondary border border-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">€</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Celkové výdavky na reklamu</span>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Príjem z reklamy</label>
                  <div className="relative">
                    <input type="text" inputMode="decimal" placeholder="0,00" value={rev} onChange={(e) => setRev(e.target.value.replace(',', '.'))} className="w-full px-4 py-3 pr-12 rounded-xl bg-secondary border border-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">€</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Príjmy priraditeľné k reklame</span>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-semibold">Cieľový ROAS (%) — voliteľné</label>
                  <input type="number" placeholder="800" min={100} step={50} value={targetRoas} onChange={(e) => setTargetRoas(e.target.value)} className="w-full max-w-xs px-4 py-3 rounded-xl bg-secondary border border-input text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background" />
                  <span className="text-xs text-muted-foreground">Pre škálu pruhu (predvolene 800 %)</span>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div className="space-y-4">
                  <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">ROAS</div>
                  <div className={`text-4xl md:text-5xl font-black tracking-tight ${hasInput ? tier.colorClass : 'text-foreground'}`} aria-live="polite">
                    {hasInput ? fmtPct(roas) : '—'}
                  </div>
                  {hasInput && (
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${tier.barColor === '#00FF80' ? 'bg-accent/10 text-accent' : tier.barColor === '#FF6B4A' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                      <span aria-hidden="true">{tier.icon}</span>
                      <span>{tier.label}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center space-y-4">
                  <svg className="w-32 h-20 sm:w-40 sm:h-24" viewBox="0 0 80 48" role="img" aria-label={hasInput ? fmtPct(roas) : 'Zadajte hodnoty'}>
                    <defs>
                      <linearGradient id="gauge-grad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#FF6B4A"/><stop offset="33%" stopColor="#FFA500"/><stop offset="67%" stopColor="#00FF80"/><stop offset="100%" stopColor="#00FF80"/>
                      </linearGradient>
                    </defs>
                    <path d={arcPath(START_ANG, END_ANG, R)} fill="none" stroke="#262626" strokeWidth="6" strokeLinecap="round"/>
                    {hasInput && <path d={arcPath(START_ANG, gaugeAngle, R)} fill="none" stroke="url(#gauge-grad)" strokeWidth="6" strokeLinecap="round"/>}
                    {hasInput && <line x1="40" y1="44" x2={needleTip.x} y2={needleTip.y} stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>}
                    {hasInput && <circle cx="40" cy="44" r="2" fill="#ffffff"/>}
                  </svg>
                  <div className="text-sm text-muted-foreground font-medium">{hasInput ? fmtPct(roas) : 'Zadajte hodnoty'}</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>{Math.round(breakeven)}% breakeven</span>
                  <span>{Math.round(targetNum)}% cieľ</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden" role="progressbar" aria-valuenow={barPct} aria-valuemin={0} aria-valuemax={100}>
                  <div className="h-full transition-all duration-500 ease-out" style={{ width: `${barPct}%`, background: hasInput ? tier.barColor : '#262626' }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 p-6 bg-secondary/50 rounded-xl">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">Zisk / Strata</div>
                  <div className={`text-xl font-bold ${hasInput && (profit >= 0 ? 'text-accent' : 'text-destructive')}`}>{hasInput ? fmtEur(profit) : '—'}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">Výnos za 1 €</div>
                  <div className="text-xl font-bold">{hasInput ? fmtEur(perEur) : '—'}</div>
                </div>
              </div>
              {hasInput && (
                <div className={`p-6 rounded-xl ${tier.barColor === '#00FF80' ? 'bg-accent/5 border border-accent/20' : tier.barColor === '#FF6B4A' ? 'bg-destructive/5 border border-destructive/20' : 'bg-primary/5 border border-primary/20'}`}>
                  <p className="leading-relaxed"><strong className={tier.colorClass}>{tier.summary}</strong></p>
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Odporúčania</h4>
                    <ul className="space-y-2 text-sm text-foreground">
                      {tier.tips.map((t, i) => (
                        <li key={i} className="flex items-start gap-2"><span className="text-muted-foreground mt-1">•</span><span>{t}</span></li>
                      ))}
                    </ul>
                    <button type="button" onClick={handleCopy} className="mt-4 px-4 py-2 rounded-lg bg-secondary border border-border text-sm font-semibold hover:bg-muted focus-ring">Kopírovať odporúčania</button>
                  </div>
                </div>
              )}
              {!hasInput && <p className="text-center text-muted-foreground text-sm">Zadajte náklady a príjem pre výpočet</p>}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
