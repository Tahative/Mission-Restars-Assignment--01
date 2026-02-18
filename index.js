/* =========================
   Global Loader
========================= */


function showLoader() {
  const loader = document.getElementById("globalLoader");
  if (loader) loader.classList.remove("hidden");
}

function hideLoader() {
  const loader = document.getElementById("globalLoader");
  if (loader) loader.classList.add("hidden");
}

function showLoader() {
  const loader = document.getElementById("globalLoader");
  if (!loader) return;
  loader.classList.remove("hidden");
}


/* =========================
Trending Products Load
========================= */
let HOME_PRODUCTS = [];

const loadProducts = () => {
  showLoader();

  fetch("https://fakestoreapi.com/products")
    .then((res) => res.json())
    .then((data) => {
      HOME_PRODUCTS = data;            // ✅ save for modal
      displayProducts(data.slice(0, 3));
    })
    .catch((err) => console.error(err))
    .finally(() => hideLoader());     // ✅ loader always hides
};

/* =========================
   Display Products
========================= */
const displayProducts = (products) => {
  const grid = document.getElementById("trendingGrid");
  if (!grid) return;

  grid.innerHTML = "";

  products.forEach((product) => {
    const div = document.createElement("div");

    div.innerHTML = `
      <!-- Product Card -->
      <div class="bg-white border border-none rounded-xl overflow-hidden shadow-sm hover:shadow-md transition h-full">

        <!-- Image Area -->
        <div class="bg-slate-100 h-56 flex items-center justify-center p-6">
          <img src="${product.image}" alt="${product.title}" class="h-full object-contain" />
        </div>

        <!-- Content -->
        <div class="p-4">

          <!-- Category + Rating -->
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 font-medium">
              ${product.category}
            </span>

            <div class="text-sm flex items-center gap-1 text-slate-600">
              <span class="text-yellow-500">★</span>
              <span>${product.rating.rate}</span>
              <span class="text-slate-400">(${product.rating.count})</span>
            </div>
          </div>

          <!-- Title -->
          <h3 class="font-semibold text-slate-900 leading-snug">
            ${product.title.split(" ").slice(0, 5).join(" ")}...
          </h3>

          <!-- Price -->
          <p class="mt-2 font-bold text-slate-900">$${product.price}</p>

          <!-- Buttons -->
          <div class="mt-4 flex gap-3">
            <!-- Details -->
            <button type="button" onclick="window.openModal(${product.id})"
              class="flex-1 border border-base-300 rounded-lg py-2 text-sm font-medium hover:bg-slate-50 transition flex flex-row items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg"
                width="16" height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"></path>
                <circle cx="12" cy="12" r="2.5"></circle>
              </svg>
              Details
            </button>

            <!-- Add -->
            <button type="button"
              class="flex-1 bg-indigo-600 text-white rounded-lg py-2 text-sm font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
              onclick='addToCart({
                id: "${product.id}",
                title: ${JSON.stringify(product.title)},
                price: ${Number(product.price)},
                image: "${product.image}"
              })'
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add
            </button>
          </div>

        </div>
      </div>
      <!-- End Product Card -->
    `;

    grid.appendChild(div);
  });
};

/* ============
     Modal 
============*/
let modalEl, closeBtn;

window.openModal = (id) => {
  const product = HOME_PRODUCTS.find((p) => Number(p.id) === Number(id));
  if (!product || !modalEl) return;

  document.getElementById("modalImg").src = product.image;
  document.getElementById("modalTitle").textContent = product.title;
  document.getElementById("modalDesc").textContent = product.description;
  document.getElementById("modalPrice").textContent = `$${product.price}`;
  document.getElementById("modalCategory").textContent = product.category;

  document.getElementById("modalRate").textContent = product.rating?.rate ?? "0";
  document.getElementById("modalCount").textContent = product.rating?.count ?? "0";


  const addBtn = document.getElementById("modalAddBtn");
  if (addBtn) {
    addBtn.onclick = () =>
      addToCart({
        id: String(product.id),
        title: product.title,
        price: Number(product.price),
        image: product.image,
      });
  }

  modalEl.classList.remove("hidden");
};

function closeModal() {
  if (!modalEl) return;
  modalEl.classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  modalEl = document.getElementById("productModal");
  closeBtn = document.getElementById("closeModal");

  if (!modalEl || !closeBtn) {
    console.error("Modal HTML missing. Check IDs.");
    return;
  }

  closeBtn.addEventListener("click", closeModal);

  modalEl.addEventListener("click", (e) => {
    if (e.target === modalEl) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  const clearBtn = document.getElementById("clearCartBtn");
  if (clearBtn) clearBtn.addEventListener("click", clearCart);

  /* =========================
     Page Navigation Loader
  ========================= */
  document.querySelectorAll('a[href$="index.html"], a[href$="products.html"]').forEach((link) => {
    link.addEventListener("click", () => showLoader());
  });
});


loadProducts();
