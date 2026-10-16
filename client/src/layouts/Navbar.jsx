import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { ArrowRight, ArrowUp, ArrowUpRight, ChevronDown, Mail, MessageCircle, Phone, ShoppingBag, UserRound } from 'lucide-react';
import Logo from '../components/ui/Logo.jsx';
import { Drawer } from '../components/ui/Overlay.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useSite } from '../context/SiteContext.jsx';
import { EASE } from '../components/ui/Reveal.jsx';
import { formatPhone, telHref, whatsappHref } from '../utils/format.js';
import { useApi } from '../hooks/useApi.js';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/products', label: 'Products' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

/** Products menu panel: a preview of what is available plus every category. */
function ProductsPanel({ onNavigate }) {
  const products = useApi('/products?featured=1&limit=1');
  const categories = useApi('/categories');
  const p = products.data?.items?.[0];
  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      {p ? (
        <Link to={`/products/${p.slug}`} onClick={onNavigate} className="group col-span-7 flex gap-5 rounded-2xl bg-stone p-4 transition-colors hover:bg-sand">
          <span className="relative size-32 shrink-0 overflow-hidden rounded-xl bg-[linear-gradient(180deg,var(--color-studio-top),var(--color-studio-floor))]">
            {p.images[0] && <img src={p.images[0].url} alt="" className="size-full object-cover transition-transform duration-700 ease-[var(--ease-out-quint)] group-hover:scale-105" />}
          </span>
          <span className="flex flex-col justify-center">
            <span className="text-[0.75rem] font-medium text-signal-ink">Available now</span>
            <span className="mt-1 text-lg font-medium leading-snug">{p.name}</span>
            <span className="mt-1 line-clamp-2 text-sm text-graphite">{p.shortDescription}</span>
            <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium">
              View product <ArrowRight className="btn-icon size-4" aria-hidden />
            </span>
          </span>
        </Link>
      ) : (
        <div className="skeleton col-span-7 h-40 rounded-2xl" aria-hidden />
      )}
      <div className="col-span-5">
        <p className="px-3 text-[0.75rem] text-graphite">Categories</p>
        <ul className="mt-1">
          {categories.data?.items.map((c) => (
            <li key={c.id}>
              <Link to={`/products?category=${c.slug}`} onClick={onNavigate} className="group flex items-center justify-between rounded-lg px-3 py-2 text-[0.9375rem] transition-colors hover:bg-stone">
                <span>{c.name}</span>
                <span className={`shrink-0 whitespace-nowrap pl-3 text-[0.75rem] ${c.status === 'coming_soon' ? 'text-graphite' : 'text-success'}`}>
                  {c.status === 'coming_soon' ? 'Coming soon' : 'Shop'}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link to="/products" onClick={onNavigate} className="hover-line ml-3 mt-3 inline-block text-sm font-medium">
          All products
        </Link>
      </div>
    </div>
  );
}

/** Desktop links: a soft pill glides to the hovered link; Products opens a panel. */
function DesktopLinks() {
  const [hovered, setHovered] = useState(null);
  const [panel, setPanel] = useState(false);
  const closeTimer = useRef(null);
  const { pathname } = useLocation();
  useEffect(() => setPanel(false), [pathname]);

  const openPanel = () => {
    clearTimeout(closeTimer.current);
    setPanel(true);
  };
  const closePanel = () => {
    closeTimer.current = setTimeout(() => setPanel(false), 140);
  };

  return (
    <ul className="hidden items-center gap-0.5 lg:flex" onMouseLeave={() => setHovered(null)}>
      {LINKS.map((l) => {
        const isProducts = l.to === '/products';
        return (
          <li
            key={l.to}
            className="relative"
            onMouseEnter={() => {
              setHovered(l.to);
              if (isProducts) openPanel();
            }}
            onMouseLeave={isProducts ? closePanel : undefined}
            onFocus={isProducts ? openPanel : undefined}
            onBlur={isProducts ? (e) => !e.currentTarget.contains(e.relatedTarget) && closePanel() : undefined}
            onKeyDown={(e) => e.key === 'Escape' && setPanel(false)}
          >
            {hovered === l.to && (
              <motion.span layoutId="nav-hover" className="absolute inset-0 rounded-full bg-ink/[0.06]" transition={{ type: 'spring', stiffness: 420, damping: 34 }} aria-hidden />
            )}
            <NavLink
              to={l.to}
              end={l.end}
              aria-haspopup={isProducts ? 'true' : undefined}
              aria-expanded={isProducts ? panel : undefined}
              className={({ isActive }) =>
                `relative inline-flex items-center gap-1 rounded-full px-4 py-2 text-[0.9375rem] font-medium transition-colors ${isActive ? 'text-ink' : 'text-ink/60 hover:text-ink'}`
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  {isProducts && <ChevronDown className={`size-3.5 transition-transform duration-300 ${panel ? 'rotate-180' : ''}`} aria-hidden />}
                  {isActive && (
                    <motion.span layoutId="nav-active" className="absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-signal" transition={{ type: 'spring', stiffness: 380, damping: 30 }} aria-hidden />
                  )}
                </>
              )}
            </NavLink>
            {isProducts && (
              <AnimatePresence>
                {panel && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98, transition: { duration: 0.15 } }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="absolute left-1/2 top-full z-50 w-[42rem] origin-top -translate-x-1/2 pt-4"
                    onMouseEnter={openPanel}
                    onMouseLeave={closePanel}
                  >
                    <div className="overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white/95 shadow-[var(--shadow-deep)] backdrop-blur-xl">
                      <ProductsPanel onNavigate={() => setPanel(false)} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** Two-line burger that morphs into a cross. */
function Burger({ open }) {
  return (
    <span className="relative block h-3 w-5" aria-hidden>
      <motion.span className="absolute left-0 top-0 h-[1.5px] w-5 rounded-full bg-current" animate={open ? { y: 5.25, rotate: 45 } : { y: 0, rotate: 0 }} transition={{ duration: 0.3, ease: EASE }} />
      <motion.span className="absolute bottom-0 left-0 h-[1.5px] w-5 rounded-full bg-current" animate={open ? { y: -5.25, rotate: -45, width: 20 } : { y: 0, rotate: 0, width: 14 }} transition={{ duration: 0.3, ease: EASE }} />
    </span>
  );
}

function CartButton() {
  const { count, openDrawer } = useCart();
  return (
    <button
      type="button"
      onClick={openDrawer}
      className="group relative grid size-11 place-items-center rounded-full bg-ink text-white transition-[background-color,transform] duration-300 hover:bg-ink-2 active:scale-95"
      aria-label={`Cart, ${count} item${count === 1 ? '' : 's'}`}
    >
      <ShoppingBag className="size-[1.15rem] transition-transform duration-300 group-hover:-translate-y-0.5" strokeWidth={1.75} />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 26 }}
            className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-signal px-1 text-[0.6875rem] font-semibold leading-5 text-ink ring-2 ring-white"
            aria-hidden
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

function AccountButton() {
  const { customer } = useAuth();
  const initial = customer?.name?.trim()?.[0]?.toUpperCase();
  return (
    <Link
      to={customer ? '/account' : '/login'}
      className="grid size-11 place-items-center rounded-full border border-black/[0.08] bg-white/60 text-ink transition-colors hover:border-ink/30 hover:bg-white"
      aria-label={customer ? `Your account (${customer.name})` : 'Sign in'}
      title={customer ? 'Your account' : 'Sign in'}
    >
      {initial ? <span className="text-sm font-semibold">{initial}</span> : <UserRound className="size-[1.15rem]" strokeWidth={1.75} />}
    </Link>
  );
}

/** Full-height mobile menu with large staggered links, a product card and contact details. */
function MobileMenu({ open, onClose }) {
  const { s } = useSite();
  const { customer } = useAuth();
  const products = useApi(open ? '/products?featured=1&limit=1' : null);
  const p = products.data?.items?.[0];
  const item = (i) => ({ initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.08 + i * 0.05, duration: 0.5, ease: EASE } });

  return (
    <Drawer open={open} onClose={onClose} title="Menu" side="right" width="max-w-full sm:max-w-md">
      <nav aria-label="Mobile" className="flex min-h-full flex-col px-6 pb-8 pt-4">
        <ul className="space-y-1">
          {LINKS.map((l, i) => (
            <motion.li key={l.to} {...item(i)}>
              <NavLink
                to={l.to}
                end={l.end}
                onClick={onClose}
                className={({ isActive }) => `group flex items-center justify-between border-b border-hairline py-4 text-[2rem] font-light tracking-tight ${isActive ? 'text-ink' : 'text-ink/55'}`}
                style={{ fontFamily: 'var(--heading-font, var(--font-sans))' }}
              >
                {({ isActive }) => (
                  <>
                    <span className="flex items-center gap-3">
                      {isActive && <span className="size-2 rounded-full bg-signal" aria-hidden />}
                      {l.label}
                    </span>
                    <ArrowUpRight className="size-5 opacity-40 transition-all duration-300 group-hover:rotate-45 group-hover:opacity-100" aria-hidden />
                  </>
                )}
              </NavLink>
            </motion.li>
          ))}
        </ul>

        {p && (
          <motion.div {...item(LINKS.length)}>
            <Link to={`/products/${p.slug}`} onClick={onClose} className="mt-8 flex items-center gap-4 rounded-2xl bg-stone p-3">
              <span className="size-20 shrink-0 overflow-hidden rounded-xl bg-[linear-gradient(180deg,var(--color-studio-top),var(--color-studio-floor))]">
                {p.images[0] && <img src={p.images[0].url} alt="" className="size-full object-cover" />}
              </span>
              <span>
                <span className="block text-[0.75rem] font-medium text-signal-ink">Available now</span>
                <span className="mt-0.5 block font-medium leading-snug">{p.name}</span>
                <span className="mt-1 inline-flex items-center gap-1 text-sm text-graphite">
                  View product <ArrowRight className="size-3.5" aria-hidden />
                </span>
              </span>
            </Link>
          </motion.div>
        )}

        <motion.div {...item(LINKS.length + 1)} className="mt-6 grid grid-cols-2 gap-3">
          <Link to={customer ? '/account' : '/login'} onClick={onClose} className="btn btn-secondary">
            <UserRound className="size-4" aria-hidden /> {customer ? 'Account' : 'Sign in'}
          </Link>
          <Link to="/products" onClick={onClose} className="btn btn-primary">
            Shop now
          </Link>
        </motion.div>

        <motion.div {...item(LINKS.length + 2)} className="mt-auto space-y-3 pt-10 text-sm text-graphite">
          <a href={telHref(s.business_phone)} className="flex items-center gap-3 hover:text-ink">
            <Phone className="size-4" aria-hidden /> {formatPhone(s.business_phone)}
          </a>
          {s.business_whatsapp && (
            <a href={whatsappHref(s.business_whatsapp)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-ink">
              <MessageCircle className="size-4" aria-hidden /> WhatsApp us
            </a>
          )}
          {s.business_email && (
            <a href={`mailto:${s.business_email}`} className="flex items-center gap-3 hover:text-ink">
              <Mail className="size-4" aria-hidden /> {s.business_email}
            </a>
          )}
        </motion.div>
      </nav>
    </Drawer>
  );
}

export default function Navbar({ hasAnnouncement = false }) {
  const { pathname } = useLocation();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // The bar stays pinned to the top; it only firms up its background once the page scrolls.
  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 16);
    setShowTop(y > 900);
  });
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      {/* Reading progress along the very top of the window. */}
      <motion.div aria-hidden style={{ scaleX: progress }} className={`fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-signal transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'}`} />

      <header
        className={`fixed inset-x-0 ${hasAnnouncement ? 'top-9' : 'top-0'} z-50 w-full border-b transition-[background-color,box-shadow,border-color] duration-500 ease-[var(--ease-out-quint)] ${
          scrolled
            ? 'border-black/[0.08] bg-white/95 shadow-[0_4px_18px_-12px_rgb(23_23_23/0.16)] backdrop-blur-xl'
            : 'border-black/[0.06] bg-white/95 backdrop-blur-xl'
        }`}
      >
        <nav aria-label="Main" className="shell flex h-16 items-center justify-between gap-3">
          <Logo className="h-6 w-auto sm:h-7" />

          <DesktopLinks />

          <div className="flex items-center gap-2">
            <Link to="/products" className="btn btn-primary group hidden !min-h-11 !rounded-full !px-5 lg:inline-flex">
              Shop now
              <ArrowRight className="btn-icon size-4" aria-hidden />
            </Link>
            <span className="hidden sm:block">
              <AccountButton />
            </span>
            <CartButton />
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="grid size-11 place-items-center rounded-full border border-black/[0.08] bg-white/60 text-ink transition-colors hover:bg-white lg:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <Burger open={menuOpen} />
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.9 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="back-to-top group fixed bottom-5 right-5 z-40 grid size-12 place-items-center rounded-full bg-ink text-white shadow-[var(--shadow-float)] ring-1 ring-white/25 transition-colors hover:bg-signal hover:text-ink sm:bottom-8 sm:right-8"
            aria-label="Back to top"
          >
            <ArrowUp className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
