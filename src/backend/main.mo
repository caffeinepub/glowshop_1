import Map "mo:core/Map";
import Set "mo:core/Set";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  type Product = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    category : Text;
    imageUrl : Text;
    stock : Nat;
  };

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Text.compare(p1.id, p2.id);
    };
  };

  type CartItem = {
    productId : Text;
    quantity : Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  let sampleProducts : [Product] = [
    // Skin Care
    {
      id = "sc001";
      name = "Hydrating Serum";
      description = "Nourishes and hydrates skin";
      price = 2500;
      category = "Skin Care";
      imageUrl = "https://example.com/serum.jpg";
      stock = 50;
    },
    {
      id = "sc002";
      name = "Moisturizing Cream";
      description = "Deep moisture for dry skin";
      price = 3200;
      category = "Skin Care";
      imageUrl = "https://example.com/cream.jpg";
      stock = 40;
    },
    // Hair Care
    {
      id = "hc001";
      name = "Volumizing Shampoo";
      description = "Gives hair extra volume";
      price = 1800;
      category = "Hair Care";
      imageUrl = "https://example.com/shampoo.jpg";
      stock = 60;
    },
    {
      id = "hc002";
      name = "Repairing Conditioner";
      description = "Repairs damaged hair";
      price = 2000;
      category = "Hair Care";
      imageUrl = "https://example.com/conditioner.jpg";
      stock = 55;
    },
    // Makeup
    {
      id = "mu001";
      name = "Liquid Foundation";
      description = "Smooth, flawless finish";
      price = 2800;
      category = "Makeup";
      imageUrl = "https://example.com/foundation.jpg";
      stock = 30;
    },
    {
      id = "mu002";
      name = "Mascara";
      description = "Lengthens and volumizes lashes";
      price = 1500;
      category = "Makeup";
      imageUrl = "https://example.com/mascara.jpg";
      stock = 40;
    },
    // Body Care
    {
      id = "bc001";
      name = "Body Lotion";
      description = "Hydrates and smooths skin";
      price = 2100;
      category = "Body Care";
      imageUrl = "https://example.com/lotion.jpg";
      stock = 35;
    },
    {
      id = "bc002";
      name = "Exfoliating Scrub";
      description = "Removes dead skin cells";
      price = 1950;
      category = "Body Care";
      imageUrl = "https://example.com/scrub.jpg";
      stock = 25;
    },
    // Fragrance
    {
      id = "fr001";
      name = "Eau De Parfum";
      description = "Long-lasting floral scent";
      price = 4500;
      category = "Fragrance";
      imageUrl = "https://example.com/parfum.jpg";
      stock = 20;
    },
    {
      id = "fr002";
      name = "Cologne";
      description = "Fresh and light scent";
      price = 3000;
      category = "Fragrance";
      imageUrl = "https://example.com/cologne.jpg";
      stock = 30;
    },
  ];

  // Persistent product store
  let products = Map.empty<Text, Product>();
  let categories = Map.empty<Text, Set.Set<Text>>();
  let initialized = Set.empty<Text>();

  // User profiles
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Shopping cart (per user)
  let carts = Map.empty<Principal, List.List<CartItem>>();

  // Authorization state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Initialization
  public shared ({ caller }) func initialize() : async () {
    if (initialized.contains("system")) {
      Runtime.trap("System already initialized");
    };
    await initializeProductCatalog();
    initialized.add("system");
  };

  // Product catalog functions
  func initializeProductCatalog() : async () {
    if (not initialized.contains("productCatalog")) {
      for (product in sampleProducts.values()) {
        addProductInternal(product);
      };
      initialized.add("productCatalog");
    };
  };

  func addProductInternal(product : Product) {
    products.add(product.id, product);
    switch (categories.get(product.category)) {
      case (null) {
        // Category doesn't exist, create it
        let categoryProducts = Set.empty<Text>();
        categoryProducts.add(product.id);
        categories.add(product.category, categoryProducts);
      };
      case (?existingCategory) {
        // Category exists, add product to it
        existingCategory.add(product.id);
      };
    };
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query ({ caller }) func getProductsByCategory(category : Text) : async [Product] {
    switch (categories.get(category)) {
      case (null) { [] };
      case (?productIds) {
        let filteredProducts = productIds.toArray().map(func(id) { switch (products.get(id)) { case (null) { Runtime.trap("Product not found: " # id) }; case (?p) { p } } });
        filteredProducts;
      };
    };
  };

  public query ({ caller }) func getProduct(id : Text) : async ?Product {
    products.get(id);
  };

  public shared ({ caller }) func addProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    addProductInternal(product);
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };

    if (not products.containsKey(product.id)) { Runtime.trap("Product does not exist") };
    products.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };

    switch (products.get(id)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) {
        // Remove product from category
        switch (categories.get(product.category)) {
          case (null) {};
          case (?categoryProducts) {
            categoryProducts.remove(id);
            if (categoryProducts.size() == 0) {
              categories.remove(product.category);
            };
          };
        };
        products.remove(id);
      };
    };
  };

  // Shopping cart functions
  public shared ({ caller }) func addToCart(productId : Text, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add to cart");
    };

    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) {
        if (product.stock < quantity) { Runtime.trap("Not enough stock available") };

        let currentCart = switch (carts.get(caller)) {
          case (null) { List.empty<CartItem>() };
          case (?list) { list };
        };

        let newCart = currentCart.filter(func(item) { item.productId != productId });
        newCart.add({ productId; quantity });
        carts.add(caller, newCart);
      };
    };
  };

  public shared ({ caller }) func removeFromCart(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can modify cart");
    };

    let currentCart = switch (carts.get(caller)) {
      case (null) { List.empty<CartItem>() };
      case (?list) { list };
    };

    let newCart = currentCart.filter(func(item) { item.productId != productId });
    carts.add(caller, newCart);
  };

  public shared ({ caller }) func updateCartQuantity(productId : Text, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update cart");
    };

    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) {
        if (product.stock < quantity) { Runtime.trap("Not enough stock available") };

        let currentCart = switch (carts.get(caller)) {
          case (null) { List.empty<CartItem>() };
          case (?list) { list };
        };

        let newCart = currentCart.filter(func(item) { item.productId != productId });
        newCart.add({ productId; quantity });
        carts.add(caller, newCart);
      };
    };
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear cart");
    };

    carts.add(caller, List.empty<CartItem>());
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view cart");
    };

    let cart = switch (carts.get(caller)) {
      case (null) { List.empty<CartItem>() };
      case (?list) { list };
    };
    cart.toArray();
  };

  // User profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };
};
