'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Shield, Zap, Star, Users, Award, Heart, ArrowRight, MapPin } from 'lucide-react';

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="hero-glow" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(201,168,76,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="badge-gold inline-block mb-4">Our Story</div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              About <span className="gold-text">TS Tech Canopy</span>
            </h1>
            <p className="text-silver-400 text-lg leading-relaxed max-w-2xl mx-auto">
              Born in the heart of Kolkata, TS Tech Canopy is more than a tech store — we&apos;re your trusted companion in the digital age. We believe everyone deserves premium tech accessories without breaking the bank.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Who We Are */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl blur-2xl bg-gold-500/10" />
                <div className="relative rounded-3xl overflow-hidden ring-1 ring-gold-500/15 aspect-[4/3]">
                  <Image
                    src="/images/WhatsApp_Image_2026-07-12_at_14.52.06 copy copy.jpeg"
                    alt="TS Tech Canopy"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-800/60 to-transparent" />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-dark-500 border border-gold-500/20 rounded-2xl p-4 shadow-card">
                  <div className="text-2xl font-bold gold-text">3+ Years</div>
                  <div className="text-xs text-silver-500">Serving Kolkata</div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="badge-gold inline-block mb-4">Who We Are</div>
              <h2 className="text-3xl font-bold text-white mb-4">Kolkata&apos;s Trusted Tech Partner</h2>
              <p className="text-silver-400 leading-relaxed mb-4">
                Founded in Rajabazar, Kolkata, TS Tech Canopy started as a small shop with a big dream — to make premium tech accessories accessible to everyone. Today, we serve thousands of happy customers across the city and beyond.
              </p>
              <p className="text-silver-400 leading-relaxed mb-6">
                Our team of tech enthusiasts carefully curates every product in our catalog, ensuring that only the best quality reaches our customers. We work directly with manufacturers to eliminate middlemen and pass the savings on to you.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: '500+', label: 'Products' },
                  { value: '1000+', label: 'Customers' },
                  { value: '4.8★', label: 'Rating' },
                ].map((s) => (
                  <div key={s.label} className="text-center p-4 card-surface rounded-xl border border-white/6">
                    <div className="text-xl font-bold gold-text">{s.value}</div>
                    <div className="text-xs text-silver-500 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-dark-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-12">
            <div className="badge-gold inline-block mb-4">Our Mission</div>
            <h2 className="text-3xl font-bold text-white">What We Stand For</h2>
          </AnimatedSection>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: 'Strength',
                desc: 'Every product we sell is rigorously tested for quality, durability and performance. We never compromise.',
              },
              {
                icon: Star,
                title: 'Style',
                desc: 'Tech accessories should look as good as they perform. We curate products that blend form and function perfectly.',
              },
              {
                icon: Heart,
                title: 'Protection',
                desc: 'We protect what matters most — your devices, your budget, and your trust. Your satisfaction is our guarantee.',
              },
            ].map((item, i) => (
              <AnimatedSection key={item.title}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="text-center card-surface rounded-2xl p-8 border border-white/6 gold-border-hover"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto mb-5">
                    <item.icon size={24} className="text-gold-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-silver-500 leading-relaxed">{item.desc}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="badge-gold inline-block mb-4">Why Choose Us</div>
              <h2 className="text-3xl font-bold text-white mb-6">The TS Tech Canopy Advantage</h2>
              <div className="space-y-4">
                {[
                  { icon: Award, title: 'Genuine Products', desc: 'All products are sourced directly from authorized distributors.' },
                  { icon: Zap, title: 'Fast Delivery', desc: 'Same-day delivery within Kolkata. Pan-India within 3-5 days.' },
                  { icon: Users, title: 'Expert Guidance', desc: 'Our knowledgeable team helps you find the perfect product for your needs.' },
                  { icon: Shield, title: 'Warranty Support', desc: 'Hassle-free warranty claims and after-sales support for all products.' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 p-4 card-surface rounded-xl border border-white/5">
                    <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                      <item.icon size={16} className="text-gold-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm mb-1">{item.title}</div>
                      <div className="text-sm text-silver-500">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="relative rounded-2xl overflow-hidden border border-gold-500/15 p-8 card-surface">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500/5 rounded-full blur-2xl" />
                <div className="relative">
                  <MapPin size={24} className="text-gold-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Visit Our Store</h3>
                  <p className="text-silver-400 mb-4">Come experience our full product range in person at our Rajabazar location.</p>
                  <div className="space-y-2 mb-6">
                    <div className="text-sm text-silver-300">Rajabazar, Kolkata</div>
                    <div className="text-sm text-silver-300">West Bengal - 700009</div>
                    <div className="text-sm text-gold-400 font-medium">+91 9681076990</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {[
                      ['Mon – Sat', '10 AM – 9 PM'],
                      ['Sunday', '11 AM – 7 PM'],
                    ].map(([day, time]) => (
                      <div key={day} className="p-2 bg-white/3 rounded-lg">
                        <div className="text-silver-500 text-xs">{day}</div>
                        <div className="text-white font-medium text-xs">{time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-dark-600/30">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Experience the Difference?</h2>
            <p className="text-silver-400 mb-6">Browse our full collection of premium tech accessories.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/products" className="btn-gold inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold">
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link href="/contact" className="btn-outline-gold inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold">
                Get in Touch
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
