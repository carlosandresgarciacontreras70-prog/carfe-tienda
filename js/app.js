// ============================================================
//  StepStyle - Zapatería Ecommerce
//  app.js - Lógica completa de la aplicación
// ============================================================

// ===== DATA =====
const PRODUCTS = [
  { id: 1, name: "Air Runner Pro", brand: "Nike", price: 189.99, oldPrice: 249.99, category: "deportivos", emoji: "👟", badge: "sale", rating: 4.8, reviews: 234, stock: 15, sizes: [38,39,40,41,42,43], colors: ["Negro","Blanco","Rojo"], description: "Zapatilla de running de alto rendimiento con tecnología Air Max y suela de goma antideslizante." },
  { id: 2, name: "Classic Oxford", brand: "StepStyle", price: 149.00, category: "formal", emoji: "👞", badge: "new", rating: 4.9, reviews: 189, stock: 8, sizes: [39,40,41,42,43,44], colors: ["Negro","Marrón"], description: "Zapato Oxford clásico de cuero genuino, perfecto para ocasiones formales y ejecutivas." },
  { id: 3, name: "Street Vibe Casual", brand: "Vans", price: 89.99, category: "sneakers", emoji: "👟", badge: "hot", rating: 4.7, reviews: 412, stock: 32, sizes: [36,37,38,39,40,41,42], colors: ["Negro","Blanco","Azul","Rojo"], description: "Sneaker urbano con diseño moderno, ideal para el día a día con máxima comodidad." },
  { id: 4, name: "Elegance Heel", brand: "StepStyle", price: 125.00, category: "mujer", emoji: "👠", badge: "new", rating: 4.6, reviews: 98, stock: 12, sizes: [35,36,37,38,39,40], colors: ["Negro","Nude","Rojo","Dorado"], description: "Tacón elegante de 8cm con plataforma, correa al tobillo y cuero italiano de primera calidad." },
  { id: 5, name: "Terra Boot", brand: "Timberland", price: 215.00, category: "botas", emoji: "🥾", badge: null, rating: 4.9, reviews: 321, stock: 20, sizes: [39,40,41,42,43,44,45], colors: ["Trigo","Marrón","Negro"], description: "Bota resistente al agua con suela de goma y forro interior térmico para clima frío." },
  { id: 6, name: "Slide Wave", brand: "Adidas", price: 55.00, category: "casual", emoji: "🩴", badge: "tiktok", rating: 4.5, reviews: 567, stock: 50, sizes: [36,37,38,39,40,41,42,43], colors: ["Negro","Blanco","Verde","Rosa"], description: "Sandalia deportiva ultraligera con banda ajustable, perfecta para playa y piscina." },
  { id: 7, name: "Urban Sneaker X", brand: "Puma", price: 139.99, oldPrice: 169.99, category: "sneakers", emoji: "👟", badge: "sale", rating: 4.7, reviews: 203, stock: 18, sizes: [38,39,40,41,42,43], colors: ["Blanco","Negro","Gris"], description: "Sneaker urbano de edición limitada con suela chunky y materiales premium reciclados." },
  { id: 8, name: "Ballet Flat", brand: "StepStyle", price: 79.99, category: "mujer", emoji: "🩰", badge: "new", rating: 4.8, reviews: 145, stock: 25, sizes: [35,36,37,38,39,40,41], colors: ["Negro","Nude","Rosa","Rojo"], description: "Bailarina plana de piel genuina con plantilla acolchada para máxima comodidad todo el día." },
  { id: 9, name: "Trail Master", brand: "Salomon", price: 199.00, category: "deportivos", emoji: "🥾", badge: null, rating: 4.9, reviews: 178, stock: 10, sizes: [39,40,41,42,43,44], colors: ["Verde","Gris","Naranja"], description: "Zapatilla de trail running con protección metatarsal y suela Contagrip para máximo agarre." },
  { id: 10, name: "Mule Suede", brand: "StepStyle", price: 95.00, category: "casual", emoji: "👡", badge: "hot", rating: 4.4, reviews: 89, stock: 30, sizes: [35,36,37,38,39,40,41,42], colors: ["Camel","Negro","Vino"], description: "Mule de ante con tacón bajo y punta cuadrada, tendencia de temporada con máximo confort." },
  { id: 11, name: "Derby Executive", brand: "StepStyle", price: 175.00, category: "formal", emoji: "👞", badge: null, rating: 4.8, reviews: 134, stock: 7, sizes: [40,41,42,43,44], colors: ["Negro","Marrón Oscuro"], description: "Zapato Derby de cuero italiano con suela de goma antideslizante, forro de cuero natural." },
  { id: 12, name: "High Top Street", brand: "Converse", price: 85.00, category: "sneakers", emoji: "👟", badge: "tiktok", rating: 4.6, reviews: 892, stock: 45, sizes: [36,37,38,39,40,41,42,43,44], colors: ["Blanco","Negro","Rojo","Azul"], description: "El clásico All Star de caña alta, icono del estilo urbano desde 1917. ¡Un básico del guardarropa!" },
];

const SALES_DATA = [
  { id: "SS-2026-001", client: "María García", email: "maria@email.com", product: "Air Runner Pro", talla: 39, qty: 1, total: 189.99, payMethod: "tarjeta", channel: "web", status: "completado", date: "2026-11-11", notes: "" },
  { id: "SS-2026-002", client: "Carlos López", email: "carlos@email.com", product: "Classic Oxford", talla: 42, qty: 2, total: 298.00, payMethod: "efectivo", channel: "presencial", status: "completado", date: "2026-11-11", notes: "Cliente habitual" },
  { id: "SS-2026-003", client: "Ana Martínez", email: "ana@email.com", product: "Elegance Heel", talla: 37, qty: 1, total: 125.00, payMethod: "tiktok", channel: "tiktok", status: "pendiente", date: "2026-11-10", notes: "Pedido desde live" },
  { id: "SS-2026-004", client: "Luis Rodríguez", email: "luis@email.com", product: "Terra Boot", talla: 43, qty: 1, total: 215.00, payMethod: "transferencia", channel: "web", status: "enviado", date: "2026-11-10", notes: "" },
  { id: "SS-2026-005", client: "Sofia Chen", email: "sofia@email.com", product: "Street Vibe Casual", talla: 38, qty: 2, total: 179.98, payMethod: "paypal", channel: "web", status: "completado", date: "2026-11-09", notes: "" },
  { id: "SS-2026-006", client: "Andrés Peña", email: "andres@email.com", product: "High Top Street", talla: 41, qty: 1, total: 85.00, payMethod: "tiktok", channel: "tiktok", status: "completado", date: "2026-11-09", notes: "Enviado hoy" },
  { id: "SS-2026-007", client: "Valentina Torres", email: "val@email.com", product: "Ballet Flat", talla: 36, qty: 1, total: 79.99, payMethod: "tarjeta", channel: "web", status: "cancelado", date: "2026-11-08", notes: "Cancelado por cliente" },
  { id: "SS-2026-008", client: "Diego Morales", email: "diego@email.com", product: "Urban Sneaker X", talla: 42, qty: 1, total: 139.99, payMethod: "efectivo", channel: "presencial", status: "completado", date: "2026-11-08", notes: "" },
];

const INVOICES_DATA = [
  { id: "FAC-2026-001", client: "María García", email: "maria@email.com", product: "Air Runner Pro", qty: 1, unitPrice: 189.99, tax: 16, status: "pagada", date: "2026-11-11", due: "2026-11-25" },
  { id: "FAC-2026-002", client: "Carlos López", email: "carlos@email.com", product: "Classic Oxford", qty: 2, unitPrice: 149.00, tax: 16, status: "pagada", date: "2026-11-11", due: "2026-11-25" },
  { id: "FAC-2026-003", client: "Ana Martínez", email: "ana@email.com", product: "Elegance Heel", qty: 1, unitPrice: 125.00, tax: 16, status: "pendiente", date: "2026-11-10", due: "2026-11-24" },
  { id: "FAC-2026-004", client: "Luis Rodríguez", email: "luis@email.com", product: "Terra Boot", qty: 1, unitPrice: 215.00, tax: 16, status: "pendiente", date: "2026-11-10", due: "2026-11-24" },
  { id: "FAC-2026-005", client: "Sofia Chen", email: "sofia@email.com", product: "Street Vibe Casual", qty: 2, unitPrice: 89.99, tax: 16, status: "pagada", date: "2026-11-09", due: "2026-11-23" },
  { id: "FAC-2026-006", client: "Jaime Ruiz", email: "jaime@email.com", product: "Terra Boot", qty: 1, unitPrice: 215.00, tax: 16, status: "vencida", date: "2026-10-20", due: "2026-11-03" },
];

// ===== STATE =====
let cart = [];
let currentView = 'tienda';
let filteredProducts = [...PRODUCTS];
let filteredSales = [...SALES_DATA];
let filteredInvoices = [...INVOICES_DATA];
let salesData = [...SALES_DATA];
let invoicesData = [...INVOICES_DATA];
let wishlist = new Set();
let checkoutStep = 1;
let lastOrderData = null;

// TikTok Live State
let isLive = false;
let liveInterval = null;
let liveSeconds = 0;
let liveViewerCount = 0;
let liveSalesCount = 0;
let liveTotalAmount = 0;
let chatMessages = [];
const chatBots = [
  { name: "user_mk23", msg: "¡Qué bonito ese zapato! 👟 cuánto cuesta?" },
  { name: "fashionista99", msg: "¡Los quiero en color negro! #comprar" },
  { name: "sneakerhead_co", msg: "¿Tienen talla 42? 🔥" },
  { name: "compradoras_shop", msg: "¡Ponlo de nuevo! no lo vi bien 😱" },
  { name: "luisa_moda", msg: "Me encantan esos! ¿envían a Medellín?" },
  { name: "pedro_style", msg: "¿Cuántos pares quedan?" },
  { name: "cristina_vip", msg: "¡Compré los de ayer y son hermosos! 💜" },
  { name: "moda_urbana", msg: "¡QUIERO LOS BLANCOS! #comprar" },
  { name: "runner_pro_mx", msg: "¿Son originales? 🤔" },
  { name: "shopaholic_girl", msg: "Esos tacones 😍 ¿talla 37 disponible?" },
];

// ===== NAVIGATION =====
function showView(view) {
  document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
  const el = document.getElementById('view-' + view);
  if (el) {
    el.classList.remove('hidden');
    currentView = view;
  }
  if (view === 'dashboard') initDashboard();
  if (view === 'ventas') renderSalesTable();
  if (view === 'facturas') renderInvoicesTable();
  if (view === 'tiktok') renderLiveProducts();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const isOpen = !sidebar.classList.contains('-translate-x-full');
  if (isOpen) {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
  } else {
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
  }
}

// ===== PRODUCTS =====
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const count = document.getElementById('productCount');
  count.textContent = `(${filteredProducts.length})`;

  if (filteredProducts.length === 0) {
    grid.innerHTML = `<div class="col-span-full text-center py-20 text-gray-400">
      <div class="text-6xl mb-4">🔍</div>
      <div class="text-xl font-semibold">No se encontraron productos</div>
      <div class="text-sm mt-2">Intenta con otros filtros</div>
    </div>`;
    return;
  }

  grid.innerHTML = filteredProducts.map(p => `
    <div class="product-card" onclick="openProductModal(${p.id})">
      <div class="product-img-container">
        <div class="emoji">${p.emoji}</div>
        ${p.badge ? `<span class="product-badge badge-${p.badge}">${getBadgeText(p.badge)}</span>` : ''}
        <button class="wishlist-btn ${wishlist.has(p.id) ? 'active' : ''}" onclick="toggleWishlist(event, ${p.id})">
          <i class="fa${wishlist.has(p.id) ? 's' : 'r'} fa-heart"></i>
        </button>
      </div>
      <div class="p-4">
        <div class="text-xs font-semibold text-purple-500 uppercase tracking-wide mb-1">${p.brand}</div>
        <div class="font-bold text-gray-800 mb-1 leading-tight">${p.name}</div>
        <div class="flex items-center gap-1 mb-2">
          <div class="stars">${'★'.repeat(Math.floor(p.rating))}</div>
          <span class="text-xs text-gray-500">(${p.reviews})</span>
        </div>
        <div class="flex items-center gap-2 mb-3">
          <span class="text-xl font-black text-purple-600">$${p.price.toFixed(2)}</span>
          ${p.oldPrice ? `<span class="text-sm text-gray-400 line-through">$${p.oldPrice.toFixed(2)}</span>
          <span class="text-xs text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-full">-${Math.round((1-p.price/p.oldPrice)*100)}%</span>` : ''}
        </div>
        <div class="text-xs text-gray-400 mb-3">${p.stock > 10 ? '✅ En stock' : p.stock > 0 ? `⚠️ Solo ${p.stock} disponibles` : '❌ Agotado'}</div>
        <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${p.id})">
          <i class="fas fa-shopping-cart mr-1"></i> Agregar al Carrito
        </button>
      </div>
    </div>
  `).join('');
}

function getBadgeText(badge) {
  const map = { new: '✨ NUEVO', sale: '🏷️ OFERTA', hot: '🔥 HOT', tiktok: '♪ TIKTOK' };
  return map[badge] || badge.toUpperCase();
}

function filterCategory(cat) {
  document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active-cat'));
  event.target.classList.add('active-cat');
  filteredProducts = cat === 'all' ? [...PRODUCTS] : PRODUCTS.filter(p => p.category === cat);
  const search = document.getElementById('searchInput').value.toLowerCase();
  if (search) filteredProducts = filteredProducts.filter(p =>
    p.name.toLowerCase().includes(search) || p.brand.toLowerCase().includes(search) || p.category.toLowerCase().includes(search)
  );
  renderProducts();
}

function filterProducts() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  filteredProducts = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(search) || p.brand.toLowerCase().includes(search) || p.category.toLowerCase().includes(search)
  );
  renderProducts();
}

function sortProducts(value) {
  if (value === 'price-low') filteredProducts.sort((a, b) => a.price - b.price);
  else if (value === 'price-high') filteredProducts.sort((a, b) => b.price - a.price);
  else if (value === 'name') filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  else if (value === 'new') filteredProducts.sort((a, b) => (b.badge === 'new') - (a.badge === 'new'));
  else filteredProducts = [...PRODUCTS];
  renderProducts();
}

function openProductModal(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const modal = document.getElementById('productModal');
  const content = document.getElementById('productModalContent');
  content.innerHTML = `
    <div class="relative">
      <button onclick="document.getElementById('productModal').classList.add('hidden'); document.getElementById('productModal').classList.remove('flex')"
        class="absolute top-4 right-4 z-10 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center text-gray-500 hover:text-gray-700">
        <i class="fas fa-times"></i>
      </button>
      <div class="bg-gradient-to-br from-purple-50 to-pink-50 p-12 text-center rounded-t-2xl">
        <div class="text-[120px] leading-none mb-4">${p.emoji}</div>
        ${p.badge ? `<span class="product-badge badge-${p.badge} relative">${getBadgeText(p.badge)}</span>` : ''}
      </div>
      <div class="p-6">
        <div class="text-sm font-bold text-purple-500 uppercase tracking-wide mb-1">${p.brand}</div>
        <h2 class="text-2xl font-black text-gray-800 mb-2">${p.name}</h2>
        <div class="flex items-center gap-2 mb-3">
          <div class="stars text-lg">${'★'.repeat(Math.floor(p.rating))}</div>
          <span class="text-sm text-gray-500">${p.rating} — ${p.reviews} reseñas</span>
        </div>
        <p class="text-gray-600 text-sm mb-4">${p.description}</p>
        <div class="flex items-center gap-3 mb-6">
          <span class="text-3xl font-black text-purple-600">$${p.price.toFixed(2)}</span>
          ${p.oldPrice ? `<span class="text-lg text-gray-400 line-through">$${p.oldPrice.toFixed(2)}</span>` : ''}
        </div>
        <div class="mb-4">
          <div class="font-semibold text-gray-700 mb-2 text-sm">Colores Disponibles</div>
          <div class="flex gap-2 flex-wrap">
            ${p.colors.map((c,i) => `<button onclick="selectColor(this)" class="color-btn px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${i===0?'border-purple-500 bg-purple-50 text-purple-700':'border-gray-200 text-gray-600 hover:border-purple-300'}">${c}</button>`).join('')}
          </div>
        </div>
        <div class="mb-6">
          <div class="font-semibold text-gray-700 mb-2 text-sm">Talla</div>
          <div class="flex gap-2 flex-wrap">
            ${p.sizes.map((s,i) => `<button onclick="selectSize(this)" class="size-btn w-12 h-12 rounded-xl border-2 text-sm font-bold transition-all ${i===0?'border-purple-500 bg-purple-50 text-purple-700':'border-gray-200 text-gray-600 hover:border-purple-300'}">${s}</button>`).join('')}
          </div>
        </div>
        <div class="flex gap-3">
          <button onclick="toggleWishlist2(${p.id})" class="w-14 h-14 border-2 border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-300 transition-all">
            <i class="far fa-heart text-xl"></i>
          </button>
          <button onclick="addToCart(${p.id}); document.getElementById('productModal').classList.add('hidden'); document.getElementById('productModal').classList.remove('flex')" 
            class="flex-1 add-to-cart-btn h-14 text-base">
            <i class="fas fa-shopping-cart mr-2"></i>Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  `;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function selectColor(btn) {
  document.querySelectorAll('.color-btn').forEach(b => b.className = b.className.replace('border-purple-500 bg-purple-50 text-purple-700', 'border-gray-200 text-gray-600 hover:border-purple-300'));
  btn.className = btn.className.replace('border-gray-200 text-gray-600 hover:border-purple-300', 'border-purple-500 bg-purple-50 text-purple-700');
}

function selectSize(btn) {
  document.querySelectorAll('.size-btn').forEach(b => b.className = b.className.replace('border-purple-500 bg-purple-50 text-purple-700', 'border-gray-200 text-gray-600 hover:border-purple-300'));
  btn.className = btn.className.replace('border-gray-200 text-gray-600 hover:border-purple-300', 'border-purple-500 bg-purple-50 text-purple-700');
}

function toggleWishlist(event, id) {
  event.stopPropagation();
  if (wishlist.has(id)) {
    wishlist.delete(id);
    showToast('💔', 'Eliminado', 'Producto removido de favoritos');
  } else {
    wishlist.add(id);
    showToast('❤️', '¡Guardado!', 'Producto agregado a favoritos');
  }
  renderProducts();
}

function toggleWishlist2(id) {
  if (wishlist.has(id)) wishlist.delete(id);
  else wishlist.add(id);
}

// ===== CART =====
function toggleCart() {
  const cart = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  const isOpen = !cart.classList.contains('translate-x-full');
  if (isOpen) {
    cart.classList.add('translate-x-full');
    overlay.classList.add('hidden');
  } else {
    cart.classList.remove('translate-x-full');
    overlay.classList.remove('hidden');
    renderCart();
  }
}

function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartCount();
  showToast('🛒', '¡Agregado!', `${product.name} añadido al carrito`);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
  updateCartCount();
}

function updateCartQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else { renderCart(); updateCartCount(); }
}

function updateCartCount() {
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  document.getElementById('cartCount').textContent = total;
}

function getCartTotal() {
  return cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
}

function renderCart() {
  const container = document.getElementById('cartItems');
  const total = getCartTotal();
  document.getElementById('cartSubtotal').textContent = `$${total.toFixed(2)}`;
  document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;

  if (cart.length === 0) {
    container.innerHTML = `<div class="text-center py-16 text-gray-400">
      <div class="text-5xl mb-4">🛒</div>
      <div class="font-semibold text-gray-500">Tu carrito está vacío</div>
      <div class="text-sm mt-2">Agrega productos para comenzar</div>
    </div>`;
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="flex gap-4 bg-gray-50 rounded-2xl p-4">
      <div class="w-20 h-20 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl flex items-center justify-center flex-shrink-0">
        <span class="text-4xl">${item.emoji}</span>
      </div>
      <div class="flex-1 min-w-0">
        <div class="font-bold text-gray-800 text-sm truncate">${item.name}</div>
        <div class="text-xs text-purple-500 font-semibold">${item.brand}</div>
        <div class="text-purple-600 font-bold mt-1">$${item.price.toFixed(2)}</div>
        <div class="flex items-center gap-3 mt-2">
          <button onclick="updateCartQty(${item.id}, -1)" class="w-7 h-7 rounded-full bg-gray-200 hover:bg-purple-100 flex items-center justify-center font-bold text-gray-600 hover:text-purple-600 transition-colors">-</button>
          <span class="font-bold text-gray-700 w-6 text-center">${item.qty}</span>
          <button onclick="updateCartQty(${item.id}, 1)" class="w-7 h-7 rounded-full bg-gray-200 hover:bg-purple-100 flex items-center justify-center font-bold text-gray-600 hover:text-purple-600 transition-colors">+</button>
          <button onclick="removeFromCart(${item.id})" class="ml-auto text-gray-400 hover:text-red-500 transition-colors"><i class="fas fa-trash text-sm"></i></button>
        </div>
      </div>
    </div>
  `).join('');
}

function checkout() {
  if (cart.length === 0) { showToast('⚠️', 'Carrito vacío', 'Agrega productos antes de pagar'); return; }
  toggleCart();
  checkoutStep = 1;
  document.getElementById('checkoutStep1').classList.remove('hidden');
  document.getElementById('checkoutStep2').classList.add('hidden');
  document.getElementById('checkoutStep3').classList.add('hidden');
  updateCheckoutStepIndicators(1);
  document.getElementById('checkoutModal').classList.remove('hidden');
  document.getElementById('checkoutModal').classList.add('flex');
}

function closeCheckout() {
  document.getElementById('checkoutModal').classList.add('hidden');
  document.getElementById('checkoutModal').classList.remove('flex');
}

function checkoutNextStep(step) {
  checkoutStep = step;
  document.getElementById('checkoutStep1').classList.toggle('hidden', step !== 1);
  document.getElementById('checkoutStep2').classList.toggle('hidden', step !== 2);
  document.getElementById('checkoutStep3').classList.toggle('hidden', step !== 3);
  updateCheckoutStepIndicators(step);

  if (step === 2) {
    const total = getCartTotal();
    document.getElementById('checkoutSubtotal').textContent = `$${total.toFixed(2)}`;
    document.getElementById('checkoutTotal').textContent = `$${total.toFixed(2)}`;
  }
}

function updateCheckoutStepIndicators(step) {
  for (let i = 1; i <= 3; i++) {
    const el = document.getElementById(`step${i}Indicator`);
    if (el) {
      const span = el.querySelector('span');
      if (i <= step) {
        el.classList.remove('text-white/60');
        if (span) span.className = 'w-6 h-6 bg-white text-purple-600 rounded-full flex items-center justify-center font-bold text-xs';
      } else {
        el.classList.add('text-white/60');
        if (span) span.className = 'w-6 h-6 bg-white/20 rounded-full flex items-center justify-center font-bold text-xs';
      }
    }
  }
}

function processPayment() {
  const name = document.getElementById('cName').value.trim();
  const email = document.getElementById('cEmail').value.trim();
  if (!name || !email) { showToast('⚠️', 'Faltan datos', 'Completa nombre y email'); return; }

  const btn = event.target;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Procesando...';
  btn.disabled = true;

  setTimeout(() => {
    const orderNum = `SS-${Date.now().toString().slice(-6)}`;
    const total = getCartTotal();
    const payMethod = document.querySelector('input[name="payMethod"]:checked').value;

    // Register sale
    const newSale = {
      id: orderNum,
      client: `${name} ${document.getElementById('cLastName').value}`,
      email: email,
      product: cart.map(i => i.name).join(', '),
      talla: '-',
      qty: cart.reduce((s,i) => s+i.qty, 0),
      total: total,
      payMethod: payMethod,
      channel: 'web',
      status: 'completado',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    };
    salesData.unshift(newSale);
    filteredSales = [...salesData];

    // Register invoice
    const newInv = {
      id: `FAC-${Date.now().toString().slice(-6)}`,
      client: newSale.client,
      email: email,
      product: newSale.product,
      qty: newSale.qty,
      unitPrice: total / newSale.qty,
      tax: 16,
      status: 'pagada',
      date: new Date().toISOString().split('T')[0],
      due: new Date(Date.now() + 14*24*60*60*1000).toISOString().split('T')[0]
    };
    invoicesData.unshift(newInv);
    filteredInvoices = [...invoicesData];

    lastOrderData = { ...newSale, invoiceId: newInv.id };

    // Confirm
    document.getElementById('orderNumber').textContent = `Pedido #${orderNum}`;
    document.getElementById('confirmName').textContent = newSale.client;
    document.getElementById('confirmEmail').textContent = email;
    document.getElementById('confirmTotal').textContent = `$${total.toFixed(2)}`;

    cart = [];
    updateCartCount();
    checkoutNextStep(3);
    btn.innerHTML = '<i class="fas fa-lock mr-2"></i>Pagar';
    btn.disabled = false;
  }, 2000);
}

function formatCard(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 16);
  input.value = v.replace(/(.{4})/g, '$1 ').trim();
}
function formatExpiry(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 4);
  if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2);
  input.value = v;
}

// ===== DASHBOARD =====
function initDashboard() {
  document.getElementById('dashDate').textContent = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  renderTopProducts();
  renderRecentOrders();
  renderInventoryAlerts();

  setTimeout(() => {
    initSalesChart();
    initChannelChart();
  }, 100);
}

function initSalesChart() {
  const ctx = document.getElementById('salesChart');
  if (!ctx) return;
  if (ctx._chart) ctx._chart.destroy();
  ctx._chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
      datasets: [{
        label: 'Ventas 2026',
        data: [32000,38000,35000,42000,48000,52000,45000,55000,58000,62000,47850,0],
        fill: true,
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124,58,237,0.08)',
        borderWidth: 3,
        pointBackgroundColor: '#7c3aed',
        pointRadius: 5,
        tension: 0.4,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { grid: { color: '#f3f4f6' }, ticks: { callback: v => '$' + (v/1000).toFixed(0) + 'k', font: { size: 11 } } },
        x: { grid: { display: false }, ticks: { font: { size: 11 } } }
      }
    }
  });
}

function initChannelChart() {
  const ctx = document.getElementById('channelChart');
  if (!ctx) return;
  if (ctx._chart) ctx._chart.destroy();
  ctx._chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Tienda Web', 'TikTok Live', 'Presencial'],
      datasets: [{ data: [45, 32, 23], backgroundColor: ['#7c3aed', '#ec4899', '#3b82f6'], borderWidth: 0, hoverOffset: 8 }]
    },
    options: {
      responsive: true,
      cutout: '70%',
      plugins: { legend: { display: false } }
    }
  });
}

function renderTopProducts() {
  const products = [
    { name: 'Air Runner Pro', sold: 234, revenue: 44493, emoji: '👟', progress: 95 },
    { name: 'Street Vibe Casual', sold: 198, revenue: 17820, emoji: '👟', progress: 80 },
    { name: 'Classic Oxford', sold: 156, revenue: 23244, emoji: '👞', progress: 63 },
    { name: 'Terra Boot', sold: 134, revenue: 28810, emoji: '🥾', progress: 54 },
    { name: 'Elegance Heel', sold: 112, revenue: 14000, emoji: '👠', progress: 45 },
  ];

  document.getElementById('topProductsList').innerHTML = products.map(p => `
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl flex items-center justify-center flex-shrink-0">
        <span class="text-2xl">${p.emoji}</span>
      </div>
      <div class="flex-1 min-w-0">
        <div class="font-semibold text-gray-800 text-sm truncate">${p.name}</div>
        <div class="flex items-center gap-2 mt-1">
          <div class="flex-1 bg-gray-100 rounded-full h-1.5">
            <div class="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full" style="width:${p.progress}%"></div>
          </div>
          <span class="text-xs text-gray-500 w-10 text-right">${p.sold}</span>
        </div>
      </div>
      <div class="text-right">
        <div class="font-bold text-gray-800 text-sm">$${(p.revenue/1000).toFixed(1)}k</div>
      </div>
    </div>
  `).join('');
}

function renderRecentOrders() {
  const recent = salesData.slice(0, 5);
  document.getElementById('recentOrdersList').innerHTML = recent.map(s => `
    <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
      <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
        ${s.client.charAt(0)}
      </div>
      <div class="flex-1 min-w-0">
        <div class="font-semibold text-gray-800 text-sm truncate">${s.client}</div>
        <div class="text-xs text-gray-500 truncate">${s.product}</div>
      </div>
      <div class="text-right">
        <div class="font-bold text-purple-600 text-sm">$${s.total.toFixed(2)}</div>
        <span class="status-badge status-${s.status} text-xs">${s.status}</span>
      </div>
    </div>
  `).join('');
}

function renderInventoryAlerts() {
  const lowStock = PRODUCTS.filter(p => p.stock <= 10).slice(0, 4);
  document.getElementById('inventoryAlerts').innerHTML = lowStock.map(p => `
    <div class="bg-white rounded-xl p-4 border border-orange-200 text-center">
      <div class="text-3xl mb-2">${p.emoji}</div>
      <div class="font-bold text-gray-700 text-sm">${p.name}</div>
      <div class="text-orange-600 font-black text-lg mt-1">${p.stock}</div>
      <div class="text-xs text-orange-500">pares restantes</div>
      <button class="mt-2 w-full bg-orange-100 text-orange-600 py-1.5 rounded-lg text-xs font-semibold hover:bg-orange-200 transition-colors">
        Reabastecer
      </button>
    </div>
  `).join('');
}

// ===== SALES =====
function renderSalesTable() {
  const tbody = document.getElementById('salesTableBody');
  if (!tbody) return;

  if (filteredSales.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center py-16 text-gray-400">
      <div class="text-4xl mb-3">📋</div>
      <div class="font-semibold">No hay ventas que mostrar</div>
    </td></tr>`;
    return;
  }

  tbody.innerHTML = filteredSales.map(s => `
    <tr class="border-b border-gray-50 hover:bg-purple-50/30 transition-colors">
      <td class="px-6 py-4 text-sm font-mono font-bold text-purple-600">${s.id}</td>
      <td class="px-6 py-4">
        <div class="font-semibold text-gray-800 text-sm">${s.client}</div>
        <div class="text-xs text-gray-400">${s.email}</div>
      </td>
      <td class="px-6 py-4 text-sm text-gray-600">${s.product} ${s.talla !== '-' ? `(T${s.talla})` : ''}</td>
      <td class="px-6 py-4 text-sm text-gray-500">${s.date}</td>
      <td class="px-6 py-4 font-bold text-gray-800">$${s.total.toFixed(2)}</td>
      <td class="px-6 py-4">
        <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
          ${getPayIcon(s.payMethod)} ${s.payMethod}
        </span>
      </td>
      <td class="px-6 py-4"><span class="status-badge status-${s.status}">${s.status}</span></td>
      <td class="px-6 py-4">
        <div class="flex gap-2">
          <button onclick="viewSaleInvoice('${s.id}')" title="Ver factura" class="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center hover:bg-purple-200 transition-colors text-sm">
            <i class="fas fa-file-invoice"></i>
          </button>
          <button onclick="updateSaleStatus('${s.id}')" title="Cambiar estado" class="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors text-sm">
            <i class="fas fa-sync"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function getPayIcon(method) {
  const icons = { tarjeta: '💳', efectivo: '💵', transferencia: '🏦', tiktok: '♪', paypal: '🅿' };
  return icons[method] || '💰';
}

function filterSales() {
  const search = document.getElementById('salesSearch').value.toLowerCase();
  const status = document.getElementById('salesStatusFilter').value;
  const pay = document.getElementById('salesPayFilter').value;

  filteredSales = salesData.filter(s => {
    const matchSearch = !search || s.client.toLowerCase().includes(search) || s.id.toLowerCase().includes(search) || s.product.toLowerCase().includes(search);
    const matchStatus = !status || s.status === status;
    const matchPay = !pay || s.payMethod === pay;
    return matchSearch && matchStatus && matchPay;
  });
  renderSalesTable();
}

function openNewSaleModal() {
  const sel = document.getElementById('saleProduct');
  sel.innerHTML = '<option value="">Seleccionar producto...</option>' +
    PRODUCTS.map(p => `<option value="${p.name}" data-price="${p.price}">${p.name} — $${p.price}</option>`).join('');
  document.getElementById('newSaleModal').classList.remove('hidden');
  document.getElementById('newSaleModal').classList.add('flex');
}

function closeNewSaleModal() {
  document.getElementById('newSaleModal').classList.add('hidden');
  document.getElementById('newSaleModal').classList.remove('flex');
}

function registerSale() {
  const client = document.getElementById('saleClient').value.trim();
  const email = document.getElementById('saleEmail').value.trim();
  const productName = document.getElementById('saleProduct').value;
  const talla = document.getElementById('saleTalla').value;
  const qty = parseInt(document.getElementById('saleQty').value) || 1;
  const payMethod = document.getElementById('salePayMethod').value;
  const channel = document.getElementById('saleChannel').value;
  const notes = document.getElementById('saleNotes').value;

  if (!client || !productName) { showToast('⚠️', 'Faltan datos', 'Completa los campos obligatorios'); return; }

  const product = PRODUCTS.find(p => p.name === productName);
  const total = product ? product.price * qty : 0;
  const id = `SS-${Date.now().toString().slice(-6)}`;

  const newSale = { id, client, email, product: productName, talla, qty, total, payMethod, channel, status: 'completado', date: new Date().toISOString().split('T')[0], notes };
  salesData.unshift(newSale);
  filteredSales = [...salesData];

  // Auto-create invoice
  invoicesData.unshift({
    id: `FAC-${Date.now().toString().slice(-6)}`,
    client, email, product: productName, qty,
    unitPrice: product ? product.price : total,
    tax: 16, status: 'pagada',
    date: newSale.date,
    due: new Date(Date.now() + 14*24*60*60*1000).toISOString().split('T')[0]
  });
  filteredInvoices = [...invoicesData];

  closeNewSaleModal();
  renderSalesTable();
  showToast('✅', '¡Venta registrada!', `${productName} — $${total.toFixed(2)}`);

  // Clear form
  ['saleClient','saleEmail','saleNotes'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('saleProduct').value = '';
  document.getElementById('saleQty').value = '1';
}

function updateSaleStatus(id) {
  const statuses = ['completado', 'pendiente', 'enviado', 'cancelado'];
  const sale = salesData.find(s => s.id === id);
  if (!sale) return;
  const idx = statuses.indexOf(sale.status);
  sale.status = statuses[(idx + 1) % statuses.length];
  filteredSales = [...salesData];
  renderSalesTable();
  showToast('🔄', 'Estado actualizado', `Pedido ${id}: ${sale.status}`);
}

function viewSaleInvoice(saleId) {
  const sale = salesData.find(s => s.id === saleId);
  if (!sale) return;
  const invoice = {
    id: `FAC-${saleId.split('-').pop()}`,
    client: sale.client, email: sale.email,
    product: sale.product, qty: sale.qty,
    unitPrice: sale.total / sale.qty, tax: 16,
    status: sale.status === 'completado' ? 'pagada' : 'pendiente',
    date: sale.date,
    due: new Date(new Date(sale.date).getTime() + 14*24*60*60*1000).toISOString().split('T')[0]
  };
  showInvoicePreview(invoice);
}

function exportSales() {
  const headers = ['ID','Cliente','Email','Producto','Talla','Cantidad','Total','Pago','Canal','Estado','Fecha'];
  const rows = filteredSales.map(s => [s.id,s.client,s.email,s.product,s.talla,s.qty,`$${s.total.toFixed(2)}`,s.payMethod,s.channel,s.status,s.date]);
  const csv = [headers,...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'ventas-stepstyle.csv'; a.click();
  showToast('📊', 'Exportado', 'Archivo CSV descargado');
}

// ===== TIKTOK LIVE =====
function renderLiveProducts() {
  const container = document.getElementById('liveProductsList');
  if (!container) return;
  container.innerHTML = PRODUCTS.slice(0, 6).map((p,i) => `
    <div class="border-2 ${i===0?'border-purple-500 bg-purple-50':'border-gray-100 hover:border-purple-300'} rounded-xl p-3 cursor-pointer transition-all" onclick="selectLiveProduct(${p.id}, this)">
      <div class="text-4xl text-center mb-2">${p.emoji}</div>
      <div class="text-xs font-bold text-gray-700 text-center truncate">${p.name}</div>
      <div class="text-purple-600 font-black text-sm text-center">$${p.price}</div>
      ${i===0?'<div class="text-xs text-center text-purple-500 font-semibold mt-1">📍 Activo</div>':''}
    </div>
  `).join('');
}

function selectLiveProduct(id, el) {
  document.querySelectorAll('#liveProductsList > div').forEach(d => {
    d.className = d.className.replace('border-purple-500 bg-purple-50', 'border-gray-100');
    const badge = d.querySelector('.text-purple-500');
    if (badge && badge.textContent.includes('Activo')) badge.remove();
  });
  el.className = el.className.replace('border-gray-100', 'border-purple-500 bg-purple-50');
  if (!el.querySelector('.text-purple-500')) {
    el.innerHTML += '<div class="text-xs text-center text-purple-500 font-semibold mt-1">📍 Activo</div>';
  }
  const p = PRODUCTS.find(x => x.id === id);
  if (p) showToast('📍', 'Producto seleccionado', `${p.name} ahora en pantalla`);
}

function connectTikTok() {
  const btn = document.getElementById('tiktokConnectBtn');
  const status = document.getElementById('liveStatus');

  if (isLive) {
    // Disconnect
    isLive = false;
    clearInterval(liveInterval);
    btn.innerHTML = '<i class="fab fa-tiktok mr-2"></i>Iniciar Transmisión Live';
    btn.className = btn.className.replace('from-red-600 to-orange-500', 'from-pink-500 to-red-500');
    status.innerHTML = '<span class="w-2 h-2 bg-gray-400 rounded-full"></span><span class="text-sm font-semibold text-gray-600">Desconectado</span>';
    status.className = 'flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full';
    showToast('📴', 'Live terminado', `Total recaudado: $${liveTotalAmount.toFixed(2)}`);
  } else {
    // Connect
    isLive = true;
    liveSeconds = 0;
    liveViewerCount = Math.floor(Math.random() * 500) + 200;
    liveSalesCount = 0;
    liveTotalAmount = 0;

    btn.innerHTML = '<i class="fas fa-stop-circle mr-2"></i>Detener Transmisión';
    btn.className = btn.className.replace('from-pink-500 to-red-500', 'from-red-600 to-orange-500');
    status.innerHTML = '<span class="w-2 h-2 bg-red-500 rounded-full live-dot"></span><span class="text-sm font-semibold text-red-600">🔴 EN VIVO</span>';
    status.className = 'flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full border border-red-200';

    showToast('🔴', '¡Live iniciado!', `${document.getElementById('tiktokUser').value}`);
    addChatMessage('Sistema', '🔴 Transmisión iniciada. ¡Bienvenidos al Live de StepStyle!', true);

    liveInterval = setInterval(() => {
      liveSeconds++;
      updateLiveStats();
      if (Math.random() < 0.4) addRandomChatMessage();
      if (Math.random() < 0.15) addLiveOrder();
    }, 1500);
  }
}

function updateLiveStats() {
  liveViewerCount += Math.floor((Math.random() - 0.3) * 20);
  if (liveViewerCount < 50) liveViewerCount = 50;

  const h = Math.floor(liveSeconds / 3600).toString().padStart(2,'0');
  const m = Math.floor((liveSeconds % 3600) / 60).toString().padStart(2,'0');
  const s = (liveSeconds % 60).toString().padStart(2,'0');

  document.getElementById('liveViewers').textContent = liveViewerCount.toLocaleString();
  document.getElementById('liveSales').textContent = liveSalesCount;
  document.getElementById('liveDuration').textContent = `${h}:${m}:${s}`;
  document.getElementById('liveTotalAmount').textContent = `$${liveTotalAmount.toFixed(2)}`;
  document.getElementById('livePairsSold').textContent = liveSalesCount;
}

function addRandomChatMessage() {
  const bot = chatBots[Math.floor(Math.random() * chatBots.length)];
  addChatMessage(bot.name, bot.msg, false);
}

function addChatMessage(user, msg, isSystem) {
  const chat = document.getElementById('liveChat');
  const isCompra = msg.includes('#comprar');
  const div = document.createElement('div');
  div.className = `text-xs p-2 rounded-lg ${isSystem ? 'bg-purple-100 text-purple-700' : isCompra ? 'bg-green-50 border border-green-200' : 'bg-white border border-gray-100'}`;
  div.innerHTML = `<span class="font-bold ${isSystem ? 'text-purple-600' : isCompra ? 'text-green-700' : 'text-gray-700'}">${user}: </span>
    <span class="${isCompra ? 'text-green-700 font-semibold' : 'text-gray-600'}">${msg}</span>`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;

  chatMessages.push({ user, msg });
  document.getElementById('chatBadge').textContent = `${chatMessages.length} mensajes`;

  if (isCompra && isLive) setTimeout(() => addLiveOrder(user), 500);
}

function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;
  addChatMessage('Admin 👑', msg, false);
  input.value = '';
}

function addLiveOrder(user) {
  const p = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
  const talla = p.sizes[Math.floor(Math.random() * p.sizes.length)];
  const username = user || chatBots[Math.floor(Math.random() * chatBots.length)].name;

  liveSalesCount++;
  liveTotalAmount += p.price;

  const container = document.getElementById('liveOrders');
  const placeholder = container.querySelector('p');
  if (placeholder) placeholder.remove();

  const div = document.createElement('div');
  div.className = 'flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-3 animate-pulse';
  div.style.animation = 'fadeIn 0.3s ease';
  div.innerHTML = `
    <span class="text-2xl">${p.emoji}</span>
    <div class="flex-1 min-w-0">
      <div class="text-xs font-bold text-gray-700 truncate">${p.name}</div>
      <div class="text-xs text-gray-500">@${username} • T${talla}</div>
    </div>
    <div class="text-green-700 font-black text-sm">$${p.price}</div>
  `;
  container.insertBefore(div, container.firstChild);
  if (container.children.length > 8) container.lastChild.remove();
  setTimeout(() => div.className = div.className.replace('animate-pulse', ''), 2000);

  // Register sale
  salesData.unshift({
    id: `TK-${Date.now().toString().slice(-6)}`,
    client: `@${username}`, email: `${username}@tiktok.com`,
    product: p.name, talla, qty: 1, total: p.price,
    payMethod: 'tiktok', channel: 'tiktok', status: 'pendiente',
    date: new Date().toISOString().split('T')[0], notes: 'Pedido desde TikTok Live'
  });
  filteredSales = [...salesData];

  showToast('🛒', '¡Venta Live!', `@${username} compró ${p.name}`);
}

// ===== INVOICES =====
function renderInvoicesTable() {
  const tbody = document.getElementById('invoicesTableBody');
  if (!tbody) return;

  if (filteredInvoices.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-center py-16 text-gray-400">
      <div class="text-4xl mb-3">📄</div>
      <div class="font-semibold">No hay facturas</div>
    </td></tr>`;
    return;
  }

  tbody.innerHTML = filteredInvoices.map(inv => {
    const subtotal = inv.unitPrice * inv.qty;
    const taxAmt = subtotal * inv.tax / 100;
    const total = subtotal + taxAmt;
    return `
      <tr class="border-b border-gray-50 hover:bg-purple-50/30 transition-colors">
        <td class="px-6 py-4 font-mono font-bold text-purple-600 text-sm">${inv.id}</td>
        <td class="px-6 py-4">
          <div class="font-semibold text-gray-800 text-sm">${inv.client}</div>
          <div class="text-xs text-gray-400">${inv.email}</div>
        </td>
        <td class="px-6 py-4 text-sm text-gray-500">${inv.date}</td>
        <td class="px-6 py-4 text-sm ${inv.status==='vencida'?'text-red-500 font-semibold':'text-gray-500'}">${inv.due}</td>
        <td class="px-6 py-4 text-sm text-gray-700">$${subtotal.toFixed(2)}</td>
        <td class="px-6 py-4 text-sm text-gray-500">${inv.tax}%</td>
        <td class="px-6 py-4 font-black text-gray-800">$${total.toFixed(2)}</td>
        <td class="px-6 py-4"><span class="status-badge status-${inv.status==='pagada'?'completado':inv.status==='vencida'?'cancelado':'pendiente'}">${inv.status}</span></td>
        <td class="px-6 py-4">
          <div class="flex gap-2">
            <button onclick="showInvoicePreview(${JSON.stringify(inv).replace(/"/g,"'")})" title="Ver" class="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center hover:bg-purple-200 transition-colors text-sm">
              <i class="fas fa-eye"></i>
            </button>
            <button onclick="printInvoiceById('${inv.id}')" title="Imprimir" class="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center hover:bg-green-200 transition-colors text-sm">
              <i class="fas fa-print"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function filterInvoices() {
  const search = document.getElementById('invoiceSearch').value.toLowerCase();
  const status = document.getElementById('invoiceStatusFilter').value;
  filteredInvoices = invoicesData.filter(inv => {
    const matchSearch = !search || inv.client.toLowerCase().includes(search) || inv.id.toLowerCase().includes(search);
    const matchStatus = !status || inv.status === status;
    return matchSearch && matchStatus;
  });
  renderInvoicesTable();
}

function openInvoiceModal() {
  const sel = document.getElementById('invProduct');
  sel.innerHTML = '<option value="">Seleccionar...</option>' +
    PRODUCTS.map(p => `<option value="${p.name}" data-price="${p.price}">${p.name} — $${p.price}</option>`).join('');
  document.getElementById('newInvoiceModal').classList.remove('hidden');
  document.getElementById('newInvoiceModal').classList.add('flex');
}

function closeInvoiceModal() {
  document.getElementById('newInvoiceModal').classList.add('hidden');
  document.getElementById('newInvoiceModal').classList.remove('flex');
}

function createInvoice() {
  const client = document.getElementById('invClient').value.trim();
  const email = document.getElementById('invEmail').value.trim();
  const productName = document.getElementById('invProduct').value;
  const qty = parseInt(document.getElementById('invQty').value) || 1;
  const tax = parseInt(document.getElementById('invTax').value) || 16;

  if (!client || !productName) { showToast('⚠️', 'Faltan datos', 'Completa todos los campos'); return; }

  const product = PRODUCTS.find(p => p.name === productName);
  const inv = {
    id: `FAC-${Date.now().toString().slice(-6)}`,
    client, email, product: productName, qty,
    unitPrice: product ? product.price : 0,
    tax, status: 'pendiente',
    date: new Date().toISOString().split('T')[0],
    due: new Date(Date.now() + 14*24*60*60*1000).toISOString().split('T')[0]
  };

  invoicesData.unshift(inv);
  filteredInvoices = [...invoicesData];
  closeInvoiceModal();
  renderInvoicesTable();
  showToast('📄', '¡Factura creada!', `${inv.id} — ${client}`);
  setTimeout(() => showInvoicePreview(inv), 300);
}

function showInvoicePreview(inv) {
  if (typeof inv === 'string') inv = JSON.parse(inv);
  const subtotal = inv.unitPrice * inv.qty;
  const taxAmt = subtotal * inv.tax / 100;
  const total = subtotal + taxAmt;

  document.getElementById('invoiceContent').innerHTML = `
    <div class="invoice-header p-8 text-white rounded-t-xl">
      <div class="flex justify-between items-start">
        <div>
          <div class="text-3xl font-black mb-1">👟 StepStyle</div>
          <div class="text-purple-100">Zapatos Premium</div>
          <div class="text-purple-200 text-sm mt-2">
            <div>Calle Principal 123</div>
            <div>Ciudad, País</div>
            <div>Tel: +1 555 000 0000</div>
            <div>contacto@stepstyle.com</div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-4xl font-black">FACTURA</div>
          <div class="text-purple-100 text-lg font-bold">${inv.id}</div>
          <div class="mt-4 text-sm text-purple-200">
            <div>Fecha: ${inv.date}</div>
            <div>Vence: ${inv.due}</div>
            <div class="mt-2 font-bold ${inv.status==='pagada'?'text-green-300':'text-yellow-300'} text-base uppercase tracking-wide">● ${inv.status}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-8 bg-white">
      <!-- Cliente -->
      <div class="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-100">
        <div class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Facturar a:</div>
        <div class="font-black text-gray-800 text-lg">${inv.client}</div>
        <div class="text-gray-500 text-sm">${inv.email}</div>
      </div>
      <!-- Products Table -->
      <table class="w-full invoice-table mb-6 rounded-xl overflow-hidden border border-gray-100">
        <thead>
          <tr class="text-left text-sm text-gray-600">
            <th class="px-4 py-3">Descripción</th>
            <th class="px-4 py-3 text-center">Cant.</th>
            <th class="px-4 py-3 text-right">Precio Unit.</th>
            <th class="px-4 py-3 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="px-4 py-3">
              <div class="font-semibold text-gray-800">${inv.product}</div>
              <div class="text-sm text-gray-500">Calzado Premium — StepStyle</div>
            </td>
            <td class="px-4 py-3 text-center text-gray-700">${inv.qty}</td>
            <td class="px-4 py-3 text-right text-gray-700">$${inv.unitPrice.toFixed(2)}</td>
            <td class="px-4 py-3 text-right font-semibold text-gray-800">$${subtotal.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      <!-- Totals -->
      <div class="flex justify-end mb-8">
        <div class="w-72 space-y-2">
          <div class="flex justify-between text-sm text-gray-600 py-2 border-b border-gray-100">
            <span>Subtotal</span><span>$${subtotal.toFixed(2)}</span>
          </div>
          <div class="flex justify-between text-sm text-gray-600 py-2 border-b border-gray-100">
            <span>IVA (${inv.tax}%)</span><span>$${taxAmt.toFixed(2)}</span>
          </div>
          <div class="flex justify-between font-black text-lg text-gray-800 py-3 border-t-2 border-gray-200">
            <span>TOTAL</span>
            <span class="text-purple-600">$${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <!-- Footer -->
      <div class="border-t border-gray-100 pt-6 grid grid-cols-2 gap-6">
        <div>
          <div class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Datos Bancarios</div>
          <div class="text-sm text-gray-600 space-y-1">
            <div>Banco: Banco Nacional</div>
            <div>Cuenta: 1234-5678-9012-3456</div>
            <div>Titular: StepStyle S.A.</div>
            <div>CLABE/SWIFT: BNKXMX001234</div>
          </div>
        </div>
        <div>
          <div class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Notas</div>
          <div class="text-sm text-gray-500">
            Gracias por su compra. Esta factura es válida como comprobante fiscal. 
            Para consultas: contacto@stepstyle.com
          </div>
        </div>
      </div>
      <div class="mt-6 text-center text-xs text-gray-400 border-t border-gray-100 pt-4">
        <strong>StepStyle</strong> — Zapatos Premium | www.stepstyle.com | @stepstyle_zapatos
      </div>
    </div>
  `;

  document.getElementById('invoicePrintModal').classList.remove('hidden');
  document.getElementById('invoicePrintModal').classList.add('flex');
}

function printInvoice() {
  window.print();
}

function printInvoiceById(id) {
  const inv = invoicesData.find(i => i.id === id);
  if (inv) showInvoicePreview(inv);
}

function generateInvoiceFromOrder() {
  if (!lastOrderData) return;
  showInvoicePreview({
    id: lastOrderData.invoiceId || `FAC-${Date.now().toString().slice(-6)}`,
    client: lastOrderData.client,
    email: lastOrderData.email,
    product: lastOrderData.product,
    qty: lastOrderData.qty,
    unitPrice: lastOrderData.total / lastOrderData.qty,
    tax: 16,
    status: 'pagada',
    date: lastOrderData.date,
    due: new Date(Date.now() + 14*24*60*60*1000).toISOString().split('T')[0]
  });
  showView('facturas');
}

// ===== TOAST =====
function showToast(icon, title, msg, duration = 3500) {
  document.getElementById('toastIcon').textContent = icon;
  document.getElementById('toastTitle').textContent = title;
  document.getElementById('toastMsg').textContent = msg;
  const toast = document.getElementById('toast');
  toast.classList.remove('hidden');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.add('hidden'), duration);
}

// ===== POPULATE SALE PRODUCT SELECTS =====
function populateProductSelects() {
  ['saleProduct', 'invProduct'].forEach(selId => {
    const sel = document.getElementById(selId);
    if (sel) {
      sel.innerHTML = '<option value="">Seleccionar producto...</option>' +
        PRODUCTS.map(p => `<option value="${p.name}" data-price="${p.price}">${p.name} — $${p.price}</option>`).join('');
    }
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  populateProductSelects();

  // Close modals on overlay click
  document.getElementById('productModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('productModal')) {
      document.getElementById('productModal').classList.add('hidden');
      document.getElementById('productModal').classList.remove('flex');
    }
  });

  // Initial toast
  setTimeout(() => showToast('👟', '¡Bienvenido a StepStyle!', 'Tu tienda de zapatos premium', 4000), 800);
});
