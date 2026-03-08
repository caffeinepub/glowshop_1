import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import AdminPanel from "./components/AdminPanel";
import CartSheet from "./components/CartSheet";
import Header from "./components/Header";
import ShopPage from "./components/ShopPage";

export type Page = "shop" | "admin";

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>("shop");
  const [searchQuery, setSearchQuery] = useState("");

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    if (page === "shop") setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-background font-body flex flex-col">
      <Header
        onCartClick={() => setCartOpen(true)}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        searchQuery={searchQuery}
        onSearchChange={(value) => {
          setSearchQuery(value);
          if (currentPage !== "shop") setCurrentPage("shop");
        }}
      />

      <main className="flex-1">
        {currentPage === "shop" && <ShopPage searchQuery={searchQuery} />}
        {currentPage === "admin" && <AdminPanel />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-10 mt-12">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            {/* Brand */}
            <div className="text-center md:text-left">
              <p className="font-display text-2xl font-bold text-primary mb-1">
                Glow Shop
              </p>
              <p className="text-muted-foreground text-sm max-w-xs">
                Luxury beauty products from the world's finest brands, delivered
                to your door.
              </p>
            </div>

            {/* Categories */}
            <div className="text-center md:text-left">
              <p className="text-xs font-semibold text-foreground uppercase tracking-widest mb-3">
                Categories
              </p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-sm text-muted-foreground">
                {[
                  "Skincare",
                  "Haircare",
                  "Makeup",
                  "Personal Care",
                  "Fragrance",
                  "Beauty",
                  "Luxury Products",
                ].map((cat) => (
                  <span
                    key={cat}
                    className="hover:text-primary cursor-pointer transition-colors"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="section-divider my-8" />

          <p className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Glow Shop. Built with{" "}
            <span className="text-primary">♥</span> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
      <Toaster richColors position="top-right" />
    </div>
  );
}
