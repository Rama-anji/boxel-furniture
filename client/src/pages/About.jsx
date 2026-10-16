import { Link } from 'react-router';
import { ArrowDown, ArrowRight, ArrowUpRight, Building2, BriefcaseBusiness, Clock3, HeartHandshake, House, LockKeyhole, ShieldCheck, Maximize2, Zap, Phone, MessageCircle, Mail } from 'lucide-react';
import Seo from '../components/ui/Seo.jsx';
import UpcomingStudio from '../components/UpcomingStudio.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import { formatPhone, telHref, whatsappHref } from '../utils/format.js';
import { useSite } from '../context/SiteContext.jsx';
import { Kicker, TitleText } from '../components/ui/Heading.jsx';

const BELIEFS = [
  { title: 'Safety should be simple.', body: 'Locking something safe shouldn’t mean carrying keys or worrying.' },
  { title: 'Your time is valuable.', body: 'No waiting at home for a delivery. No climbing stairs just to carry a charger.' },
  { title: 'Your family’s safety comes first.', body: 'Smart design can keep strangers at the door and valuables out of sight.' },
  { title: 'Good design fits Indian life.', body: 'We design for real homes, real apartments, real offices and real budgets.' },
];

const COMING = [
  {
    name: 'boxel Personal Locker',
    body: 'A compact, secure locker for high-value gadgets — on a desk, mounted on a wall or standing on the floor. The floor-standing version is envisioned as an EV charger holder, so you don’t have to carry your charger up the stairs or in your bike or car every day.',
  },
  { name: 'boxel Wall-Hung Workstation', body: 'A space-saving workspace that fits against the wall, for small homes and busy offices.' },
  { name: 'boxel Wall-Hung Accessories', body: 'Smart storage that frees your floor and keeps things organised.' },
  { name: 'More to come', body: 'We keep designing new ideas for the Indian market.' },
];

const BUILD = [
  'Secure, tamper-resistant design',
  'Weather protection',
  'Delivered fully assembled',
  'Wall-mounted or free-standing, where the product allows',
  'Warranty on the powder-coat finish',
];

const AUDIENCE = ['Individual homes', 'Apartments and societies', 'Offices and workspaces', 'EV owners'];

export default function About() {
  const { s } = useSite();
  const location = [s.business_city, s.business_state].filter(Boolean).join(', ');

  return (
    <div className="about-page">
      <Seo title="About boxel" description="Why boxel exists, what we believe and how we build smart, safe products for modern Indian living." />

      {/* Why boxel exists */}
      <section className="w-full border-b border-[#dedbd3] bg-[#f4f2ec]" aria-labelledby="about-title">
        <div className="overflow-hidden">
        <div className="shell grid gap-6 py-6 sm:py-7 md:grid-cols-[1.6fr_1fr] md:items-center lg:gap-14 lg:py-8">
          <div className="flex flex-col items-start justify-center">
            <p className="flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-graphite"><span className="size-1.5 rounded-full bg-signal" aria-hidden />The story of boxel</p>
            <h1 id="about-title" className="mt-4 text-[clamp(2rem,3.2vw,2.75rem)] font-medium leading-[1.1] tracking-[-0.05em]">Smart. Safe.<br /><span className="text-ink/45">Simple.</span></h1>
            <p className="mt-4 max-w-[40ch] text-[0.8125rem] leading-relaxed text-graphite">Thoughtful products for modern Indian living. Built around the things that matter to you.</p>
            <a href="#our-story" className="group mt-4 inline-flex min-h-10 items-center gap-3 text-sm font-medium">Discover our story <span className="grid size-9 place-items-center rounded-full border border-black/15 transition-colors group-hover:bg-ink group-hover:text-white"><ArrowDown className="size-4" aria-hidden /></span></a>
          </div>
          <div className="contact-banner-stage !py-4">
            <div className="contact-banner-orbit" aria-hidden />
            <div className="contact-banner-platform" aria-hidden />
            <div className="contact-banner-card relative rounded-[1.5rem] border border-white/80 bg-[#e9e7df] p-3">
              <span className="contact-banner-badge !size-12 !rounded-2xl" aria-hidden><ShieldCheck className="size-6" strokeWidth={1.4} /></span>
              <img src="/images/parcel-drop-box-front.jpeg" alt="The boxel Parcel Drop Box in white" width="1309" height="1202" fetchPriority="high" className="h-44 w-full object-contain mix-blend-multiply sm:h-48" />
              <Link to="/products/parcel-drop-box" className="relative mt-2 flex items-center justify-between gap-4 rounded-xl border border-white/60 bg-white/90 px-4 py-3 text-xs font-medium transition-colors hover:bg-white">One idea. A better everyday.<ArrowUpRight className="size-4" aria-hidden /></Link>
            </div>
          </div>
          </div>
        </div>
      </section>

      <section id="our-story" className="shell scroll-mt-28" aria-labelledby="why-title">
        <Reveal className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.08] bg-[#eaf0e9] p-6 text-ink sm:p-10 lg:p-14">
          <div aria-hidden className="pointer-events-none absolute -right-48 -top-48 size-[36rem] rounded-full border border-black/[0.06]" />
          <div className="relative grid gap-8 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <p className="flex items-center gap-2 text-[0.625rem] font-medium uppercase tracking-[0.2em] text-ink/55"><span className="size-1.5 rounded-full bg-signal" aria-hidden />Our purpose</p>
              <h2 id="why-title" className="mt-5 text-[clamp(2rem,3.5vw,3.25rem)] font-medium leading-[1.08] tracking-[-0.04em]">Why boxel<br /><span className="text-ink/45">exists.</span></h2>
            </div>
            <div className="lg:col-span-7">
              <p className="text-base leading-relaxed text-ink/65">Indian homes and workplaces are changing fast. We shop online, work from anywhere, charge our vehicles at home, and live in apartments where space is tight. Most of the products around us were not designed for this new way of living.</p>
              <p className="mt-6 text-lg leading-relaxed tracking-tight text-ink/90 sm:text-xl">At boxel, we believe good design should give you three things back: <span className="text-signal-ink">your time, your peace of mind and your space.</span></p>
            </div>
          </div>
          <div className="relative mt-10 grid gap-3 border-t border-black/10 pt-8 sm:grid-cols-3 lg:mt-12">
            {[
              { Icon: Clock3, title: 'Your time.', text: 'Less waiting. More living.' },
              { Icon: ShieldCheck, title: 'Your peace of mind.', text: 'Everyday essentials, thoughtfully protected.' },
              { Icon: Maximize2, title: 'Your space.', text: 'Room for what matters.' },
            ].map(({ Icon, title, text }) => (
              <div key={title} className="group rounded-2xl border border-black/10 bg-white/40 p-5 transition-colors hover:border-black/20 hover:bg-white/70 sm:p-6">
                <Icon className="size-5 text-signal-ink" strokeWidth={1.4} aria-hidden />
                <h3 className="mt-5 text-lg font-medium tracking-tight">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/50">{text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* What we believe */}
      <section className="border-y border-black/[0.06] bg-[#f4f2ec] py-16 sm:py-24" aria-labelledby="believe-title">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
            <Kicker>Our values</Kicker>
            <h2 id="believe-title" className="heading-premium mt-5 !text-[clamp(2.5rem,4vw,3.75rem)]">
              <TitleText main="What we" soft="believe." />
            </h2>
            <div aria-hidden className="mt-8 h-px w-20 bg-signal/60" />
            </div>
          </Reveal>
          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {BELIEFS.map((b, i) => {
              const Icon = [LockKeyhole, Clock3, HeartHandshake, House][i];
              return (
              <Reveal as="li" key={b.title} delay={i * 0.08} className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-black/[0.08] bg-[#fcfbf8] p-6 transition-[border-color,box-shadow] duration-300 hover:border-black/20 hover:shadow-[0_16px_36px_-28px_rgb(35_40_33/0.35)] sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl border border-black/[0.05] bg-[#eeece5] text-ink/75 transition-colors duration-300 group-hover:bg-[#252a25] group-hover:text-white"><Icon className="size-5" strokeWidth={1.4} aria-hidden /></span>
                  <span className="text-[0.625rem] font-medium tracking-[0.15em] text-ink/35" aria-hidden>0{i + 1}</span>
                </div>
                <h3 className="mt-7 max-w-[22ch] text-xl font-medium leading-tight tracking-[-0.025em]">{b.title}</h3>
                <p className="mt-3 max-w-[42ch] text-sm leading-relaxed text-graphite">{b.body}</p>
              </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Our products */}
      <section className="bg-[#faf9f6] py-16 sm:py-24" aria-labelledby="products-title">
        <div className="shell">
          <Reveal>
            <Kicker>The range</Kicker>
            <h2 id="products-title" className="heading-premium mt-4">
              <TitleText main="Our" soft="products." />
            </h2>
          </Reveal>
          <div className="mt-10 grid overflow-hidden rounded-[2rem] border border-black/[0.08] bg-[#f7f6f1] lg:grid-cols-2">
            <Reveal className="group relative aspect-square overflow-hidden border-b border-black/[0.06] bg-[#e4e3df] lg:aspect-auto lg:min-h-[530px] lg:border-b-0 lg:border-r">
              <img src="/images/parcel-drop-box-open.jpeg" alt="The Parcel Drop Box with its front door open" width="1234" height="1274" loading="lazy" className="absolute inset-0 size-full object-contain p-5 mix-blend-multiply transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transform-none sm:p-8" />
            </Reveal>
            <Reveal delay={0.1} className="flex flex-col items-start justify-center p-6 sm:p-10 lg:p-12">
              <p className="inline-flex items-center gap-2 rounded-full border border-success/15 bg-[#eaf4ee] px-3 py-1.5 text-[0.6875rem] font-medium text-success"><span className="size-1.5 rounded-full bg-success" aria-hidden />Available now</p>
              <h3 className="mt-6 text-[clamp(2rem,3.5vw,3.25rem)] font-medium leading-[1.08] tracking-[-0.045em]">boxel Parcel Drop Box</h3>
              <p className="mt-5 max-w-[42ch] text-base leading-relaxed text-graphite">
                An anti-theft, all-metal parcel drop box with a keyless number lock. It receives parcels, groceries, laundry and returns safely and holds them until
                collection. One unit can serve 3 to 4 homes.
              </p>
              <div className="mt-8 w-full border-t border-black/[0.08] pt-7">
              <Link to="/products/parcel-drop-box" className="btn btn-primary group !rounded-xl">
                View the Parcel Drop Box <ArrowRight className="btn-icon size-4" aria-hidden />
              </Link>
              </div>
            </Reveal>
          </div>

          <UpcomingStudio ideas={COMING} />
        </div>
      </section>

      {/* How we build */}
      <section className="bg-[#edf0f2] py-20 text-ink sm:py-28 lg:py-32" aria-labelledby="build-title">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <Kicker>Craft</Kicker>
            <h2 id="build-title" className="heading-premium mt-4">
              <TitleText main="How we" soft="build." />
            </h2>
            <p className="mt-6 max-w-[52ch] text-lead text-ink/70">
              We design every product ourselves, in all-metal construction with a durable powder-coat finish. Each unit is made to order. Before it ships, we share
              a video of its quality and functions, so you see exactly what you are getting.
            </p>
          </Reveal>
          <ul className="border-t border-black/15 lg:col-span-5 lg:col-start-8">
            {BUILD.map((b, i) => (
              <Reveal as="li" key={b} delay={i * 0.06} className="flex items-center gap-4 border-b border-black/15 py-4">
                <span className="tile text-[0.7rem]" aria-hidden />
                {b}
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Who we serve + promise */}
      <section className="bg-[#fbf8f2] py-20 sm:py-28 lg:py-32" aria-labelledby="serve-title">
        <div className="shell grid gap-8 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-7">
            <Kicker>Audience</Kicker>
            <h2 id="serve-title" className="heading-premium mt-4">
              <TitleText main="Who we" soft="serve." />
            </h2>
            <ul className="mt-8 grid grid-cols-1 overflow-hidden rounded-[1.5rem] border border-black/10 bg-[#f5f3ee] sm:grid-cols-2">
              {AUDIENCE.map((a, i) => {
                const Icon = [House, Building2, BriefcaseBusiness, Zap][i];
                return (
                  <li key={a} className={`group relative min-h-40 border-black/10 p-6 transition-colors hover:bg-[#eae7dd] ${i < 3 ? 'border-b' : ''} ${i < 2 ? 'sm:border-b' : 'sm:border-b-0'} ${i % 2 === 0 ? 'sm:border-r' : ''}`}>
                    <span className="absolute right-5 top-5 font-mono text-[0.625rem] text-ink/35" aria-hidden>0{i + 1}</span>
                    <Icon className="size-7 text-ink/60 transition-colors group-hover:text-signal-ink" strokeWidth={1.2} aria-hidden />
                    <p className="mt-7 text-base font-medium tracking-tight">{a}</p>
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 max-w-[48ch] text-sm leading-relaxed text-graphite">The same idea runs through all of them: smart, safe and simple.</p>
          </Reveal>
          <Reveal delay={0.1} className="relative flex flex-col overflow-hidden rounded-t-[5rem] rounded-b-[1.5rem] border border-[#d9d4c6] bg-[#eee9dd] p-8 pt-12 sm:p-10 sm:pt-14 lg:col-span-5">
            <div aria-hidden className="pointer-events-none absolute inset-3 rounded-t-[4.3rem] rounded-b-xl border border-black/[0.06]" />
            <div className="relative">
            <Kicker>Promise</Kicker>
            <h2 className="heading-premium mt-5 !text-[clamp(2.25rem,3.5vw,3.25rem)]">
              <TitleText main="Our" soft="promise." />
            </h2>
            <p className="mt-6 text-base leading-[1.85] text-ink/70">
              An honest product, a fair price and a quality check before it ships, with free shipping across India. We only launch what we would be happy to have at our own door.
            </p>
            </div>
            <div aria-hidden className="relative mt-auto flex items-center gap-4 pt-10"><span className="h-px flex-1 bg-black/15" /><span className="grid size-14 place-items-center rounded-full border border-black/15 bg-white/30"><ShieldCheck className="size-7 text-ink/60" strokeWidth={1.2} /></span><span className="h-px flex-1 bg-black/15" /></div>
          </Reveal>
        </div>
      </section>

      {/* Get in touch */}
      <section className="border-t border-black/[0.08] bg-[#eaf0e9] py-14 text-ink sm:py-20" aria-labelledby="touch-title">
        <div className="shell">
          <Reveal className="flex flex-wrap items-end justify-between gap-8 border-b border-black/15 pb-9">
            <div>
            <Kicker>Contact</Kicker>
            <h2 id="touch-title" className="heading-premium mt-4">
              <TitleText main="Get in" soft="touch." />
            </h2>
            {location && <p className="mt-4 text-ink/55">{location}</p>}
            </div>
            <Link to="/contact" aria-label="Send a message" className="group grid size-16 place-items-center rounded-full border border-black/25 transition-colors hover:bg-white hover:text-ink sm:size-20"><ArrowUpRight className="size-7 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transform-none" strokeWidth={1.3} aria-hidden /></Link>
          </Reveal>
          <div className="grid gap-10 pt-9 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <Reveal className="grid content-start gap-6 sm:grid-cols-2">
            {[
              { label: 'Phone', value: formatPhone(s.business_phone), href: telHref(s.business_phone), Icon: Phone },
              ...(s.business_whatsapp ? [{ label: 'WhatsApp', value: formatPhone(s.business_whatsapp), href: whatsappHref(s.business_whatsapp, 'Hi boxel, I have a question.'), Icon: MessageCircle, external: true }] : []),
              ...(s.business_email ? [{ label: 'Email', value: s.business_email, href: `mailto:${s.business_email}`, Icon: Mail }] : []),
            ].map(({ label, value, href, Icon, external }) => <a key={label} href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className="group min-w-0 border-b border-black/15 pb-5 transition-colors hover:border-black/50"><span className="flex items-center gap-2 text-xs text-ink/50"><Icon className="size-4" strokeWidth={1.4} aria-hidden />{label}</span><span className="mt-3 flex items-center justify-between gap-3 text-sm font-medium"><span className="break-all">{value}</span><ArrowUpRight className="size-4 shrink-0 text-ink/40 transition-colors group-hover:text-ink" aria-hidden /></span></a>)}
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col items-start gap-5 lg:border-l lg:border-black/15 lg:pl-10">
            <p className="text-xl font-medium tracking-tight">See what is available today.</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/products" className="btn btn-primary !rounded-full">
                View products <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link to="/contact" className="btn btn-secondary !rounded-full">
                Send a message
              </Link>
            </div>
          </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
