
"use strict";

/* =========================================
   1. CONFIGURATION
========================================= */

// Numéro WhatsApp qui reçoit les commandes.
// Format : 243XXXXXXXXX, sans + ni espaces.
const ORDER_WHATSAPP_NUMBER = "";


/* =========================================
   2. PRODUCTS
========================================= */

const products = [
    {
        id: 1,
        name: "Burger fondant",
        category: "burgers",
        description: "Nappé de sauce fromage",
        price: 14,
        image: "assets/images/burger-fondant.png"
    },
    {
        id: 2,
        name: "Poulet grillé",
        category: "poulet",
        description: "Fromage fondu, pâtes et maïs",
        price: 14,
        image: "assets/images/poulet-grille.png"
    },
    {
        id: 3,
        name: "Burger gourmand",
        category: "burgers",
        description: "Le fromage qui coule",
        price: 14,
        image: "assets/images/burger-gourmand.png"
    },
    {
        id: 4,
        name: "Grillades mixtes",
        category: "grillades",
        description: "Brochettes grillées à point",
        price: 10,
        image: "assets/images/grillades-mixtes.png"
    },
    {
        id: 5,
        name: "Sandwich sauté",
        category: "poulet",
        description: "Viande, champignons, sauce",
        price: 14,
        image: "assets/images/sandwich-saute.png"
    },
    {
        id: 6,
        name: "Salade fraîcheur",
        category: "grillades",
        description: "Salade composée et légumes frais",
        price: 10,
        image: "assets/images/salade-fraicheur.png"
    },
    {
        id: 7,
        name: "Poulet croustillant",
        category: "poulet",
        description: "Poulet frit, pommes de terre et maïs",
        price: 14,
        image: "assets/images/poulet-croustillant.png"
    },
    
];


/* =========================================
   3. DOM ELEMENTS
========================================= */

const $ = selector => document.querySelector(selector);

const productsGrid = $("#productsGrid");
const menuFilters = $("#menuFilters");

const cartDrawer = $("#cartDrawer");
const cartOverlay = $("#cartOverlay");
const cartItems = $("#cartItems");

const checkoutModal = $("#checkoutModal");
const checkoutForm = $("#checkoutForm");

let cart = loadCart();


/* =========================================
   4. CART STORAGE
========================================= */

function loadCart() {
    try {
        const saved = JSON.parse(
            localStorage.getItem("110street-cart") || "[]"
        );

        if (!Array.isArray(saved)) return [];

        return saved.filter(item => {
            return products.some(product => product.id === item.id)
                && Number.isInteger(item.quantity)
                && item.quantity > 0
                && item.quantity <= 99;
        });

    } catch {
        return [];
    }
}


function saveCart() {
    localStorage.setItem(
        "110street-cart",
        JSON.stringify(cart)
    );
}


/* =========================================
   5. PRODUCT DISPLAY
========================================= */

function displayProducts(category = "all") {

    const filtered = category === "all"
        ? products
        : products.filter(product => product.category === category);

    productsGrid.innerHTML = "";

    if (!filtered.length) {
        productsGrid.innerHTML = `
            <p class="no-products">
                Aucun produit disponible.
            </p>
        `;
        return;
    }

    filtered.forEach(product => {

        const card = document.createElement("article");

        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image">
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >
            </div>

            <div class="product-body">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>${product.name}</h3>

                <p class="product-description">
                    ${product.description}
                </p>

                <span class="product-price">
                    ${formatPrice(product.price)}
                </span>

                <button
                    class="add-cart"
                    data-id="${product.id}"
                >
                    Ajouter
                </button>

            </div>
        `;

        productsGrid.appendChild(card);
    });
}


/* =========================================
   6. PRODUCT FILTERS
========================================= */

menuFilters.addEventListener("click", event => {

    const button = event.target.closest(".filter-btn");

    if (!button) return;

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    displayProducts(button.dataset.category);
});


/* =========================================
   7. ADD PRODUCT TO CART
========================================= */

productsGrid.addEventListener("click", event => {

    const button = event.target.closest(".add-cart");

    if (!button) return;

    addToCart(Number(button.dataset.id));
});


function addToCart(id) {

    const product = products.find(item => item.id === id);

    if (!product) return;

    const existing = cart.find(item => item.id === id);

    if (existing) {

        if (existing.quantity >= 99) return;

        existing.quantity++;

    } else {

        cart.push({
            id,
            quantity: 1
        });

    }

    saveCart();
    updateCart();
}


/* =========================================
   8. CART CALCULATIONS
========================================= */

function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}


function getCartCount() {

    return cart.reduce(
        (total, item) => total + item.quantity,
        0
    );
}


function getCartTotal() {

    return cart.reduce((total, item) => {

        const product = products.find(p => p.id === item.id);

        return total + (
            product ? product.price * item.quantity : 0
        );

    }, 0);
}


/* =========================================
   9. UPDATE CART
========================================= */

function updateCart() {

    const count = getCartCount();

    $("#cartCount").textContent = count;
    $("#cartCount").classList.toggle("visible", count > 0);

    $("#drawerCount").textContent = `(${count})`;

    $("#cartTotal").textContent = formatPrice(getCartTotal());

    cartItems.innerHTML = "";

    $("#cartFooter").style.display = cart.length ? "block" : "none";

    if (!cart.length) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <h3>Votre panier est vide.</h3>
                <p>Ajoutez un plat pour commencer.</p>
            </div>
        `;

        return;
    }

    cart.forEach(item => {

        const product = products.find(p => p.id === item.id);

        if (!product) return;

        const element = document.createElement("article");

        element.className = "cart-item";

        element.innerHTML = `
            <div class="cart-item-image">
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >
            </div>

            <div class="cart-item-info">

                <h3>${product.name}</h3>

                <p>
                    ${formatPrice(product.price * item.quantity)}
                </p>

                <div class="quantity-controls">

                    <button
                        data-action="decrease"
                        data-id="${product.id}"
                        aria-label="Diminuer"
                    >−</button>

                    <span>${item.quantity}</span>

                    <button
                        data-action="increase"
                        data-id="${product.id}"
                        aria-label="Augmenter"
                    >+</button>

                </div>

            </div>

            <button
                class="remove-item"
                data-action="remove"
                data-id="${product.id}"
                aria-label="Supprimer"
            >×</button>
        `;

        cartItems.appendChild(element);
    });
}


/* =========================================
   10. CART ACTIONS
========================================= */

cartItems.addEventListener("click", event => {

    const button = event.target.closest("[data-action]");

    if (!button) return;

    const id = Number(button.dataset.id);

    const action = button.dataset.action;

    const item = cart.find(product => product.id === id);

    if (!item) return;

    switch (action) {

        case "increase":

            if (item.quantity < 99) {
                item.quantity++;
            }

            break;

        case "decrease":

            item.quantity--;

            if (item.quantity <= 0) {
                cart = cart.filter(product => product.id !== id);
            }

            break;

        case "remove":

            cart = cart.filter(product => product.id !== id);

            break;
    }

    saveCart();
    updateCart();
});


$("#clearCart").addEventListener("click", () => {

    cart = [];

    saveCart();
    updateCart();

});


/* =========================================
   11. OPEN / CLOSE CART
========================================= */

function openCart() {

    cartDrawer.classList.add("active");
    cartOverlay.classList.add("active");

    document.body.classList.add("no-scroll");

}


function closeCart() {

    cartDrawer.classList.remove("active");
    cartOverlay.classList.remove("active");

    document.body.classList.remove("no-scroll");

}


$("#openCart").addEventListener("click", openCart);

$("#closeCart").addEventListener("click", closeCart);

cartOverlay.addEventListener("click", closeCart);

$("#headerOrder").addEventListener("click", openCart);


/* =========================================
   12. CHECKOUT MODAL
========================================= */

$("#checkoutBtn").addEventListener("click", () => {

    if (!cart.length) return;

    checkoutModal.classList.add("active");

});


$("#closeModal").addEventListener("click", () => {

    checkoutModal.classList.remove("active");

});


checkoutModal.addEventListener("click", event => {

    if (event.target === checkoutModal) {
        checkoutModal.classList.remove("active");
    }

});


/* =========================================
   13. WHATSAPP ORDER
========================================= */

checkoutForm.addEventListener("submit", event => {

    event.preventDefault();

    const error = $("#formError");

    error.textContent = "";

    if (!cart.length) {
        error.textContent = "Votre panier est vide.";
        return;
    }

    const name = $("#customerName").value.trim();
    const phone = $("#customerPhone").value.trim();
    const address = $("#customerAddress").value.trim();
    const note = $("#customerNote").value.trim();

    if (!name || !phone || !address) {
        error.textContent =
            "Renseignez votre nom, votre téléphone et votre adresse.";
        return;
    }

    if (!/^[0-9+\s()-]{7,20}$/.test(phone)) {
        error.textContent = "Veuillez renseigner un numéro valide.";
        return;
    }

    if (!/^\d{10,15}$/.test(ORDER_WHATSAPP_NUMBER)) {
        error.textContent =
            "Le numéro WhatsApp de réception doit être configuré.";
        return;
    }

    const orderDetails = cart.map(item => {

        const product = products.find(p => p.id === item.id);

        return `${item.quantity} × ${product.name} : ${
            formatPrice(product.price * item.quantity)
        }`;

    });

    const message = `
*110 STREET - NOUVELLE COMMANDE*

*CLIENT*
Nom : ${name}
Téléphone : ${phone}
Adresse : ${address}

*MA COMMANDE*
${orderDetails.join("\n")}

*TOTAL : ${formatPrice(getCartTotal())}*

*INSTRUCTIONS*
${note || "Aucune"}

Merci !
    `.trim();

    const url = new URL(`https://wa.me/${ORDER_WHATSAPP_NUMBER}`);

    url.searchParams.set("text", message);

    window.open(url.toString(), "_blank", "noopener,noreferrer");

});


/* =========================================
   14. MOBILE NAVIGATION
========================================= */

const menuToggle = $("#menuToggle");
const navigation = $("#navigation");

menuToggle.addEventListener("click", () => {

    const isOpen = navigation.classList.toggle("active");

    menuToggle.setAttribute("aria-expanded", String(isOpen));

});


navigation.addEventListener("click", event => {

    if (!event.target.closest("a")) return;

    navigation.classList.remove("active");

    menuToggle.setAttribute("aria-expanded", "false");

});


/* =========================================
   15. KEYBOARD ACCESSIBILITY
========================================= */

document.addEventListener("keydown", event => {

    if (event.key !== "Escape") return;

    closeCart();

    checkoutModal.classList.remove("active");

    navigation.classList.remove("active");

    menuToggle.setAttribute("aria-expanded", "false");

});


/* =========================================
   16. ACTIVE NAVIGATION
========================================= */

const sections = document.querySelectorAll("main section[id]");

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        document.querySelectorAll(".nav-link").forEach(link => {

            link.classList.toggle(
                "active",
                link.getAttribute("href") === `#${entry.target.id}`
            );

        });

    });

}, {
    rootMargin: "-30% 0px -60% 0px"
});


sections.forEach(section => observer.observe(section));


/* =========================================
   17. INITIALIZATION
========================================= */

displayProducts();

updateCart();
