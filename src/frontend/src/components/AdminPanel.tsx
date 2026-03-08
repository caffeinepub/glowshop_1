import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Crown,
  Loader2,
  LogIn,
  Package,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import { MOCK_PRODUCTS } from "../data/mockProducts";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddProduct,
  useDeleteProduct,
  useGetAllProducts,
  useIsAdmin,
  useUpdateProduct,
} from "../hooks/useQueries";
import { formatINR } from "../utils/currency";
import CategoryBadge from "./CategoryBadge";

const CATEGORY_OPTIONS = [
  "Skincare",
  "Haircare",
  "Makeup",
  "Personal Care",
  "Fragrance",
  "Beauty",
  "Luxury Products",
];

interface ProductFormData {
  id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  stock: string;
  imageUrl: string;
}

const emptyForm: ProductFormData = {
  id: "",
  name: "",
  description: "",
  category: "Skincare",
  price: "",
  stock: "",
  imageUrl: "",
};

function productToForm(product: Product): ProductFormData {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    price: String(Number(product.price)),
    stock: String(Number(product.stock)),
    imageUrl: product.imageUrl,
  };
}

function formToProduct(form: ProductFormData): Product {
  return {
    id: form.id || `prod-${Date.now()}`,
    name: form.name.trim(),
    description: form.description.trim(),
    category: form.category,
    price: BigInt(Math.round(Number.parseFloat(form.price) || 0)),
    stock: BigInt(Number.parseInt(form.stock, 10) || 0),
    imageUrl: form.imageUrl.trim(),
  };
}

export default function AdminPanel() {
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: backendProducts, isLoading: productsLoading } =
    useGetAllProducts();
  const { login, isLoggingIn, identity } = useInternetIdentity();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [addOpen, setAddOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormData>(emptyForm);

  const isLoggedIn = !!identity;

  const products =
    backendProducts && backendProducts.length > 0
      ? backendProducts
      : MOCK_PRODUCTS;

  if (!isLoggedIn) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>
        <h2 className="font-display text-3xl font-bold text-foreground mb-3">
          Admin Panel
        </h2>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
          Sign in with your admin credentials to manage the GlowShop product
          catalog.
        </p>
        <Button
          onClick={login}
          disabled={isLoggingIn}
          data-ocid="admin.signin_button"
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        >
          <LogIn className="w-4 h-4" />
          {isLoggingIn ? "Signing in…" : "Sign In to Continue"}
        </Button>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-10">
        <Skeleton className="h-10 w-56 shimmer mb-4" />
        <Skeleton className="h-72 w-full shimmer" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
          Admin Access Required
        </h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Your account does not have admin privileges. Please contact the store
          owner to request access.
        </p>
      </div>
    );
  }

  const openAdd = () => {
    setForm(emptyForm);
    setAddOpen(true);
  };

  const openEdit = (product: Product) => {
    setForm(productToForm(product));
    setEditProduct(product);
  };

  const handleFormChange = (field: keyof ProductFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdd = async () => {
    if (!form.name || !form.price || !form.stock || !form.category) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await addProduct.mutateAsync(formToProduct(form));
      toast.success("Product added successfully!");
      setAddOpen(false);
      setForm(emptyForm);
    } catch {
      toast.error("Failed to add product");
    }
  };

  const handleUpdate = async () => {
    if (!editProduct) return;
    if (!form.name || !form.price || !form.stock || !form.category) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await updateProduct.mutateAsync(formToProduct(form));
      toast.success("Product updated successfully!");
      setEditProduct(null);
    } catch {
      toast.error("Failed to update product");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteProduct.mutateAsync(deleteId);
      toast.success("Product deleted");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const ProductForm = ({
    onSubmit,
    submitting,
    submitLabel,
  }: {
    onSubmit: () => void;
    submitting: boolean;
    submitLabel: string;
  }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="form-name" className="text-sm font-medium">
            Product Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="form-name"
            data-ocid="admin.product.input"
            value={form.name}
            onChange={(e) => handleFormChange("name", e.target.value)}
            placeholder="e.g. Rose Petal Serum"
            className="h-9"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="form-category" className="text-sm font-medium">
            Category <span className="text-destructive">*</span>
          </Label>
          <Select
            value={form.category}
            onValueChange={(v) => handleFormChange("category", v)}
          >
            <SelectTrigger
              id="form-category"
              data-ocid="admin.product.select"
              className="h-9"
            >
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="form-price" className="text-sm font-medium">
            Price (₹) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="form-price"
            type="number"
            min="0"
            step="1"
            value={form.price}
            onChange={(e) => handleFormChange("price", e.target.value)}
            placeholder="e.g. 1299"
            className="h-9"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="form-stock" className="text-sm font-medium">
            Stock Quantity <span className="text-destructive">*</span>
          </Label>
          <Input
            id="form-stock"
            type="number"
            min="0"
            step="1"
            value={form.stock}
            onChange={(e) => handleFormChange("stock", e.target.value)}
            placeholder="e.g. 50"
            className="h-9"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="form-desc" className="text-sm font-medium">
          Description
        </Label>
        <Textarea
          id="form-desc"
          data-ocid="admin.product.textarea"
          value={form.description}
          onChange={(e) => handleFormChange("description", e.target.value)}
          placeholder="Describe the product — ingredients, benefits, how to use..."
          rows={3}
          className="resize-none"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="form-image" className="text-sm font-medium">
          Product Image URL
        </Label>
        <Input
          id="form-image"
          value={form.imageUrl}
          onChange={(e) => handleFormChange("imageUrl", e.target.value)}
          placeholder="https://example.com/product-image.jpg"
          className="h-9"
        />
        <p className="text-xs text-muted-foreground">
          Enter a full URL to the product photo. Leave blank to use the category
          placeholder.
        </p>
      </div>
      <DialogFooter className="pt-2">
        <Button
          onClick={onSubmit}
          disabled={submitting}
          data-ocid="admin.save_button"
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving…
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </DialogFooter>
    </div>
  );

  return (
    <div className="container max-w-7xl mx-auto px-4 py-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground">
              Admin Panel
            </h2>
          </div>
          <p className="text-muted-foreground text-sm ml-11">
            Manage your GlowShop product catalog
          </p>
        </div>
        <div className="flex items-center gap-3 ml-11 sm:ml-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/60 rounded-lg px-3 py-1.5">
            <Package className="w-4 h-4" />
            <span>{products.length} products</span>
          </div>
          <Button
            onClick={openAdd}
            data-ocid="admin.add_product_button"
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Products Table */}
      {productsLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full shimmer" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div
          data-ocid="admin.products.empty_state"
          className="text-center py-20 border border-border rounded-2xl bg-card"
        >
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-display text-xl font-semibold text-foreground">
            No products yet
          </p>
          <p className="text-muted-foreground text-sm mt-1 mb-4">
            Add your first product to get started
          </p>
          <Button
            onClick={openAdd}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          >
            <Plus className="w-4 h-4" />
            Add First Product
          </Button>
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden bg-card">
          <Table data-ocid="admin.products.table">
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="font-semibold text-foreground">
                  Product
                </TableHead>
                <TableHead className="font-semibold text-foreground hidden md:table-cell">
                  Category
                </TableHead>
                <TableHead className="font-semibold text-foreground text-right">
                  Price
                </TableHead>
                <TableHead className="font-semibold text-foreground text-right hidden sm:table-cell">
                  Stock
                </TableHead>
                <TableHead className="font-semibold text-foreground text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, idx) => (
                <TableRow
                  key={product.id}
                  data-ocid={`admin.product.row.${idx + 1}`}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {product.imageUrl ? (
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                          <Package className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1 max-w-xs hidden sm:block">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <CategoryBadge category={product.category} />
                  </TableCell>
                  <TableCell className="text-right font-semibold text-foreground">
                    {formatINR(product.price)}
                  </TableCell>
                  <TableCell className="text-right hidden sm:table-cell">
                    {Number(product.stock) === 0 ? (
                      <Badge variant="destructive" className="text-xs">
                        Out of Stock
                      </Badge>
                    ) : (
                      <span className="text-sm text-foreground font-medium">
                        {Number(product.stock)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(product)}
                        data-ocid={`admin.edit_button.${idx + 1}`}
                        className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                        title="Edit product"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(product.id)}
                        data-ocid={`admin.delete_button.${idx + 1}`}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Product Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-2xl" data-ocid="admin.add.dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-xl flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Add New Product
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Fill in the product details. Fields marked with * are required.
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            onSubmit={handleAdd}
            submitting={addProduct.isPending}
            submitLabel="Add Product"
          />
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog
        open={!!editProduct}
        onOpenChange={(o) => !o && setEditProduct(null)}
      >
        <DialogContent className="max-w-2xl" data-ocid="admin.edit.dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-xl flex items-center gap-2">
              <Pencil className="w-5 h-5 text-primary" />
              Edit Product
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Update the product details below.
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            onSubmit={handleUpdate}
            submitting={updateProduct.isPending}
            submitLabel="Save Changes"
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-xl">
              Delete Product?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The product will be permanently
              removed from your catalog and won't appear in the shop.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="admin.delete.cancel_button"
              onClick={() => setDeleteId(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="admin.delete.confirm_button"
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {deleteProduct.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Delete Product"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
