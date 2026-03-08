import type { Product } from "../backend.d";

export const MOCK_PRODUCTS: Product[] = [
  // Luxury Products
  {
    id: "lux-001",
    name: "Red Velvet Lipstick",
    description:
      "An opulent matte lipstick with velvety pigment payoff. Enriched with vitamin E and jojoba oil for long-lasting, non-drying comfort. Available in a stunning deep red hue that commands attention.",
    stock: BigInt(45),
    imageUrl: "/assets/generated/product-lipstick.dim_400x400.jpg",
    category: "Luxury Products",
    price: BigInt(1299),
  },
  {
    id: "lux-002",
    name: "Vitamin C Brightening Face Wash",
    description:
      "A luxurious foaming cleanser infused with 10% stabilized Vitamin C and niacinamide. Gently purifies while visibly brightening the complexion and reducing the appearance of dark spots.",
    stock: BigInt(62),
    imageUrl: "/assets/generated/product-vitamin-c-facewash.dim_400x400.jpg",
    category: "Luxury Products",
    price: BigInt(899),
  },
  {
    id: "lux-003",
    name: "Gold Radiance Serum",
    description:
      "A 24-karat gold-infused facial serum with potent hyaluronic acid and retinol complex. Visibly firms, smooths, and illuminates skin for a youthful, luminous glow.",
    stock: BigInt(28),
    imageUrl: "/assets/generated/product-serum.dim_400x400.jpg",
    category: "Luxury Products",
    price: BigInt(3499),
  },
  {
    id: "lux-004",
    name: "Floral Eau de Parfum",
    description:
      "An exquisite signature fragrance with top notes of Bulgarian rose and jasmine, a heart of peony and lily of the valley, and a warm base of sandalwood, musk, and amber.",
    stock: BigInt(18),
    imageUrl: "/assets/generated/product-perfume.dim_400x400.jpg",
    category: "Luxury Products",
    price: BigInt(4999),
  },
  // Skincare
  {
    id: "sc-001",
    name: "Deep Moisture Cream",
    description:
      "A rich moisturizing cream with shea butter, ceramides, and hyaluronic acid. Provides 48 hours of intense hydration while strengthening the skin barrier for a plump, healthy complexion.",
    stock: BigInt(55),
    imageUrl: "/assets/generated/product-moisturizer.dim_400x400.jpg",
    category: "Skincare",
    price: BigInt(2199),
  },
  {
    id: "sc-002",
    name: "Vitamin C Face Wash",
    description:
      "Daily gel cleanser with Vitamin C and green tea extract. Brightens, antioxidizes, and removes impurities without stripping natural moisture. Leaves skin feeling refreshed and radiant.",
    stock: BigInt(70),
    imageUrl: "/assets/generated/product-vitamin-c-facewash.dim_400x400.jpg",
    category: "Skincare",
    price: BigInt(899),
  },
  {
    id: "sc-003",
    name: "Hydrating Serum",
    description:
      "A lightweight serum loaded with 3 molecular weights of hyaluronic acid plus niacinamide. Plumps fine lines, minimizes pores, and delivers visible radiance after the first application.",
    stock: BigInt(38),
    imageUrl: "/assets/generated/product-serum.dim_400x400.jpg",
    category: "Skincare",
    price: BigInt(3499),
  },
  // Haircare
  {
    id: "hc-001",
    name: "Volumizing Shampoo",
    description:
      "A sulfate-free volumizing shampoo enriched with biotin and keratin protein. Gently cleanses, strengthens strands from root to tip, and dramatically boosts body and shine.",
    stock: BigInt(60),
    imageUrl: "/assets/generated/product-shampoo.dim_400x400.jpg",
    category: "Haircare",
    price: BigInt(1299),
  },
  {
    id: "hc-002",
    name: "Repair Conditioner",
    description:
      "An intensely repairing conditioner with argan oil, collagen, and silk proteins. Seals the cuticle, reduces breakage by 98%, and leaves hair silky smooth and brilliantly shiny.",
    stock: BigInt(52),
    imageUrl: "/assets/generated/product-conditioner.dim_400x400.jpg",
    category: "Haircare",
    price: BigInt(1499),
  },
  {
    id: "hc-003",
    name: "Argan Oil Hair Mask",
    description:
      "A deeply nourishing weekly treatment with pure Moroccan argan oil and shea butter. Restores elasticity, eliminates frizz, and transforms even the most damaged hair into silky perfection.",
    stock: BigInt(35),
    imageUrl: "/assets/generated/product-hair-mask.dim_400x400.jpg",
    category: "Haircare",
    price: BigInt(2299),
  },
  // Makeup
  {
    id: "mk-001",
    name: "Liquid Foundation",
    description:
      "Buildable medium-to-full coverage foundation with SPF 20. Skin-perfecting formula blurs pores and fine lines while controlling oil for up to 16 hours of flawless, natural-finish wear.",
    stock: BigInt(44),
    imageUrl: "/assets/generated/product-foundation.dim_400x400.jpg",
    category: "Makeup",
    price: BigInt(1999),
  },
  {
    id: "mk-002",
    name: "Black Mascara",
    description:
      "Dramatic volume and curl mascara with an oversized brush that coats every lash from root to tip. Smudge-proof, flake-proof, and buildable for lashes that command attention all day.",
    stock: BigInt(78),
    imageUrl: "/assets/generated/product-mascara.dim_400x400.jpg",
    category: "Makeup",
    price: BigInt(999),
  },
  {
    id: "mk-003",
    name: "Eye Shadow Palette",
    description:
      "A curated 12-shade palette featuring matte, shimmer, and foil finishes in rosy nudes, champagne golds, and deep plums. Create everything from subtle day looks to dramatic evening glamour.",
    stock: BigInt(32),
    imageUrl: "/assets/generated/product-eyeshadow.dim_400x400.jpg",
    category: "Makeup",
    price: BigInt(2799),
  },
  {
    id: "mk-004",
    name: "Red Velvet Lipstick",
    description:
      "A bold matte lipstick with rich, long-wearing color. Its creamy formula glides on effortlessly and stays put for hours without cracking or fading.",
    stock: BigInt(56),
    imageUrl: "/assets/generated/product-lipstick.dim_400x400.jpg",
    category: "Makeup",
    price: BigInt(1299),
  },
  // Personal Care
  {
    id: "pc-001",
    name: "Fresh Deodorant Roll-On",
    description:
      "48-hour protection roll-on with natural mineral extracts and aloe vera. Alcohol-free formula is gentle on sensitive skin while keeping you fresh and confident all day long.",
    stock: BigInt(85),
    imageUrl: "/assets/generated/product-deodorant.dim_400x400.jpg",
    category: "Personal Care",
    price: BigInt(499),
  },
  {
    id: "pc-002",
    name: "Exfoliating Body Scrub",
    description:
      "A revitalizing sugar and sea salt scrub infused with coconut oil and vitamin E. Buffs away dead skin cells to reveal irresistibly soft, glowing skin from head to toe.",
    stock: BigInt(48),
    imageUrl: "/assets/generated/product-scrub.dim_400x400.jpg",
    category: "Personal Care",
    price: BigInt(1299),
  },
  {
    id: "pc-003",
    name: "Moisturizing Body Lotion",
    description:
      "A lightweight, fast-absorbing body lotion with shea butter, cocoa butter, and vitamin E. Delivers 24 hours of non-greasy moisture and leaves skin visibly softer and smoother.",
    stock: BigInt(63),
    imageUrl: "/assets/generated/product-body-lotion.dim_400x400.jpg",
    category: "Personal Care",
    price: BigInt(1599),
  },
  // Fragrance
  {
    id: "fr-001",
    name: "Floral Eau de Parfum",
    description:
      "A feminine floral signature fragrance with top notes of Bulgarian rose, heart of peony and magnolia, and a warm base of sandalwood, vetiver, and white musk. Long-lasting 8-10 hour projection.",
    stock: BigInt(22),
    imageUrl: "/assets/generated/product-perfume.dim_400x400.jpg",
    category: "Fragrance",
    price: BigInt(4999),
  },
  {
    id: "fr-002",
    name: "Woody Cologne",
    description:
      "A sophisticated woody fragrance for him and her. Opens with citrus bergamot and spicy cardamom, settles into cedar, vetiver, and a warm amber base. Confident, refined, and long-lasting.",
    stock: BigInt(30),
    imageUrl: "/assets/generated/product-cologne.dim_400x400.jpg",
    category: "Fragrance",
    price: BigInt(3499),
  },
  // Beauty
  {
    id: "bty-001",
    name: "Eye Shadow Palette",
    description:
      "A dreamy 12-shade neutral-to-smoky palette with buttery-smooth pigmentation. Matte, satin, and glitter finishes for every look — from office chic to late-night glamour.",
    stock: BigInt(41),
    imageUrl: "/assets/generated/product-eyeshadow.dim_400x400.jpg",
    category: "Beauty",
    price: BigInt(2799),
  },
  {
    id: "bty-002",
    name: "Black Mascara",
    description:
      "Volumizing and lengthening mascara with a precision curved brush for precise, clump-free application. Buildable formula delivers lashes so full they look like falsies.",
    stock: BigInt(92),
    imageUrl: "/assets/generated/product-mascara.dim_400x400.jpg",
    category: "Beauty",
    price: BigInt(999),
  },
  {
    id: "bty-003",
    name: "Liquid Foundation",
    description:
      "Skin-perfecting liquid foundation with a satin finish and medium-buildable coverage. Contains SPF 15 and skincare actives that improve skin over time with daily wear.",
    stock: BigInt(37),
    imageUrl: "/assets/generated/product-foundation.dim_400x400.jpg",
    category: "Beauty",
    price: BigInt(1999),
  },
];

export const LUXURY_PRODUCTS = MOCK_PRODUCTS.filter(
  (p) => p.category === "Luxury Products",
);

export const CATEGORIES = [
  "All",
  "Skincare",
  "Haircare",
  "Makeup",
  "Personal Care",
  "Fragrance",
  "Beauty",
  "Luxury Products",
] as const;

export type Category = (typeof CATEGORIES)[number];
