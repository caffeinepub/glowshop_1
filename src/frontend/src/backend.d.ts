import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CartItem {
    productId: string;
    quantity: bigint;
}
export interface UserProfile {
    name: string;
}
export interface Product {
    id: string;
    name: string;
    description: string;
    stock: bigint;
    imageUrl: string;
    category: string;
    price: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(product: Product): Promise<void>;
    addToCart(productId: string, quantity: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearCart(): Promise<void>;
    deleteProduct(id: string): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<CartItem>>;
    getProduct(id: string): Promise<Product | null>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initialize(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    removeFromCart(productId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCartQuantity(productId: string, quantity: bigint): Promise<void>;
    updateProduct(product: Product): Promise<void>;
}
