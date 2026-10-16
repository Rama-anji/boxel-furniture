import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowUpRight, Eye, ShoppingBag, Truck } from 'lucide-react';
import { Price, AvailabilityBadge } from './ProductBits.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useSite } from '../context/SiteContext.jsx';
import { shippingNote } from '../utils/format.js';
import QuickView from './QuickView.jsx';
import CatalogShowcase from './CatalogShowcase.jsx';
import { staggerItem } from './ui/Reveal.jsx';

const HEADING_FONT = { fontFamily: 'var(--heading-font, var(--font-sans))' };

export default function ProductCard({ product, layout = 'grid', priority = false }) {
  const { addItem, openDrawer } = useCart();
  const toast = useToast();
  const { s } = useSite();
  const [quick, setQuick] = useState(false);
  const firstVariant = product.variants.find((v) => v.available) || product.variants[0];
  const canBuy = product.availability === 'available' && firstVariant?.available;
  const multipleVariants = product.variants.length > 1;
  const priced = product.price > 0;
  const img = product.images[0];
  const alt = product.images[1];
  const editorial = layout === 'catalog';
  const wide = layout === 'feature';
  const lowStock = canBuy && firstVariant?.stock !== undefined && firstVariant.stock > 0 && firstVariant.stock <= 5 ? firstVariant.stock : null;

  const add = () => {
    addItem(product, firstVariant, 1);
    toast.success(`${product.name} added to your cart.`, { action: { label: 'View cart', onClick: openDrawer } });
  };

  if (editorial) return (
    <>
      <CatalogShowcase product={product} priority={priority} shipping={shippingNote(s)} onQuickView={() => setQuick(true)} onAdd={add} canBuy={canBuy} multipleVariants={multipleVariants} />
      <QuickView product={product} open={quick} onClose={() => setQuick(false)} />
    </>
  );

  return (
    <motion.article
      variants={staggerItem}
      layout="position"
      className={`group relative flex flex-col rounded-[1.75rem] border border-black/[0.07] bg-white p-2.5 shadow-[var(--shadow-card)] transition-[transform,box-shadow,border-color] duration-500 ease-[var(--ease-out-quint)] hover:-translate-y-1.5 hover:border-signal/30 hover:shadow-[0_40px_80px_-40px_rgb(241_126_0/0.45)] motion-reduce:hover:translate-y-0 ${
        wide ? 'lg:grid lg:grid-cols-12 lg:items-center lg:gap-10 lg:p-3' : ''
      }`}
    >
      {/* Image stage */}
      <div className={`relative ${wide ? 'lg:col-span-7' : ''}`}>
        <Link
          to={`/products/${product.slug}`}
          className={`relative block overflow-hidden rounded-[1.35rem] bg-[linear-gradient(180deg,var(--color-studio-top),var(--color-studio-floor))] aspect-[1309/1202]`}
          aria-label={product.name}
          tabIndex={-1}
        >
          {img && (
            <img
              src={img.url}
              alt={img.alt}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              width="1309"
              height="1202"
              className={`absolute inset-0 size-full object-cover transition-[transform,opacity] duration-[900ms] ease-[var(--ease-out-quint)] group-hover:scale-[1.05] motion-reduce:group-hover:scale-100 ${alt ? 'group-hover:opacity-0' : ''}`}
            />
          )}
          {alt && (
            <img
              src={alt.url}
              alt=""
              aria-hidden
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full scale-[1.05] object-cover opacity-0 transition-[transform,opacity] duration-[900ms] ease-[var(--ease-out-quint)] group-hover:scale-100 group-hover:opacity-100"
            />
          )}
          {/* Soft floor shadow + warm glow on hover */}
          <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(0deg,rgb(18_18_17/0.12),transparent)]" />
          <span aria-hidden className="pointer-events-none absolute -bottom-24 left-1/2 size-64 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(241_126_0/0.25),transparent_65%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        </Link>

        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <AvailabilityBadge availability={product.availability} className="shadow-sm" />
          {alt && (
            <span className="rounded-full bg-white/80 px-2 py-1 text-[0.6875rem] font-medium text-ink/70 backdrop-blur transition-opacity duration-500 group-hover:opacity-0">
              {product.images.length} photos
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setQuick(true)}
          className="absolute bottom-3 right-3 z-[2] inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-2 text-[0.8125rem] font-medium text-ink shadow-[0_10px_30px_-12px_rgb(0_0_0/0.4)] backdrop-blur-md transition-all duration-500 hover:bg-ink hover:text-white lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:focus-visible:translate-y-0 lg:focus-visible:opacity-100"
          aria-label={`Quick view ${product.name}`}
        >
          <Eye className="size-4" aria-hidden /> Quick view
        </button>
      </div>

      {/* Details */}
      <div className={`flex flex-1 flex-col px-3 pb-3 ${wide ? 'pt-6 lg:col-span-5 lg:px-0 lg:pr-10 lg:pt-0' : 'pt-5'}`}>
        <div className="flex items-center justify-between gap-3">
          {product.category && <p className="text-[0.75rem] font-semibold tracking-[0.02em] text-signal-ink">{product.category.name}</p>}
          {product.variants.length > 0 && (
            <div className="flex items-center -space-x-1" aria-label={`Available in ${product.variants.map((v) => v.name).join(', ')}`}>
              {product.variants.slice(0, 5).map((v) => (
                <span key={v.id} className="size-4 rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/0.12)]" style={{ background: v.colorHex || '#ddd' }} title={v.name} />
              ))}
              {product.variants.length > 5 && <span className="pl-2 text-[0.75rem] text-graphite">+{product.variants.length - 5}</span>}
            </div>
          )}
        </div>
        <h3 className={`${wide ? 'mt-2 text-headline font-light' : 'mt-1.5 text-[1.25rem] font-semibold leading-snug tracking-[-0.015em]'}`} style={HEADING_FONT}>
          <Link to={`/products/${product.slug}`} className="after:absolute after:inset-0 after:rounded-[1.75rem] after:content-[''] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal">
            {product.name}
          </Link>
        </h3>
        {product.shortDescription && <p className={`mt-2 text-graphite ${wide ? 'max-w-[46ch] text-lead' : 'line-clamp-2 text-[0.9375rem] leading-relaxed'}`}>{product.shortDescription}</p>}

        <div className="mt-4 flex flex-wrap items-center gap-2 text-[0.75rem]">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-stone px-2.5 py-1 font-medium text-ink/75">
            <Truck className="size-3.5 text-signal-ink" aria-hidden /> {shippingNote(s)}
          </span>
          {lowStock && <span className="rounded-full bg-signal-soft px-2.5 py-1 font-semibold text-signal-ink">Only {lowStock} left</span>}
        </div>

        {/* Price + actions */}
        <div className={`relative z-[1] mt-auto flex items-end justify-between gap-3 border-t border-hairline ${wide ? 'mt-8 pt-6' : 'mt-5 pt-4'}`}>
          <div className="min-w-0">
            <p className="text-[0.6875rem] font-medium text-graphite">Price</p>
            {priced ? (
              <Price product={product} size={wide ? 'lg' : 'base'} className="text-[1.125rem]" />
            ) : (
              <span className="h-soft text-[1.0625rem] font-semibold" style={HEADING_FONT}>
                Announcing soon
              </span>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {canBuy && !multipleVariants ? (
              <button type="button" onClick={add} className="btn btn-primary btn-sm !rounded-full" aria-label={`Add ${product.name} to cart`}>
                <ShoppingBag className="size-4" aria-hidden /> Add
              </button>
            ) : null}
            {wide && (
              <Link to={`/products/${product.slug}`} className="btn btn-secondary btn-sm hidden !rounded-full sm:inline-flex" tabIndex={-1} aria-hidden>
                View details
              </Link>
            )}
            <Link
              to={`/products/${product.slug}`}
              className="grid size-10 place-items-center rounded-full bg-ink text-white transition-all duration-500 group-hover:rotate-45 group-hover:bg-[linear-gradient(135deg,#f17e00,#ff9a2e)] motion-reduce:group-hover:rotate-0"
              aria-label={canBuy && multipleVariants ? `Choose a colour for ${product.name}` : `View ${product.name}`}
            >
              <ArrowUpRight className="size-[1.1rem]" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
      <QuickView product={product} open={quick} onClose={() => setQuick(false)} />
    </motion.article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div aria-hidden className="rounded-[1.75rem] border border-black/[0.05] bg-white p-2.5">
      <div className="skeleton aspect-[1309/1202] w-full rounded-[1.35rem]" />
      <div className="px-3 pb-3">
        <div className="skeleton mt-5 h-3 w-24" />
        <div className="skeleton mt-2 h-5 w-3/4" />
        <div className="skeleton mt-3 h-4 w-full" />
        <div className="skeleton mt-6 h-8 w-1/3" />
      </div>
    </div>
  );
}
