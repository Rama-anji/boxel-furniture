import { ArrowUpRight, Search } from 'lucide-react';

export default function CatalogFilters({ cats, category, update, search, setSearch, availability, sort, availabilityOptions, sortOptions }) {
  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-graphite">The collection</p>
          <h2 className="mt-3 text-[clamp(1.75rem,3vw,2.75rem)] font-medium leading-tight tracking-[-0.04em]">Find your everyday essential.</h2>
        </div>
        <p className="max-w-[30ch] text-sm leading-relaxed text-graphite">Purposeful pieces. Considered details. A place in your home.</p>
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5" role="group" aria-label="Filter by category">
        {[{ id: 'all', slug: '', name: 'All collections' }, ...cats].map((c, i) => {
          const active = category === c.slug;
          return (
            <button key={c.id} type="button" onClick={() => update({ category: c.slug })} aria-pressed={active}
              className={`group flex min-h-32 flex-col items-start justify-between rounded-2xl border p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal ${active ? 'border-ink bg-[#252a25] text-white' : 'border-black/[0.08] bg-[#f7f6f2] text-ink hover:border-black/25 hover:bg-[#eeece5]'}`}>
              <span className="flex w-full items-center justify-between gap-2">
                <span className="text-[0.625rem] font-medium tracking-widest opacity-50">{String(i + 1).padStart(2, '0')}</span>
                {c.status === 'coming_soon' ? <span className={`rounded-full px-2 py-1 text-[0.5625rem] uppercase tracking-wider ${active ? 'bg-white/10 text-white/80' : 'bg-black/[0.04] text-graphite'}`}>Coming soon</span> : <ArrowUpRight className="size-4 opacity-60" aria-hidden />}
              </span>
              <span className="mt-5 text-sm font-medium leading-snug">{c.name}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-7 grid gap-4 border-y border-black/[0.08] py-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="lg:max-w-80">
          <label htmlFor="catalog-search" className="mb-2 block text-[0.6875rem] font-medium text-graphite">Find a product</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-graphite" aria-hidden />
            <input id="catalog-search" type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search the collection" className="field !rounded-xl !bg-[#faf9f6] pl-10" maxLength={80} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="avail" className="mb-2 block text-[0.6875rem] font-medium text-graphite">Availability</label>
            <select id="avail" className="field !rounded-xl text-sm lg:min-w-44" value={availability} onChange={(e) => update({ availability: e.target.value })}>
              {availabilityOptions.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="sort" className="mb-2 block text-[0.6875rem] font-medium text-graphite">Sort by</label>
            <select id="sort" className="field !rounded-xl text-sm lg:min-w-44" value={sort} onChange={(e) => update({ sort: e.target.value })}>
              {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
      </div>
    </>
  );
}
