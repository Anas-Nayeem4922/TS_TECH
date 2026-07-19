import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { DailyDealsBanner } from '@/components/DailyDealsBanner';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DailyDealsBanner />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
