// Product data using JavaScript objects
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 1499,
        emoji: "🎧",
        description: "High-quality sound with wireless comfort."
    },
    {
        id: 2,
        name: "Smart Watch",
        category: "Electronics",
        price: 2499,
        emoji: "⌚",
        description: "Track your fitness and daily activities."
    },
    {
        id: 3,
        name: "Running Shoes",
        category: "Fashion",
        price: 1999,
        emoji: "👟",
        description: "Comfortable shoes for everyday use."
    },
    {
        id: 4,
        name: "Backpack",
        category: "Accessories",
        price: 899,
        emoji: "🎒",
        description: "A stylish backpack for daily essentials."
    },
    {
        id: 5,
        name: "Sunglasses",
        category: "Accessories",
        price: 599,
        emoji: "🕶️",
        description: "Modern sunglasses for everyday style."
    },
    {
        id: 6,
        name: "T-Shirt",
        category: "Fashion",
        price: 699,
        emoji: "👕",
        description: "A comfortable and casual cotton T-shirt."
    }
];

// Get HTML elements
const productList = document.getElementById("product-list");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const totalItems = document.getElementById("total-items");
const totalPrice = document.getElementById("total-price");

const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const noProducts = document.getElementById("no-products");

const checkoutButton = document.getElementById("checkout-button");
const checkoutModal = document.getElementById("checkout-modal");
const closeModal = document.getElementById("close-modal");
const checkoutItems = document.getElementById("checkout-items");
const checkoutTotal = document.getElementById("checkout-total");
const placeOrder = document.getElementById("place-order");
const orderMessage = document.getElementById("order-message");

// Shopping cart
let cart = [];

// Format price in Indian Rupees
function formatPrice(price) {
    return "₹" + price.toLocaleString("en-IN");
}

// Display products dynamically
function displayProducts(list) {
    productList.innerHTML = "";

    noProducts.classList.toggle("hidden", list.length !== 0);

    list.forEach(function(product) {
        const card = document.createElement("article");
        card.className = "product-card";

        const image = document.createElement("div");
        image.className = "product-image";
        image.textContent = product.emoji;

        const category = document.createElement("p");
        category.className = "product-category";
        category.textContent = product.category;

        const name = document.createElement("h3");
        name.textContent = product.name;

        const description = document.createElement("p");
        description.className = "product-description";
        description.textContent = product.description;

        const bottom = document.createElement("div");
        bottom.className = "product-bottom";

        const price = document.createElement("span");
        price.className = "product-price";
        price.textContent = formatPrice(product.price);

        const button = document.createElement("button");
        button.className = "add-button";
        button.textContent = "Add to Cart";
        button.type = "button";

        button.addEventListener("click", function() {
            addToCart(product.id);
        });

        bottom.appendChild(price);
        bottom.appendChild(button);

        card.appendChild(image);
        card.appendChild(category);
        card.appendChild(name);
        card.appendChild(description);
        card.appendChild(bottom);

        productList.appendChild(card);
    });
}

// Add product to cart
function addToCart(productId) {
    const existingItem = cart.find(function(item) {
        return item.id === productId;
    });

    if (existingItem) {
        existingItem.quantity++;
    } else {
        const product = products.find(function(item) {
            return item.id === productId;
        });

        if (!product) return;

        cart.push({
            ...product,
            quantity: 1
        });
    }

    displayCart();
}

// Change product quantity
function changeQuantity(productId, amount) {
    const item = cart.find(function(product) {
        return product.id === productId;
    });

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        displayCart();
    }
}

// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(function(item) {
        return item.id !== productId;
    });

    displayCart();
}

// Calculate total number of items
function getCartCount() {
    return cart.reduce(function(total, item) {
        return total + item.quantity;
    }, 0);
}

// Calculate total price
function getCartTotal() {
    return cart.reduce(function(total, item) {
        return total + item.price * item.quantity;
    }, 0);
}

// Display shopping cart
function displayCart() {
    cartItems.innerHTML = "";

    cartCount.textContent = getCartCount();
    totalItems.textContent = getCartCount();
    totalPrice.textContent = formatPrice(getCartTotal());

    checkoutButton.disabled = cart.length === 0;

    if (cart.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-cart";
        empty.textContent = "Your cart is empty.";

        cartItems.appendChild(empty);
        return;
    }

    cart.forEach(function(item) {
        const row = document.createElement("div");
        row.className = "cart-item";

        const emoji = document.createElement("span");
        emoji.className = "cart-emoji";
        emoji.textContent = item.emoji;

        const info = document.createElement("div");
        info.className = "cart-info";

        const name = document.createElement("h3");
        name.textContent = item.name;

        const price = document.createElement("p");
        price.textContent = formatPrice(item.price) + " each";

        info.appendChild(name);
        info.appendChild(price);

        const quantity = document.createElement("div");
        quantity.className = "quantity-controls";

        const decrease = document.createElement("button");
        decrease.textContent = "−";
        decrease.type = "button";
        decrease.setAttribute("aria-label", "Decrease quantity");

        const count = document.createElement("span");
        count.textContent = item.quantity;

        const increase = document.createElement("button");
        increase.textContent = "+";
        increase.type = "button";
        increase.setAttribute("aria-label", "Increase quantity");

        decrease.addEventListener("click", function() {
            changeQuantity(item.id, -1);
        });

        increase.addEventListener("click", function() {
            changeQuantity(item.id, 1);
        });

        quantity.appendChild(decrease);
        quantity.appendChild(count);
        quantity.appendChild(increase);

        const remove = document.createElement("button");
        remove.className = "remove-button";
        remove.textContent = "Remove";
        remove.type = "button";

        remove.addEventListener("click", function() {
            removeFromCart(item.id);
        });

        row.appendChild(emoji);
        row.appendChild(info);
        row.appendChild(quantity);
        row.appendChild(remove);

        cartItems.appendChild(row);
    });
}

// Search and category filtering
function filterProducts() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filtered = products.filter(function(product) {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm);

        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    displayProducts(filtered);
}

searchInput.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);

// Open checkout modal
function openCheckout() {
    if (cart.length === 0) return;

    checkoutItems.innerHTML = "";
    orderMessage.textContent = "";

    cart.forEach(function(item) {
        const row = document.createElement("div");
        row.className = "checkout-row";

        const name = document.createElement("span");
        name.textContent =
            item.name + " × " + item.quantity;

        const price = document.createElement("strong");
        price.textContent =
            formatPrice(item.price * item.quantity);

        row.appendChild(name);
        row.appendChild(price);

        checkoutItems.appendChild(row);
    });

    checkoutTotal.textContent = formatPrice(getCartTotal());

    checkoutModal.classList.remove("hidden");
    closeModal.focus();
}

// Close checkout modal
function closeCheckout() {
    checkoutModal.classList.add("hidden");
}

// Checkout button
checkoutButton.addEventListener("click", openCheckout);

// Close button
closeModal.addEventListener("click", closeCheckout);

// Close when clicking outside modal
checkoutModal.addEventListener("click", function(event) {
    if (event.target === checkoutModal) {
        closeCheckout();
    }
});

// Close with Escape key
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape" &&
        !checkoutModal.classList.contains("hidden")) {
        closeCheckout();
    }
});

// Demo order confirmation
placeOrder.addEventListener("click", function() {
    if (cart.length === 0) return;

    orderMessage.textContent =
        "Demo order placed successfully!";

    cart = [];
    displayCart();
});

// Cart button scrolls to cart section
document.getElementById("cart-button")
    .addEventListener("click", function() {
        document.getElementById("cart-section")
            .scrollIntoView({ behavior: "smooth" });
    });

// Initial display
displayProducts(products);
displayCart();