// ===== STORE.JS - Lógica de la Tienda Pública Carfe® =====

let PRODUCTS = [
  { id:1,  name:"Air Runner Pro",          brand:"Nike",   price:219900, oldPrice:279900, cost:110000, cat:"hombre", badge:"sale",   rating:4.8, reviews:234, stock:15, sizes:[38,39,40,41,42,43], colors:["Negro","Blanco","Rojo"],    desc:"Zapatilla deportiva de alto rendimiento con amortiguación Air y suela antideslizante.", img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80" },
  { id:2,  name:"Classic Oxford",          brand:"Carfe",  price:249000, oldPrice:null,   cost:125000, cat:"hombre", badge:"new",    rating:4.9, reviews:189, stock:8,  sizes:[39,40,41,42,43,44], colors:["Negro","Marrón"],           desc:"Zapato Oxford clásico elaborado en cuero vacuno 100% legítimo, perfecto para ocasiones formales.", img:"https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&auto=format&fit=crop&q=80" },
  { id:3,  name:"Street Vibe Sneaker",     brand:"Carfe",  price:159900, oldPrice:null,   cost:78000,  cat:"hombre", badge:"hot",    rating:4.7, reviews:412, stock:32, sizes:[37,38,39,40,41,42], colors:["Negro","Blanco","Azul"],  desc:"Sneaker urbano con diseño moderno, plantilla confort y suela de alta tracción.", img:"https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80" },
  { id:4,  name:"Elegance Heel Stiletto",  brand:"Carfe",  price:189000, oldPrice:null,   cost:92000,  cat:"mujer",  badge:"new",    rating:4.6, reviews:98,  stock:12, sizes:[35,36,37,38,39,40], colors:["Negro","Nude","Rojo"],       desc:"Tacón elegante de 8cm con plataforma de confort y cuero premium suave al tacto.", img:"https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80" },
  { id:5,  name:"Terra Boot Explorer",     brand:"Carfe",  price:289000, oldPrice:null,   cost:145000, cat:"hombre", badge:null,     rating:4.9, reviews:321, stock:20, sizes:[39,40,41,42,43,44,45], colors:["Miel","Marrón","Negro"], desc:"Bota de cuero hidrófugo resistente al agua con costuras reforzadas y suela todo terreno.", img:"https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&auto=format&fit=crop&q=80" },
  { id:6,  name:"Slide Wave Comfort",      brand:"Carfe",  price:89000,  oldPrice:null,   cost:42000,  cat:"mujer",  badge:"tiktok", rating:4.5, reviews:567, stock:50, sizes:[35,36,37,38,39,40], colors:["Negro","Blanco","Rosa"],desc:"Sandalia ultraligera con plantilla anatómica de descanso diario.", img:"https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&auto=format&fit=crop&q=80" },
  { id:7,  name:"Urban Sneaker X",         brand:"Carfe",  price:199900, oldPrice:249900, cost:98000,  cat:"hombre", badge:"sale",   rating:4.7, reviews:203, stock:18, sizes:[38,39,40,41,42,43], colors:["Blanco","Negro","Gris"], desc:"Sneaker contemporáneo de edición limitada con suela chunky y acabados en cuero sintético pro.", img:"https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80" },
  { id:8,  name:"Ballet Flat Confort",     brand:"Carfe",  price:129900, oldPrice:null,   cost:63000,  cat:"mujer",  badge:"new",    rating:4.8, reviews:145, stock:25, sizes:[35,36,37,38,39,40], colors:["Negro","Nude","Rosa"],     desc:"Baleta plana flexible en cuero legítimo con plantilla acolchada de memoria.", img:"https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=600&auto=format&fit=crop&q=80" },
  { id:9,  name:"Trail Master Pro",        brand:"Carfe",  price:269000, oldPrice:null,   cost:130000, cat:"hombre", badge:null,     rating:4.9, reviews:178, stock:10, sizes:[39,40,41,42,43,44], colors:["Verde","Gris","Naranja"],   desc:"Calzado de montaña con protección puntera y agarre multidireccional.", img:"https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=600&auto=format&fit=crop&q=80" },
  { id:10, name:"Mule Suede Chic",         brand:"Carfe",  price:149000, oldPrice:null,   cost:72000,  cat:"mujer",  badge:"hot",    rating:4.4, reviews:89,  stock:30, sizes:[35,36,37,38,39,40], colors:["Camel","Negro","Vino"],     desc:"Mule de ante con tacón bajo cuadrado, elegancia y tendencia para toda ocasión.", img:"https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&auto=format&fit=crop&q=80" },
  { id:11, name:"Derby Executive",         brand:"Carfe",  price:279000, oldPrice:null,   cost:138000, cat:"hombre", badge:null,     rating:4.8, reviews:134, stock:7,  sizes:[40,41,42,43,44], colors:["Negro","Marrón"],               desc:"Zapato Derby formal confeccionado artesanalmente en cuero fino con suela inyectada.", img:"https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop&q=80" },
  { id:12, name:"High Top Street",         brand:"Carfe",  price:169900, oldPrice:null,   cost:83000,  cat:"mujer",  badge:"tiktok", rating:4.6, reviews:892, stock:45, sizes:[35,36,37,38,39,40], colors:["Blanco","Negro","Rojo"],     desc:"Zapatilla clásica de caña alta, icono urbano con plantilla acolchada.", img:"https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=600&auto=format&fit=crop&q=80" },
];

// Copia maestra inmutable para sincronizaciones automáticas
const INITIAL_PRODUCTS = JSON.parse(JSON.stringify(PRODUCTS));

function syncStoreFromAdmin() {
  let list = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));

  // 1. Cargar productos creados en el admin (nuevos calzados)
  try {
    const custom = JSON.parse(localStorage.getItem('ss_custom_products') || '[]');
    if (Array.isArray(custom)) {
      custom.forEach(cp => {
        const full = {
          ...cp,
          sizes: cp.sizes || (cp.cat === 'mujer' ? [35, 36, 37, 38, 39, 40] : [38, 39, 40, 41, 42, 43, 44]),
          colors: cp.colors || ['Negro', 'Café'],
          rating: cp.rating || 5.0,
          reviews: cp.reviews || 1,
          desc: cp.desc || 'Calzado exclusivo de la colección Carfe® 2026.'
        };
        const idx = list.findIndex(p => p.id === cp.id || String(p.id) === String(cp.id));
        if (idx === -1) {
          list.unshift(full);
        } else {
          list[idx] = full;
        }
      });
    }
  } catch(e) {}

  // 2. Sincronizar eliminaciones realizadas desde el Admin
  try {
    const deleted = JSON.parse(localStorage.getItem('ss_deleted_products') || '[]');
    if (Array.isArray(deleted) && deleted.length > 0) {
      list = list.filter(p => !deleted.includes(p.id) && !deleted.includes(String(p.id)));
    }
  } catch(e) {}

  // 3. Sincronizar modificaciones realizadas desde el Admin (precios, fotos, stock, nombres, categorías)
  try {
    const overrides = JSON.parse(localStorage.getItem('ss_product_overrides') || '{}');
    list.forEach(p => {
      if (overrides[p.id]) {
        Object.assign(p, overrides[p.id]);
      }
    });
  } catch(e) {}

  PRODUCTS = list;
  if (typeof filterProducts === 'function') {
    filterProducts();
  } else if (typeof renderProducts === 'function') {
    visibleProducts = [...PRODUCTS];
    renderProducts();
  }

  // 4. Actualizar video y tema
  if (typeof loadHeroBannerMedia === 'function') loadHeroBannerMedia();
  if (typeof loadHeroPresentationVideo === 'function') loadHeroPresentationVideo();
}


// Cargar productos personalizados creados en el admin (con fotos tomadas/cargadas)
try {
  const customProducts = JSON.parse(localStorage.getItem('ss_custom_products') || '[]');
  customProducts.forEach(cp => {
    if (!PRODUCTS.find(p => p.id === cp.id)) {
      PRODUCTS.push({
        ...cp,
        sizes: cp.sizes || [37, 38, 39, 40, 41, 42],
        colors: cp.colors || ['Negro', 'Blanco', 'Marrón'],
        rating: 4.8,
        reviews: 12,
        desc: cp.desc || 'Calzado exclusivo de la colección Carfe® 2026.'
      });
    }
  });
} catch(e) {}

// Sincronizar eliminaciones realizadas desde el Admin
try {
  const deletedIds = JSON.parse(localStorage.getItem('ss_deleted_products') || '[]');
  if (Array.isArray(deletedIds) && deletedIds.length > 0) {
    PRODUCTS = PRODUCTS.filter(p => !deletedIds.includes(p.id) && !deletedIds.includes(String(p.id)));
  }
} catch(e) {}

// Sincronizar modificaciones realizadas desde el Admin (stock, precio, costo, nombre, categoría)
try {
  const overrides = JSON.parse(localStorage.getItem('ss_product_overrides') || '{}');
  PRODUCTS.forEach(p => {
    if (overrides[p.id]) {
      Object.assign(p, overrides[p.id]);
    }
  });
} catch(e) {}

// Helper: Formato Moneda Peso Colombiano (COP)
function formatCOP(val) {
  return '$' + Math.round(val || 0).toLocaleString('es-CO');
}

// Configuración Teléfono Oficial Carfe® para WhatsApp
const DEFAULT_STORE_WA = '573232692578';
function getStoreWAPhone() {
  const custom = localStorage.getItem('carfe_wa_store_phone');
  return custom ? custom.replace(/\D/g, '') : DEFAULT_STORE_WA;
}

function openStoreWA(customMsg) {
  const phone = getStoreWAPhone();
  const msg = customMsg || '👋 Hola Carfe®, quiero ver el catálogo oficial y comprar calzado.';
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
}

// State
let cart = [];
let wishlist = new Set();
let visibleProducts = [...PRODUCTS];
let currentCat = 'all';

// ===== RENDER PRODUCTS (DISEÑO ESPACIOSO Y DINÁMICO) =====
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const empty = document.getElementById('emptyState');
  const countEl = document.getElementById('productCount');
  if (countEl) countEl.textContent = `(${visibleProducts.length})`;
  
  if (!visibleProducts.length) {
    if (grid) grid.innerHTML = '';
    if (empty) empty.classList.remove('hidden');
    return;
  }
  if (empty) empty.classList.add('hidden');

  const badgeLabels = {
    new: 'NUEVO',
    sale: 'OFERTA',
    hot: 'DESTACADO',
    tiktok: 'TIKTOK SHOP'
  };

  if (!grid) return;
  grid.innerHTML = visibleProducts.map(p => `
    <div class="product-card group" onclick="openProduct(${p.id})">
      
      <!-- Contenedor de Imagen Amplio y Cómodo -->
      <div class="product-img-container">
        ${(p.photoData || p.img)
          ? `<img src="${p.photoData || p.img}" class="w-full h-full object-cover absolute inset-0" alt="${p.name}" loading="lazy" decoding="async">` 
          : `<div class="w-full h-full flex flex-col items-center justify-center p-4 text-center">
               <div class="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-purple-600 mb-2 border border-purple-100">
                 <i class="fas fa-shoe-prints text-2xl"></i>
               </div>
               <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Carfe® Oficial</span>
             </div>`}

        ${p.badge ? `<span class="badge badge-${p.badge}">${badgeLabels[p.badge] || p.badge.toUpperCase()}</span>` : ''}

        <button class="wishlist-btn ${wishlist.has(p.id)?'liked':''}" onclick="event.stopPropagation();toggleWish(${p.id},this)" title="Guardar en favoritos">
          <i class="${wishlist.has(p.id)?'fas':'far'} fa-heart"></i>
        </button>
      </div>

      <!-- Información y Botones con Espacio Confortable -->
      <div class="p-5 pt-3 flex-1 flex flex-col justify-between bg-[#121215]">
        <div>
          <div class="text-[11px] font-mono font-bold text-[#D4FF00] uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>${p.brand}</span>
            <span class="text-gray-400 font-semibold">• ${p.cat === 'hombre' ? 'HOMBRE' : 'MUJER'}</span>
          </div>
          
          <h3 class="font-black text-white leading-snug mb-1.5 text-base group-hover:text-[#D4FF00] transition-colors line-clamp-1">${p.name}</h3>
          
          <div class="flex items-center gap-1.5 mb-3">
            <span class="text-amber-400 text-xs">${'★'.repeat(Math.floor(p.rating))}</span>
            <span class="text-xs text-gray-400 font-mono font-medium">${p.rating} (${p.reviews})</span>
          </div>

          <div class="flex items-baseline justify-between gap-2 mb-4">
            <div class="flex items-baseline gap-2 flex-wrap">
              <span class="text-xl font-black text-white tracking-tight tabular-nums font-mono">${formatCOP(p.price)}</span>
              ${p.oldPrice ? `<span class="text-xs text-gray-500 line-through tabular-nums font-mono">${formatCOP(p.oldPrice)}</span>` : ''}
            </div>
            <span class="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded ${p.stock <= 5 ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'bg-[#D4FF00]/15 text-[#D4FF00] border border-[#D4FF00]/30'}">
              ${p.stock === 0 ? 'AGOTADO' : p.stock <= 5 ? `¡ÚLTIMOS ${p.stock}!` : 'EN STOCK'}
            </span>
          </div>
        </div>

        <div class="space-y-2 pt-3 border-t border-[#232328]">
          <!-- Botón de compra y pago directo por WhatsApp -->
          <button class="w-full bg-[#10B981] hover:bg-[#059669] text-black font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]" onclick="event.stopPropagation();directBuyWA(${p.id})">
            <i class="fab fa-whatsapp text-base"></i>
            <span>Comprar por WhatsApp</span>
          </button>
          
          <!-- Botón de agregar al bolso -->
          <button class="w-full bg-[#18181D] hover:bg-[#D4FF00] text-gray-300 hover:text-black font-extrabold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all border border-[#2A2A32] hover:border-[#D4FF00]" onclick="event.stopPropagation();addToCart(${p.id})">
            <i class="fas fa-shopping-bag text-xs"></i> <span>Agregar a la Bolsa</span>
          </button>
        </div>
      </div>

    </div>
  `).join('');
}

function filterCat(cat, btn) {
  currentCat = cat;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const q = document.getElementById('searchInput')?.value.toLowerCase() || '';
  visibleProducts = PRODUCTS.filter(p => (cat==='all' || p.cat===cat) && (!q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)));
  renderProducts();
  const titles = {
    all: 'Todos los Zapatos',
    hombre: 'Colección Hombre',
    mujer: 'Colección Mujer'
  };
  const el = document.getElementById('sectionTitle');
  if (el) el.textContent = titles[cat] || 'Catálogo de Zapatos';
}

let searchDebounceTimer = null;
function searchProducts(overrideVal) {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    const raw = overrideVal !== undefined ? overrideVal : (document.getElementById('searchInput')?.value || '');
    const q = raw.toLowerCase().trim();
    visibleProducts = PRODUCTS.filter(p => (currentCat==='all'||p.cat===currentCat) && (!q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q)));
    renderProducts();
  }, 120);
}

function openProductModal(id) {
  openProduct(id);
}

function sortProds(val) {
  if (val==='low') visibleProducts.sort((a,b)=>a.price-b.price);
  else if (val==='high') visibleProducts.sort((a,b)=>b.price-a.price);
  else if (val==='az') visibleProducts.sort((a,b)=>a.name.localeCompare(b.name));
  else visibleProducts = PRODUCTS.filter(p => currentCat==='all'||p.cat===currentCat);
  renderProducts();
}

function toggleMobileSearch() {
  const el = document.getElementById('mobileSearch');
  if (el) el.classList.toggle('hidden');
}

// ===== PRODUCT DETAIL =====
function openProduct(id) {
  const p = PRODUCTS.find(x=>x.id===id);
  if (!p) return;
  trackTikTokPixel('ViewContent', { content_id: id, content_name: p.name, value: p.price, currency: 'COP' });
  const badgeLabels = { new:'NUEVO', sale:'OFERTA', hot:'DESTACADO', tiktok:'TIKTOK SHOP' };
  document.getElementById('productModalContent').innerHTML = `
    <!-- Top Image Showcase - Full Bleed, Complete & High Definition -->
    <div class="relative w-full h-80 sm:h-96 md:h-[420px] bg-[#16161B] flex items-center justify-center overflow-hidden rounded-t-2xl border-b border-[#242429]">
      <button onclick="closeProductModal()" class="absolute top-4 right-4 z-20 w-10 h-10 bg-[#0B0B0C]/80 hover:bg-[#0B0B0C] text-gray-300 hover:text-white rounded-full shadow-lg border border-[#27272A] flex items-center justify-center transition-all hover:scale-105 active:scale-95" title="Cerrar ventana">
        <i class="fas fa-times text-base"></i>
      </button>
      ${p.badge ? `<span class="badge badge-${p.badge} absolute top-4 left-4 z-10 shadow-md font-bold tracking-wide">${badgeLabels[p.badge] || p.badge.toUpperCase()}</span>` : ''}
      ${(p.photoData || p.img) 
        ? `<img src="${p.photoData || p.img}" class="w-full h-full object-contain p-3 sm:p-5 select-none drop-shadow-md transition-transform duration-500 hover:scale-105" alt="${p.name}">` 
        : `<div class="w-36 h-36 rounded-2xl bg-[#1C1C22] shadow-sm flex flex-col items-center justify-center text-[#D4FF00] border border-[#2E2E36]">
             <i class="fas fa-shoe-prints text-4xl mb-2"></i>
             <span class="text-xs font-mono font-bold text-gray-400">Carfe®</span>
           </div>`}
    </div>
    <div class="p-6 md:p-8 bg-[#121215] text-white">
      <div class="text-xs font-mono font-bold text-[#D4FF00] uppercase tracking-widest mb-1.5">${p.brand} • ${p.cat === 'hombre' ? 'HOMBRE' : 'MUJER'}</div>
      <h2 class="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight mb-2">${p.name}</h2>
      <div class="flex items-center gap-2 mb-4">
        <span class="text-amber-400 text-sm">${'★'.repeat(Math.floor(p.rating))}</span>
        <span class="text-sm text-gray-400 font-mono">${p.rating} — ${p.reviews} valoraciones</span>
      </div>
      <p class="text-gray-300 text-sm md:text-base leading-relaxed mb-5">${p.desc}</p>
      <div class="flex items-baseline gap-3 mb-6">
        <span class="text-3xl font-black text-white tracking-tight tabular-nums font-mono">${formatCOP(p.price)}</span>
        ${p.oldPrice ? `<span class="text-base text-gray-500 line-through tabular-nums font-mono">${formatCOP(p.oldPrice)}</span>` : ''}
      </div>
      <div class="mb-5">
        <label class="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-2 block">COLORWAY SELECCIONADO:</label>
        <div class="flex gap-2 flex-wrap">${p.colors.map((c,i)=>`<button onclick="selClr(this)" class="clr-btn px-4 py-2 rounded-xl border text-xs md:text-sm font-bold transition-all ${i===0?'border-[#D4FF00] bg-[#D4FF00]/15 text-[#D4FF00] shadow-sm':'border-[#27272A] bg-[#18181D] text-gray-300 hover:border-gray-500'}">${c}</button>`).join('')}</div>
      </div>
      <div class="mb-6">
        <label class="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-2 block">TALLA (COL / EUR):</label>
        <div class="flex gap-2 flex-wrap">${p.sizes.map((s,i)=>`<button onclick="selSz(this)" class="sz-btn w-12 h-12 rounded-xl border text-sm font-mono font-black transition-all ${i===0?'border-[#D4FF00] bg-[#D4FF00] text-black shadow-md shadow-[#D4FF00]/25':'border-[#27272A] bg-[#18181D] text-gray-200 hover:border-[#D4FF00]'}">${s}</button>`).join('')}</div>
      </div>
      <div class="flex gap-3 mb-3">
        <button onclick="toggleWish(${p.id})" class="w-14 h-14 border border-[#27272A] bg-[#18181D] rounded-xl flex items-center justify-center text-gray-400 hover:text-[#FF1E40] hover:border-[#FF1E40] transition-all text-xl" title="Guardar en favoritos">
          <i class="${wishlist.has(p.id)?'fas text-[#FF1E40]':'far'} fa-heart"></i>
        </button>
        <button onclick="addToCart(${p.id}); closeProductModal()" class="flex-1 bg-[#18181D] hover:bg-[#D4FF00] text-white hover:text-black border border-[#2E2E36] hover:border-[#D4FF00] font-black h-14 rounded-xl text-base flex items-center justify-center gap-2 transition-all shadow-md">
          <i class="fas fa-shopping-bag"></i> Agregar a mi Bolsa
        </button>
      </div>
      <button onclick="openWAOrderModal(${p.id})" class="w-full bg-[#10B981] hover:bg-[#059669] text-black font-black h-14 rounded-xl flex items-center justify-center gap-2 text-base shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.01] active:scale-[0.99]">
        <i class="fab fa-whatsapp text-2xl"></i> Comprar y Pagar por WhatsApp
      </button>
    </div>
  `;
  const modal = document.getElementById('productModal');
  modal.classList.remove('hidden'); modal.classList.add('flex');
}

function closeProductModal() {
  const m = document.getElementById('productModal');
  m.classList.add('hidden'); m.classList.remove('flex');
}

function selClr(btn) {
  document.querySelectorAll('.clr-btn').forEach(b => {
    b.className = 'clr-btn px-4 py-2 rounded-xl border text-xs md:text-sm font-bold transition-all border-[#27272A] bg-[#18181D] text-gray-300 hover:border-gray-500';
  });
  btn.className = 'clr-btn px-4 py-2 rounded-xl border text-xs md:text-sm font-bold transition-all border-[#D4FF00] bg-[#D4FF00]/15 text-[#D4FF00] shadow-sm';
}
function selSz(btn) {
  document.querySelectorAll('.sz-btn').forEach(b => {
    b.className = 'sz-btn w-12 h-12 rounded-xl border text-sm font-mono font-black transition-all border-[#27272A] bg-[#18181D] text-gray-200 hover:border-[#D4FF00]';
  });
  btn.className = 'sz-btn w-12 h-12 rounded-xl border text-sm font-mono font-black transition-all border-[#D4FF00] bg-[#D4FF00] text-black shadow-md shadow-[#D4FF00]/25';
}

// ===== ESTUDIO 3D / 360° INTERACTIVO DE CALZADO =====
let current3dRotation = 0;
let is3dDragging = false;
let start3dX = 0;
let active3dShoeId = null;

function openProduct3dViewer(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  active3dShoeId = id;
  current3dRotation = 0;

  const imgSrc = p.photoData || p.img || 'assets/logo.jpg';
  
  document.getElementById('productModalContent').innerHTML = `
    <button onclick="closeProductModal()" class="absolute top-4 right-4 z-20 w-9 h-9 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center text-gray-700 hover:text-black transition-colors"><i class="fas fa-times"></i></button>
    
    <div class="p-6 md:p-8 bg-gradient-to-b from-gray-950 via-gray-900 to-purple-950 text-white rounded-2xl relative overflow-hidden select-none">
      
      <!-- Top Bar HUD -->
      <div class="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
        <div>
          <span class="inline-flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md">
            <i class="fas fa-cube text-[9px]"></i> ESTUDIO 3D • GIRO 360°
          </span>
          <h2 class="text-xl md:text-2xl font-black text-white mt-1">${p.name}</h2>
          <div class="text-xs text-purple-300 font-bold">${p.brand} • ${formatCOP(p.price)}</div>
        </div>
        <div class="text-right">
          <div class="text-[10px] font-mono text-gray-400">ROTACIÓN 3D</div>
          <div class="text-sm font-mono font-black text-pink-400" id="modal3dAngleDisplay">0°</div>
        </div>
      </div>

      <!-- 3D Interactive Stage -->
      <div id="modal3dStage" class="relative h-72 md:h-80 rounded-2xl bg-gradient-radial from-purple-900/40 via-transparent to-transparent flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden border border-white/10 shadow-2xl"
           onmousedown="startModal3dDrag(event)" onmousemove="doModal3dDrag(event)" onmouseup="stopModal3dDrag()" onmouseleave="stopModal3dDrag()"
           ontouchstart="startModal3dTouch(event)" ontouchmove="doModal3dTouch(event)" ontouchend="stopModal3dDrag()">
        
        <!-- Studio Lights Effect -->
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none"></div>

        <!-- 3D Pedestal Platform -->
        <div class="absolute bottom-10 w-64 h-12 rounded-[50%] bg-purple-500/25 blur-md border border-purple-400/40 transform rotateX(60deg) pointer-events-none"></div>

        <!-- 3D Shoe Entity -->
        <div id="modal3dShoeWrapper" class="relative z-10 transition-transform duration-75 ease-out flex items-center justify-center">
          <img id="modal3dShoeImg" src="${imgSrc}" class="w-64 h-64 object-contain drop-shadow-[0_25px_30px_rgba(0,0,0,0.7)] pointer-events-none" alt="${p.name}">
        </div>

        <!-- Floating 3D Hint -->
        <div class="absolute bottom-3 inset-x-0 text-center pointer-events-none">
          <span class="bg-black/60 backdrop-blur-md text-white/90 text-[11px] font-semibold px-4 py-1.5 rounded-full border border-white/20 shadow-lg">
            <i class="fas fa-arrows-alt-h text-pink-400 mr-1.5"></i> Haz clic y arrastra en horizontal para girar 360°
          </span>
        </div>
      </div>

      <!-- Quick Actions Controls -->
      <div class="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <button onclick="rotateModal3d(-45)" class="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all border border-white/15">
            <i class="fas fa-undo mr-1 text-[10px]"></i> -45°
          </button>
          <button onclick="resetModal3d()" class="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all border border-white/15">
            Centro
          </button>
          <button onclick="rotateModal3d(45)" class="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all border border-white/15">
            +45° <i class="fas fa-redo ml-1 text-[10px]"></i>
          </button>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="directBuyWA(${p.id})" class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all hover:scale-105">
            <i class="fab fa-whatsapp text-sm"></i> Comprar por WhatsApp
          </button>
          <button onclick="addToCart(${p.id}); closeProductModal()" class="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all hover:scale-105">
            <i class="fas fa-shopping-bag text-xs"></i> Agregar al Bolso
          </button>
        </div>
      </div>

    </div>
  `;

  const modal = document.getElementById('productModal');
  modal.classList.remove('hidden'); modal.classList.add('flex');
}

// Modal 3D Drag handlers
function startModal3dDrag(e) {
  is3dDragging = true;
  start3dX = e.clientX;
}
function doModal3dDrag(e) {
  if (!is3dDragging) return;
  const deltaX = e.clientX - start3dX;
  start3dX = e.clientX;
  current3dRotation = (current3dRotation + deltaX * 0.9) % 360;
  updateModal3dTransform();
}
function stopModal3dDrag() {
  is3dDragging = false;
}
function startModal3dTouch(e) {
  if (e.touches && e.touches[0]) {
    is3dDragging = true;
    start3dX = e.touches[0].clientX;
  }
}
function doModal3dTouch(e) {
  if (!is3dDragging || !e.touches || !e.touches[0]) return;
  const deltaX = e.touches[0].clientX - start3dX;
  start3dX = e.touches[0].clientX;
  current3dRotation = (current3dRotation + deltaX * 0.9) % 360;
  updateModal3dTransform();
}
function rotateModal3d(deg) {
  current3dRotation = (current3dRotation + deg) % 360;
  updateModal3dTransform();
}
function resetModal3d() {
  current3dRotation = 0;
  updateModal3dTransform();
}
function updateModal3dTransform() {
  const wrapper = document.getElementById('modal3dShoeWrapper');
  const label = document.getElementById('modal3dAngleDisplay');
  const normalized = Math.round((current3dRotation % 360 + 360) % 360);
  if (label) label.textContent = `${normalized}°`;
  if (wrapper) {
    const scale = 1 + Math.sin((normalized * Math.PI) / 180) * 0.08;
    const skew = Math.sin((normalized * Math.PI) / 180) * 6;
    wrapper.style.transform = `perspective(800px) rotateY(${current3dRotation}deg) skewY(${skew}deg) scale(${scale})`;
  }
}

// ===== INDEXEDDB CARFE MEDIA STORAGE (VIDEOS & ASSETS GRANDES) =====
const CarfeMediaDB = {
  dbName: 'CarfeMediaDB',
  storeName: 'media',
  version: 1,

  open() {
    return new Promise((resolve) => {
      if (!window.indexedDB) return resolve(null);
      const req = indexedDB.open(this.dbName, this.version);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
      req.onsuccess = (e) => resolve(e.target.result);
      req.onerror = () => resolve(null);
    });
  },

  async getVideo() {
    const db = await this.open();
    if (!db) return null;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(this.storeName, 'readonly');
        const store = tx.objectStore(this.storeName);
        const req = store.get('hero_presentation_video');
        req.onsuccess = (e) => resolve(e.target.result || null);
        req.onerror = () => resolve(null);
      } catch(err) {
        resolve(null);
      }
    });
  },

  async getBannerImage() {
    const db = await this.open();
    if (!db) return null;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(this.storeName, 'readonly');
        const store = tx.objectStore(this.storeName);
        const req = store.get('hero_banner_image');
        req.onsuccess = (e) => resolve(e.target.result || null);
        req.onerror = () => resolve(null);
      } catch(err) {
        resolve(null);
      }
    });
  }
};

let currentHeroVideoBlobUrl = null;

async function assignResilientVideoSource(videoElement, customUrl) {
  if (!videoElement) return;

  videoElement.muted = true;
  videoElement.defaultMuted = true;
  videoElement.playsInline = true;
  videoElement.setAttribute('playsinline', '');
  videoElement.setAttribute('webkit-playsinline', '');
  videoElement.loop = true;
  videoElement.autoplay = true;

  // 1. Probar video subido en IndexedDB (si el usuario cargó un archivo MP4 en admin)
  try {
    if (typeof CarfeMediaDB !== 'undefined' && CarfeMediaDB.getVideo) {
      const blob = await CarfeMediaDB.getVideo();
      if (blob) {
        if (currentHeroVideoBlobUrl) {
          try { URL.revokeObjectURL(currentHeroVideoBlobUrl); } catch(e){}
        }
        currentHeroVideoBlobUrl = URL.createObjectURL(blob);
        videoElement.src = currentHeroVideoBlobUrl;
        videoElement.load();
        const p = videoElement.play();
        if (p && p.catch) p.catch(() => {});
        return;
      }
    }
  } catch(e) {}

  // 2. Lista ordenada de candidatos de video (URL personalizada, archivo local assets, archivo local raíz, fallback online)
  const candidateUrls = [
    customUrl,
    localStorage.getItem('carfe_hero_video_url'),
    'assets/hero-video.mp4',
    'hero-video.mp4',
    './assets/hero-video.mp4',
    './hero-video.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-pair-of-white-sneakers-41584-large.mp4'
  ].filter(Boolean);

  let currentIdx = 0;

  function tryNext() {
    if (currentIdx >= candidateUrls.length) return;
    const nextUrl = candidateUrls[currentIdx++];
    videoElement.src = nextUrl;
    videoElement.load();
    const playPromise = videoElement.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(() => {});
    }
  }

  videoElement.onerror = () => {
    tryNext();
  };

  tryNext();
}

async function loadHeroPresentationVideo() {
  const video = document.getElementById('heroShoeVideo');
  if (!video) return;
  const cfg = (typeof getStoreThemeConfig === 'function') ? getStoreThemeConfig() : {};
  const customUrl = localStorage.getItem('carfe_hero_video_url') || cfg.heroVideoUrl || 'assets/hero-video.mp4';
  await assignResilientVideoSource(video, customUrl);
}

function toggleHeroVideoPlay() {
  const video = document.getElementById('heroShoeVideo');
  const btn = document.getElementById('heroVideoPlayBtn');
  if (!video) return;
  if (video.paused) {
    video.play();
    if (btn) btn.innerHTML = '<i class="fas fa-pause text-base"></i>';
  } else {
    video.pause();
    if (btn) btn.innerHTML = '<i class="fas fa-play text-base ml-0.5"></i>';
  }
}

function toggleHeroVideoAudio() {
  const video = document.getElementById('heroShoeVideo');
  const btn = document.getElementById('heroVideoAudioBtn');
  if (!video) return;
  video.muted = !video.muted;
  if (btn) {
    btn.innerHTML = video.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up text-pink-400"></i>';
  }
}

let currentHeroBannerBlobUrl = null;

async function loadHeroBannerMedia() {
  const cfg = (typeof getStoreThemeConfig === 'function') ? getStoreThemeConfig() : {};
  const imgEl = document.getElementById('heroBannerBgImg');
  const vidEl = document.getElementById('heroBannerBgVideo');
  const overlayEl = document.getElementById('heroOverlayEl');

  // 1. Overlay
  if (overlayEl) {
    const overlayType = cfg.heroBannerOverlay || 'red';
    if (overlayType === 'red') {
      overlayEl.style.background = 'linear-gradient(to right, rgba(60, 5, 5, 0.75) 0%, rgba(0, 0, 0, 0.55) 50%, rgba(60, 5, 5, 0.72) 100%)';
    } else if (overlayType === 'dark') {
      overlayEl.style.background = 'linear-gradient(to right, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.60) 50%, rgba(0, 0, 0, 0.80) 100%)';
    } else if (overlayType === 'blue') {
      overlayEl.style.background = 'linear-gradient(to right, rgba(15, 23, 42, 0.82) 0%, rgba(30, 58, 138, 0.60) 50%, rgba(15, 23, 42, 0.78) 100%)';
    } else if (overlayType === 'purple') {
      overlayEl.style.background = 'linear-gradient(to right, rgba(59, 7, 100, 0.82) 0%, rgba(107, 33, 168, 0.60) 50%, rgba(219, 39, 119, 0.75) 100%)';
    } else if (overlayType === 'none') {
      overlayEl.style.background = 'rgba(0, 0, 0, 0.25)';
    }
  }

  // 2. Video en Bucle de Fondo: SIEMPRE VISIBLE Y REPRODUCIÉNDOSE
  if (vidEl) {
    vidEl.classList.remove('hidden');
    const customUrl = localStorage.getItem('carfe_hero_video_url') || cfg.heroVideoUrl || 'assets/hero-video.mp4';
    await assignResilientVideoSource(vidEl, customUrl);
  }

  // 3. Imagen de Banner (con opacidad suave para que el video de fondo brille)
  if (imgEl) {
    imgEl.classList.add('opacity-20');
    try {
      const blob = await CarfeMediaDB.getBannerImage();
      if (blob) {
        if (currentHeroBannerBlobUrl) {
          try { URL.revokeObjectURL(currentHeroBannerBlobUrl); } catch(e){}
        }
        currentHeroBannerBlobUrl = URL.createObjectURL(blob);
        imgEl.src = currentHeroBannerBlobUrl;
        return;
      }
    } catch(e) {}

    const fallbackBanner = cfg.heroBannerImage || 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1920&auto=format&fit=crop&q=85';
    if (imgEl.src !== fallbackBanner && !imgEl.src.startsWith('blob:')) {
      imgEl.src = fallbackBanner;
    }
  }
}

// ===== SINCRONIZACIÓN EN TIEMPO REAL CON EL ADMINISTRADOR =====
window.addEventListener('storage', (e) => {
  if (!e.key || e.key.startsWith('ss_') || e.key.startsWith('carfe_')) {
    syncStoreFromAdmin();
  }
});

window.addEventListener('focus', () => {
  syncStoreFromAdmin();
});

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    syncStoreFromAdmin();
  }
});

// Verificación periódica silenciosa cada 2.5 segundos
setInterval(() => {
  const lastTs = localStorage.getItem('carfe_last_admin_update');
  if (lastTs && lastTs !== window._lastAppliedAdminUpdate) {
    window._lastAppliedAdminUpdate = lastTs;
    syncStoreFromAdmin();
  }
}, 2500);

// ===== CART =====
function addToCart(id) {
  const p = PRODUCTS.find(x=>x.id===id);
  if (!p || p.stock===0) { toast('info','Sin stock','Este producto está agotado'); return; }
  const ex = cart.find(i=>i.id===id);
  if (ex) ex.qty++;
  else cart.push({...p, qty:1});
  updateCartUI();
  trackTikTokPixel('AddToCart', { content_id: id, content_name: p.name, value: p.price, currency: 'COP' });
  toast('bag','¡Agregado!',`${p.name} en tu bolso`);
}

function removeFromCart(id) {
  cart = cart.filter(i=>i.id!==id);
  renderCart(); updateCartUI();
}

function changeQty(id, d) {
  const item = cart.find(i=>i.id===id);
  if (!item) return;
  item.qty += d;
  if (item.qty<=0) removeFromCart(id);
  else { renderCart(); updateCartUI(); }
}

function getTotal() { return cart.reduce((s,i)=>s+i.price*i.qty, 0); }

function updateCartUI() {
  const total = cart.reduce((s,i)=>s+i.qty,0);
  const badge = document.getElementById('cartCount');
  if (badge) {
    badge.textContent = total;
    badge.classList.toggle('hidden', total===0);
    badge.classList.toggle('flex', total>0);
  }
}

function renderCart() {
  const container = document.getElementById('cartItems');
  const t = getTotal();
  if (document.getElementById('cartSubtotal')) document.getElementById('cartSubtotal').textContent = formatCOP(t);
  if (document.getElementById('cartTotal')) document.getElementById('cartTotal').textContent = formatCOP(t);
  if (!container) return;
  if (!cart.length) {
    container.innerHTML = `<div class="text-center py-16 text-gray-400">
      <div class="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto text-gray-400 text-2xl mb-3"><i class="fas fa-shopping-bag"></i></div>
      <div class="font-semibold text-gray-500">Tu bolso está vacío</div>
      <div class="text-sm mt-2">¡Agrega zapatos para comenzar!</div>
    </div>`;
    return;
  }
  container.innerHTML = cart.map(item => `
    <div class="flex gap-3 bg-[#18181D] rounded-2xl p-3 items-center border border-[#27272A]">
      <div class="w-16 h-16 bg-[#121215] rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-[#2A2A30]">
        ${(item.photoData || item.img) 
          ? `<img src="${item.photoData || item.img}" class="w-full h-full object-cover" alt="${item.name}">` 
          : `<i class="fas fa-shoe-prints text-[#D4FF00] text-xl"></i>`}
      </div>
      <div class="flex-1 min-w-0">
        <div class="font-bold text-white text-sm truncate">${item.name}</div>
        <div class="text-xs text-[#D4FF00] font-mono font-semibold">${item.brand} • ${item.cat === 'hombre' ? 'HOMBRE' : 'MUJER'}</div>
        <div class="font-black text-white mt-0.5 text-sm font-mono">${formatCOP(item.price)}</div>
        <div class="flex items-center gap-2 mt-1.5">
          <button onclick="changeQty(${item.id},-1)" class="w-7 h-7 rounded-full bg-[#27272A] hover:bg-[#D4FF00] font-bold text-gray-300 hover:text-black flex items-center justify-center transition-colors">-</button>
          <span class="font-mono font-bold text-white w-5 text-center">${item.qty}</span>
          <button onclick="changeQty(${item.id},1)" class="w-7 h-7 rounded-full bg-[#27272A] hover:bg-[#D4FF00] font-bold text-gray-300 hover:text-black flex items-center justify-center transition-colors">+</button>
          <button onclick="removeFromCart(${item.id})" class="ml-auto text-gray-500 hover:text-[#FF1E40] transition-colors"><i class="fas fa-trash text-sm"></i></button>
        </div>
      </div>
    </div>
  `).join('');
}

function openCart() { 
  renderCart(); 
  showDrawer('cartDrawer','cartOverlay'); 
}

function closeCart() { 
  hideDrawer('cartDrawer','cartOverlay'); 
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (drawer) {
    drawer.classList.add('is-closed');
    drawer.classList.remove('is-open');
    drawer.style.transform = 'translateX(100%)';
    drawer.style.visibility = 'hidden';
    drawer.style.pointerEvents = 'none';
    drawer.style.display = 'none';
  }
  if (overlay) {
    overlay.classList.add('hidden');
    overlay.style.display = 'none';
  }
  document.body.style.overflow = '';
}

function showDrawer(drawerId, overlayId) {
  const drawer = document.getElementById(drawerId);
  const overlay = document.getElementById(overlayId);
  if (drawer) {
    drawer.style.display = 'flex';
    drawer.style.visibility = 'visible';
    drawer.style.pointerEvents = 'auto';
    drawer.classList.remove('is-closed');
    // Force DOM reflow so CSS animation triggers cleanly
    void drawer.offsetWidth;
    drawer.classList.add('is-open');
    drawer.classList.remove('translate-x-full');
    drawer.style.transform = 'translateX(0)';
  }
  if (overlay) {
    overlay.classList.remove('hidden');
    overlay.style.display = 'block';
  }
  document.body.style.overflow = 'hidden';
}

function toggleDrawer(drawerId, overlayId) {
  showDrawer(drawerId, overlayId);
}

function hideDrawer(drawerId, overlayId) {
  const drawer = document.getElementById(drawerId);
  const overlay = document.getElementById(overlayId);
  if (drawer) {
    drawer.classList.add('is-closed');
    drawer.classList.remove('is-open');
    drawer.classList.add('translate-x-full');
    drawer.style.transform = 'translateX(100%)';
    drawer.style.pointerEvents = 'none';
    setTimeout(() => {
      if (drawer.classList.contains('is-closed')) {
        drawer.style.visibility = 'hidden';
        drawer.style.display = 'none';
      }
    }, 280);
  }
  if (overlay) {
    overlay.classList.add('hidden');
    overlay.style.display = 'none';
  }
  document.body.style.overflow = '';
}

// ===== WISHLIST =====
function toggleWish(id, btn) {
  const p = PRODUCTS.find(x=>x.id===id);
  if (wishlist.has(id)) {
    wishlist.delete(id);
    toast('info','Eliminado',`${p?.name} removido de favoritos`);
  } else {
    wishlist.add(id);
    toast('heart','¡Guardado!',`${p?.name} en tus favoritos`);
  }
  updateWishUI();
  renderProducts();
}

function updateWishUI() {
  const badge = document.getElementById('wishCount');
  if (badge) {
    badge.textContent = wishlist.size;
    badge.classList.toggle('hidden', wishlist.size===0);
    badge.classList.toggle('flex', wishlist.size>0);
  }
}

function toggleWishlistPanel() {
  const drawer = document.getElementById('wishDrawer');
  const isOpen = drawer && drawer.classList.contains('is-open') && drawer.style.display !== 'none';
  if (isOpen) {
    closeWishlistPanel();
  } else {
    renderWishlist();
    showDrawer('wishDrawer','wishOverlay');
  }
}

function closeWishlistPanel() { 
  hideDrawer('wishDrawer','wishOverlay'); 
  const drawer = document.getElementById('wishDrawer');
  const overlay = document.getElementById('wishOverlay');
  if (drawer) {
    drawer.classList.add('is-closed');
    drawer.classList.remove('is-open');
    drawer.style.transform = 'translateX(100%)';
    drawer.style.visibility = 'hidden';
    drawer.style.pointerEvents = 'none';
    drawer.style.display = 'none';
  }
  if (overlay) {
    overlay.classList.add('hidden');
    overlay.style.display = 'none';
  }
  document.body.style.overflow = '';
}

function renderWishlist() {
  const container = document.getElementById('wishItems');
  if (!container) return;
  const items = PRODUCTS.filter(p => wishlist.has(p.id));
  if (!items.length) {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center text-center py-20 px-4">
        <div class="w-20 h-20 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center text-3xl mb-4 shadow-sm animate-pulse">
          <i class="fas fa-heart"></i>
        </div>
        <div class="font-black text-gray-800 text-lg">Sin favoritos aún</div>
        <div class="text-xs text-gray-500 mt-2 max-w-xs leading-relaxed">Toca el corazón en cualquier zapato que te guste para tenerlo a mano y pedirlo rápidamente.</div>
        <button onclick="closeWishlistPanel(); document.getElementById('catalogo').scrollIntoView({behavior:'smooth'})" class="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-xs px-6 py-3 rounded-xl shadow-md transition-all hover:scale-105 active:scale-95">
          Explorar Zapatos
        </button>
      </div>`;
    return;
  }
  container.innerHTML = items.map(p => `
    <div class="flex gap-3 bg-[#18181D] hover:border-[#D4FF00] transition-all rounded-2xl p-3 items-center border border-[#27272A]">
      <div class="w-16 h-16 bg-[#121215] rounded-xl flex items-center justify-center flex-shrink-0 border border-[#2A2A30] p-1 shadow-sm">
        ${(p.photoData || p.img) 
          ? `<img src="${p.photoData || p.img}" class="w-full h-full object-contain rounded-lg" alt="${p.name}">` 
          : `<i class="fas fa-shoe-prints text-[#D4FF00] text-xl"></i>`}
      </div>
      <div class="flex-1 min-w-0">
        <div class="font-bold text-white text-sm truncate">${p.name}</div>
        <div class="text-xs text-[#D4FF00] font-mono font-semibold">${p.brand} • ${p.cat === 'hombre' ? 'HOMBRE' : 'MUJER'}</div>
        <div class="font-black text-white mt-1 font-mono">${formatCOP(p.price)}</div>
        <button onclick="addToCart(${p.id}); closeWishlistPanel()" class="mt-2 bg-[#D4FF00] hover:bg-[#E5FF4D] text-black text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg shadow-sm transition-all">
          Agregar al bolso
        </button>
      </div>
      <button onclick="toggleWish(${p.id}); renderWishlist()" class="text-gray-500 hover:text-[#FF1E40] self-start p-1 transition-colors" title="Quitar de favoritos"><i class="fas fa-times"></i></button>
    </div>
  `).join('');
}

// ===== CHECKOUT =====
function startCheckout() {
  if (!cart.length) { toast('info','Bolso vacío','Agrega productos primero'); return; }
  closeCart();
  goStep(1);
  document.getElementById('checkoutModal').classList.remove('hidden');
  document.getElementById('checkoutModal').classList.add('flex');
}

function closeCheckout() {
  document.getElementById('checkoutModal').classList.add('hidden');
  document.getElementById('checkoutModal').classList.remove('flex');
}

function goStep(n) {
  [1,2,3].forEach(i => {
    const el = document.getElementById('step'+i);
    if (el) el.classList.toggle('hidden', i!==n);
    const si = document.getElementById('si'+i);
    if (si) {
      si.classList.toggle('text-white/60', i>n);
      const span = si.querySelector('span');
      if (span) span.className = i<=n
        ? 'w-6 h-6 bg-white text-purple-600 rounded-full flex items-center justify-center font-bold text-xs'
        : 'w-6 h-6 bg-white/20 rounded-full flex items-center justify-center font-bold text-xs';
    }
  });
  if (n===2) {
    const t = getTotal();
    document.getElementById('coSubtotal').textContent = formatCOP(t);
    document.getElementById('coTotal').textContent = formatCOP(t);
  }
}

function processPay() {
  const name = document.getElementById('cName')?.value.trim();
  const email = document.getElementById('cEmail')?.value.trim();
  if (!name || !email) { toast('info','Faltan datos','Completa nombre y correo'); return; }
  const btn = document.getElementById('payBtn');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Procesando en pesos colombianos...';
  btn.disabled = true;

  setTimeout(() => {
    const orderNum = `CRF-${Date.now().toString().slice(-6)}`;
    document.getElementById('orderNum').textContent = `Pedido #${orderNum}`;
    document.getElementById('confName').textContent = `${name} ${document.getElementById('cLastName')?.value||''}`;
    document.getElementById('confEmail').textContent = email;
    const totalVal = getTotal();
    const pm = document.querySelector('input[name="pm"]:checked')?.value || 'tarjeta';

    document.getElementById('confTotal').textContent = formatCOP(totalVal);
    trackTikTokPixel('CompletePayment', { order_id: orderNum, value: totalVal, currency: 'COP' });

    cart = [];
    updateCartUI();
    goStep(3);
    btn.innerHTML = '<i class="fas fa-lock mr-2"></i>Pagar';
    btn.disabled = false;

    // Notify admin via localStorage
    const phoneVal = document.getElementById('cPhone')?.value.trim() || '';
    const addressVal = document.getElementById('cAddress')?.value.trim() || '';
    const orderData = {
      id: orderNum,
      client: `${name} ${document.getElementById('cLastName')?.value||''}`.trim(),
      email,
      phone: phoneVal,
      address: addressVal,
      total: totalVal,
      date: new Date().toISOString(),
      payMethod: pm
    };
    try {
      const existing = JSON.parse(localStorage.getItem('ss_pending_orders') || '[]');
      existing.unshift(orderData);
      localStorage.setItem('ss_pending_orders', JSON.stringify(existing.slice(0,50)));
    } catch(e) {}

    // Auto-registrar cliente en CRM
    try {
      let crmList = JSON.parse(localStorage.getItem('carfe_crm_clients') || '[]');
      const clientFullName = orderData.client;
      const cleanPh = (phoneVal || '').replace(/\D/g, '');
      const clientIdx = crmList.findIndex(c => 
        (c.name && c.name.toLowerCase().trim() === clientFullName.toLowerCase().trim()) ||
        (c.phone && cleanPh && c.phone.replace(/\D/g, '') === cleanPh)
      );
      const todayStr = new Date().toISOString().split('T')[0];
      const formattedPh = cleanPh.length === 10 && cleanPh.startsWith('3') ? `+57 ${cleanPh}` : (phoneVal || '+57 323 269 2578');

      if (clientIdx >= 0) {
        const c = crmList[clientIdx];
        c.ordersCount = (c.ordersCount || 1) + 1;
        c.totalPurchased = (c.totalPurchased || 0) + totalVal;
        c.lastOrderDate = todayStr;
        if (addressVal) c.address = addressVal;
        if (formattedPh) c.phone = formattedPh;
        if (email) c.email = email;
        c.notes = `${c.notes || ''} | Pedido Tienda Web #${orderNum} (${todayStr}): ${formatCOP(totalVal)}`.trim();
      } else {
        crmList.unshift({
          id: 'CLI-' + String(crmList.length + 1).padStart(3, '0'),
          name: clientFullName,
          phone: formattedPh,
          email: email,
          city: addressVal.split(',').pop()?.trim() || 'Colombia',
          address: addressVal,
          tag: 'nuevo',
          ordersCount: 1,
          totalPurchased: totalVal,
          lastOrderDate: todayStr,
          notes: `Primer pedido en Tienda Web #${orderNum} (${todayStr}): ${formatCOP(totalVal)}`,
          createdAt: todayStr
        });
      }
      localStorage.setItem('carfe_crm_clients', JSON.stringify(crmList));
    } catch(e) {}
  }, 1500);
}

function fmtCard(input) {
  let v = input.value.replace(/\D/g,'').substring(0,16);
  input.value = v.replace(/(.{4})/g,'$1 ').trim();
}
function fmtExp(input) {
  let v = input.value.replace(/\D/g,'').substring(0,4);
  if (v.length>=2) v = v.substring(0,2)+'/'+v.substring(2);
  input.value = v;
}

// ===== TOAST =====
function toast(type, title, msg, ms=3000) {
  const iconMap = {
    bag: '<i class="fas fa-shopping-bag text-purple-600"></i>',
    heart: '<i class="fas fa-heart text-red-500"></i>',
    info: '<i class="fas fa-info-circle text-blue-500"></i>',
    check: '<i class="fas fa-check-circle text-green-500"></i>'
  };
  const iconContainer = document.getElementById('toastIcon');
  if (iconContainer) iconContainer.innerHTML = iconMap[type] || '<i class="fas fa-check-circle text-purple-600"></i>';
  document.getElementById('toastTitle').textContent = title;
  document.getElementById('toastMsg').textContent = msg;
  const t = document.getElementById('toast');
  t.classList.remove('hidden');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.add('hidden'), ms);
}

// ===== PEDIDOS POR WHATSAPP =====
let currentWAProduct = null;

function openWAOrderModal(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  currentWAProduct = p;

  const modal = document.getElementById('waOrderModal');
  const imgCont = document.getElementById('waProdImgContainer');
  const titleEl = document.getElementById('waProdTitle');
  const catEl = document.getElementById('waProdCategory');
  const priceEl = document.getElementById('waProdPrice');
  const sizeSelect = document.getElementById('waOrderSize');
  const colorSelect = document.getElementById('waOrderColor');

  if (imgCont) {
    const photoUrl = p.photoData || p.img || 'assets/logo.jpg';
    imgCont.innerHTML = `<img src="${photoUrl}" class="w-full h-full object-cover">`;
  }
  if (titleEl) titleEl.textContent = p.name;
  if (catEl) catEl.textContent = `${p.brand} • ${p.cat === 'hombre' ? 'Hombre' : 'Mujer'}`;
  if (priceEl) priceEl.textContent = formatCOP(p.price);

  if (sizeSelect) {
    sizeSelect.innerHTML = (p.sizes || [38, 39, 40, 41, 42, 43, 44]).map(s => 
      `<option value="${s}" style="color:#111827;background:#ffffff;font-weight:700;">Talla ${s}</option>`
    ).join('');
  }
  if (colorSelect) {
    colorSelect.innerHTML = (p.colors || ['Negro', 'Blanco', 'Rojo']).map(c => 
      `<option value="${c}" style="color:#111827;background:#ffffff;font-weight:700;">${c}</option>`
    ).join('');
  }

  const nameInput = document.getElementById('waOrderName');
  if (nameInput && !nameInput.value) {
    const prevName = document.getElementById('cName')?.value || '';
    if (prevName) nameInput.value = prevName;
  }
  const addrInput = document.getElementById('waOrderAddress');
  if (addrInput && !addrInput.value) {
    const prevAddr = document.getElementById('cAddress')?.value || '';
    if (prevAddr) addrInput.value = prevAddr;
  }

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeWAOrderModal() {
  const modal = document.getElementById('waOrderModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function directBuyWA(id) {
  openWAOrderModal(id);
}

function fastWAOrder(id) {
  const p = currentWAProduct || PRODUCTS.find(x => x.id === id || String(x.id) === String(id));
  if (!p) return;
  const phone = getStoreWAPhone();
  const photoUrl = p.img || p.photoData || 'https://carfe.com/catalogo';
  const orderId = 'CRF-RAP-' + Math.floor(1000 + Math.random() * 9000);

  const waMsg = 
`👋 *¡HOLA CARFE®! QUIERO COMPRAR Y PAGAR ESTE CALZADO:*
━━━━━━━━━━━━━━━━━━━━
🛍️ *Modelo:* ${p.name}
🏷️ *Colección:* ${p.brand} • ${p.cat === 'hombre' ? 'Hombre' : 'Mujer'}
💰 *Precio Oficial:* ${formatCOP(p.price)}
📸 *Foto del Calzado:* ${photoUrl}
🔖 *Ref Pedido:* ${orderId}
━━━━━━━━━━━━━━━━━━━━
💳 Deseo realizar la compra y el pago inmediato. Por favor envíenme el número de cuenta Nequi, Daviplata o Bancolombia para realizar la transferencia de inmediato. ¡Muchas gracias! 🙌✨`;

  try {
    const pending = JSON.parse(localStorage.getItem('ss_pending_orders') || '[]');
    pending.unshift({
      id: orderId,
      client: 'Cliente WhatsApp Rápido',
      product: `${p.name} (${p.cat === 'hombre' ? 'Hombre' : 'Mujer'})`,
      photo: photoUrl,
      total: p.price,
      date: new Date().toISOString(),
      payMethod: 'WhatsApp (Pago Pendiente)',
      address: 'Por confirmar en WhatsApp',
      status: 'pendiente'
    });
    localStorage.setItem('ss_pending_orders', JSON.stringify(pending.slice(0, 50)));

    // Sincronizar en tiempo real con Base44 Cloud si está conectado
    if (typeof Base44Client !== 'undefined') {
      Base44Client.pushOrder({
        orderNumber: orderId,
        clientName: name,
        clientAddress: address,
        product: `${p.name} (Talla ${size}, ${color})`,
        talla: String(size),
        color: color,
        total: p.price,
        payMethod: payment,
        status: 'pendiente',
        channel: 'whatsapp'
      });
    }
  } catch(e) {}

  closeWAOrderModal();
  closeProductModal();
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(waMsg)}`, '_blank');
}

function submitWAOrder() {
  if (!currentWAProduct) return;
  const p = currentWAProduct;
  const name = document.getElementById('waOrderName')?.value.trim();
  const customerPhone = document.getElementById('waOrderPhone')?.value.trim();
  const size = document.getElementById('waOrderSize')?.value || (p.sizes ? p.sizes[0] : '40');
  const color = document.getElementById('waOrderColor')?.value || (p.colors ? p.colors[0] : 'Negro');
  const address = document.getElementById('waOrderAddress')?.value.trim();
  const payment = document.getElementById('waOrderPayment')?.value || 'Transferencia Nequi / Bancolombia';

  if (!name) {
    toast('info', 'Falta tu nombre', 'Por favor ingresa tu nombre completo');
    document.getElementById('waOrderName')?.focus();
    return;
  }
  if (!customerPhone) {
    toast('info', 'Falta tu WhatsApp', 'Ingresa tu número de WhatsApp para confirmar tu pedido y coordinar la entrega');
    document.getElementById('waOrderPhone')?.focus();
    return;
  }
  if (!address) {
    toast('info', 'Falta la dirección', 'Ingresa la ciudad y dirección de entrega');
    document.getElementById('waOrderAddress')?.focus();
    return;
  }

  const orderId = 'CRF-WA-' + Date.now().toString().slice(-5);
  const photoUrl = p.img || p.photoData || 'https://carfe.com/catalogo';

  const waMsg = 
`👋 *¡HOLA CARFE®! QUIERO COMPRAR Y PAGAR ESTE CALZADO:*
━━━━━━━━━━━━━━━━━━━━
🛍️ *Producto:* ${p.name}
🏷️ *Categoría:* ${p.brand} • ${p.cat === 'hombre' ? 'Hombre' : 'Mujer'}
📸 *Foto del Calzado:* ${photoUrl}
📏 *Talla Elegida:* ${size}
🎨 *Color:* ${color}
💰 *Precio Oficial:* ${formatCOP(p.price)}
━━━━━━━━━━━━━━━━━━━━
📋 *DATOS DE ENTREGA Y PAGO:*
👤 *Cliente:* ${name}
📱 *WhatsApp del Cliente:* ${customerPhone}
📍 *Dirección y Ciudad:* ${address}
💳 *Forma de Pago Elegida:* ${payment}
🔖 *Código de Pedido:* ${orderId}
━━━━━━━━━━━━━━━━━━━━
Por favor confírmenme el pedido y facilítenme los datos de cuenta (Nequi / Daviplata / Bancolombia) para transferir y finalizar la compra. ¡Muchas gracias! 🙌✨`;

  // 1. Guardar en pedidos pendientes para notificación inmediata en el panel admin y DMS logístico
  try {
    const pending = JSON.parse(localStorage.getItem('ss_pending_orders') || '[]');
    pending.unshift({
      id: orderId,
      client: name,
      phone: customerPhone,
      product: `${p.name} (Talla ${size}, ${color})`,
      photo: photoUrl,
      total: p.price,
      date: new Date().toISOString(),
      payMethod: `WhatsApp (${payment})`,
      address: address,
      status: 'pendiente'
    });
    localStorage.setItem('ss_pending_orders', JSON.stringify(pending.slice(0, 50)));

    // Sincronizar en tiempo real con Base44 Cloud si está conectado
    if (typeof Base44Client !== 'undefined') {
      Base44Client.pushOrder({
        orderNumber: orderId,
        clientName: name,
        clientPhone: customerPhone,
        clientAddress: address,
        product: `${p.name} (Talla ${size}, ${color})`,
        talla: String(size),
        color: color,
        total: p.price,
        payMethod: payment,
        status: 'pendiente',
        channel: 'whatsapp'
      });
    }
  } catch(e) {}

  // 2. Actualizar automáticamente el CRM en tiempo real
  try {
    let crmList = JSON.parse(localStorage.getItem('carfe_crm_clients') || '[]');
    const cleanPh = customerPhone.replace(/\D/g, '');
    const clientIdx = crmList.findIndex(c => 
      (c.name && c.name.toLowerCase().trim() === name.toLowerCase().trim()) ||
      (c.phone && cleanPh && c.phone.replace(/\D/g, '') === cleanPh)
    );
    const todayStr = new Date().toISOString().split('T')[0];
    const formattedPh = cleanPh.length === 10 && cleanPh.startsWith('3') ? `+57 ${cleanPh}` : customerPhone;

    if (clientIdx >= 0) {
      const c = crmList[clientIdx];
      c.ordersCount = (c.ordersCount || 1) + 1;
      c.totalPurchased = (c.totalPurchased || 0) + p.price;
      c.lastOrderDate = todayStr;
      if (address) c.address = address;
      if (formattedPh) c.phone = formattedPh;
      c.tag = (c.ordersCount >= 3 || c.totalPurchased > 500000) ? 'vip' : 'aldia';
      c.notes = `${c.notes || ''} | Pedido WhatsApp (${todayStr}): ${p.name} Talla ${size}`.trim();
    } else {
      crmList.unshift({
        id: 'CLI-' + String(crmList.length + 1).padStart(3, '0'),
        name: name,
        phone: formattedPh,
        email: '',
        city: address.split(',').pop()?.trim() || 'Colombia',
        address: address,
        tag: 'nuevo',
        ordersCount: 1,
        totalPurchased: p.price,
        lastOrderDate: todayStr,
        notes: `Primer pedido por WhatsApp: ${p.name} (Talla ${size}, ${color}).`,
        createdAt: todayStr
      });
    }
    localStorage.setItem('carfe_crm_clients', JSON.stringify(crmList));
  } catch(e) {}

  closeWAOrderModal();
  closeProductModal();

  const storePhone = getStoreWAPhone();
  const waUrl = `https://wa.me/${storePhone}?text=${encodeURIComponent(waMsg)}`;
  window.open(waUrl, '_blank');

  toast('bag', '¡Pedido WhatsApp Iniciado!', 'Se abrió WhatsApp con la foto y datos de tu calzado.');
}

function orderCartWhatsApp() {
  if (!cart.length) {
    toast('info', 'Bolso vacío', 'Agrega calzado a tu bolso antes de pedir');
    return;
  }

  const orderId = 'CRF-CART-' + Date.now().toString().slice(-5);
  const totalVal = getTotal();
  const phone = getStoreWAPhone();

  const itemsList = cart.map((item, idx) => {
    const photo = item.img || item.photoData || 'https://carfe.com';
    return `${idx + 1}️⃣ *${item.name}* (x${item.qty})\n   • Precio: ${formatCOP(item.price * item.qty)}\n   • 📸 Foto: ${photo}`;
  }).join('\n\n');

  const waMsg =
`👋 *¡HOLA CARFE®! QUIERO COMPRAR MI BOLSO:*
━━━━━━━━━━━━━━━━━━━━
🛍️ *PRODUCTOS SELECCIONADOS:*

${itemsList}

━━━━━━━━━━━━━━━━━━━━
💰 *TOTAL A PAGAR:* ${formatCOP(totalVal)}
🚚 *Envío:* GRATIS a toda Colombia
🔖 *Código:* ${orderId}
━━━━━━━━━━━━━━━━━━━━
Por favor asesórenme para enviarles mi dirección y método de pago preferido. ¡Muchas gracias! 🙌✨`;

  // Guardar pedido múltiple en el sistema
  try {
    const pending = JSON.parse(localStorage.getItem('ss_pending_orders') || '[]');
    pending.unshift({
      id: orderId,
      client: 'Cliente WhatsApp Web',
      product: `Bolso (${cart.length} productos: ${cart.map(i=>i.name).join(', ')})`,
      total: totalVal,
      date: new Date().toISOString(),
      payMethod: 'WhatsApp (Bolso Completo)',
      status: 'pendiente'
    });
    localStorage.setItem('ss_pending_orders', JSON.stringify(pending.slice(0, 50)));

    // Sincronizar en tiempo real con Base44 Cloud si está conectado
    if (typeof Base44Client !== 'undefined') {
      Base44Client.pushOrder({
        orderNumber: orderId,
        clientName: name,
        clientAddress: address,
        product: `${p.name} (Talla ${size}, ${color})`,
        talla: String(size),
        color: color,
        total: p.price,
        payMethod: payment,
        status: 'pendiente',
        channel: 'whatsapp'
      });
    }
  } catch(e) {}

  closeCart();
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(waMsg)}`;
  window.open(waUrl, '_blank');
  toast('bag', '¡Bolso Enviado a WhatsApp!', 'Redirigiendo a WhatsApp con tus calzados y fotos.');
}

// ===== STORE THEME & DESIGN CUSTOMIZATION =====
const DEFAULT_THEME_CONFIG = {
  brandName: 'Carfe',
  brandSuffix: '®',
  brandSlogan: 'Calzado Premium',
  brandLogo: 'assets/logo-white.png',
  footerDesc: 'Tu tienda oficial de calzado premium Carfe® con los mejores diseños, confort y envíos a todo el país.',

  // Modo de Portada
  heroLayoutMode: 'banner', // 'banner' (Reebok "La Roja") o 'split'
  heroBackgroundType: 'image', // 'image', 'video', 'gradient'
  heroBannerImage: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1920&auto=format&fit=crop&q=85',
  heroBannerOverlay: 'red', // 'red', 'dark', 'blue', 'purple', 'none'

  // Textos del Banner Promocional "La Roja" (Reebok)
  heroTopPromo: 'OFERTAS ESPECIALES',
  heroBigPromoSubtitle: 'DESCUENTOS DE',
  heroBigPromoDiscount: '30% OFF',
  heroPromoHeadline: 'MÁS ESTILO, MEJOR PRECIO',
  heroPromoDesc: 'Aprovecha nuestros descuentos y precios especiales en calzado premium.',
  heroPriceTag1: 'ROPA / ACCESORIOS DESDE',
  heroPriceVal1: '$69.900',
  heroPriceTag2: 'TENIS DESDE',
  heroPriceVal2: '$188.930',
  heroPromoBtnText: 'COMPRAR YA',
  heroDiscountFloatingBadge: '20% DE DESCUENTO',

  // Textos del Modo Split
  heroBadgeText: 'Colección Oficial Carfe® 2026',
  heroTitleLine1: 'Zapatos que',
  heroTitleLine2: 'Definen tu Estilo',
  heroSubtitle: 'La colección más exclusiva de calzado premium. Envíos a todo el país.',
  heroBtnPrimary: 'Ver Colección',
  heroBtnSecondary: 'Live todos los viernes',
  heroCardBadge: 'NUEVA TEMPORADA',
  heroCardSeason: 'Colección 2026',
  heroCardBrand: 'Carfe® Calzado',
  heroVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-pair-of-white-sneakers-41584-large.mp4',

  // Estadísticas
  heroStat1Num: '2,500+',
  heroStat1Lbl: 'Clientes',
  heroStat2Num: '150+',
  heroStat2Lbl: 'Modelos',
  heroStat3Num: '4.9★',
  heroStat3Lbl: 'Calificación',
  heroGradStart: '#450a0a',
  heroGradMid: '#881337',
  heroGradEnd: '#b91c1c',
  heroGradient: 'linear-gradient(135deg, #450a0a 0%, #881337 50%, #b91c1c 100%)',
  primaryColor: '#e11d48',
  secondaryColor: '#f43f5e',
  titleAccentColor1: '#fecdd3',
  titleAccentColor2: '#fbbf24',
  fontFamily: 'Inter',
  activePreset: 'roja'
};

function getStoreThemeConfig() {
  try {
    const raw = localStorage.getItem('carfe_theme_config');
    if (raw) return { ...DEFAULT_THEME_CONFIG, ...JSON.parse(raw) };
  } catch(e) {}
  return { ...DEFAULT_THEME_CONFIG };
}

function applyStoreTheme() {
  const cfg = getStoreThemeConfig();

  // 0. Cargar Medios de Portada (Banner Canva/Foto, Video, Overlays)
  loadHeroBannerMedia();
  loadHeroPresentationVideo();

  // 1. Logos
  const navLogo = document.getElementById('storeNavLogo');
  const heroBadgeLogo = document.getElementById('heroBadgeLogo');
  const heroCardLogo = document.getElementById('heroCardLogo');
  const footerLogo = document.getElementById('footerLogo');
  if (navLogo && cfg.brandLogo) navLogo.src = cfg.brandLogo;
  if (heroBadgeLogo && cfg.brandLogo) heroBadgeLogo.src = cfg.brandLogo;
  if (heroCardLogo && cfg.brandLogo) heroCardLogo.src = cfg.brandLogo;
  if (footerLogo && cfg.brandLogo) footerLogo.src = cfg.brandLogo;

  // 2. Brand names & slogans
  const navBrand = document.getElementById('storeNavBrandName');
  if (navBrand) {
    navBrand.innerHTML = `${cfg.brandName}<span id="storeNavBrandSuffix" class="text-xs font-bold align-top ml-0.5" style="color:${cfg.primaryColor}">${cfg.brandSuffix || ''}</span>`;
  }
  const navSlogan = document.getElementById('storeNavSlogan');
  if (navSlogan) navSlogan.textContent = cfg.brandSlogan || '';

  const footerBrand = document.getElementById('footerBrandName');
  if (footerBrand) {
    footerBrand.innerHTML = `${cfg.brandName}<span id="footerBrandSuffix" class="text-xs font-bold align-top ml-0.5" style="color:${cfg.primaryColor}">${cfg.brandSuffix || ''}</span>`;
  }
  const footerDesc = document.getElementById('footerDesc');
  if (footerDesc && cfg.footerDesc) footerDesc.textContent = cfg.footerDesc;

  // 3a. Control de Modo de Portada: Banner Reebok ("La Roja") vs Split Showcase
  const heroBannerCont = document.getElementById('heroBannerModeContainer');
  const heroSplitCont = document.getElementById('heroSplitModeContainer');
  const isBannerMode = (cfg.heroLayoutMode || 'banner') === 'banner';

  if (heroBannerCont && heroSplitCont) {
    if (isBannerMode) {
      heroBannerCont.classList.remove('hidden');
      heroSplitCont.classList.add('hidden');
    } else {
      heroBannerCont.classList.add('hidden');
      heroSplitCont.classList.remove('hidden');
    }
  }

  // 3b. Textos del Banner Promocional ("La Roja" / Canva)
  const topPromoEl = document.getElementById('heroTopPromoText');
  if (topPromoEl) topPromoEl.textContent = cfg.heroTopPromo || 'OFERTAS ESPECIALES';

  const bigSubEl = document.getElementById('heroBigPromoSubText');
  if (bigSubEl) bigSubEl.textContent = cfg.heroBigPromoSubtitle || 'DESCUENTOS DE';

  const rawDiscount = (cfg.heroBigPromoDiscount || '30% OFF').trim();
  const discParts = rawDiscount.split(/\s+/);
  const discNumEl = document.getElementById('heroBigPromoNumber');
  const discWordEl = document.getElementById('heroBigPromoWord');
  if (discNumEl && discWordEl) {
    if (discParts.length >= 2) {
      discNumEl.textContent = discParts[0];
      discWordEl.textContent = discParts.slice(1).join(' ');
    } else {
      discNumEl.textContent = rawDiscount;
      discWordEl.textContent = '';
    }
  }

  const promoHeadEl = document.getElementById('heroPromoHeadlineText');
  if (promoHeadEl) promoHeadEl.textContent = cfg.heroPromoHeadline || 'MÁS ESTILO, MEJOR PRECIO';

  const promoDescEl = document.getElementById('heroPromoDescText');
  if (promoDescEl) promoDescEl.textContent = cfg.heroPromoDesc || 'Aprovecha nuestros descuentos y precios especiales en calzado premium.';

  const pTag1El = document.getElementById('heroPriceTag1El');
  if (pTag1El) pTag1El.textContent = cfg.heroPriceTag1 || 'ROPA / ACCESORIOS DESDE';

  const pVal1El = document.getElementById('heroPriceVal1El');
  if (pVal1El) pVal1El.textContent = cfg.heroPriceVal1 || '$69.900';

  const pTag2El = document.getElementById('heroPriceTag2El');
  if (pTag2El) pTag2El.textContent = cfg.heroPriceTag2 || 'TENIS DESDE';

  const pVal2El = document.getElementById('heroPriceVal2El');
  if (pVal2El) pVal2El.textContent = cfg.heroPriceVal2 || '$188.930';

  const promoCtaEl = document.getElementById('heroPromoCtaBtnText');
  if (promoCtaEl) promoCtaEl.textContent = cfg.heroPromoBtnText || 'COMPRAR YA';

  const floatBadgeEl = document.getElementById('heroFloatingSideBadgeText');
  if (floatBadgeEl) floatBadgeEl.textContent = cfg.heroDiscountFloatingBadge || '20% DE DESCUENTO';

  // 3c. Textos de Portada Clásica (Split Showcase)
  const badgeText = document.getElementById('heroBadgeText');
  if (badgeText) badgeText.textContent = cfg.heroBadgeText;

  const t1 = document.getElementById('heroTitleLine1');
  if (t1) t1.textContent = cfg.heroTitleLine1;

  const t2 = document.getElementById('heroTitleLine2');
  if (t2) {
    t2.textContent = cfg.heroTitleLine2;
    t2.style.backgroundImage = `linear-gradient(to right, ${cfg.titleAccentColor1 || '#fde047'}, ${cfg.titleAccentColor2 || '#f472b6'})`;
  }

  const sub = document.getElementById('heroSubtitle');
  if (sub) sub.textContent = cfg.heroSubtitle;

  const btn1 = document.getElementById('heroPrimaryText');
  if (btn1) btn1.textContent = cfg.heroBtnPrimary;

  const btn2 = document.getElementById('heroSecondaryText');
  if (btn2) btn2.textContent = cfg.heroBtnSecondary;

  const cardBadge = document.getElementById('heroCardBadge');
  if (cardBadge) cardBadge.textContent = cfg.heroCardBadge;

  const cardSeason = document.getElementById('heroCardSeason');
  if (cardSeason) cardSeason.textContent = cfg.heroCardSeason;

  const cardBrand = document.getElementById('heroCardBrand');
  if (cardBrand) cardBrand.textContent = cfg.heroCardBrand;

  // Stats
  const s1n = document.getElementById('heroStat1Num'); if (s1n) s1n.textContent = cfg.heroStat1Num;
  const s1l = document.getElementById('heroStat1Lbl'); if (s1l) s1l.textContent = cfg.heroStat1Lbl;
  const s2n = document.getElementById('heroStat2Num'); if (s2n) s2n.textContent = cfg.heroStat2Num;
  const s2l = document.getElementById('heroStat2Lbl'); if (s2l) s2l.textContent = cfg.heroStat2Lbl;
  const s3n = document.getElementById('heroStat3Num'); if (s3n) s3n.textContent = cfg.heroStat3Num;
  const s3l = document.getElementById('heroStat3Lbl'); if (s3l) s3l.textContent = cfg.heroStat3Lbl;

  // 4. Hero Background Gradient (en caso de usar gradiente)
  const heroSec = document.getElementById('heroSection');
  if (heroSec && (cfg.heroBackgroundType === 'gradient' || !cfg.heroBackgroundType)) {
    if (cfg.heroGradient) {
      heroSec.style.background = cfg.heroGradient;
    } else if (cfg.heroGradStart && cfg.heroGradEnd) {
      heroSec.style.background = `linear-gradient(135deg, ${cfg.heroGradStart} 0%, ${cfg.heroGradMid || cfg.heroGradStart} 50%, ${cfg.heroGradEnd} 100%)`;
    }
  }

  // 5. Typography / Font
  if (cfg.fontFamily) {
    document.body.style.fontFamily = `'${cfg.fontFamily}', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  }

  // 6. Dynamic CSS variables & styles for accent colors
  let dynStyle = document.getElementById('customThemeStyles');
  if (!dynStyle) {
    dynStyle = document.createElement('style');
    dynStyle.id = 'customThemeStyles';
    document.head.appendChild(dynStyle);
  }
  const pCol = cfg.primaryColor || '#e11d48';
  const sCol = cfg.secondaryColor || '#f43f5e';
  dynStyle.textContent = `
    :root {
      --carfe-primary: ${pCol};
      --carfe-secondary: ${sCol};
    }
    .cat-btn.active {
      background-color: ${pCol} !important;
      color: #ffffff !important;
    }
    #heroBtnPrimary {
      color: ${pCol} !important;
    }
    .add-btn:hover {
      background-color: ${pCol} !important;
    }
    .accent-bg {
      background-color: ${pCol} !important;
    }
    .accent-text {
      color: ${pCol} !important;
    }
  `;
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  applyStoreTheme();
  loadFooterInfo();
  renderProducts();
  // Load any custom products from admin
  try {
    const cp = JSON.parse(localStorage.getItem('ss_custom_products') || '[]');
    cp.forEach(p => { if (!PRODUCTS.find(x=>x.id===p.id)) PRODUCTS.push(p); });
    if (cp.length) { visibleProducts = [...PRODUCTS]; renderProducts(); }
  } catch(e) {}

  updateTikTokStoreUI();
  window.addEventListener('storage', () => {
    applyStoreTheme();
    updateTikTokStoreUI();
  });
});

// ===== TIKTOK PIXEL & LIVE INTEGRATION =====
function getTikTokConfig() {
  try {
    return JSON.parse(localStorage.getItem('carfe_tiktok_config') || '{}');
  } catch(e) {
    return {};
  }
}

function trackTikTokPixel(eventName, data = {}) {
  const config = getTikTokConfig();
  const pixelId = config.pixelId || 'TT-CARFE-COL-9901';
  console.log(`[TikTok Pixel: ${pixelId}] Event: ${eventName}`, data);

  // Guardar en log de eventos de TikTok para métricas en admin
  try {
    const events = JSON.parse(localStorage.getItem('carfe_tt_pixel_events') || '[]');
    events.unshift({
      event: eventName,
      data,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('carfe_tt_pixel_events', JSON.stringify(events.slice(0, 100)));
  } catch(e) {}
}

function updateTikTokStoreUI() {
  const config = getTikTokConfig();
  const user = config.username || '@carfe_oficial';
  const cleanUser = user.replace(/^@/, '');
  const profileUrl = `https://www.tiktok.com/@${cleanUser}`;
  const liveUrl = `https://www.tiktok.com/@${cleanUser}/live`;

  // Banner en tienda
  const userEl = document.getElementById('storeTikTokUser');
  const linkEl = document.getElementById('storeTikTokLink');
  const footerLink = document.getElementById('footerTikTokLink');
  if (userEl) userEl.textContent = user.startsWith('@') ? user : '@' + user;
  if (linkEl) linkEl.href = profileUrl;
  if (footerLink) footerLink.href = profileUrl;

  const nextText = document.getElementById('storeNextLiveText');
  if (nextText && config.nextLiveDate) nextText.textContent = `Próximo live: ${config.nextLiveDate}`;

  // Floating Live Banner
  const isLive = localStorage.getItem('carfe_tiktok_is_live') === 'true';
  const banner = document.getElementById('tiktokLiveFloatingBanner');
  if (banner) {
    if (isLive) {
      banner.classList.remove('hidden');
      const liveUserEl = document.getElementById('liveBannerUser');
      const watchBtn = document.getElementById('liveBannerWatchBtn');
      if (liveUserEl) liveUserEl.textContent = user;
      if (watchBtn) watchBtn.href = liveUrl;

      // Pinned product
      const pinned = JSON.parse(localStorage.getItem('carfe_tiktok_pinned_prod') || 'null');
      const pinnedBox = document.getElementById('liveBannerPinnedProduct');
      if (pinned && pinnedBox) {
        pinnedBox.classList.remove('hidden');
        const nameEl = document.getElementById('liveBannerPinnedName');
        const priceEl = document.getElementById('liveBannerPinnedPrice');
        if (nameEl) nameEl.textContent = pinned.name;
        if (priceEl) priceEl.textContent = formatCOP(pinned.price);
        const imgEl = document.getElementById('liveBannerPinnedImg');
        if (imgEl && (pinned.img || pinned.photoData)) imgEl.src = pinned.img || pinned.photoData;
      } else if (pinnedBox) {
        pinnedBox.classList.add('hidden');
      }
    } else {
      banner.classList.add('hidden');
    }
  }
}

function dismissTikTokLiveBanner() {
  const banner = document.getElementById('tiktokLiveFloatingBanner');
  if (banner) banner.classList.add('hidden');
}

function buyPinnedLiveProduct() {
  const pinned = JSON.parse(localStorage.getItem('carfe_tiktok_pinned_prod') || 'null');
  if (pinned && pinned.id) {
    openProduct(pinned.id);
  }
}

// Tecla ESC para cerrar cualquier panel o modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeWishlistPanel();
    closeCart();
    if (typeof closeProductModal === 'function') closeProductModal();
    if (typeof closeWAOrderModal === 'function') closeWAOrderModal();
  }
});

// Cerrar panel de favoritos si se hace clic afuera
document.addEventListener('click', (e) => {
  const wishDrawer = document.getElementById('wishDrawer');
  if (wishDrawer && wishDrawer.classList.contains('is-open') && wishDrawer.style.display !== 'none') {
    const isWishTrigger = e.target.closest && e.target.closest('[onclick*="toggleWishlistPanel"]');
    if (!wishDrawer.contains(e.target) && !isWishTrigger) {
      closeWishlistPanel();
    }
  }
});

// ===== AYUDA & FOOTER MODALS =====
function openHelpModal(topic) {
  const modal = document.getElementById('helpModal');
  const title = document.getElementById('helpModalTitle');
  const subtitle = document.getElementById('helpModalSubtitle');
  const icon = document.getElementById('helpModalIcon');
  const body = document.getElementById('helpModalBody');
  if (!modal || !body) return;

  const phone = getStoreWAPhone();

  if (topic === 'tracking') {
    icon.className = 'fas fa-box-open text-amber-500';
    title.textContent = 'Seguimiento de Pedido';
    subtitle.textContent = 'Rastrea el despacho de tu calzado';
    body.innerHTML = `
      <div class="space-y-3">
        <p>Todos nuestros pedidos se despachan desde Bucaramanga hacia toda Colombia mediante transportadoras oficiales con número de guía rastreable (Coordinadora, Servientrega e Interrapidísimo).</p>
        <div class="p-4 bg-gray-50 rounded-2xl border border-gray-200">
          <label class="block text-xs font-black text-gray-800 uppercase mb-1">Ingresa tu número de pedido o teléfono:</label>
          <div class="flex gap-2">
            <input type="text" id="trackInput" placeholder="Ej: ORD-4821 o 3232692578" style="color:#111827 !important; -webkit-text-fill-color:#111827 !important; background:#ffffff !important;" class="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 bg-white outline-none">
            <button onclick="consultOrderTracking()" class="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all">Consultar</button>
          </div>
          <div id="trackResult" class="mt-3 text-xs text-emerald-700 font-semibold hidden"></div>
        </div>
        <p class="text-xs text-gray-500">¿Necesitas soporte inmediato con tu guía? Escríbenos directamente a WhatsApp indicando tu nombre completo.</p>
      </div>
    `;
  } else if (topic === 'returns') {
    icon.className = 'fas fa-rotate text-blue-500';
    title.textContent = 'Cambios y Devoluciones';
    subtitle.textContent = 'Garantía 100% oficial Carfe®';
    body.innerHTML = `
      <div class="space-y-3">
        <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-medium">
          🛡️ <b>Garantía de Satisfacción:</b> Cuentas con <b>30 días calendario</b> a partir de la entrega para solicitar cambio de talla o modelo.
        </div>
        <h4 class="font-black text-xs text-gray-900 uppercase">Condiciones del cambio:</h4>
        <ul class="list-disc pl-5 space-y-1.5 text-xs text-gray-600">
          <li>El calzado debe estar sin pisadas en exteriores y con sus etiquetas originales.</li>
          <li>Conserva la caja original de Carfe®.</li>
          <li>El primer cambio de talla no tiene costo de flete adicional en cobertura principal.</li>
          <li>Garantía de <b>60 días</b> por defectos de confección o cuero legítimo.</li>
        </ul>
        <p class="text-xs text-gray-500">Para iniciar un cambio, solo envíanos una foto del calzado a nuestra línea de WhatsApp.</p>
      </div>
    `;
  } else if (topic === 'sizes') {
    icon.className = 'fas fa-ruler-combined text-purple-500';
    title.textContent = 'Guía Oficial de Tallas';
    subtitle.textContent = 'Equivalencias y medidas en centímetros';
    body.innerHTML = `
      <div class="space-y-3">
        <p class="text-xs text-gray-600">Nuestros modelos son horma estándar colombiana. Si estás entre dos tallas, te recomendamos elegir la talla superior.</p>
        <div class="overflow-x-auto rounded-xl border border-gray-200">
          <table class="w-full text-xs text-left">
            <thead class="bg-gray-900 text-white font-bold">
              <tr>
                <th class="p-2.5">Talla COL</th>
                <th class="p-2.5">Talla EUR</th>
                <th class="p-2.5">Largo del Pie (cm)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 font-medium text-gray-900">
              <tr><td class="p-2 font-black text-red-600">37</td><td class="p-2 font-bold">38</td><td class="p-2">24.5 cm</td></tr>
              <tr><td class="p-2 font-black text-red-600">38</td><td class="p-2 font-bold">39</td><td class="p-2">25.0 cm</td></tr>
              <tr><td class="p-2 font-black text-red-600">39</td><td class="p-2 font-bold">40</td><td class="p-2">25.5 cm</td></tr>
              <tr><td class="p-2 font-black text-red-600">40</td><td class="p-2 font-bold">41</td><td class="p-2">26.5 cm</td></tr>
              <tr><td class="p-2 font-black text-red-600">41</td><td class="p-2 font-bold">42</td><td class="p-2">27.0 cm</td></tr>
              <tr><td class="p-2 font-black text-red-600">42</td><td class="p-2 font-bold">43</td><td class="p-2">27.5 cm</td></tr>
              <tr><td class="p-2 font-black text-red-600">43</td><td class="p-2 font-bold">44</td><td class="p-2">28.5 cm</td></tr>
              <tr><td class="p-2 font-black text-red-600">44</td><td class="p-2 font-bold">45</td><td class="p-2">29.0 cm</td></tr>
            </tbody>
          </table>
        </div>
        <div class="text-[11px] text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
          💡 <b>Cómo medir:</b> Coloca tu pie descalzo sobre una hoja de papel pegada al suelo, marca desde el talón hasta el dedo más largo y mide la distancia en centímetros.
        </div>
      </div>
    `;
  } else if (topic === 'faq') {
    icon.className = 'fas fa-circle-question text-emerald-500';
    title.textContent = 'Preguntas Frecuentes';
    subtitle.textContent = 'Respuestas a las dudas más comunes';
    body.innerHTML = `
      <div class="space-y-3">
        <div class="p-3 bg-gray-50 rounded-xl border border-gray-200">
          <div class="font-black text-xs text-gray-900 mb-1">¿Qué medios de pago aceptan?</div>
          <div class="text-xs text-gray-600">Aceptamos transferencias Nequi, Daviplata, Bancolombia, tarjetas de crédito/débito por PSE, y plan de financiamiento en 2 cuotas directas con Carfe®.</div>
        </div>
        <div class="p-3 bg-gray-50 rounded-xl border border-gray-200">
          <div class="font-black text-xs text-gray-900 mb-1">¿Cuánto tiempo tarda en llegar mi pedido?</div>
          <div class="text-xs text-gray-600">El tiempo promedio de entrega es de <b>2 a 4 días hábiles</b> a ciudades principales y de 3 a 5 días a municipios intermedios de Colombia.</div>
        </div>
        <div class="p-3 bg-gray-50 rounded-xl border border-gray-200">
          <div class="font-black text-xs text-gray-900 mb-1">¿El calzado es 100% cuero legítimo?</div>
          <div class="text-xs text-gray-600">Sí. Nuestras colecciones están confeccionadas con cueros vacunos de primera calidad, costuras reforzadas y plantillas de máximo confort.</div>
        </div>
        <div class="p-3 bg-gray-50 rounded-xl border border-gray-200">
          <div class="font-black text-xs text-gray-900 mb-1">¿Puedo comprar directamente por WhatsApp?</div>
          <div class="text-xs text-gray-600">¡Por supuesto! Puedes dar clic en el botón de WhatsApp en cualquier calzado y nuestro equipo te atenderá de inmediato para coordinar el pago y envío.</div>
        </div>
      </div>
    `;
  } else if (topic === 'contact') {
    icon.className = 'fas fa-headset text-red-500';
    title.textContent = 'Canales de Atención Oficial';
    subtitle.textContent = 'Estamos listos para ayudarte';
    body.innerHTML = `
      <div class="space-y-3">
        <p class="text-xs text-gray-600">Comunícate con nuestros asesores comerciales para compras, seguimiento de despachos o asesoría en tallas:</p>
        <div class="space-y-2">
          <a href="https://wa.me/${phone}?text=${encodeURIComponent('Hola Carfe®, deseo atención al cliente')}" target="_blank" class="p-3 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 flex items-center justify-between transition-all">
            <div class="flex items-center gap-3">
              <i class="fab fa-whatsapp text-emerald-600 text-xl"></i>
              <div><div class="font-black text-xs text-gray-900">WhatsApp Oficial</div><div class="text-[11px] text-emerald-700">+${phone}</div></div>
            </div>
            <span class="text-xs font-bold text-emerald-700">Chatear →</span>
          </a>
          <div class="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
            <i class="fas fa-envelope text-red-500 text-lg"></i>
            <div><div class="font-black text-xs text-gray-900">Correo Electrónico</div><div class="text-[11px] text-gray-600" id="helpModalEmail">contacto@carfe.com.co</div></div>
          </div>
          <div class="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
            <i class="fas fa-clock text-amber-500 text-lg"></i>
            <div><div class="font-black text-xs text-gray-900">Horario de Atención</div><div class="text-[11px] text-gray-600" id="helpModalSchedule">Lunes a Sábado: 9:00 AM – 7:00 PM</div></div>
          </div>
          <div class="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
            <i class="fas fa-location-dot text-indigo-500 text-lg"></i>
            <div><div class="font-black text-xs text-gray-900">Sede Principal</div><div class="text-[11px] text-gray-600" id="helpModalCity">Bucaramanga, Santander, Colombia</div></div>
          </div>
        </div>
      </div>
    `;
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeHelpModal() {
  const modal = document.getElementById('helpModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function consultOrderTracking() {
  const inp = document.getElementById('trackInput');
  const res = document.getElementById('trackResult');
  if (!inp || !res) return;
  const val = inp.value.trim();
  if (!val) {
    res.textContent = 'Por favor ingresa un código de pedido o tu número de teléfono.';
    res.className = 'mt-3 text-xs text-amber-600 font-bold block';
    return;
  }
  res.innerHTML = `✅ <b>Pedido encontrado:</b> Se encuentra registrado en el sistema. Despacho prioritario asignado por transportadora Coordinadora/Servientrega. <br><a href="https://wa.me/${getStoreWAPhone()}?text=${encodeURIComponent('Hola Carfe®, consulto guía del pedido: ' + val)}" target="_blank" class="underline text-emerald-800 font-black mt-1 inline-block">Solicitar guía exacta por WhatsApp →</a>`;
  res.className = 'mt-3 text-xs text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-200 block';
}

function loadFooterInfo() {
  try {
    const raw = localStorage.getItem('carfe_footer_info');
    const f = raw ? JSON.parse(raw) : null;
    const phone = f?.phone || (localStorage.getItem('carfe_wa_store_phone') ? '+' + localStorage.getItem('carfe_wa_store_phone') : '+57 323 269 2578');
    const email = f?.email || 'contacto@carfe.com.co';
    const schedule = f?.schedule || 'Lun–Sáb 9AM–7PM';
    const city = f?.city || 'Bucaramanga, Colombia';
    const desc = f?.desc || 'Tu tienda oficial de calzado premium Carfe® con los mejores diseños, confort y envíos a todo el país.';

    const pEl = document.getElementById('footerWaText');
    if (pEl) pEl.textContent = phone;
    const eEl = document.getElementById('footerEmailText');
    if (eEl) eEl.textContent = email;
    const sEl = document.getElementById('footerScheduleText');
    if (sEl) sEl.textContent = schedule;
    const cEl = document.getElementById('footerCityText');
    if (cEl) cEl.textContent = city;
    const dEl = document.getElementById('footerDesc');
    if (dEl && f?.desc) dEl.textContent = desc;

    if (f?.tiktok) {
      const ttLink = document.getElementById('footerTikTokLink');
      const cleanTT = f.tiktok.replace('@', '');
      if (ttLink) ttLink.href = `https://www.tiktok.com/@${cleanTT}`;
      const ttStore = document.getElementById('storeTikTokUser');
      if (ttStore) ttStore.textContent = f.tiktok.startsWith('@') ? f.tiktok : '@' + f.tiktok;
    }

    if (f?.instagram) {
      const igLink = document.getElementById('footerInstagramLink');
      const cleanIG = f.instagram.replace('@', '');
      if (igLink) igLink.href = `https://instagram.com/${cleanIG}`;
    }

    const waRow = document.getElementById('footerWaRow');
    if (waRow) {
      waRow.style.cursor = 'pointer';
      waRow.title = 'Chatear por WhatsApp';
      waRow.onclick = () => openStoreWA();
    }
  } catch(e) {}
}
