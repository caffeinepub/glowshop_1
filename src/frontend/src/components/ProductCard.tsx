import { Button } from "@/components/ui/button";
import { Crown, ShoppingCart, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAddToCart } from "../hooks/useQueries";
import { formatINR } from "../utils/currency";
import CategoryBadge from "./CategoryBadge";
import CheckoutDialog from "./CheckoutDialog";
import ProductDetailDialog from "./ProductDetailDialog";
import StarRating from "./StarRating";

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const { identity } = useInternetIdentity();
  const addToCart = useAddToCart();
  const [detailOpen, setDetailOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const isOutOfStock = product.stock === BigInt(0);
  const isLoggedIn = !!identity;
  const ocidIndex = index + 1;
  const isLuxury = product.category === "Luxury Products";

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
      toast.error("Failed to add to cart. Please try again.");
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
        data-ocid={`product.item.${ocidIndex}`}
        className="card-lift bg-card rounded-2xl overflow-hidden border border-border group cursor-pointer animate-fade-in-up relative text-left w-full"
        style={{ animationDelay: `${(index % 8) * 0.05}s` }}
        onClick={() => setDetailOpen(true)}
        aria-label={`View details for ${product.name}`}
      >
        {/* Luxury indicator */}
        {isLuxury && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold via-gold/80 to-gold z-10" />
        )}

        {/* Image container */}
        <div className="relative h-52 overflow-hidden bg-secondary">
          <ProductCardImage
            imageUrl={product.imageUrl}
            category={product.category}
            name={product.name}
          />
          {isOutOfStock && (
            <div className="absolute top-2 right-2">
              <span className="bg-foreground/80 text-background text-xs font-medium px-2.5 py-1 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
          <div className="absolute top-2 left-2">
            <CategoryBadge category={product.category} />
          </div>
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-display font-semibold text-foreground text-sm leading-snug mb-1 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          <p className="text-muted-foreground text-xs leading-relaxed mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="mb-3">
            <StarRating productId={product.id} />
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="font-display text-xl font-bold text-primary">
              {formatINR(product.price)}
            </span>
            {isOutOfStock ? (
              <span className="text-xs text-destructive font-medium">
                Out of Stock
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">
                {Number(product.stock) > 0
                  ? `${Number(product.stock)} left`
                  : ""}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div
            className="flex gap-2"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddToCart}
              disabled={isOutOfStock || addToCart.isPending}
              data-ocid={`product.add_cart_button.${ocidIndex}`}
              className="flex-1 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all text-xs h-9"
            >
              <ShoppingCart className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
              <span className="truncate">Add to Cart</span>
            </Button>
            <Button
              size="sm"
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              data-ocid={`product.buy_now_button.${ocidIndex}`}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-9"
            >
              <Zap className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
              <span className="truncate">Buy Now</span>
            </Button>
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

// Inline product image component for cards
function ProductCardImage({
  imageUrl,
  category,
  name,
}: {
  imageUrl?: string;
  category: string;
  name: string;
}) {
  const [errored, setErrored] = useState(false);

  const categoryGradients: Record<string, string> = {
    "Skin Care": "from-rose-100 via-pink-50 to-rose-200",
    Skincare: "from-rose-100 via-pink-50 to-rose-200",
    "Hair Care": "from-amber-100 via-yellow-50 to-amber-200",
    Haircare: "from-amber-100 via-yellow-50 to-amber-200",
    Makeup: "from-pink-200 via-rose-100 to-fuchsia-200",
    "Body Care": "from-teal-100 via-emerald-50 to-teal-200",
    "Personal Care": "from-sky-100 via-blue-50 to-sky-200",
    Fragrance: "from-purple-100 via-violet-50 to-purple-200",
    Beauty: "from-pink-100 via-rose-50 to-fuchsia-100",
    "Luxury Products": "from-amber-100 via-yellow-50 to-orange-100",
  };

  const categoryEmoji: Record<string, string> = {
    "Skin Care": "✨",
    Skincare: "✨",
    "Hair Care": "💆",
    Haircare: "💆",
    Makeup: "💄",
    "Body Care": "🧴",
    "Personal Care": "🧴",
    Fragrance: "🌸",
    Beauty: "💅",
    "Luxury Products": "👑",
  };

  const gradient =
    categoryGradients[category] ?? "from-rose-100 via-pink-50 to-rose-200";
  const emoji = categoryEmoji[category] ?? "✨";

  if (imageUrl && !errored) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        onError={() => setErrored(true)}
      />
    );
  }

  return (
    <div
      className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
    >
      <span className="text-4xl opacity-80">{emoji}</span>
    </div>
  );
}
