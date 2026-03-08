import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  LogIn,
  LogOut,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  User,
  X,
} from "lucide-react";
import type { Page } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCart, useIsAdmin } from "../hooks/useQueries";

interface HeaderProps {
  onCartClick: () => void;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function Header({
  onCartClick,
  currentPage,
  onNavigate,
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  const { login, clear, identity, isLoggingIn } = useInternetIdentity();
  const { data: cartItems } = useGetCart();
  const { data: isAdmin } = useIsAdmin();

  const cartCount =
    cartItems?.reduce((sum, item) => sum + Number(item.quantity), 0) ?? 0;
  const isLoggedIn = !!identity;

  return (
    <header className="sticky top-0 z-50 bg-card/98 backdrop-blur-md border-b border-border shadow-xs">
      <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center gap-3">
        {/* Logo */}
        <button
          type="button"
          onClick={() => onNavigate("shop")}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0"
          aria-label="Go to shop homepage"
        >
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-semibold text-foreground tracking-tight hidden sm:block">
            Glow Shop
          </span>
        </button>

        {/* Search Bar — center */}
        <div className="flex-1 max-w-xl mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            data-ocid="header.search_input"
            className="pl-9 pr-9 bg-muted/60 border-border/60 focus:bg-card focus:border-primary/40 transition-colors h-9 text-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Admin Panel Link */}
          {isAdmin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("admin")}
              data-ocid="header.admin_link"
              className={`hidden md:flex items-center gap-1.5 text-xs font-medium transition-colors ${
                currentPage === "admin"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Panel
            </Button>
          )}

          {/* Cart */}
          <button
            type="button"
            onClick={onCartClick}
            data-ocid="header.cart_button"
            className="relative p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label={`Cart, ${cartCount} items`}
          >
            <ShoppingBag className="w-5 h-5 text-foreground" />
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 min-w-5 text-xs px-1 flex items-center justify-center bg-primary text-primary-foreground border-0 rounded-full">
                {cartCount > 99 ? "99+" : cartCount}
              </Badge>
            )}
          </button>

          {/* Settings Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                data-ocid="header.settings_dropdown"
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Settings and account"
              >
                <Settings className="w-5 h-5 text-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {isLoggedIn ? (
                <>
                  <div className="px-3 py-2 border-b border-border mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground">
                          Signed In
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {identity?.getPrincipal
                            ? `${identity.getPrincipal().toString().slice(0, 16)}…`
                            : "Account"}
                        </p>
                      </div>
                    </div>
                  </div>
                  {isAdmin && (
                    <DropdownMenuItem
                      onClick={() => onNavigate("admin")}
                      data-ocid="header.admin_link"
                      className="flex items-center gap-2 text-sm cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={clear}
                    data-ocid="header.logout_button"
                    className="flex items-center gap-2 text-sm text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <div className="px-3 py-2 text-xs text-muted-foreground border-b border-border mb-1">
                    Sign in for cart, orders &amp; more
                  </div>
                  <DropdownMenuItem
                    onClick={login}
                    disabled={isLoggingIn}
                    data-ocid="header.signin_button"
                    className="flex items-center gap-2 text-sm cursor-pointer font-medium"
                  >
                    <LogIn className="w-4 h-4 text-primary" />
                    {isLoggingIn ? "Signing in…" : "Sign In / Login"}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
