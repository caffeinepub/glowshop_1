import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { MOCK_PRODUCTS } from "../data/mockProducts";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetAllProducts,
  useGetCart,
  useRemoveFromCart,
  useUpdateCartQuantity,
} from "../hooks/useQueries";
import { formatINR } from "../utils/currency";
import CheckoutDialog from "./CheckoutDialog";
import ProductImage from "./ProductImage";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { data: cartItems = [] } = useGetCart();
  const { data: allProducts = [] } = useGetAllProducts();
  const removeFromCart = useRemoveFromCart();
  const updateQty = useUpdateCartQuantity();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const isLoggedIn = !!identity;
  const products = allProducts.length > 0 ? allProducts : MOCK_PRODUCTS;

  const cartWithProducts = cartItems.map((item) => ({
    ...item,
    product: products.find((p) => p.id === item.productId),
  }));

  const subtotal = cartWithProducts.reduce((sum, item) => {
    if (!item.product) return sum;
    return sum + Number(item.product.price) * Number(item.quantity);
  }, 0);
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + tax;

  const handleRemove = async (productId: string) => {
    try {
      await removeFromCart.mutateAsync(productId);
      toast.success("Item removed from cart");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const handleQuantityChange = async (
    productId: string,
    currentQty: bigint,
    delta: number,
  ) => {
    const newQty = Number(currentQty) + delta;
    if (newQty <= 0) {
      await handleRemove(productId);
      return;
    }
    try {
      await updateQty.mutateAsync({
        productId,
        quantity: BigInt(newQty),
      });
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          data-ocid="cart.panel"
          side="right"
          className="w-full sm:max-w-md flex flex-col p-0"
        >
          <SheetHeader className="px-6 py-5 border-b border-border">
            <SheetTitle className="font-display text-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Your Cart
                {cartItems.length > 0 && (
                  <span className="text-sm font-normal text-muted-foreground">
                    ({cartItems.reduce((s, i) => s + Number(i.quantity), 0)}{" "}
                    items)
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                data-ocid="cart.close_button"
                className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Close cart"
              >
                <X className="w-4 h-4" />
              </button>
            </SheetTitle>
          </SheetHeader>

          {!isLoggedIn ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6 py-12 text-center">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-muted-foreground" />
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-foreground">
                  Sign in to view your cart
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your saved items will appear here after signing in
                </p>
              </div>
              <Button
                onClick={login}
                disabled={isLoggingIn}
                className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
              >
                {isLoggingIn ? "Signing in…" : "Sign In"}
              </Button>
            </div>
          ) : cartWithProducts.length === 0 ? (
            <div
              data-ocid="cart.empty_state"
              className="flex-1 flex flex-col items-center justify-center gap-5 px-6 py-12 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-muted-foreground" />
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-foreground">
                  Your cart is empty
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Discover our luxury products and add them to your cart
                </p>
              </div>
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 px-6 py-4">
                <div className="space-y-5">
                  {cartWithProducts.map((item, idx) => {
                    if (!item.product) return null;
                    const ocidIndex = idx + 1;
                    return (
                      <div
                        key={item.productId}
                        data-ocid={`cart.item.${ocidIndex}`}
                        className="flex items-start gap-3"
                      >
                        {/* Image */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-border">
                          <ProductImage
                            imageUrl={item.product.imageUrl}
                            category={item.product.category}
                            name={item.product.name}
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground leading-snug truncate">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatINR(item.product.price)} each
                          </p>
                          {/* Quantity controls */}
                          <div className="flex items-center gap-1.5 mt-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleQuantityChange(
                                  item.productId,
                                  item.quantity,
                                  -1,
                                )
                              }
                              className="w-7 h-7 rounded-lg border border-border flex items-center justify-center hover:bg-muted hover:border-primary/30 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold">
                              {Number(item.quantity)}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleQuantityChange(
                                  item.productId,
                                  item.quantity,
                                  1,
                                )
                              }
                              className="w-7 h-7 rounded-lg border border-border flex items-center justify-center hover:bg-muted hover:border-primary/30 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Right side: price + remove */}
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <span className="font-display font-bold text-sm text-foreground">
                            {formatINR(
                              Number(item.product.price) *
                                Number(item.quantity),
                            )}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemove(item.productId)}
                            data-ocid={`cart.remove.button.${ocidIndex}`}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            aria-label={`Remove ${item.product.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              {/* Footer totals + checkout */}
              <div className="px-6 py-5 border-t border-border space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{formatINR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>GST (8%)</span>
                    <span>{formatINR(tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-foreground text-base pt-0.5">
                    <span>Total</span>
                    <span className="font-display text-lg text-primary">
                      {formatINR(total)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => {
                      onOpenChange(false);
                      setCheckoutOpen(true);
                    }}
                    data-ocid="cart.checkout_button"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 font-medium text-base"
                  >
                    Checkout · {formatINR(total)}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="w-full border-border text-muted-foreground hover:text-foreground"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </>
  );
}
