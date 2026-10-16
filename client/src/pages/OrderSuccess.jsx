import { Link, useParams } from 'react-router';
import { motion } from 'framer-motion';
import Seo from '../components/ui/Seo.jsx';
import OrderView from '../components/OrderView.jsx';
import { PageLoader } from '../components/ui/States.jsx';
import { useApi } from '../hooks/useApi.js';
import { useSite } from '../context/SiteContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { formatPhone } from '../utils/format.js';
import { EASE } from '../components/ui/Reveal.jsx';

export default function OrderSuccess() {
  const { orderNumber } = useParams();
  const { data, error, loading } = useApi(`/orders/confirmation/${encodeURIComponent(orderNumber)}`);
  const { s } = useSite();
  const { customer } = useAuth();

  if (loading && !data) return <PageLoader />;
  if (error) {
    return (
      <section className="shell py-20">
        <Seo title="Order" noindex />
        <h1 className="text-display font-light">Order {orderNumber}</h1>
        <p className="mt-4 max-w-[52ch] text-graphite">{error.message}</p>
        <Link to={customer ? '/account/orders' : '/login?next=/account/orders'} className="btn btn-primary mt-6">
          {customer ? 'See your orders' : 'Sign in'}
        </Link>
      </section>
    );
  }
  const order = data.order;
  const firstName = order.customer_name.split(' ')[0];

  return (
    <>
      <Seo title={`Order ${order.order_number}`} noindex />
      <section className="shell pb-24 pt-12 sm:pt-16">
        <div className="flex items-start gap-5">
          <div className="relative mt-2 hidden h-14 w-12 shrink-0 sm:block" aria-hidden>
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className={`absolute h-[58%] w-[46%] ${i === 2 ? 'bg-signal' : 'bg-ink'}`}
                style={{ left: i === 2 ? '50%' : 0, top: ['0%', '50%', '27%'][i], skewY: '-24deg' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.6, ease: EASE }}
              />
            ))}
          </div>
          <div>
            <motion.h1 className="text-display font-light" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
              Thank you, {firstName}.
            </motion.h1>
            <p className="mt-3 text-lead text-graphite">
              Your order <strong className="font-medium text-ink">{order.order_number}</strong> has been received. We will send the confirmation to {order.customer_email}.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-sm bg-stone p-6 sm:p-8">
          <h2 className="text-title font-medium">What happens next</h2>
          <ol className="mt-5 grid gap-6 text-[0.9375rem] sm:grid-cols-3">
            <li>
              <span className="text-3xl font-extralight">1</span>
              <p className="mt-2">We confirm your order and the expected dispatch date{order.payment_method === 'bank_transfer' ? ', and share payment details' : ''}.</p>
            </li>
            <li>
              <span className="text-3xl font-extralight">2</span>
              <p className="mt-2">Your product is made to order. We share a video of its quality and functions before it ships.</p>
            </li>
            <li>
              <span className="text-3xl font-extralight">3</span>
              <p className="mt-2">We dispatch it to your address and share tracking details.</p>
            </li>
          </ol>
          <p className="mt-6 text-sm text-graphite">Questions about your order? Call or WhatsApp {formatPhone(s.business_phone)} and mention {order.order_number}.</p>
        </div>

        <div className="mt-14">
          <OrderView order={order} />
        </div>

        <div className="mt-14 flex flex-wrap gap-3">
          <Link to="/products" className="btn btn-primary">
            Continue shopping
          </Link>
          {customer && (
            <Link to="/account/orders" className="btn btn-secondary">
              View your orders
            </Link>
          )}
        </div>
      </section>
    </>
  );
}
