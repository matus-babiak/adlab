import { useState } from 'react';

const MIN_CAMPAIGNS = 2;
const MAX_CAMPAIGNS = 15;

function parseNum(str) {
  if (str == null || str === '') return NaN;
  const s = String(str).replace(/\s/g, '').replace(',', '.');
  return parseFloat(s) || NaN;
}

function fmt(n, d = 2) {
  return Number(n).toFixed(d === undefined ? 2 : d);
}
function fmtEur(n) {
  return new Intl.NumberFormat('sk-SK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + ' €';
}

function computeEfficiency(roas, breakeven, target) {
  if (roas <= 0) return 0;
  if (roas >= target) return Math.min(100, 60 + (roas / target) * 40);
  if (roas >= breakeven) return 30 + ((roas - breakeven) / (target - breakeven)) * 30;
  return Math.max(0, (roas / breakeven) * 30);
}

function getAction(roas, breakeven, target) {
  if (roas >= target) return 'scale';
  if (roas >= breakeven) return 'maintain';
  if (roas > 0) return 'reduce';
  return 'pause';
}

function allocateBudget(campaigns, totalBudget) {
  const weights = campaigns.map((c) => ({ scale: 2.5, maintain: 1, reduce: 0.3, pause: 0.05 }[c.action]));
  const totalWeight = weights.reduce((s, w) => s + w, 0);
  return weights.map((w) => Math.max(0, Math.round((w / totalWeight) * totalBudget * 100) / 100));
}

function generateRecommendations(campaigns, recommended, summary) {
  const recs = [];
  const sorted = campaigns.map((c, i) => ({ ...c, rec: recommended[i] })).sort((a, b) => b.roas - a.roas);
  const top = sorted.filter((c) => c.action === 'scale');
  const under = sorted.filter((c) => c.action === 'pause');
  const medium = sorted.filter((c) => c.action === 'maintain');
  const toReduce = sorted.filter((c) => c.action === 'reduce' || c.action === 'pause');

  if (top.length > 0) {
    const names = top.map((c) => `<strong>${c.name}</strong> (${fmt(c.roas, 1)}%)`).join(', ');
    recs.push(`Škálovať budget: Kampane ${names} presahujú cieľový ROAS ${summary.targetRoas}%. Navýšte ich budget a sledujte frekvenciu.`);
  }
  if (under.length > 0) {
    const total = under.reduce((s, c) => s + c.spent, 0);
    recs.push(`Pozastaviť kampane: ${under.map((c) => `<strong>${c.name}</strong>`).join(', ')} generujú nulový výnos. Uvoľnite ${fmtEur(total)} pre výkonnejšie kampane.`);
  }
  if (medium.length > 0) {
    recs.push(`Optimalizovať kreatívu: Kampane ${medium.map((c) => `<strong>${c.name}</strong>`).join(', ')} sú nad breakeven, ale nedosahujú cieľový ROAS. Testujte nové kreatívy bez zmeny budgetu.`);
  }
  if (toReduce.length > 0 && top.length > 0) {
    const saved = toReduce.reduce((s, c) => s + Math.max(0, c.spent - c.rec), 0);
    recs.push(`Prerozdelenie budgetu: Presmerujte ~${fmtEur(saved)} z podvýkonných kampaní na top kampane. Projektovaný nárast ROAS: +${fmt(Math.max(0, summary.projectedRoas - summary.currentRoas), 1)}%.`);
  }
  if (medium.length > 0) {
    recs.push(`A/B testovanie: Pre kampane s ROAS medzi ${summary.breakevenRoas}–${summary.targetRoas}% spustite A/B test audiencie alebo formátu. Min. 7–14 dní pred vyhodnotením.`);
  }
  const withCpp = campaigns.filter((c) => c.actualCpp > 0);
  if (withCpp.length > 1) {
    const best = withCpp.reduce((a, b) => (a.actualCpp < b.actualCpp ? a : b));
    recs.push(`CPA optimalizácia: Najnižšia cena za nákup je u kampane <strong>${best.name}</strong> (${fmtEur(best.actualCpp)}/nákup). Replikujte jej nastavenia do ďalších kampaní.`);
  }
  return recs;
}

const inputClass = 'w-full px-3 py-2 rounded-lg bg-secondary border border-input text-foreground text-sm focus:ring-2 focus:ring-ring min-w-0';
const inputClassGlobal = 'w-full px-4 py-3 rounded-xl bg-secondary border border-input text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background';

export default function OptimalizatorRozpoctu() {
  const [totalBudget, setTotalBudget] = useState('');
  const [breakevenRoas, setBreakevenRoas] = useState('400');
  const [targetRoas, setTargetRoas] = useState('800');
  const [campaigns, setCampaigns] = useState([
    { name: 'Kampaň 1', spent: '', revenue: '', impressions: '', purchases: '', cpp: '' },
    { name: 'Kampaň 2', spent: '', revenue: '', impressions: '', purchases: '', cpp: '' },
  ]);
  const [results, setResults] = useState(null);

  const addCampaign = () => {
    if (campaigns.length >= MAX_CAMPAIGNS) return;
    setCampaigns([...campaigns, { name: `Kampaň ${campaigns.length + 1}`, spent: '', revenue: '', impressions: '', purchases: '', cpp: '' }]);
  };

  const updateCampaign = (i, field, value) => {
    const next = [...campaigns];
    next[i] = { ...next[i], [field]: value };
    setCampaigns(next);
  };

  const removeCampaign = (i) => {
    if (campaigns.length <= MIN_CAMPAIGNS) return;
    setCampaigns(campaigns.filter((_, j) => j !== i));
  };

  const calculate = () => {
    const budgetIn = parseNum(totalBudget);
    const be = parseNum(breakevenRoas) || 400;
    const target = parseNum(targetRoas) || 800;
    if (isNaN(be) || isNaN(target) || be <= 0 || target <= 0) return;

    const list = campaigns.map((c) => ({
      name: (c.name || '').trim() || 'Kampaň',
      spent: parseNum(c.spent) || 0,
      revenue: parseNum(c.revenue) || 0,
      impressions: parseNum(c.impressions) || 0,
      purchases: parseNum(c.purchases) || 0,
      cpp: parseNum(c.cpp) || 0,
    }));

    if (!list.some((c) => c.spent > 0 && c.revenue > 0)) return;

    const analyzed = list.map((c) => {
      const roas = c.spent > 0 ? (c.revenue / c.spent) * 100 : 0;
      const effScore = computeEfficiency(roas, be, target);
      const action = getAction(roas, be, target);
      const actualCpp = c.purchases > 0 ? c.spent / c.purchases : c.cpp || 0;
      return { ...c, roas, effScore, action, actualCpp };
    });

    const totalSpent = analyzed.reduce((s, c) => s + c.spent, 0);
    const totalRevenue = analyzed.reduce((s, c) => s + c.revenue, 0);
    const budget = budgetIn > 0 ? budgetIn : totalSpent;
    const recommended = allocateBudget(analyzed, budget);
    const currentRoas = totalSpent > 0 ? (totalRevenue / totalSpent) * 100 : 0;

    const projectedRevenue = analyzed.reduce((s, c, i) => {
      const mult = recommended[i] / (c.spent || 1);
      const factor = c.roas > 0 ? Math.pow(mult, 0.85) : 0;
      return s + c.revenue * factor;
    }, 0);
    const projectedRoas = budget > 0 ? (projectedRevenue / budget) * 100 : 0;

    const summary = {
      currentRoas,
      projectedRoas,
      totalSpent,
      totalRevenue,
      budget,
      breakevenRoas: be,
      targetRoas: target,
    };
    setResults({
      analyzed,
      recommended,
      summary,
      recommendations: generateRecommendations(analyzed, recommended, summary),
    });
  };

  const copyRecommendations = () => {
    if (!results?.recommendations?.length) return;
    const text = results.recommendations.map((r, i) => `${i + 1}. ${r.replace(/<[^>]+>/g, '')}`).join('\n\n');
    navigator.clipboard.writeText(text).then(() => alert('Odporúčania skopírované!'));
  };

  const copyTable = () => {
    if (!results) return;
    const headers = ['Kampaň', 'ROAS', 'Aktuálny budget', 'Odporúčaný budget', 'Zmena', 'Efektívnosť', 'Akcia'];
    const sorted = results.analyzed.map((c, i) => ({ ...c, rec: results.recommended[i] })).sort((a, b) => b.roas - a.roas);
    const rows = sorted.map((c) => {
      const delta = c.rec - c.spent;
      const actionLabel = { scale: '↑ Škálovať', maintain: '→ Udržať', reduce: '↓ Redukovať', pause: '⏸ Pozastaviť' }[c.action] || '';
      return [c.name, fmt(c.roas, 1) + '%', fmtEur(c.spent), fmtEur(c.rec), (delta >= 0 ? '+' : '') + fmtEur(delta), fmt(c.effScore, 0) + '/100', actionLabel].join('\t');
    });
    const text = headers.join('\t') + '\n' + rows.join('\n');
    navigator.clipboard.writeText(text).then(() => alert('Tabuľka skopírovaná!'));
  };

  return (
    <>
      <section className="pt-12 pb-8 md:pt-16 md:pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight mb-2">
            <span className="text-gradient">Optimalizátor</span> rozpočtu kampaní
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Inteligentné prerozdelenie budgetu pre maximálny ROAS
          </p>
        </div>
      </section>
      <section className="py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="glass-card rounded-2xl p-8 md:p-10">
            <div className="mb-8">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6">Globálne nastavenia</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Celkový mesačný rozpočet (€) <span className="text-muted-foreground font-normal">*</span></label>
                  <input type="text" inputMode="decimal" placeholder="napr. 5000" value={totalBudget} onChange={(e) => setTotalBudget(e.target.value.replace(',', '.'))} className={inputClassGlobal} />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Breakeven ROAS (%) <span className="text-muted-foreground font-normal">*</span></label>
                  <input type="text" inputMode="decimal" placeholder="400" value={breakevenRoas} onChange={(e) => setBreakevenRoas(e.target.value.replace(',', '.'))} className={inputClassGlobal} />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Cieľový ROAS (%) <span className="text-muted-foreground font-normal">*</span></label>
                  <input type="text" inputMode="decimal" placeholder="800" value={targetRoas} onChange={(e) => setTargetRoas(e.target.value.replace(',', '.'))} className={inputClassGlobal} />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Kampane</h3>
              <div className="hidden lg:grid grid-cols-[1.4fr_1fr_1fr_0.9fr_0.8fr_0.9fr_48px] gap-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/50">
                <span>Názov kampane</span>
                <span>Minutý budget (€)</span>
                <span>Príjem (€)</span>
                <span>Impresie</span>
                <span>Nákupy</span>
                <span>Cena/nákup (€)</span>
                <span></span>
              </div>
              <div className="space-y-4 mt-2">
                {campaigns.map((c, i) => (
                  <div key={i} className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr_0.9fr_0.8fr_0.9fr_48px] gap-3 items-end p-4 rounded-xl bg-secondary/30 border border-border/50 lg:py-3 lg:pb-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-muted-foreground lg:sr-only">Názov</label>
                      <input type="text" placeholder="Názov kampane" value={c.name} onChange={(e) => updateCampaign(i, 'name', e.target.value)} className={inputClass} />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-muted-foreground lg:sr-only">Minutý budget (€)</label>
                      <input type="text" inputMode="decimal" placeholder="0" value={c.spent} onChange={(e) => updateCampaign(i, 'spent', e.target.value.replace(',', '.'))} className={inputClass} />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-muted-foreground lg:sr-only">Príjem (€)</label>
                      <input type="text" inputMode="decimal" placeholder="0" value={c.revenue} onChange={(e) => updateCampaign(i, 'revenue', e.target.value.replace(',', '.'))} className={inputClass} />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-muted-foreground lg:sr-only">Impresie</label>
                      <input type="text" inputMode="numeric" placeholder="—" value={c.impressions} onChange={(e) => updateCampaign(i, 'impressions', e.target.value)} className={inputClass} />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-muted-foreground lg:sr-only">Nákupy</label>
                      <input type="text" inputMode="numeric" placeholder="—" value={c.purchases} onChange={(e) => updateCampaign(i, 'purchases', e.target.value)} className={inputClass} />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-muted-foreground lg:sr-only">Cena/nákup (€)</label>
                      <input type="text" inputMode="decimal" placeholder="—" value={c.cpp} onChange={(e) => updateCampaign(i, 'cpp', e.target.value.replace(',', '.'))} className={inputClass} />
                    </div>
                    <button type="button" onClick={() => removeCampaign(i)} disabled={campaigns.length <= MIN_CAMPAIGNS} className="w-10 h-10 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive/50 hover:bg-destructive/10 disabled:opacity-30 disabled:cursor-not-allowed text-xl leading-none" title="Odstrániť">×</button>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-border/50">
                <button type="button" onClick={addCampaign} className="px-4 py-2 rounded-lg border border-primary/50 text-primary text-sm font-semibold hover:bg-primary/10 focus-ring">
                  + Pridať kampaň
                </button>
                <button type="button" onClick={calculate} className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 focus-ring">
                  Analyzovať
                </button>
              </div>
            </div>
          </div>

          {results && (
            <div className="mt-8 space-y-6">
              <div className="glass-card rounded-2xl p-8 md:p-10">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Súhrnný prehľad</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                  <div className="metric-box">
                    <div className="metric-label">Aktuálny ROAS</div>
                    <div className={`metric-value ${results.summary.currentRoas >= results.summary.targetRoas ? 'text-accent' : results.summary.currentRoas >= results.summary.breakevenRoas ? 'text-primary' : 'text-destructive'}`}>
                      {fmt(results.summary.currentRoas, 1)}%
                    </div>
                    <div className="metric-sub">{fmtEur(results.summary.totalRevenue)} / {fmtEur(results.summary.totalSpent)}</div>
                  </div>
                  <div className="metric-box">
                    <div className="metric-label">Projektovaný ROAS</div>
                    <div className={`metric-value ${results.summary.projectedRoas >= results.summary.targetRoas ? 'text-accent' : results.summary.projectedRoas >= results.summary.breakevenRoas ? 'text-primary' : 'text-amber-400'}`}>
                      {fmt(results.summary.projectedRoas, 1)}%
                    </div>
                    <div className="metric-sub">po optimalizácii</div>
                  </div>
                  <div className="metric-box">
                    <div className="metric-label">Celkový budget</div>
                    <div className="metric-value">{fmtEur(results.summary.budget)}</div>
                    <div className="metric-sub">na prerozdelenie</div>
                  </div>
                  <div className="metric-box">
                    <div className="metric-label">Počet kampaní</div>
                    <div className="metric-value">{results.analyzed.length}</div>
                    <div className="metric-sub">{results.analyzed.filter((c) => c.action === 'scale').length} na škálovanie</div>
                  </div>
                  <div className="metric-box">
                    <div className="metric-label">ROAS delta</div>
                    <div className={`metric-value ${results.summary.projectedRoas > results.summary.currentRoas ? 'text-accent' : 'text-destructive'}`}>
                      {(results.summary.projectedRoas > results.summary.currentRoas ? '+' : '') + fmt(results.summary.projectedRoas - results.summary.currentRoas, 1)}%
                    </div>
                    <div className="metric-sub">očakávaná zmena</div>
                  </div>
                </div>
              </div>

              {(results.analyzed.some((c) => c.roas === 0 && c.spent > 0) || results.analyzed.some((c) => c.roas > 0 && c.roas < results.summary.breakevenRoas)) && (
                <div className="space-y-2">
                  {results.analyzed.filter((c) => c.roas === 0 && c.spent > 0).map((c, i) => (
                    <div key={'w0-' + i} className="warning-box">
                      ⚠️ Kampaň <strong>{c.name}</strong> má nulový príjem pri minutých {fmtEur(c.spent)}. Skontrolujte tracking.
                    </div>
                  ))}
                  {results.analyzed.filter((c) => c.roas > 0 && c.roas < results.summary.breakevenRoas).map((c, i) => (
                    <div key={'w1-' + i} className="warning-box">
                      ⚠️ Kampaň <strong>{c.name}</strong> má ROAS {fmt(c.roas, 1)}% — pod breakeven hodnotou {results.summary.breakevenRoas}%.
                    </div>
                  ))}
                </div>
              )}

              <div className="glass-card rounded-2xl p-8 md:p-10">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Odporúčania</h4>
                <div className="rec-list">
                  {results.recommendations.map((r, i) => (
                    <div key={i} className={`rec-item ${i < 4 ? 'priority-' + (i + 1) : ''}`}>
                      <div className="rec-num">{i + 1}</div>
                      <div className="rec-text" dangerouslySetInnerHTML={{ __html: r }} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-8 md:p-10">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Detailná analýza kampaní</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm results-table">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="py-2 pr-4 text-muted-foreground font-semibold">Kampaň</th>
                        <th className="py-2 pr-4 text-muted-foreground font-semibold">ROAS (%)</th>
                        <th className="py-2 pr-4 text-muted-foreground font-semibold">Aktuálny budget</th>
                        <th className="py-2 pr-4 text-muted-foreground font-semibold">Odporúčaný budget</th>
                        <th className="py-2 pr-4 text-muted-foreground font-semibold">Zmena</th>
                        <th className="py-2 pr-4 text-muted-foreground font-semibold">Efektívnosť</th>
                        <th className="py-2 text-muted-foreground font-semibold">Akcia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.analyzed
                        .map((c, i) => ({ ...c, rec: results.recommended[i] }))
                        .sort((a, b) => b.roas - a.roas)
                        .map((c, i) => {
                          const delta = c.rec - c.spent;
                          const barColor = c.roas >= results.summary.targetRoas ? '#00FF80' : c.roas >= results.summary.breakevenRoas ? '#FFD700' : c.roas > 0 ? '#FFA500' : '#FF6B4A';
                          const barWidth = Math.min(100, (c.roas / (results.summary.targetRoas * 1.5)) * 100);
                          const actionLabel = { scale: '↑ Škálovať', maintain: '→ Udržať', reduce: '↓ Redukovať', pause: '⏸ Pozastaviť' }[c.action] || '';
                          const badgeClass =
                            c.action === 'scale' ? 'bg-accent/20 text-accent' :
                            c.action === 'maintain' ? 'bg-primary/20 text-primary' :
                            c.action === 'reduce' ? 'bg-amber-500/20 text-amber-400' : 'bg-destructive/20 text-destructive';
                          return (
                            <tr key={i} className="border-b border-border/50 hover:bg-secondary/30">
                              <td className="py-3 pr-4 font-semibold">{c.name}</td>
                              <td className="py-3 pr-4">
                                <div className="roas-bar-wrap">
                                  <span className="font-semibold min-w-[52px]" style={{ color: barColor }}>{fmt(c.roas, 1)}%</span>
                                  <div className="roas-bar">
                                    <div className="roas-bar-fill" style={{ width: barWidth + '%', background: barColor }} />
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 pr-4">{fmtEur(c.spent)}</td>
                              <td className="py-3 pr-4 font-semibold">{fmtEur(c.rec)}</td>
                              <td className={`py-3 pr-4 font-semibold ${delta >= 0 ? 'text-accent' : 'text-destructive'}`}>
                                {(delta >= 0 ? '+' : '') + fmtEur(delta)}
                              </td>
                              <td className="py-3 pr-4 text-muted-foreground">{fmt(c.effScore, 0)}/100</td>
                              <td className="py-3">
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${badgeClass}`}>{actionLabel}</span>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-border/50">
                  <button type="button" onClick={copyRecommendations} className="px-4 py-2 rounded-lg border border-border bg-secondary text-foreground text-sm font-semibold hover:bg-secondary/80 focus-ring">
                    Kopírovať odporúčania
                  </button>
                  <button type="button" onClick={copyTable} className="px-4 py-2 rounded-lg border border-border bg-secondary text-foreground text-sm font-semibold hover:bg-secondary/80 focus-ring">
                    Kopírovať tabuľku
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
