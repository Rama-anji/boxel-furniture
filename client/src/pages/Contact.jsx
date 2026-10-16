import { useSearchParams } from 'react-router';
import { ArrowDown, ArrowUpRight, Clock3, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import Seo from '../components/ui/Seo.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import ContactForm from '../components/ContactForm.jsx';
import { formatPhone, telHref, whatsappHref } from '../utils/format.js';
import { useSite } from '../context/SiteContext.jsx';

export default function Contact() {
  const { s } = useSite();
  const [params] = useSearchParams();
  const location = [s.business_address, s.business_city, s.business_state].filter(Boolean).join(', ') || 'Hyderabad, Telangana, India';
  const mapSrc = s.map_embed_url || (location ? `https://maps.google.com/maps?q=${encodeURIComponent(location)}&output=embed` : null);
  const directions = s.map_url || (location ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}` : null);
  const channels = [
    { label: 'Call us', detail: formatPhone(s.business_phone), href: telHref(s.business_phone), Icon: Phone },
    ...(s.business_whatsapp ? [{ label: 'Chat on WhatsApp', detail: formatPhone(s.business_whatsapp), href: whatsappHref(s.business_whatsapp, 'Hi boxel, I have a question.'), Icon: MessageCircle, external: true }] : []),
    ...(s.business_email ? [{ label: 'Email us', detail: s.business_email, href: `mailto:${s.business_email}`, Icon: Mail }] : []),
  ];
  return (
    <>
      <Seo title="Contact boxel" description="Questions about a boxel product, your order, or a housing society enquiry? Get in touch with our team." />
      <section className="w-full" aria-labelledby="contact-title">
        <div className="contact-banner-compact relative overflow-hidden border-b border-[#dedbd3] bg-[#f4f2ec] py-6 text-ink sm:py-7 lg:py-8">
          <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden w-[31%] border-l border-black/[0.04] bg-[#eceae2] lg:block" />
          <div className="shell relative grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-center lg:gap-14">
            <div className="min-w-0">
              <p className="flex items-center gap-3 text-[0.625rem] font-semibold uppercase tracking-[0.22em] text-graphite"><span className="h-px w-8 bg-signal" aria-hidden />Get in touch with boxel</p>
              <h1 id="contact-title" className="mt-7 text-[clamp(1.5rem,4.4vw,3.75rem)] font-medium leading-[1.1] tracking-[-0.055em]"><span className="block whitespace-nowrap">Good homes start</span><span className="block whitespace-nowrap text-[#77796f]">with a conversation.</span></h1>
              <p className="mt-6 max-w-[43ch] text-sm leading-relaxed text-graphite sm:text-base">A question about your first boxel, help with an order, or a plan for your housing society. We're here to help.</p>
              <a href="#contact-message" className="btn btn-primary group mt-8 !rounded-full !px-6">Let's talk <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5 motion-reduce:transform-none" aria-hidden /></a>
            </div>
            <div className="contact-banner-stage">
              <div className="contact-banner-orbit" aria-hidden />
              <div className="contact-banner-platform" aria-hidden />
              <div className="contact-banner-card relative rounded-[1.5rem] border border-white/80 bg-[#fcfbf8] p-6 sm:p-8">
              <span className="contact-banner-badge" aria-hidden><MessageCircle className="size-7" strokeWidth={1.4} /></span>
              <div className="flex items-center justify-between border-b border-black/[0.07] pb-6"><span className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-graphite">A personal connection</span><MessageCircle className="size-5 text-ink/60" strokeWidth={1.3} aria-hidden /></div>
              <p className="mt-6 text-2xl font-medium leading-tight tracking-[-0.035em]">A little guidance.<br /><span className="text-graphite">A thoughtful answer.</span></p>
              <p className="mt-3 text-sm leading-relaxed text-graphite">From choosing the right fit to planning for your community, start with us.</p>
              <a href={telHref(s.business_phone)} className="group mt-7 flex items-center gap-3 rounded-xl border border-black/[0.08] bg-white p-4 transition-colors hover:border-black/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"><Phone className="size-4 shrink-0 text-graphite" strokeWidth={1.5} aria-hidden /><span className="min-w-0 flex-1"><span className="block text-[0.625rem] text-graphite">Speak with us</span><span className="mt-1 block text-sm font-medium">{formatPhone(s.business_phone)}</span></span><ArrowUpRight className="size-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden /></a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="shell pb-20 pt-8 sm:pb-24 sm:pt-10" aria-label="Contact details and enquiry form">
        <div className="grid items-stretch gap-6 lg:grid-cols-12 lg:gap-8">
          <Reveal className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-black/[0.08] bg-[#f5f3ee] lg:col-span-5">
            <div className="p-6 sm:p-8">
              <p className="flex items-center gap-2 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-graphite"><span className="size-1.5 rounded-full bg-signal" aria-hidden />A direct connection</p>
              <h2 className="mt-3 text-[1.75rem] font-medium leading-tight tracking-[-0.035em]">A conversation away.</h2>
              <p className="mt-3 text-sm leading-relaxed text-graphite">A quick question or a bigger plan. Reach us in the way that works for you.</p>
              <ul className="mt-6 space-y-3">
                {channels.map(({ label, detail, href, Icon, external }) => (
                  <li key={label}>
                    <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className="group flex items-center gap-3 rounded-2xl border border-black/[0.07] bg-white/75 p-4 transition-colors hover:border-black/20 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal">
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#eeeee7] text-ink/75 transition-colors group-hover:bg-[#252a25] group-hover:text-white"><Icon className="size-[1.125rem]" strokeWidth={1.5} aria-hidden /></span>
                      <span className="min-w-0 flex-1"><span className="block text-xs text-graphite">{label}</span><span className="mt-1 block break-words text-sm font-medium">{detail}</span></span>
                      <ArrowUpRight className="size-4 shrink-0 text-graphite transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
              {s.business_hours && <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-graphite"><Clock3 className="size-4 shrink-0" aria-hidden />{s.business_hours}</p>}
            </div>
            <div className="flex flex-1 flex-col border-t border-black/[0.08] bg-white/50">
              <div className="flex flex-wrap items-start justify-between gap-4 p-6 sm:px-8">
                <div className="flex min-w-0 gap-3">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-graphite" strokeWidth={1.5} aria-hidden />
                  <div><h3 className="text-sm font-medium">Our location</h3>{s.store_name && <p className="mt-2 text-sm text-ink">{s.store_name}</p>}{location && <p className="mt-1 text-sm leading-relaxed text-graphite">{location}</p>}</div>
                </div>
                {directions && <a href={directions} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border border-black/10 bg-white px-3 text-xs font-medium transition-colors hover:bg-ink hover:text-white">View map <ArrowUpRight className="size-3.5" aria-hidden /></a>}
              </div>
              {mapSrc ? <div className="relative min-h-72 flex-1 border-t border-black/[0.06]"><iframe src={mapSrc} title="boxel business location map" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen className="absolute inset-0 h-full w-full border-0" /></div> : <p className="px-6 pb-6 text-sm leading-relaxed text-graphite sm:px-8">Contact us for location details before planning your visit.</p>}
            </div>
          </Reveal>
          <Reveal delay={0.1} className="h-full lg:col-span-7">
            <div id="contact-message" className="home-contact-form flex h-full scroll-mt-28 flex-col rounded-[1.75rem] border border-black/[0.08] bg-[#fcfbf8] p-6 sm:p-8 lg:p-10">
              <div className="mb-7 border-b border-black/[0.07] pb-6">
                <p className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-graphite">Your enquiry</p>
                <h2 className="mt-3 text-[1.75rem] font-medium tracking-tight">Tell us what's on your mind.</h2>
                <p className="mt-2 text-sm leading-relaxed text-graphite">A few details will help us point you in the right direction.</p>
              </div>
              <ContactForm defaultTopic={params.get('topic') || undefined} />
              <p className="mt-auto flex items-center gap-2 pt-6 text-xs text-graphite"><ShieldCheck className="size-4 shrink-0" aria-hidden />Your details are used to respond to your enquiry.</p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
