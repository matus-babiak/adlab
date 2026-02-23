import { useState } from 'react';

function parseNum(str) {
  if (str == null || str === '') return NaN;
  const s = String(str).replace(/\s/g, '').replace(',', '.');
  return parseFloat(s) || NaN;
}

const STEPS = [
  'Spúšťajte nové kreatívy keď odhad únavy prekročí 40–50 %, alebo keď CTR/CVR klesá 3+ dní po sebe.',
  'Merajte: CTR, CVR, CPA/ROAS po zmene kreatívy; porovnajte nové vs staré aspoň 7 dní.',
  'Rotujte 2–3 variácie namiesto jednej kreatívy.',
  'Pri vysokom reach a frekvencii nad 5 zvážte zúženie audiencie.',
  'V remarketingu držte frekvenciu nižšiu (2–4) a menite kreatívy častejšie.',
];

export default function UnavaKreativ() {
  const [freq, setFreq] = useState('');
  const [ctrNow, setCtrNow] = useState('');
  const [ctrStart, setCtrStart] = useState('');

  const freqNum = parseNum(freq);
  const ctrNowNum = parseNum(ctrNow);
  const ctrStartNum = parseNum(ctrStart);
  const hasFreq = !isNaN(freqNum) && freqNum >= 0;
  let fatiguePct = 0;
  if (!isNaN(ctrStartNum) && !isNaN(ctrNowNum) && ctrStartNum > 0) {
    const drop = (ctrStartNum - ctrNowNum) / ctrStartNum;
    fatiguePct = Math.min(100, Math.round(drop * 100));
  }
  fatiguePct = Math.max(0, fatiguePct);
  let recFreq = 1;
  let recHint = '';
  if (fatiguePct >= 60) {
    recFreq = Math.max(1, Math.round(freqNum * 0.5));
    recHint = 'Výrazne znížiť alebo obmeniť kreatívy';
  } else if (fatiguePct >= 30) {
    recFreq = Math.max(1, Math.round(freqNum * 0.75));
    recHint = 'Mierne znížiť alebo pridať nové variácie';
  } else if (hasFreq) {
    recFreq = Math.min(7, Math.round(freqNum * 1.1));
    recHint = 'Udržať alebo mierne testovať vyššiu frekvenciu';
  }
  let changeAdvice = 'Sledujte trend';
  if (fatiguePct >= 70) changeAdvice = 'Okamžite — vysoká únava';
  else if (fatiguePct >= 50) changeAdvice = 'Do 1–2 týždňov';
  else if (fatiguePct >= 30) changeAdvice = 'Plánujte nové kreatívy';

  const barColor = fatiguePct < 30 ? '#00FF80' : fatiguePct < 60 ? '#FFD700' : '#FF6B4A';

  return (
    <>
      <section className="pt-12 pb-8 md:pt-16 md:pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight mb-2">
            <span className="text-gradient">Únava kreatív</span> a frekvencia
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Frekvencia, vývoj CTR alebo konverzie. Odhad únavy, odporúčaná frekvencia a kedy meniť kreatívu.
          </p>
        </div>
      </section>
      <section className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="glass-card rounded-2xl p-8 md:p-10">
            <h2 className="sr-only">Únava kreatív kalkulačka</h2>
            <div className="mb-8">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6">Vstupné hodnoty</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Priemerná frekvencia</label>
                  <input type="text" inputMode="decimal" placeholder="3.5" value={freq} onChange={(e) => setFreq(e.target.value.replace(',', '.'))} className="w-full px-4 py-3 rounded-xl bg-secondary border border-input text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background" />
                  <span className="text-xs text-muted-foreground">Impresie / reach</span>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Aktuálny CTR (%)</label>
                  <input type="text" inputMode="decimal" placeholder="1.2" value={ctrNow} onChange={(e) => setCtrNow(e.target.value.replace(',', '.'))} className="w-full px-4 py-3 rounded-xl bg-secondary border border-input text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Pôvodný / vrcholový CTR (%)</label>
                  <input type="text" inputMode="decimal" placeholder="2.0" value={ctrStart} onChange={(e) => setCtrStart(e.target.value.replace(',', '.'))} className="w-full px-4 py-3 rounded-xl bg-secondary border border-input text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background" />
                </div>
              </div>
            </div>
            {hasFreq && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="metric-box">
                    <div className="metric-label">Odhad únavy</div>
                    <div className="metric-value">{fatiguePct} %</div>
                    <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden" role="progressbar" aria-valuenow={fatiguePct} aria-valuemin={0} aria-valuemax={100}>
                      <div className="h-full rounded-full transition-all duration-300" style={{ width: `${fatiguePct}%`, background: barColor }} />
                    </div>
                  </div>
                  <div className="metric-box">
                    <div className="metric-label">Odporúčaná frekvencia</div>
                    <div className="metric-value text-accent">{recFreq.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground mt-1">{recHint}</div>
                  </div>
                  <div className="metric-box">
                    <div className="metric-label">Kedy meniť kreatívu</div>
                    <div className="metric-value text-sm font-semibold leading-snug">{changeAdvice}</div>
                  </div>
                </div>
                <div className="pt-4 border-t border-border/50">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Kroky: kedy spustiť nové kreatívy a čo merať</h4>
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
            {!hasFreq && <p className="text-center text-muted-foreground text-sm">Zadajte frekvenciu a CTR (aktuálne vs pôvodné).</p>}
          </div>
        </div>
      </section>
    </>
  );
}
