const API = {
  allPlants: "https://openapi.programming-hero.com/api/plants",
  categories: "https://openapi.programming-hero.com/api/categories",
  category: (id) => `https://openapi.programming-hero.com/api/category/${id}`,
  plant: (id) => `https://openapi.programming-hero.com/api/plant/${id}`,
};

const dom = {
  categoryList: document.getElementById("categoryList"),
  cardsContainer: document.getElementById("cardsContainer"),
  loading: document.getElementById("loading"),
  cartContainer: document.getElementById("cartContainer"),
  cartContainerMobile: document.getElementById("cartContainerMobile"),
  cartTotal: document.getElementById("cartTotal"),
  modal: document.getElementById("plantModal"),
  modalContent: document.getElementById("modalContent"),
  year: document.getElementById("year"),
  plantForm: document.getElementById("plantForm"),
};

const state = {
  categories: [
    { id: "all", label: "All Trees" },
    { id: "fruit", label: "Fruit Trees" },
    { id: "flowering", label: "Flowering Trees" },
    { id: "shade", label: "Shade Trees" },
    { id: "medicinal", label: "Medicinal Trees" },
    { id: "timber", label: "Timber Trees" },
    { id: "evergreen", label: "Evergreen Trees" },
    { id: "ornamental", label: "Ornamental Plants" },
    { id: "bamboo", label: "Bamboo" },
    { id: "climbers", label: "Climbers" },
    { id: "aquatic", label: "Aquatic Plants" },
  ],
  activeCategoryId: "all",
  cartItems: [],
  allPlants: [],
  lastAddedId: null,
};

function formatPrice(value) {
  const n = Number(value ?? 0);
  return `$${n.toFixed(2)}`;
}

function showLoading(isLoading) {
  if (!dom.loading) return;
  dom.loading.classList.toggle("hidden", !isLoading);
}

async function safeFetch(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Fetch error:", err);
    return { error: true };
  }
}

function getSafeImageUrl(url) {
  const placeholder = "https://picsum.photos/seed/green-earth/600/400";
  if (!url || typeof url !== "string") return placeholder;
  let u = url.trim();
  if (!u) return placeholder;
  u = u.replace(/\bi\.ibb\.co\.com\b/g, "i.ibb.co");
  if (u.startsWith("//")) u = `https:${u}`;
  if (/^i\.ibb\.co\//i.test(u)) u = `https://${u}`;
  if (/^\/?assets\//.test(u)) return u;
  try {
    const parsed = new URL(u, window.location.origin);
    return parsed.href;
  } catch {
    return placeholder;
  }
}

// Categories
async function loadCategories() {
  renderCategories();
  setActiveCategory("all");
}

function renderCategories() {
  dom.categoryList.innerHTML = "";
  state.categories.forEach((cat) => {
    const id = cat.id;
    const btn = document.createElement("button");
    // btn.className = `btn btn-sm justify-start ${
    //   state.activeCategoryId === id
    //     ? "btn-success text-white"
    //     : "btn-ghost border"
    // }`;
    btn.className = `btn btn-sm justify-start transition duration-200
  ${
    state.activeCategoryId === id
      ? "btn-success text-white"
      : "btn-ghost border hover:bg-green-100 hover:text-green-700"
  }`;


    btn.className = `btn btn-sm justify-start transition duration-200
  ${
    state.activeCategoryId === id
      ? "btn-success text-white"
      : "btn-ghost border hover:bg-green-100 hover:text-green-700"
  }`;

    btn.textContent = cat.label;
    btn.addEventListener("click", () => setActiveCategory(id));
    dom.categoryList.appendChild(btn);
  });
}

async function setActiveCategory(id) {
  state.activeCategoryId = id;
  renderCategories();
  await loadPlantsByCategory(id);
}

// Plants
async function loadPlantsByCategory(id) {
  showLoading(true);
  dom.cardsContainer.innerHTML = "";
  if (state.allPlants.length === 0) {
    const data = await safeFetch(API.allPlants);
    const list = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.plants)
      ? data.plants
      : [];
    state.allPlants = list.map(normalizePlant);
  }
  const filtered = filterPlants(state.allPlants, id);
  renderCards(filtered);
  showLoading(false);
}

function filterPlants(plants, categoryId) {
  if (categoryId === "all") return plants;
  const matchers = {
    fruit: [/fruit/i],
    flowering: [/flower/i, /blossom/i],
    shade: [/shade/i],
    medicinal: [/medicin/i, /herb/i],
    timber: [/timber/i, /wood/i],
    evergreen: [/evergreen/i],
    ornamental: [/ornamental/i, /decor/i],
    bamboo: [/bamboo/i],
    climbers: [/climber/i, /vine/i],
    aquatic: [/aquatic/i, /water/i],
  };
  const tests = matchers[categoryId] || [];
  return plants.filter((p) =>
    tests.some(
      (re) =>
        re.test(p.category) || re.test(p.name) || re.test(p.short_description)
    )
  );
}

function renderCards(plants) {
  if (plants.length === 0) {
    dom.cardsContainer.innerHTML = `<div class="col-span-full text-center opacity-70">No trees found.</div>`;
    return;
  }
  dom.cardsContainer.innerHTML = "";
  plants.forEach((p) => {
    const { id, name, image, category, price, short_description, description } =
      p;
    const desc = short_description || description || "";
    const imgSrc = getSafeImageUrl(image);
    const safeId = String(id);
    const card = document.createElement("div");
    card.className = "card bg-white shadow-sm border";
    card.innerHTML = `
      <figure class="h-40 bg-base-200"><img src="${imgSrc}" alt="${escapeHtml(
      name
    )}" class="h-40 w-full object-cover" onerror="this.src='https://picsum.photos/seed/green-earth/600/400'" /></figure>
      <div class="card-body">
        <h3 class="card-title text-black cursor-pointer hover:underline js-name" data-id="${safeId}">${escapeHtml(
      name
    )}</h3>
        <p class="text-sm opacity-80 line-clamp-3">${escapeHtml(desc)}</p>
        <div class="flex justify-between items-center text-sm">
          <span class="badge bg-green-100 text-black border-none">${escapeHtml(
            category
          )}</span>
          <span class="font-semibold">${formatPrice(price)}</span>
        </div>
        <div class="card-actions">
          <button class="btn btn-success w-full text-white js-add" data-id="${safeId}">Add to Cart</button>
        </div>
      </div>
    `;

    card
      .querySelector(".js-name")
      .addEventListener("click", () => openPlantModal(safeId));
    card
      .querySelector(".js-add")
      .addEventListener("click", () => addToCart({ id: safeId, name, price }));
    dom.cardsContainer.appendChild(card);
  });
}

function normalizePlant(raw) {
  const id = raw?.id ?? raw?.plantId ?? raw?._id ?? Math.random();
  const image = getSafeImageUrl(
    raw?.image ?? raw?.img ?? raw?.photo ?? raw?.thumbnail ?? ""
  );
  const shortDesc =
    raw?.short_description ?? raw?.shortDescription ?? raw?.summary ?? null;
  const description = raw?.description ?? raw?.details ?? raw?.detail ?? "";
  return {
    id: String(id),
    name: raw?.name ?? raw?.plant_name ?? "Unknown",
    image,
    category: raw?.category ?? raw?.type ?? "N/A",
    price: Number(raw?.price ?? raw?.cost ?? 0),
    short_description: shortDesc || description,
    description,
  };
}

function normalizeCategory(raw) {
  const id = raw?.id ?? raw?.category_id ?? raw?.category ?? raw?.slug ?? null;
  const label = raw?.category ?? raw?.name ?? String(id ?? "").toString();
  return { id, label };
}

// Modal
async function openPlantModal(id) {
  const data = await safeFetch(API.plant(id));
  let plant = null;
  if (data?.data) plant = normalizePlant(data.data);
  if (!plant) {
    dom.modalContent.innerHTML = `<div class="alert alert-error">Failed to load details.</div>`;
  } else {
    const imgSrc = getSafeImageUrl(plant.image);
    dom.modalContent.innerHTML = `
      <div class="flex gap-4 items-start">
        <img src="${imgSrc}" alt="${escapeHtml(
      plant.name
    )}" class="w-40 h-40 object-cover rounded-lg" onerror="this.src='https://picsum.photos/seed/green-earth/600/400'" />
        <div>
          <h3 class="text-2xl font-bold">${escapeHtml(plant.name)}</h3>
          <div class="mt-1 badge bg-green-100 text-green-700 border-none">${escapeHtml(
            plant.category
          )}</div>
          <div class="mt-2 font-semibold">${formatPrice(plant.price)}</div>
        </div>
      </div>
      <p class="mt-4">${escapeHtml(
        plant.description || plant.short_description || ""
      )}</p>`;
  }
  dom.modal.showModal();
}

// Cart
function addToCart(item) {
  const itemId = String(item.id);
  state.lastAddedId = itemId;
  const existing = state.cartItems.find((i) => String(i.id) === itemId);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cartItems.push({
      id: itemId,
      name: item.name,
      price: item.price,
      qty: 1,
    });
  }
  renderCart();
}

function removeFromCart(id) {
  const targetId = String(id);
  const idx = state.cartItems.findIndex((i) => String(i.id) === targetId);
  if (idx !== -1) {
    const it = state.cartItems[idx];
    if (it.qty > 1) {
      it.qty -= 1;
    } else {
      state.cartItems.splice(idx, 1);
    }
  }
  renderCart();
}

function renderCart() {
  const containers = [dom.cartContainer, dom.cartContainerMobile].filter(
    Boolean
  );
  const total = state.cartItems.reduce((sum, it) => sum + it.price * it.qty, 0);
  dom.cartTotal && (dom.cartTotal.textContent = formatPrice(total));
  const emptyHtml = `<div class="text-sm opacity-70">Cart is empty.</div>`;
  const rowsHtml = state.cartItems
    .map(
      (it) => `
      <div class="flex items-center justify-between gap-2 py-2 px-2 rounded ${
        String(it.id) === String(state.lastAddedId) ? "bg-green-100" : ""
      }">
        <div class="flex-1">
          <div class="font-medium">${escapeHtml(it.name)}</div>
          <div class="text-xs opacity-70">${it.qty} × ${formatPrice(
        it.price
      )}</div>
        </div>
        <button class="btn btn-xs btn-error text-white js-remove" data-id="${
          it.id
        }">✕</button>
      </div>`
    )
    .join("");
  containers.forEach((c) => {
    c.innerHTML = state.cartItems.length ? rowsHtml : emptyHtml;
    c.querySelectorAll(".js-remove").forEach((btn) => {
      btn.addEventListener("click", () =>
        removeFromCart(btn.getAttribute("data-id"))
      );
    });
  });
}

// Helpers
function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function initYear() {
  if (dom.year) dom.year.textContent = new Date().getFullYear();
}

function initForm() {
  if (!dom.plantForm) return;
  dom.plantForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(dom.plantForm);
    const name = fd.get("name");
    const email = fd.get("email");
    const count = Number(fd.get("count"));
    alert(
      `Thank you, ${name}! We will contact you at ${email}. Trees: ${count}`
    );
    dom.plantForm.reset();
  });
}

async function init() {
  initYear();
  initForm();
  renderCart();
  await loadCategories();
}

document.addEventListener("DOMContentLoaded", init);
