import { Outlet, Link, useLocation } from 'react-router-dom';

const ROUTE_TITLES = {
  '/roas': 'ROAS',
  '/optimalizator-rozpoctu': 'Optimalizátor rozpočtu',
  '/ecom': 'E-shop',
  '/pacing-scenare': 'Pacing',
  '/unava-kreativ': 'Únava kreatív',
  '/scenare-skalovania': 'Škálovanie',
};

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <header className="bg-background border-b border-border/30 sticky top-0 z-40">
        <div className={`max-w-6xl mx-auto flex flex-row items-center justify-between gap-4 ${isHome ? 'py-4 px-4 sm:py-5 sm:px-6 md:py-6' : 'py-3 px-3 sm:py-5 sm:px-6 md:py-6'}`}>
          {isHome ? (
            <>
            <Link to="/" className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-primary/10 ring-2 ring-primary/50 shrink-0 flex items-center justify-center text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-foreground leading-tight truncate text-base sm:text-lg">PPC Analytics</div>
              <div className="text-xs sm:text-sm text-muted-foreground truncate">Kalkulačky & nástroje</div>
            </div>
          </Link>
          <a href="https://cal.com/babiak/meeting" target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 md:py-3 rounded-full bg-white text-black font-bold text-sm md:text-base hover:bg-white/90 transition-colors border border-white/20 whitespace-nowrap focus-ring">
            Chcem konzultáciu
          </a>
          </>
          ) : (
            <>
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-medium focus-ring rounded-md px-2 py-1 -ml-2">
              <span aria-hidden="true">←</span> Všetky kalkulačky
            </Link>
            <Link to="/" className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 ring-2 ring-primary/50 shrink-0 flex items-center justify-center text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
              </div>
              <div className="min-w-0 hidden sm:block">
                <div className="font-bold text-foreground leading-tight truncate text-sm">PPC Analytics</div>
                <div className="text-xs text-muted-foreground truncate">{ROUTE_TITLES[location.pathname] || 'Kalkulačka'}</div>
              </div>
            </Link>
            </>
          )}
        </div>
      </header>

      <main className="flex-1 w-full min-h-0">
        <div className="w-full min-h-full">
          <Outlet />
        </div>
      </main>

      {isHome ? (
      <footer className="py-16 border-t border-border/30 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-primary/10 ring-2 ring-primary/50 flex items-center justify-center text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                </div>
                <div>
                  <div className="font-bold text-foreground">PPC Analytics</div>
                  <div className="text-sm text-muted-foreground">Kalkulačky</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Profesionálne nástroje pre analýzu a optimalizáciu PPC kampaní.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Nástroje</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/roas" className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">ROAS kalkulačka</Link></li>
                <li><Link to="/optimalizator-rozpoctu" className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">Optimalizátor rozpočtu</Link></li>
                <li><Link to="/ecom" className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">E-shop kalkulačka</Link></li>
                <li><Link to="/pacing-scenare" className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">Pacing a scenáre</Link></li>
                <li><Link to="/unava-kreativ" className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">Únava kreatív a frekvencia</Link></li>
                <li><Link to="/scenare-skalovania" className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">Scenáre škálovania</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Kontakt</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">Konzultácia</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">Podpora</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/30 mt-12 pt-8 text-center">
            <p className="text-sm text-muted-foreground">© 2026 PPC Analytics. Všetky práva vyhradené.</p>
          </div>
        </div>
      </footer>
      ) : (
      <footer className="py-12 border-t border-border/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">← Všetky kalkulačky</Link>
            <p className="text-sm text-muted-foreground">© 2026 PPC Analytics</p>
          </div>
        </div>
      </footer>
      )}
    </div>
  );
}
