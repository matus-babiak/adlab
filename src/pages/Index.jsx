import { Link } from 'react-router-dom';

const CARDS = [
  { to: '/roas', title: 'ROAS kalkulačka', icon: 'roas', iconBg: 'bg-primary/15 text-primary', desc: 'Návratnosť investície do reklamy v percentách. Zadajte náklady a príjem — zobrazí sa ROAS, zisk, gauge a odporúčania.' },
  { to: '/optimalizator-rozpoctu', title: 'Optimalizátor rozpočtu', icon: 'pie', iconBg: 'bg-accent/15 text-accent', desc: 'Prerozdelenie budgetu medzi kampane podľa ROAS. Odporúčania: škálovať, udržať, redukovať alebo pozastaviť.' },
  { to: '/ecom', title: 'E-shop kalkulačka', icon: 'ecom', iconBg: 'bg-primary/15 text-primary', desc: 'Finančné metriky, P&L, prognóza rastu a reklama & CAC. LTV, konverzie, export CSV.' },
  { to: '/pacing-scenare', title: 'Pacing a scenáre', icon: 'pacing', iconBg: 'bg-accent/15 text-accent', desc: 'Rozpočet na mesiac: odporúčaný denný výdavok, scenáre zmeny a kroky kedy zrýchliť alebo spomaliť.' },
  { to: '/unava-kreativ', title: 'Únava kreatív', icon: 'creative', iconBg: 'bg-primary/15 text-primary', desc: 'Frekvencia, vývoj CTR/konverzie a reach. Odhad únavy, odporúčaná frekvencia a kedy meniť kreatívu.' },
  { to: '/scenare-skalovania', title: 'Scenáre škálovania', icon: 'chart', iconBg: 'bg-accent/15 text-accent', desc: 'Scale-up: odhad ROAS a príjmu pri +10 % / +20 % / +50 % budgetu, odporúčaný bezpečný krok a ako škálovať.' },
];

const Icon = ({ name }) => {
  const icons = {
    roas: <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>,
    pie: <><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></>,
    ecom: <><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></>,
    pacing: <><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></>,
    creative: <><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></>,
    chart: <><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></>,
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[name] || icons.chart}
    </svg>
  );
};

const Arrow = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);

export default function Index() {
  return (
    <div className="w-full min-h-full" style={{ opacity: 1, visibility: 'visible' }}>
      <section className="pt-16 pb-12 md:pt-24 md:pb-16 lg:pt-32 lg:pb-20" aria-labelledby="pillar-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-secondary/50 text-sm text-muted-foreground mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" aria-hidden="true" />
              Bezplatné nástroje pre PPC a e‑commerce
            </div>
            <h1 id="pillar-heading" className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight mb-6">
              <span className="text-gradient">Kalkulačky</span>
              <br />
              pre PPC
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Vyberte nástroj nižšie a prejdite na kalkulačku. Všetko je zdarma a pripravené na okamžité použitie.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 lg:py-24" aria-label="Výber kalkulačky">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-8">
            Vyberte kalkulačku
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {CARDS.map((card) => (
              <article key={card.to}>
                <Link to={card.to} className="pillar-card-link focus-ring rounded-[1.25rem]">
                  <div className="pillar-card">
                    <div className="flex items-center gap-4 mb-5">
                      <div className={`pillar-card-icon ${card.iconBg}`}>
                        <Icon name={card.icon} />
                      </div>
                      <h3 className="text-xl font-bold leading-tight tracking-tight">{card.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">{card.desc}</p>
                    <span className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                      Otvoriť kalkulačku
                      <Arrow />
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
