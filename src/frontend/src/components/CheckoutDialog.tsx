import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import { MOCK_PRODUCTS } from "../data/mockProducts";
import { useAddToCart, useClearCart, useGetCart } from "../hooks/useQueries";
import { useGetAllProducts } from "../hooks/useQueries";
import { formatINR } from "../utils/currency";
import ProductImage from "./ProductImage";

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quickBuyProduct?: Product | null;
}

export default function CheckoutDialog({
  open,
  onOpenChange,
  quickBuyProduct,
}: CheckoutDialogProps) {
  const { data: cartItems = [] } = useGetCart();
  const { data: allProducts = [] } = useGetAllProducts();
  const clearCart = useClearCart();
  const addToCart = useAddToCart();
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);

  const products = allProducts.length > 0 ? allProducts : MOCK_PRODUCTS;

  // If quickBuyProduct, show only that product; otherwise show cart
  const lineItems = quickBuyProduct
    ? [{ productId: quickBuyProduct.id, quantity: BigInt(1) }]
    : cartItems;

  const subtotal = lineItems.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return sum;
    return sum + Number(product.price) * Number(item.quantity);
  }, 0);

  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + tax;

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      if (quickBuyProduct) {
        await addToCart.mutateAsync({
          productId: quickBuyProduct.id,
          quantity: BigInt(1),
        });
      }
      await clearCart.mutateAsync();
      setSuccess(true);
      toast.success(
        "Order placed successfully! Thank you for shopping with us.",
      );
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent data-ocid="checkout.dialog" className="max-w-md w-full">
        {success ? (
          <div className="py-8 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold text-foreground">
                Order Placed!
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                Your order has been confirmed. We'll notify you when it ships.
              </p>
            </div>
            <Button
              onClick={handleClose}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-xl">
                Order Summary
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                Review your order before placing it
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {lineItems.length === 0 && (
                <p className="text-muted-foreground text-sm text-center py-4">
                  Your cart is empty
                </p>
              )}
              {lineItems.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                if (!product) return null;
                return (
                  <div key={item.productId} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <ProductImage
                        imageUrl={product.imageUrl}
                        category={product.category}
                        name={product.name}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {Number(item.quantity)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-foreground flex-shrink-0">
                      {formatINR(Number(product.price) * Number(item.quantity))}
                    </span>
                  </div>
                );
              })}
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Estimated Tax (8%)</span>
                <span>{formatINR(tax)}</span>
              </div>
              <div className="flex justify-between font-semibold text-foreground text-base pt-1 border-t border-border">
                <span>Total</span>
                <span className="text-primary font-display text-lg">
                  {formatINR(total)}
                </span>
              </div>
            </div>

            <DialogFooter className="flex gap-2 flex-col sm:flex-row">
              <Button
                variant="outline"
                onClick={handleClose}
                data-ocid="checkout.cancel_button"
                className="flex-1 border-border"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePlaceOrder}
                disabled={placing || lineItems.length === 0}
                data-ocid="checkout.confirm_button"
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {placing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  "Place Order"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
