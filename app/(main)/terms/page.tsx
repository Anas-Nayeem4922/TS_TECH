import Link from "next/link";

export default function TermsPage() {
    return (
        <div className='min-h-screen pt-20 pb-16'>
            <div className='max-w-3xl mx-auto px-4 sm:px-6 py-12'>
                <div className='badge-gold inline-block mb-4'>Legal</div>
                <h1 className='text-3xl font-bold text-white mb-8'>
                    Terms & Conditions
                </h1>
                <div className='text-silver-400 space-y-6'>
                    <p>Last updated: July 2026</p>
                    <p>
                        By using TS Technology&apos;s website or placing an
                        order, you agree to these terms and conditions.
                    </p>
                    <ul className='list-disc list-inside space-y-1'>
                        <li>
                            All orders are subject to product availability and
                            order confirmation.
                        </li>
                        <li>
                            Product prices and specifications may change without
                            prior notice.
                        </li>
                        <li>
                            We reserve the right to cancel or refuse any order
                            if necessary.
                        </li>
                        <li>
                            Payments must be completed before order processing
                            (except Cash on Delivery, if available).
                        </li>
                        <li>
                            Delivery times are estimated and may vary due to
                            courier or unforeseen delays.
                        </li>
                        <li>
                            Returns and refunds are governed by our Return &
                            Refund Policy.
                        </li>
                        <li>
                            Products with a manufacturer's warranty must be
                            claimed through the respective brand after the
                            return period.
                        </li>
                        <li>
                            All website content, including text, images, and
                            logos, is the property of TS Technology and may not
                            be copied without permission.
                        </li>
                        <li>
                            TS Technology is not responsible for damages
                            resulting from misuse of products or incorrect
                            information provided by customers.
                        </li>
                    </ul>
                    <h2 className='text-white text-xl font-semibold mt-8 mb-3'>
                        Contact
                    </h2>
                    <p>
                        Questions? Reach us at{" "}
                        <Link
                            href='mailto:ts.technology.ccu@gmail.com'
                            className='text-gold-400'
                        >
                            ts.technology.ccu@gmail.com
                        </Link>{" "}
                        or call{" "}
                        <a href='tel:8240761985' className='text-gold-400'>
                            +91 8240761985
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
