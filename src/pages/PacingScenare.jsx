import { useState, useEffect } from 'react';

function parseNum(str) {
  if (str == null || str === '') return NaN;
  const s = String(str).replace(/\s/g, '').replace(',', '.');
  return parseFloat(s) || NaN;
}
function fmtEur(n) {
  return Math.abs(n).toLocaleString('sk-SK', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' €';
}

export default function PacingScenare() {
  const [budget, setBudget] = useState('');
  const [daysTotal, setDaysTotal] = useState('');
  const [daysElapsed, setDaysElapsed] = useState('');
  const [spent, setSpent] = useState('');
  const [targetRoas, setTargetRoas] = useState('');

  useEffect(() => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const dayOfMonth = now.getDate();
    if (!daysTotal) setDaysTotal(String(daysInMonth));
    if (!daysElapsed) setDaysElapsed(String(Math.min(dayOfMonth, daysInMonth)));
  }, [daysTotal, daysElapsed]);

  const budgetNum = parseNum(budget);
  const daysTotalNum = parseInt(daysTotal, 10) || 30;
  const daysElapsedNum = parseInt(daysElapsed, 10) || 0;
  const spentNum = parseNum(spent) || 0;
  const targetRoasNum = parseNum(targetRoas);
  const valid = !isNaN(budgetNum) && budgetNum > 0 && daysElapsedNum >= 0 && daysElapsedNum <= daysTotalNum;
  const remaining = valid ? Math.max(0, budgetNum - spentNum) : 0;
  const daysLeft = valid ? Math.max(0, daysTotalNum - daysElapsedNum) : 0;
  const dailyRecommended = daysLeft > 0 ? remaining / daysLeft : 0;
  const expectedByNow = valid ? (budgetNum / daysTotalNum) * daysElapsedNum : 0;
  const paceDiff = expectedByNow - spentNum;
  let paceStatus = '—';
  let paceClass = '';
  if (valid && daysElapsedNum > 0) {
    if (Math.abs(paceDiff) < budgetNum * 0.02) {
      paceStatus = 'Podľa plánu';
      paceClass = 'text-accent';
    } else if (paceDiff > 0) {
      paceStatus = `Za plánom (−${fmtEur(paceDiff)})`;
      paceClass = 'text-primary';
    } else {
      paceStatus = `Pred plánom (+${fmtEur(-paceDiff)})`;
      paceClass = 'text-destructive';
    }
  } else if (valid) paceStatus = 'Na začiatku mesiaca';

  const scenarios = [
    { label: '−20 %', mult: 0.8 },
    { label: '−10 %', mult: 0.9 },
    { label: 'Odporúčaný pacing', mult: 1 },
    { label: '+10 %', mult: 1.1 },
    { label: '+20 %', mult: 1.2 },
  ];

  const steps = [];
  if (valid && Math.abs(paceDiff) > budgetNum * 0.05) {
    if (paceDiff > 0) steps.push(`Zrýchlite pacing: zvýšte denný výdavok na ${fmtEur(dailyRecommended)}.`);
    else steps.push(`Spomalte pacing: znížte denný výdavok na približne ${fmtEur(dailyRecommended)}.`);
  }
  steps.push('Kontrolujte pacing aspoň 2× týždenne.');
  steps.push('Ak je výkon nad cieľovým ROAS, zvážte scenár „+10 %“ alebo „+20 %“.');
  if (targetRoasNum && !isNaN(targetRoasNum)) steps.push(`Cieľový ROAS ${targetRoasNum} %: sledujte priemerný ROAS za mesiac.`);

  return (
    <>
      <section className="pt-12 pb-8 md:pt-16 md:pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight mb-2">
            <span className="text-gradient">Pacing</span> a scenáre rozpočtu
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Mesačný rozpočet, uplynuté dni a doterajší výdavok. Odporúčaný denný pacing a scenáre zmeny.
          </p>
        </div>
      </section>
      <section className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="glass-card rounded-2xl p-8 md:p-10">
            <h2 className="sr-only">Pacing kalkulačka</h2>
            <div className="mb-8">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6">Vstupné hodnoty</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Mesačný rozpočet (€)</label>
                  <input type="text" inputMode="decimal" placeholder="5000" value={budget} onChange={(e) => setBudget(e.target.value.replace(',', '.'))} className="w-full px-4 py-3 rounded-xl bg-secondary border border-input text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background" />
                  <span className="text-xs text-muted-foreground">Celkový budget na mesiac</span>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Dní v mesiaci</label>
                  <input type="number" placeholder="30" min={28} max={31} value={daysTotal} onChange={(e) => setDaysTotal(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-secondary border border-input text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Uplynuté dni</label>
                  <input type="number" placeholder="10" min={0} value={daysElapsed} onChange={(e) => setDaysElapsed(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-secondary border border-input text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Doterajší výdavok (€)</label>
                  <input type="text" inputMode="decimal" placeholder="1200" value={spent} onChange={(e) => setSpent(e.target.value.replace(',', '.'))} className="w-full px-4 py-3 rounded-xl bg-secondary border border-input text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Cieľový ROAS (%)</label>
                  <input type="text" inputMode="decimal" placeholder="400" value={targetRoas} onChange={(e) => setTargetRoas(e.target.value.replace(',', '.'))} className="w-full px-4 py-3 rounded-xl bg-secondary border border-input text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background" />
                </div>
              </div>
            </div>
            {valid && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="metric-box">
                    <div className="metric-label">Zostáva (€)</div>
                    <div className="metric-value text-accent">{fmtEur(remaining)}</div>
                  </div>
                  <div className="metric-box">
                    <div className="metric-label">Dní do konca</div>
                    <div className="metric-value">{daysLeft}</div>
                  </div>
                  <div className="metric-box">
                    <div className="metric-label">Odporúčaný denný výdavok (€)</div>
                    <div className="metric-value text-primary">{daysLeft > 0 ? fmtEur(dailyRecommended) : '—'}</div>
                  </div>
                  <div className="metric-box">
                    <div className="metric-label">Stav pacingu</div>
                    <div className={`metric-value text-sm ${paceClass}`}>{paceStatus}</div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Scenáre do konca mesiaca</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 pr-4 text-muted-foreground font-semibold">Scenár</th>
                          <th className="text-right py-2 pr-4 text-muted-foreground font-semibold">Denný výdavok (€)</th>
                          <th className="text-right py-2 text-muted-foreground font-semibold">Mesačný súčet (€)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scenarios.map((s) => {
                          const daily = dailyRecommended * s.mult;
                          const totalToEnd = daily * daysLeft;
                          const monthTotal = spentNum + totalToEnd;
                          return (
                            <tr key={s.label} className="border-b border-border/50">
                              <td className="py-3 pr-4">{s.label}</td>
                              <td className="text-right py-3 pr-4">{daysLeft > 0 ? fmtEur(daily) : '—'}</td>
                              <td className="text-right py-3">{fmtEur(monthTotal)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="pt-4 border-t border-border/50">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Kroky na zmenu</h4>
                  <div className="rec-list">
                    {steps.map((t, i) => (
                      <div key={i} className="rec-item">
                        <span className="rec-num">{i + 1}</span>
                        <span className="text-sm text-foreground leading-relaxed">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {!valid && <p className="text-center text-muted-foreground text-sm mt-6">Vyplňte rozpočet, dni a výdavok.</p>}
          </div>
        </div>
      </section>
    </>
  );
}
