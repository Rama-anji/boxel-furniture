import { Link } from 'react-router';
import { Check } from 'lucide-react';
import { formatINR, formatDateTime, formatPhone, ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS } from '../utils/format.js';

const FLOW = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

export function StatusTimeline({ status }) {
  if (status === 'cancelled') {
    return <p className="inline-flex rounded-sm bg-danger/10 px-3 py-1.5 text-sm font-medium text-danger">This order was cancelled</p>;
  }
  const current = FLOW.indexOf(status);
  return (
    <ol className="grid grid-cols-5 gap-1" aria-label="Order progress">
      {FLOW.map((st, i) => {
        const done = i <= current;
        return (
          <li key={st} className="text-[0.75rem] sm:text-sm" aria-current={i === current ? 'step' : undefined}>
            <span className={`block h-1 rounded-full ${done ? 'bg-ink' : 'bg-hairline'}`} />
            <span className={`mt-2 flex items-center gap-1 ${done ? 'text-ink' : 'text-graphite'}`}>
              {done && <Check className="hidden size-3.5 sm:block" aria-hidden />}
              {ORDER_STATUS[st]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/** Order summary shared by the confirmation page and the account order page. */
export default function OrderView({ order }) {
  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <StatusTimeline status={order.status} />
        <h2 className="mt-10 text-title font-medium">Items</h2>
        <ul className="mt-4 divide-y divide-hairline border-y border-hairline">
          {order.items.map((i) => (
            <li key={i.id} className="flex gap-4 py-4">
              <div className="size-16 shrink-0 overflow-hidden rounded-sm bg-stone">{i.image_url && <img src={i.image_url} alt="" className="size-full object-cover" />}</div>
              <div className="min-w-0 flex-1">
                {i.product_slug ? (
                  <Link to={`/products/${i.product_slug}`} className="font-medium hover:underline">
                    {i.product_name}
                  </Link>
                ) : (
                  <p className="font-medium">{i.product_name}</p>
                )}
                <p className="text-sm text-graphite">
                  {i.variant_name && `${i.variant_name} · `}
                  {i.quantity} × {formatINR(i.unit_price)}
                </p>
              </div>
              <p className="font-medium tabular-nums">{formatINR(i.line_total)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-6 space-y-2 text-[0.9375rem] sm:ml-auto sm:max-w-xs">
          <div className="flex justify-between">
            <dt className="text-graphite">Subtotal</dt>
            <dd>{formatINR(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-graphite">Shipping</dt>
            <dd>{Number(order.shipping_fee) > 0 ? formatINR(order.shipping_fee) : 'Free'}</dd>
          </div>
          {Number(order.tax_amount) > 0 && (
            <div className="flex justify-between">
              <dt className="text-graphite">{order.tax_label}</dt>
              <dd>{formatINR(order.tax_amount)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-hairline pt-2 text-lg font-medium">
            <dt>Total</dt>
            <dd>{formatINR(order.total)}</dd>
          </div>
        </dl>
      </div>
      <div className="space-y-8 text-[0.9375rem] lg:col-span-4 lg:col-start-9">
        <div>
          <h2 className="text-sm text-graphite">Delivery address</h2>
          <address className="mt-2 not-italic leading-relaxed">
            {order.customer_name}
            <br />
            {order.ship_line1}
            {order.ship_line2 && (
              <>
                <br />
                {order.ship_line2}
              </>
            )}
            <br />
            {order.ship_city}, {order.ship_state} {order.ship_pincode}
            <br />
            {order.ship_country}
            <br />
            {formatPhone(order.customer_phone)}
          </address>
        </div>
        <div>
          <h2 className="text-sm text-graphite">Payment</h2>
          <p className="mt-2">{PAYMENT_METHOD[order.payment_method]}</p>
          <p className="text-graphite">{PAYMENT_STATUS[order.payment_status]}</p>
        </div>
        {order.tracking_number && (
          <div>
            <h2 className="text-sm text-graphite">Tracking</h2>
            <p className="mt-2">
              {order.tracking_carrier && `${order.tracking_carrier} — `}
              {order.tracking_number}
            </p>
            {order.tracking_url && (
              <a href={order.tracking_url} target="_blank" rel="noopener noreferrer" className="link text-sm">
                Track shipment
              </a>
            )}
          </div>
        )}
        <div>
          <h2 className="text-sm text-graphite">Placed</h2>
          <p className="mt-2">{formatDateTime(order.created_at)}</p>
        </div>
      </div>
    </div>
  );
}
