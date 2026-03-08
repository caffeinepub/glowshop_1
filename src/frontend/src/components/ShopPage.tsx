import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, Crown, Sparkles } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import {
  CATEGORIES,
  type Category,
  LUXURY_PRODUCTS,
  MOCK_PRODUCTS,
} from "../data/mockProducts";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAddToCart, useGetAllProducts } from "../hooks/useQueries";
import { formatINR } from "../utils/currency";
import CheckoutDialog from "./CheckoutDialog";
import ProductCard from "./ProductCard";
import ProductDetailDialog from "./ProductDetailDialog";
import StarRating from "./StarRating";

interface ShopPageProps {
  searchQuery?: string;
}

export default function ShopPage({ searchQuery = "" }: ShopPageProps) {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const { data: backendProducts, isLoading } = useGetAllProducts();
  const productGridRef = useRef<HTMLDivElement>(null);

  const allProducts = useMemo(() => {
    return backendProducts && backendProducts.length > 0
      ? backendProducts
      : MOCK_PRODUCTS;
  }, [backendProducts]);

  const filteredProducts = useMemo(() => {
    let source = allProducts;
    if (activeCategory !== "All") {
      source = source.filter((p) => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      source = source.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }
    return source;
  }, [allProducts, activeCategory, searchQuery]);

  const luxuryProducts = useMemo(() => {
    if (backendProducts && backendProducts.length > 0) {
      const lux = backendProducts.filter(
        (p) => p.category === "Luxury Products",
      );
      return lux.length > 0 ? lux : LUXURY_PRODUCTS;
    }
    return LUXURY_PRODUCTS;
  }, [backendProducts]);

  const scrollToProducts = () => {
    productGridRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="flex flex-col">
      {/* ── Hero Banner ── */}
      {!isSearching && (
        <section className="relative overflow-hidden">
          <div className="w-full h-80 md:h-[500px] relative">
            <img
              src="/assets/generated/hero-banner.dim_1200x500.jpg"
              alt="GlowShop — Discover Luxury Beauty"
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="hero-overlay absolute inset-0" />
            <div className="absolute inset-0 flex items-center">
              <div className="container max-w-7xl mx-auto px-6 md:px-10">
                <div className="max-w-lg animate-fade-in-up">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-px w-8 bg-gold" />
                    <span className="text-gold text-xs font-medium tracking-[0.2em] uppercase">
                      Premium Collection
                    </span>
                  </div>
                  <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
                    Discover
                    <br />
                    <span className="text-gold-shimmer">Luxury Beauty</span>
                  </h1>
                  <p className="text-white/75 text-base md:text-lg leading-relaxed mb-8 max-w-sm">
                    Curated skincare, makeup &amp; beauty essentials crafted for
                    the modern woman.
                  </p>
                  <Button
                    onClick={scrollToProducts}
                    data-ocid="hero.primary_button"
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 rounded-full px-8 gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Shop Now
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Luxury Products ── */}
      {!isSearching && (
        <section className="py-10 md:py-14 bg-card border-b border-border">
          <div className="container max-w-7xl mx-auto px-4">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gold/15 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    Featured Luxury Products
                  </h2>
                  <p className="text-muted-foreground text-sm mt-0.5">
                    Our most-coveted premium collection
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory("Luxury Products");
                  scrollToProducts();
                }}
                className="hidden sm:flex items-center gap-1.5 text-primary text-sm font-medium hover:underline"
              >
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Horizontal scrollable luxury row */}
            <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-none -mx-1 px-1">
              {luxuryProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-64 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <LuxuryProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Main Shop Section ── */}
      <div
        ref={productGridRef}
        className="container max-w-7xl mx-auto px-4 py-8 md:py-12"
      >
        {/* Category Filters */}
        {!isSearching && (
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap flex-shrink-0 mr-1">
              Browse:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setActiveCategory(cat)}
                data-ocid="category.tab"
                className={`whitespace-nowrap flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : cat === "Luxury Products"
                      ? "bg-card border border-gold/30 text-amber-800/80 hover:border-gold/60 hover:bg-amber-50/60"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-secondary"
                }`}
              >
                {cat === "Luxury Products" && (
                  <Crown className="w-3 h-3 opacity-80" />
                )}
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Section heading */}
        <div className="mb-6">
          {isSearching ? (
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Search Results for &ldquo;{searchQuery}&rdquo;
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {filteredProducts.length} product
                {filteredProducts.length !== 1 ? "s" : ""} found
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  {activeCategory === "All" ? "All Products" : activeCategory}
                </h2>
                {!isLoading && (
                  <p className="text-muted-foreground text-sm mt-1">
                    {filteredProducts.length} product
                    {filteredProducts.length !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
              {activeCategory !== "All" && !isSearching && (
                <button
                  type="button"
                  onClick={() => setActiveCategory("All")}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear filter
                </button>
              )}
            </div>
          )}
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }, (_, i) => `skeleton-${i}`).map((key) => (
              <div
                key={key}
                className="rounded-2xl overflow-hidden border border-border bg-card"
              >
                <Skeleton className="h-52 w-full shimmer" />
                <div className="p-4 space-y-2.5">
                  <Skeleton className="h-4 w-3/4 shimmer" />
                  <Skeleton className="h-3 w-full shimmer" />
                  <Skeleton className="h-3 w-2/3 shimmer" />
                  <div className="pt-2 flex gap-2">
                    <Skeleton className="h-8 w-full shimmer" />
                    <Skeleton className="h-8 w-full shimmer" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div
            data-ocid="products.empty_state"
            className="text-center py-20 flex flex-col items-center gap-4 animate-fade-in"
          >
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-4xl">🌸</span>
            </div>
            <div>
              <p className="font-display text-xl font-semibold text-foreground">
                {isSearching
                  ? "No products match your search"
                  : "No products found"}
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                {isSearching
                  ? "Try a different keyword"
                  : "Try a different category or check back later"}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setActiveCategory("All")}
              className="border-primary/30 text-primary hover:bg-primary/5"
            >
              View all products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Luxury Product Card (for featured section) ──
function LuxuryProductCard({ product }: { product: Product }) {
  const { identity } = useInternetIdentity();
  const addToCart = useAddToCart();
  const [detailOpen, setDetailOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const isOutOfStock = product.stock === BigInt(0);
  const isLoggedIn = !!identity;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.error("Please sign in to add items to your cart");
      return;
    }
    if (isOutOfStock) return;
    try {
      await addToCart.mutateAsync({
        productId: product.id,
        quantity: BigInt(1),
      });
      toast.success(`${product.name} added to cart!`);
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.error("Please sign in to purchase");
      return;
    }
    if (isOutOfStock) return;
    setCheckoutOpen(true);
  };

  return (
    <>
      <button
        type="button"
        className="bg-card rounded-2xl overflow-hidden border border-border card-lift cursor-pointer group relative text-left w-full"
        onClick={() => setDetailOpen(true)}
        aria-label={`View ${product.name}`}
      >
        {/* Gold accent top */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold via-gold/80 to-gold z-10" />

        {/* Crown badge */}
        <div className="absolute top-3 right-3 z-10">
          <div className="w-7 h-7 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center border border-gold/30">
            <Crown className="w-3.5 h-3.5 text-gold" />
          </div>
        </div>

        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-secondary">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100 flex items-center justify-center">
              <span className="text-4xl">👑</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="badge-luxury inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium mb-2">
            <Crown className="w-2.5 h-2.5" />
            Luxury
          </div>
          <h3 className="font-display font-semibold text-foreground text-sm leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mb-3">
            <span className="font-display text-lg font-bold text-primary">
              {formatINR(product.price)}
            </span>
            {isOutOfStock ? (
              <Badge variant="secondary" className="text-xs">
                Out of Stock
              </Badge>
            ) : (
              <Badge className="bg-primary/10 text-primary border-0 text-xs">
                In Stock
              </Badge>
            )}
          </div>
          {/* Action buttons */}
          <div
            className="flex gap-2"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock || addToCart.isPending}
              className="flex-1 h-8 text-xs font-medium border border-primary/30 text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cart
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="flex-1 h-8 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>
          </div>
        </div>
      </button>

      <ProductDetailDialog
        product={product}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        quickBuyProduct={product}
      />
    </>
  );
}
