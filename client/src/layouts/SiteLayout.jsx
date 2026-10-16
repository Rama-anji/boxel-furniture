import { Suspense, useEffect } from 'react';
import { Link, useLocation, useOutlet } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import CartDrawer from '../components/CartDrawer.jsx';
import { PageLoader } from '../components/ui/States.jsx';
import { useSite } from '../context/SiteContext.jsx';
import { EASE } from '../components/ui/Reveal.jsx';

function AnnouncementBar() {
  const { s } = useSite();
  if (!s.announcement_enabled || !s.announcement_text) return null;
  const external = /^https?:\/\//.test(s.announcement_link || '');
  const inner = (
    <span className="announcement-track">
      {[0, 1].map((copy) => (
        <span key={copy} className="announcement-copy" aria-hidden={copy === 1 ? true : undefined}>
          {[0, 1, 2, 3].map((item) => (
            <span key={item} className="announcement-message" aria-hidden={item > 0 ? true : undefined}>
              <span className="size-1 rounded-full bg-signal/70" aria-hidden />
              {s.announcement_text}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
  return (
    <div className="announcement-bar fixed inset-x-0 top-0 z-50 h-9 overflow-hidden border-b border-black/[0.06] bg-[#f7f5f1] text-ink/65">
      <div className="text-[0.6875rem] font-medium tracking-[0.06em] sm:text-xs">
        {s.announcement_link ? (
          external ? (
            <a href={s.announcement_link} className="underline-offset-4 hover:underline" target="_blank" rel="noopener noreferrer">
              {inner}
            </a>
          ) : (
            <Link to={s.announcement_link} className="underline-offset-4 hover:underline">
              {inner}
            </Link>
          )
        ) : (
          inner
        )}
      </div>
    </div>
  );
}

export default function SiteLayout() {
  const { s } = useSite();
  const hasAnnouncement = Boolean(s.announcement_enabled && s.announcement_text);
  const location = useLocation();
  const outlet = useOutlet();

  // New page → start at the top (unless navigating to an in-page anchor).
  useEffect(() => {
    if (!location.hash) window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname, location.hash]);

  return (
    <>
      <a href="#main" className="sr-only z-[100] rounded bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <AnnouncementBar />
      <Navbar hasAnnouncement={hasAnnouncement} />
      <div aria-hidden="true" className={hasAnnouncement ? 'h-[101px]' : 'h-[65px]'} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          id="main"
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="min-h-[60vh]"
        >
          <Suspense fallback={<PageLoader />}>
            {outlet}
          </Suspense>
        </motion.main>
      </AnimatePresence>
      <Footer />
      <CartDrawer />
    </>
  );
}
