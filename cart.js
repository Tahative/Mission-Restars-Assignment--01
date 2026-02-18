// ============================
// CART (SHARED FOR ALL PAGES)
// ============================

const STORAGE_KEY = "swiftcraft_cart_v1";
let cart = [];

const money = (n) => Number(n).toFixed(2);

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function loadCart() {
  const raw = localStorage.getItem(STORAGE_KEY);
  cart = raw ? JSON.parse(raw) : [];
}

function cartCount() {
  return cart.reduce((sum, item) => sum + (item.qty || 1), 0);
}

function cartTotal() {
  return cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
}

function renderCart() {
  const countEl = document.getElementById("cartCount");
  const countTextEl = document.getElementById("cartCountText");
  const totalEl = document.getElementById("cartTotal");
  const itemsEl = document.getElementById("cartItems");

  const count = cartCount();
  const total = cartTotal();

  if (countEl) countEl.textContent = count;
  if (countTextEl) countTextEl.textContent = count;
  if (totalEl) totalEl.textContent = money(total);

  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = `<p class="text-sm opacity-70">Your cart is empty.</p>`;
    return;
  }

  itemsEl.innerHTML = cart
    .map(
      (item) => `
      <div class="flex gap-3 items-center border rounded-xl p-2">
        <img src="${item.image}" class="w-12 h-12 object-contain bg-base-200 rounded" />
        <div class="flex-1">
          <p class="text-sm font-semibold line-clamp-1">${item.title}</p>
          <p class="text-xs opacity-70">$${money(item.price)} × ${item.qty}</p>
        </div>
        <div class="flex flex-col gap-1">
          <button class="btn btn-xs" onclick="increaseQty('${item.id}')">+</button>
          <button class="btn btn-xs" onclick="decreaseQty('${item.id}')">−</button>
          <button class="btn btn-error btn-xs" onclick="removeFromCart('${item.id}')">✕</button>
        </div>
      </div>
    `
    )
    .join("");
}

function addToCart(product) {
  const existing = cart.find((i) => String(i.id) === String(product.id));
  if (existing) existing.qty += 1;
  else cart.push({ ...product, qty: 1 });

  saveCart();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter((i) => String(i.id) !== String(id));
  saveCart();
  renderCart();
}

function increaseQty(id) {
  const item = cart.find((i) => String(i.id) === String(id));
  if (!item) return;
  item.qty += 1;
  saveCart();
  renderCart();
}

function decreaseQty(id) {
  const item = cart.find((i) => String(i.id) === String(id));
  if (!item) return;
  item.qty -= 1;
  if (item.qty <= 0) cart = cart.filter((i) => String(i.id) !== String(id));
  saveCart();
  renderCart();
}

function clearCart() {
  cart = [];
  saveCart();
  renderCart();
}

document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  renderCart();

  const clearBtn = document.getElementById("clearCartBtn");
  if (clearBtn) clearBtn.addEventListener("click", clearCart);
});

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.increaseQty = increaseQty;
window.decreaseQty = decreaseQty;
window.clearCart = clearCart;
window.loadCart = loadCart;
window.renderCart = renderCart;
