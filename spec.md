# GlowShop

## Current State
- Add to Cart and Buy Now buttons require login; show error toast if not logged in
- Shop name "Glow Shop" in header is plain text with no visual glow effect
- Admin Panel link in header is only visible when user is logged in AND is admin
- Cart sheet shows "Sign in to view your cart" when not logged in

## Requested Changes (Diff)

### Add
- Glow/shimmer effect on the "Glow Shop" logo text in the header

### Modify
- Remove login requirement from Add to Cart button — guests can add to cart freely
- Remove login requirement from Buy Now button — guests can proceed to checkout freely
- Make Admin Panel link always visible in header (not gated by login), so admin can click it and log in from there
- Cart sheet: allow viewing/managing guest cart items without requiring sign-in

### Remove
- Toast errors that block cart actions for non-logged-in users

## Implementation Plan
1. In `ProductCard.tsx`: Remove `isLoggedIn` guard from `handleAddToCart` and `handleBuyNow`. Allow all users to add to cart and open checkout regardless of login state.
2. In `Header.tsx`: Remove `isAdmin` condition from the Admin Panel button — always show it in the header. Add a CSS glow/shimmer animation to the "Glow Shop" text.
3. In `CartSheet.tsx`: Remove the "sign in to view cart" wall — show cart contents to all users. Keep the sign-in option as optional.
