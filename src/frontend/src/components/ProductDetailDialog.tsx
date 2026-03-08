import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Crown, Package, ShoppingCart, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAddToCart } from "../hooks/useQueries";
import { formatINR } from "../utils/currency";
import CategoryBadge from "./CategoryBadge";
import CheckoutDialog from "./CheckoutDialog";
import ProductImage from "./ProductImage";
import StarRating from "./StarRating";

interface ProductDetailDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProductDetailDialog({
  product,
  open,
  onOpenChange,
}: ProductDetailDialogProps) {
  const { identity, login } = useInternetIdentity();
  const addToCart = useAddToCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  if (!product) return null;

  const isOutOfStock = product.stock === BigInt(0);
  const isLoggedIn = !!identity;
  const isLuxury = product.category === "Luxury Products";

  const handleAddToCart = async () => {
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

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      toast.error("Please sign in to purchase");
      return;
    }
    if (isOutOfStock) return;
    setCheckoutOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          data-ocid="product.modal"
          className="max-w-2xl w-full p-0 overflow-hidden"
        >
          {/* Luxury gold top bar */}
          {isLuxury && (
            <div className="h-0.5 bg-gradient-to-r from-gold via-gold/80 to-gold" />
          )}

          <div className="grid md:grid-cols-2">
            {/* Image */}
            <div className="h-64 md:h-auto min-h-64 relative">
              <ProductImage
                imageUrl={product.imageUrl}
                category={product.category}
                name={product.name}
              />
              {isOutOfStock && (
                <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center">
                  <span className="bg-foreground text-background text-sm font-semibold px-4 py-2 rounded-full">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col gap-4">
              <DialogHeader className="space-y-0">
                <div className="flex items-start gap-2 mb-2 flex-wrap">
                  <CategoryBadge category={product.category} />
                  {isLuxury && (
                    <div className="badge-luxury inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium">
                      <Crown className="w-2.5 h-2.5" />
                      Luxury
                    </div>
                  )}
                </div>
                <DialogTitle className="font-display text-2xl leading-tight text-foreground">
                  {product.name}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground text-sm mt-2 leading-relaxed">
                  {product.description}
                </DialogDescription>
              </DialogHeader>

              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold text-primary">
                  {formatINR(product.price)}
                </span>
              </div>

              <StarRating productId={product.id} />

              <div className="flex items-center gap-2 text-sm">
                <Package className="w-4 h-4 text-muted-foreground" />
                {isOutOfStock ? (
                  <Badge variant="destructive" className="text-xs">
                    Out of Stock
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">
                    <span className="text-foreground font-medium">
                      {Number(product.stock)}
                    </span>{" "}
                    in stock — order soon
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2.5 mt-auto pt-2">
                {!isLoggedIn ? (
                  <div className="text-center py-3 bg-muted/50 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-2">
                      Sign in to add to cart or purchase
                    </p>
                    <Button
                      onClick={login}
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Sign In
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button
                      onClick={handleAddToCart}
                      disabled={isOutOfStock || addToCart.isPending}
                      variant="outline"
                      data-ocid="product.modal_add_cart_button"
                      className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors h-10"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {addToCart.isPending ? "Adding…" : "Add to Cart"}
                    </Button>
                    <Button
                      onClick={handleBuyNow}
                      disabled={isOutOfStock}
                      data-ocid="product.modal_buy_button"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-10"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Buy Now
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        quickBuyProduct={product}
      />
    </>
  );
}
