export default function ReturnsPage() {
  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="badge-gold inline-block mb-4">Policies</div>
        <h1 className="text-3xl font-bold text-white mb-8">Return & Refund Policy</h1>
        <div className="text-silver-400 space-y-6">
          <p>We want you to be completely happy with your purchase. If you&apos;re not satisfied, we&apos;re here to help.</p>
          <h2 className="text-white text-xl font-semibold mt-8 mb-3">7-Day Return Window</h2>
          <p>You have 7 days from the date of delivery to request a return. Items must be in their original condition, unused, and in original packaging.</p>
          <h2 className="text-white text-xl font-semibold mt-8 mb-3">Eligible Returns</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Defective or damaged products</li>
            <li>Wrong product received</li>
            <li>Product not as described</li>
          </ul>
          <h2 className="text-white text-xl font-semibold mt-8 mb-3">Non-Returnable Items</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Opened consumables or hygiene products</li>
            <li>Items damaged due to misuse</li>
            <li>Digital products</li>
          </ul>
          <h2 className="text-white text-xl font-semibold mt-8 mb-3">Refund Process</h2>
          <p>Once we receive and inspect the return, we&apos;ll process your refund within 5–7 business days. Refunds are made to the original payment method.</p>
          <h2 className="text-white text-xl font-semibold mt-8 mb-3">How to Return</h2>
          <p>Contact us at <a href="tel:9681076990" className="text-gold-400">+91 9681076990</a> or email <a href="mailto:info@tstechcanopy.com" className="text-gold-400">info@tstechcanopy.com</a> with your order number and reason for return.</p>
        </div>
      </div>
    </div>
  );
}
