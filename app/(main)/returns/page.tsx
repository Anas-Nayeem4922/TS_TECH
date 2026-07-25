export default function ReturnsPage() {
    return (
        <div className='min-h-screen pt-20 pb-16'>
            <div className='max-w-3xl mx-auto px-4 sm:px-6 py-12'>
                <div className='badge-gold inline-block mb-4'>Policies</div>
                <h1 className='text-3xl font-bold text-white mb-8'>
                    Return & Refund Policy
                </h1>
                <div className='text-silver-400 space-y-6'>
                    <p>
                        At TS Technology, customer satisfaction is our priority.
                        If you receive a product that is damaged, defective, or
                        different from what you ordered, we're here to help.
                    </p>
                    <h2 className='text-white text-xl font-semibold mt-8 mb-3'>
                        Return Eligibility
                    </h2>
                    <p>
                        You can request a return within 7 days of receiving your
                        order if:
                    </p>
                    <ul className='list-disc list-inside space-y-1'>
                        <li>You received the wrong product.</li>
                        <li>The product arrived damaged.</li>
                        <li>The product has a manufacturing defect.</li>
                    </ul>
                    <p>
                        To process your request, please provide your order
                        number along with clear photos or an unboxing video
                        showing the issue.
                    </p>
                    <h2 className='text-white text-xl font-semibold mt-8 mb-3'>
                        Non-Returnable Items
                    </h2>
                    <p>Returns will not be accepted for:</p>
                    <ul className='list-disc list-inside space-y-1'>
                        <li>
                            Products damaged due to misuse, accidental damage,
                            water damage, or improper handling.
                        </li>
                        <li>
                            Products with physical damage caused after delivery.
                        </li>
                        <li>Customized or personalized products.</li>
                        <li>
                            {" "}
                            Mobile skins, screen protectors, and other
                            consumable accessories once used.
                        </li>
                        <li>
                            Products returned without their original packaging,
                            accessories, manuals, or invoice.
                        </li>
                    </ul>
                    <h2 className='text-white text-xl font-semibold mt-8 mb-3'>
                        ⁠Replacement & Refund
                    </h2>
                    <ul className='list-disc list-inside space-y-1'>
                        <li>
                            If the returned product is verified as defective or
                            incorrect, we will provide a free replacement
                            (subject to stock availability).
                        </li>
                        <li>
                            If a replacement is unavailable, a full refund will
                            be issued.
                        </li>
                    </ul>
                    <h2 className='text-white text-xl font-semibold mt-8 mb-3'>
                        Refund Process
                    </h2>
                    <p>
                        Once we receive and inspect the returned product,
                        approved refunds will be processed within 3-7 business
                        days. The refund will be credited to your original
                        payment method or as otherwise agreed.
                    </p>
                    <h2 className='text-white text-xl font-semibold mt-8 mb-3'>
                        Brand Warranty
                    </h2>
                    <p>
                        Products covered by a manufacturer's warranty should be
                        serviced through the respective brand's authorized
                        service center after the 7-day return period.
                    </p>
                    <h2 className='text-white text-xl font-semibold mt-8 mb-3'>
                        Return Shipping
                    </h2>
                    <ul className='list-disc list-inside space-y-1'>
                        <li>
                            If the return is due to our error (wrong, damaged,
                            or defective product), TS Technology will bear the
                            return shipping cost.
                        </li>
                        <li>
                            In all other approved cases, return shipping charges
                            may be borne by the customer.
                        </li>
                    </ul>
                    <h2 className='text-white text-xl font-semibold mt-8 mb-3'>
                        How to Return
                    </h2>
                    <p>
                        Contact us at{" "}
                        <a href='tel:8240761985' className='text-gold-400'>
                            +91 8240761985
                        </a>{" "}
                        or email{" "}
                        <a
                            href='mailto:ts.technology.ccu@gmail.com'
                            className='text-gold-400'
                        >
                            ts.technology.ccu@gmail.com
                        </a>{" "}
                        with your order number and reason for return.
                    </p>
                </div>
            </div>
        </div>
    );
}
