# GlowShop

## Current State
The app has a working e-commerce backend (Motoko) with:
- Product CRUD (admin only), categories, cart (per-user), user profiles
- Authorization component (role-based: admin, user)
- Sample products across Skin Care, Hair Care, Makeup, Body Care, Fragrance categories
- Prices stored as Nat (paise/rupees integer)

Frontend has basic product listing, cart drawer, checkout flow, product detail modal, and admin panel.

## Requested Changes (Diff)

### Add
- Homepage hero section featuring luxury products prominently (lipstick, Vitamin C face wash, premium items)
- Full category navigation: Skincare, Haircare, Personal Care, Beauty, Luxury Products, Makeup, Fragrance, Body Care
- "Luxury Products" as a dedicated category in seed data and filter
- "Personal Care" category with relevant products
- "Beauty" category with relevant products
- Real product images (generated) used directly in the frontend for each sample product
- Prominent Buy Now + Add to Cart buttons on every product card
- Product description visible below each product card
- Header: Settings dropdown (Sign In / Login options), Cart icon, Admin Panel link
- Admin Panel: full management page — add product (name, description, price, category, image URL), edit, delete
- Prices displayed with ₹ symbol throughout (shop, cart, checkout, admin)
- Search bar in the header
- Featured/sale products section on homepage
- Responsive, polished UI similar to real e-commerce sites

### Modify
- Seed data: update categories to include Skincare, Haircare, Personal Care, Beauty, Luxury Products in addition to existing ones
- Update sample products to include luxury items (lipstick, Vitamin C face wash, premium serums, perfumes)
- Category filter bar to show all new categories
- Header redesign: include logo, search, settings, cart, admin link

### Remove
- Broken placeholder image URLs (replace with generated images or placeholder service)

## Implementation Plan
1. Generate hero and product images for luxury/featured items
2. Update frontend App.tsx and components to implement:
   - Hero banner showing luxury products
   - Category filter bar with all categories
   - Product grid with description, Buy Now, Add to Cart
   - Header with logo, search, settings dropdown (Sign In/Login), cart, Admin link
   - Admin panel page (add/edit/delete products)
   - ₹ currency throughout
   - Product detail modal
   - Cart drawer with checkout
3. Use backend APIs as-is (getAllProducts, addProduct, updateProduct, deleteProduct, addToCart, etc.)
4. Wire authorization for admin panel and user cart
