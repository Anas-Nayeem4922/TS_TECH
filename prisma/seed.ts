import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Categories
  const categories = [
    { name: 'Mobile Covers', slug: 'mobile-covers', description: 'Premium protection for your smartphone', icon: 'Smartphone', imageUrl: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg', displayOrder: 1 },
    { name: 'Chargers', slug: 'chargers', description: 'Fast & reliable charging solutions', icon: 'Zap', imageUrl: 'https://images.pexels.com/photos/4526414/pexels-photo-4526414.jpeg', displayOrder: 2 },
    { name: 'Cables', slug: 'cables', description: 'Durable cables for every device', icon: 'Cable', imageUrl: 'https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg', displayOrder: 3 },
    { name: 'Earphones', slug: 'earphones', description: 'Immersive audio experiences', icon: 'Headphones', imageUrl: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg', displayOrder: 4 },
    { name: 'Laptop Accessories', slug: 'laptop-accessories', description: 'Enhance your productivity', icon: 'Laptop', imageUrl: 'https://images.pexels.com/photos/7974/pexels-photo.jpg', displayOrder: 5 },
    { name: 'Smartwatches', slug: 'smartwatches', description: 'Style meets technology on your wrist', icon: 'Watch', imageUrl: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg', displayOrder: 6 },
    { name: 'Power Banks', slug: 'power-banks', description: 'Never run out of battery again', icon: 'BatteryCharging', imageUrl: 'https://images.pexels.com/photos/4526407/pexels-photo-4526407.jpeg', displayOrder: 7 },
    { name: 'Other Gadgets', slug: 'other-gadgets', description: 'Cool gadgets and accessories', icon: 'Cpu', imageUrl: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg', displayOrder: 8 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  const catMap = Object.fromEntries(
    await prisma.category.findMany().then((cs) => cs.map((c) => [c.slug, c.id]))
  );

  // Products
  const products = [
    {
      name: 'ShockGuard Pro Case — iPhone 15',
      slug: 'shockguard-pro-iphone-15',
      description: 'Military-grade drop protection with a sleek matte finish. Raised bezels protect your screen and camera.',
      price: 699, comparePrice: 1199,
      images: ['https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg', 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg'],
      categoryId: catMap['mobile-covers'], brand: 'TS Shield', stockQuantity: 50, isFeatured: true,
      tags: ['iphone', 'case', 'protection'], warrantyInfo: '6 months warranty',
    },
    {
      name: 'UltraCharge 65W GaN Adapter',
      slug: 'ultracharge-65w-gan',
      description: 'Charge your laptop, phone and tablet simultaneously with this compact GaN charger. Universal compatibility.',
      price: 1299, comparePrice: 2199,
      images: ['https://images.pexels.com/photos/4526414/pexels-photo-4526414.jpeg'],
      categoryId: catMap['chargers'], brand: 'TS Power', stockQuantity: 30, isFeatured: true, fastDelivery: true,
      tags: ['charger', 'gan', 'fast-charge'], warrantyInfo: '1 year warranty',
    },
    {
      name: 'BravoKnit USB-C to USB-C Cable 1.5m',
      slug: 'bravoknit-usbc-cable',
      description: 'Nylon braided, 100W PD fast charging cable. Compatible with all USB-C devices.',
      price: 399, comparePrice: 699,
      images: ['https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg'],
      categoryId: catMap['cables'], brand: 'TS Link', stockQuantity: 100, fastDelivery: true,
      tags: ['cable', 'usb-c', 'charging'], warrantyInfo: '6 months warranty',
    },
    {
      name: 'BassCore X3 Earphones',
      slug: 'basscore-x3-earphones',
      description: 'Deep bass, crystal-clear highs. Ergonomic design for all-day comfort with tangle-free cable.',
      price: 799, comparePrice: 1499,
      images: ['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg'],
      categoryId: catMap['earphones'], brand: 'TS Audio', stockQuantity: 45, isFeatured: true,
      tags: ['earphones', 'bass', 'audio'], warrantyInfo: '6 months warranty',
    },
    {
      name: 'LapShield Sleeve 15.6" Laptop Bag',
      slug: 'lapshield-sleeve-156',
      description: 'Water-resistant neoprene laptop sleeve with accessory pocket. Fits up to 15.6" laptops.',
      price: 899, comparePrice: 1599,
      images: ['https://images.pexels.com/photos/7974/pexels-photo.jpg'],
      categoryId: catMap['laptop-accessories'], brand: 'TS Gear', stockQuantity: 25,
      tags: ['laptop', 'sleeve', 'bag'], warrantyInfo: '3 months warranty',
    },
    {
      name: 'ProFlow Smartwatch Series 3',
      slug: 'proflow-smartwatch-s3',
      description: 'Health tracking, call notifications, and 7-day battery life. IP68 waterproof.',
      price: 3499, comparePrice: 5999,
      images: ['https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg'],
      categoryId: catMap['smartwatches'], brand: 'TS Wear', stockQuantity: 20, isFeatured: true, isDailyDeal: true,
      tags: ['smartwatch', 'fitness', 'waterproof'], warrantyInfo: '1 year warranty',
    },
    {
      name: 'PowerVault 20000mAh Power Bank',
      slug: 'powervault-20000',
      description: 'Dual USB-A + USB-C output. 22.5W fast charge. LED indicator. Airline approved.',
      price: 1599, comparePrice: 2799,
      images: ['https://images.pexels.com/photos/4526407/pexels-photo-4526407.jpeg'],
      categoryId: catMap['power-banks'], brand: 'TS Power', stockQuantity: 40, isFeatured: true, isDailyDeal: true,
      tags: ['powerbank', 'portable', 'charging'], warrantyInfo: '1 year warranty',
    },
    {
      name: 'MagMount Pro Car Phone Holder',
      slug: 'magmount-pro-car-holder',
      description: 'Strong magnetic mount for car dashboard / windshield. Universal compatibility, 360° rotation.',
      price: 599, comparePrice: 999,
      images: ['https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg'],
      categoryId: catMap['other-gadgets'], brand: 'TS Drive', stockQuantity: 60,
      tags: ['car', 'mount', 'holder'], warrantyInfo: '3 months warranty',
    },
    {
      name: 'CrystalArmor Case — Samsung S24',
      slug: 'crystalarmor-samsung-s24',
      description: 'Transparent hard-shell case with gold-trim accents. Shows off your phone while protecting it.',
      price: 549, comparePrice: 899,
      images: ['https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg'],
      categoryId: catMap['mobile-covers'], brand: 'TS Shield', stockQuantity: 70, isDailyDeal: true,
      tags: ['samsung', 'case', 'clear'], warrantyInfo: '6 months warranty',
    },
    {
      name: 'AirPods Case Cover — Leather',
      slug: 'airpods-case-leather',
      description: 'Genuine-feel leather protective case for AirPods Pro 2. Carabiner clip included.',
      price: 449, comparePrice: 799,
      images: ['https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg'],
      categoryId: catMap['mobile-covers'], brand: 'TS Shield', stockQuantity: 80,
      tags: ['airpods', 'case', 'leather'], warrantyInfo: '3 months warranty',
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }

  console.log(`Seeded ${categories.length} categories and ${products.length} products`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
