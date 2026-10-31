// Siri Silks demo storefront. Replace sample product data and WhatsApp number only after owner approval.
const WHATSAPP_NUMBER = "91XXXXXXXXXX"; // Country code + number, digits only. Demo placeholder.

const products = [
  {id:1,name:"Ruby Temple Kanchipuram",category:"Kanchipuram Silk",colour:"Red",price:5490,badge:"Festive pick",image:"images/saree-01.jpg",description:"Traditional-inspired silk saree for celebrations."},
  {id:2,name:"Emerald Zari Soft Silk",category:"Soft Silk",colour:"Green",price:3890,badge:"Popular",image:"images/saree-02.jpg",description:"A graceful green saree with a classic look."},
  {id:3,name:"Blush Pink Organza",category:"Organza",colour:"Pink",price:2790,badge:"Lightweight",image:"images/saree-03.jpg",description:"An airy organza look for daytime occasions."},
  {id:4,name:"Royal Blue Tussar",category:"Tussar",colour:"Blue",price:4290,badge:"New edit",image:"images/saree-04.jpg",description:"Textured Tussar-inspired occasion wear."},
  {id:5,name:"Golden Hour Silk",category:"Kanchipuram Silk",colour:"Gold",price:7290,badge:"Statement",image:"images/saree-05.jpg",description:"A rich gold-toned traditional look."},
  {id:6,name:"Rose Garden Soft Silk",category:"Soft Silk",colour:"Pink",price:3490,badge:"Elegant",image:"images/saree-06.jpg",description:"A soft pink style for family celebrations."},
  {id:7,name:"Classic Maroon Festive",category:"Festive",colour:"Red",price:6190,badge:"Occasion wear",image:"images/saree-07.jpg",description:"A festive colour for special moments."},
  {id:8,name:"Ivory Gold Organza",category:"Organza",colour:"Gold",price:3190,badge:"Lightweight",image:"images/saree-08.jpg",description:"An understated ivory and gold look."},
  {id:9,name:"Peacock Blue Silk",category:"Kanchipuram Silk",colour:"Blue",price:8490,badge:"Classic",image:"images/saree-09.jpg",description:"A rich blue silk-inspired statement saree."},
  {id:10,name:"Leaf Green Tussar",category:"Tussar",colour:"Green",price:2990,badge:"Natural look",image:"images/saree-10.jpg",description:"A textured green style for elegant occasions."},
  {id:11,name:"Celebration Pink Silk",category:"Festive",colour:"Pink",price:5790,badge:"Festive pick",image:"images/saree-11.jpg",description:"A bright celebratory saree concept."},
  {id:12,name:"Midnight Blue Soft Silk",category:"Soft Silk",colour:"Blue",price:4590,badge:"Timeless",image:"images/saree-12.jpg",description:"A versatile blue saree for evening events."}
];

let activeCategory = "All";
let cart = [];
let wishlist = new Set();

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");

function money(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function whatsappLink(message) {
  const number = WHATSAPP_NUMBER.replace(/\D/g, "");
  if (!number || number.includes("+917569221743")) return "#";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function productCard(product) {
  const wished = wishlist.has(product.id);

  return `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy"
          onerror="this.style.display='none';this.parentElement.insertAdjacentHTML('beforeend','<div class=&quot;product-placeholder&quot;>SIRI SILKS<small>Add ${product.image}</small></div>')">

        <span class="product-badge">${product.badge}</span>

        <button class="wishlist-button ${wished ? "active" : ""}"
          data-wishlist="${product.id}"
          aria-label="Add ${product.name} to wishlist">
          ${wished ? "♥" : "♡"}
        </button>
      </div>

      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3>${product.name}</h3>
        <p class="product-colour">Colour: ${product.colour}</p>
        <p class="product-price">${money(product.price)} <small>Demo price</small></p>

        <div class="product-actions">
          <button class="add-button" data-add="${product.id}">Add to bag</button>
          <button class="enquire-button" data-enquire="${product.id}">Enquire</button>
        </div>
      </div>
    </article>`;
}

function getFilteredProducts() {
  const query = searchInput.value.trim().toLowerCase();

  const categories = [
    ...document.querySelectorAll('input[name="category"]:checked')
  ].map(el => el.value);

  const colours = [
    ...document.querySelectorAll('input[name="colour"]:checked')
  ].map(el => el.value);

  const price =
    document.querySelector('input[name="price"]:checked')?.value || "all";

  let filtered = products.filter(product => {
    const matchesSearch =
      !query ||
      [
        product.name,
        product.category,
        product.colour,
        product.description
      ].join(" ").toLowerCase().includes(query);

    const matchesCategory =
      (activeCategory === "All" || product.category === activeCategory) &&
      (!categories.length || categories.includes(product.category));

    const matchesColour =
      !colours.length || colours.includes(product.colour);

    const matchesPrice =
      price === "all" ||
      (price === "under3000" && product.price < 3000) ||
      (price === "3000to6000" &&
        product.price >= 3000 && product.price <= 6000) ||
      (price === "above6000" && product.price > 6000);

    return matchesSearch && matchesCategory && matchesColour && matchesPrice;
  });

  const sort = document.getElementById("sortSelect").value;

  if (sort === "price-low")
    filtered.sort((a, b) => a.price - b.price);

  if (sort === "price-high")
    filtered.sort((a, b) => b.price - a.price);

  if (sort === "name")
    filtered.sort((a, b) => a.name.localeCompare(b.name));

  return filtered;
}

function renderProducts() {
  const filtered = getFilteredProducts();

  productGrid.innerHTML = filtered.map(productCard).join("");

  resultCount.textContent =
    `Showing ${filtered.length} of ${products.length} demo products`;

  emptyState.hidden = filtered.length !== 0;
}

function clearFilters() {
  searchInput.value = "";

  document
    .querySelectorAll('input[name="category"], input[name="colour"]')
    .forEach(el => el.checked = false);

  document.querySelector('input[name="price"][value="all"]').checked = true;

  document.getElementById("sortSelect").value = "featured";

  activeCategory = "All";
  categoryFilter.value = "All";

  document.querySelectorAll(".category-tile").forEach(tile => {
    tile.classList.toggle("active", tile.dataset.category === "All");
  });

  renderProducts();
}

function setCategory(category) {
  activeCategory = category;
  categoryFilter.value = category;

  document.querySelectorAll(".category-tile").forEach(tile => {
    tile.classList.toggle("active", tile.dataset.category === category);
  });

  renderProducts();

  document.getElementById("productArea").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function openWhatsApp(message) {
  const url = whatsappLink(message);

  if (url === "#") {
    alert(
      "Demo WhatsApp number not configured. Replace WHATSAPP_NUMBER in script.js with an owner-approved number."
    );
    return;
  }

  window.open(url, "_blank", "noopener");
}

function renderCart() {
  document.getElementById("cartCount").textContent = cart.length;

  const cartItems = document.getElementById("cartItems");

  if (!cart.length) {
    cartItems.innerHTML = '<p class="cart-empty">Your bag is empty.</p>';
  } else {
    cartItems.innerHTML = cart.map((item, index) => `
      <div class="cart-row">
        <img class="cart-thumb" src="${item.image}" alt=""
          onerror="this.style.visibility='hidden'">

        <div>
          <h4>${item.name}</h4>
          <p>${money(item.price)} · Demo price</p>
        </div>

        <button class="remove-item" data-remove="${index}"
          aria-label="Remove ${item.name}">
          Remove
        </button>
      </div>
    `).join("");
  }

  document.getElementById("cartTotal").textContent =
    money(cart.reduce((sum, item) => sum + item.price, 0));
}

function toggleCart(open) {
  document.getElementById("cartDrawer").classList.toggle("open", open);

  document.getElementById("drawerBackdrop").classList.toggle("open", open);

  document.getElementById("cartDrawer").setAttribute(
    "aria-hidden",
    String(!open)
  );
}

// Search
document.getElementById("searchForm").addEventListener("submit", event => {
  event.preventDefault();
  renderProducts();

  document.getElementById("productArea").scrollIntoView({
    behavior: "smooth"
  });
});

searchInput.addEventListener("input", renderProducts);

document.getElementById("sortSelect")
  .addEventListener("change", renderProducts);

// Filters
document
  .querySelectorAll('input[name="category"],input[name="colour"],input[name="price"]')
  .forEach(el => el.addEventListener("change", renderProducts));

// Category tiles
document.getElementById("categoryTiles").addEventListener("click", event => {
  const tile = event.target.closest("[data-category]");

  if (tile) setCategory(tile.dataset.category);
});

document.querySelectorAll("[data-nav-category]").forEach(link => {
  link.addEventListener("click", () => {
    setCategory(link.dataset.navCategory);
  });
});

document.getElementById("clearFilters").addEventListener("click", clearFilters);
document.getElementById("emptyClear").addEventListener("click", clearFilters);

// Product actions
productGrid.addEventListener("click", event => {
  const add = event.target.closest("[data-add]");
  const enquire = event.target.closest("[data-enquire]");
  const wish = event.target.closest("[data-wishlist]");

  if (add) {
    const product = products.find(
      p => p.id === Number(add.dataset.add)
    );

    cart.push(product);
    renderCart();
    toggleCart(true);
  }

  if (enquire) {
    const product = products.find(
      p => p.id === Number(enquire.dataset.enquire)
    );

    openWhatsApp(
      `Hello Siri Silks, I would like to enquire about ${product.name} (${product.category}). Please share actual price and availability.`
    );
  }

  if (wish) {
    const id = Number(wish.dataset.wishlist);

    wishlist.has(id) ? wishlist.delete(id) : wishlist.add(id);

    renderProducts();
  }
});

// Wishlist
document.getElementById("wishlistToggle").addEventListener("click", () => {
  const saved = products.filter(p => wishlist.has(p.id));

  if (!saved.length) {
    alert("Your wishlist is empty. Tap the heart on a product to save it.");
    return;
  }

  alert("Wishlist: " + saved.map(p => p.name).join(", "));
});

// Cart controls
document.getElementById("cartToggle").addEventListener("click", () => {
  toggleCart(true);
});

document.getElementById("closeCart").addEventListener("click", () => {
  toggleCart(false);
});

document.getElementById("drawerBackdrop").addEventListener("click", () => {
  toggleCart(false);
});

document.getElementById("cartItems").addEventListener("click", event => {
  const remove = event.target.closest("[data-remove]");

  if (remove) {
    cart.splice(Number(remove.dataset.remove), 1);
    renderCart();
  }
});

// WhatsApp order enquiry
document.getElementById("whatsappOrder").addEventListener("click", () => {
  if (!cart.length) {
    alert("Your bag is empty.");
    return;
  }

  const lines = cart.map(item =>
    `- ${item.name} (${money(item.price)} demo price)`
  );

  openWhatsApp(
    "Hello Siri Silks, I would like to enquire about these items:\n" +
    lines.join("\n") +
    "\nPlease confirm actual prices and availability."
  );
});

document.getElementById("mainWhatsapp").addEventListener("click", event => {
  event.preventDefault();

  openWhatsApp(
    "Hello Siri Silks, I would like to know more about your saree collections."
  );
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Initial rendering
renderProducts();
renderCart();
