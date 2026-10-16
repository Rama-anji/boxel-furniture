import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowDownRight, ArrowUpRight, MoveUpRight } from 'lucide-react';

export default function UpcomingStudio({ ideas }) {
  const [selected, setSelected] = useState(0);
  const idea = ideas[selected];
  if (!idea) return null;

  return (
    <section className="mt-16 overflow-hidden border-y border-black/15 sm:mt-20" aria-labelledby="studio-title">
      <div className="flex flex-wrap items-end justify-between gap-5 py-7 sm:py-9">
        <div>
          <p className="text-[0.625rem] font-semibold uppercase tracking-[0.22em] text-graphite">The design notebook</p>
          <h3 id="studio-title" className="mt-3 text-[clamp(1.75rem,3vw,2.5rem)] font-medium tracking-[-0.04em]">Ideas taking shape.</h3>
        </div>
        <span className="flex items-center gap-3 text-xs text-graphite">Explore what’s next <ArrowDownRight className="size-5" strokeWidth={1.4} aria-hidden /></span>
      </div>
      <div className="grid border-t border-black/10 lg:grid-cols-[0.9fr_1.4fr]">
        <div className="border-b border-black/10 lg:border-b-0 lg:border-r" role="group" aria-label="Upcoming product ideas">
          {ideas.map((item, i) => (
            <button key={item.name} type="button" aria-pressed={selected === i} aria-controls="studio-detail" onClick={() => setSelected(i)} className={`group flex w-full items-start gap-4 border-b border-black/10 px-4 py-6 text-left transition-colors last:border-b-0 focus-visible:relative focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-signal sm:px-6 ${selected === i ? 'bg-[#eae7de] text-ink' : 'bg-[#faf9f6] text-graphite hover:bg-[#f1efe8]'}`}>
              <span className="pt-1 font-mono text-xs opacity-50" aria-hidden>0{i + 1}</span>
              <span className="min-w-0 flex-1"><span className="block text-[0.5625rem] uppercase tracking-[0.18em]">{item.name === 'More to come' ? 'Next' : 'Coming soon'}</span><span className="mt-2 block text-base font-medium leading-snug tracking-tight sm:text-lg">{item.name}</span></span>
              <MoveUpRight className={`mt-1 size-4 shrink-0 transition-transform ${selected === i ? 'rotate-45 text-ink' : 'opacity-40 group-hover:rotate-45 motion-reduce:transform-none'}`} aria-hidden />
            </button>
          ))}
        </div>
        <div id="studio-detail" role="region" aria-label="Selected product idea" aria-live="polite" aria-atomic="true" className="relative isolate flex min-h-[390px] flex-col overflow-hidden bg-[#f2f0e9] p-6 sm:p-10 lg:p-12">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-40 [background-image:linear-gradient(#d8d5ca_1px,transparent_1px),linear-gradient(90deg,#d8d5ca_1px,transparent_1px)] [background-size:32px_32px]" />
          <div className="flex items-center justify-between gap-3 border-b border-black/15 pb-5">
            <span className="text-[0.625rem] font-medium uppercase tracking-[0.2em] text-graphite">Concept / 0{selected + 1}</span>
            <span className="rounded-sm border border-ink/25 px-2 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-graphite">{idea.name === 'More to come' ? 'Next' : 'Coming soon'}</span>
          </div>
          <div key={idea.name} className="relative py-8">
            <h4 className="max-w-[22ch] text-[clamp(1.75rem,3vw,2.75rem)] font-medium leading-[1.1] tracking-[-0.04em]">{idea.name}</h4>
            <p className="mt-5 max-w-[53ch] text-sm leading-[1.85] text-ink/70 sm:text-base">{idea.body}</p>
          </div>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-black/15 pt-5">
            <span className="font-mono text-[0.625rem] tracking-wider text-graphite">BOXEL / WHAT’S NEXT</span>
            <Link to="/contact?topic=Product%20question" className="group inline-flex min-h-10 items-center gap-3 text-sm font-medium underline-offset-4 hover:underline">Talk to us about this idea <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 motion-reduce:transform-none" aria-hidden /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
