/* =========================================
   MOBILE MENU TOGGLE
========================================= */

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("show");
  });
}

/* =========================================
   REVIEW DROPDOWN IN MOBILE MENU
========================================= */

const reviewDropdown = document.querySelector(".review-dropdown");
const reviewBtn = document.querySelector(".review-drop-btn");

if (reviewDropdown && reviewBtn) {
  reviewBtn.addEventListener("click", (e) => {
    e.preventDefault();
    reviewDropdown.classList.toggle("active");
  });
}

/* =========================================
   REVIEW DROPDOWN ON MAIN REVIEW BUTTON
========================================= */

const reviewMainBtn = document.getElementById("reviewMainBtn");
const reviewCardLinks = document.getElementById("reviewCardLinks");

if (reviewMainBtn && reviewCardLinks) {
  reviewMainBtn.addEventListener("click", () => {
    reviewCardLinks.classList.toggle("show");
  });
}

/* =========================================
   SHARED CART
========================================= */

const cartCount = document.getElementById("cartCount");
const itemCount = document.getElementById("itemCount");
const cartTotal = document.getElementById("cartTotal");
const stickyCart = document.getElementById("stickyCart");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getCartSubtotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function updateCart() {
  const count = getCartCount();
  const subtotal = getCartSubtotal();

  if (cartCount) {
    cartCount.textContent = count;
  }

  if (itemCount) {
    itemCount.textContent = count === 1 ? "1 item" : `${count} items`;
  }

  if (cartTotal) {
    cartTotal.textContent = `$${subtotal.toFixed(2)}`;
  }

  if (stickyCart) {
    stickyCart.classList.toggle("show", count > 0);
  }

  saveCart();
}

updateCart();

/* =========================================
   CATEGORY FILTER
========================================= */

const tabs = document.querySelectorAll(".tab");
const cards = document.querySelectorAll(".menu-card");

if (tabs.length > 0 && cards.length > 0) {
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((btn) => btn.classList.remove("active"));
      tab.classList.add("active");

      const category = tab.dataset.category;

      cards.forEach((card) => {
        card.style.display =
          category === "all" || card.dataset.category === category
            ? "grid"
            : "none";
      });
    });
  });
}

/* =========================================
   ADD TO CART
========================================= */

const addButtons = document.querySelectorAll(".add-btn");

if (addButtons.length > 0) {
  addButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const name = button.dataset.name;
      const price = Number(button.dataset.price);

      addItemToCart(name, price);
      flashButton(button);
    });
  });
}

function addItemToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1
    });
  }

  updateCart();
}

function flashButton(button) {
  button.textContent = "Added";

  setTimeout(() => {
    button.textContent = "Add";
  }, 800);
}

/* =========================================
   CART PAGE DISPLAY
========================================= */

const cartList = document.getElementById("cartList");
const subtotalEl = document.getElementById("subtotal");

function loadCartPage() {
  if (!cartList) return;

  cartList.innerHTML = "";

  if (cart.length === 0) {
    cartList.innerHTML = `
      <div class="empty-cart">
        <h2>Your Cart Is Empty</h2>
        <p>Add some tacos before checking out.</p>
        <a href="order.html">Order Now</a>
      </div>
    `;

    if (subtotalEl) {
      subtotalEl.textContent = "$0.00";
    }

    return;
  }

  let subtotal = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    cartList.innerHTML += `
      <div class="cart-item">
        <div class="cart-item-info">
          <h2>${item.name}</h2>
          <p>Qty: ${item.quantity}</p>
        </div>

        <div class="cart-item-price">
          <strong>$${itemTotal.toFixed(2)}</strong>

          <button class="remove-btn" onclick="removeCartItem(${index})">
            Remove
          </button>
        </div>
      </div>
    `;
  });

  if (subtotalEl) {
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  }
}

function removeCartItem(index) {
  cart.splice(index, 1);
  updateCart();
  loadCartPage();
}

loadCartPage();

/* =========================================
   CHECKOUT PAGE DISPLAY
========================================= */

const checkoutItems = document.getElementById("checkoutItems");
const summaryItemsTotal = document.getElementById("summaryItemsTotal");
const summaryTax = document.getElementById("summaryTax");
const summaryGrandTotal = document.getElementById("summaryGrandTotal");
const squarePayButton = document.getElementById("squarePayBtn");

function loadCheckoutPage() {
  if (!checkoutItems) return;

  const savedCart = JSON.parse(localStorage.getItem("cart")) || [];

  checkoutItems.innerHTML = "";

  if (savedCart.length === 0) {
    checkoutItems.innerHTML = `
      <div class="empty-cart">
        <h2>No Items Yet</h2>
        <p>Please go back and add food to your cart first.</p>
        <a href="order.html">Order Now</a>
      </div>
    `;

    if (summaryItemsTotal) summaryItemsTotal.textContent = "$0.00";
    if (summaryTax) summaryTax.textContent = "$0.00";
    if (summaryGrandTotal) summaryGrandTotal.textContent = "$0.00";
    if (squarePayButton) squarePayButton.textContent = "PAY NOW";

    return;
  }

  let itemsTotal = 0;

  savedCart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    itemsTotal += itemTotal;

    checkoutItems.innerHTML += `
      <div class="checkout-item">
        <div>
          <h3>${item.name}</h3>
          <p>Qty: ${item.quantity}</p>
        </div>

        <strong>$${itemTotal.toFixed(2)}</strong>
      </div>
    `;
  });

  const taxRate = 0.0875;
  const tax = itemsTotal * taxRate;
  const grandTotal = itemsTotal + tax;

  if (summaryItemsTotal) summaryItemsTotal.textContent = `$${itemsTotal.toFixed(2)}`;
  if (summaryTax) summaryTax.textContent = `$${tax.toFixed(2)}`;
  if (summaryGrandTotal) summaryGrandTotal.textContent = `$${grandTotal.toFixed(2)}`;

  if (squarePayButton) {
    squarePayButton.textContent = `PAY $${grandTotal.toFixed(2)} NOW`;
  }
}

loadCheckoutPage();

/* =========================================
   CREATE SQUARE CHECKOUT
========================================= */

if (squarePayButton) {
  squarePayButton.addEventListener("click", async () => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];

    if (savedCart.length === 0) {
      alert("Your cart is empty. Please add items first.");
      return;
    }

    const customerName = document.getElementById("customerName")?.value || "";
    const customerPhone = document.getElementById("customerPhone")?.value || "";
    const pickupTime = document.getElementById("pickupTime")?.value || "";
    const notes = document.getElementById("specialNotes")?.value || "";

    squarePayButton.textContent = "LOADING...";
    squarePayButton.disabled = true;

    try {
      const response = await fetch("/api/create-square-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cart: savedCart,
          customerName,
          customerPhone,
          pickupTime,
          notes
        })
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert("Could not create payment link. Please try again.");
        squarePayButton.textContent = "PAY NOW";
        squarePayButton.disabled = false;
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
      squarePayButton.textContent = "PAY NOW";
      squarePayButton.disabled = false;
    }
  });
}