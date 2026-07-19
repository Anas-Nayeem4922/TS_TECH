import Link from "next/link";

export default function PrivacyPolicyPage() {
    return (
        <div className='min-h-screen pt-20 pb-16'>
            <div className='max-w-3xl mx-auto px-4 sm:px-6 py-12'>
                <div className='badge-gold inline-block mb-4'>Legal</div>
                <h1 className='text-3xl font-bold text-white mb-8'>
                    Privacy Policy
                </h1>
                <div className='prose prose-invert text-silver-400 space-y-6'>
                    <p>Last updated: July 2026</p>
                    <p>
                        TS Technology (&quot;we&quot;, &quot;us&quot;,
                        &quot;our&quot;) is committed to protecting your
                        personal information and your right to privacy.
                    </p>
                    <h2 className='text-white text-xl font-semibold mt-8 mb-3'>
                        Information We Collect
                    </h2>
                    <p>
                        We collect information you provide when creating an
                        account, placing orders, or contacting us. This includes
                        your name, email address, phone number, and delivery
                        address.
                    </p>
                    <h2 className='text-white text-xl font-semibold mt-8 mb-3'>
                        How We Use Your Information
                    </h2>
                    <p>
                        We use your information to process orders, provide
                        customer support, send order updates, and improve our
                        services.
                    </p>
                    <h2 className='text-white text-xl font-semibold mt-8 mb-3'>
                        Data Security
                    </h2>
                    <p>
                        We implement appropriate security measures to protect
                        your personal information. All data is encrypted in
                        transit and at rest.
                    </p>
                    <h2 className='text-white text-xl font-semibold mt-8 mb-3'>
                        Contact Us
                    </h2>
                    <p>
                        For privacy-related questions, contact us at{" "}
                        <Link
                            href='mailto:ts.technology.ccu@gmail.com'
                            className='text-gold-400'
                        >
                            ts.technology.ccu@gmail.com
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
