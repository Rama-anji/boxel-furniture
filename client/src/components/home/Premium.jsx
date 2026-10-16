import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Eye, Briefcase, Building2, ClipboardCheck, Hammer, House, KeyRound, Lock, MessageCircle, PackageCheck, PaintRoller, Phone, PlugZap, ShieldCheck, Truck, Video } from 'lucide-react';
import Reveal, { EASE, stagger } from '../ui/Reveal.jsx';
import { AccordionItem } from '../ui/Accordion.jsx';
import ProductCard, { ProductCardSkeleton } from '../ProductCard.jsx';
import QuickView from '../QuickView.jsx';
import { Price, AvailabilityBadge } from '../ProductBits.jsx';
import { ErrorState } from '../ui/States.jsx';
import { useSite } from '../../context/SiteContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { formatPhone, shippingNote, telHref, whatsappHref } from '../../utils/format.js';
import { Kicker, TitleText } from '../ui/Heading.jsx';

const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } };

/* D — promises: a floating card that bridges the white hero and the dark showcase. */
const VALUES = [
  { icon: Lock, label: 'Secure by design', note: 'All-metal, with a keyless number lock' },
  { icon: Hammer, label: 'Made to order', note: 'Built for you after you order' },
  { icon: ClipboardCheck, label: 'Quality checked before dispatch', note: 'A video of quality and functions, shared before it ships' },
  { icon: Truck, label: 'Free shipping across India', note: 'On every order' },
];

export function ValueStrip() {
  return (
    <section aria-label="Our promises" className="relative bg-[linear-gradient(180deg,#ffffff_50%,var(--color-charcoal)_50%)] pt-4">
      <div className="shell relative z-[2]">
        <motion.ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          {VALUES.map(({ icon: Icon, label, note }) => (
            <motion.li
              key={label}
              variants={item}
              className="group relative flex items-start gap-4 overflow-hidden rounded-[1.25rem] border border-black/[0.07] bg-white p-5 shadow-[var(--shadow-deep)] sm:block transition-[transform,box-shadow,border-color] duration-500 ease-[var(--ease-out-quint)] hover:-translate-y-1.5 hover:border-signal/40 hover:shadow-[0_34px_60px_-28px_rgb(241_126_0/0.45)] motion-reduce:hover:translate-y-0 sm:p-7"
            >
              {/* Accent line that draws across the top on hover. */}
              <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-[linear-gradient(90deg,#b85400,#f17e00,#ffb05a)] transition-transform duration-700 ease-[var(--ease-out-quint)] group-hover:scale-x-100" />
              {/* Oversized faint icon as a watermark. */}
              <Icon aria-hidden className="pointer-events-none absolute -bottom-5 -right-5 size-28 -rotate-12 text-black/[0.035] transition-[color,transform] duration-700 ease-[var(--ease-out-quint)] group-hover:-rotate-6 group-hover:text-signal/[0.12]" strokeWidth={1.2} />

              <span className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-signal-soft text-signal-ink ring-1 ring-signal/15 transition-all duration-500 ease-[var(--ease-out-quint)] group-hover:-rotate-6 group-hover:bg-[linear-gradient(135deg,#f17e00,#ff9a2e)] group-hover:text-white group-hover:shadow-[0_10px_24px_-8px_rgb(241_126_0/0.7)]">
                <Icon className="size-5" strokeWidth={1.7} aria-hidden />
              </span>
              <span className="relative block min-w-0 sm:mt-6">
                <span className="block text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em]" style={{ fontFamily: 'var(--heading-font, var(--font-sans))' }}>
                  {label}
                </span>
                <span className="mt-1.5 block text-[0.875rem] leading-relaxed text-graphite">{note}</span>
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

/* A small 3D-shaded stack of logo tiles. Each coming-soon category gets its own arrangement. */
const STACKS = [
  // tall locker
  [
    { l: 18, t: 8, w: 34, h: 58, c: 'from-white to-[#e4ddd1]' },
    { l: 18, t: 70, w: 34, h: 26, c: 'from-white to-[#e4ddd1]' },
    { l: 56, t: 34, w: 30, h: 44, c: 'from-[#ffa340] to-signal', accent: true },
  ],
  // wide workstation
  [
    { l: 6, t: 30, w: 62, h: 30, c: 'from-white to-[#e4ddd1]' },
    { l: 6, t: 64, w: 26, h: 30, c: 'from-white to-[#e4ddd1]' },
    { l: 70, t: 18, w: 24, h: 40, c: 'from-[#ffa340] to-signal', accent: true },
  ],
  // stepped wall shelves
  [
    { l: 8, t: 54, w: 26, h: 26, c: 'from-white to-[#e4ddd1]' },
    { l: 38, t: 34, w: 26, h: 26, c: 'from-white to-[#e4ddd1]' },
    { l: 68, t: 14, w: 26, h: 26, c: 'from-[#ffa340] to-signal', accent: true },
  ],
];

function TileStack({ variant = 0, dark = false }) {
  const tiles = STACKS[variant % STACKS.length];
  return (
    <div className="relative h-full w-full" aria-hidden>
      <span className={`absolute bottom-[4%] left-1/2 h-[10%] w-[70%] -translate-x-1/2 rounded-[50%] blur-xl ${dark ? 'bg-black/60' : 'bg-[#8a7d66]/25'}`} />
      {tiles.map((t, i) => (
        <span
          key={i}
          className={`absolute transition-transform duration-700 ease-[var(--ease-out-quint)] ${
            t.accent ? 'group-hover:-translate-y-3' : i === 0 ? 'group-hover:-translate-y-1.5' : 'group-hover:translate-y-0.5'
          }`}
          style={{ left: `${t.l}%`, top: `${t.t}%`, width: `${t.w}%`, height: `${t.h}%` }}
        >
          <span className={`block size-full bg-gradient-to-br ${t.c} shadow-[0_18px_30px_-14px_rgb(60_45_20/0.45)]`} style={{ transform: 'skewY(-24deg)' }} />
        </span>
      ))}
    </div>
  );
}

/* F — categories as a bento grid: the available range leads, upcoming ideas follow. */
export function Categories({ data, loading, error, reload }) {
  const items = data?.items || [];
  return (
    <section className="py-20 sm:py-28 lg:py-32" aria-labelledby="cat-title">
      <div className="shell">
        <Reveal className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Kicker>Collections</Kicker>
            <h2 id="cat-title" className="heading-premium mt-4 max-w-xl">
              <TitleText main="One idea," soft="many rooms." />
            </h2>
          </div>
          <p className="max-w-[44ch] text-lead text-graphite">The Parcel Drop Box is available now. More boxel products for storage and small spaces are on the way.</p>
        </Reveal>
        {error && (
          <div className="mt-10">
            <ErrorState error={error} onRetry={reload} />
          </div>
        )}
        <motion.ul
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:auto-rows-[17rem] lg:grid-cols-4"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {loading && !data && [0, 1, 2, 3].map((i) => <li key={i} className={`skeleton min-h-72 ${i === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`} aria-hidden />)}
          {items.map((c, i) => {
            const soon = c.status === 'coming_soon';
            const big = i === 0;
            const wide = i === 1;
            const dark = i === 1;
            const span = big ? 'sm:col-span-2 lg:col-span-2 lg:row-span-2' : wide ? 'sm:col-span-2 lg:col-span-2' : '';
            return (
              <motion.li key={c.id} variants={item} className={span}>
                <Link
                  to={`/products?category=${c.slug}`}
                  className={`lift group relative flex h-full min-h-72 flex-col overflow-hidden rounded-[1.25rem] p-6 sm:p-7 ${
                    c.image_url ? 'bg-charcoal text-white' : dark ? 'grain grain-dark bg-charcoal text-white' : 'grain bg-sand'
                  } ${big ? 'min-h-[28rem]' : ''}`}
                >
                  {c.image_url ? (
                    <>
                      <img
                        src={c.image_url}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 size-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-quint)] group-hover:scale-[1.04]"
                      />
                      <span className="absolute inset-0 bg-[linear-gradient(180deg,rgb(18_18_17/0.05)_35%,rgb(18_18_17/0.78))]" aria-hidden />
                    </>
                  ) : (
                    <span className={`pointer-events-none absolute ${wide ? 'right-4 top-4 h-[78%] w-[42%]' : 'right-3 top-3 h-[58%] w-[62%]'}`}>
                      <TileStack variant={i - 1} dark={dark} />
                    </span>
                  )}
                  {dark && <span aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[radial-gradient(circle,rgb(241_126_0/0.22),transparent_65%)]" />}

                  <span className="relative z-[2] flex items-start justify-between gap-3">
                    <span className={c.image_url ? 'glass-pill' : `inline-flex rounded-full px-3 py-1 text-[0.75rem] font-medium ${dark ? 'bg-white/10 text-white/85' : 'bg-white/70 text-ink'}`}>
                      {soon ? 'Coming soon' : `${c.product_count} available now`}
                    </span>
                  </span>

                  <span className="relative z-[2] mt-auto flex items-end justify-between gap-4 pt-10">
                    <span className={wide ? 'max-w-[55%]' : ''}>
                      <span className={`block font-light tracking-tight ${big ? 'text-headline' : 'text-title'}`}>{c.name}</span>
                      {c.description && (
                        <span className={`mt-2 block text-sm leading-relaxed ${c.image_url || dark ? 'text-white/70' : 'text-graphite'} ${big ? 'max-w-[36ch]' : 'line-clamp-3'}`}>{c.description}</span>
                      )}
                    </span>
                    <span
                      className={`grid size-11 shrink-0 place-items-center rounded-full transition-all duration-500 ease-[var(--ease-out-quint)] group-hover:rotate-45 ${
                        c.image_url || dark ? 'bg-white text-ink group-hover:bg-signal' : 'bg-ink text-white group-hover:bg-signal group-hover:text-ink'
                      }`}
                      aria-hidden
                    >
                      <ArrowUpRight className="size-5" />
                    </span>
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}

/* G — featured: a single available product gets a full spotlight card instead of a lonely grid. */
const HIGHLIGHTS = [
  { icon: KeyRound, label: 'Keyless number lock', note: 'No keys to carry' },
  { icon: ShieldCheck, label: 'All-metal build', note: 'Built in metal' },
  { icon: PaintRoller, label: 'Powder-coated', note: 'Durable finish' },
  { icon: PackageCheck, label: 'Delivered assembled', note: 'Ready to place' },
];

function Spotlight({ product }) {
  const { addItem, openDrawer } = useCart();
  const toast = useToast();
  const { s } = useSite();
  const reduce = useReducedMotion();
  const [quick, setQuick] = useState(false);
  const [view, setView] = useState(0);
  const variant = product.variants.find((v) => v.available) || product.variants[0];
  const canBuy = product.availability === 'available' && variant?.available;
  const single = product.variants.length <= 1;
  const priced = product.price > 0;
  const views = product.images.slice(0, 2).map((img, i) => ({ ...img, label: i === 0 ? 'Front' : 'Inside' }));

  // 3D tilt + moving glare on the photo (mouse only).
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotY = useSpring(useTransform(px, [0, 1], [-5, 5]), { stiffness: 140, damping: 18 });
  const rotX = useSpring(useTransform(py, [0, 1], [4, -4]), { stiffness: 140, damping: 18 });
  const glare = useTransform([px, py], ([x, y]) => `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgb(255 255 255 / 0.32), transparent 45%)`);
  const onMove = (e) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  const add = () => {
    addItem(product, variant, 1);
    toast.success(`${product.name} added to your cart.`, { action: { label: 'View cart', onClick: openDrawer } });
  };

  return (
    <motion.article
      variants={item}
      // Gradient hairline border: orange → light → orange, around a warm card.
      className="group/card relative rounded-[2rem] bg-[linear-gradient(135deg,rgb(241_126_0/0.55),rgb(255_255_255/0.9)_32%,rgb(23_23_23/0.08)_62%,rgb(241_126_0/0.4))] p-px shadow-[0_40px_80px_-40px_rgb(23_23_23/0.35)] transition-shadow duration-700 hover:shadow-[0_50px_100px_-40px_rgb(241_126_0/0.35)]"
    >
      <div className="grain relative overflow-hidden rounded-[calc(2rem-1px)] bg-[linear-gradient(135deg,#fcfbf8_0%,#f1ece3_100%)]">
        <span aria-hidden className="pointer-events-none absolute -bottom-40 -left-32 size-[34rem] rounded-full bg-[radial-gradient(circle,rgb(241_126_0/0.14),transparent_65%)]" />
        <span aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-[radial-gradient(circle,rgb(255_255_255/0.9),transparent_65%)]" />

        <div className="relative z-[2] grid lg:grid-cols-12">
          {/* Photo stage */}
          <div className="p-4 sm:p-6 lg:col-span-7" style={{ perspective: '1600px' }}>
            <motion.div onPointerMove={onMove} onPointerLeave={onLeave} style={{ rotateX: rotX, rotateY: rotY }} className="relative">
              <Link
                to={`/products/${product.slug}`}
                aria-label={product.name}
                className="relative block aspect-[1309/1202] overflow-hidden rounded-[1.5rem] bg-[linear-gradient(180deg,var(--color-studio-top),var(--color-studio-floor))] shadow-[var(--shadow-deep)] ring-1 ring-black/[0.06]"
              >
                {views.map((v, i) => (
                  <img
                    key={v.url}
                    src={v.url}
                    alt={i === view ? v.alt : ''}
                    aria-hidden={i !== view}
                    loading="lazy"
                    className={`absolute inset-0 size-full object-cover transition-[opacity,transform] duration-700 ease-[var(--ease-out-quint)] group-hover/card:scale-[1.02] ${i === view ? 'opacity-100' : 'opacity-0'}`}
                  />
                ))}
                <motion.span aria-hidden style={{ backgroundImage: glare }} className="pointer-events-none absolute inset-0 mix-blend-soft-light" />
                <span className="glass-pill absolute left-4 top-4">
                  <span className="size-1.5 rounded-full bg-signal" aria-hidden />
                  {product.category?.name || 'boxel'}
                </span>
                <span className="glass-pill absolute right-4 top-4">Made to order</span>
              </Link>

              {views.length > 1 && (
                <div className="absolute bottom-4 left-4 flex gap-1 rounded-full border border-white/60 bg-white/70 p-1 shadow-[var(--shadow-card)] backdrop-blur-md" role="group" aria-label="Photo view">
                  {views.map((v, i) => (
                    <button
                      key={v.url}
                      type="button"
                      onClick={() => setView(i)}
                      onMouseEnter={() => setView(i)}
                      aria-pressed={view === i}
                      className="relative flex items-center gap-2 rounded-full py-1 pl-1 pr-3.5 text-[0.8125rem] font-medium"
                    >
                      {view === i && <motion.span layoutId="spot-view" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 420, damping: 34 }} aria-hidden />}
                      <img src={v.url} alt="" className="relative size-7 rounded-full object-cover ring-2 ring-white" />
                      <span className={`relative transition-colors ${view === i ? 'text-white' : 'text-ink'}`}>{v.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center px-6 pb-8 pt-2 sm:px-10 sm:pb-10 lg:col-span-5 lg:py-12 lg:pl-4 lg:pr-12">
            <div className="flex flex-wrap items-center gap-2">
              {product.availability !== 'price_not_set' && <AvailabilityBadge availability={product.availability} />}
              {product.rating && (
                <span className="text-sm text-graphite">
                  ★ {product.rating.average.toFixed(1)} · {product.rating.count} review{product.rating.count === 1 ? '' : 's'}
                </span>
              )}
            </div>
            <h3 className="mt-4 text-[clamp(1.875rem,1.2rem+1.8vw,2.75rem)] leading-[1.05] tracking-[-0.03em]" style={{ fontFamily: 'var(--heading-font, var(--font-sans))', fontWeight: 'var(--heading-weight, 500)' }}>
              <Link to={`/products/${product.slug}`} className="transition-colors hover:text-signal-ink">
                {product.name}
              </Link>
            </h3>
            {product.shortDescription && <p className="mt-4 max-w-[44ch] text-[1.0625rem] leading-relaxed text-graphite">{product.shortDescription}</p>}

            <ul className="mt-7 grid grid-cols-1 gap-2.5 min-[480px]:grid-cols-2">
              {HIGHLIGHTS.map(({ icon: Icon, label, note }) => (
                <li
                  key={label}
                  className="group flex items-center gap-3 rounded-2xl border border-black/[0.08] bg-white/80 p-3 transition-[border-color,box-shadow,transform] duration-500 ease-[var(--ease-out-quint)] hover:-translate-y-0.5 hover:border-signal/40 hover:shadow-[0_12px_24px_-14px_rgb(241_126_0/0.5)]"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,#f17e00,#ff9a2e)] text-white shadow-[0_8px_18px_-8px_rgb(241_126_0/0.7)] transition-transform duration-500 group-hover:-rotate-6">
                    <Icon className="size-[1.05rem]" strokeWidth={1.8} aria-hidden />
                  </span>
                  <span className="min-w-0 leading-tight">
                    <span className="block text-[0.8125rem] font-semibold">{label}</span>
                    <span className="block text-[0.75rem] text-graphite">{note}</span>
                  </span>
                </li>
              ))}
            </ul>

            {/* Price panel — one clear answer, never a duplicated label. */}
            <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-black/[0.08] bg-white/70 p-4 sm:p-5">
              <div>
                <p className="text-[0.75rem] font-medium text-graphite">Price</p>
                {priced ? (
                  <>
                    <Price product={product} variant={variant} size="lg" className="mt-0.5" />
                    <p className="mt-0.5 text-[0.75rem] text-success">{shippingNote(s)}</p>
                  </>
                ) : (
                  <>
                    <p className="mt-0.5 text-xl font-semibold tracking-tight" style={{ fontFamily: 'var(--heading-font, var(--font-sans))' }}>
                      Announcing soon
                    </p>
                    <p className="mt-0.5 text-[0.75rem] text-graphite">Message us for pricing and availability.</p>
                  </>
                )}
              </div>
              {product.variants.length > 0 && (
                <div className="text-right">
                  <p className="text-[0.75rem] font-medium text-graphite">Colour</p>
                  <div className="mt-1.5 flex items-center justify-end gap-1.5" aria-label={`Colours: ${product.variants.map((v) => v.name).join(', ')}`}>
                    {product.variants.map((v) => (
                      <span key={v.id} className="flex items-center gap-1.5 rounded-full border border-black/10 bg-white py-0.5 pl-0.5 pr-2.5 text-[0.75rem]">
                        <span className="size-5 rounded-full border border-black/15 shadow-inner" style={{ background: v.colorHex || '#ddd' }} />
                        {v.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-2.5">
              {canBuy && single ? (
                <button type="button" onClick={add} className="btn btn-primary group w-full !rounded-full sm:w-auto sm:flex-none">
                  Add to cart <ArrowRight className="btn-icon size-4" aria-hidden />
                </button>
              ) : canBuy ? (
                <Link to={`/products/${product.slug}`} className="btn btn-primary group w-full !rounded-full sm:w-auto sm:flex-none">
                  Choose colour <ArrowRight className="btn-icon size-4" aria-hidden />
                </Link>
              ) : (
                <a href={whatsappHref(s.business_whatsapp || s.business_phone, `Hi boxel, I'm interested in the ${product.name}.`)} target="_blank" rel="noopener noreferrer" className="btn btn-primary group w-full !rounded-full sm:w-auto sm:flex-none">
                  <MessageCircle className="size-4" aria-hidden /> Ask on WhatsApp
                </a>
              )}
              <Link to={`/products/${product.slug}`} className="btn btn-secondary flex-1 !rounded-full bg-white/70 sm:flex-none">
                View details
              </Link>
              <button type="button" onClick={() => setQuick(true)} className="btn btn-secondary grid size-12 !min-h-12 place-items-center !rounded-full bg-white/70 !p-0" aria-label={`Quick view ${product.name}`}>
                <Eye className="size-4" aria-hidden />
              </button>
            </div>

            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-black/[0.08] pt-5 text-[0.8125rem] text-graphite">
              <li className="flex items-center gap-1.5">
                <Video className="size-4 text-signal-ink" aria-hidden /> Quality-check video before dispatch
              </li>
              <li className="flex items-center gap-1.5">
                <Truck className="size-4 text-signal-ink" aria-hidden /> {shippingNote(s)}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <QuickView product={product} open={quick} onClose={() => setQuick(false)} />
    </motion.article>
  );
}

export function Featured({ data, loading, error, reload }) {
  const items = data?.items || [];
  const single = items.length === 1;
  return (
    <section className="pb-12 pt-20 sm:pb-16 sm:pt-28 lg:pt-32" aria-labelledby="featured-title">
      <div className="shell">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <Kicker>Shop</Kicker>
          <h2 id="featured-title" className="heading-premium">
            <TitleText main="Available" soft="now" />
          </h2>
          <Link to="/products" className="link text-[0.9375rem] font-medium">
            All products
          </Link>
        </Reveal>
        <div className="mt-12">
          {error && <ErrorState error={error} onRetry={reload} />}
          {loading && !data && (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}
          {data && items.length === 0 && <p className="text-graphite">New products are being prepared. Check back soon.</p>}
          {items.length > 0 && (
            <motion.div
              className={single ? '' : `grid gap-x-6 gap-y-14 sm:grid-cols-2 ${items.length >= 3 ? 'lg:grid-cols-3' : ''} ${items.length === 4 ? 'xl:grid-cols-4' : ''}`}
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
            >
              {single ? <Spotlight product={items[0]} /> : items.map((p) => <ProductCard key={p.id} product={p} />)}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

/* I — designed for modern Indian living: an interactive audience explorer. */
const AUDIENCES = [
  {
    key: 'homes',
    icon: House,
    title: 'Individual homes',
    body: 'Receive deliveries while you are out — no more waiting at home for a parcel.',
    products: ['Parcel Drop Box'],
    soon: false,
    image: '/images/parcel-drop-box-front.jpeg',
    stat: { value: 'Keyless', label: 'number lock' },
  },
  {
    key: 'societies',
    icon: Building2,
    title: 'Apartments and housing societies',
    body: 'One drop box can serve 3 to 4 homes at a shared entrance.',
    products: ['Parcel Drop Box'],
    soon: false,
    image: '/images/parcel-drop-box-open.jpeg',
    stat: { value: '3–4 homes', label: 'per unit' },
  },
  {
    key: 'offices',
    icon: Briefcase,
    title: 'Offices and workspaces',
    body: 'Space-saving wall-hung workstations and secure storage for high-value gadgets.',
    products: ['Wall-Hung Workstation', 'Personal Locker'],
    soon: true,
  },
  {
    key: 'ev',
    icon: PlugZap,
    title: 'EV owners',
    body: 'A floor-standing holder for your charger, so you need not carry it up the stairs every day.',
    products: ['Personal Locker (floor-standing)'],
    soon: true,
  },
];

/** Dark composition of logo tiles for products that are still being designed. */
function ComingSoonVisual({ icon: Icon, variant }) {
  const tiles =
    variant === 'ev'
      ? [
          { l: '30%', t: '22%', w: '18%', h: '48%', c: 'from-white/90 to-white/50' },
          { l: '52%', t: '38%', w: '18%', h: '30%', c: 'from-[#ffa340] to-signal', accent: true },
        ]
      : [
          { l: '18%', t: '30%', w: '40%', h: '22%', c: 'from-white/90 to-white/50' },
          { l: '18%', t: '56%', w: '18%', h: '22%', c: 'from-white/70 to-white/30' },
          { l: '62%', t: '22%', w: '18%', h: '34%', c: 'from-[#ffa340] to-signal', accent: true },
        ];
  return (
    <div className="grain grain-dark absolute inset-0 overflow-hidden bg-[linear-gradient(160deg,#1f1b16,#121110)]">
      <span aria-hidden className="absolute left-1/2 top-1/2 size-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(241_126_0/0.28),transparent_65%)]" />
      <div aria-hidden className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgb(255_255_255)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      {tiles.map((t, i) => (
        <motion.span
          key={i}
          aria-hidden
          className={`absolute bg-gradient-to-br ${t.c} ${t.accent ? 'shadow-[0_30px_60px_-20px_rgb(241_126_0/0.7)]' : 'shadow-[0_24px_40px_-20px_rgb(0_0_0/0.7)]'}`}
          style={{ left: t.l, top: t.t, width: t.w, height: t.h, skewY: '-24deg' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 + i * 0.1, ease: EASE }}
        />
      ))}
      <span className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full border border-white/15 bg-white/10 py-1.5 pl-1.5 pr-3.5 text-[0.8125rem] font-medium text-white backdrop-blur-md">
        <span className="grid size-6 place-items-center rounded-full bg-signal text-ink">
          <Icon className="size-3.5" strokeWidth={2} aria-hidden />
        </span>
        In design — coming soon
      </span>
    </div>
  );
}

export function ModernLiving() {
  const [active, setActive] = useState(0);
  const tabs = useRef([]);
  const a = AUDIENCES[active];

  const onKey = (e) => {
    const dir = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (e.key === 'Home' || e.key === 'End' || dir) {
      e.preventDefault();
      const next = e.key === 'Home' ? 0 : e.key === 'End' ? AUDIENCES.length - 1 : (active + dir + AUDIENCES.length) % AUDIENCES.length;
      setActive(next);
      tabs.current[next]?.focus();
    }
  };

  return (
    <section className="grain relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f6f5f2_100%)] py-20 sm:py-28 lg:py-32" aria-labelledby="living-title">
      <div aria-hidden className="pointer-events-none absolute -right-48 top-20 size-[40rem] rounded-full bg-[radial-gradient(circle,rgb(241_126_0/0.1),transparent_65%)]" />

      <div className="shell relative z-[2]">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <Kicker>Who it&apos;s for</Kicker>
            <h2 id="living-title" className="heading-premium mt-4">
              <TitleText main="Designed for" soft="modern Indian living." />
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <p className="text-lead text-graphite">We design for real homes, real apartments, real offices and real budgets.</p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 lg:mt-14 lg:grid-cols-12 lg:gap-8">
          {/* Audience tabs */}
          <Reveal className="min-w-0 lg:col-span-5 lg:flex lg:flex-col">
            <div
              role="tablist"
              aria-label="Who boxel is for"
              aria-orientation="vertical"
              onKeyDown={onKey}
              className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
            >
              {AUDIENCES.map((x, i) => {
                const on = i === active;
                return (
                  <button
                    key={x.key}
                    ref={(el) => (tabs.current[i] = el)}
                    type="button"
                    role="tab"
                    id={`aud-tab-${x.key}`}
                    aria-selected={on}
                    aria-controls="aud-panel"
                    tabIndex={on ? 0 : -1}
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    className={`group relative flex shrink-0 snap-start items-center gap-4 overflow-hidden rounded-2xl border p-3 pr-4 text-left transition-[background-color,border-color,box-shadow] duration-500 lg:p-4 ${
                      on ? 'border-signal/35 bg-white shadow-[0_20px_44px_-24px_rgb(241_126_0/0.45)]' : 'border-black/[0.06] bg-white/50 hover:border-black/[0.14] hover:bg-white'
                    }`}
                  >
                    {on && <motion.span layoutId="aud-bar" className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-[linear-gradient(180deg,#f17e00,#ffb05a)]" transition={{ type: 'spring', stiffness: 420, damping: 36 }} aria-hidden />}
                    <span
                      className={`grid size-11 shrink-0 place-items-center rounded-xl transition-all duration-500 ${
                        on ? 'bg-[linear-gradient(135deg,#f17e00,#ff9a2e)] text-white shadow-[0_10px_22px_-8px_rgb(241_126_0/0.7)]' : 'bg-sand text-ink group-hover:-rotate-6'
                      }`}
                    >
                      <x.icon className="size-5" strokeWidth={1.7} aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block whitespace-nowrap text-[0.9375rem] font-semibold lg:whitespace-normal lg:text-[1.0625rem]" style={{ fontFamily: 'var(--heading-font, var(--font-sans))' }}>
                        {x.title}
                      </span>
                      <span className={`mt-0.5 hidden items-center gap-1.5 text-[0.75rem] font-medium lg:flex ${x.soon ? 'text-graphite' : 'text-success'}`}>
                        <span className={`size-1.5 rounded-full ${x.soon ? 'bg-graphite/50' : 'bg-success'}`} aria-hidden />
                        {x.soon ? 'Coming soon' : 'Available now'}
                      </span>
                    </span>
                    <ArrowRight className={`ml-auto hidden size-4 shrink-0 transition-all duration-500 lg:block ${on ? 'translate-x-0 text-signal-ink opacity-100' : '-translate-x-2 opacity-0'}`} aria-hidden />
                  </button>
                );
              })}
            </div>

            {/* Fills the rest of the column so both sides end at the same height on desktop. */}
            <div className="grain grain-dark relative mt-4 hidden flex-1 flex-col justify-end overflow-hidden rounded-[1.5rem] bg-[linear-gradient(160deg,#1f1b16,#121110)] p-7 text-white shadow-[var(--shadow-deep)] lg:flex">
              <span aria-hidden className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-[radial-gradient(circle,rgb(241_126_0/0.35),transparent_65%)]" />
              <div aria-hidden className="pointer-events-none absolute right-8 top-8 flex items-end gap-1.5 text-4xl">
                <span className="tile bg-white/80" />
                <span className="tile mb-[0.4em] bg-white/50" />
                <span className="tile" />
              </div>
              <div className="relative">
                <p className="text-[1.375rem] font-semibold leading-snug tracking-[-0.02em]" style={{ fontFamily: 'var(--heading-font, var(--font-sans))' }}>
                  Planning for your housing society?
                </p>
                <p className="mt-2 max-w-[38ch] text-[0.9375rem] leading-relaxed text-white/65">
                  One Parcel Drop Box can serve 3 to 4 homes. Tell us about your entrance and we will help you choose.
                </p>
                <Link to="/contact?topic=Bulk%20or%20society%20enquiry" className="btn btn-signal group mt-6 !rounded-full !px-5">
                  Talk to us <ArrowRight className="btn-icon size-4" aria-hidden />
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Showcase panel */}
          <Reveal delay={0.1} className="min-w-0 lg:col-span-7">
            <div className="rounded-[2rem] bg-[linear-gradient(135deg,rgb(241_126_0/0.5),rgb(255_255_255/0.9)_35%,rgb(23_23_23/0.08)_65%,rgb(241_126_0/0.35))] p-px shadow-[0_40px_80px_-40px_rgb(23_23_23/0.35)]">
              <div id="aud-panel" role="tabpanel" aria-labelledby={`aud-tab-${a.key}`} className="overflow-hidden rounded-[calc(2rem-1px)] bg-white">
                <div className="relative aspect-[16/10] overflow-hidden bg-[linear-gradient(180deg,#b9b9bb,#e2e0e3)]">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={a.key}
                      className="absolute inset-0"
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: EASE }}
                    >
                      {a.image ? (
                        <>
                          <img src={a.image} alt="" loading="lazy" className="absolute left-1/2 top-0 h-full w-auto max-w-none -translate-x-1/2 [mask-image:linear-gradient(to_right,transparent,black_18%,black_82%,transparent)]" />
                          <span aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgb(255_255_255/0.35),transparent_60%)] mix-blend-soft-light" />
                          <span className="absolute bottom-5 left-5 rounded-2xl border border-white/60 bg-white/75 px-4 py-2.5 shadow-[var(--shadow-card)] backdrop-blur-md">
                            <span className="block bg-[linear-gradient(90deg,#b85400,#f17e00)] bg-clip-text text-xl font-semibold text-transparent" style={{ fontFamily: 'var(--heading-font, var(--font-sans))' }}>
                              {a.stat.value}
                            </span>
                            <span className="block text-[0.75rem] text-graphite">{a.stat.label}</span>
                          </span>
                        </>
                      ) : (
                        <ComingSoonVisual icon={a.icon} variant={a.key} />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={a.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="p-6 sm:p-8"
                  >
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.75rem] font-medium ${a.soon ? 'bg-stone-2 text-graphite' : 'bg-[#eaf4ee] text-success'}`}>
                      <span className={`size-1.5 rounded-full ${a.soon ? 'bg-graphite/60' : 'bg-success'}`} aria-hidden />
                      {a.soon ? 'Coming soon' : 'Available now'}
                    </span>
                    <h3 className="mt-4 text-[clamp(1.5rem,1.1rem+1.2vw,2.125rem)] font-semibold leading-tight tracking-[-0.025em]" style={{ fontFamily: 'var(--heading-font, var(--font-sans))' }}>
                      {a.title}
                    </h3>
                    <p className="mt-3 max-w-[52ch] text-[1.0625rem] leading-relaxed text-graphite">{a.body}</p>
                    <div className="mt-6 flex flex-col gap-5 border-t border-hairline pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[0.75rem] font-medium text-graphite">Fits</span>
                        {a.products.map((p) => (
                          <span key={p} className="rounded-full border border-black/[0.08] bg-stone px-3 py-1 text-[0.8125rem] font-medium">
                            {p}
                          </span>
                        ))}
                      </div>
                      {a.soon ? (
                        <Link to="/contact?topic=Product%20question" className="btn btn-secondary group shrink-0 !rounded-full !px-5">
                          Register interest <ArrowRight className="btn-icon size-4" aria-hidden />
                        </Link>
                      ) : (
                        <Link to="/products/parcel-drop-box" className="btn btn-primary group shrink-0 !rounded-full !px-5">
                          Shop the Parcel Drop Box <ArrowRight className="btn-icon size-4" aria-hidden />
                        </Link>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* L — FAQ: soft cards with a dark help panel. */
export function Faq({ data, error, reload }) {
  const { s } = useSite();
  const wa = s.business_whatsapp || s.business_phone;
  return (
    <section className="py-20 sm:py-28 lg:py-32" aria-labelledby="faq-title">
      <div className="shell grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Reveal className="lg:sticky lg:top-28">
            <Kicker>FAQ</Kicker>
            <h2 id="faq-title" className="heading-premium mt-4">
              <TitleText main="Questions," soft="answered." breakSoft />
            </h2>
            <div className="grain grain-dark relative mt-8 overflow-hidden rounded-[1.25rem] bg-charcoal p-7 text-white shadow-[var(--shadow-deep)]">
              <span aria-hidden className="pointer-events-none absolute -right-20 -top-20 size-60 rounded-full bg-[radial-gradient(circle,rgb(241_126_0/0.3),transparent_65%)]" />
              <div className="relative z-[2]">
                <p className="text-title font-light">Still have a question?</p>
                <p className="mt-2 text-sm text-white/65">Talk to the boxel team directly.</p>
                <div className="mt-6 flex flex-col gap-2.5">
                  <a href={whatsappHref(wa, 'Hi boxel, I have a question.')} target="_blank" rel="noopener noreferrer" className="btn btn-signal w-full">
                    <MessageCircle className="size-4" aria-hidden /> WhatsApp us
                  </a>
                  <a href={telHref(s.business_phone)} className="btn btn-ghost-light w-full">
                    <Phone className="size-4" aria-hidden /> {formatPhone(s.business_phone)}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
        <div className="lg:col-span-8">
          {error && <ErrorState error={error} onRetry={reload} />}
          {!data && !error && (
            <div className="space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-16 rounded-2xl" aria-hidden />
              ))}
            </div>
          )}
          {data && (
            <Reveal className="space-y-3">
              {data.items.map((f, i) => (
                <AccordionItem key={f.id} question={f.question} answer={f.answer} variant="card" defaultOpen={i === 0} />
              ))}
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
