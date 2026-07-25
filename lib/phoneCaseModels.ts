export const PHONE_CASE_BRANDS: Record<string, string[]> = {
    Apple: [
        "iPhone 17 Pro",
        "iPhone 17",
        "iPhone 16 Pro Max",
        "iPhone 16 Pro",
        "iPhone 16",
        "iPhone 15 Pro Max",
        "iPhone 15 Pro",
        "iPhone 15",
        "iPhone 14 Pro Max",
        "iPhone 14 Pro",
        "iPhone 14",
        "iPhone 13",
        "iPhone 12",
        "iPhone SE",
    ],
    Samsung: [
        "Galaxy S25 Ultra",
        "Galaxy S25+",
        "Galaxy S25",
        "Galaxy S24 Ultra",
        "Galaxy S24+",
        "Galaxy S24",
        "Galaxy A55",
        "Galaxy A35",
        "Galaxy M35",
    ],
    OnePlus: ["13", "13R", "12R", "12", "11R", "11", "Nord CE 4", "Nord 4"],
    Xiaomi: [
        "14",
        "14 CIVI",
        "Redmi Note 13 Pro",
        "Redmi Note 13",
        "Redmi 13C",
    ],
    Motorola: ["Edge 30 Pro", "G34", "G32"],
    Nothing: ["CMF Phone 1", "CMF Phone 2"],
    Realme: ["13 Pro+", "13 Pro", "P1 Pro", "Narzo 70 Pro"],
    Oppo: ["Reno 12 Pro", "Reno 12", "F27 Pro+"],
    Vivo: ["X100 Pro", "V30 Pro", "T3 Pro"],
};

export const PHONE_CASE_BRAND_NAMES = Object.keys(PHONE_CASE_BRANDS);

const PHONE_CASE_CATEGORY_SLUGS = [
    "mobile-covers",
    "mobile-cases",
    "phone-cases",
    "cases",
];
const PHONE_CASE_KEYWORDS = ["case", "cover", "back cover", "mobile cover"];

export function isPhoneCaseProduct(product: {
    categoryId?: string | null;
    category?: { slug?: string } | null;
    name: string;
    slug: string;
    tags?: string[];
}): boolean {
    const categorySlug = product.category?.slug;
    if (categorySlug && PHONE_CASE_CATEGORY_SLUGS.includes(categorySlug))
        return true;
    const nameLower = product.name.toLowerCase();
    if (PHONE_CASE_KEYWORDS.some((k) => nameLower.includes(k))) return true;
    const tags = product.tags ?? [];
    if (
        tags.some((t) =>
            PHONE_CASE_KEYWORDS.some((k) => t.toLowerCase().includes(k)),
        )
    )
        return true;
    return false;
}
