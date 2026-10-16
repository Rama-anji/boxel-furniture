import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Hammer, Home, KeyRound, ShieldCheck } from 'lucide-react';
import { EASE } from '../ui/Reveal.jsx';

const DEFAULT = {
  headline: 'Your space. Your peace of mind.',
  subheadline: 'Thoughtfully designed security and storage for modern Indian living.',
  cta_text: 'Explore the Parcel Drop Box',
  cta_url: '/products/parcel-drop-box',
  secondary_cta_text: 'Discover boxel',
  secondary_cta_url: '/about',
  desktop_image_url: '/images/parcel-drop-box-front.jpeg',
  mobile_image_url: '/images/parcel-drop-box-front.jpeg',
  image_alt: 'The boxel Parcel Drop Box, a white all-metal cabinet with a drop opening and a locking front door',
};

const OPEN_VIEW = {
  src: '/images/parcel-drop-box-open.jpeg',
  alt: 'The Parcel Drop Box with its front door open, showing the drop chute and storage compartment',
};

// Verified facts only.
const FACTS = [
  { icon: Home, value: '3–4 homes', label: 'served by one unit' },
  { icon: ShieldCheck, value: 'All-metal', label: 'powder-coated build' },
  { icon: KeyRound, value: 'Keyless', label: 'number lock' },
  { icon: Hammer, value: 'Made to order', label: 'delivered assembled' },
];

// Callout anchor points on the front photo (percent of the 1309 × 1202 image).
const CALLOUTS = [
  { x: 57.3, y: 17.5, label: 'Drop opening', side: 'right', delay: 1.5 },
  { x: 46.8, y: 46.3, label: 'Keyless number lock', side: 'right', delay: 1.7 },
  { x: 34, y: 62, label: 'All-metal body', side: 'left', delay: 1.9 },
];

function SmartLink({ to, className, children }) {
  if (/^https?:\/\//.test(to)) {
    return (
      <a href={to} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}

const lines = (text) => text.match(/[^.!?]+[.!?]?/g)?.map((s) => s.trim()).filter(Boolean) || [text];

/** A dot on the product with a drawn leader line and a frosted label. */
function Callout({ x, y, label, side, delay, visible }) {
  const right = side === 'right';
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none absolute z-10 hidden items-center md:flex"
          style={{ left: `${x}%`, top: `${y}%`, flexDirection: right ? 'row' : 'row-reverse', translate: right ? '-6px -50%' : 'calc(-100% + 6px) -50%' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ delay, duration: 0.4 }}
        >
          <span className="relative grid size-3 place-items-center">
            <span className="hotspot-ring absolute inset-0 rounded-full bg-signal" style={{ animationDelay: `${delay + 0.3}s` }} />
            <span className="relative size-3 rounded-full border-2 border-white bg-signal shadow" />
          </span>
          <motion.span
            className={`h-px w-14 bg-ink/40 lg:w-20 ${right ? 'origin-left' : 'origin-right'}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: delay + 0.15, duration: 0.5, ease: EASE }}
          />
          <motion.span
            className="whitespace-nowrap rounded-full border border-white/70 bg-white/75 px-3.5 py-1.5 text-[0.8125rem] font-medium text-ink shadow-[0_8px_24px_-12px_rgb(23_23_23/0.4)] backdrop-blur-md"
            initial={{ opacity: 0, x: right ? -8 : 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.45, duration: 0.5, ease: EASE }}
          >
            {label}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Hero({ banner }) {
  const b = { ...DEFAULT, ...Object.fromEntries(Object.entries(banner || {}).filter(([, v]) => v)) };
  const reduce = useReducedMotion();
  const section = useRef(null);
  const isDefaultPhoto = b.desktop_image_url === DEFAULT.desktop_image_url;
  const [view, setView] = useState(0); // 0 = closed, 1 = open

  // Scroll depth: copy drifts up, product eases back, tiles move faster for parallax.
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -90]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.6], [1, reduce ? 1 : 0.2]);
  const productY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 60]);
  const productScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.95]);
  const tilesY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -160]);

  // Pointer depth (mouse only): product tilts slightly, tiles drift the opposite way.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotY = useSpring(useTransform(px, [-0.5, 0.5], [-4, 4]), { stiffness: 110, damping: 20 });
  const rotX = useSpring(useTransform(py, [-0.5, 0.5], [2.5, -2.5]), { stiffness: 110, damping: 20 });
  const tilesX = useSpring(useTransform(px, [-0.5, 0.5], [18, -18]), { stiffness: 80, damping: 20 });
  const onMove = (e) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const resetPointer = () => {
    px.set(0);
    py.set(0);
  };

  const feather = '[mask-composite:intersect] [-webkit-mask-composite:source-in] [mask-image:linear-gradient(to_right,transparent,black_18%,black_86%,transparent),linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]';

  return (
    <section
      ref={section}
      onPointerMove={onMove}
      onPointerLeave={resetPointer}
      aria-labelledby="hero-title"
      className="grain relative isolate overflow-hidden bg-[linear-gradient(180deg,#b2b2b4_0%,#c3c2c4_45%,#d6d5d7_75%,#e1dfe2_100%)]"
    >
      <div className="relative flex flex-col lg:block lg:min-h-[min(100svh,58rem)]">
        {/* Logo-mark tiles drifting behind the product. */}
        <motion.div aria-hidden style={{ y: tilesY, x: tilesX }} className="pointer-events-none absolute left-[40%] top-[7%] z-0 hidden h-[30%] w-[12%] lg:block">
          {[
            { l: '0%', t: '0%', c: 'bg-white/45' },
            { l: '0%', t: '56%', c: 'bg-white/35' },
            { l: '52%', t: '34%', c: 'bg-signal/90 shadow-[0_30px_80px_-10px_rgb(241_126_0/0.55)]' },
          ].map((t, i) => (
            <motion.span
              key={i}
              className={`absolute h-[46%] w-[44%] ${t.c}`}
              style={{ left: t.l, top: t.t, skewY: '-24deg' }}
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.3 + i * 0.12, ease: EASE }}
            />
          ))}
        </motion.div>

        {/* Product stage */}
        <div className="relative z-[1] order-2 mt-2 lg:absolute lg:bottom-[13%] lg:right-[2%] lg:top-[11%] lg:mt-0" style={{ perspective: '1800px' }}>
          <motion.div
            style={{ y: productY, scale: productScale, rotateX: rotX, rotateY: rotY }}
            className="relative mx-auto aspect-[1309/1202] w-full lg:h-full lg:w-auto"
            initial={{ opacity: 0, y: 60, scale: 1.04 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.15, ease: EASE }}
          >
            <img
              src={b.desktop_image_url}
              alt={view === 0 ? b.image_alt : ''}
              width="1309"
              height="1202"
              fetchPriority="high"
              decoding="async"
              className={`absolute inset-0 size-full object-cover ${feather}`}
            />
            {isDefaultPhoto && (
              <img
                src={OPEN_VIEW.src}
                alt={view === 1 ? OPEN_VIEW.alt : ''}
                aria-hidden={view !== 1}
                width="1234"
                height="1274"
                decoding="async"
                className={`absolute inset-0 size-full object-cover object-[50%_55%] transition-opacity duration-700 ease-[var(--ease-out-quint)] ${feather} ${view === 1 ? 'opacity-100' : 'opacity-0'}`}
              />
            )}
            {/* Studio light: a soft highlight raking across the product. */}
            <span aria-hidden className={`pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_62%_30%,rgb(255_255_255/0.38),transparent_55%)] mix-blend-soft-light ${feather}`} />
            {isDefaultPhoto && CALLOUTS.map((c) => <Callout key={c.label} {...c} visible={view === 0} />)}
          </motion.div>
        </div>

        {/* Copy */}
        <motion.div style={{ y: copyY, opacity: copyOpacity }} className="shell relative order-1 z-[2] pt-[108px] sm:pt-[120px] lg:relative lg:flex lg:min-h-[min(100svh,58rem)] lg:flex-col lg:justify-center lg:pb-40 lg:pt-28">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.35, ease: EASE }}>
            <Link
              to={b.cta_url || '/products'}
              className="group inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/55 py-1.5 pl-1.5 pr-3.5 text-[0.8125rem] font-medium text-ink shadow-[0_8px_24px_-14px_rgb(23_23_23/0.4)] backdrop-blur-md transition-colors hover:bg-white/80"
            >
              <span className="rounded-full bg-ink px-2.5 py-0.5 text-[0.6875rem] font-semibold text-white">New</span>
              boxel Parcel Drop Box — available now
              <ArrowRight className="btn-icon size-3.5" aria-hidden />
            </Link>
          </motion.div>

          <h1
            id="hero-title"
            className="mt-6 text-[clamp(2.25rem,1rem+3.3vw,4rem)] leading-[1.04] tracking-[-0.035em] text-ink lg:mt-8"
            style={{ fontFamily: 'var(--heading-font, var(--font-sans))', fontWeight: 'var(--heading-weight, 500)' }}
          >
            {lines(b.headline).map((line, i) => (
              <span key={i} className="block overflow-hidden pb-[0.1em] lg:whitespace-nowrap">
                {/* First line in deep ink, following lines in the flowing orange. */}
                <motion.span className={`block ${i === 0 ? 'h-main' : 'h-soft'}`} initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1.1, delay: 0.5 + i * 0.13, ease: EASE }}>
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="mt-6 max-w-[34ch] text-lead text-ink/70"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85, ease: EASE }}
          >
            {b.subheadline}
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: EASE }}
          >
            {b.cta_text && b.cta_url && (
              <SmartLink to={b.cta_url} className="btn btn-primary group !min-h-[3.25rem] !rounded-full !px-7">
                {b.cta_text}
                <ArrowRight className="btn-icon size-4" aria-hidden />
              </SmartLink>
            )}
            {b.secondary_cta_text && b.secondary_cta_url && (
              <SmartLink
                to={b.secondary_cta_url}
                className="btn !min-h-[3.25rem] !rounded-full border border-white/70 bg-white/45 !px-7 text-ink backdrop-blur-md transition-colors hover:bg-white/80"
              >
                {b.secondary_cta_text}
              </SmartLink>
            )}
          </motion.div>
        </motion.div>

        {/* Spec dock */}
        <motion.div
          className="relative order-3 z-[3] px-4 pb-6 pt-2 sm:px-6 lg:absolute lg:inset-x-0 lg:bottom-8 lg:px-0 lg:pb-0 lg:pt-0"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.15, ease: EASE }}
        >
          <div className="mx-auto flex max-w-[1240px] flex-col gap-3 rounded-[1.5rem] border border-white/60 bg-white/55 p-3 shadow-[0_30px_60px_-30px_rgb(23_23_23/0.45)] backdrop-blur-xl lg:flex-row lg:items-center">
            <ul className="grid flex-1 grid-cols-2 gap-2 lg:grid-cols-4">
              {FACTS.map(({ icon: Icon, value, label }) => (
                <li key={value} className="group flex items-center gap-3 rounded-2xl border border-black/[0.16] bg-white/55 px-3 py-2.5 shadow-[0_1px_2px_rgb(23_23_23/0.04)] transition-[background-color,border-color,box-shadow] duration-300 hover:border-signal/40 hover:bg-white/85 hover:shadow-[0_8px_20px_-12px_rgb(23_23_23/0.3)]">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-signal-ink shadow-sm transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:-rotate-6">
                    <Icon className="size-[1.1rem]" strokeWidth={1.7} aria-hidden />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-[0.9375rem] font-semibold text-ink">{value}</span>
                    <span className="block text-[0.75rem] text-ink/60">{label}</span>
                  </span>
                </li>
              ))}
            </ul>
            {isDefaultPhoto && (
              <div className="flex shrink-0 items-center gap-1 self-center rounded-full bg-white/70 p-1" role="group" aria-label="Product view">
                {['Closed', 'Open'].map((v, i) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setView(i)}
                    aria-pressed={view === i}
                    className="relative flex items-center gap-2 rounded-full py-1 pl-1 pr-4 text-[0.8125rem] font-medium"
                  >
                    {view === i && <motion.span layoutId="hero-view" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 420, damping: 34 }} aria-hidden />}
                    <img src={i === 0 ? b.desktop_image_url : OPEN_VIEW.src} alt="" className="relative size-8 rounded-full object-cover ring-2 ring-white" />
                    <span className={`relative transition-colors ${view === i ? 'text-white' : 'text-ink'}`}>{v}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
