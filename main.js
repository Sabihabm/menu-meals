var swiper = new Swiper(".mySwiper", {
  loop: true,
  navigation: {
    nextEl: "#next",
    prevEl: "#prev",
  },
});

const cartIcon = document.querySelector(".cart-icon");
const cartTab = document.querySelector(".cart-tab");
const closeBtn = document.querySelector(".close-btn");
const cardList = document.querySelector(".card-list");
const cartList = document.querySelector(".cart-list");
const cartTotal = document.querySelector(".cart-total");
const cartValue = document.querySelector(".cart-value");
const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");
const bars = document.querySelector(".fa-bars");

cartIcon.addEventListener("click", () =>
  cartTab.classList.add("cart-tab-active"),
);
closeBtn.addEventListener("click", () =>
  cartTab.classList.remove("cart-tab-active"),
);


hamburger.addEventListener("click", (e) => {
  e.preventDefault();
  mobileMenu.classList.toggle("mobile-menu-active");
  bars.classList.toggle("fa-bars");
  bars.classList.toggle("fa-xmark");
});



let productList = [];
let cartProduct = [];

const updateTotals = () => {
  let totalPrice = 0;
  let totalQuantity = 0;

  document.querySelectorAll(".item").forEach((item) => {
    const quantity = parseInt(
      item.querySelector(".quantity-value").textContent,
    );
    const price = parseFloat(
      item.querySelector(".item-total").textContent.replace("$", ""),
    );

    totalPrice += price;
    totalQuantity += quantity;
  });

  cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
  cartValue.textContent = totalQuantity;
};

const showCards = () => {
  productList.forEach((product) => {
    const orderCard = document.createElement("div");
    orderCard.classList.add("order-card");

    orderCard.innerHTML = `
                <div class="card-image">
                    <img src="${product.image}">
                </div>
                <h4>${product.name}</h4>
                <h4 class="price">${product.price}</h4>
                <a herf="#" class="btn card-btn">Add to cart</a>
            `;

    cardList.appendChild(orderCard);

    const cardBtn = orderCard.querySelector(".card-btn");
    cardBtn.addEventListener("click", (e) => {
      e.preventDefault();
      addToCart(product);
    });
  });
};

const addToCart = (product) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // ❌ not logged in
  if (!user) {
    alert("Please login first!");

    // open login modal
    const authModal = document.querySelector(".auth-modal");
    authModal.classList.add("active");

    return;
  }

  // Check if item already exists in cart
  const existingItem = Array.from(cartList.querySelectorAll(".item")).find((item) => {
    return item.querySelector(".detail h4").textContent === product.name;
  });

  if (existingItem) {
    // Item already exists in cart
    alert("This item is already in your cart! Use the plus button to increase quantity.");
    return;
  }

  // Item doesn't exist, add it new
  cartProduct.push(product);

  let quantity = 1;
  let price = parseFloat(product.price.replace("$", ""));

  const cartItem = document.createElement("div");
  cartItem.classList.add("item");

  cartItem.innerHTML = `
        <div class="item-image">
            <img src="${product.image}">
        </div>
        <div class="detail">
            <h4>${product.name}</h4>
            <h4 class="item-total">${product.price}</h4>
        </div>
       <div class="flex">
            <a href="#" class="quantity-btn minus">
                <i class="fa-solid fa-minus"></i>
            </a>
            <h4 class="quantity-value">${quantity}</h4>
            <a href="#" class="quantity-btn plus">
                <i class="fa-solid fa-plus"></i>
            </a>
        </div>
    `;

  // Hide empty cart message when adding first item
  const emptyMsg = cartList.querySelector(".empty-cart-message");
  if (emptyMsg) {
    emptyMsg.style.display = "none";
  }

  cartList.appendChild(cartItem);
  updateTotals();

  const plusBtn = cartItem.querySelector(".plus");
  const quantityValue = cartItem.querySelector(".quantity-value");
  const itemTotal = cartItem.querySelector(".item-total");
  const minusBtn = cartItem.querySelector(".minus");

  plusBtn.addEventListener("click", (e) => {
    e.preventDefault();
    quantity++;
    quantityValue.textContent = quantity;
    itemTotal.textContent = `$${(price * quantity).toFixed(2)}`;
    updateTotals();
  });

  minusBtn.addEventListener("click", (e) => {
    e.preventDefault();

    if (quantity > 1) {
      quantity--;
      quantityValue.textContent = quantity;
      itemTotal.textContent = `$${(price * quantity).toFixed(2)}`;
      updateTotals();
    } else {
      cartItem.classList.add("slide-out");

      setTimeout(() => {
        cartItem.remove();
        cartProduct = cartProduct.filter((item) => item.id !== product.id);
        updateTotals();

        // Show empty cart message when all items are removed
        const remainingItems = cartList.querySelectorAll(".item");
        if (remainingItems.length === 0) {
          const emptyMsg = cartList.querySelector(".empty-cart-message");
          if (emptyMsg) {
            emptyMsg.style.display = "flex";
          }
        }
      }, 300);
    }
  });
};

const initApp = () => {
  fetch("products.json")
    .then((response) => response.json())
    .then((date) => {
      productList = date;
      showCards();
    });
};

initApp();



// login
// ================= AUTH ELEMENTS =================
const signinBtns = document.querySelectorAll(".signin-btn");
const authModal = document.querySelector(".auth-modal");
const closeAuth = document.querySelector(".close-auth");
const loginBtn = document.querySelector("#loginBtn");

const emailInput = document.querySelector("#emailInput");
const passwordInput = document.querySelector("#passwordInput");

// ================= UPDATE UI =================
const updateAuthUI = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  signinBtns.forEach((btn) => {
    btn.textContent = user ? "Logout" : "Sign in";
  });
};

// ================= LOGIN / LOGOUT =================
signinBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      // LOGOUT
      localStorage.removeItem("user");
      alert("Logged out!");
      updateAuthUI();
    } else {
      // OPEN MODAL
      if (authModal) {
        authModal.classList.add("active");
      }
    }
  });
});

// ================= CLOSE MODAL =================
if (closeAuth && authModal) {
  closeAuth.addEventListener("click", () => {
    authModal.classList.remove("active");
  });
}

// ================= LOGIN =================
if (loginBtn && emailInput && passwordInput) {
  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      alert("Fill all fields");
      return;
    }

    localStorage.setItem("user", JSON.stringify({ email }));

    alert("Login successful!");

    if (authModal) {
      authModal.classList.remove("active");
    }

    emailInput.value = "";
    passwordInput.value = "";

    updateAuthUI();
  });
}

// ================= RUN ON LOAD =================
updateAuthUI();


// ================= ORDER BUTTON =================
const orderBtn = document.querySelector(".order-btn");

if (orderBtn) {
  orderBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    // ❌ NOT LOGGED IN
    if (!user) {
      alert("Please login to order!");

      if (authModal) {
        authModal.classList.add("active");
      }
      return;
    }

    // ✅ LOGGED IN → SCROLL TO MENU
    const menuSection = document.getElementById("menu");
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: "smooth" });
    }
  });
}

// ================= CHECKOUT BUTTON =================
const checkoutBtns = document.querySelectorAll(".btn-container .btn:last-child");

checkoutBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    // Check if cart is empty
    const cartItems = cartList.querySelectorAll(".item");
    
    if (cartItems.length === 0) {
      alert("Your cart is empty! Add items before checkout.");
      return;
    }

    // Calculate total items and price
    let totalQuantity = 0;
    let totalPrice = 0;

    cartItems.forEach((item) => {
      const quantity = parseInt(item.querySelector(".quantity-value").textContent);
      const price = parseFloat(item.querySelector(".item-total").textContent.replace("$", ""));
      totalQuantity += quantity;
      totalPrice += price;
    });

    // Show confirmation
    const confirmed = confirm(
      `Order Summary:\n\nTotal Items: ${totalQuantity}\nTotal Price: $${totalPrice.toFixed(2)}\n\nProceed with checkout?`
    );

    if (confirmed) {
      alert("Order placed successfully! Thank you for your purchase.");
      
      // Clear the cart
      cartList.innerHTML = "";
      cartProduct = [];
      updateTotals();
      
      // Close cart tab
      cartTab.classList.remove("cart-tab-active");
    }
  });
});