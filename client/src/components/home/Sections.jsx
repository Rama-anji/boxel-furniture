import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Hammer, Home, MapPin, MessageCircle, Navigation, Package, PackageCheck, Phone, RotateCcw, Shirt, ShoppingBag, ShoppingBasket, Truck, Video } from 'lucide-react';
import Reveal, { EASE } from '../ui/Reveal.jsx';
import SocialIcon, { SOCIAL_LABELS } from '../ui/SocialIcon.jsx';
import { useSite } from '../../context/SiteContext.jsx';
import { formatPhone, shippingNote, telHref } from '../../utils/format.js';
import { Kicker, TitleText } from '../ui/Heading.jsx';

export function SectionHeading({ id, title, intro, kicker, className = '', align = 'left' }) {
  return (
    <Reveal className={`${align === 'center' ? 'mx-auto text-center' : ''} max-w-3xl ${className}`}>
      {kicker && <Kicker className="mb-4">{kicker}</Kicker>}
      <h2 id={id} className="heading-premium">
        <TitleText text={title} />
      </h2>
      {intro && <p className="mt-4 max-w-[58ch] text-lead text-graphite">{intro}</p>}
    </Reveal>
  );
}

/* E — product showcase: interactive anatomy on a warm espresso stage. */
const USES = [
  { icon: Package, label: 'Parcels' },
  { icon: ShoppingBasket, label: 'Groceries' },
  { icon: Shirt, label: 'Laundry' },
  { icon: RotateCcw, label: 'Returns' },
];

// Points on the open-door photograph (percent of the 1234 × 1274 image). Only verified attributes.
const ANATOMY = [
  { x: 52, y: 37, title: 'Drop opening', body: 'Deliveries go in from the top — no key needed to drop a parcel in.' },
  { x: 85, y: 54, title: 'Keyless number lock', body: 'The front door opens with a number combination. Nothing to carry or lose.' },
  { x: 50, y: 77, title: 'Storage compartment', body: 'Parcels, groceries, laundry and returns wait here until you collect them.' },
  { x: 24, y: 46, title: 'All-metal, powder-coated', body: 'Built in metal with a durable powder-coat finish, delivered fully assembled.' },
];
const CYCLE_MS = 3800;

export function ProductIntro({ product }) {
  const { s } = useSite();
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { amount: 0.3 });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const slug = product?.slug || 'parcel-drop-box';
  const autoplay = !reduce && !paused && inView;

  // Walks through the four parts on its own until the visitor picks one.
  useEffect(() => {
    if (!autoplay) return undefined;
    const t = setTimeout(() => setActive((a) => (a + 1) % ANATOMY.length), CYCLE_MS);
    return () => clearTimeout(t);
  }, [active, autoplay]);

  const pick = (i) => {
    setPaused(true);
    setActive(i);
  };
  const point = ANATOMY[active];

  return (
    <section
      ref={ref}
      aria-labelledby="intro-title"
      className="grain grain-dark relative overflow-hidden bg-[linear-gradient(180deg,#121211_0%,#16130f_45%,#1c1712_100%)] py-20 text-white sm:py-28 lg:py-32"
    >
      {/* Warm light and a faint blueprint grid. */}
      <div aria-hidden className="pointer-events-none absolute left-[2%] top-[28%] size-[48rem] rounded-full bg-[radial-gradient(circle,rgb(241_126_0/0.2),transparent_62%)]" />
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 size-[36rem] rounded-full bg-[radial-gradient(circle,rgb(255_154_46/0.09),transparent_65%)]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgb(255_255_255)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_40%_50%,black,transparent_72%)]"
      />

      <div className="shell relative z-[2]">
        {/* Header */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <Kicker dark>The product</Kicker>
            <h2 id="intro-title" className="heading-premium heading-dark mt-4">
              <TitleText text={s.home_intro_heading || 'Meet the boxel Parcel Drop Box'} />
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <p className="text-lead text-white/65">
              {s.home_intro_body ||
                'Parcels, groceries, laundry and returns arrive when you are out. The Parcel Drop Box receives them safely and holds them until you are back.'}
            </p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="What it receives">
              {USES.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] py-1.5 pl-1.5 pr-3.5 text-sm text-white/85 backdrop-blur transition-colors hover:border-signal/50 hover:bg-white/[0.09]"
                >
                  <span className="grid size-6 place-items-center rounded-full bg-[linear-gradient(135deg,#f17e00,#ff9a2e)] text-ink">
                    <Icon className="size-3.5" strokeWidth={2} aria-hidden />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="mt-14 grid items-center gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-14">
          {/* Photo with linked hotspots */}
          <Reveal className="lg:col-span-7">
            <div className="rounded-[1.75rem] bg-[linear-gradient(140deg,rgb(241_126_0/0.55),rgb(255_255_255/0.14)_32%,rgb(255_255_255/0.04)_64%,rgb(241_126_0/0.32))] p-px shadow-[0_60px_120px_-40px_rgb(0_0_0/0.85)]">
              <div className="rounded-[calc(1.75rem-1px)] bg-[#1d1a16]/95 p-3 sm:p-4">
                <div className="relative aspect-[1234/1274] overflow-hidden rounded-[1.25rem] bg-[linear-gradient(180deg,#d3d3d5,#f1f1f3)]">
                  <img
                    src="/images/parcel-drop-box-open.jpeg"
                    alt="The Parcel Drop Box with its front door open, showing the drop chute above and the storage space below"
                    width="1234"
                    height="1274"
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 size-full object-cover"
                  />
                  {/* Soft vignette that focuses the eye on the active part. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 transition-[background] duration-700"
                    style={{ background: `radial-gradient(circle at ${point.x}% ${point.y}%, transparent 14%, rgb(18 18 17 / 0.28) 60%)` }}
                  />
                  {ANATOMY.map((p, i) => (
                    <button
                      key={p.title}
                      type="button"
                      onClick={() => pick(i)}
                      onMouseEnter={() => pick(i)}
                      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-offset-4"
                      style={{ left: `${p.x}%`, top: `${p.y}%` }}
                      aria-label={`${i + 1}. ${p.title}`}
                      aria-pressed={active === i}
                    >
                      {active === i && <span className="absolute inset-0 animate-ping rounded-full bg-signal/60 motion-reduce:animate-none" aria-hidden />}
                      <span
                        className={`relative grid size-9 place-items-center rounded-full text-[0.8125rem] font-semibold shadow-lg ring-4 transition-all duration-500 ${
                          active === i ? 'scale-110 bg-[linear-gradient(135deg,#f17e00,#ff9a2e)] text-ink ring-white/70' : 'bg-white text-ink ring-white/30 hover:scale-105'
                        }`}
                      >
                        {i + 1}
                      </span>
                    </button>
                  ))}
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={active}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="pointer-events-none absolute hidden whitespace-nowrap rounded-full border border-white/60 bg-white/85 px-3.5 py-1.5 text-[0.8125rem] font-medium text-ink shadow-[0_10px_30px_-12px_rgb(0_0_0/0.5)] backdrop-blur-md sm:block"
                      style={{
                        left: `${point.x}%`,
                        top: `${point.y}%`,
                        translate: point.x > 60 ? 'calc(-100% - 28px) -50%' : '28px -50%',
                      }}
                    >
                      {point.title}
                    </motion.span>
                  </AnimatePresence>
                </div>

                {/* Stat strip under the photo */}
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {[
                    { icon: Home, value: '3–4 homes', label: 'served by one unit' },
                    { icon: Hammer, value: 'Made to order', label: 'delivered fully assembled' },
                  ].map(({ icon: Icon, value, label }) => (
                    <div key={value} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:p-4">
                      <span className="hidden size-10 shrink-0 place-items-center rounded-xl bg-white/[0.07] text-signal min-[420px]:grid">
                        <Icon className="size-[1.1rem]" strokeWidth={1.7} aria-hidden />
                      </span>
                      <span className="min-w-0 leading-tight">
                        <span className="block bg-[linear-gradient(90deg,#ffffff,#ffc27a)] bg-clip-text text-base font-semibold text-transparent sm:text-lg" style={{ fontFamily: 'var(--heading-font, var(--font-sans))' }}>
                          {value}
                        </span>
                        <span className="block text-[0.75rem] text-white/55">{label}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Linked anatomy list */}
          <Reveal delay={0.12} className="lg:col-span-5">
            <p className="text-[0.8125rem] font-medium text-white/50">Inside the Parcel Drop Box</p>
            <ol className="mt-4 space-y-3" onMouseLeave={() => setPaused(false)}>
              {ANATOMY.map((p, i) => {
                const on = active === i;
                return (
                  <li key={p.title}>
                    <button
                      type="button"
                      onClick={() => pick(i)}
                      onMouseEnter={() => pick(i)}
                      aria-pressed={on}
                      className={`group relative flex w-full gap-4 overflow-hidden rounded-2xl border p-4 text-left transition-[background-color,border-color,box-shadow] duration-500 sm:p-5 ${
                        on
                          ? 'border-signal/50 bg-white/[0.07] shadow-[0_24px_50px_-24px_rgb(241_126_0/0.55)]'
                          : 'border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]'
                      }`}
                    >
                      <span
                        className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-full text-[0.8125rem] font-semibold transition-all duration-500 ${
                          on ? 'bg-[linear-gradient(135deg,#f17e00,#ff9a2e)] text-ink shadow-[0_8px_20px_-6px_rgb(241_126_0/0.8)]' : 'bg-white/10 text-white'
                        }`}
                        aria-hidden
                      >
                        {i + 1}
                      </span>
                      <span className="min-w-0">
                        <span className={`block text-[1.0625rem] font-semibold tracking-[-0.01em] transition-colors ${on ? 'text-white' : 'text-white/80'}`} style={{ fontFamily: 'var(--heading-font, var(--font-sans))' }}>
                          {p.title}
                        </span>
                        <span className={`mt-1 block text-[0.9375rem] leading-relaxed transition-colors ${on ? 'text-white/75' : 'text-white/45'}`}>{p.body}</span>
                      </span>
                      {/* Autoplay progress */}
                      {on && autoplay && (
                        <motion.span
                          key={`progress-${active}`}
                          aria-hidden
                          className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-[linear-gradient(90deg,#f17e00,#ffb05a)]"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: CYCLE_MS / 1000, ease: 'linear' }}
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ol>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to={`/products/${slug}`} className="btn btn-signal group !rounded-full !px-6">
                View the Parcel Drop Box <ArrowRight className="btn-icon size-4" aria-hidden />
              </Link>
              <Link to="/contact" className="btn btn-ghost-light !rounded-full !px-6">
                Ask a question
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* H — how it works (a real sequence, so the steps are numbered) ------------ */
const STEPS = [
  { icon: ShoppingBag, title: 'Order your boxel product online.', body: 'Choose your product and colour, and place your order in a few steps.', chip: 'Guest or account checkout' },
  { icon: Video, title: 'We make and quality-check it.', body: 'Your unit is made to order. Before it ships, we share a video of its quality and functions.', chip: 'Quality-check video shared' },
  { icon: Truck, title: 'It is dispatched to your address.', body: 'Your product arrives fully assembled, with free shipping across India.', chip: null },
];

export function HowItWorks() {
  const { s } = useSite();
  const ref = useRef(null);
  const reduce = useReducedMotion();
  // The orange track fills as the steps scroll into view; each step lights up when it is reached.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.55'] });
  const fill = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0, 1]);
  const [reached, setReached] = useState(reduce ? STEPS.length : 1);
  useMotionValueEvent(fill, 'change', (v) => setReached(STEPS.filter((_, i) => v >= i * 0.47).length));

  return (
    <section className="grain relative overflow-hidden bg-[linear-gradient(180deg,#f5f1ea_0%,#ece5d9_100%)] py-20 sm:py-28 lg:py-32" aria-labelledby="how-title">
      <div aria-hidden className="pointer-events-none absolute -left-40 -top-40 size-[40rem] rounded-full bg-[radial-gradient(circle,rgb(255_255_255/0.85),transparent_65%)]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-52 -right-40 size-[44rem] rounded-full bg-[radial-gradient(circle,rgb(241_126_0/0.12),transparent_65%)]" />

      <div className="shell relative z-[2]">
        {/* Header */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <Kicker>How it works</Kicker>
            <h2 id="how-title" className="heading-premium mt-4">
              <TitleText main="From order" soft="to your door." />
            </h2>
          </Reveal>
          {s.home_quality_note && (
            <Reveal delay={0.1} className="lg:col-span-5">
              <div className="flex gap-4 rounded-[1.25rem] border border-white/80 bg-white/60 p-5 shadow-[var(--shadow-card)] backdrop-blur-md">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,#f17e00,#ff9a2e)] text-white shadow-[0_10px_22px_-8px_rgb(241_126_0/0.7)]">
                  <Video className="size-5" strokeWidth={1.8} aria-hidden />
                </span>
                <p className="text-[0.9375rem] leading-relaxed text-ink/75">{s.home_quality_note}</p>
              </div>
            </Reveal>
          )}
        </div>

        {/* Steps */}
        <div ref={ref} className="relative mt-16">
          {/* Track: horizontal on desktop (through the step markers), vertical on mobile. */}
          <div aria-hidden className="absolute left-7 top-7 hidden h-[3px] w-[calc(66.666%-0.5rem)] -translate-y-1/2 overflow-hidden rounded-full bg-black/[0.08] md:block">
            <motion.div style={{ scaleX: fill }} className="h-full w-full origin-left rounded-full bg-[linear-gradient(90deg,#b85400,#f17e00,#ffb05a)]" />
          </div>
          <div aria-hidden className="absolute bottom-10 left-7 top-7 w-[3px] -translate-x-1/2 overflow-hidden rounded-full bg-black/[0.08] md:hidden">
            <motion.div style={{ scaleY: fill }} className="h-full w-full origin-top rounded-full bg-[linear-gradient(180deg,#b85400,#f17e00,#ffb05a)]" />
          </div>

          <ol className="relative grid gap-8 md:grid-cols-3 md:gap-6">
            {STEPS.map(({ icon: Icon, title, body, chip }, i) => {
              const on = i < reached;
              return (
                <Reveal as="li" key={title} delay={i * 0.12} className="group relative flex gap-4 md:block">
                  {/* Step marker */}
                  <span
                    className={`relative z-[1] grid size-14 shrink-0 place-items-center rounded-full text-lg font-semibold ring-8 ring-[#efe9df] transition-all duration-700 ease-[var(--ease-out-quint)] ${
                      on ? 'bg-[linear-gradient(135deg,#f17e00,#ff9a2e)] text-white shadow-[0_14px_30px_-10px_rgb(241_126_0/0.8)]' : 'bg-white text-ink/50 shadow-sm'
                    }`}
                    style={{ fontFamily: 'var(--heading-font, var(--font-sans))' }}
                  >
                    <span className="sr-only">Step </span>
                    {i + 1}
                  </span>

                  {/* Card */}
                  <div
                    className={`relative min-w-0 flex-1 overflow-hidden md:mt-6 md:h-[calc(100%-5rem)] rounded-[1.5rem] border bg-white/85 p-6 shadow-[var(--shadow-card)] backdrop-blur transition-[transform,box-shadow,border-color] duration-500 ease-[var(--ease-out-quint)] hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-26px_rgb(241_126_0/0.4)] motion-reduce:hover:translate-y-0 sm:p-7 ${
                      on ? 'border-signal/30' : 'border-black/[0.06]'
                    }`}
                  >
                    <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-[linear-gradient(90deg,#b85400,#f17e00,#ffb05a)] transition-transform duration-700 ease-[var(--ease-out-quint)] group-hover:scale-x-100" />
                    <Icon aria-hidden className="pointer-events-none absolute -bottom-6 -right-6 size-32 -rotate-12 text-black/[0.035] transition-[color,transform] duration-700 group-hover:-rotate-6 group-hover:text-signal/[0.12]" strokeWidth={1.1} />

                    <span
                      className={`relative grid size-12 place-items-center rounded-2xl transition-all duration-500 group-hover:-rotate-6 ${
                        on ? 'bg-signal-soft text-signal-ink ring-1 ring-signal/20' : 'bg-sand text-ink'
                      }`}
                    >
                      <Icon className="size-5" strokeWidth={1.7} aria-hidden />
                    </span>
                    <h3 className="relative mt-6 text-[1.25rem] font-semibold leading-snug tracking-[-0.015em]" style={{ fontFamily: 'var(--heading-font, var(--font-sans))' }}>
                      {title}
                    </h3>
                    <p className="relative mt-3 max-w-[36ch] leading-relaxed text-graphite">{body}</p>
                    <span className="relative mt-6 inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-stone px-3 py-1 text-[0.75rem] font-medium text-ink/75">
                      <span className="size-1.5 rounded-full bg-signal" aria-hidden />
                      {chip || shippingNote(s)}
                    </span>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </div>

        {/* Closing call to action */}
        <Reveal delay={0.1} className="mt-14">
          <div className="grain grain-dark relative flex flex-col gap-6 overflow-hidden rounded-[1.75rem] bg-charcoal p-7 text-white shadow-[var(--shadow-deep)] sm:p-9 lg:flex-row lg:items-center lg:justify-between">
            <span aria-hidden className="pointer-events-none absolute -right-20 -top-24 size-80 rounded-full bg-[radial-gradient(circle,rgb(241_126_0/0.3),transparent_65%)]" />
            <div className="relative">
              <p className="text-[1.5rem] font-semibold tracking-[-0.02em]" style={{ fontFamily: 'var(--heading-font, var(--font-sans))' }}>
                Ready when you are.
              </p>
              <p className="mt-1.5 max-w-[52ch] text-white/65">Every unit is made to order and quality-checked before it ships to your door.</p>
            </div>
            <div className="relative flex flex-wrap gap-3">
              <Link to="/products/parcel-drop-box" className="btn btn-signal group !rounded-full !px-6">
                Order the Parcel Drop Box <ArrowRight className="btn-icon size-4" aria-hidden />
              </Link>
              <Link to="/contact" className="btn btn-ghost-light !rounded-full !px-6">
                Talk to us
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* J — delivery / store location: an animated route from workshop to door. */
const ROUTE = 'M70 250 C 150 110, 220 95, 300 110 S 450 170, 530 235';
const STOPS = [
  { x: 70, y: 250, icon: Hammer, label: 'Made to order' },
  { x: 300, y: 110, icon: Video, label: 'Quality checked' },
  { x: 530, y: 235, icon: Home, label: 'At your door' },
];

function DeliveryRoute({ s }) {
  const reduce = useReducedMotion();
  const fee = Number(s.shipping_fee || 0);
  return (
    <div className="rounded-[2rem] bg-[linear-gradient(135deg,rgb(241_126_0/0.5),rgb(255_255_255/0.9)_35%,rgb(23_23_23/0.08)_65%,rgb(241_126_0/0.35))] p-px shadow-[0_40px_80px_-40px_rgb(23_23_23/0.35)]">
      <div className="grain relative overflow-hidden rounded-[calc(2rem-1px)] bg-[linear-gradient(150deg,#f8f4ee_0%,#ece4d7_100%)] p-6 sm:p-8">
        {/* Dot grid + glow */}
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-50 [background-image:radial-gradient(rgb(23_23_23/0.12)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:radial-gradient(ellipse_at_50%_40%,black,transparent_75%)]" />
        <span aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-[radial-gradient(circle,rgb(241_126_0/0.2),transparent_65%)]" />

        {/* Route */}
        <div className="relative aspect-[600/330]">
          <svg viewBox="0 0 600 330" className="absolute inset-0 size-full overflow-visible" aria-hidden>
            <defs>
              <linearGradient id="route-grad" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#b85400" />
                <stop offset="55%" stopColor="#f17e00" />
                <stop offset="100%" stopColor="#ffb05a" />
              </linearGradient>
            </defs>
            <path d={ROUTE} fill="none" stroke="rgb(23 23 23 / 0.12)" strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" />
            <motion.path
              d={ROUTE}
              fill="none"
              stroke="url(#route-grad)"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: reduce ? 1 : 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.8, ease: EASE }}
            />
            {!reduce && (
              <g>
                <circle r="9" fill="#f17e00" opacity="0.25">
                  <animateMotion dur="4.5s" repeatCount="indefinite" path={ROUTE} rotate="auto" />
                </circle>
                <circle r="5" fill="#f17e00" stroke="#fff" strokeWidth="2">
                  <animateMotion dur="4.5s" repeatCount="indefinite" path={ROUTE} rotate="auto" />
                </circle>
              </g>
            )}
          </svg>

          {STOPS.map(({ x, y, icon: Icon, label }, i) => (
            <motion.div
              key={label}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
              style={{ left: `${(x / 600) * 100}%`, top: `${(y / 330) * 100}%` }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.5, ease: EASE }}
            >
              <span
                className={`grid size-12 place-items-center rounded-2xl ring-4 ring-white/80 sm:size-14 ${
                  i === STOPS.length - 1 ? 'bg-[linear-gradient(135deg,#f17e00,#ff9a2e)] text-white shadow-[0_14px_30px_-10px_rgb(241_126_0/0.8)]' : 'bg-white text-ink shadow-[var(--shadow-card)]'
                }`}
              >
                <Icon className="size-5" strokeWidth={1.7} aria-hidden />
              </span>
              <span className="mt-2 whitespace-nowrap rounded-full border border-black/[0.06] bg-white/85 px-2.5 py-1 text-[0.6875rem] font-semibold text-ink backdrop-blur sm:text-[0.75rem]">
                {label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Shipping callout */}
        <div className="relative mt-4 flex flex-col gap-4 rounded-2xl border border-white/80 bg-white/70 p-5 shadow-[var(--shadow-card)] backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[2rem] font-semibold leading-none tracking-[-0.03em]" style={{ fontFamily: 'var(--heading-font, var(--font-sans))' }}>
              {fee > 0 ? (
                <span className="h-main">Fast, tracked delivery</span>
              ) : (
                <>
                  <span className="h-main">Free </span>
                  <span className="h-soft">shipping</span>
                </>
              )}
            </p>
            <p className="mt-2 text-[0.9375rem] text-graphite">{fee > 0 ? `${shippingNote(s)}.` : 'On every order, across India.'}</p>
          </div>
          <span className="inline-flex items-center gap-2 self-start rounded-full bg-ink px-3.5 py-2 text-[0.8125rem] font-medium text-white sm:self-auto">
            <Truck className="size-4 text-signal" aria-hidden /> Pan-India delivery
          </span>
        </div>
      </div>
    </div>
  );
}

const DELIVERY_FACTS = [
  { icon: Truck, label: 'Shipping', note: null },
  { icon: PackageCheck, label: 'Delivered assembled', note: 'Ready to place' },
  { icon: Video, label: 'Quality video', note: 'Shared before dispatch' },
  { icon: MapPin, label: 'Order updates', note: 'Sent to you by email' },
];

export function Location() {
  const { s } = useSite();
  const isStore = s.location_mode === 'store' && (s.business_address || s.store_name);
  const cityState = [s.business_city, s.business_state].filter(Boolean).join(', ');
  const fullAddress = [s.business_address, cityState].filter(Boolean).join(', ');
  const directions = s.map_url || (isStore && s.business_address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}` : null);
  const wa = s.business_whatsapp || s.business_phone;

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f6f5f2_0%,#ffffff_100%)] py-20 sm:py-28 lg:py-32" aria-labelledby="location-title">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
        <div className="lg:col-span-5">
          <Reveal>
            <Kicker>{isStore ? 'Visit us' : 'Delivery'}</Kicker>
            <h2 id="location-title" className="heading-premium mt-4">
              {isStore ? <TitleText text={s.store_name || 'Visit our store'} /> : <TitleText main="Delivering" soft="across India." />}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            {isStore ? (
              <p className="mt-6 flex gap-3 text-lead text-graphite">
                <MapPin className="mt-1.5 size-5 shrink-0 text-signal-ink" strokeWidth={1.7} aria-hidden />
                <span>{fullAddress}</span>
              </p>
            ) : (
              <p className="mt-6 max-w-[46ch] text-lead text-graphite">
                {s.service_area_text || 'We deliver across India, with free shipping.'}
                {cityState && ` We are based in ${cityState}.`}
              </p>
            )}
            {s.business_hours && <p className="mt-3 text-graphite">{s.business_hours}</p>}

            <ul className="mt-8 grid grid-cols-2 gap-3">
              {DELIVERY_FACTS.map(({ icon: Icon, label, note }) => (
                <li
                  key={label}
                  className="group rounded-2xl border border-black/[0.07] bg-white p-4 shadow-[var(--shadow-card)] transition-[transform,border-color,box-shadow] duration-500 ease-[var(--ease-out-quint)] hover:-translate-y-1 hover:border-signal/40 hover:shadow-[0_20px_40px_-22px_rgb(241_126_0/0.5)]"
                >
                  <span className="grid size-10 place-items-center rounded-xl bg-signal-soft text-signal-ink ring-1 ring-signal/15 transition-all duration-500 group-hover:-rotate-6 group-hover:bg-[linear-gradient(135deg,#f17e00,#ff9a2e)] group-hover:text-white">
                    <Icon className="size-[1.1rem]" strokeWidth={1.7} aria-hidden />
                  </span>
                  <span className="mt-3 block text-[0.9375rem] font-semibold" style={{ fontFamily: 'var(--heading-font, var(--font-sans))' }}>
                    {label}
                  </span>
                  <span className="mt-0.5 block text-[0.8125rem] text-graphite">{note || shippingNote(s)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={telHref(s.business_phone)} className="btn btn-primary group !rounded-full !px-5">
                <Phone className="size-4" aria-hidden /> {formatPhone(s.business_phone)}
              </a>
              {wa && (
                <a href={`https://wa.me/${String(wa).replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary !rounded-full !px-5">
                  <MessageCircle className="size-4" aria-hidden /> WhatsApp
                </a>
              )}
              {directions && (
                <a href={directions} target="_blank" rel="noopener noreferrer" className="btn btn-secondary !rounded-full !px-5">
                  <Navigation className="size-4" aria-hidden /> Get directions
                </a>
              )}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="min-w-0 lg:col-span-7">
          {isStore && s.map_embed_url ? (
            <div className="rounded-[2rem] bg-[linear-gradient(135deg,rgb(241_126_0/0.5),rgb(255_255_255/0.9)_35%,rgb(23_23_23/0.08)_65%,rgb(241_126_0/0.35))] p-px shadow-[0_40px_80px_-40px_rgb(23_23_23/0.35)]">
              <iframe
                src={s.map_embed_url}
                title={`Map showing ${s.store_name || 'our location'}`}
                className="aspect-[4/3] w-full rounded-[calc(2rem-1px)] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ) : (
            <DeliveryRoute s={s} />
          )}
        </Reveal>
      </div>
    </section>
  );
}

/* K — follow us (hidden until real profiles are configured) -------------- */
export function FollowUs() {
  const { social } = useSite();
  if (!social.length) return null;
  return (
    <section className="py-16 sm:py-20" aria-labelledby="follow-title">
      <div className="shell flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <SectionHeading id="follow-title" kicker="Social" title="Follow boxel" intro="New products, behind-the-scenes builds and quality-check videos." />
        <Reveal as="ul" className="flex flex-wrap gap-3">
          {social.map((l) => (
            <li key={l.platform}>
              <a href={l.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 rounded-full border border-hairline py-2.5 pl-3 pr-5 transition-colors hover:border-ink">
                <SocialIcon platform={l.platform} />
                <span>{SOCIAL_LABELS[l.platform]}</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
