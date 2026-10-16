import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, ArrowUpRight, Eye, KeyRound, ShieldCheck, Users, Truck, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Price, AvailabilityBadge } from './ProductBits.jsx';
import { staggerItem } from './ui/Reveal.jsx';

export default function CatalogShowcase({ product, priority, shipping, onQuickView, onAdd, canBuy, multipleVariants }) {
  const [selected, setSelected] = useState(0);
  const photos = product.images || [];
  const photo = photos[selected] || photos[0];
  const priced = product.price > 0 && product.availability !== 'price_not_set';
  const parcel = product.slug === 'parcel-drop-box';

  return (
    <motion.article variants={staggerItem} className="catalog-showcase overflow-hidden rounded-[1.75rem] border border-black/[0.09] bg-[#faf9f6] sm:rounded-[2rem]">
      <div className="grid lg:grid-cols-[1.05fr_1fr]">
        <div className="relative flex flex-col border-b border-black/[0.06] bg-[#e9e8e4] lg:border-b-0 lg:border-r">
          <div className="catalog-showcase-image relative aspect-square w-full overflow-hidden sm:aspect-[6/5] lg:aspect-square">
            {photo ? <img src={photo.url} alt={photo.alt || product.name} loading={priority ? 'eager' : 'lazy'} decoding="async" width="1309" height="1202" className="absolute inset-0 size-full object-contain p-8 mix-blend-multiply sm:p-10" /> : <div className="grid h-full place-items-center text-sm text-graphite">Product photography coming soon</div>}
          </div>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 px-5 pb-5 sm:px-7 sm:pb-7">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Product photos">
              {photos.map((image, i) => <button key={image.id || image.url} type="button" onClick={() => setSelected(i)} aria-label={`Show photo ${i + 1} of ${product.name}`} aria-pressed={selected === i} className={`size-12 overflow-hidden rounded-lg border bg-white/70 p-1 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal sm:size-14 ${selected === i ? 'border-ink' : 'border-black/10 hover:border-black/40'}`}><img src={image.url} alt="" loading="lazy" className="size-full object-contain mix-blend-multiply" /></button>)}
            </div>
            <button type="button" onClick={onQuickView} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-black/10 bg-white/75 px-4 text-xs font-medium transition-colors hover:bg-white"><Eye className="size-4" aria-hidden />Quick view</button>
          </div>
        </div>
        <div className="flex flex-col p-6 sm:p-9 lg:p-10 xl:p-12">
          <div className="flex items-center gap-2 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-graphite"><span className="size-1.5 rounded-full bg-signal" aria-hidden />{product.category?.name || 'The collection'}</div>
          <h3 className="mt-5 text-[clamp(2rem,3.5vw,3.5rem)] font-medium leading-[1.04] tracking-[-0.045em]"><Link to={`/products/${product.slug}`} className="hover:text-ink/70">{product.name}</Link></h3>
          {product.shortDescription && <p className="mt-5 max-w-[42ch] text-sm leading-relaxed text-graphite sm:text-base">{product.shortDescription}</p>}
          {parcel && <div className="my-7 grid grid-cols-3 border-y border-black/[0.08] py-5">
            {[{ Icon: ShieldCheck, title: 'All-metal', detail: 'Construction' }, { Icon: KeyRound, title: 'Keyless', detail: 'Number lock' }, { Icon: Users, title: '3–4 homes', detail: 'One shared unit' }].map(({ Icon, title, detail }) => <div key={title} className="px-2 first:pl-0"><Icon className="mb-3 size-5 text-ink/70" strokeWidth={1.4} aria-hidden /><p className="text-xs font-medium sm:text-sm">{title}</p><p className="mt-1 text-[0.625rem] text-graphite sm:text-xs">{detail}</p></div>)}
          </div>}
          <div className="mt-auto pt-5">
            {priced ? <div className="mb-5"><Price product={product} size="lg" /><div className="mt-2"><AvailabilityBadge availability={product.availability} /></div></div> : <div className="mb-5 border-l-2 border-signal pl-4"><p className="text-sm font-medium">Pricing will be announced soon.</p><p className="mt-1 text-xs leading-relaxed text-graphite">Explore the details or talk to us about your requirements.</p>{product.availability !== 'price_not_set' && <div className="mt-2"><AvailabilityBadge availability={product.availability} /></div>}</div>}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to={`/products/${product.slug}`} className="btn btn-primary flex-1 !rounded-xl">Explore product <ArrowRight className="size-4" aria-hidden /></Link>
              {canBuy && priced && !multipleVariants ? <button type="button" onClick={onAdd} className="btn btn-secondary !rounded-xl"><ShoppingBag className="size-4" aria-hidden />Add to cart</button> : <Link to="/contact" className="btn btn-secondary !rounded-xl">Enquire <ArrowUpRight className="size-4" aria-hidden /></Link>}
            </div>
            <p className="mt-5 flex items-center gap-2 text-xs text-graphite"><Truck className="size-4 shrink-0" strokeWidth={1.5} aria-hidden />{shipping}</p>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
