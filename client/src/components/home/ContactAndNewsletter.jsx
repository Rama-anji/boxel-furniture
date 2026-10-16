import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowUpRight, ArrowRight, Mail, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import Reveal from '../ui/Reveal.jsx';
import ContactForm from '../ContactForm.jsx';
import { Checkbox } from '../ui/Field.jsx';
import { useSite } from '../../context/SiteContext.jsx';
import { post } from '../../services/api.js';
import { isEmail } from '../../utils/validation.js';
import { formatPhone, telHref, whatsappHref } from '../../utils/format.js';
import { Kicker } from '../ui/Heading.jsx';

export function ContactDetails({ dark = false }) {
  const { s } = useSite();
  const row = `flex items-center gap-4 py-4 border-b ${dark ? 'border-white/15' : 'border-hairline'}`;
  const muted = dark ? 'text-white/60' : 'text-graphite';
  return (
    <ul className={`border-t ${dark ? 'border-white/15' : 'border-hairline'}`}>
      <li className={row}>
        <Phone className="size-5 shrink-0" strokeWidth={1.5} aria-hidden />
        <div>
          <p className={`text-sm ${muted}`}>Phone</p>
          <a href={telHref(s.business_phone)} className="text-lg hover:underline">
            {formatPhone(s.business_phone)}
          </a>
        </div>
      </li>
      {s.business_whatsapp && (
        <li className={row}>
          <MessageCircle className="size-5 shrink-0" strokeWidth={1.5} aria-hidden />
          <div>
            <p className={`text-sm ${muted}`}>WhatsApp</p>
            <a href={whatsappHref(s.business_whatsapp, 'Hi boxel, I have a question.')} target="_blank" rel="noopener noreferrer" className="text-lg hover:underline">
              {formatPhone(s.business_whatsapp)}
            </a>
          </div>
        </li>
      )}
      {s.business_email && (
        <li className={row}>
          <Mail className="size-5 shrink-0" strokeWidth={1.5} aria-hidden />
          <div className="min-w-0">
            <p className={`text-sm ${muted}`}>Email</p>
            <a href={`mailto:${s.business_email}`} className="break-all text-lg hover:underline">
              {s.business_email}
            </a>
          </div>
        </li>
      )}
    </ul>
  );
}

/* M — contact CTA ------------------------------------------------------- */
export function ContactSection() {
  const { s } = useSite();
  const channels = [
    { label: 'Give us a call', detail: formatPhone(s.business_phone), href: telHref(s.business_phone), Icon: Phone },
    ...(s.business_whatsapp ? [{ label: 'Chat on WhatsApp', detail: 'Start a conversation', href: whatsappHref(s.business_whatsapp, 'Hi boxel, I have a question.'), Icon: MessageCircle, external: true }] : []),
    ...(s.business_email ? [{ label: 'Send us an email', detail: s.business_email, href: `mailto:${s.business_email}`, Icon: Mail }] : []),
  ];
  return (
    <section className="relative overflow-hidden bg-[#202320] py-20 text-white sm:py-24 lg:py-28" aria-labelledby="contact-title" id="contact">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(241,126,0,0.09),transparent_55%)]" />
      <div className="shell relative">
      <div className="mb-10 flex items-center justify-between border-b border-white/10 pb-5">
          <Kicker dark>Contact</Kicker>
          <span className="text-[0.6875rem] uppercase tracking-[0.2em] text-white/45">A little help. A better home.</span>
      </div>
      <div className="grid items-stretch gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="flex h-full flex-col lg:col-span-5">
          <h2 id="contact-title" className="text-[clamp(2.75rem,4.5vw,4.5rem)] font-medium leading-[1.05] tracking-[-0.05em]">
            Let’s talk.<br /><span className="text-white/45">We’re here<br className="hidden lg:block" /> to help.</span>
          </h2>
          <p className="mt-6 max-w-[38ch] text-base leading-relaxed text-white/60">Finding the right fit for your entrance? Planning for your housing society? Tell us what you have in mind.</p>
          <div className="mt-9 space-y-3 lg:mt-auto lg:pt-9">
            {channels.map(({ label, detail, href, Icon, external }) => (
              <a key={label} href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4 transition-colors hover:border-white/25 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white/80"><Icon className="size-[1.125rem]" strokeWidth={1.5} aria-hidden /></span>
                <span className="min-w-0 flex-1"><span className="block text-xs text-white/50">{label}</span><span className="mt-1 block break-words text-sm font-medium sm:text-base">{detail}</span></span>
                <ArrowUpRight className="size-4 shrink-0 text-white/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </a>
            ))}
          </div>
          <p className="mt-8 flex items-center gap-2 text-xs text-white/45"><ShieldCheck className="size-4 shrink-0" aria-hidden />Your details are only used to reply to your enquiry.</p>
        </Reveal>
        <Reveal delay={0.1} className="h-full lg:col-span-7">
          <div className="home-contact-form h-full rounded-[1.75rem] border border-white/60 bg-[#fcfbf8] p-5 text-ink shadow-[0_24px_60px_-32px_rgb(0_0_0/0.45)] sm:p-8 lg:p-10">
            <div className="mb-7 border-b border-black/[0.07] pb-6">
              <h3 className="text-2xl font-medium tracking-tight">A good conversation starts here.</h3>
              <p className="mt-2 text-sm leading-relaxed text-graphite">Leave a few details and we’ll get back to you.</p>
            </div>
            <ContactForm />
          </div>
        </Reveal>
      </div>
      </div>
    </section>
  );
}

/* N — newsletter -------------------------------------------------------- */
export function Newsletter() {
  const { s } = useSite();
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState({ status: 'idle', message: '', errors: {} });
  if (s.newsletter_enabled === false) return null;

  const submit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!isEmail(email)) errors.email = 'Enter a valid email address.';
    if (!consent) errors.consent = 'Please confirm you would like to receive updates.';
    if (Object.keys(errors).length) return setState({ status: 'idle', message: '', errors });
    setState({ status: 'sending', message: '', errors: {} });
    try {
      const res = await post('/newsletter', { email, consent });
      setState({ status: 'done', message: res.message, errors: {} });
      setEmail('');
      setConsent(false);
    } catch (err) {
      setState({ status: 'idle', message: err.message, errors: err.fields || {} });
    }
  };

  return (
    <section className="bg-[#f5f3ee] py-12 sm:py-16" aria-labelledby="news-title">
      <div className="shell relative z-[2]">
      <div className="relative grid gap-8 overflow-hidden rounded-[1.75rem] border border-black/[0.08] bg-[#fcfbf8] p-6 sm:p-10 lg:grid-cols-12 lg:items-center lg:gap-16 lg:p-12">
        <span aria-hidden className="pointer-events-none absolute -bottom-24 -left-16 size-72 rounded-full bg-[radial-gradient(circle,rgb(241_126_0/0.12),transparent_65%)]" />
        <div className="relative lg:col-span-5">
          <p className="mb-4 flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-graphite"><Mail className="size-4" strokeWidth={1.5} aria-hidden />The boxel edit</p>
          <h2 id="news-title" className="max-w-[16ch] text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-[1.15] tracking-[-0.04em]">
            Good things.<br /><span className="text-graphite">First in your inbox.</span>
          </h2>
          <p className="mt-4 max-w-[36ch] text-sm leading-relaxed text-graphite">Be first to hear about new boxel products. Only the occasional update. Always worth opening.</p>
        </div>
        <form onSubmit={submit} noValidate className="relative lg:col-span-7">
            <label htmlFor="newsletter-email" className="mb-2 block text-xs font-medium text-ink">
              Email address
            </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="newsletter-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field min-w-0 flex-1 !rounded-xl !border-black/10 !bg-white"
              aria-invalid={state.errors.email ? 'true' : undefined}
              aria-describedby="newsletter-status"
            />
            <button type="submit" className="btn btn-primary gap-3 !rounded-xl" disabled={state.status === 'sending'}>
              {state.status === 'sending' ? 'Subscribing…' : 'Subscribe'}
              <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
          <Checkbox
            className="mt-4"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            error={state.errors.consent}
            label={
              <>
                Send me product updates by email. I can unsubscribe any time. See our{' '}
                <Link to="/privacy-policy" className="link">
                  privacy policy
                </Link>
                .
              </>
            }
          />
          <p id="newsletter-status" className={`mt-3 min-h-5 text-sm ${state.status === 'done' ? 'text-success' : 'text-danger'}`} role="status">
            {state.errors.email || state.message}
          </p>
        </form>
      </div>
      </div>
    </section>
  );
}
