// ============================================================
//  StepStyle — features.js
//  Nuevas funcionalidades: Inventario, Productos con cámara,
//  Catálogo WhatsApp, Marketing, Notificaciones en tiempo real
// ============================================================

// ===== OVERRIDE showView to handle new views =====
const _origShowView = showView;
showView = function(view) {
  _origShowView(view);
  if (view === 'inventario')  initInventory();
  if (view === 'productos')   initProductsView();
  if (view === 'catalogo')    initCatalog();
  if (view === 'marketing')   initMarketing();
};

// ===== NOTIFICATION SYSTEM =====
let notifications = [];
let unreadNotifications = 0;
let notifDropdownOpen = false;

function addNotification(icon, title, msg, type = 'order') {
  const n = {
    id: Date.now(),
    icon, title, msg, type,
    time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    read: false
  };
  notifications.unshift(n);
  unreadNotifications++;
  renderNotifBadge();
  renderNotifList();
  // Flash the bell
  const bell = document.querySelector('[onclick="toggleNotifications()"]');
  if (bell) {
    bell.classList.add('animate-bounce');
    setTimeout(() => bell.classList.remove('animate-bounce'), 2000);
  }
}

function renderNotifBadge() {
  const badge = document.getElementById('notifBadge');
  if (!badge) return;
  if (unreadNotifications > 0) {
    badge.textContent = unreadNotifications > 9 ? '9+' : unreadNotifications;
    badge.classList.remove('hidden');
    badge.classList.add('flex');
  } else {
    badge.classList.add('hidden');
    badge.classList.remove('flex');
  }
}

function renderNotifList() {
  const list = document.getElementById('notifList');
  if (!list) return;
  if (notifications.length === 0) {
    list.innerHTML = `<div class="p-8 text-center text-gray-400">
      <div class="text-4xl mb-3">🔔</div>
      <div class="font-semibold">Sin notificaciones</div>
    </div>`;
    return;
  }
  const typeColors = {
    order: 'bg-purple-100 text-purple-600',
    stock: 'bg-orange-100 text-orange-600',
    payment: 'bg-green-100 text-green-600',
    tiktok: 'bg-pink-100 text-pink-600',
    info: 'bg-blue-100 text-blue-600'
  };
  list.innerHTML = notifications.slice(0, 15).map(n => `
    <div onclick="markRead(${n.id})" class="flex gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors ${n.read ? 'opacity-60' : ''}">
      <div class="w-10 h-10 ${typeColors[n.type] || typeColors.info} rounded-xl flex items-center justify-center flex-shrink-0 text-lg">
        ${n.icon}
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <div class="font-bold text-gray-800 text-sm truncate">${n.title}</div>
          ${!n.read ? '<span class="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></span>' : ''}
        </div>
        <div class="text-xs text-gray-500 truncate">${n.msg}</div>
        <div class="text-xs text-gray-400 mt-0.5">${n.time}</div>
      </div>
    </div>
  `).join('');
}

function markRead(id) {
  const n = notifications.find(x => x.id === id);
  if (n && !n.read) {
    n.read = true;
    unreadNotifications = Math.max(0, unreadNotifications - 1);
    renderNotifBadge();
    renderNotifList();
  }
}

function markAllRead() {
  notifications.forEach(n => n.read = true);
  unreadNotifications = 0;
  renderNotifBadge();
  renderNotifList();
}

function toggleNotifications() {
  const dropdown = document.getElementById('notifDropdown');
  if (!dropdown) return;
  notifDropdownOpen = !notifDropdownOpen;
  dropdown.classList.toggle('hidden', !notifDropdownOpen);
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('notifDropdown');
  const btn = e.target.closest('[onclick="toggleNotifications()"]');
  if (!btn && dropdown && !dropdown.contains(e.target)) {
    dropdown.classList.add('hidden');
    notifDropdownOpen = false;
  }
});

// ===== HOOK INTO EXISTING CHECKOUT / SALE REGISTRATION =====
// Intercept registerSale to send notification
const _origRegisterSale = window.registerSale;
window.registerSale = function() {
  _origRegisterSale.call(this);
  const client = document.getElementById('saleClient')?.value?.trim();
  const product = document.getElementById('saleProduct')?.value;
  if (client && product) {
    addNotification('🛒', '¡Nuevo Pedido!', `${client} compró ${product}`, 'order');
  }
};

// Intercept processPayment to send notification
const _origProcessPayment = window.processPayment;
window.processPayment = function() {
  const name = document.getElementById('cName')?.value?.trim();
  const origFn = _origProcessPayment;
  origFn.call(this);
  setTimeout(() => {
    const total = document.getElementById('confirmTotal')?.textContent;
    if (total) {
      addNotification('💳', '¡Pago Recibido!', `${name || 'Cliente'} pagó ${total}`, 'payment');
    }
  }, 2200);
};

// ===== INVENTORY =====
let inventoryData = [];
let filteredInventory = [];

function buildInventory() {
  if (inventoryData.length > 0) return;
  const allProds = [...PRODUCTS, ...(window.customProducts || [])];
  inventoryData = allProds.map(p => ({
    ...p,
    sku: `SS-${String(p.id).padStart(4, '0')}`,
    stockBySizes: Object.fromEntries(p.sizes.map(s => [s, Math.floor(Math.random() * 18) + 2])),
    totalStock: p.stock,
    reorderPoint: 5,
    supplier: 'Proveedor Principal S.A.',
    location: 'Bodega A',
    lastUpdated: new Date().toISOString().split('T')[0]
  }));
  filteredInventory = [...inventoryData];
}

function initInventory() {
  buildInventory();
  updateInventoryKPIs();
  renderInventoryTable();
  checkLowStockAlerts();
}

function updateInventoryKPIs() {
  const totalUnits = inventoryData.reduce((s, p) => s + p.totalStock, 0);
  const lowStock = inventoryData.filter(p => p.totalStock <= 10 && p.totalStock > 0).length;
  const totalValue = inventoryData.reduce((s, p) => s + p.totalStock * p.price, 0);
  document.getElementById('invTotalProducts').textContent = inventoryData.length;
  document.getElementById('invTotalUnits').textContent = totalUnits.toLocaleString();
  document.getElementById('invLowStock').textContent = lowStock;
  document.getElementById('invTotalValue').textContent = '$' + (totalValue / 1000).toFixed(1) + 'k';
}

function checkLowStockAlerts() {
  const low = inventoryData.filter(p => p.totalStock <= 5 && p.totalStock > 0);
  const banner = document.getElementById('lowStockBanner');
  if (!banner) return;
  if (low.length > 0) {
    banner.classList.remove('hidden');
    banner.classList.add('flex');
    document.getElementById('lowStockText').textContent =
      `${low.length} producto(s) con stock crítico: ${low.map(p => p.name).join(', ')}`;
    low.forEach(p => addNotification('⚠️', 'Stock Bajo', `${p.name} tiene solo ${p.totalStock} unidades`, 'stock'));
  } else {
    banner.classList.add('hidden');
  }
}

function renderInventoryTable() {
  const tbody = document.getElementById('inventoryTableBody');
  if (!tbody) return;
  if (filteredInventory.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center py-16 text-gray-400">
      <div class="text-4xl mb-3">📦</div><div class="font-semibold">Sin productos en inventario</div>
    </td></tr>`;
    return;
  }
  tbody.innerHTML = filteredInventory.map(p => {
    const stockStatus = p.totalStock === 0 ? 'agotado' : p.totalStock <= 5 ? 'critico' : p.totalStock <= 10 ? 'bajo' : 'ok';
    const statusClass = { ok: 'text-green-600 bg-green-50', bajo: 'text-orange-600 bg-orange-50', critico: 'text-red-600 bg-red-50', agotado: 'text-gray-600 bg-gray-100' };
    const statusLabel = { ok: '✅ OK', bajo: '⚠️ Bajo', critico: '🚨 Crítico', agotado: '❌ Agotado' };
    const topSizes = Object.entries(p.stockBySizes || {}).slice(0, 3).map(([s, q]) =>
      `<span class="inline-flex items-center gap-1 text-xs bg-gray-100 rounded px-2 py-0.5 font-mono">${s}<span class="text-purple-600 font-bold">${q}</span></span>`
    ).join('');
    return `
      <tr class="border-b border-gray-50 hover:bg-purple-50/30 transition-colors">
        <td class="px-5 py-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl flex items-center justify-center text-2xl">${p.photoData ? `<img src="${p.photoData}" class="w-12 h-12 object-cover rounded-xl">` : p.emoji}</div>
            <div>
              <div class="font-bold text-gray-800 text-sm">${p.name}</div>
              <div class="text-xs text-purple-500">${p.brand}</div>
            </div>
          </div>
        </td>
        <td class="px-5 py-4 font-mono text-xs text-gray-500">${p.sku}</td>
        <td class="px-5 py-4 text-sm text-gray-600 capitalize">${p.category}</td>
        <td class="px-5 py-4">
          <div class="font-black text-2xl ${p.totalStock <= 5 ? 'text-red-500' : p.totalStock <= 10 ? 'text-orange-500' : 'text-gray-800'}">${p.totalStock}</div>
          <div class="w-24 bg-gray-100 rounded-full h-1.5 mt-1">
            <div class="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full" style="width:${Math.min(100,(p.totalStock/50)*100)}%"></div>
          </div>
        </td>
        <td class="px-5 py-4"><div class="flex flex-wrap gap-1">${topSizes}</div></td>
        <td class="px-5 py-4 font-semibold text-gray-800">$${p.price.toFixed(2)}</td>
        <td class="px-5 py-4">
          <span class="px-3 py-1 rounded-full text-xs font-bold ${statusClass[stockStatus]}">${statusLabel[stockStatus]}</span>
        </td>
        <td class="px-5 py-4">
          <div class="flex gap-2">
            <button onclick="quickAddStock('${p.id}')" title="Agregar stock" class="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center hover:bg-purple-200 transition-colors text-sm">
              <i class="fas fa-plus"></i>
            </button>
            <button onclick="quickSubStock('${p.id}')" title="Reducir stock" class="w-8 h-8 bg-red-100 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-200 transition-colors text-sm">
              <i class="fas fa-minus"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function filterInventory() {
  const search = document.getElementById('invSearch')?.value.toLowerCase() || '';
  const cat = document.getElementById('invCatFilter')?.value || '';
  const stock = document.getElementById('invStockFilter')?.value || '';
  filteredInventory = inventoryData.filter(p => {
    const ms = !search || p.name.toLowerCase().includes(search) || p.brand.toLowerCase().includes(search) || p.sku.toLowerCase().includes(search);
    const mc = !cat || p.category === cat;
    const mst = !stock ||
      (stock === 'low' && p.totalStock <= 5 && p.totalStock > 0) ||
      (stock === 'ok' && p.totalStock > 10) ||
      (stock === 'out' && p.totalStock === 0);
    return ms && mc && mst;
  });
  renderInventoryTable();
}

function quickAddStock(id) {
  const item = inventoryData.find(p => String(p.id) === String(id));
  if (!item) return;
  item.totalStock += 10;
  item.lastUpdated = new Date().toISOString().split('T')[0];
  filteredInventory = [...inventoryData];
  updateInventoryKPIs();
  renderInventoryTable();
  showToast('📦', 'Stock actualizado', `+10 unidades a ${item.name}`);
}

function quickSubStock(id) {
  const item = inventoryData.find(p => String(p.id) === String(id));
  if (!item || item.totalStock <= 0) return;
  item.totalStock = Math.max(0, item.totalStock - 1);
  item.lastUpdated = new Date().toISOString().split('T')[0];
  filteredInventory = [...inventoryData];
  updateInventoryKPIs();
  renderInventoryTable();
  if (item.totalStock <= 5) {
    addNotification('⚠️', 'Stock Bajo', `${item.name} tiene ${item.totalStock} unidades`, 'stock');
  }
}

function openAddStockModal() {
  buildInventory();
  const sel = document.getElementById('stockProduct');
  if (sel) {
    sel.innerHTML = inventoryData.map(p => `<option value="${p.id}">${p.name} — Stock: ${p.totalStock}</option>`).join('');
  }
  document.getElementById('addStockModal').classList.remove('hidden');
  document.getElementById('addStockModal').classList.add('flex');
}

function closeAddStockModal() {
  document.getElementById('addStockModal').classList.add('hidden');
  document.getElementById('addStockModal').classList.remove('flex');
}

function addStock() {
  const id = document.getElementById('stockProduct').value;
  const size = document.getElementById('stockSize').value;
  const qty = parseInt(document.getElementById('stockQty').value) || 10;
  const notes = document.getElementById('stockNotes').value;
  const item = inventoryData.find(p => String(p.id) === String(id));
  if (!item) return;
  item.totalStock += qty;
  if (item.stockBySizes) item.stockBySizes[size] = (item.stockBySizes[size] || 0) + qty;
  item.lastUpdated = new Date().toISOString().split('T')[0];
  filteredInventory = [...inventoryData];
  updateInventoryKPIs();
  renderInventoryTable();
  closeAddStockModal();
  showToast('📦', 'Stock agregado', `+${qty} de ${item.name} talla ${size}`);
  addNotification('📦', 'Stock Reabastecido', `+${qty} unidades de ${item.name}`, 'stock');
}

function exportInventory() {
  const headers = ['SKU','Producto','Marca','Categoría','Stock Total','Precio','Valor Total'];
  const rows = inventoryData.map(p => [p.sku, p.name, p.brand, p.category, p.totalStock, `$${p.price}`, `$${(p.totalStock * p.price).toFixed(2)}`]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'inventario-stepstyle.csv'; a.click();
  showToast('📊', 'Inventario exportado', 'Archivo CSV descargado');
}

// ===== PRODUCT CREATION WITH CAMERA =====
window.customProducts = [];
let selectedEmoji = '👟';
let productPhotoData = null;
let cameraStream = null;

function initProductsView() {
  renderAllProductsGrid();
  updateAllProductsCount();
  // Live preview bindings
  ['newProdName','newProdBrand','newProdPrice'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateProductPreview);
  });
}

function updateProductPreview() {
  const name = document.getElementById('newProdName')?.value || 'Nombre del Producto';
  const brand = document.getElementById('newProdBrand')?.value || 'Marca';
  const price = parseFloat(document.getElementById('newProdPrice')?.value) || 0;
  if (document.getElementById('prevName')) document.getElementById('prevName').textContent = name;
  if (document.getElementById('prevBrand')) document.getElementById('prevBrand').textContent = brand;
  if (document.getElementById('prevPrice')) document.getElementById('prevPrice').textContent = `$${price.toFixed(2)}`;
}

function toggleSizeNew(btn, size) {
  const isActive = btn.classList.contains('border-purple-500');
  if (isActive) {
    btn.className = btn.className.replace('border-purple-500 bg-purple-50 text-purple-700', 'border-gray-200 text-gray-500 hover:border-purple-400');
  } else {
    btn.className = btn.className.replace('border-gray-200 text-gray-500 hover:border-purple-400', 'border-purple-500 bg-purple-50 text-purple-700');
  }
}

function selectEmoji(btn, emoji) {
  document.querySelectorAll('.emoji-pick-btn').forEach(b => {
    b.className = b.className.replace('border-purple-400 bg-purple-50', 'border-transparent');
  });
  btn.className = btn.className.replace('border-transparent', 'border-purple-400 bg-purple-50');
  selectedEmoji = emoji;
  productPhotoData = null;
  // Update preview
  const prevEmoji = document.getElementById('prevEmoji');
  const prevPhoto = document.getElementById('prevPhoto');
  const photoEl = document.getElementById('productPhotoPreview');
  if (prevEmoji) { prevEmoji.textContent = emoji; prevEmoji.classList.remove('hidden'); }
  if (prevPhoto) prevPhoto.classList.add('hidden');
  if (photoEl) photoEl.classList.add('hidden');
  const ph = document.getElementById('photoEmojiPreview');
  const placeholder = document.getElementById('photoPlaceholder');
  if (ph) { ph.classList.remove('hidden'); document.getElementById('photoEmoji').textContent = emoji; }
  if (placeholder) placeholder.classList.add('hidden');
}

async function openCamera() {
  const section = document.getElementById('cameraSection');
  const video = document.getElementById('cameraVideo');
  if (!section || !video) return;
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } });
    video.srcObject = cameraStream;
    section.classList.remove('hidden');
    showToast('📷', 'Cámara activa', 'Enfoca el zapato y toca Capturar');
  } catch (err) {
    showToast('⚠️', 'Sin acceso a cámara', 'Usa la opción de subir imagen');
    document.getElementById('photoFileInput').click();
  }
}

function capturePhoto() {
  const video = document.getElementById('cameraVideo');
  const canvas = document.getElementById('photoCanvas');
  if (!video || !canvas) return;
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0);
  productPhotoData = canvas.toDataURL('image/jpeg', 0.9);
  applyPhotoToPreview(productPhotoData);
  stopCamera();
  showToast('📸', '¡Foto tomada!', 'Foto del producto capturada');
}

function stopCamera() {
  if (cameraStream) { cameraStream.getTracks().forEach(t => t.stop()); cameraStream = null; }
  const section = document.getElementById('cameraSection');
  if (section) section.classList.add('hidden');
}

function handlePhotoUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (file.size > 10 * 1024 * 1024) { showToast('⚠️', 'Archivo muy grande', 'Máximo 10MB'); return; }
  const reader = new FileReader();
  reader.onload = (e) => {
    productPhotoData = e.target.result;
    applyPhotoToPreview(productPhotoData);
    showToast('🖼️', 'Imagen cargada', file.name);
  };
  reader.readAsDataURL(file);
}

function applyPhotoToPreview(dataUrl) {
  const photoEl = document.getElementById('productPhotoPreview');
  const placeholder = document.getElementById('photoPlaceholder');
  const emojiPrev = document.getElementById('photoEmojiPreview');
  const prevPhoto = document.getElementById('prevPhoto');
  const prevEmoji = document.getElementById('prevEmoji');
  if (photoEl) { photoEl.src = dataUrl; photoEl.classList.remove('hidden'); }
  if (placeholder) placeholder.classList.add('hidden');
  if (emojiPrev) emojiPrev.classList.add('hidden');
  if (prevPhoto) { prevPhoto.src = dataUrl; prevPhoto.classList.remove('hidden'); prevPhoto.style.position = 'absolute'; prevPhoto.style.inset = '0'; }
  if (prevEmoji) prevEmoji.classList.add('hidden');
}

function saveNewProduct() {
  const name = document.getElementById('newProdName')?.value.trim();
  const brand = document.getElementById('newProdBrand')?.value.trim();
  const price = parseFloat(document.getElementById('newProdPrice')?.value);
  const oldPrice = parseFloat(document.getElementById('newProdOldPrice')?.value) || null;
  const category = document.getElementById('newProdCategory')?.value;
  const badge = document.getElementById('newProdBadge')?.value || null;
  const description = document.getElementById('newProdDesc')?.value.trim();
  const colorsRaw = document.getElementById('newProdColors')?.value.trim();
  const stock = parseInt(document.getElementById('newProdStock')?.value) || 10;

  if (!name || !brand || !price || price <= 0) {
    showToast('⚠️', 'Faltan datos', 'Nombre, marca y precio son obligatorios');
    return;
  }

  // Get selected sizes
  const sizes = [];
  document.querySelectorAll('.size-new-btn').forEach(btn => {
    if (btn.classList.contains('border-purple-500')) sizes.push(Number(btn.textContent.trim()));
  });
  if (sizes.length === 0) { showToast('⚠️', 'Sin tallas', 'Selecciona al menos una talla'); return; }

  const colors = colorsRaw ? colorsRaw.split(',').map(c => c.trim()).filter(Boolean) : ['Negro'];

  const newId = Date.now();
  const newProduct = {
    id: newId,
    name, brand, price,
    oldPrice: oldPrice || undefined,
    category, badge: badge || null,
    emoji: selectedEmoji,
    photoData: productPhotoData || null,
    rating: 5.0, reviews: 0,
    stock, sizes, colors,
    description: description || `${name} — ${brand}`,
    isCustom: true
  };

  // Add to PRODUCTS array and customProducts
  PRODUCTS.push(newProduct);
  window.customProducts.push(newProduct);

  // Add to inventory
  if (inventoryData.length > 0) {
    inventoryData.push({
      ...newProduct,
      sku: `SS-${String(newId).slice(-4)}`,
      stockBySizes: Object.fromEntries(sizes.map(s => [s, Math.floor(stock / sizes.length) || 1])),
      totalStock: stock,
      reorderPoint: 5,
      supplier: 'Proveedor Principal S.A.',
      location: 'Bodega A',
      lastUpdated: new Date().toISOString().split('T')[0]
    });
    filteredInventory = [...inventoryData];
  }

  // Update catalog
  if (typeof catalogProducts !== 'undefined') {
    catalogProducts = [...PRODUCTS];
    renderCatalogGrid();
  }

  // Reset form
  ['newProdName','newProdBrand','newProdPrice','newProdOldPrice','newProdDesc','newProdColors'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('newProdStock').value = '10';
  document.querySelectorAll('.size-new-btn').forEach(b => {
    b.className = b.className.replace('border-purple-500 bg-purple-50 text-purple-700', 'border-gray-200 text-gray-500 hover:border-purple-400');
  });
  productPhotoData = null;
  selectedEmoji = '👟';
  const photoEl = document.getElementById('productPhotoPreview');
  if (photoEl) { photoEl.classList.add('hidden'); photoEl.src = ''; }
  const placeholder = document.getElementById('photoPlaceholder');
  if (placeholder) placeholder.classList.remove('hidden');
  const emojiPrev = document.getElementById('photoEmojiPreview');
  if (emojiPrev) emojiPrev.classList.add('hidden');
  document.getElementById('prevEmoji').textContent = '👟';
  document.getElementById('prevEmoji').classList.remove('hidden');
  document.getElementById('prevPhoto')?.classList.add('hidden');
  document.getElementById('prevName').textContent = 'Nombre del Producto';
  document.getElementById('prevBrand').textContent = 'Marca';
  document.getElementById('prevPrice').textContent = '$0.00';

  renderAllProductsGrid();
  updateAllProductsCount();
  renderProducts();
  showToast('✅', '¡Producto creado!', `${name} agregado al catálogo`);
  addNotification('✨', 'Nuevo Producto', `${name} fue agregado al catálogo`, 'info');
}

function renderAllProductsGrid() {
  const grid = document.getElementById('allProductsGrid');
  if (!grid) return;
  const allProds = [...PRODUCTS];
  grid.innerHTML = allProds.map(p => `
    <div class="border border-gray-100 rounded-xl p-3 text-center hover:border-purple-300 hover:shadow-sm transition-all group">
      <div class="text-5xl mb-2 group-hover:scale-110 transition-transform">
        ${p.photoData ? `<img src="${p.photoData}" class="w-16 h-16 object-cover rounded-xl mx-auto" alt="">` : p.emoji}
      </div>
      <div class="text-xs font-bold text-gray-700 truncate">${p.name}</div>
      <div class="text-xs text-purple-500 font-semibold">$${p.price}</div>
      ${p.isCustom ? '<div class="text-xs text-green-500 font-semibold">✨ Tuyo</div>' : ''}
    </div>
  `).join('');
}

function updateAllProductsCount() {
  const el = document.getElementById('allProductsCount');
  if (el) el.textContent = `${PRODUCTS.length} productos`;
}

// ===== CATALOG + WHATSAPP =====
let catalogProducts = [...PRODUCTS];

function initCatalog() {
  catalogProducts = [...PRODUCTS];
  renderCatalogGrid();
  updateCatalogCount();
  prepareWhatsAppMessage();
}

function filterCatalog(cat, btn) {
  document.querySelectorAll('.cat-filter-btn').forEach(b => {
    b.className = b.className.replace('bg-purple-600 text-white', 'bg-gray-100 text-gray-600');
    if (!b.className.includes('bg-gray-100')) b.className += ' bg-gray-100 text-gray-600';
  });
  btn.className = btn.className.replace('bg-gray-100 text-gray-600', 'bg-purple-600 text-white');
  catalogProducts = cat === 'all' ? [...PRODUCTS] : PRODUCTS.filter(p => p.category === cat);
  renderCatalogGrid();
  updateCatalogCount();
  prepareWhatsAppMessage();
}

function renderCatalogGrid() {
  const grid = document.getElementById('catalogGrid');
  if (!grid) return;
  grid.innerHTML = catalogProducts.map(p => `
    <div class="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow group">
      <div class="bg-gradient-to-br from-purple-50 to-pink-50 h-40 flex items-center justify-center">
        ${p.photoData
          ? `<img src="${p.photoData}" class="w-full h-full object-cover" alt="${p.name}">`
          : `<div class="text-7xl group-hover:scale-110 transition-transform">${p.emoji}</div>`}
      </div>
      <div class="p-4">
        <div class="text-xs font-bold text-purple-500 uppercase mb-1">${p.brand}</div>
        <div class="font-bold text-gray-800 text-sm mb-1">${p.name}</div>
        <div class="flex items-center gap-2">
          <span class="text-purple-600 font-black text-lg">$${p.price.toFixed(2)}</span>
          ${p.oldPrice ? `<span class="text-xs text-gray-400 line-through">$${p.oldPrice.toFixed(2)}</span>` : ''}
        </div>
        <div class="text-xs text-gray-500 mt-1">Tallas: ${p.sizes.join(', ')}</div>
        ${p.stock <= 5 ? `<div class="text-xs text-orange-500 font-semibold mt-1">⚠️ Solo ${p.stock} disponibles</div>` : ''}
      </div>
    </div>
  `).join('');
}

function updateCatalogCount() {
  const el = document.getElementById('catalogCount');
  if (el) el.textContent = catalogProducts.length;
}

function prepareWhatsAppMessage() {
  const msg = document.getElementById('waMessage');
  if (!msg) return;
  const productList = catalogProducts.slice(0, 10).map(p =>
    `👟 *${p.name}* — $${p.price.toFixed(2)}\n   ${p.brand} | Tallas: ${p.sizes.slice(0,4).join(', ')} | ${p.stock > 10 ? '✅ Disponible' : `⚠️ Solo ${p.stock}`}`
  ).join('\n\n');
  msg.value = `🛍️ *CATÁLOGO StepStyle* 👟\n━━━━━━━━━━━━━━━━━━\n\n${productList}\n\n━━━━━━━━━━━━━━━━━━\n📦 Envíos a todo el país\n💳 Efectivo, Tarjeta, Transferencia\n🔄 Cambios y devoluciones\n\n¡Escríbenos para hacer tu pedido! 😊`;
}

function openWhatsAppModal() {
  prepareWhatsAppMessage();
  // Populate product checkboxes
  const container = document.getElementById('waCatalogProducts');
  if (container) {
    container.innerHTML = PRODUCTS.map(p => `
      <label class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl cursor-pointer">
        <input type="checkbox" checked class="accent-green-500 w-4 h-4" data-prod-id="${p.id}">
        <span class="text-2xl">${p.photoData ? `<img src="${p.photoData}" class="w-8 h-8 object-cover rounded">` : p.emoji}</span>
        <div class="flex-1">
          <div class="text-sm font-semibold text-gray-700">${p.name}</div>
          <div class="text-xs text-purple-500">$${p.price.toFixed(2)}</div>
        </div>
      </label>
    `).join('');
  }
  document.getElementById('whatsappModal').classList.remove('hidden');
  document.getElementById('whatsappModal').classList.add('flex');
}

function closeWhatsAppModal() {
  document.getElementById('whatsappModal').classList.add('hidden');
  document.getElementById('whatsappModal').classList.remove('flex');
}

function sendCatalogWhatsApp() {
  const countryCode = document.getElementById('waCountryCode')?.value || '57';
  const phone = document.getElementById('waPhone')?.value.replace(/\D/g, '');
  const msg = document.getElementById('waMessage')?.value || '';
  if (!phone || phone.length < 7) { showToast('⚠️', 'Número requerido', 'Ingresa el número de WhatsApp del cliente'); return; }
  const fullPhone = countryCode + phone;
  const url = `https://wa.me/${fullPhone}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
  closeWhatsAppModal();
  showToast('💬', '¡Catálogo enviado!', `WhatsApp abierto para +${fullPhone}`);
  addNotification('📲', 'Catálogo Enviado', `Catálogo enviado a +${fullPhone} por WhatsApp`, 'info');
}

function sendQuickWhatsApp() {
  const phone = document.getElementById('waQuickPhone')?.value.replace(/\D/g, '');
  const customMsg = document.getElementById('waQuickMsg')?.value.trim();
  if (!phone || phone.length < 7) { showToast('⚠️', 'Número requerido', 'Ingresa el teléfono del cliente'); return; }
  const productList = catalogProducts.slice(0, 8).map(p =>
    `• ${p.emoji} *${p.name}* $${p.price.toFixed(2)}`
  ).join('\n');
  const greeting = customMsg || 'Hola, te envío nuestro catálogo de zapatos:';
  const msg = `${greeting}\n\n${productList}\n\n¡Contáctanos para tu pedido! 👟 *StepStyle*`;
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
  showToast('💬', '¡Enviado!', `Catálogo enviado a ${phone}`);
}

function sendWATemplate(type) {
  const phone = document.getElementById('waQuickPhone')?.value.replace(/\D/g, '');
  const templates = {
    nuevo: `🆕 *¡NUEVOS ZAPATOS en StepStyle!* 👟\n\nAcabamos de recibir nueva colección. Entra a ver:\n\n${PRODUCTS.filter(p=>p.badge==='new').slice(0,3).map(p=>`👟 ${p.name} — $${p.price}`).join('\n')}\n\n¡Haz tu pedido hoy! 🛍️`,
    oferta: `🏷️ *¡OFERTAS DEL DÍA en StepStyle!* 🔥\n\n${PRODUCTS.filter(p=>p.badge==='sale').slice(0,3).map(p=>`⚡ ${p.name}: $${p.price} (antes $${p.oldPrice})`).join('\n')}\n\n⏰ Oferta válida solo hoy. ¡Escríbenos!`,
    pedido: `📦 *Confirmación de Pedido — StepStyle*\n\nHola! Tu pedido fue confirmado ✅\nEstado: En preparación 🔄\nEnvío: 24-48 horas 🚚\n\n¿Tienes alguna duda? ¡Escríbenos!`
  };
  const msg = templates[type] || templates.pedido;
  if (!phone || phone.length < 7) {
    // Copy to clipboard
    navigator.clipboard?.writeText(msg).then(() => showToast('📋', 'Plantilla copiada', 'Pega el texto donde lo necesites'));
    return;
  }
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
  showToast('💬', 'Plantilla enviada', `Mensaje enviado por WhatsApp`);
}

function printCatalog() {
  window.print();
}

// ===== MARKETING =====
let discountCodes = [
  { code: 'STEP10', discount: 10, type: 'percent', uses: 45, maxUses: 100, active: true, expires: '2026-12-31' },
  { code: 'BIENVENIDO', discount: 15, type: 'percent', uses: 12, maxUses: 50, active: true, expires: '2026-12-15' },
  { code: 'TIKTOK20', discount: 20, type: 'percent', uses: 89, maxUses: 200, active: true, expires: '2026-11-30' },
  { code: 'ENVIOGRATIS', discount: 0, type: 'shipping', uses: 34, maxUses: 100, active: false, expires: '2026-12-01' },
];

function initMarketing() {
  renderDiscountCodes();
}

function renderDiscountCodes() {
  const container = document.getElementById('discountCodesTable');
  if (!container) return;
  container.innerHTML = discountCodes.map((c, i) => `
    <div class="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${i < discountCodes.length-1 ? 'border-b border-gray-50' : ''}">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-3 mb-1">
          <code class="font-mono font-black text-purple-600 text-lg bg-purple-50 px-3 py-1 rounded-xl">${c.code}</code>
          <span class="${c.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'} text-xs font-semibold px-2 py-0.5 rounded-full">${c.active ? '✅ Activo' : '⏸ Pausado'}</span>
        </div>
        <div class="flex gap-4 text-xs text-gray-500">
          <span><i class="fas fa-tag mr-1"></i>${c.type === 'percent' ? c.discount + '% descuento' : c.type === 'fixed' ? '$' + c.discount + ' off' : 'Envío gratis'}</span>
          <span><i class="fas fa-users mr-1"></i>${c.uses}/${c.maxUses} usos</span>
          <span><i class="fas fa-calendar mr-1"></i>Vence: ${c.expires}</span>
        </div>
        <div class="mt-2 w-full bg-gray-100 rounded-full h-1.5">
          <div class="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full" style="width:${Math.min(100,(c.uses/c.maxUses)*100)}%"></div>
        </div>
      </div>
      <div class="flex gap-2 flex-shrink-0">
        <button onclick="copyCode('${c.code}')" title="Copiar" class="w-9 h-9 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center hover:bg-purple-200 transition-colors">
          <i class="fas fa-copy text-sm"></i>
        </button>
        <button onclick="toggleCode(${i})" title="${c.active?'Pausar':'Activar'}" class="w-9 h-9 ${c.active?'bg-orange-100 text-orange-500':'bg-green-100 text-green-600'} rounded-xl flex items-center justify-center hover:opacity-80 transition-opacity">
          <i class="fas fa-${c.active?'pause':'play'} text-sm"></i>
        </button>
        <button onclick="deleteCode(${i})" title="Eliminar" class="w-9 h-9 bg-red-100 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-200 transition-colors">
          <i class="fas fa-trash text-sm"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function copyCode(code) {
  navigator.clipboard?.writeText(code).then(() => showToast('📋', 'Código copiado', `${code} en el portapapeles`))
    .catch(() => showToast('📋', 'Código', code));
}

function toggleCode(idx) {
  discountCodes[idx].active = !discountCodes[idx].active;
  renderDiscountCodes();
  showToast(discountCodes[idx].active ? '✅' : '⏸', 'Código actualizado', `${discountCodes[idx].code} ${discountCodes[idx].active ? 'activado' : 'pausado'}`);
}

function deleteCode(idx) {
  const code = discountCodes[idx].code;
  discountCodes.splice(idx, 1);
  renderDiscountCodes();
  showToast('🗑️', 'Código eliminado', code);
}

function openCreateDiscountModal() {
  document.getElementById('createDiscountModal').classList.remove('hidden');
  document.getElementById('createDiscountModal').classList.add('flex');
  // Set default expiry to 1 month from now
  const future = new Date();
  future.setMonth(future.getMonth() + 1);
  document.getElementById('discExpiry').value = future.toISOString().split('T')[0];
}

function closeCreateDiscountModal() {
  document.getElementById('createDiscountModal').classList.add('hidden');
  document.getElementById('createDiscountModal').classList.remove('flex');
}

function createDiscountCode() {
  const code = document.getElementById('discCode')?.value.trim().toUpperCase();
  const type = document.getElementById('discType')?.value;
  const amount = parseFloat(document.getElementById('discAmount')?.value) || 0;
  const maxUses = parseInt(document.getElementById('discMaxUses')?.value) || 100;
  const expires = document.getElementById('discExpiry')?.value;
  if (!code) { showToast('⚠️', 'Código requerido', 'Ingresa un código de descuento'); return; }
  if (discountCodes.find(c => c.code === code)) { showToast('⚠️', 'Código duplicado', 'Ese código ya existe'); return; }
  discountCodes.unshift({ code, discount: amount, type, uses: 0, maxUses, active: true, expires: expires || '2026-12-31' });
  renderDiscountCodes();
  closeCreateDiscountModal();
  showToast('🏷️', '¡Código creado!', `${code} — ${type === 'percent' ? amount + '%' : '$' + amount} descuento`);
  addNotification('🏷️', 'Nuevo Descuento', `Código ${code} creado y activo`, 'info');
  ['discCode','discAmount','discMaxUses'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
}

function launchWACampaign() {
  const msg = document.getElementById('waCampaignMsg')?.value.trim();
  if (!msg) { showToast('⚠️', 'Sin mensaje', 'Escribe el mensaje de tu campaña'); return; }
  const url = `https://wa.me/?text=${encodeURIComponent(msg + '\n\n📲 *StepStyle* — Tu tienda de zapatos premium')}`;
  window.open(url, '_blank');
  showToast('🚀', '¡Campaña lanzada!', 'WhatsApp abierto para compartir');
  addNotification('📣', 'Campaña Enviada', 'Campaña de WhatsApp lanzada', 'info');
}

function copyTemplate(type) {
  const templates = {
    promo: `🏷️ ¡SUPER OFERTA en StepStyle! 🛍️\n\nHasta 30% OFF en zapatos seleccionados\n⏰ Solo por HOY\n\n👟 Air Runner Pro $189.99 → $133\n👠 Elegance Heel $125 → $87.50\n🥾 Terra Boot $215 → $150.50\n\n¡No te lo pierdas! Escríbenos 👇\n📱 @stepstyle_zapatos`,
    nuevo: `✨ ¡NUEVA COLECCIÓN en StepStyle! 🆕\n\nAcaba de llegar lo más trendy de la temporada 🔥\n\n👟 Nuevos modelos disponibles\n🎨 Colores exclusivos\n📦 Envío inmediato\n\n¡Mira el catálogo completo y pide el tuyo! 🛒`,
    live: `🔴 ¡LIVE HOY en TikTok! 📱\n\n@stepstyle_zapatos estará EN VIVO\n⏰ Hoy a las 7:00 PM\n\n¡Precios especiales SOLO durante el LIVE!\n💥 Hasta 40% de descuento\n🎁 Sorteos en vivo\n\n¡Activa las notificaciones para no perderte! 👟🔔`,
    temporada: `🌟 ¡Colección de Temporada StepStyle! 🍂\n\nLos mejores zapatos para esta época 👟\n\n✅ Botas de temporada\n✅ Casuales impermeables\n✅ Deportivos todo-terreno\n\n📦 Envíos en 24 horas\n💳 Paga como quieras\n\n¡Escríbenos y te asesoramos! 🛍️`
  };
  const text = templates[type];
  navigator.clipboard?.writeText(text).then(() => showToast('📋', '¡Plantilla copiada!', 'Pega el texto en tus redes sociales'))
    .catch(() => { prompt('Copia este texto:', text); });
}

// ===== SIMULATED ORDER NOTIFICATIONS =====
// Simulate incoming orders every 90–180 seconds when page is open
function simulateOrderNotification() {
  const fakeClients = ['María García','Carlos López','Ana Torres','Luis Morales','Sofia Reyes','Pedro Vargas'];
  const fakeProducts = PRODUCTS.map(p => p.name);
  const client = fakeClients[Math.floor(Math.random() * fakeClients.length)];
  const product = fakeProducts[Math.floor(Math.random() * fakeProducts.length)];
  const price = PRODUCTS.find(p => p.name === product)?.price || 100;
  addNotification('🛒', '¡Nuevo Pedido!', `${client} compró ${product} — $${price.toFixed(2)}`, 'order');
  showToast('🛒', `¡Nuevo Pedido!`, `${client} — ${product}`);
}

// Start periodic simulation
setTimeout(() => {
  simulateOrderNotification();
  setInterval(simulateOrderNotification, 120000 + Math.random() * 60000);
}, 15000);

// ===== PAYMENT METHODS REGISTRATION =====
// Enhanced payment methods view - extend existing showView('pagos')
// The existing pagos view already has the layout, just adding save/register functionality
document.addEventListener('DOMContentLoaded', () => {
  // Add save button feedback to payment page
  const payBtn = document.querySelector('[onclick="showView(\'pagos\')"]');
  // Auto-populate tiktok product options  
  const tiktokSel = document.getElementById('tiktokFeaturedProduct');
  if (tiktokSel) {
    tiktokSel.innerHTML = PRODUCTS.map(p => `<option>${p.emoji} ${p.name} — $${p.price}</option>`).join('');
  }
  // Initial notification
  setTimeout(() => addNotification('👋', 'Sistema listo', 'StepStyle iniciado correctamente', 'info'), 1000);
});
