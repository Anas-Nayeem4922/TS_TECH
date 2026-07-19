export default function ShippingPage() {
  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="badge-gold inline-block mb-4">Policies</div>
        <h1 className="text-3xl font-bold text-white mb-8">Shipping Policy</h1>
        <div className="text-silver-400 space-y-6">
          <p>We aim to get your order to you as fast as possible with full transparency on shipping.</p>
          <h2 className="text-white text-xl font-semibold mt-8 mb-3">Delivery Timelines</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { area: 'Kolkata (within city)', time: 'Same day or next day' },
              { area: 'West Bengal (rest)', time: '1–3 business days' },
              { area: 'Major metro cities', time: '2–4 business days' },
              { area: 'Rest of India', time: '4–7 business days' },
            ].map((d) => (
              <div key={d.area} className="p-4 card-surface rounded-xl border border-white/5">
                <div className="text-sm font-semibold text-white mb-1">{d.area}</div>
                <div className="text-xs text-gold-400">{d.time}</div>
              </div>
            ))}
          </div>
          <h2 className="text-white text-xl font-semibold mt-8 mb-3">Shipping Charges</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Orders above ₹500 — <span className="text-green-400">FREE shipping</span></li>
            <li>Orders below ₹500 — Flat ₹60 shipping fee</li>
          </ul>
          <h2 className="text-white text-xl font-semibold mt-8 mb-3">Tracking</h2>
          <p>Once your order is shipped, you&apos;ll receive a tracking number via SMS or email. Track your order using the provided link.</p>
          <h2 className="text-white text-xl font-semibold mt-8 mb-3">Delays</h2>
          <p>Delivery times may vary during peak seasons, public holidays, or unforeseen circumstances. We&apos;ll keep you informed of any delays.</p>
        </div>
      </div>
    </div>
  );
}
