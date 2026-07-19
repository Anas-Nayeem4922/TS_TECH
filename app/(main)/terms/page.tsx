import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="badge-gold inline-block mb-4">Legal</div>
        <h1 className="text-3xl font-bold text-white mb-8">Terms & Conditions</h1>
        <div className="text-silver-400 space-y-6">
          <p>Last updated: July 2026</p>
          <p>By using TS Tech Canopy&apos;s website or placing an order, you agree to these terms and conditions.</p>
          <h2 className="text-white text-xl font-semibold mt-8 mb-3">Products & Pricing</h2>
          <p>All prices are in Indian Rupees (INR) and are subject to change. We reserve the right to modify prices without prior notice. Orders are confirmed only after payment is processed or COD is confirmed.</p>
          <h2 className="text-white text-xl font-semibold mt-8 mb-3">Order Acceptance</h2>
          <p>We reserve the right to refuse or cancel any order if we suspect fraudulent activity, unavailability of stock, or pricing errors.</p>
          <h2 className="text-white text-xl font-semibold mt-8 mb-3">Intellectual Property</h2>
          <p>All content, logos, and trademarks on this website are the property of TS Tech Canopy and may not be reproduced without prior written permission.</p>
          <h2 className="text-white text-xl font-semibold mt-8 mb-3">Contact</h2>
          <p>Questions? Reach us at <Link href="mailto:info@tstechcanopy.com" className="text-gold-400">info@tstechcanopy.com</Link> or call <a href="tel:9681076990" className="text-gold-400">+91 9681076990</a></p>
        </div>
      </div>
    </div>
  );
}
