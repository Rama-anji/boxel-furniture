import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, SlidersHorizontal, X } from 'lucide-react';
import CatalogFilters from '../components/CatalogFilters.jsx';
import Seo from '../components/ui/Seo.jsx';
import { breadcrumbJsonLd } from '../components/ui/Breadcrumbs.jsx';
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard.jsx';
import { ErrorState } from '../components/ui/States.jsx';
import Reveal, { stagger, staggerItem } from '../components/ui/Reveal.jsx';
import { Kicker, TitleText } from '../components/ui/Heading.jsx';
import { useApi, useDebounced } from '../hooks/useApi.js';
import { qs } from '../services/api.js';

// The catalogue quietly re-checks itself so admin changes (new products, prices, stock) appear without a reload.
const LIVE_MS = 20000;
const HEADING_FONT = { fontFamily: 'var(--heading-font, var(--font-sans))' };

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'newest', label: 'Newest' },
];
const AVAIL = [
  { value: 'all', label: 'All products' },
  { value: 'available', label: 'Ready to order' },
  { value: 'coming_soon', label: 'Coming soon' },
];

export default function Products() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || '';
  const availability = params.get('availability') || 'all';
  const sort = params.get('sort') || 'featured';
  const page = Number(params.get('page')) || 1;
  const searchParam = params.get('search') || '';
  const [search, setSearch] = useState(searchParam);
  const debounced = useDebounced(search.trim(), 350);

  const update = (patch) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(patch)) {
      if (!v || (k === 'availability' && v === 'all') || (k === 'sort' && v === 'featured') || (k === 'page' && v === 1)) next.delete(k);
      else next.set(k, v);
    }
    if (!('page' in patch)) next.delete('page');
    setParams(next, { replace: true });
  };

  useEffect(() => {
    if (searchParam !== debounced) update({ search: debounced });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);
  useEffect(() => setSearch(params.get('search') || ''), [params]);

  const categories = useApi('/categories', { live: LIVE_MS });
  const list = useApi(`/products${qs({ search: searchParam, category, availability, sort, page, limit: 12 })}`, { live: LIVE_MS });
  const cats = categories.data?.items || [];
  const activeCategory = cats.find((c) => c.slug === category);
  const items = list.data?.items || [];
  const meta = list.data?.meta;
  const title = activeCategory ? activeCategory.name : 'Products';
  const crumbs = [{ label: 'Home', to: '/' }, { label: 'Products', to: '/products' }, ...(activeCategory ? [{ label: activeCategory.name }] : [])];
  const filtered = Boolean(category || searchParam || availability !== 'all');

  const upcoming = cats.filter((c) => c.status === 'coming_soon');
  const showUpcoming = !category && !searchParam && availability !== 'available' && page === 1 && upcoming.length > 0;

  return (
    <>
      <Seo
        title={activeCategory?.seo_title?.replace(/ — boxel$/, '') || title}
        description={activeCategory?.seo_description || activeCategory?.description || 'Shop boxel products — secure parcel drop boxes, with personal lockers and wall-hung workspaces coming soon.'}
        canonicalPath={category ? `/products?category=${category}` : '/products'}
        jsonLd={breadcrumbJsonLd(crumbs)}
      />

      <section className="w-full overflow-hidden border-b border-[#dedbd3] bg-[#f4f2ec]" aria-labelledby="catalog-banner-title">
        <div className="shell grid gap-6 py-6 sm:py-7 md:grid-cols-[1.6fr_1fr] md:items-center lg:gap-14 lg:py-8">
          <div className="relative flex flex-col items-start justify-center">
            <span className="mb-4 flex items-center gap-2.5 text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-graphite"><span className="size-1.5 rounded-full bg-signal" aria-hidden />Thoughtfully made. Everyday useful.</span>
            <h1 id="catalog-banner-title" className="max-w-[20ch] text-[clamp(2rem,3.2vw,2.75rem)] font-medium leading-[1.1] tracking-[-0.045em] text-ink" style={HEADING_FONT}>
              {activeCategory ? activeCategory.name : <>A little smarter.<br /><span className="text-ink/50">A lot more home.</span></>}
            </h1>
            <p className="mt-4 max-w-[45ch] text-[0.8125rem] leading-relaxed text-graphite">{activeCategory?.description || 'Considered design for the way you live. Discover practical essentials that make coming home feel better.'}</p>
            <a href="#catalog" className="btn btn-primary group mt-4 !min-h-10 !rounded-full !px-6">Explore the collection <ArrowRight className="btn-icon size-4" aria-hidden /></a>
          </div>
          <div className="contact-banner-stage !py-4">
            <div className="contact-banner-orbit" aria-hidden />
            <div className="contact-banner-platform" aria-hidden />
            <div className="contact-banner-card relative rounded-[1.5rem] border border-white/80 bg-[#e9e7df] p-3">
              <span className="contact-banner-badge !size-12 !rounded-2xl" aria-hidden><ArrowUpRight className="size-6" strokeWidth={1.4} /></span>
              <img src="/images/parcel-drop-box-front.jpeg" alt="White boxel parcel drop box with a delivery slot and lockable compartment" width="1309" height="1202" fetchPriority="high" className="h-44 w-full object-contain mix-blend-multiply sm:h-48" />
              <Link to="/products/parcel-drop-box" className="relative mt-2 flex items-center justify-between gap-4 rounded-xl border border-white/60 bg-white/90 px-4 py-3 text-xs font-medium transition-colors hover:bg-white">Meet the boxel parcel drop box<ArrowUpRight className="size-4 shrink-0" aria-hidden /></Link>
            </div>
          </div>
        </div>
      </section>

      <section id="catalog" className="shell scroll-mt-28 pb-24 pt-12 sm:pt-16">
        <CatalogFilters cats={cats} category={category} update={update} search={search} setSearch={setSearch} availability={availability} sort={sort} availabilityOptions={AVAIL} sortOptions={SORTS} />

        {/* Result line */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <p className={`${!filtered && meta?.total === 1 ? 'sr-only' : 'flex flex-wrap items-center gap-2 text-sm text-graphite'}`} role="status" aria-live="polite">
            <SlidersHorizontal className="size-4" aria-hidden />
            {list.loading ? (
              'Loading products…'
            ) : meta ? (
              <>
                <span className="font-semibold text-ink">{meta.total}</span> product{meta.total === 1 ? '' : 's'}
                {searchParam && <> for “{searchParam}”</>}
              </>
            ) : null}
          </p>
          {filtered && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setParams({}, { replace: true });
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-[0.8125rem] font-medium text-ink transition-colors hover:border-ink"
            >
              <X className="size-3.5" aria-hidden /> Clear filters
            </button>
          )}
        </div>

        {/* ── Grid ─────────────────────────────────────────────────── */}
        <div className="mt-6">
          {list.error && !list.data && <ErrorState error={list.error} onRetry={list.reload} />}
          {list.loading && !list.data && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}
          {list.data && items.length === 0 && (
            <div className="grain grain-dark relative overflow-hidden rounded-[1.75rem] bg-charcoal px-6 py-14 text-white shadow-[var(--shadow-deep)] sm:px-12">
              <span aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-[radial-gradient(circle,rgb(241_126_0/0.3),transparent_65%)]" />
              <div className="relative">
                <span className="tile text-2xl" aria-hidden />
                {activeCategory?.status === 'coming_soon' || availability === 'coming_soon' ? (
                  <>
                    <h2 className="mt-5 text-[1.75rem] font-semibold tracking-[-0.02em]" style={HEADING_FONT}>
                      {activeCategory ? `${activeCategory.name} is coming soon` : 'More products are coming soon'}
                    </h2>
                    <p className="mt-2 max-w-[52ch] text-white/65">
                      These products are being designed and cannot be ordered yet. Contact us to register your interest and we will let you know when they launch.
                    </p>
                    <div className="mt-7 flex flex-wrap gap-3">
                      <Link to="/contact" className="btn btn-signal group !rounded-full">
                        Register interest <ArrowRight className="btn-icon size-4" aria-hidden />
                      </Link>
                      <button type="button" onClick={() => update({ category: '', availability: 'all' })} className="btn btn-ghost-light !rounded-full">
                        See available products
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="mt-5 text-[1.75rem] font-semibold tracking-[-0.02em]" style={HEADING_FONT}>
                      No products match these filters
                    </h2>
                    <p className="mt-2 text-white/65">Try a different search or clear the filters.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearch('');
                        setParams({}, { replace: true });
                      }}
                      className="btn btn-signal mt-7 !rounded-full"
                    >
                      Clear filters
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
          {items.length > 0 && (
            <motion.div key={params.toString()} className={`grid gap-6 ${items.length > 1 ? 'sm:grid-cols-2 lg:grid-cols-3' : ''}`} variants={stagger} initial="hidden" animate="show">
              {items.map((p, i) => (
                <ProductCard key={p.id} product={p} priority={i < 3} layout={items.length === 1 ? 'catalog' : 'grid'} />
              ))}
            </motion.div>
          )}
        </div>

        {meta && meta.pages > 1 && (
          <nav className="mt-16 flex items-center justify-center gap-2" aria-label="Pagination">
            <button type="button" className="btn btn-secondary btn-sm !rounded-full" disabled={page <= 1} onClick={() => update({ page: page - 1 })}>
              Previous
            </button>
            <span className="rounded-full bg-stone px-4 py-2 text-sm text-graphite">
              Page {meta.page} of {meta.pages}
            </span>
            <button type="button" className="btn btn-secondary btn-sm !rounded-full" disabled={page >= meta.pages} onClick={() => update({ page: page + 1 })}>
              Next
            </button>
          </nav>
        )}

        {/* ── Coming soon (from the categories marked "coming soon" in admin) ── */}
        {showUpcoming && (
          <div className="mt-20">
            <Reveal className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Kicker>Coming soon</Kicker>
                <h2 className="heading-premium mt-4 !text-[clamp(1.875rem,1.3rem+1.8vw,2.75rem)]">
                  <TitleText main="Next from" soft="boxel." />
                </h2>
              </div>
              <Link to="/contact" className="link text-sm font-medium">
                Register your interest
              </Link>
            </Reveal>
            <motion.ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
              {upcoming.map((c, i) => (
                <motion.li key={c.id} variants={staggerItem}>
                  <button
                    type="button"
                    onClick={() => {
                      update({ category: c.slug });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="grain grain-dark group relative flex h-full w-full flex-col overflow-hidden rounded-[1.75rem] bg-charcoal p-6 text-left text-white shadow-[var(--shadow-deep)] transition-transform duration-500 hover:-translate-y-1.5 motion-reduce:hover:translate-y-0 sm:p-7"
                  >
                    <span aria-hidden className="pointer-events-none absolute -right-20 -top-20 size-60 rounded-full bg-[radial-gradient(circle,rgb(241_126_0/0.3),transparent_65%)] transition-transform duration-700 group-hover:scale-125" />
                    <span className="relative flex items-center justify-between">
                      <span className="text-[0.75rem] font-semibold text-signal">0{i + 1}</span>
                      <span className="rounded-full bg-white/[0.08] px-2.5 py-1 text-[0.6875rem] font-semibold text-white/75 ring-1 ring-white/10">Coming soon</span>
                    </span>
                    <span className="relative mt-10 block text-[1.375rem] font-semibold leading-snug tracking-[-0.015em]" style={HEADING_FONT}>
                      <span className="bg-[linear-gradient(90deg,#ffffff,#ffc27a)] bg-clip-text text-transparent">{c.name}</span>
                    </span>
                    {c.description && <span className="relative mt-2 block text-[0.9375rem] leading-relaxed text-white/60">{c.description}</span>}
                    <span className="relative mt-auto flex items-center justify-between pt-8 text-sm font-medium text-white/80">
                      Explore
                      <span className="grid size-10 place-items-center rounded-full bg-white/10 transition-all duration-500 group-hover:rotate-45 group-hover:bg-signal group-hover:text-ink">
                        <ArrowUpRight className="size-[1.1rem]" aria-hidden />
                      </span>
                    </span>
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        )}
      </section>
    </>
  );
}
