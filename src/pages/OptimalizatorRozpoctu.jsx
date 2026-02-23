import { useState } from 'react';

function parseNum(str) {
  if (str == null || str === '') return NaN;
  const s = String(str).replace(/\s/g, '').replace(',', '.');
  return parseFloat(s) || NaN;
}

export default function OptimalizatorRozpoctu() {
  const [totalBudget, setTotalBudget] = useState('');
  const [breakevenRoas, setBreakevenRoas] = useState('400');
  const [targetRoas, setTargetRoas] = useState('800');
  const [campaigns, setCampaigns] = useState([
    { name: 'Kampaň 1', spent: '', revenue: '' },
    { name: 'Kampaň 2', spent: '', revenue: '' },
  ]);
  const [results, setResults] = useState(null);

  const addCampaign = () => {
    if (campaigns.length >= 10) return;
    setCampaigns([...campaigns, { name: `Kampaň ${campaigns.length + 1}`, spent: '', revenue: '' }]);
  };
  const updateCampaign = (i, field, value) => {
    const next = [...campaigns];
    next[i] = { ...next[i], [field]: value };
    setCampaigns(next);
  };
  const removeCampaign = (i) => {
    if (campaigns.length <= 2) return;
    setCampaigns(campaigns.filter((_, j) => j !== i));
  };

  const calculate = () => {
    const budget = parseNum(totalBudget);
    const be = parseNum(breakevenRoas) || 400;
    const target = parseNum(targetRoas) || 800;
    const list = campaigns.map((c) => ({
      name: c.name,
      spent: parseNum(c.spent) || 0,
      revenue: parseNum(c.revenue) || 0,
    }));
    const totalSpent = list.reduce((s, c) => s + c.spent, 0);
    const totalRevenue = list.reduce((s, c) => s + c.revenue, 0);
    const analyzed = list.map((c) => {
      const roas = c.spent > 0 ? (c.revenue / c.spent) * 100 : 0;
      let action = '—';
      if (roas >= target) action = 'Škálovať';
      else if (roas >= be) action = 'Udržať';
      else if (roas >= be * 0.7) action = 'Redukovať';
      else action = 'Pozastaviť';
      return { ...c, roas, action };
    });
    setResults({
      totalSpent,
      totalRevenue,
      totalRoas: totalSpent > 0 ? (totalRevenue / totalSpent) * 100 : 0,
      budget,
      analyzed,
    });
  };

  return (
    <>
      <section className="pt-12 pb-8 md:pt-16 md:pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight mb-2">
            <span className="text-gradient">Optimalizátor</span> rozpočtu kampaní
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Prerozdelenie budgetu medzi kampane podľa ROAS. Odporúčania: škálovať, udržať, redukovať alebo pozastaviť.
          </p>
        </div>
      </section>
      <section className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="glass-card rounded-2xl p-8 md:p-10">
            <div className="mb-8">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6">Globálne nastavenia</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Celkový mesačný rozpočet (€)</label>
                  <input type="text" inputMode="decimal" placeholder="5000" value={totalBudget} onChange={(e) => setTotalBudget(e.target.value.replace(',', '.'))} className="w-full px-4 py-3 rounded-xl bg-secondary border border-input text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Breakeven ROAS (%)</label>
                  <input type="text" inputMode="decimal" placeholder="400" value={breakevenRoas} onChange={(e) => setBreakevenRoas(e.target.value.replace(',', '.'))} className="w-full px-4 py-3 rounded-xl bg-secondary border border-input text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Cieľový ROAS (%)</label>
                  <input type="text" inputMode="decimal" placeholder="800" value={targetRoas} onChange={(e) => setTargetRoas(e.target.value.replace(',', '.'))} className="w-full px-4 py-3 rounded-xl bg-secondary border border-input text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background" />
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Kampane</h3>
              <div className="space-y-4">
                {campaigns.map((c, i) => (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end p-4 rounded-xl bg-secondary/30 border border-border/50">
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-muted-foreground">Názov</label>
                      <input type="text" placeholder="Názov kampane" value={c.name} onChange={(e) => updateCampaign(i, 'name', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-secondary border border-input text-foreground text-sm focus:ring-2 focus:ring-ring" />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-muted-foreground">Minutý budget (€)</label>
                      <input type="text" inputMode="decimal" placeholder="0" value={c.spent} onChange={(e) => updateCampaign(i, 'spent', e.target.value.replace(',', '.'))} className="w-full px-3 py-2 rounded-lg bg-secondary border border-input text-foreground text-sm focus:ring-2 focus:ring-ring" />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-muted-foreground">Príjem (€)</label>
                      <input type="text" inputMode="decimal" placeholder="0" value={c.revenue} onChange={(e) => updateCampaign(i, 'revenue', e.target.value.replace(',', '.'))} className="w-full px-3 py-2 rounded-lg bg-secondary border border-input text-foreground text-sm focus:ring-2 focus:ring-ring" />
                    </div>
                    <button type="button" onClick={() => removeCampaign(i)} disabled={campaigns.length <= 2} className="px-3 py-2 rounded-lg border border-destructive/50 text-destructive text-sm font-semibold hover:bg-destructive/10 disabled:opacity-40 disabled:cursor-not-allowed" title="Odstrániť">×</button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addCampaign} className="mt-4 px-4 py-2 rounded-lg border border-primary/50 text-primary text-sm font-semibold hover:bg-primary/10">+ Pridať kampaň</button>
            </div>
            <button type="button" onClick={calculate} className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 focus-ring">
              Analyzovať
            </button>
            {results && (
              <div className="mt-8 pt-8 border-t border-border/50">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Výsledky</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="metric-box">
                    <div className="metric-label">Celkový výdavok</div>
                    <div className="metric-value">{results.totalSpent.toLocaleString('sk-SK', { minimumFractionDigits: 0 })} €</div>
                  </div>
                  <div className="metric-box">
                    <div className="metric-label">Celkový príjem</div>
                    <div className="metric-value text-accent">{results.totalRevenue.toLocaleString('sk-SK', { minimumFractionDigits: 0 })} €</div>
                  </div>
                  <div className="metric-box">
                    <div className="metric-label">Priemerný ROAS</div>
                    <div className="metric-value">{results.totalRoas.toFixed(0)} %</div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="py-2 pr-4 text-muted-foreground font-semibold">Kampaň</th>
                        <th className="py-2 pr-4 text-muted-foreground font-semibold">ROAS (%)</th>
                        <th className="py-2 text-muted-foreground font-semibold">Akcia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.analyzed.map((c, i) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="py-3 pr-4">{c.name}</td>
                          <td className="py-3 pr-4">{c.roas.toFixed(0)} %</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              c.action === 'Škálovať' ? 'bg-accent/20 text-accent' :
                              c.action === 'Udržať' ? 'bg-primary/20 text-primary' :
                              c.action === 'Redukovať' ? 'bg-amber-500/20 text-amber-400' : 'bg-destructive/20 text-destructive'
                            }`}>{c.action}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
