// -----------------------------------------
// SIRI SILKS - FRONTEND + SUPABASE AUTH
// -----------------------------------------

// Add Supabase project details here.
// Use the Project URL and publishable/anon key only.
// NEVER use the service_role or secret key in this file.

const SUPABASE_URL = "https://ahupaxdwlxhjgvogfbcd.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_uBmd8g2nJ1QZH3vTPAUfag_zeXb5O-u";

// Add only the Siri Silks owner-approved WhatsApp number.
// Format: +91 followed by 10 digits.
const WHATSAPP_NUMBER = "+917569221743";

let supabaseClient = null;

if (
  window.supabase &&
  SUPABASE_URL.startsWith("https://") &&
  !SUPABASE_URL.includes("YOUR_") &&
  !SUPABASE_ANON_KEY.includes("YOUR_")
) {
  supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );
}

// Demo products. Replace these with actual owner-approved catalogue data.
const products = [
  {id:1,name:"Ruby Kanchipuram Saree",category:"Sarees",price:5490,image:"images/saree-01.jpg"},
  {id:2,name:"Emerald Soft Silk Saree",category:"Sarees",price:3890,image:"images/saree-02.jpg"},
  {id:3,name:"Blush Pink Organza Saree",category:"Sarees",price:2790,image:"images/saree-03.jpg"},
  {id:4,name:"Royal Blue Tussar Saree",category:"Sarees",price:4290,image:"images/saree-04.jpg"},
  {id:5,name:"Golden Festive Saree",category:"Sarees",price:7290,image:"images/saree-05.jpg"},
  {id:6,name:"Printed Everyday Kurti",category:"Kurtis & Kurtas",price:1290,image:"images/saree-06.jpg"},
  {id:7,name:"Designer Party Lehenga",category:"Lehengas",price:8990,image:"images/saree-07.jpg"},
  {id:8,name:"Classic Salwar Suit",category:"Salwar Suits",price:2490,image:"images/saree-08.jpg"},
  {id:9,name:"Floral Dress Material",category:"Dress Materials",price:1590,image:"images/saree-09.jpg"},
  {id:10,name:"Evening Party Gown",category:"Gowns & Party Wear",price:4990,image:"images/saree-10.jpg"},
  {id:11,name:"Women's Ethnic Set",category:"Women's Wear",price:3290,image:"images/saree-11.jpg"},
  {id:12,name:"Men's Ethnic Kurta",category:"Men's Wear",price:2190,image:"images/saree-12.jpg"},
  {id:13,name:"Kids Festive Wear",category:"Kids Wear",price:1890,image:"images/saree-01.jpg"},
  {id:14,name:"Designer Blouse",category:"Blouses",price:990,image:"images/saree-02.jpg"}
];

const categories = [
  "Sarees",
  "Kurtis & Kurtas",
  "Lehengas",
  "Salwar Suits",
  "Dress Materials",
  "Gowns & Party Wear",
  "Women's Wear",
  "Men's Wear",
  "Kids Wear",
  "Blouses"
];

let activeCategory = "All";
let cart = [];
let wishlist = new Set();
let authMode = "signup";

const $ = id => document.getElementById(id);

function money(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

// WhatsApp
function openWhatsApp(message) {
  const number = WHATSAPP_NUMBER.replace(/\D/g, "");

  if (number.length !== 12 || !number.startsWith("91")) {
    alert("WhatsApp demo number is not configured. Add the owner-approved +91 number in script.js.");
    return;
  }

  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener");
}

["topWhatsapp", "floatingWhatsapp", "mainWhatsapp"].forEach(id => {
  $(id).addEventListener("click", () => {
    openWhatsApp("Hello Siri Silks, I would like to know about your clothing collections.");
  });
});

// Category filter controls
$("categoryFilters").innerHTML = categories.map(category => `
  <label>
    <input type="checkbox" name="categoryFilter" value="${category}">
    ${category}
  </label>
`).join("");

function getFilteredProducts() {
  const query = $("searchInput").value.trim().toLowerCase();

  const selectedCategories = [
    ...document.querySelectorAll('input[name="categoryFilter"]:checked')
  ].map(input => input.value);

  const price = document.querySelector('input[name="price"]:checked')?.value || "all";

  let result = products.filter(product => {
    const searchMatch =
      !query ||
      `${product.name} ${product.category}`.toLowerCase().includes(query);

    const categoryMatch =
      (activeCategory === "All" || product.category === activeCategory) &&
      (!selectedCategories.length || selectedCategories.includes(product.category));

    const priceMatch =
      price === "all" ||
      (price === "under3000" && product.price < 3000) ||
      (price === "3000to6000" && product.price >= 3000 && product.price <= 6000) ||
      (price === "above6000" && product.price > 6000);

    return searchMatch && categoryMatch && priceMatch;
  });

  const sort = $("sortSelect").value;

  if (sort === "price-low") result.sort((a,b) => a.price - b.price);
  if (sort === "price-high") result.sort((a,b) => b.price - a.price);
  if (sort === "name") result.sort((a,b) => a.name.localeCompare(b.name));

  return result;
}

function renderProducts() {
  const result = getFilteredProducts();

  $("productGrid").innerHTML = result.map(product => `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy"
          onerror="this.style.display='none'">
        <button class="wishlist-button ${wishlist.has(product.id) ? "active" : ""}"
          data-wish="${product.id}" aria-label="Add to wishlist">
          ${wishlist.has(product.id) ? "♥" : "♡"}
        </button>
      </div>
      <div class="product-info">
        <small>${product.category}</small>
        <h3>${product.name}</h3>
        <p class="product-price">${money(product.price)} <small>Demo price</small></p>
        <div class="product-actions">
          <button class="add-button" data-add="${product.id}">Add to bag</button>
          <button class="enquire-button" data-enquire="${product.id}">Enquire</button>
        </div>
      </div>
    </article>
  `).join("");

  $("resultCount").textContent =
    `Showing ${result.length} of ${products.length} demo products`;

  $("emptyState").hidden = result.length !== 0;
}

function setCategory(category) {
  activeCategory = category;

  document.querySelectorAll(".category-tile").forEach(tile => {
    tile.classList.toggle("active", tile.dataset.category === category);
  });

  renderProducts();

  $("productArea").scrollIntoView({behavior:"smooth"});
}

$("categoryTiles").addEventListener("click", event => {
  const tile = event.target.closest("[data-category]");
  if (tile) setCategory(tile.dataset.category);
});

$("productGrid").addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");
  const wishButton = event.target.closest("[data-wish]");
  const enquireButton = event.target.closest("[data-enquire]");

  if (addButton) {
    const product = products.find(p => p.id === Number(addButton.dataset.add));
    cart.push(product);
    renderCart();
    $("cartDrawer").classList.add("open");
    $("drawerBackdrop").classList.add("open");
  }

  if (wishButton) {
    const id = Number(wishButton.dataset.wish);
    wishlist.has(id) ? wishlist.delete(id) : wishlist.add(id);
    renderProducts();
  }

  if (enquireButton) {
    const product = products.find(p => p.id === Number(enquireButton.dataset.enquire));
    openWhatsApp(`Hello Siri Silks, I would like to enquire about ${product.name}. Please confirm the actual price and availability.`);
  }
});

// Wishlist modal
$("wishlistToggle").addEventListener("click", () => {
  const saved = products.filter(p => wishlist.has(p.id));

  $("wishlistItems").innerHTML = saved.length
    ? saved.map(p => `<p>${p.name} — ${money(p.price)}</p>`).join("")
    : "<p>Your wishlist is empty. Tap the heart on a product to save it.</p>";

  $("wishlistModal").classList.add("open");
});

$("closeWishlist").addEventListener("click", () => {
  $("wishlistModal").classList.remove("open");
});

// Cart
function renderCart() {
  $("cartCount").textContent = cart.length;

  $("cartItems").innerHTML = cart.length
    ? cart.map((p,index) => `
      <div class="cart-row">
        <span>${p.name}<br>${money(p.price)}</span>
        <button class="remove-item" data-remove="${index}">Remove</button>
      </div>
    `).join("")
    : "<p>Your bag is empty.</p>";

  $("cartTotal").textContent = money(cart.reduce((sum,p) => sum + p.price, 0));
}

$("cartItems").addEventListener("click", event => {
  const button = event.target.closest("[data-remove]");
  if (!button) return;

  cart.splice(Number(button.dataset.remove), 1);
  renderCart();
});

function closeCart() {
  $("cartDrawer").classList.remove("open");
  $("drawerBackdrop").classList.remove("open");
}

$("cartToggle").addEventListener("click", () => {
  $("cartDrawer").classList.add("open");
  $("drawerBackdrop").classList.add("open");
});

$("closeCart").addEventListener("click", closeCart);
$("drawerBackdrop").addEventListener("click", closeCart);

$("whatsappOrder").addEventListener("click", () => {
  if (!cart.length) {
    alert("Your bag is empty.");
    return;
  }

  const lines = cart.map(p => `${p.name} - ${money(p.price)}`).join("\n");
  openWhatsApp(`Hello Siri Silks, I want to enquire about:\n${lines}\nPlease confirm availability and final prices.`);
});

// Search and filters
$("searchForm").addEventListener("submit", event => {
  event.preventDefault();
  renderProducts();
});

$("searchInput").addEventListener("input", renderProducts);
$("sortSelect").addEventListener("change", renderProducts);

document.querySelectorAll('input[name="categoryFilter"],input[name="price"]')
  .forEach(input => input.addEventListener("change", renderProducts));

function clearFilters() {
  $("searchInput").value = "";
  document.querySelectorAll('input[name="categoryFilter"]').forEach(i => i.checked = false);
  document.querySelector('input[name="price"][value="all"]').checked = true;
  $("sortSelect").value = "featured";
  setCategory("All");
}

$("clearFilters").addEventListener("click", clearFilters);
$("emptyClear").addEventListener("click", clearFilters);

// -----------------------------------------
// SUPABASE ACCOUNT AUTHENTICATION
// -----------------------------------------

function showAccount() {
  $("accountModal").classList.add("open");
  $("authMessage").textContent = "";
  updateAuthUI();
}

$("accountToggle").addEventListener("click", showAccount);

$("closeAccount").addEventListener("click", () => {
  $("accountModal").classList.remove("open");
});

function setAuthMode(mode) {
  authMode = mode;

  const signup = mode === "signup";

  $("accountTitle").textContent = signup ? "Create your account" : "Welcome back";
  $("accountSubtitle").textContent = signup
    ? "Join Siri Silks for a personalised shopping experience."
    : "Login to your Siri Silks account.";

  $("nameLabel").hidden = !signup;
  $("authName").hidden = !signup;
  $("authName").required = signup;

  $("authSubmit").textContent = signup ? "Create account" : "Login";

  $("switchAuth").textContent = signup
    ? "Already have an account? Login"
    : "New customer? Create account";

  $("forgotPassword").hidden = signup;
  $("authMessage").textContent = "";
}

$("switchAuth").addEventListener("click", () => {
  setAuthMode(authMode === "signup" ? "login" : "signup");
});

async function updateAuthUI() {
  if (!supabaseClient) {
    $("logoutButton").hidden = true;
    return;
  }

  const {data:{session}} = await supabaseClient.auth.getSession();

  if (session) {
    $("accountTitle").textContent = "Your account";
    $("accountSubtitle").textContent = `Logged in as ${session.user.email}`;
    $("authForm").hidden = true;
    $("switchAuth").hidden = true;
    $("forgotPassword").hidden = true;
    $("logoutButton").hidden = false;
  } else {
    $("authForm").hidden = false;
    $("switchAuth").hidden = false;
    $("logoutButton").hidden = true;
    setAuthMode("signup");
  }
}

$("authForm").addEventListener("submit", async event => {
  event.preventDefault();

  if (!supabaseClient) {
    $("authMessage").textContent =
      "Supabase is not configured. Add your Supabase project URL and publishable key in script.js.";
    return;
  }

  const email = $("authEmail").value.trim();
  const password = $("authPassword").value;
  const name = $("authName").value.trim();

  $("authSubmit").disabled = true;
  $("authMessage").textContent = "Please wait...";

  try {
    let result;

    if (authMode === "signup") {
      result = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name }
        }
      });
    } else {
      result = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });
    }

    if (result.error) throw result.error;

    $("authMessage").textContent = authMode === "signup"
      ? "Account request successful. Check your email if confirmation is enabled."
      : "Login successful.";

    await updateAuthUI();

  } catch (error) {
    $("authMessage").textContent = error.message || "Authentication failed.";
  } finally {
    $("authSubmit").disabled = false;
  }
});

$("forgotPassword").addEventListener("click", async () => {
  if (!supabaseClient) {
    $("authMessage").textContent = "Configure Supabase first.";
    return;
  }

  const email = $("authEmail").value.trim();

  if (!email) {
    $("authMessage").textContent = "Enter your email address first.";
    return;
  }
  const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
  redirectTo: "https://dhanavarshamaddamsetti-byte.github.io/siri-silks-demo/"
});

  $("authMessage").textContent = error
    ? error.message
    : "If the email is registered, a password reset link will be sent.";
});

$("logoutButton").addEventListener("click", async () => {
  if (!supabaseClient) return;

  const {error} = await supabaseClient.auth.signOut();

  if (error) {
    $("authMessage").textContent = error.message;
    return;
  }

  $("authMessage").textContent = "You have logged out.";
  setAuthMode("signup");
  await updateAuthUI();
});

if (supabaseClient) {
  supabaseClient.auth.onAuthStateChange(() => {
    updateAuthUI();
  });
}

// Initial setup
$("year").textContent = new Date().getFullYear();
renderProducts();
renderCart();
