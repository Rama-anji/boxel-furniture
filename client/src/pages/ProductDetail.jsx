import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, ShieldCheck, Truck, Video } from 'lucide-react';
import Seo, { absUrl } from '../components/ui/Seo.jsx';
import Breadcrumbs, { breadcrumbJsonLd } from '../components/ui/Breadcrumbs.jsx';
import ProductGallery from '../components/ProductGallery.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Reviews from '../components/Reviews.jsx';
import Accordion from '../components/ui/Accordion.jsx';
import Reveal, { stagger } from '../components/ui/Reveal.jsx';
import { Price, AvailabilityBadge, QuantityStepper, VariantPicker, Stars } from '../components/ProductBits.jsx';
import { PageLoader, ErrorState } from '../components/ui/States.jsx';
import NotFound from './NotFound.jsx';
import { useApi } from '../hooks/useApi.js';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useSite } from '../context/SiteContext.jsx';
import { paragraphs, whatsappHref, shippingNote } from '../utils/format.js';

// How often the open page quietly re-checks price, stock and content (also on returning to the tab).
const LIVE_MS = 20000;

function productJsonLd(p) {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    sku: p.sku,
    description: p.shortDescription || undefined,
    image: p.images.map((i) => absUrl(i.url)),
    brand: { '@type': 'Brand', name: 'boxel' },
    category: p.category?.name,
  };
  // Offers and ratings are only published when they are real.
  const price = p.salePrice ?? p.price;
  if (p.availability === 'available' && price > 0) {
    ld.offers = {
      '@type': 'Offer',
      url: absUrl(`/products/${p.slug}`),
      priceCurrency: 'INR',
      price: price.toFixed(2),
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    };
  }
  if (p.rating?.count > 0) ld.aggregateRating = { '@type': 'AggregateRating', ratingValue: p.rating.average.toFixed(1), reviewCount: p.rating.count };
  return ld;
}

function Assurance({ icon: Icon, children }) {
  return (
    <li className="group flex gap-3.5 py-4">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-stone text-ink transition-colors duration-300 group-hover:bg-signal-soft group-hover:text-signal-ink">
        <Icon className="size-[1.05rem]" strokeWidth={1.6} aria-hidden />
      </span>
      <span className="pt-1.5">{children}</span>
    </li>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const { data, error, loading, reload } = useApi(`/products/${encodeURIComponent(slug)}`, { keepPrevious: false, live: LIVE_MS });
  const generalFaqs = useApi('/faqs', { live: LIVE_MS * 3 });
  const { addItem, openDrawer } = useCart();
  const toast = useToast();
  const { s } = useSite();
  const navigate = useNavigate();
  const product = data?.product;
  const [variantId, setVariantId] = useState(null);
  const [qty, setQty] = useState(1);
  // Sticky buy bar: appears once the main Add-to-cart has scrolled out of view above.
  const buyRef = useRef(null);
  const [buyOffscreen, setBuyOffscreen] = useState(false);
  const canBuyNow = product?.availability === 'available';
  useEffect(() => {
    const el = buyRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => setBuyOffscreen(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, [product?.id, canBuyNow]);
  useEffect(() => {
    if (buyOffscreen) document.body.dataset.buybar = '';
    else delete document.body.dataset.buybar;
    return () => delete document.body.dataset.buybar;
  }, [buyOffscreen]);

  // A new product resets the choices; a live refresh of the same product keeps them,
  // only moving off a colour that has just become unavailable.
  const productId = product?.id;
  useEffect(() => {
    if (!product) return;
    setVariantId((cur) => {
      const still = product.variants.find((v) => v.id === cur && v.available);
      return still ? cur : (product.variants.find((v) => v.available) || product.variants[0])?.id ?? null;
    });
  }, [product]);
  useEffect(() => setQty(1), [productId]);

  if (error?.status === 404) return <NotFound message="This product does not exist or is no longer available." />;
  if (error && !product) return <div className="shell py-20"><ErrorState error={error} onRetry={reload} /></div>;
  if (loading || !product) return <PageLoader />;

  const variant = product.variants.find((v) => v.id === variantId);
  const canBuy = product.availability === 'available' && variant?.available;
  const max = Math.max(1, variant?.stock !== undefined ? Math.min(10, variant.stock) : 10);
  const crumbs = [
    { label: 'Home', to: '/' },
    { label: 'Products', to: '/products' },
    ...(product.category ? [{ label: product.category.name, to: `/products?category=${product.category.slug}` }] : []),
    { label: product.name, to: `/products/${product.slug}` },
  ];
  const faqs = product.faqs.length ? product.faqs : generalFaqs.data?.items?.slice(0, 6) || [];

  const add = (buyNow = false) => {
    const q = Math.min(qty, max);
    addItem(product, variant, q);
    if (buyNow) navigate('/checkout');
    else toast.success(`${q} × ${product.name} (${variant.name}) added to your cart.`, { action: { label: 'View cart', onClick: openDrawer } });
  };

  const notice = {
    coming_soon: 'This product is coming soon and cannot be ordered yet. Contact us to register your interest.',
    price_not_set: 'This product is not open for online orders yet. Call or WhatsApp us to know more.',
    out_of_stock: 'This product is out of stock right now. Contact us to know when it will be available again.',
    unavailable: 'This product is not available to order right now.',
  }[product.availability];

  return (
    <>
      <Seo title={product.seo.title} description={product.seo.description} image={product.seo.image} type="product" jsonLd={[productJsonLd(product), breadcrumbJsonLd(crumbs)]} />

      <section className="shell pb-16 pt-8 sm:pt-10">
        <Breadcrumbs items={crumbs} />
        <div className="mt-6 grid gap-10 lg:mt-8 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-7">
            <div className="lg:sticky lg:top-24">
              <ProductGallery images={product.images} name={product.name} />
            </div>
          </div>

          <motion.div className="min-w-0 lg:col-span-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <AvailabilityBadge availability={product.availability} />
            <h1 className="mt-4 text-headline font-light text-balance" style={{ fontFamily: 'var(--heading-font, var(--font-sans))' }}>
              {product.name}
            </h1>
            {product.rating && (
              <a href="#reviews-title" className="mt-3 inline-flex items-center gap-2 text-sm text-graphite hover:text-ink">
                <Stars value={product.rating.average} /> {product.rating.average.toFixed(1)} · {product.rating.count} review{product.rating.count === 1 ? '' : 's'}
              </a>
            )}
            <div className="mt-5" aria-live="polite">
              <Price product={product} variant={variant} size="lg" />
              {product.price > 0 && <p className="mt-1 text-sm text-graphite">{shippingNote(s)}</p>}
            </div>
            {product.shortDescription && <p className="mt-6 text-lead text-graphite">{product.shortDescription}</p>}

            <div className="mt-8 space-y-6 border-t border-hairline pt-8">
              <VariantPicker variants={product.variants} value={variantId} onChange={setVariantId} />
              {canBuy ? (
                <div className="space-y-3" ref={buyRef}>
                  <div className="flex flex-wrap items-center gap-3">
                    <QuantityStepper value={Math.min(qty, max)} onChange={(q) => setQty(Math.max(1, Math.min(max, q)))} max={max} />
                    <button type="button" onClick={() => add(false)} className="btn btn-primary flex-1">
                      Add to cart
                    </button>
                  </div>
                  <button type="button" onClick={() => add(true)} className="btn btn-secondary w-full">
                    Buy now
                  </button>
                  {variant?.stock !== undefined && variant.stock > 0 && variant.stock <= 5 && (
                    <p className="text-sm text-signal-ink" aria-live="polite">
                      Only {variant.stock} left in this colour.
                    </p>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border border-hairline bg-stone p-5" role="status" aria-live="polite">
                  <p>{notice}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a href={whatsappHref(s.business_whatsapp || s.business_phone, `Hi boxel, I'm interested in the ${product.name}.`)} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                      <MessageCircle className="size-4" aria-hidden /> WhatsApp us
                    </a>
                    <Link to="/contact" className="btn btn-secondary btn-sm">
                      Send a message
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <ul className="mt-8 divide-y divide-hairline border-y border-hairline text-[0.9375rem]">
              {product.shippingInfo && (
                <Assurance icon={Truck}>
                  {product.shippingInfo}{' '}
                  <Link to="/shipping-returns" className="link text-graphite">
                    Shipping details
                  </Link>
                </Assurance>
              )}
              <Assurance icon={Video}>Made to order. We share a video of its quality and functions before it ships.</Assurance>
              {product.warrantyInfo && (
                <Assurance icon={ShieldCheck}>
                  {product.warrantyInfo}{' '}
                  <Link to="/shipping-returns#warranty" className="link text-graphite">
                    Warranty policy
                  </Link>
                </Assurance>
              )}
            </ul>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-hairline bg-stone py-16 sm:py-20" aria-labelledby="details-title">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <h2 id="details-title" className="text-headline font-light" style={{ fontFamily: 'var(--heading-font, var(--font-sans))' }}>
              About this product
            </h2>
            <div className="prose-boxel mt-6 max-w-[62ch] text-graphite">
              {paragraphs(product.description).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {product.features.length > 0 && (
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <span className="tile text-[0.7rem]" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
          {product.specifications.length > 0 && (
            <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8">
              <h2 className="text-title font-medium" style={{ fontFamily: 'var(--heading-font, var(--font-sans))' }}>
                Specifications
              </h2>
              <dl className="mt-6 border-t border-hairline">
                {product.specifications.map((sp) => (
                  <div key={sp.label} className="grid grid-cols-2 gap-4 border-b border-hairline py-3.5 text-[0.9375rem] transition-colors hover:bg-white/60">
                    <dt className="text-graphite">{sp.label}</dt>
                    <dd>{sp.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}
        </div>
      </section>

      <div className="shell">
        <Reviews product={product} />

        {faqs.length > 0 && (
          <section className="grid gap-12 border-t border-hairline py-16 sm:py-20 lg:grid-cols-12" aria-labelledby="pfaq-title">
            <h2 id="pfaq-title" className="text-headline font-light lg:col-span-4" style={{ fontFamily: 'var(--heading-font, var(--font-sans))' }}>
              Questions about the {product.name.replace(/^boxel\s+/i, '')}
            </h2>
            <div className="lg:col-span-8">
              <Accordion items={faqs} />
            </div>
          </section>
        )}

        {data.related.length > 0 && (
          <section className="border-t border-hairline py-16 sm:py-20" aria-labelledby="related-title">
            <h2 id="related-title" className="text-headline font-light" style={{ fontFamily: 'var(--heading-font, var(--font-sans))' }}>
              You may also like
            </h2>
            <motion.div className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
              {data.related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </motion.div>
          </section>
        )}
      </div>

      <AnimatePresence>
        {canBuy && buyOffscreen && (
          <motion.div
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            exit={{ y: '110%' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-white/90 pb-[env(safe-area-inset-bottom)] shadow-[0_-12px_40px_-20px_rgb(23_23_23/0.3)] backdrop-blur-xl"
            role="region"
            aria-label="Quick purchase"
          >
            <div className="shell flex items-center gap-4 py-3">
              <span className="hidden size-12 shrink-0 overflow-hidden rounded-lg bg-stone sm:block">
                {product.images[0] && <img src={product.images[0].url} alt="" className="size-full object-cover" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{product.name}</span>
                <span className="block text-[0.8125rem] text-graphite">
                  {variant?.name} · <Price product={product} variant={variant} className="text-ink" />
                </span>
              </span>
              <button type="button" onClick={() => add(false)} className="btn btn-primary btn-sm shrink-0">
                Add to cart
              </button>
              <button type="button" onClick={() => add(true)} className="btn btn-secondary btn-sm hidden shrink-0 sm:inline-flex">
                Buy now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
