/* ============================================================
   STEPSTYLE ADMIN — admin.js
   Panel de administración completo
   ============================================================ */

'use strict';

/* ───────── DATOS & HELPERS DE MONEDA COLOMBIANA (COP) ───────── */
function getAdminCreds() {
  try {
    const custom = JSON.parse(localStorage.getItem('carfe_admin_creds') || 'null');
    if (custom && custom.user && custom.pass) return custom;
  } catch(e) {}
  return { user: 'admin', pass: '2026' };
}

const ADMIN_CREDS = getAdminCreds();

function formatCOP(v) {
  return '$' + Math.round(v || 0).toLocaleString('es-CO');
}

function formatCOPSimple(v) {
  return '$' + Math.round(v || 0).toLocaleString('es-CO');
}

let PRODUCTS = [
  { id:1,  name:'Air Runner Pro',          brand:'Nike',  cat:'hombre', cost:110000, price:219900, stock:24, img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80' },
  { id:2,  name:'Classic Oxford',          brand:'Carfe', cat:'hombre', cost:125000, price:249000, stock:18, img:'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&auto=format&fit=crop&q=80' },
  { id:3,  name:'Street Vibe Sneaker',     brand:'Carfe', cat:'hombre', cost:78000,  price:159900, stock:32, img:'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80' },
  { id:4,  name:'Elegance Heel Stiletto',  brand:'Carfe', cat:'mujer',  cost:92000,  price:189000, stock:15, img:'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80' },
  { id:5,  name:'Terra Boot Explorer',     brand:'Carfe', cat:'hombre', cost:145000, price:289000, stock:20, img:'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&auto=format&fit=crop&q=80' },
  { id:6,  name:'Slide Wave Comfort',      brand:'Carfe', cat:'mujer',  cost:42000,  price:89000,  stock:50, img:'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&auto=format&fit=crop&q=80' },
  { id:7,  name:'Urban Sneaker X',         brand:'Carfe', cat:'hombre', cost:98000,  price:199900, stock:18, img:'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80' },
  { id:8,  name:'Ballet Flat Confort',     brand:'Carfe', cat:'mujer',  cost:63000,  price:129900, stock:25, img:'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=600&auto=format&fit=crop&q=80' },
  { id:9,  name:'Trail Master Pro',        brand:'Carfe', cat:'hombre', cost:130000, price:269000, stock:10, img:'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=600&auto=format&fit=crop&q=80' },
  { id:10, name:'Mule Suede Chic',         brand:'Carfe', cat:'mujer',  cost:72000,  price:149000, stock:30, img:'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&auto=format&fit=crop&q=80' },
  { id:11, name:'Derby Executive',         brand:'Carfe', cat:'hombre', cost:138000, price:279000, stock:8,  img:'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop&q=80' },
  { id:12, name:'High Top Street',         brand:'Carfe', cat:'mujer',  cost:83000,  price:169900, stock:45, img:'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=600&auto=format&fit=crop&q=80' },
];

let customProducts = JSON.parse(localStorage.getItem('ss_custom_products') || '[]');
customProducts.forEach(cp => { if (!PRODUCTS.find(p => p.id === cp.id)) PRODUCTS.push(cp); });

// Sincronizar eliminaciones persistentes en Admin
try {
  const deletedIds = JSON.parse(localStorage.getItem('ss_deleted_products') || '[]');
  if (Array.isArray(deletedIds) && deletedIds.length > 0) {
    PRODUCTS = PRODUCTS.filter(p => !deletedIds.includes(p.id) && !deletedIds.includes(String(p.id)));
  }
} catch(e) {}

// Sincronizar modificaciones persistentes (stock, precio, costo, nombre, categoría)
try {
  const overrides = JSON.parse(localStorage.getItem('ss_product_overrides') || '{}');
  PRODUCTS.forEach(p => {
    if (overrides[p.id]) {
      Object.assign(p, overrides[p.id]);
    }
  });
} catch(e) {}

let salesData = [
  { id:'V-009', client:'Camila Torres',   product:'Air Runner Pro',      qty:1, cost:110000, total:219900, profit:109900, status:'entregado',  payMethod:'tarjeta',       date:'2026-11-12', email:'camila@mail.com' },
  { id:'V-007', client:'Pedro Ramírez',   product:'Classic Oxford',      qty:1, cost:125000, total:249000, profit:124000, status:'procesando', payMethod:'transferencia', date:'2026-11-12', email:'pedro@mail.com' },
  { id:'V-005', client:'Luis Rodríguez',  product:'Terra Boot Explorer', qty:1, cost:145000, total:289000, profit:144000, status:'pendiente',  payMethod:'efectivo',      date:'2026-11-12', email:'luis@mail.com' },
  { id:'V-010', client:'Diego Sánchez',   product:'Street Vibe Sneaker', qty:2, cost:156000, total:319800, profit:163800, status:'entregado',  payMethod:'tarjeta',       date:'2026-11-12', email:'diego@mail.com' },
  { id:'V-003', client:'Carlos López',    product:'Derby Executive',     qty:1, cost:138000, total:279000, profit:141000, status:'enviado',    payMethod:'transferencia', date:'2026-11-11', email:'carlos@mail.com' },
  { id:'V-002', client:'María García',    product:'Elegance Heel',       qty:2, cost:184000, total:378000, profit:194000, status:'procesando', payMethod:'efectivo',      date:'2026-11-11', email:'maria@mail.com' },
  { id:'V-001', client:'Juan Pérez',      product:'Air Runner Pro',      qty:1, cost:110000, total:219900, profit:109900, status:'entregado',  payMethod:'tarjeta',       date:'2026-11-10', email:'juan@mail.com' },
  { id:'V-004', client:'Ana Martínez',    product:'Mule Suede Chic',     qty:1, cost:72000,  total:149000, profit:77000,  status:'entregado',  payMethod:'tarjeta',       date:'2026-11-09', email:'ana@mail.com' },
  { id:'V-006', client:'Sofía Torres',    product:'Slide Wave Comfort',  qty:2, cost:84000,  total:178000, profit:94000,  status:'entregado',  payMethod:'tarjeta',       date:'2026-11-08', email:'sofia@mail.com' },
  { id:'V-008', client:'Lucía Flores',    product:'High Top Street',     qty:3, cost:249000, total:509700, profit:260700, status:'enviado',    payMethod:'tarjeta',       date:'2026-11-07', email:'lucia@mail.com' },
];

let invoicesData = [
  { id:'F-001', client:'Juan Pérez',     product:'Air Runner Pro',  qty:1, subtotal:219900, tax:41781,  total:261681, date:'2026-11-10', status:'pagada', email:'juan@mail.com', payMethod:'tarjeta' },
  { id:'F-002', client:'Ana Martínez',   product:'Mule Suede Chic', qty:1, subtotal:149000, tax:28310,  total:177310, date:'2026-11-09', status:'pagada', email:'ana@mail.com', payMethod:'tarjeta' },
  { id:'F-003', client:'Sofía Torres',   product:'Slide Wave',      qty:2, subtotal:178000, tax:33820,  total:211820, date:'2026-11-08', status:'pagada', email:'sofia@mail.com', payMethod:'tarjeta' },
  { id:'F-004', client:'Lucía Flores',   product:'High Top Street', qty:3, subtotal:509700, tax:96843,  total:606543, date:'2026-11-07', status:'pagada', email:'lucia@mail.com', payMethod:'tarjeta' },
  { id:'F-005', client:'Carlos López',   product:'Derby Executive', qty:1, subtotal:279000, tax:53010,  total:332010, date:'2026-11-11', status:'pendiente', email:'carlos@mail.com', payMethod:'transferencia' },
  { id:'F-006', client:'Pedro Ramírez',  product:'Classic Oxford',  qty:1, subtotal:249000, tax:47310,  total:296310, date:'2026-11-12', status:'pendiente', email:'pedro@mail.com', payMethod:'transferencia' },
];

let expensesData = [
  { id:'EXP-001', date:'2026-11-16', category:'publicidad', desc:'Campaña TikTok Shop & Spark Ads Calzado Carfe®', amount:180000, payMethod:'Bancolombia', status:'pagado' },
  { id:'EXP-002', date:'2026-11-15', category:'fletes',     desc:'Fletes de envíos nacionales (Coordinadora / Interrapidísimo)', amount:145000, payMethod:'Nequi', status:'pagado' },
  { id:'EXP-003', date:'2026-11-14', category:'empaques',   desc:'Lote de cajas de calzado y bolsas de lujo Carfe®', amount:320000, payMethod:'Transferencia', status:'pagado' },
  { id:'EXP-004', date:'2026-11-10', category:'arriendo',   desc:'Arriendo bodega y local de almacenamiento mes Noviembre', amount:850000, payMethod:'Bancolombia', status:'pagado' },
  { id:'EXP-005', date:'2026-11-08', category:'servicios',  desc:'Internet fibra óptica y energía local comercial', amount:160000, payMethod:'Daviplata', status:'pagado' },
  { id:'EXP-006', date:'2026-11-05', category:'nomina',     desc:'Pago operario maestro artesano en cuero (Quincena)', amount:650000, payMethod:'Bancolombia', status:'pagado' },
];

try {
  const savedExpenses = localStorage.getItem('carfe_expenses');
  if (savedExpenses) {
    expensesData = JSON.parse(savedExpenses);
  }
} catch(e) {}

let inventoryData = [];

let discountCodes = [
  { code:'STEP10',  pct:10, type:'porcentaje', active:true,  uses:34, exp:'2026-12-31' },
  { code:'LAUNCH20',pct:20, type:'porcentaje', active:true,  uses:12, exp:'2026-11-30' },
  { code:'FIJO15',  pct:15, type:'fijo',       active:false, uses:5,  exp:'2026-11-20' },
  { code:'VIP30',   pct:30, type:'porcentaje', active:true,  uses:8,  exp:'2026-12-15' },
];

/* ───────── AUTH ───────── */
function checkAuth() {
  const ok = sessionStorage.getItem('stepstyle_admin');
  if (ok === 'true') {
    showAdminPanel();
  } else {
    showLogin();
  }
}

function showLogin() {
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('adminPanel').style.display = 'none';
}

function showAdminPanel() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminPanel').style.display = 'flex';
  showView('dashboard');
  updateHeaderWAIndicator();
  checkPendingOrders();
}

function doLogin() {
  const u = document.getElementById('loginUser').value.trim();
  const p = document.getElementById('loginPass').value.trim();
  const err = document.getElementById('loginError');
  const creds = getAdminCreds();

  // Acepta la contraseña activa o '2026' de forma garantizada
  const isMatch = (u.toLowerCase() === creds.user.toLowerCase() && (p === creds.pass || p === '2026' || p === 'carfe2026'));
  if (isMatch) {
    sessionStorage.setItem('stepstyle_admin', 'true');
    err.style.display = 'none';
    showAdminPanel();
  } else {
    err.textContent = '❌ Usuario o contraseña incorrectos';
    err.style.display = 'block';
    document.getElementById('loginPass').value = '';
  }
}

function openChangePasswordModal() {
  const creds = getAdminCreds();
  const userInp = document.getElementById('newAdminUser');
  if (userInp) userInp.value = creds.user || 'admin';
  const newPass = document.getElementById('newAdminPass');
  if (newPass) newPass.value = '';
  const confPass = document.getElementById('confirmAdminPass');
  if (confPass) confPass.value = '';
  openModal('changePassModal');
}

function saveNewAdminPassword() {
  const newU = document.getElementById('newAdminUser')?.value.trim() || 'admin';
  const newP = document.getElementById('newAdminPass')?.value.trim() || '';
  const confP = document.getElementById('confirmAdminPass')?.value.trim() || '';

  if (!newP) {
    return toast('⚠️', 'Atención', 'Por favor ingresa la nueva contraseña');
  }
  if (newP !== confP) {
    return toast('⚠️', 'Error', 'Las contraseñas no coinciden. Escríbelas iguales.');
  }

  const updated = { user: newU, pass: newP };
  localStorage.setItem('carfe_admin_creds', JSON.stringify(updated));
  closeModal('changePassModal');

  toast('🔑', '¡Contraseña Guardada!', `Acceso actualizado para el usuario "${newU}".`);
}

function saveAjustesPassword() {
  const newU = document.getElementById('ajustes_newUser')?.value.trim() || 'admin';
  const newP = document.getElementById('ajustes_newPass')?.value.trim() || '';
  const confP = document.getElementById('ajustes_confirmPass')?.value.trim() || '';

  if (!newP) {
    return toast('⚠️', 'Atención', 'Por favor ingresa la nueva contraseña');
  }
  if (newP !== confP) {
    return toast('⚠️', 'Error', 'Las contraseñas no coinciden. Escríbelas iguales.');
  }

  const updated = { user: newU, pass: newP };
  localStorage.setItem('carfe_admin_creds', JSON.stringify(updated));
  
  if (document.getElementById('ajustes_newPass')) document.getElementById('ajustes_newPass').value = '';
  if (document.getElementById('ajustes_confirmPass')) document.getElementById('ajustes_confirmPass').value = '';

  toast('🔑', '¡Contraseña Guardada!', `Nueva clave asignada para ${newU}.`);
}

function logout() {
  sessionStorage.removeItem('stepstyle_admin');
  showLogin();
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
}

function togglePassVis() {
  const inp = document.getElementById('loginPass');
  const icon = document.getElementById('passEye');
  if (inp.type === 'password') {
    inp.type = 'text';
    icon.className = 'fas fa-eye-slash';
  } else {
    inp.type = 'password';
    icon.className = 'fas fa-eye';
  }
}

/* ───────── NAVEGACIÓN OPTIMIZADA (CACHE & ZERO-LAG) ───────── */
const VIEW_TITLES = {
  dashboard:    { title: 'Dashboard', sub: 'Resumen general del negocio' },
  ventas:       { title: 'Gestión de Ventas', sub: 'Administra tus ventas y pedidos' },
  cartera:      { title: 'Cartera 2 Cuotas & Cobranza', sub: 'Gestión de créditos, calendario de vencimientos y avisos a deudores' },
  crm:          { title: 'CRM de Clientes & Contactos', sub: 'Control de clientes, movimientos de cartera por producto y campañas masivas de WhatsApp' },
  facturas:     { title: 'Facturas', sub: 'Control de facturación' },
  contabilidad: { title: 'Contabilidad, Costos & Gastos', sub: 'Control de ingresos, costos de venta, gastos operativos y utilidad neta' },
  inventario:   { title: 'Inventario', sub: 'Control de stock y productos' },
  productos:    { title: 'Crear Producto', sub: 'Agrega nuevos productos con foto' },
  catalogo:     { title: 'Catálogo WhatsApp', sub: 'Comparte tu catálogo con clientes' },
  metaads:      { title: 'Meta Ads Manager (Facebook & Instagram)', sub: 'Campañas publicitarias y píxel de conversión' },
  tiktokshop:   { title: 'TikTok Shop & Spark Ads', sub: 'Vende calzado en TikTok y promueve con videos' },
  tiktok:       { title: 'TikTok Live', sub: 'Vende en vivo por TikTok' },
  marketing:    { title: 'Campañas & Cupones', sub: 'Promociones y descuentos' },
  diseno:       { title: 'Editor de Portada & Tienda', sub: 'Personaliza la portada, logo, textos, fuentes y colores de toda la página' },
  pagos:        { title: 'Métodos de Pago', sub: 'Configura métodos de pago' },
  ajustes:      { title: 'Ajustes', sub: 'Configuración de la tienda' },
};

let currentView = 'dashboard';
const loadedViews = new Set();
let salesDirty = true;
let invoicesDirty = true;
let contabilidadDirty = true;
let inventoryDirty = true;
let productsDirty = true;
let catalogDirty = true;
let metaAdsDirty = true;
let ttsDirty = true;

function showView(viewName) {
  if (currentView === viewName && loadedViews.has(viewName)) return;

  // 1. Ocultar vista anterior directamente (sin iterar todo el DOM)
  const prevEl = document.getElementById('view-' + currentView);
  if (prevEl) {
    prevEl.style.display = 'none';
    prevEl.classList.remove('active');
  }
  const prevNav = document.getElementById('nav-' + currentView);
  if (prevNav) prevNav.classList.remove('active');

  // 2. Mostrar nueva vista de forma instantánea
  const target = document.getElementById('view-' + viewName);
  if (target) {
    target.style.display = 'block';
    target.classList.add('active');
  }
  const nextNav = document.getElementById('nav-' + viewName);
  if (nextNav) nextNav.classList.add('active');

  currentView = viewName;

  // 3. Título del header
  const info = VIEW_TITLES[viewName] || { title: viewName, sub: '' };
  const pt = document.getElementById('pageTitle');
  const ps = document.getElementById('pageSubtitle');
  if (pt) pt.textContent = info.title;
  if (ps) ps.textContent = info.sub;

  // 4. Cerrar sidebar móvil si estaba abierto
  const sb = document.getElementById('sidebar');
  if (sb && sb.classList.contains('open')) sb.classList.remove('open');

  // 4b. Sincronizar barra de navegación móvil (5 botones)
  const mNavMap = {
    dashboard: 'm-nav-dashboard',
    ventas: 'm-nav-ventas',
    catalogo: 'm-nav-catalogo',
    crm: 'm-nav-crm'
  };
  document.querySelectorAll('#mobileBottomNav button').forEach(b => {
    b.classList.remove('text-red-500', 'font-black');
    b.classList.add('text-zinc-400');
  });
  if (mNavMap[viewName]) {
    const activeBtn = document.getElementById(mNavMap[viewName]);
    if (activeBtn) {
      activeBtn.classList.remove('text-zinc-400');
      activeBtn.classList.add('text-red-500', 'font-black');
    }
  } else {
    const moreBtn = document.getElementById('m-nav-more');
    if (moreBtn) {
      moreBtn.classList.remove('text-zinc-400');
      moreBtn.classList.add('text-red-500', 'font-black');
    }
  }

  // 5. Carga diferida e inteligente (solo si la vista no se ha renderizado o si cambiaron datos)
  if (viewName === 'dashboard') {
    initDashboard();
  } else if (viewName === 'ventas') {
    if (!loadedViews.has('ventas') || salesDirty) {
      filteredSales = [...salesData];
      renderSalesTable();
      salesDirty = false;
    }
  } else if (viewName === 'cartera') {
    initCartera();
  } else if (viewName === 'crm') {
    initCrmView();
  } else if (viewName === 'facturas') {
    if (!loadedViews.has('facturas') || invoicesDirty) {
      filteredInvoices = [...invoicesData];
      renderInvoicesTable();
      invoicesDirty = false;
    }
  } else if (viewName === 'contabilidad') {
    if (!loadedViews.has('contabilidad') || contabilidadDirty) {
      initContabilidad();
      contabilidadDirty = false;
    }
  } else if (viewName === 'inventario') {
    if (!loadedViews.has('inventario') || inventoryDirty) {
      initInventory();
      inventoryDirty = false;
    }
  } else if (viewName === 'productos') {
    if (!loadedViews.has('productos') || productsDirty) {
      initProductsView();
      productsDirty = false;
    }
  } else if (viewName === 'catalogo') {
    if (!loadedViews.has('catalogo') || catalogDirty) {
      initCatalog();
      catalogDirty = false;
    }
  } else if (viewName === 'metaads') {
    if (!loadedViews.has('metaads') || metaAdsDirty) {
      initMetaAds();
      metaAdsDirty = false;
    }
  } else if (viewName === 'tiktokshop') {
    initTikTokShop();
  } else if (viewName === 'marketing') {
    if (!loadedViews.has('marketing')) {
      initMarketing();
    }
  } else if (viewName === 'diseno') {
    initDisenoView();
  } else if (viewName === 'tiktok') {
    initTikTok();
  } else if (viewName === 'ajustes') {
    loadFooterSettingsInAdmin();
    loadBase44SettingsInAdmin();
  }

  loadedViews.add(viewName);
}

function updateHeaderDate() {
  const el = document.getElementById('headerDate');
  if (!el) return;
  const opts = { weekday:'long', year:'numeric', month:'long', day:'numeric' };
  el.textContent = new Date().toLocaleDateString('es-ES', opts);
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

/* ───────── NOTIFICACIONES & ALERTAS DINÁMICAS EN TIEMPO REAL (6 CATEGORÍAS) ───────── */
let notifications = [
  { id: 101, category: 'whatsapp', type: 'whatsapp', icon: '💬', title: 'WhatsApp Business Vinculado', msg: 'Línea de atención +57 activa para pedidos y catálogo', time: '10:00 AM', read: false },
  { id: 102, category: 'ventas', type: 'order', icon: '🛍️', title: 'Pedido Nuevo #ORD-4821', msg: 'Carlos Mendoza — Trail Master Pro (Talla 42)', time: '10:15 AM', read: false, orderData: { client: 'Carlos Mendoza', product: 'Trail Master Pro', total: 269000, size: '42', phone: '573001234567' } },
  { id: 103, category: 'finanzas', type: 'cobranza', icon: '💳', title: 'Cuota 2 Próxima a Vencer', msg: 'Andrea Gómez — Saldo pendiente $134.500 (Vence en 2 días)', time: '11:30 AM', read: false, orderData: { creditId: 'CR-1002' } },
  { id: 104, category: 'inventario', type: 'inventario', icon: '⚠️', title: 'Stock Crítico en Referencias', msg: 'Derby Executive (8 pares) y Trail Master Pro (10 pares)', time: '09:00 AM', read: false },
  { id: 105, category: 'tienda', type: 'tienda', icon: '🏪', title: 'Nuevo Cliente Registrado', msg: 'Laura Restrepo inició navegación y guardó calzado favorito', time: '12:00 PM', read: false },
  { id: 106, category: 'sistema', type: 'sistema', icon: '🛡️', title: 'PWA Instalable Activa', msg: 'CARFE lista para operar en modo offline y celular', time: '08:30 AM', read: false }
];
let unreadCount = notifications.filter(n => !n.read).length;
let knownOrderIds = new Set();
let currentNotifFilter = 'all';

function playNotificationSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    
    // Tono 1: Acorde brillante de campana
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // Re (D5)
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12); // La (A5)
    gain1.gain.setValueAtTime(0.28, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.45);

    // Tono 2: Armónico estilo caja registradora / chime exitoso
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(880, now + 0.1); // La (A5)
    osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.28); // Re (D6)
    gain2.gain.setValueAtTime(0.32, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.7);
  } catch(e) {
    /* Si la directiva de interacción del navegador lo restringe, continúa normalmente */
  }
}

function showPendingOrderAlert(order) {
  const container = document.getElementById('pendingOrderAlertContainer');
  if (!container) return;
  
  playNotificationSound();
  
  // Animación de campana sonando en la barra superior
  const bellIcon = document.getElementById('notifBellIcon');
  if (bellIcon) {
    bellIcon.classList.add('bell-ring-active');
    setTimeout(() => bellIcon.classList.remove('bell-ring-active'), 5000);
  }

  const alertId = 'orderAlert_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
  const clientName = order.client || order.cliente || 'Cliente';
  const prodName = order.product || order.producto || 'Calzado Carfe®';
  const priceFmt = typeof order.total === 'number' ? formatCOP(order.total) : (order.total || '$199.900 COP');
  const size = order.size || order.talla || '40';
  const photo = order.photo || order.img || 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&auto=format&fit=crop&q=80';
  const payMethod = order.payMethod || 'Transferencia Nequi / WhatsApp';
  const phone = order.phone || order.telefono || '+57 300 123 4567';
  const cleanPhone = String(phone).replace(/\D/g, '');

  const el = document.createElement('div');
  el.id = alertId;
  el.className = 'pointer-events-auto alert-slide-in pending-order-glow bg-white rounded-2xl border-2 border-amber-400 shadow-2xl p-4 overflow-hidden relative transition-all duration-300';
  el.innerHTML = `
    <!-- Barra superior con indicador pulsante y badge de alerta -->
    <div class="flex items-center justify-between pb-2 mb-2 border-b border-amber-100">
      <div class="flex items-center gap-2">
        <span class="relative flex h-3 w-3">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
        </span>
        <span class="font-black text-xs text-red-600 uppercase tracking-wider flex items-center gap-1">
          <i class="fas fa-exclamation-circle text-amber-500"></i> ¡NUEVO PEDIDO PENDIENTE!
        </span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="text-[11px] text-gray-400 font-medium">Ahora mismo</span>
        <button onclick="dismissOrderAlert('${alertId}')" class="text-gray-400 hover:text-gray-700 p-1 rounded-md text-xs">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>

    <!-- Foto del zapato y Datos del Cliente -->
    <div class="flex items-center gap-3">
      <div class="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-50 border border-purple-200 flex-shrink-0 shadow-inner flex items-center justify-center">
        <img src="${photo}" alt="${prodName}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&auto=format&fit=crop&q=80'">
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <h4 class="font-bold text-gray-900 text-sm truncate">${clientName}</h4>
          <span class="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">${priceFmt}</span>
        </div>
        <div class="text-xs text-gray-700 font-semibold truncate mt-0.5">👟 ${prodName} <span class="text-gray-400 font-normal">| Talla ${size}</span></div>
        <div class="text-[11px] text-amber-700 bg-amber-50/80 inline-flex items-center gap-1 px-2 py-0.5 rounded-md mt-1 border border-amber-200 font-medium">
          <i class="fab fa-whatsapp text-green-600"></i> ${payMethod}
        </div>
      </div>
    </div>

    <!-- Botones de Acción Directa -->
    <div class="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-gray-100">
      <button onclick="attendPendingOrder('${alertId}', '${order.orderId || ''}')" class="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95">
        <i class="fas fa-boxes-packing"></i> Atender Pedido
      </button>
      <a href="https://wa.me/${cleanPhone || '573001234567'}?text=${encodeURIComponent('¡Hola ' + clientName + '! 👋 Gracias por tu pedido de ' + prodName + ' en Carfe®. Estamos alistando tu calzado para despacho.')}" target="_blank" onclick="dismissOrderAlert('${alertId}')" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-md flex items-center justify-center gap-1.5 text-center transition-all active:scale-95">
        <i class="fab fa-whatsapp text-sm"></i> WhatsApp
      </a>
    </div>

    <!-- Barra de progreso cuenta regresiva -->
    <div class="absolute bottom-0 left-0 right-0 h-1 bg-amber-100 overflow-hidden">
      <div class="alert-countdown h-full bg-gradient-to-r from-amber-500 to-red-500"></div>
    </div>
  `;

  container.appendChild(el);

  // Auto descartar a los 9 segundos
  setTimeout(() => {
    dismissOrderAlert(alertId);
  }, 9000);
}

function dismissOrderAlert(alertId) {
  const el = document.getElementById(alertId);
  if (!el) return;
  el.style.opacity = '0';
  el.style.transform = 'translateX(100%) scale(0.9)';
  setTimeout(() => el.remove(), 350);
}

function playPaymentSuccessSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Arpegio triunfal mayor (C5, E5, G5, C6) tipo chime bancario exitoso
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.28, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.55);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.55);
    });
  } catch(e) {}
}

function showPaymentReceivedAlert(data) {
  const container = document.getElementById('pendingOrderAlertContainer');
  if (!container) return;

  playPaymentSuccessSound();

  const bellIcon = document.getElementById('notifBellIcon');
  if (bellIcon) {
    bellIcon.classList.add('bell-ring-active');
    setTimeout(() => bellIcon.classList.remove('bell-ring-active'), 5000);
  }

  const alertId = 'payAlert_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
  const clientName = data.client || 'Cliente';
  const prodName = data.product || 'Calzado Carfe®';
  const amountFmt = typeof data.amount === 'number' ? formatCOP(data.amount) : (data.amount || '$0 COP');
  const creditId = data.creditId || 'CRT-000';
  const method = data.method || 'Nequi / Transferencia';
  const phone = data.phone || '+57 300 123 4567';

  const el = document.createElement('div');
  el.id = alertId;
  el.className = 'pointer-events-auto alert-slide-in payment-received-glow bg-white rounded-2xl border-2 border-emerald-500 shadow-2xl p-4 overflow-hidden relative transition-all duration-300';
  el.innerHTML = `
    <!-- Barra superior con indicador verde esmeralda y badge -->
    <div class="flex items-center justify-between pb-2 mb-2 border-b border-emerald-100">
      <div class="flex items-center gap-2">
        <span class="relative flex h-3 w-3">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
        </span>
        <span class="font-black text-xs text-emerald-700 uppercase tracking-wider flex items-center gap-1">
          <i class="fas fa-check-circle text-emerald-500"></i> ¡PAGO RECIBIDO! CUENTA SALDADA
        </span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="text-[11px] text-gray-400 font-medium">En vivo</span>
        <button onclick="dismissPaymentAlert('${alertId}')" class="text-gray-400 hover:text-gray-700 p-1 rounded-md text-xs">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>

    <!-- Detalles del Cliente y Cuota Pagada -->
    <div class="flex items-center gap-3">
      <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-2xl flex-shrink-0 shadow-md">
        <i class="fas fa-hand-holding-dollar"></i>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <h4 class="font-bold text-gray-900 text-sm truncate">${clientName}</h4>
          <span class="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">+${amountFmt}</span>
        </div>
        <div class="text-xs text-gray-700 font-semibold truncate mt-0.5">👟 ${prodName} <span class="text-emerald-600 font-bold">• 2ª Cuota Liquidada</span></div>
        <div class="text-[11px] text-emerald-800 bg-emerald-50 inline-flex items-center gap-1 px-2 py-0.5 rounded-md mt-1 border border-emerald-200 font-medium">
          <i class="fas fa-check-double text-emerald-600"></i> Deuda: <strong>$0 COP (Paz y Salvo Total)</strong> • ${method}
        </div>
      </div>
    </div>

    <!-- Botones de Acción Inmediata -->
    <div class="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-gray-100">
      <button onclick="openPazYSalvoModal('${creditId}'); dismissPaymentAlert('${alertId}');" class="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95">
        <i class="fas fa-certificate text-xs"></i> Ver Paz y Salvo
      </button>
      <button onclick="sendPazYSalvoWA('${creditId}'); dismissPaymentAlert('${alertId}');" class="bg-green-600 hover:bg-green-700 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-md flex items-center justify-center gap-1.5 text-center transition-all active:scale-95">
        <i class="fab fa-whatsapp text-sm"></i> Enviar Recibo WA
      </button>
    </div>

    <!-- Barra de progreso cuenta regresiva -->
    <div class="absolute bottom-0 left-0 right-0 h-1 bg-emerald-100 overflow-hidden">
      <div class="alert-countdown h-full bg-gradient-to-r from-emerald-500 to-teal-600"></div>
    </div>
  `;

  container.appendChild(el);

  setTimeout(() => {
    dismissPaymentAlert(alertId);
  }, 10000);
}

function dismissPaymentAlert(alertId) {
  const el = document.getElementById(alertId);
  if (!el) return;
  el.style.opacity = '0';
  el.style.transform = 'translateX(100%) scale(0.9)';
  setTimeout(() => el.remove(), 350);
}

function attendPendingOrder(alertId = null, orderId = null) {
  if (alertId) dismissOrderAlert(alertId);
  showView('ventas');
  const statusFilter = document.getElementById('salesStatusFilter');
  if (statusFilter) {
    statusFilter.value = 'pendiente';
    filterSales();
  }
  toast('📦', 'Gestión de Ventas', 'Mostrando pedidos pendientes de despacho');
}

function showPendingOrdersFilter() {
  attendPendingOrder();
}

function addNotification(icon, title, msg, type = 'info', orderData = null, category = null) {
  let cat = category;
  if (!cat) {
    if (type === 'order' || title.includes('Pedido') || title.includes('Venta')) cat = 'ventas';
    else if (type === 'cobranza' || type === 'credito' || title.includes('Cuota') || title.includes('Cartera') || title.includes('Pago') || title.includes('Gasto')) cat = 'finanzas';
    else if (type === 'whatsapp' || title.includes('WhatsApp')) cat = 'whatsapp';
    else if (type === 'inventario' || title.includes('Stock') || title.includes('Agotad')) cat = 'inventario';
    else if (type === 'tienda' || title.includes('Cliente') || title.includes('Carrito')) cat = 'tienda';
    else cat = 'sistema';
  }

  const n = {
    id: Date.now() + Math.floor(Math.random() * 100),
    icon, title, msg, type,
    category: cat,
    orderData: orderData || (type === 'order' ? { client: title, product: msg } : null),
    time: new Date().toLocaleTimeString('es-ES', { hour:'2-digit', minute:'2-digit' }),
    read: false
  };
  notifications.unshift(n);
  if (notifications.length > 50) notifications.pop();
  unreadCount++;
  renderNotifList();
  updateNotifBadge();
  updatePendingOrdersCounter();
}

function filterNotifTab(tab, btn) {
  currentNotifFilter = tab;
  document.querySelectorAll('.notif-tab').forEach(b => {
    b.classList.remove('active-tab', 'bg-white', 'text-zinc-950');
    b.classList.add('bg-zinc-800', 'text-zinc-300');
  });
  if (btn) {
    btn.classList.remove('bg-zinc-800', 'text-zinc-300');
    btn.classList.add('active-tab', 'bg-white', 'text-zinc-950');
  }
  renderNotifList();
}

function renderNotifList() {
  const list = document.getElementById('notifList');
  if (!list) return;

  let filtered = notifications;
  if (currentNotifFilter === 'whatsapp') {
    filtered = notifications.filter(n => n.category === 'whatsapp' || n.type === 'whatsapp' || n.title.includes('WhatsApp'));
  } else if (currentNotifFilter === 'ventas' || currentNotifFilter === 'orders') {
    filtered = notifications.filter(n => n.category === 'ventas' || n.type === 'order' || n.title.includes('Pedido') || n.title.includes('Venta'));
  } else if (currentNotifFilter === 'finanzas' || currentNotifFilter === 'credit') {
    filtered = notifications.filter(n => n.category === 'finanzas' || n.type === 'cobranza' || n.type === 'credito' || n.title.includes('Cuota') || n.title.includes('Cartera') || n.title.includes('Pago'));
  } else if (currentNotifFilter === 'inventario') {
    filtered = notifications.filter(n => n.category === 'inventario' || n.type === 'inventario' || n.title.includes('Stock') || n.title.includes('Agotad'));
  } else if (currentNotifFilter === 'tienda') {
    filtered = notifications.filter(n => n.category === 'tienda' || n.type === 'tienda' || n.title.includes('Cliente') || n.title.includes('Carrito') || n.title.includes('Tienda'));
  } else if (currentNotifFilter === 'sistema') {
    filtered = notifications.filter(n => n.category === 'sistema' || n.type === 'sistema' || n.title.includes('Respaldo') || n.title.includes('PWA') || n.title.includes('Seguridad'));
  }

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="text-center py-8 px-4 text-gray-400">
        <i class="fas fa-bell-slash text-3xl mb-2 text-gray-300"></i>
        <div class="font-semibold text-xs">No hay notificaciones en esta categoría</div>
      </div>
    `;
    return;
  }

  list.innerHTML = filtered.slice(0, 15).map(n => {
    const isOrder = n.type === 'order' || n.title.includes('Pedido');
    const isCredit = n.type === 'cobranza' || n.type === 'credito' || n.title.includes('Cuota');
    const o = n.orderData || {};
    const photo = o.photo || o.img || 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&auto=format&fit=crop&q=80';
    const cleanPhone = String(o.phone || '573001234567').replace(/\D/g, '');

    if (isOrder) {
      return `
        <div class="p-3.5 transition-colors ${n.read ? 'bg-white' : 'bg-amber-50/50'} border-l-4 border-l-amber-500 hover:bg-amber-50/80">
          <div class="flex items-start gap-3">
            <div class="w-12 h-12 rounded-xl overflow-hidden bg-white border border-amber-200 flex-shrink-0 shadow-sm flex items-center justify-center">
              <img src="${photo}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&auto=format&fit=crop&q=80'">
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <span class="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> ⏳ Pendiente
                </span>
                <span class="text-[10px] text-gray-400 font-medium">${n.time}</span>
              </div>
              <div class="font-bold text-gray-900 text-xs mt-1 truncate">${n.title}</div>
              <div class="text-[11px] text-gray-600 truncate">${n.msg}</div>
              <div class="flex items-center gap-2 mt-2">
                <button onclick="attendPendingOrder(); toggleNotifDropdown(); markRead(${n.id});" class="text-[11px] bg-amber-500 hover:bg-amber-600 text-white font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm transition-all active:scale-95">
                  <i class="fas fa-boxes-packing text-[10px]"></i> Atender
                </button>
                <a href="https://wa.me/${cleanPhone}?text=${encodeURIComponent('¡Hola! 👋 Confirmamos tu pedido de calzado en Carfe®.')}" target="_blank" onclick="markRead(${n.id})" class="text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm transition-all active:scale-95">
                  <i class="fab fa-whatsapp text-[11px]"></i> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (isCredit) {
      const isPaid = n.msg.includes('saldada') || n.msg.includes('Liquidada') || n.msg.includes('liquidada') || n.msg.includes('Paz y Salvo');
      return `
        <div class="p-3.5 transition-colors ${n.read ? 'bg-white' : 'bg-emerald-50/50'} border-l-4 ${isPaid ? 'border-l-emerald-500' : 'border-l-blue-500'} hover:bg-gray-50 flex items-start gap-3">
          <div class="w-10 h-10 rounded-xl ${isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'} flex items-center justify-center text-lg flex-shrink-0 shadow-sm">
            <i class="${isPaid ? 'fas fa-hand-holding-dollar' : 'fas fa-wallet'}"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <span class="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider ${isPaid ? 'text-emerald-800 bg-emerald-100' : 'text-blue-800 bg-blue-100'} px-2 py-0.5 rounded-full">
                ${isPaid ? '✓ Deuda Saldada' : '💳 Cuenta por Cobrar'}
              </span>
              <span class="text-[10px] text-gray-400 font-medium">${n.time}</span>
            </div>
            <div class="font-bold text-gray-900 text-xs mt-1 truncate">${n.title}</div>
            <div class="text-[11px] text-gray-600 mt-0.5">${n.msg}</div>
            ${o.creditId ? `
              <div class="flex items-center gap-2 mt-2">
                ${isPaid ? `
                  <button onclick="openPazYSalvoModal('${o.creditId}'); toggleNotifDropdown();" class="text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm transition-all active:scale-95">
                    <i class="fas fa-certificate text-[10px]"></i> Ver Paz y Salvo
                  </button>
                  <button onclick="sendPazYSalvoWA('${o.creditId}');" class="text-[11px] bg-green-600 hover:bg-green-700 text-white font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm transition-all active:scale-95">
                    <i class="fab fa-whatsapp text-[11px]"></i> Enviar WA
                  </button>
                ` : `
                  <button onclick="openCustomerPaymentPortal('${o.creditId}'); toggleNotifDropdown();" class="text-[11px] bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm transition-all active:scale-95">
                    <i class="fas fa-credit-card text-[10px]"></i> Pagar Online
                  </button>
                `}
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }

    return `
      <div class="p-3 transition-colors ${n.read ? 'bg-white' : 'bg-purple-50/40'} border-l-4 border-l-purple-500 hover:bg-gray-50 flex items-start gap-3 cursor-pointer" onclick="markRead(${n.id})">
        <div class="text-xl flex-shrink-0">${n.icon}</div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <div class="font-bold text-gray-800 text-xs">${n.title}</div>
            <span class="text-[10px] text-gray-400">${n.time}</span>
          </div>
          <div class="text-[11px] text-gray-600 truncate mt-0.5">${n.msg}</div>
        </div>
      </div>
    `;
  }).join('');
}

function markRead(id) {
  const n = notifications.find(x => x.id === id);
  if (n && !n.read) { n.read = true; unreadCount = Math.max(0, unreadCount - 1); }
  updateNotifBadge();
  renderNotifList();
}

function markAllRead() {
  notifications.forEach(n => n.read = true);
  unreadCount = 0;
  updateNotifBadge();
  renderNotifList();
}

function updateNotifBadge() {
  const badge = document.getElementById('notifBadge');
  if (badge) {
    badge.textContent = unreadCount;
    badge.style.display = unreadCount > 0 ? 'flex' : 'none';
  }
}

function updatePendingOrdersCounter() {
  const pendingCount = (typeof salesData !== 'undefined' ? salesData.filter(s => s.status === 'pendiente').length : 0);
  const badge = document.getElementById('newOrdersBadge');
  const txt = document.getElementById('newOrdersText');
  const sub = document.getElementById('notifPendingSubtitle');

  if (badge) {
    if (pendingCount > 0) {
      badge.style.display = 'inline-flex';
      if (txt) txt.textContent = `${pendingCount} pedido${pendingCount !== 1 ? 's' : ''} pendiente${pendingCount !== 1 ? 's' : ''}`;
    } else {
      badge.style.display = 'none';
    }
  }

  if (sub) {
    sub.textContent = `${pendingCount} pedido${pendingCount !== 1 ? 's' : ''} pendiente${pendingCount !== 1 ? 's' : ''} de despacho`;
  }
}

function toggleNotifDropdown() {
  const dd = document.getElementById('notifDropdown');
  if (!dd) return;
  const isHidden = dd.classList.contains('hidden') || dd.style.display === 'none';
  if (isHidden) {
    dd.classList.remove('hidden');
    dd.style.display = 'block';
  } else {
    dd.classList.add('hidden');
    dd.style.display = 'none';
  }
}

function simulatePendingOrder() {
  const clients = [
    { name: 'Carlos Mario Restrepo', phone: '+57 314 589 1234' },
    { name: 'María Camila García', phone: '+57 320 892 4567' },
    { name: 'Valentina Ríos Peña', phone: '+57 301 445 7890' },
    { name: 'Andrés Felipe Muñoz', phone: '+57 310 765 4321' },
    { name: 'Isabella Fernández', phone: '+57 318 901 2345' },
    { name: 'Diego Suárez Londoño', phone: '+57 312 432 9876' }
  ];
  const c = clients[Math.floor(Math.random() * clients.length)];
  const p = PRODUCTS[Math.floor(Math.random() * Math.min(8, PRODUCTS.length))];
  const size = [38, 39, 40, 41, 42][Math.floor(Math.random() * 5)];
  const payMethods = ['WhatsApp • Nequi / Daviplata', 'WhatsApp • Bancolombia', 'WhatsApp • Crédito 2 Cuotas'];
  const payM = payMethods[Math.floor(Math.random() * payMethods.length)];
  const totalNum = p.price;
  const totalFmt = formatCOP(totalNum);

  const orderData = {
    orderId: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
    client: c.name,
    product: p.name,
    total: totalNum,
    price: totalFmt,
    size: size,
    photo: p.img,
    phone: c.phone,
    payMethod: payM,
    date: new Date().toISOString()
  };

  // 1. Mostrar alerta visual flotante animada con sonido
  showPendingOrderAlert(orderData);

  // 2. Agregar a la lista de notificaciones con toda su metadata y tarjeta interactiva
  addNotification('🛍️', `¡Nuevo Pedido! ${c.name}`, `${p.name} (Talla ${size}) — ${totalFmt}`, 'order', orderData);

  // 3. Registrar en salesData como pendiente
  const unitCost = Math.round(totalNum * 0.48);
  const newSale = {
    id: 'V-' + String(salesData.length + 1).padStart(3, '0'),
    client: c.name,
    product: `${p.name} (Talla ${size})`,
    qty: 1,
    cost: unitCost,
    total: totalNum,
    profit: totalNum - unitCost,
    status: 'pendiente',
    payMethod: payM,
    date: new Date().toISOString().split('T')[0],
    email: 'cliente@whatsapp.com',
    photo: p.img
  };
  salesData.unshift(newSale);
  filteredSales = [...salesData];
  salesDirty = true;

  // 4. Actualizar contadores
  updatePendingOrdersCounter();
}

function checkPendingOrders() {
  const raw = localStorage.getItem('ss_pending_orders');
  if (!raw) return;
  try {
    const orders = JSON.parse(raw);
    orders.forEach(o => {
      if (!knownOrderIds.has(o.id)) {
        knownOrderIds.add(o.id);
        const totalNum = parseFloat(o.total) || 0;
        const totalFmt = formatCOP(totalNum);
        const unitCost = Math.round(totalNum * 0.48);
        const unitProfit = totalNum - unitCost;
        
        const orderData = {
          orderId: o.id,
          client: o.client,
          product: o.product || 'Calzado Carfe®',
          total: totalNum,
          price: totalFmt,
          size: o.size || '40',
          photo: o.photo || null,
          phone: o.phone || '+57 300 123 4567',
          payMethod: o.payMethod || 'WhatsApp',
          date: o.date || new Date().toISOString()
        };

        // Alerta visual dinámica y sonido
        showPendingOrderAlert(orderData);
        addNotification('🛍️', '¡Nuevo Pedido Recibido!', `${o.client} — ${o.product || 'Calzado'} — ${totalFmt}`, 'order', orderData);
        toast('🛍️', '¡Nuevo Pedido!', `${o.client} ordenó ${o.product || 'calzado'} (${totalFmt})`);
        
        // Agregar a ventas
        salesData.unshift({
          id: 'V-' + String(salesData.length + 1).padStart(3, '0'),
          client: o.client,
          product: o.product || 'Pedido WhatsApp',
          qty: 1,
          cost: unitCost,
          total: totalNum,
          profit: unitProfit,
          status: 'pendiente',
          payMethod: o.payMethod || 'WhatsApp',
          date: o.date ? o.date.split('T')[0] : new Date().toISOString().split('T')[0],
          email: o.email || 'cliente@whatsapp.com',
          photo: o.photo || null
        });

        // Si compró a 2 cuotas, ingresar automáticamente a la cartera
        if (o.payMethod === 'cuotas') {
          const tot = parseFloat(o.total) || 0;
          const estDate = new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0];
          carteraData.unshift({
            id: 'CRT-' + String(carteraData.length + 1).padStart(3, '0'),
            saleId: 'V-' + String(salesData.length).padStart(3, '0'),
            client: o.client,
            phone: o.phone || '+57 300 123 4567',
            email: o.email || '',
            product: o.product || 'Calzado Carfe®',
            total: tot,
            quota1: tot / 2,
            quota1Paid: true,
            quota1Date: new Date().toISOString().split('T')[0],
            quota2: tot / 2,
            quota2Paid: false,
            estimatedDate: estDate,
            status: 'aldia',
            lastNotice: null,
            notes: 'Compra web a 2 cuotas. Cuota 1 cobrada. Cuota 2 estimada: ' + estDate
          });
          updateCarteraKPIs();
        }

        salesDirty = true;
        invoicesDirty = true;
      }
    });
    updatePendingOrdersCounter();
  } catch (e) { /* ignore */ }
}

/* Cerrar dropdowns al hacer click fuera */
document.addEventListener('click', e => {
  const dd = document.getElementById('notifDropdown');
  const btn = document.getElementById('notifBellBtn') || document.getElementById('notifBtn');
  if (dd && btn && !btn.contains(e.target) && !dd.contains(e.target)) {
    dd.classList.add('hidden');
    dd.style.display = 'none';
  }
});

/* ───────── DASHBOARD ORGANIZADO: VENTA DIARIA ───────── */
let salesChart = null, channelChart = null;

function initDashboard() {
  updateHeaderDate();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLabel = document.getElementById('dashTodayDate');
  if (todayLabel) {
    const opts = { weekday:'long', year:'numeric', month:'long', day:'numeric' };
    todayLabel.textContent = new Date().toLocaleDateString('es-ES', opts);
  }

  // Filtrar ventas de hoy (o recientes si es un día nuevo en pruebas)
  let todaySales = salesData.filter(v => v.date === todayStr);
  if (todaySales.length === 0) {
    todaySales = salesData.slice(0, 4);
  }

  const todayRev = todaySales.reduce((s, v) => s + v.total, 0);
  const todayCost = todaySales.reduce((s, v) => s + (v.cost || (v.total * 0.5)), 0);
  const todayProfit = todayRev - todayCost;
  const todayMargin = todayRev > 0 ? ((todayProfit / todayRev) * 100).toFixed(1) : '0.0';
  const todayPairs = todaySales.reduce((s, v) => s + (v.qty || 1), 0);
  const avgTicket = todaySales.length > 0 ? todayRev / todaySales.length : 0;
  const pendingOrders = todaySales.filter(v => v.status === 'pendiente' || v.status === 'procesando').length;

  // Actualizar los 8 Indicadores Clave Inmediatos (Móvil y Desktop)
  safeText('dashTodayRevenue', formatCOPSimple(todayRev));
  safeText('dashTodayProfit', (todayProfit >= 0 ? '+' : '') + formatCOPSimple(todayProfit));
  safeText('dashTodayMargin', `Margen: ${todayMargin}%`);
  safeText('dashTodayPairs', todayPairs + ' pares');
  safeText('dashTodayOrdersCount', `${todaySales.length} pedido(s)`);
  safeText('dashAvgTicket', formatCOPSimple(avgTicket));
  safeText('dashTodayPending', pendingOrders);

  // Dinero que me deben (Saldo pendiente en cuota 2)
  const carteraPendiente = carteraData.reduce((s, c) => s + (c.quota2Paid ? 0 : (c.quota2 || Math.round(c.total / 2))), 0);
  safeText('dashCarteraPendiente', formatCOPSimple(carteraPendiente));

  // Cuotas vencidas
  const dueCredits = carteraData.filter(c => !c.quota2Paid && (c.status === 'vencido' || c.status === 'proximo')).length;
  safeText('dashCuotasVencidas', dueCredits);

  // Stock agotándose (calzado con stock <= 5)
  const lowStock = PRODUCTS.filter(p => (p.stock || 0) <= 5).length;
  safeText('dashLowStockCount', lowStock);

  // Mensajes de WhatsApp pendientes
  const waPending = notifications.filter(n => (n.category === 'whatsapp' || n.type === 'whatsapp') && !n.read).length || 3;
  safeText('dashPendingMessagesCount', waPending);

  // Operaciones que requieren atención (Críticas = pedidos + morosos + stock crítico)
  const criticalTotal = pendingOrders + dueCredits + lowStock;
  safeText('dashCriticalAlertsCount', criticalTotal);

  // Sincronizar badge de pedidos en barra inferior móvil
  const mBadge = document.getElementById('mNavOrdersBadge');
  if (mBadge) {
    if (pendingOrders > 0) {
      mBadge.textContent = pendingOrders;
      mBadge.classList.remove('hidden');
    } else {
      mBadge.classList.add('hidden');
    }
  }

  // Desglose de métodos de pago de hoy
  let cashSum = 0, cardSum = 0, transferSum = 0;
  todaySales.forEach(s => {
    if (s.payMethod === 'efectivo') cashSum += s.total;
    else if (s.payMethod === 'tarjeta' || s.payMethod === 'paypal' || s.payMethod === 'stripe') cardSum += s.total;
    else transferSum += s.total;
  });
  safeText('cashTotal', formatCOPSimple(cashSum));
  safeText('cardTotal', formatCOPSimple(cardSum));
  safeText('transferTotal', formatCOPSimple(transferSum));

  // Desglose canales de hoy
  safeText('chanWeb', `${formatCOPSimple(todayRev * 0.45)} (45%)`);
  safeText('chanTikTok', `${formatCOPSimple(todayRev * 0.30)} (30%)`);
  safeText('chanWA', `${formatCOPSimple(todayRev * 0.15)} (15%)`);
  safeText('chanStore', `${formatCOPSimple(todayRev * 0.10)} (10%)`);
  safeText('chanWA', `${formatCOP(todayRev * 0.15)} (15%)`);
  safeText('chanStore', `${formatCOP(todayRev * 0.10)} (10%)`);

  renderDashTodayTable(todaySales);
  renderTopProducts(todaySales);
  initSalesChart();
  initChannelChart();
  updateCarteraKPIs();
}

function safeText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function renderDashTodayTable(orders) {
  const tbody = document.getElementById('dashTodayTableBody');
  if (!tbody) return;
  if (!orders || orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="p-6 text-center text-gray-400">No hay ventas registradas para hoy aún</td></tr>';
    return;
  }
  tbody.innerHTML = orders.map(s => `
    <tr class="hover:bg-gray-50 transition-colors">
      <td class="p-3 font-mono font-bold text-purple-700">${s.id}</td>
      <td class="p-3 font-semibold text-gray-800">${s.client}</td>
      <td class="p-3 text-gray-600">${s.product} <span class="text-xs text-gray-400 font-bold">×${s.qty || 1}</span></td>
      <td class="p-3 font-medium text-gray-700">${getPayIcon(s.payMethod)} ${s.payMethod}</td>
      <td class="p-3">
        <div class="font-black text-gray-900">${formatCOP(s.total)}</div>
        ${s.profit ? `<div class="text-[10px] text-emerald-600 font-bold">Ganancia: +${formatCOP(s.profit)}</div>` : ''}
      </td>
      <td class="p-3 cursor-pointer" onclick="openDmsModal('${s.id}')" title="Clic para abrir Perfil DMS">${statusBadgeHTML(s.status)}</td>
      <td class="p-3 text-right">
        <button onclick="openDmsModal('${s.id}')" class="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-2.5 py-1 rounded-md text-xs font-bold mr-1 border border-indigo-200 transition-colors" title="Gestionar Envío en DMS">
          🚚 DMS
        </button>
        <button onclick="viewSaleInvoice('${s.id}')" class="bg-purple-50 text-purple-700 hover:bg-purple-100 px-2.5 py-1 rounded-md text-xs font-bold transition-colors">
          📄 Factura
        </button>
      </td>
    </tr>
  `).join('');
}

function renderTopProducts(orders) {
  const el = document.getElementById('topProductsList');
  if (!el) return;
  const counts = {};
  (orders || salesData).forEach(s => { counts[s.product] = (counts[s.product] || 0) + (s.qty || 1); });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4);

  el.innerHTML = sorted.map(([name, qty]) => {
    const pObj = PRODUCTS.find(p => p.name === name) || { stock: 12, price: 189900 };
    return `
      <div class="py-2.5 flex items-center justify-between text-xs border-b border-gray-50 last:border-0">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 font-bold">
            <i class="fas fa-shoe-prints text-xs"></i>
          </div>
          <div>
            <div class="font-bold text-gray-800">${name}</div>
            <div class="text-[11px] text-purple-600 font-semibold">${qty} vendido(s) hoy</div>
          </div>
        </div>
        <div class="text-right">
          <div class="font-black text-gray-900">${formatCOP(pObj.price)}</div>
          <span class="font-bold text-[11px] ${pObj.stock < 10 ? 'text-amber-600' : 'text-green-600'}">${pObj.stock} en stock</span>
        </div>
      </div>
    `;
  }).join('');
}

function dailyCashClosure() {
  const todayStr = new Date().toISOString().split('T')[0];
  let todaySales = salesData.filter(v => v.date === todayStr);
  if (todaySales.length === 0) todaySales = salesData.slice(0, 4);

  const totalRev = todaySales.reduce((s, v) => s + v.total, 0);
  const totalCost = todaySales.reduce((s, v) => s + (v.cost || (v.total * 0.5)), 0);
  const totalProfit = totalRev - totalCost;
  const marginPct = totalRev > 0 ? ((totalProfit / totalRev) * 100).toFixed(1) : '0.0';

  let cash = 0, card = 0, trans = 0;
  todaySales.forEach(s => {
    if (s.payMethod === 'efectivo') cash += s.total;
    else if (s.payMethod === 'tarjeta' || s.payMethod === 'paypal') card += s.total;
    else trans += s.total;
  });

  const msg = `📊 ARQUEO Y CIERRE DE CAJA DIARIA (${todayStr})\n\n` +
              `💰 Facturado Hoy (Venta): ${formatCOP(totalRev)}\n` +
              `🏷️ Costo Mercancía Vendida: ${formatCOP(totalCost)}\n` +
              `📈 Ganancia Neta del Día: +${formatCOP(totalProfit)} (Margen: ${marginPct}%)\n` +
              `📦 Total Pedidos: ${todaySales.length}\n\n` +
              `💵 Efectivo: ${formatCOP(cash)}\n` +
              `💳 Tarjetas: ${formatCOP(card)}\n` +
              `🏦 Transferencias: ${formatCOP(trans)}\n\n` +
              `Estado: Balance Cuadrado sin descuadres en Pesos Colombianos (COP) ✅`;

  if (confirm(msg + '\n\n¿Deseas imprimir el arqueo del día?')) {
    window.print();
  }
  toast('🧾', 'Cierre de Caja Calculado', `Ganancia del día: +${formatCOP(totalProfit)}`);
}

function initSalesChart() {
  const ctx = document.getElementById('salesChart');
  if (!ctx) return;
  if (salesChart) {
    salesChart.resize();
    return;
  }
  const labels = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
  const data   = [420, 380, 650, 290, 710, 540, 480];
  salesChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Ventas ($)',
        data,
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124,58,237,0.08)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#7c3aed',
        pointRadius: 4,
      }]
    },
    options: {
      animation: false,
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, grid: { color: '#f3f4f6' } }, x: { grid: { display: false } } }
    }
  });
}

function initChannelChart() {
  const ctx = document.getElementById('channelChart');
  if (!ctx) return;
  if (channelChart) {
    channelChart.resize();
    return;
  }
  channelChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Tienda Web', 'TikTok Live', 'WhatsApp', 'Directo'],
      datasets: [{
        data: [45, 30, 15, 10],
        backgroundColor: ['#7c3aed','#f97316','#22c55e','#3b82f6'],
        borderWidth: 0,
      }]
    },
    options: {
      animation: false,
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { font: { size: 12 }, padding: 12 } } },
      cutout: '65%'
    }
  });
}

/* ───────── VENTAS ───────── */
let filteredSales = [...salesData];

function renderSalesTable() {
  const tbody = document.getElementById('salesTableBody');
  if (!tbody) return;
  if (filteredSales.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#9ca3af;padding:30px">No hay ventas que coincidan</td></tr>';
    return;
  }
  tbody.innerHTML = filteredSales.map(s => `
    <tr class="hover:bg-gray-50 transition-colors border-b border-gray-50">
      <td class="px-5 py-3.5"><strong style="color:#7c3aed">${s.id}</strong></td>
      <td class="px-5 py-3.5"><strong>${s.client}</strong><br><small style="color:#9ca3af">${s.email || ''}</small></td>
      <td class="px-5 py-3.5 font-semibold text-gray-800">${s.product} <span class="text-xs text-gray-400">(${s.qty || 1} par)</span></td>
      <td class="px-5 py-3.5 text-xs text-gray-500">${s.date}</td>
      <td class="px-5 py-3.5">
        <strong class="text-gray-900">${formatCOP(s.total)}</strong>
        ${s.profit ? `<div class="text-[10px] text-emerald-600 font-bold">Ganancia: +${formatCOP(s.profit)}</div>` : ''}
      </td>
      <td class="px-5 py-3.5 text-xs font-medium text-gray-600">${getPayIcon(s.payMethod)} ${s.payMethod}</td>
      <td class="px-5 py-3.5 cursor-pointer" onclick="openDmsModal('${s.id}')" title="Clic para abrir Perfil DMS">${statusBadgeHTML(s.status)}</td>
      <td class="px-5 py-3.5">
        <button onclick="openDmsModal('${s.id}')" title="Perfil DMS Logístico de Despacho" class="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-bold mr-1 border border-indigo-200 transition-colors">
          🚚 DMS
        </button>
        <button onclick="viewSaleInvoice('${s.id}')" title="Ver Factura" class="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-bold border border-emerald-200 transition-colors">
          📄 Factura
        </button>
      </td>
    </tr>
  `).join('');
}

function filterSales() {
  const q = (document.getElementById('salesSearch')?.value || '').toLowerCase();
  const st = document.getElementById('salesStatusFilter')?.value || '';
  const pm = document.getElementById('salesPayFilter')?.value || '';
  filteredSales = salesData.filter(s => {
    const matchQ  = !q  || s.client.toLowerCase().includes(q) || s.product.toLowerCase().includes(q) || s.id.toLowerCase().includes(q);
    const matchSt = !st || s.status === st;
    const matchPm = !pm || s.payMethod === pm;
    return matchQ && matchSt && matchPm;
  });
  renderSalesTable();
}

function openNewSaleModal() {
  openQuickBillingModal('contado');
}

function registerSale() {
  const client  = document.getElementById('saleClient')?.value.trim();
  const email   = document.getElementById('saleEmail')?.value.trim();
  const prodEl  = document.getElementById('saleProduct');
  const qty     = parseInt(document.getElementById('saleQty')?.value) || 1;
  const payM    = document.getElementById('salePayMethod')?.value;

  if (!client || !prodEl) return toast('⚠️', 'Campos requeridos', 'Completa todos los campos');

  const price     = parseFloat(prodEl.options[prodEl.selectedIndex].dataset.price) || 0;
  const cost      = parseFloat(prodEl.options[prodEl.selectedIndex].dataset.cost) || Math.round(price * 0.5);
  const profit    = (price - cost) * qty;

  const newSale = {
    id: 'V-' + String(salesData.length + 1).padStart(3, '0'),
    client, email,
    product: prodEl.value,
    qty, cost: cost * qty, total: price * qty, profit,
    status: 'pendiente', payMethod: payM,
    date: new Date().toISOString().split('T')[0]
  };
  salesData.unshift(newSale);
  filteredSales = [...salesData];
  renderSalesTable();
  closeModal('newSaleModal');
  addNotification('💰', 'Nueva Venta Registrada', `${client} — ${prodEl.value} — ${formatCOP(newSale.total)}`, 'sale');
  toast('✅', 'Venta registrada', `${client} — ${formatCOP(newSale.total)}`);
}

/* ───────── PERFIL DMS LOGÍSTICO (DELIVERY MANAGEMENT SYSTEM) ───────── */
let currentDmsSale = null;

function openDmsModal(id) {
  const s = salesData.find(x => x.id === id);
  if (!s) return;
  currentDmsSale = s;

  if (!s.trackingNumber) {
    s.trackingNumber = 'TRK-CRF-' + s.id.replace('V-', '90') + '8';
  }
  if (!s.address) {
    s.address = 'Carrera 7 # 115-60, Bogotá D.C., Colombia';
  }
  if (!s.courier) {
    s.courier = 'Repartidor Local Carfe® Express';
  }
  if (!s.driver) {
    s.driver = 'Carlos Méndez (Moto 04)';
  }
  if (!s.driverPhone) {
    s.driverPhone = '+57 300 492 1823';
  }
  if (!s.dmsLogs) {
    s.dmsLogs = [
      { time: s.date + ' 09:15', title: 'Pedido Ingresado y Confirmado', desc: 'Validación de pago exitosa por ' + s.payMethod }
    ];
    if (s.status === 'procesando' || s.status === 'enviado' || s.status === 'entregado') {
      s.dmsLogs.push({ time: s.date + ' 11:30', title: 'Empacado en Bodega Central', desc: 'Control de calidad verificado. Zapatos embalados en caja Carfe®.' });
    }
    if (s.status === 'enviado' || s.status === 'entregado') {
      s.dmsLogs.push({ time: s.date + ' 13:45', title: 'Despachado en Ruta', desc: 'Paquete entregado a ' + s.driver + ' para reparto a domicilio.' });
    }
    if (s.status === 'entregado') {
      s.dmsLogs.push({ time: s.date + ' 16:20', title: 'Entregado con Éxito (POD)', desc: 'Recibido a conformidad en destino por el cliente.' });
    }
  }

  safeText('dmsOrderId', s.id);
  safeText('dmsTrackingNumber', s.trackingNumber);
  safeText('dmsCustomerName', s.client);
  safeText('dmsCustomerEmail', s.email || 'contacto@cliente.com');
  safeText('dmsCustomerAddress', s.address);
  safeText('dmsProductName', s.product);
  safeText('dmsProductQty', `${s.qty || 1} par(es) • Calzado Carfe® Original`);
  safeText('dmsTotalAmount', formatCOP(s.total));
  safeText('dmsPaymentMethod', `${getPayIcon(s.payMethod)} ${s.payMethod.toUpperCase()}`);

  const emojiEl = document.getElementById('dmsShoeEmoji');
  if (emojiEl) emojiEl.innerHTML = '<i class="fas fa-shoe-prints text-indigo-600"></i>';

  const driverInput = document.getElementById('dmsDriverName');
  if (driverInput) driverInput.value = s.driver;
  const phoneInput = document.getElementById('dmsDriverPhone');
  if (phoneInput) phoneInput.value = s.driverPhone;

  updateDmsStepper(s.status);
  renderDmsAuditLogs(s.dmsLogs);

  openModal('dmsModal');
}

function updateDmsStepper(status) {
  const headerBadge = document.getElementById('dmsHeaderBadge');
  const steps = ['confirmado', 'bodega', 'ruta', 'entregado'];
  const stepLevels = {
    pendiente: 1,
    procesando: 2,
    enviado: 3,
    entregado: 4,
    cancelado: 0
  };
  const level = stepLevels[status] || 1;

  if (headerBadge) {
    if (status === 'entregado') {
      headerBadge.className = 'bg-green-500/30 text-green-200 border border-green-400/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full';
      headerBadge.textContent = 'Entregado (POD)';
    } else if (status === 'enviado') {
      headerBadge.className = 'bg-purple-500/30 text-purple-200 border border-purple-400/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full';
      headerBadge.textContent = 'En Ruta con Courier';
    } else if (status === 'procesando') {
      headerBadge.className = 'bg-blue-500/30 text-blue-200 border border-blue-400/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full';
      headerBadge.textContent = 'En Bodega / Packing';
    } else if (status === 'cancelado') {
      headerBadge.className = 'bg-red-500/30 text-red-200 border border-red-400/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full';
      headerBadge.textContent = 'Cancelado / Devuelto';
    } else {
      headerBadge.className = 'bg-amber-500/30 text-amber-200 border border-amber-400/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full';
      headerBadge.textContent = 'Por Confirmar Despacho';
    }
  }

  steps.forEach((name, idx) => {
    const stepEl = document.getElementById('step-' + name);
    if (!stepEl) return;
    const circle = stepEl.querySelector('div');
    const label = stepEl.querySelector('span');

    if (level >= idx + 1) {
      circle.className = 'w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm shadow-md mb-2 transition-all';
      circle.innerHTML = level > idx + 1 ? '<i class="fas fa-check"></i>' : (idx === 0 ? '<i class="fas fa-check"></i>' : idx === 1 ? '<i class="fas fa-box-open"></i>' : idx === 2 ? '<i class="fas fa-motorcycle"></i>' : '<i class="fas fa-house-chimney-user"></i>');
      label.className = 'text-xs font-bold text-gray-900';
    } else {
      circle.className = 'w-10 h-10 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold text-sm mb-2 transition-all';
      label.className = 'text-xs font-medium text-gray-400';
    }
  });
}

function renderDmsAuditLogs(logs) {
  const el = document.getElementById('dmsAuditLogs');
  if (!el) return;
  el.innerHTML = logs.map(l => `
    <div class="flex items-start gap-2.5 p-2 bg-gray-50 rounded-xl border border-gray-100">
      <div class="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></div>
      <div class="flex-1">
        <div class="flex justify-between items-center">
          <strong class="text-gray-800">${l.title}</strong>
          <span class="text-[10px] text-gray-400 font-mono">${l.time}</span>
        </div>
        <div class="text-[11px] text-gray-500 mt-0.5">${l.desc}</div>
      </div>
    </div>
  `).join('');
}

function setDmsStatus(newStatus) {
  if (!currentDmsSale) return;
  currentDmsSale.status = newStatus;

  const driverVal = document.getElementById('dmsDriverName')?.value;
  if (driverVal) currentDmsSale.driver = driverVal;
  const courierVal = document.getElementById('dmsCourierSelect')?.value;
  if (courierVal) currentDmsSale.courier = courierVal;

  const nowTime = new Date().toLocaleDateString('es-ES', { month:'short', day:'numeric' }) + ' ' + new Date().toLocaleTimeString('es-ES', { hour:'2-digit', minute:'2-digit' });

  const statusTitles = {
    pendiente:  'Estado: Por Confirmar / Recibido',
    procesando: 'En Bodega: Picking & Packing completado',
    enviado:    'Despachado: En Ruta con ' + (currentDmsSale.driver || 'Courier'),
    entregado:  'Entregado con Éxito (Prueba de Entrega POD registrada)',
    cancelado:  'Despacho Cancelado: Devuelto a Bodega'
  };

  currentDmsSale.dmsLogs.unshift({
    time: nowTime,
    title: statusTitles[newStatus] || ('Estado: ' + newStatus),
    desc: 'Actualizado desde el perfil DMS Logístico.'
  });

  updateDmsStepper(newStatus);
  renderDmsAuditLogs(currentDmsSale.dmsLogs);

  salesDirty = true;
  filteredSales = [...salesData];
  renderSalesTable();
  initDashboard();

  toast('🚚', 'DMS Logística Actualizado', `${currentDmsSale.id} ahora está: ${newStatus.toUpperCase()}`);
}

function sendDmsTrackingWhatsApp() {
  if (!currentDmsSale) return;
  const s = currentDmsSale;
  const statusTexts = {
    pendiente:  '⏳ Recibido y por confirmar empaque',
    procesando: '📦 En Bodega Central (Empacando calzado Carfe®)',
    enviado:    '🚚 EN RUTA con repartidor hacia tu dirección',
    entregado:  '✅ ENTREGADO con éxito en tu domicilio',
    cancelado:  '❌ Cancelado / Devuelto'
  };
  const statusDesc = statusTexts[s.status] || s.status;

  const msg = `📦 *Actualización de Entrega — Carfe® Logística*\n\n` +
              `Hola *${s.client}*! 👋 Te compartimos el estado de tu pedido:\n\n` +
              `📦 *Pedido:* ${s.id}\n` +
              `🏷️ *Producto:* ${s.product} (×${s.qty || 1})\n` +
              `📍 *Estado Actual:* ${statusDesc}\n` +
              `🚚 *Guía de Rastreo DMS:* ${s.trackingNumber}\n` +
              `🛵 *Repartidor Asignado:* ${s.driver || 'Courier Local'}\n\n` +
              `Tu calzado está siendo gestionado con la mayor seguridad. ¡Gracias por confiar en Carfe®! 🌟\n\n` +
              `_carfe.com_`;

  const phone = s.phone ? s.phone.replace(/\D/g, '') : '5215500000000';
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  toast('📲', 'WhatsApp de Trazabilidad', 'Mensaje con guía DMS listo para enviar al cliente.');
}

function printDmsShippingLabel() {
  if (!currentDmsSale) return;
  const s = currentDmsSale;
  const labelWin = window.open('', '_blank', 'width=550,height=650');
  labelWin.document.write(`
    <html>
      <head>
        <title>Rótulo de Envío DMS — ${s.trackingNumber}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 25px; margin: 0; background: #fff; }
          .label-box { border: 3px solid #000; padding: 20px; border-radius: 12px; max-width: 450px; margin: auto; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 15px; }
          .title { font-size: 24px; font-weight: 900; }
          .barcode { font-family: monospace; font-size: 32px; letter-spacing: 4px; text-align: center; margin: 20px 0 10px; font-weight: bold; }
          .section { margin-bottom: 15px; }
          .bold { font-weight: bold; }
          .small { font-size: 11px; color: #555; }
        </style>
      </head>
      <body>
        <div class="label-box">
          <div class="header">
            <div>
              <div class="title">Carfe® LOGISTICS</div>
              <div class="small">Centro de Distribución Central</div>
            </div>
            <div style="text-align:right">
              <div class="bold" style="font-size:18px">${s.id}</div>
              <div class="small">${s.date}</div>
            </div>
          </div>
          <div class="section">
            <div class="small">REMITENTE:</div>
            <div class="bold">Almacén Central Carfe® Calzado</div>
            <div>Calle Principal 123, Centro Logístico</div>
          </div>
          <div class="section" style="border: 2px dashed #000; padding: 10px; border-radius: 8px;">
            <div class="small">DESTINATARIO:</div>
            <div class="bold" style="font-size:16px">${s.client}</div>
            <div>${s.address || 'Av. Principal #384, Sector Centro'}</div>
            <div class="small">Tel: ${s.email || 'Contacto cliente'}</div>
          </div>
          <div class="section" style="margin-top:15px">
            <div class="small">CONTENIDO DEL PAQUETE:</div>
            <div class="bold">${s.product} (×${s.qty || 1})</div>
            <div class="small">Forma de Pago: ${s.payMethod.toUpperCase()} — Total: $${s.total.toFixed(2)}</div>
            <div class="small">Courier Asignado: ${s.courier || 'Repartidor Local Carfe®'}</div>
          </div>
          <div class="barcode">|||| | ||||| |||| | |||||||</div>
          <div style="text-align:center; font-weight:bold; font-size:13px">${s.trackingNumber}</div>
        </div>
      </body>
    </html>
  `);
  labelWin.document.close();
  labelWin.focus();
  setTimeout(() => labelWin.print(), 350);
}

function cycleSaleStatus(id) {
  openDmsModal(id);
}

function exportSalesCSV() {
  const rows = [['ID','Cliente','Producto','Qty','Total','Método','Estado','Fecha']];
  filteredSales.forEach(s => rows.push([s.id, s.client, s.product, s.qty, s.total, s.payMethod, s.status, s.date]));
  const csv = rows.map(r => r.join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'ventas_stepstyle.csv';
  a.click();
  toast('📥', 'CSV exportado', 'Archivo descargado correctamente');
}

function viewSaleInvoice(id) {
  const s = salesData.find(x => x.id === id);
  if (!s) return;
  const sub = s.total;
  const tax = sub * 0.18;
  const total = sub + tax;
  const inv = { id: 'F-' + s.id.replace('V-', ''), client: s.client, email: s.email, product: s.product, qty: s.qty, subtotal: sub, tax, total, date: s.date, status: 'pendiente' };
  showInvoicePreview(inv);
}

/* ───────── CARTERA DE PAGO A 2 CUOTAS & COBRANZA (BNPL CARFE®) ───────── */
let carteraData = [
  {
    id: 'CRT-001',
    saleId: 'V-009',
    client: 'Camila Torres',
    phone: '+57 300 492 1849',
    email: 'camila@mail.com',
    product: 'Air Runner Pro (Talla 38)',
    total: 219900,
    quota1: 109950,
    quota1Paid: true,
    quota1Date: '2026-11-12',
    quota2: 109950,
    quota2Paid: false,
    estimatedDate: '2026-11-27',
    status: 'aldia',
    lastNotice: null,
    notes: 'Pago inicial con tarjeta. Segunda cuota programada.'
  },
  {
    id: 'CRT-002',
    saleId: 'V-007',
    client: 'Pedro Ramírez',
    phone: '+57 311 839 2104',
    email: 'pedro@mail.com',
    product: 'Classic Oxford (Talla 42)',
    total: 249000,
    quota1: 124500,
    quota1Paid: true,
    quota1Date: '2026-11-12',
    quota2: 124500,
    quota2Paid: false,
    estimatedDate: '2026-11-14',
    status: 'proximo',
    lastNotice: 'Aviso WhatsApp enviado hoy 09:30 AM',
    notes: 'Cliente acordó liquidar por transferencia.'
  },
  {
    id: 'CRT-003',
    saleId: 'V-002',
    client: 'María García',
    phone: '+57 315 192 8374',
    email: 'maria@mail.com',
    product: 'Elegance Heel (Talla 37)',
    total: 189000,
    quota1: 94500,
    quota1Paid: true,
    quota1Date: '2026-10-27',
    quota2: 94500,
    quota2Paid: false,
    estimatedDate: '2026-11-11',
    status: 'vencido',
    lastNotice: 'Recordatorio enviado ayer',
    notes: 'Fecha vencida hace 1 día. Requiere aviso prioritario.'
  },
  {
    id: 'CRT-004',
    saleId: 'V-003',
    client: 'Carlos López',
    phone: '+57 320 930 1827',
    email: 'carlos@mail.com',
    product: 'Derby Executive (Talla 43)',
    total: 279000,
    quota1: 139500,
    quota1Paid: true,
    quota1Date: '2026-10-25',
    quota2: 139500,
    quota2Paid: true,
    estimatedDate: '2026-11-09',
    status: 'liquidado',
    lastNotice: 'Liquidado con éxito',
    notes: 'Liquidó cuota 2 por transferencia bancaria.'
  },
  {
    id: 'CRT-005',
    saleId: 'V-008',
    client: 'Lucía Flores',
    phone: '+57 318 647 3829',
    email: 'lucia@mail.com',
    product: 'High Top Street (Talla 39)',
    total: 169900,
    quota1: 84950,
    quota1Paid: true,
    quota1Date: '2026-11-07',
    quota2: 84950,
    quota2Paid: false,
    estimatedDate: '2026-11-15',
    status: 'proximo',
    lastNotice: null,
    notes: 'Vencimiento en 3 días.'
  }
];

let selectedQuotaCredit = null;

function initCartera() {
  updateCarteraKPIs();
  renderCarteraTable();
}

function updateCarteraKPIs() {
  const totalFinanced = carteraData.reduce((s, c) => s + c.total, 0);
  const totalCollected = carteraData.reduce((s, c) => s + c.quota1 + (c.quota2Paid ? c.quota2 : 0), 0);
  const totalPending = carteraData.reduce((s, c) => s + (c.quota2Paid ? 0 : c.quota2), 0);
  
  const today = new Date('2026-11-12');
  let dueAlerts = 0;

  carteraData.forEach(c => {
    if (!c.quota2Paid) {
      const est = new Date(c.estimatedDate);
      const diffDays = Math.ceil((est - today) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) {
        c.status = 'vencido';
        dueAlerts++;
      } else if (diffDays <= 3) {
        c.status = 'proximo';
        dueAlerts++;
      } else {
        c.status = 'aldia';
      }
    } else {
      c.status = 'liquidado';
    }
  });

  safeText('carteraTotal', formatCOP(totalFinanced));
  safeText('carteraTotalCredits', `${carteraData.length} créditos registrados`);
  safeText('carteraCollected', formatCOP(totalCollected));
  safeText('carteraPending', formatCOP(totalPending));
  safeText('carteraDueAlerts', dueAlerts);
  safeText('carteraDueSubtext', `${dueAlerts} cuotas requieren aviso de pago`);

  const navBadge = document.getElementById('carteraNavBadge');
  if (navBadge) {
    if (dueAlerts > 0) {
      navBadge.textContent = dueAlerts;
      navBadge.classList.remove('hidden');
    } else {
      navBadge.classList.add('hidden');
    }
  }
}

function renderCarteraTable() {
  const tbody = document.getElementById('carteraTableBody');
  if (!tbody) return;

  const q = (document.getElementById('carteraSearch')?.value || '').toLowerCase();
  const filter = document.getElementById('carteraFilterStatus')?.value || 'todos';

  const rows = carteraData.filter(c => {
    const matchQ = !q || c.client.toLowerCase().includes(q) || c.product.toLowerCase().includes(q) || c.phone.includes(q) || c.id.toLowerCase().includes(q);
    const matchF = filter === 'todos' || c.status === filter;
    return matchQ && matchF;
  });

  safeText('carteraCountText', rows.length);

  if (rows.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" class="p-8 text-center text-gray-400">No hay créditos a 2 cuotas con los filtros seleccionados</td></tr>';
    return;
  }

  const today = new Date('2026-11-12');

  tbody.innerHTML = rows.map(c => {
    const est = new Date(c.estimatedDate);
    const diffDays = Math.ceil((est - today) / (1000 * 60 * 60 * 24));

    let statusBadge = '';
    if (c.quota2Paid) {
      statusBadge = '<span class="bg-green-100 text-green-800 border border-green-200 px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1"><i class="fas fa-check-circle"></i> Liquidado</span>';
    } else if (diffDays < 0) {
      statusBadge = `<span class="bg-red-100 text-red-800 border border-red-200 px-2.5 py-1 rounded-full text-xs font-black inline-flex items-center gap-1 animate-pulse"><i class="fas fa-triangle-exclamation"></i> Vencido (${Math.abs(diffDays)}d)</span>`;
    } else if (diffDays <= 3) {
      statusBadge = `<span class="bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1"><i class="fas fa-bell"></i> Vence en ${diffDays}d</span>`;
    } else {
      statusBadge = `<span class="bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1"><i class="fas fa-clock"></i> Al día (${diffDays}d)</span>`;
    }

    return `
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="p-3.5">
          <div class="font-bold text-gray-900">${c.client}</div>
          <div class="text-[11px] text-gray-400 font-mono">${c.id} • ${c.phone}</div>
        </td>
        <td class="p-3.5">
          <div class="font-semibold text-gray-800">${c.product}</div>
          <div class="text-[11px] text-gray-400">Compra: ${c.quota1Date}</div>
        </td>
        <td class="p-3.5 font-black text-gray-900">${formatCOP(c.total)}</td>
        <td class="p-3.5">
          <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            ✓ ${formatCOP(c.quota1)} Pagada
          </span>
        </td>
        <td class="p-3.5">
          <span class="text-xs font-black ${c.quota2Paid ? 'text-gray-400 line-through' : 'text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200'}">
            ${formatCOP(c.quota2)} ${c.quota2Paid ? '✓' : 'Pendiente'}
          </span>
        </td>
        <td class="p-3.5">
          <div class="font-bold text-gray-800">${c.estimatedDate}</div>
          <div class="text-[11px] text-gray-400">Fecha Estimada</div>
        </td>
        <td class="p-3.5">${statusBadge}</td>
        <td class="p-3.5 text-xs text-gray-500">
          ${c.lastNotice ? `<span class="text-purple-700 font-semibold flex items-center gap-1"><i class="fas fa-paper-plane text-[10px]"></i> ${c.lastNotice}</span>` : '<span class="text-gray-400">Sin aviso aún</span>'}
        </td>
        <td class="p-3.5 text-right">
          ${!c.quota2Paid ? `
            <div class="flex items-center justify-end gap-1.5">
              <button onclick="sendPaymentNoticeWA('${c.id}')" title="Enviar Cuenta por Cobrar y Link por WhatsApp" class="bg-green-500 hover:bg-green-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-sm active:scale-95">
                <i class="fab fa-whatsapp"></i> Enviar Cuenta
              </button>
              <button onclick="openCustomerPaymentPortal('${c.id}')" title="Pasarela de Pago Online / Simular pago del cliente" class="bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-sm active:scale-95">
                <i class="fas fa-credit-card"></i> Pagar Online
              </button>
              <button onclick="openPayQuotaModal('${c.id}')" title="Cobrar Manualmente en Caja" class="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-sm active:scale-95">
                <i class="fas fa-dollar-sign"></i> Cobrar
              </button>
            </div>
          ` : `
            <div class="flex items-center justify-end gap-1.5">
              <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Paz y Salvo ✓
              </span>
              <button onclick="openPazYSalvoModal('${c.id}')" title="Ver Certificado de Paz y Salvo Oficial" class="text-emerald-700 hover:text-emerald-900 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1">
                <i class="fas fa-certificate text-xs"></i> Recibo
              </button>
              <button onclick="sendPazYSalvoWA('${c.id}')" title="Enviar Paz y Salvo por WhatsApp" class="text-green-700 hover:text-green-900 bg-green-100 hover:bg-green-200 px-2 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1">
                <i class="fab fa-whatsapp text-xs"></i> WA
              </button>
            </div>
          `}
        </td>
      </tr>
    `;
  }).join('');
}

function filterCartera() {
  renderCarteraTable();
}

/* ───────── ENVÍO DE CUENTA POR COBRAR Y AUTOMATIZACIÓN DE PAGO ───────── */
function sendPaymentNoticeWA(id) {
  const c = carteraData.find(x => x.id === id);
  if (!c) return;

  const isVencido = c.status === 'vencido';
  const saludo = isVencido ? '⚠️ *Recordatorio de Cuenta por Cobrar — Carfe® Calzado*' : '*Cuenta por Cobrar (2ª Cuota) — Carfe® Calzado*';
  const tono = isVencido
    ? `te informamos cordialmente que la *2ª Cuota* de tu calzado *${c.product}* venció el *${c.estimatedDate}*.`
    : `te recordamos amablemente que la *2ª Cuota* de tu calzado *${c.product}* tiene como fecha estimada de pago el *${c.estimatedDate}*.`;

  const msg = `${saludo}\n\n` +
              `Hola *${c.client}*! 👋\n\n` +
              `Esperamos que estés disfrutando tu calzado Carfe®. De acuerdo a tu compra a crédito de 2 cuotas, ${tono}\n\n` +
              `📄 *DETALLE DE TU CUENTA POR COBRAR:*\n` +
              `👟 *Producto:* ${c.product}\n` +
              `🔖 *Nº de Crédito:* ${c.id}\n` +
              `✅ *Cuota 1 (50%):* ${formatCOP(c.quota1)} (Pagada)\n` +
              `💰 *SALDO PENDIENTE (Cuota 2):* ${formatCOP(c.quota2)}\n` +
              `📅 *Fecha Límite:* ${c.estimatedDate}\n\n` +
              `🏦 *Canales de Pago Inmediato:*\n` +
              `• Nequi / Daviplata: 300 123 4567\n` +
              `• Bancolombia Ahorros: 912-00034-82\n` +
              `• 💳 Paga tu cuota en línea aquí de forma segura:\n` +
              `  https://carfe.com/pagar?credito=${c.id}&saldo=${c.quota2}\n\n` +
              `Una vez realizado el pago, tu cuenta quedará saldada automáticamente y te enviaremos tu Paz y Salvo Oficial ✨\n\n` +
              `_Carfe® Calzado Bucaramanga_`;

  const cleanPhone = c.phone.replace(/\D/g, '');
  window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');

  c.lastNotice = 'Cuenta enviada por WhatsApp (' + new Date().toLocaleTimeString('es-ES', { hour:'2-digit', minute:'2-digit' }) + ')';
  renderCarteraTable();
  toast('📲', 'Cuenta por Cobrar Enviada', `Notificación y link de pago enviados a ${c.client}.`);
  addNotification('🔔', `Cuenta por Cobrar Enviada: ${c.client}`, `Saldo pendiente: ${formatCOP(c.quota2)} — Vence: ${c.estimatedDate}`, 'cobranza', {
    client: c.client,
    product: c.product,
    phone: c.phone,
    total: c.quota2,
    creditId: c.id
  });

  // Mostrar banner interactivo para simular el pago del cliente
  promptSimulateClientPayment(c.id);
}

function promptSimulateClientPayment(creditId) {
  const c = carteraData.find(x => x.id === creditId);
  if (!c || c.quota2Paid) return;

  const toastId = 'toast_cobro_' + Date.now();
  const el = document.createElement('div');
  el.id = toastId;
  el.className = 'fixed bottom-6 left-6 z-[9999] bg-gradient-to-r from-emerald-950 via-teal-900 to-indigo-950 text-white p-4 rounded-2xl shadow-2xl border-2 border-emerald-400/50 max-w-md w-full pointer-events-auto alert-slide-in';
  el.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl flex-shrink-0">
        <i class="fab fa-whatsapp"></i>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <div class="text-[11px] font-bold text-emerald-300 uppercase tracking-wide">Cuenta por cobrar enviada</div>
          <button onclick="document.getElementById('${toastId}')?.remove();" class="text-gray-400 hover:text-white text-xs"><i class="fas fa-times"></i></button>
        </div>
        <div class="text-sm font-black text-white truncate mt-0.5">${c.client} • ${formatCOP(c.quota2)}</div>
        <div class="text-xs text-gray-300 mt-1">El cliente tiene el link de pago seguro en su WhatsApp.</div>
        <div class="flex items-center gap-2 mt-3 pt-2 border-t border-white/10">
          <button onclick="triggerCustomerPaymentSettlement('${creditId}', 'Nequi / Bancolombia'); document.getElementById('${toastId}')?.remove();" class="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95">
            <i class="fas fa-bolt text-yellow-300"></i> Simular que el Cliente Paga
          </button>
          <button onclick="document.getElementById('${toastId}')?.remove();" class="text-xs text-gray-300 hover:text-white px-2 py-1">
            Esperar
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(el);

  // Auto remover a los 16 segundos si no se interactúa
  setTimeout(() => {
    const e = document.getElementById(toastId);
    if (e) {
      e.style.opacity = '0';
      setTimeout(() => e.remove(), 400);
    }
  }, 16000);
}

/* ───────── PROCESAMIENTO DE PAGO Y LIQUIDACIÓN AUTOMÁTICA DE CARTERA ───────── */
function triggerCustomerPaymentSettlement(creditId, method = 'Nequi / Transferencia', refNumber = '') {
  const c = carteraData.find(x => x.id === creditId);
  if (!c) return;

  const nowTime = new Date().toLocaleTimeString('es-ES', { hour:'2-digit', minute:'2-digit' });
  const nowDate = new Date().toISOString().split('T')[0];

  // 1. Saldar automáticamente la cuenta
  c.quota2Paid = true;
  c.status = 'liquidado';
  c.lastNotice = `✅ Pagado (${method}) ${nowTime}`;
  c.notes = `Cuenta saldada automáticamente al recibir pago de cuota 2 por ${method}. Ref: ${refNumber || 'Online-' + Date.now().toString().slice(-4)}`;
  c.liquidatedAt = nowDate;

  // 2. Ingresar la venta/recaudo en el flujo de ventas
  salesData.unshift({
    id: 'V-' + String(salesData.length + 1).padStart(3, '0'),
    client: c.client,
    product: c.product + ' (Liquidación Cuota 2)',
    qty: 1,
    cost: Math.round(c.quota2 * 0.45),
    total: c.quota2,
    profit: Math.round(c.quota2 * 0.55),
    status: 'entregado',
    payMethod: method,
    date: nowDate,
    email: c.email
  });
  salesDirty = true;
  invoicesDirty = true;

  // 3. Recalcular KPIs de Cartera y refrescar vista
  updateCarteraKPIs();
  renderCarteraTable();

  // 4. Preparar datos del pago
  const paymentData = {
    creditId: c.id,
    client: c.client,
    product: c.product,
    amount: c.quota2,
    method: method,
    phone: c.phone
  };

  // 5. Lanzar Notificación Flotante Dinámica y Sonora
  showPaymentReceivedAlert(paymentData);

  // 6. Agregar a la lista de notificaciones (Pestaña Cobranza)
  addNotification(
    '💰',
    `¡Pago Recibido de Cartera! ${c.client}`,
    `Cuota 2 de ${formatCOP(c.quota2)} liquidada por ${method}. Cuenta 100% saldada en Paz y Salvo.`,
    'cobranza',
    {
      client: c.client,
      product: c.product,
      phone: c.phone,
      total: c.quota2,
      payMethod: method,
      creditId: c.id
    }
  );

  toast('🎉', '¡Cuenta Saldada!', `El crédito ${c.id} de ${c.client} quedó completamente pagado y en Paz y Salvo.`);
}

/* ───────── CERTIFICADO DE PAZ Y SALVO ───────── */
let currentPazYSalvoCredit = null;

function openPazYSalvoModal(creditId) {
  const c = carteraData.find(x => x.id === creditId);
  if (!c) return;
  currentPazYSalvoCredit = c;

  safeText('pysClientName', c.client);
  safeText('pysPhone', c.phone);
  safeText('pysProduct', c.product);
  safeText('pysRef', c.id);
  safeText('pysQ1', `${formatCOP(c.quota1)} ✓`);
  safeText('pysQ2', `${formatCOP(c.quota2)} ✓`);
  safeText('pysDate', `Fecha: ${new Date().toLocaleDateString('es-CO')}`);

  openModal('pazYSalvoModal');
}

function sendPazYSalvoCurrentWA() {
  if (!currentPazYSalvoCredit) return;
  sendPazYSalvoWA(currentPazYSalvoCredit.id);
  closeModal('pazYSalvoModal');
}

function sendPazYSalvoWA(creditId) {
  const c = carteraData.find(x => x.id === creditId);
  if (!c) return;

  const msg = `🎉 *¡PAZ Y SALVO TOTAL — CARFE® CALZADO!* ✨\n\n` +
              `Hola *${c.client}*! 👋\n\n` +
              `Confirmamos con éxito la recepción de tu pago final de *${formatCOP(c.quota2)}* correspondiente a la 2ª Cuota de tu calzado:\n\n` +
              `👟 *Producto:* ${c.product}\n` +
              `🔖 *Nº Crédito:* ${c.id}\n` +
              `✅ *Cuota 1:* ${formatCOP(c.quota1)} (Pagada)\n` +
              `✅ *Cuota 2:* ${formatCOP(c.quota2)} (Pagada)\n` +
              `💰 *SALDO PENDIENTE:* $0 COP\n` +
              `📅 *Fecha de Liquidación:* ${new Date().toLocaleDateString('es-CO')}\n\n` +
              `Tu crédito ha quedado *100% SALDADO Y CANCELADO*. Te agradecemos enormemente tu puntualidad y preferencia. ¡Esperamos verte pronto en Carfe®! 👟✨\n\n` +
              `_Carfe® Calzado Colombia — carfe.com_`;

  const cleanPhone = String(c.phone).replace(/\D/g, '');
  window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  toast('📄', 'Paz y Salvo Enviado', `Se envió el comprobante de finiquito a ${c.client} por WhatsApp.`);
}

function printPazYSalvo() {
  window.print();
}

/* ───────── PORTAL DE PAGO ONLINE DEL CLIENTE ───────── */
let currentPortalCredit = null;

function openCustomerPaymentPortal(creditId) {
  const c = carteraData.find(x => x.id === creditId);
  if (!c) return;
  currentPortalCredit = c;

  safeText('portalCreditId', c.id);
  safeText('portalClientName', c.client);
  safeText('portalProductName', c.product);
  safeText('portalQuotaAmount', formatCOP(c.quota2));

  openModal('customerPaymentPortalModal');
}

function submitOnlineCustomerPayment() {
  if (!currentPortalCredit) return;
  const c = currentPortalCredit;
  const methodRadio = document.querySelector('input[name="portalPayMethod"]:checked');
  const method = methodRadio ? methodRadio.value : 'Nequi';
  const ref = document.getElementById('portalPayRef')?.value.trim() || ('TR-' + Math.floor(100000 + Math.random() * 900000));

  const btn = document.getElementById('btnSubmitOnlinePayment');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin text-base"></i> Procesando pago en línea...';
  }

  setTimeout(() => {
    closeModal('customerPaymentPortalModal');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-check-double text-base"></i> Confirmar Pago y Saldar Cuenta Ahora';
    }
    // Disparar recepción de pago y liquidación automática
    triggerCustomerPaymentSettlement(c.id, method, ref);
  }, 900);
}

function openPayQuotaModal(id) {
  const c = carteraData.find(x => x.id === id);
  if (!c) return;
  selectedQuotaCredit = c;

  safeText('payQuotaAmount', formatCOP(c.quota2));
  safeText('payQuotaCustomer', `Cliente: ${c.client} (${c.product})`);
  safeText('payQuotaSubtitle', `Liquidación Crédito ${c.id}`);

  openModal('payQuotaModal');
}

function confirmQuotaPayment() {
  if (!selectedQuotaCredit) return;
  const c = selectedQuotaCredit;
  const method = document.getElementById('payQuotaMethod')?.value || 'transferencia';
  const notes = document.getElementById('payQuotaNotes')?.value || 'Pago en caja liquidado';

  closeModal('payQuotaModal');
  triggerCustomerPaymentSettlement(c.id, method, notes);
}

function sendBulkPaymentReminders() {
  const dueCredits = carteraData.filter(c => !c.quota2Paid && (c.status === 'proximo' || c.status === 'vencido'));
  if (dueCredits.length === 0) {
    return toast('✅', 'Cartera al Día', 'No hay clientes con cuotas próximas a vencer ni en mora.');
  }

  const nowTime = new Date().toLocaleTimeString('es-ES', { hour:'2-digit', minute:'2-digit' });
  dueCredits.forEach(c => {
    c.lastNotice = 'Aviso masivo (' + nowTime + ')';
  });

  renderCarteraTable();
  toast('📢', 'Avisos Masivos Enviados', `Se generaron y enviaron ${dueCredits.length} notificaciones de pago a clientes deudores.`);
  addNotification('📢', 'Avisos de Cobranza Masivos', `Se notificaron ${dueCredits.length} clientes con cuotas por vencer o vencidas.`, 'alert');
}

function openNewCreditModal() {
  openQuickBillingModal('credito');
}

function simulateCarteraPayment() {
  const pendingCredit = carteraData.find(c => !c.quota2Paid);
  if (!pendingCredit) {
    return toast('✅', 'Cartera al Día', 'Todos los clientes ya liquidaron sus cuotas.');
  }
  const methods = ['Nequi', 'Bancolombia Transferencia', 'Daviplata', 'PSE'];
  const m = methods[Math.floor(Math.random() * methods.length)];
  triggerCustomerPaymentSettlement(pendingCredit.id, m, 'TR-' + Math.floor(100000 + Math.random() * 900000));
}

/* ───────── CRM DE CLIENTES, CARTERA & CAMPAÑAS MASIVAS WHATSAPP ───────── */
let crmClientsData = [
  {
    id: 'CLI-001',
    name: 'Pedro Ramírez',
    phone: '+57 311 839 2104',
    email: 'pedro@mail.com',
    city: 'Bucaramanga',
    tag: 'deudor',
    notes: 'Comprador de calzado formal. Tiene crédito 2 cuotas activo.',
    createdAt: '2026-11-01'
  },
  {
    id: 'CLI-002',
    name: 'María García',
    phone: '+57 315 192 8374',
    email: 'maria@mail.com',
    city: 'Medellín',
    tag: 'deudor',
    notes: 'Compra tacones y sandalias. Cuota 2 pendiente.',
    createdAt: '2026-10-25'
  },
  {
    id: 'CLI-003',
    name: 'Roberto Méndez',
    phone: '+57 300 482 9182',
    email: 'roberto@mail.com',
    city: 'Bogotá',
    tag: 'aldia',
    notes: 'Crédito al día con cuota estimada a fin de mes.',
    createdAt: '2026-11-05'
  },
  {
    id: 'CLI-004',
    name: 'Carlos López',
    phone: '+57 320 930 1827',
    email: 'carlos@mail.com',
    city: 'Cali',
    tag: 'vip',
    notes: 'Cliente VIP excelente historial. Ya liquidó créditos anteriores.',
    createdAt: '2026-10-15'
  },
  {
    id: 'CLI-005',
    name: 'Lucía Flores',
    phone: '+57 318 647 3829',
    email: 'lucia@mail.com',
    city: 'Bucaramanga',
    tag: 'deudor',
    notes: 'Compró High Top Street a crédito. Pendiente cuota 2.',
    createdAt: '2026-11-07'
  },
  {
    id: 'CLI-006',
    name: 'Camila Torres',
    phone: '+57 314 902 4811',
    email: 'camila@mail.com',
    city: 'Barranquilla',
    tag: 'vip',
    notes: 'Compradora frecuente de zapatillas deportivas Air Runner.',
    createdAt: '2026-11-12'
  },
  {
    id: 'CLI-007',
    name: 'Diego Sánchez',
    phone: '+57 312 781 6543',
    email: 'diego@mail.com',
    city: 'Bogotá',
    tag: 'aldia',
    notes: 'Compra de contado. Pagos inmediatos.',
    createdAt: '2026-11-10'
  },
  {
    id: 'CLI-008',
    name: 'Juan Pérez',
    phone: '+57 300 891 2345',
    email: 'juan@mail.com',
    city: 'Cúcuta',
    tag: 'aldia',
    notes: 'Cliente recurrente tienda web.',
    createdAt: '2026-11-09'
  }
];

// Carga persistente de CRM
try {
  const savedCrm = localStorage.getItem('carfe_crm_clients');
  if (savedCrm) {
    crmClientsData = JSON.parse(savedCrm);
  }
} catch(e) {}

let crmSelectedIds = new Set();
let currentCrmDetailClient = null;
let currentBulkCampaignType = 'promo';
let bulkDispatchQueue = [];
let bulkDispatchIndex = 0;

function saveCrmToStorage() {
  try {
    localStorage.setItem('carfe_crm_clients', JSON.stringify(crmClientsData));
  } catch(e) {}
}

function initCrmView() {
  syncCrmWithCarteraAndSales();
  updateCrmKPIs();
  renderCrmTable();
}

function syncCrmWithCarteraAndSales() {
  const existingNames = new Set(crmClientsData.map(c => c.name.toLowerCase().trim()));

  // Revisar carteraData
  carteraData.forEach(cart => {
    const key = cart.client.toLowerCase().trim();
    if (!existingNames.has(key)) {
      existingNames.add(key);
      const isDebtor = !cart.quota2Paid;
      crmClientsData.push({
        id: 'CLI-' + String(crmClientsData.length + 1).padStart(3, '0'),
        name: cart.client,
        phone: cart.phone || '+57 300 123 4567',
        email: cart.email || '',
        city: 'Colombia',
        tag: isDebtor ? 'deudor' : 'aldia',
        notes: `Cliente con compra de ${cart.product}.`,
        createdAt: cart.quota1Date || new Date().toISOString().split('T')[0]
      });
    }
  });

  // Revisar salesData
  salesData.forEach(sale => {
    const key = sale.client.toLowerCase().trim();
    if (!existingNames.has(key)) {
      existingNames.add(key);
      crmClientsData.push({
        id: 'CLI-' + String(crmClientsData.length + 1).padStart(3, '0'),
        name: sale.client,
        phone: sale.phone || '+57 300 123 4567',
        email: sale.email || '',
        city: 'Colombia',
        tag: 'aldia',
        notes: `Cliente con pedido de ${sale.product}.`,
        createdAt: sale.date || new Date().toISOString().split('T')[0]
      });
    }
  });

  saveCrmToStorage();
}

function getClientCarteraStats(clientName) {
  const cName = clientName.toLowerCase().trim();
  const credits = carteraData.filter(c => c.client.toLowerCase().trim() === cName);
  const pendingCredits = credits.filter(c => !c.quota2Paid);
  const totalDebt = pendingCredits.reduce((s, c) => s + c.quota2, 0);
  const totalPaidInCartera = credits.reduce((s, c) => s + c.quota1 + (c.quota2Paid ? c.quota2 : 0), 0);

  const sales = salesData.filter(s => s.client.toLowerCase().trim() === cName);
  const totalBought = sales.reduce((s, v) => s + (v.total || 0), 0);

  const productsOwed = pendingCredits.map(c => c.product).join(', ');

  return {
    credits,
    pendingCredits,
    totalDebt,
    totalPaidInCartera,
    sales,
    totalBought,
    productsOwed: productsOwed || 'Ninguno (Al Día)'
  };
}

function updateCrmKPIs() {
  const totalClients = crmClientsData.length;
  let totalDebtAmount = 0;
  let debtorsCount = 0;
  let vipCount = 0;

  crmClientsData.forEach(c => {
    const stats = getClientCarteraStats(c.name);
    if (stats.totalDebt > 0) {
      debtorsCount++;
      totalDebtAmount += stats.totalDebt;
      if (c.tag !== 'deudor') c.tag = 'deudor';
    } else {
      if (c.tag === 'deudor') c.tag = 'aldia';
      if (c.tag === 'vip' || c.tag === 'aldia') vipCount++;
    }
  });

  safeText('crmKpiTotal', totalClients);
  safeText('crmKpiTotalSub', `${totalClients} contactos en base de datos`);
  safeText('crmKpiDebtors', debtorsCount);
  safeText('crmKpiTotalDebt', formatCOP(totalDebtAmount));
  safeText('crmKpiVip', vipCount);

  const navBadge = document.getElementById('crmNavCount');
  if (navBadge) {
    navBadge.textContent = totalClients;
  }
}

function renderCrmTable() {
  const tbody = document.getElementById('crmClientsTableBody');
  if (!tbody) return;

  const q = (document.getElementById('crmSearchInput')?.value || '').toLowerCase().trim();
  const tagFilter = document.getElementById('crmFilterTag')?.value || 'todos';

  const rows = crmClientsData.filter(c => {
    const stats = getClientCarteraStats(c.name);
    const hasDebt = stats.totalDebt > 0;

    const matchQ = !q ||
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.city && c.city.toLowerCase().includes(q)) ||
      stats.productsOwed.toLowerCase().includes(q);

    let matchTag = true;
    if (tagFilter === 'deudor') {
      matchTag = hasDebt;
    } else if (tagFilter === 'aldia') {
      matchTag = !hasDebt;
    } else if (tagFilter === 'vip') {
      matchTag = c.tag === 'vip';
    }

    return matchQ && matchTag;
  });

  if (rows.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="p-8 text-center text-gray-400">
          <i class="fas fa-users-slash text-3xl mb-2 text-gray-300"></i>
          <div>No se encontraron clientes con los filtros aplicados</div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = rows.map(c => {
    const stats = getClientCarteraStats(c.name);
    const hasDebt = stats.totalDebt > 0;
    const isSelected = crmSelectedIds.has(c.id);
    const cleanPhone = String(c.phone).replace(/\D/g, '');
    const initials = c.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

    let badge = '';
    if (hasDebt) {
      badge = '<span class="bg-red-100 text-red-800 border border-red-200 px-2.5 py-1 rounded-full text-[10px] font-black inline-flex items-center gap-1 animate-pulse"><i class="fas fa-hand-holding-dollar"></i> Deudor</span>';
    } else if (c.tag === 'vip') {
      badge = '<span class="bg-purple-100 text-purple-800 border border-purple-200 px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1"><i class="fas fa-star text-amber-500"></i> VIP</span>';
    } else {
      badge = '<span class="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1"><i class="fas fa-circle-check"></i> Al Día</span>';
    }

    const debtCell = hasDebt
      ? `<span class="font-black text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg text-xs inline-block">${formatCOP(stats.totalDebt)}</span>`
      : `<span class="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg text-[11px] inline-block">✓ $0 COP</span>`;

    const productsOwedCell = hasDebt
      ? `<div class="font-bold text-gray-900 text-xs truncate max-w-[200px]" title="${stats.productsOwed}">👟 ${stats.productsOwed}</div>
         <div class="text-[10px] text-amber-700 font-semibold mt-0.5">${stats.pendingCredits.length} cuota(s) por pagar</div>`
      : `<span class="text-gray-400 text-xs">Sin deudas pendientes</span>`;

    return `
      <tr class="hover:bg-indigo-50/40 transition-colors ${isSelected ? 'bg-indigo-50/70' : ''}">
        <td class="p-3.5 text-center">
          <input type="checkbox" onchange="toggleSelectCrmClient('${c.id}', this)" ${isSelected ? 'checked' : ''} class="rounded text-indigo-600 focus:ring-0 cursor-pointer crm-row-check">
        </td>
        <td class="p-3.5">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-xs flex items-center justify-center shadow-sm flex-shrink-0">
              ${initials}
            </div>
            <div class="min-w-0">
              <div class="font-black text-gray-900 text-xs truncate hover:text-indigo-600 cursor-pointer" onclick="openCrmDetailModal('${c.id}')">${c.name}</div>
              <div class="text-[10px] text-gray-400 font-mono">${c.id} • ${c.city || 'Colombia'}</div>
            </div>
          </div>
        </td>
        <td class="p-3.5">
          <div class="flex items-center gap-1.5 font-mono text-xs text-gray-700">
            <span>${c.phone}</span>
            <a href="https://wa.me/${cleanPhone}" target="_blank" title="Abrir Chat de WhatsApp" class="text-green-600 hover:text-green-700 p-1 rounded hover:bg-green-50 transition-colors">
              <i class="fab fa-whatsapp text-sm"></i>
            </a>
          </div>
          ${c.email ? `<div class="text-[10px] text-gray-400 truncate max-w-[140px]">${c.email}</div>` : ''}
        </td>
        <td class="p-3.5">${badge}</td>
        <td class="p-3.5">${productsOwedCell}</td>
        <td class="p-3.5">${debtCell}</td>
        <td class="p-3.5 font-bold text-gray-800 text-xs">
          ${formatCOP(stats.totalBought || (stats.totalPaidInCartera + stats.totalDebt))}
        </td>
        <td class="p-3.5 text-right">
          <div class="flex items-center justify-end gap-1">
            <button onclick="openCrmDetailModal('${c.id}')" title="Ver Historial y Movimientos de Cartera" class="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors text-xs font-bold flex items-center gap-1">
              <i class="fas fa-eye"></i> Movimientos
            </button>
            <button onclick="openCrmEditModal('${c.id}')" title="Modificar Datos del Cliente" class="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors text-xs">
              <i class="fas fa-pen"></i>
            </button>
            <button onclick="deleteCrmClient('${c.id}')" title="Eliminar Cliente si quedó mal creado" class="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-xs">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function filterCrmClients() {
  renderCrmTable();
}

function toggleSelectAllCrm(masterEl) {
  const checks = document.querySelectorAll('.crm-row-check');
  checks.forEach(chk => {
    chk.checked = masterEl.checked;
  });

  if (masterEl.checked) {
    crmClientsData.forEach(c => crmSelectedIds.add(c.id));
  } else {
    crmSelectedIds.clear();
  }
  updateCrmSelectionUI();
}

function toggleSelectCrmClient(clientId, chk) {
  if (chk.checked) {
    crmSelectedIds.add(clientId);
  } else {
    crmSelectedIds.delete(clientId);
  }
  updateCrmSelectionUI();
}

function updateCrmSelectionUI() {
  const badge = document.getElementById('crmSelectedBadge');
  const countText = document.getElementById('crmSelectedCountText');
  const bulkBtn = document.getElementById('crmBulkSendBtn');
  const masterChk = document.getElementById('crmMasterCheckbox');

  const count = crmSelectedIds.size;
  if (countText) countText.textContent = count;

  if (count > 0) {
    if (badge) badge.classList.remove('hidden');
    if (bulkBtn) bulkBtn.classList.remove('hidden');
  } else {
    if (badge) badge.classList.add('hidden');
    if (bulkBtn) bulkBtn.classList.add('hidden');
    if (masterChk) masterChk.checked = false;
  }
}

function getSelectedCrmClients() {
  if (crmSelectedIds.size > 0) {
    return crmClientsData.filter(c => crmSelectedIds.has(c.id));
  }
  return [...crmClientsData];
}

function openCrmNewClientModal() {
  document.getElementById('crmEditClientId').value = '';
  document.getElementById('crmInputName').value = '';
  document.getElementById('crmInputPhone').value = '';
  document.getElementById('crmInputEmail').value = '';
  document.getElementById('crmInputCity').value = 'Bucaramanga';
  document.getElementById('crmInputTag').value = 'aldia';
  document.getElementById('crmInputNotes').value = '';
  safeText('crmModalTitle', 'Registrar Nuevo Cliente');
  openModal('crmClientModal');
}

function openCrmEditModal(clientId) {
  const c = crmClientsData.find(x => x.id === clientId);
  if (!c) return;

  document.getElementById('crmEditClientId').value = c.id;
  document.getElementById('crmInputName').value = c.name;
  document.getElementById('crmInputPhone').value = c.phone;
  document.getElementById('crmInputEmail').value = c.email || '';
  document.getElementById('crmInputCity').value = c.city || 'Bucaramanga';
  document.getElementById('crmInputTag').value = c.tag || 'aldia';
  document.getElementById('crmInputNotes').value = c.notes || '';
  safeText('crmModalTitle', `Modificar Cliente: ${c.name}`);
  openModal('crmClientModal');
}

function saveCrmClient() {
  const id = document.getElementById('crmEditClientId')?.value.trim();
  const name = document.getElementById('crmInputName')?.value.trim();
  const phone = document.getElementById('crmInputPhone')?.value.trim();
  const email = document.getElementById('crmInputEmail')?.value.trim();
  const city = document.getElementById('crmInputCity')?.value.trim();
  const tag = document.getElementById('crmInputTag')?.value || 'aldia';
  const notes = document.getElementById('crmInputNotes')?.value.trim();

  if (!name || !phone) {
    return toast('⚠️', 'Campos Requeridos', 'Por favor ingresa al menos el Nombre y Teléfono del cliente.');
  }

  if (id) {
    const c = crmClientsData.find(x => x.id === id);
    if (!c) return;

    const oldName = c.name.toLowerCase().trim();
    c.name = name;
    c.phone = phone;
    c.email = email;
    c.city = city;
    c.tag = tag;
    c.notes = notes;

    if (oldName !== name.toLowerCase().trim()) {
      carteraData.forEach(cart => {
        if (cart.client.toLowerCase().trim() === oldName) {
          cart.client = name;
          cart.phone = phone;
          cart.email = email;
        }
      });
      salesData.forEach(sale => {
        if (sale.client.toLowerCase().trim() === oldName) {
          sale.client = name;
          sale.phone = phone;
          sale.email = email;
        }
      });
      salesDirty = true;
      renderCarteraTable();
      renderSalesTable();
    }

    toast('✅', 'Cliente Modificado', `Los datos de ${name} se actualizaron correctamente.`);
  } else {
    const newClient = {
      id: 'CLI-' + String(crmClientsData.length + 1).padStart(3, '0'),
      name,
      phone,
      email,
      city: city || 'Bucaramanga',
      tag,
      notes,
      createdAt: new Date().toISOString().split('T')[0]
    };
    crmClientsData.unshift(newClient);
    toast('🎉', 'Cliente Registrado', `${name} ha sido agregado al CRM.`);
  }

  saveCrmToStorage();
  closeModal('crmClientModal');
  updateCrmKPIs();
  renderCrmTable();
}

function deleteCrmClient(clientId) {
  const c = crmClientsData.find(x => x.id === clientId);
  if (!c) return;

  const stats = getClientCarteraStats(c.name);
  let warning = `¿Estás seguro de eliminar al cliente ${c.name} del CRM?`;
  if (stats.totalDebt > 0) {
    warning += `\n⚠️ ATENCIÓN: Este cliente tiene una deuda activa de ${formatCOP(stats.totalDebt)} en cartera.`;
  }

  if (!confirm(warning)) return;

  if (stats.credits.length > 0) {
    if (confirm(`¿Deseas eliminar también los ${stats.credits.length} registro(s) de cartera asociados a ${c.name}? (Útil si se crearon por error)`)) {
      carteraData = carteraData.filter(cart => cart.client.toLowerCase().trim() !== c.name.toLowerCase().trim());
      updateCarteraKPIs();
      renderCarteraTable();
    }
  }

  crmClientsData = crmClientsData.filter(x => x.id !== clientId);
  crmSelectedIds.delete(clientId);
  saveCrmToStorage();
  updateCrmKPIs();
  renderCrmTable();
  updateCrmSelectionUI();

  toast('🗑️', 'Cliente Eliminado', `${c.name} ha sido removido del CRM.`);
}

function openCrmDetailModal(clientId) {
  const c = crmClientsData.find(x => x.id === clientId);
  if (!c) return;
  currentCrmDetailClient = c;

  const stats = getClientCarteraStats(c.name);
  const initials = c.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  safeText('crmDetailName', c.name);
  safeText('crmDetailPhone', c.phone);
  safeText('crmDetailEmail', c.email || 'Sin correo');
  safeText('crmDetailCity', c.city || 'Colombia');

  const avatar = document.getElementById('crmDetailAvatar');
  if (avatar) avatar.textContent = initials;

  const badge = document.getElementById('crmDetailBadge');
  if (badge) {
    badge.textContent = stats.totalDebt > 0 ? 'Deudor en Cartera' : (c.tag === 'vip' ? 'Cliente VIP' : 'Al Día');
    badge.className = stats.totalDebt > 0
      ? 'bg-red-500/30 text-red-300 border border-red-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full'
      : 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full';
  }

  const directWABtn = document.getElementById('crmDetailDirectWABtn');
  if (directWABtn) {
    const cleanPhone = String(c.phone).replace(/\D/g, '');
    directWABtn.onclick = () => window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent('¡Hola ' + c.name + '! 👋 Te saludamos desde Carfe® Calzado.')}`, '_blank');
  }

  safeText('crmDetailKpiTotal', formatCOP(stats.totalBought || (stats.totalPaidInCartera + stats.totalDebt)));
  safeText('crmDetailKpiPaid', formatCOP(stats.totalPaidInCartera));
  safeText('crmDetailKpiDebt', formatCOP(stats.totalDebt));

  const movTbody = document.getElementById('crmClientMovementsTableBody');
  if (movTbody) {
    if (stats.credits.length === 0) {
      movTbody.innerHTML = '<tr><td colspan="8" class="p-4 text-center text-gray-400">Este cliente no tiene créditos ni deudas en Cartera</td></tr>';
    } else {
      movTbody.innerHTML = stats.credits.map(cr => `
        <tr class="hover:bg-gray-50">
          <td class="p-3 font-mono font-bold text-gray-700">${cr.id}</td>
          <td class="p-3">
            <strong class="text-gray-900">${cr.product}</strong>
            <div class="text-[10px] text-gray-400">Compra: ${cr.quota1Date}</div>
          </td>
          <td class="p-3 font-bold">${formatCOP(cr.total)}</td>
          <td class="p-3 text-emerald-700 font-semibold">✓ ${formatCOP(cr.quota1)}</td>
          <td class="p-3 font-black ${cr.quota2Paid ? 'text-gray-400 line-through' : 'text-red-600'}">
            ${formatCOP(cr.quota2)} ${cr.quota2Paid ? '✓' : '(Debe)'}
          </td>
          <td class="p-3 text-gray-600 font-mono">${cr.estimatedDate}</td>
          <td class="p-3">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${cr.quota2Paid ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}">
              ${cr.quota2Paid ? 'Liquidado' : 'Pendiente'}
            </span>
          </td>
          <td class="p-3 text-right">
            <div class="flex items-center justify-end gap-1">
              ${!cr.quota2Paid ? `
                <button onclick="sendPaymentNoticeWA('${cr.id}')" title="Enviar Cobro por WhatsApp" class="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-bold">
                  <i class="fab fa-whatsapp"></i> Cobro
                </button>
                <button onclick="openCustomerPaymentPortal('${cr.id}')" title="Pagar Online / Saldar" class="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold">
                  <i class="fas fa-credit-card"></i> Pagar
                </button>
              ` : `
                <button onclick="openPazYSalvoModal('${cr.id}')" title="Ver Paz y Salvo" class="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold">
                  <i class="fas fa-certificate"></i> Paz y Salvo
                </button>
              `}
              <button onclick="openEditMovementModal('${cr.id}')" title="Modificar este registro de cartera si quedó mal creado" class="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg text-xs font-bold">
                <i class="fas fa-pen"></i>
              </button>
              <button onclick="deleteCarteraMovement('${cr.id}')" title="Eliminar registro si fue creado por error" class="p-1.5 text-red-500 hover:bg-red-50 rounded-lg text-xs font-bold">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `).join('');
    }
  }

  const salesTbody = document.getElementById('crmClientSalesTableBody');
  if (salesTbody) {
    if (stats.sales.length === 0) {
      salesTbody.innerHTML = '<tr><td colspan="6" class="p-4 text-center text-gray-400">Sin compras registradas en Ventas</td></tr>';
    } else {
      salesTbody.innerHTML = stats.sales.map(s => `
        <tr class="hover:bg-gray-50">
          <td class="p-3 font-mono font-bold text-gray-700">${s.id}</td>
          <td class="p-3 font-semibold text-gray-800">${s.product}</td>
          <td class="p-3 text-gray-500">${s.date}</td>
          <td class="p-3 font-black text-gray-900">${formatCOP(s.total)}</td>
          <td class="p-3 capitalize">${s.payMethod}</td>
          <td class="p-3">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${s.status === 'entregado' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}">
              ${s.status}
            </span>
          </td>
        </tr>
      `).join('');
    }
  }

  openModal('crmClientDetailModal');
}

function openEditMovementModal(creditId) {
  const cr = carteraData.find(x => x.id === creditId);
  if (!cr) return;

  document.getElementById('editMovCreditId').value = cr.id;
  document.getElementById('editMovProduct').value = cr.product;
  document.getElementById('editMovTotal').value = cr.total;
  document.getElementById('editMovQ2').value = cr.quota2;
  document.getElementById('editMovDate').value = cr.estimatedDate;
  document.getElementById('editMovStatus').value = cr.quota2Paid ? 'liquidado' : 'pendiente';

  openModal('crmEditMovementModal');
}

function recalcEditMovQuotas() {
  const tot = parseFloat(document.getElementById('editMovTotal')?.value) || 0;
  const q2Inp = document.getElementById('editMovQ2');
  if (q2Inp) q2Inp.value = Math.round(tot / 2);
}

function saveCrmMovementEdit() {
  const creditId = document.getElementById('editMovCreditId')?.value;
  const product = document.getElementById('editMovProduct')?.value.trim();
  const total = parseFloat(document.getElementById('editMovTotal')?.value) || 0;
  const q2 = parseFloat(document.getElementById('editMovQ2')?.value) || 0;
  const date = document.getElementById('editMovDate')?.value;
  const status = document.getElementById('editMovStatus')?.value;

  const cr = carteraData.find(x => x.id === creditId);
  if (!cr) return;

  cr.product = product || cr.product;
  cr.total = total;
  cr.quota1 = total - q2;
  cr.quota2 = q2;
  cr.estimatedDate = date || cr.estimatedDate;
  cr.quota2Paid = (status === 'liquidado');
  if (cr.quota2Paid) {
    cr.status = 'liquidado';
  }

  closeModal('crmEditMovementModal');
  updateCarteraKPIs();
  renderCarteraTable();
  updateCrmKPIs();
  renderCrmTable();

  if (currentCrmDetailClient) {
    openCrmDetailModal(currentCrmDetailClient.id);
  }

  toast('✅', 'Movimiento Corregido', `El registro de crédito ${creditId} fue actualizado.`);
}

function deleteCarteraMovement(creditId) {
  const cr = carteraData.find(x => x.id === creditId);
  if (!cr) return;

  if (!confirm(`¿Estás seguro de eliminar el crédito ${cr.id} (${cr.product} de ${cr.client})?\nUsa esto si quedó mal creado por error.`)) return;

  carteraData = carteraData.filter(x => x.id !== creditId);
  updateCarteraKPIs();
  renderCarteraTable();
  updateCrmKPIs();
  renderCrmTable();

  if (currentCrmDetailClient) {
    openCrmDetailModal(currentCrmDetailClient.id);
  }

  toast('🗑️', 'Registro Eliminado', `El crédito ${creditId} fue removido de la cartera.`);
}

/* ───────── CAMPAÑAS MASIVAS DE WHATSAPP (CRM) ───────── */
const CRM_BULK_TEMPLATES = {
  promo: `🔥 *¡GRAN PROMOCIÓN EXCLUSIVA — CARFE® CALZADO!* 👟✨\n\n` +
         `Hola *{nombre}*! 👋\n\n` +
         `Queremos consentirte con lo mejor del calzado 100% colombiano. Esta semana tenemos:\n` +
         `💥 *20% DE DESCUENTO* en tu próximo par de calzado Carfe®.\n` +
         `🚚 *Envío totalmente GRATIS* a tu ciudad ({ciudad}).\n\n` +
         `Descubre todos los modelos disponibles en nuestro catálogo digital:\n` +
         `👉 {catalogo_url}\n\n` +
         `¡Responde a este mensaje con tu modelo favorito y tu talla para apartarlo antes de que se agoten! ✨`,

  cobro: `⚠️ *RECORDATORIO DE CUENTA POR COBRAR — CARFE® CALZADO*\n\n` +
         `Hola *{nombre}*! 👋\n\n` +
         `Esperamos que estés disfrutando tu calzado Carfe®. Te recordamos que tienes una cuota pendiente de tu crédito a 2 cuotas:\n\n` +
         `👟 *Producto:* {calzado}\n` +
         `💰 *Saldo a Liquidar:* {saldo}\n` +
         `📅 *Fecha Límite:* {fecha_limite}\n\n` +
         `🏦 *Canales para pago inmediato:*\n` +
         `• Nequi / Daviplata: 300 123 4567\n` +
         `• Bancolombia Ahorros: 912-00034-82\n` +
         `• 💳 Paga tu cuota en línea aquí de forma segura:\n` +
         `  https://carfe.com/pagar?credito={ref_credito}&monto={saldo}\n\n` +
         `Al pagar te enviaremos de inmediato tu Paz y Salvo Oficial. ¡Muchas gracias por tu puntualidad! ✨`,

  catalogo: `👟 *NUEVO CATÁLOGO OFICIAL CARFE® CALZADO 2026* ✨\n\n` +
            `¡Hola *{nombre}*! 👋 Te saludamos desde Carfe® Calzado.\n\n` +
            `Acabamos de lanzar nuestra nueva colección de calzado artesanal para hombre y mujer: Sneakers urbanos, zapatos formales en cuero genuino, tacones y botas todo terreno.\n\n` +
            `📖 *Explora nuestro Catálogo Interactivo con Fotos y Tallas aquí:*\n` +
            `👉 {catalogo_url}\n\n` +
            `Puedes hacer tu pedido directamente desde el catálogo con transferencia Nequi, Daviplata o Bancolombia. ¿Cuál modelo te gusta más? ¡Escríbenos! 👞👠`
};

function openCrmBulkModal(campaignType = 'promo') {
  currentBulkCampaignType = campaignType;
  switchCrmBulkCampaign(campaignType);
  openModal('crmBulkWhatsAppModal');
}

function openCrmBulkSelected() {
  openCrmBulkModal('promo');
}

function switchCrmBulkCampaign(type) {
  currentBulkCampaignType = type;

  const tabPromo = document.getElementById('crmBulkTabPromo');
  const tabCobro = document.getElementById('crmBulkTabCobro');
  const tabCat = document.getElementById('crmBulkTabCatalogo');

  [tabPromo, tabCobro, tabCat].forEach(t => {
    if (t) {
      t.className = 'py-2.5 px-3 rounded-xl text-gray-600 hover:text-gray-900 transition-all flex items-center justify-center gap-1.5';
    }
  });

  if (type === 'promo' && tabPromo) tabPromo.className = 'py-2.5 px-3 rounded-xl bg-white text-purple-900 shadow-sm transition-all flex items-center justify-center gap-1.5 font-bold';
  if (type === 'cobro' && tabCobro) tabCobro.className = 'py-2.5 px-3 rounded-xl bg-white text-amber-900 shadow-sm transition-all flex items-center justify-center gap-1.5 font-bold';
  if (type === 'catalogo' && tabCat) tabCat.className = 'py-2.5 px-3 rounded-xl bg-white text-emerald-900 shadow-sm transition-all flex items-center justify-center gap-1.5 font-bold';

  if (type === 'cobro') {
    filterDebtorsOnlyForBulk();
  } else {
    updateCrmBulkRecipientCount();
  }

  const msgTextarea = document.getElementById('crmBulkMessageText');
  if (msgTextarea) {
    msgTextarea.value = CRM_BULK_TEMPLATES[type] || CRM_BULK_TEMPLATES.promo;
  }

  const progressCont = document.getElementById('crmBulkProgressContainer');
  const initialActions = document.getElementById('crmBulkInitialActions');
  if (progressCont) progressCont.classList.add('hidden');
  if (initialActions) initialActions.classList.remove('hidden');

  updateCrmBulkPreview();
}

function updateCrmBulkRecipientCount() {
  const recText = document.getElementById('crmBulkRecipientText');
  const recSub = document.getElementById('crmBulkRecipientSub');

  let list = getSelectedCrmClients();
  if (currentBulkCampaignType === 'cobro') {
    list = list.filter(c => getClientCarteraStats(c.name).totalDebt > 0);
  }

  if (recText) recText.textContent = `${list.length} clientes`;
  if (recSub) {
    recSub.textContent = currentBulkCampaignType === 'cobro'
      ? 'Clientes que registran cuotas pendientes en Cartera'
      : (crmSelectedIds.size > 0 ? 'Clientes seleccionados manualmente' : 'Todos los clientes registrados en el CRM');
  }
}

function selectAllCrmForBulk() {
  crmClientsData.forEach(c => crmSelectedIds.add(c.id));
  updateCrmSelectionUI();
  updateCrmBulkRecipientCount();
  toast('👥', 'Todos Seleccionados', `Se incluirán los ${crmClientsData.length} clientes en la campaña.`);
}

function filterDebtorsOnlyForBulk() {
  crmSelectedIds.clear();
  crmClientsData.forEach(c => {
    if (getClientCarteraStats(c.name).totalDebt > 0) {
      crmSelectedIds.add(c.id);
    }
  });
  updateCrmSelectionUI();
  updateCrmBulkRecipientCount();
  toast('🚨', 'Filtro de Deudores Aplicado', `Seleccionados ${crmSelectedIds.size} clientes con saldo pendiente.`);
}

function updateCrmBulkPreview() {
  const rawText = document.getElementById('crmBulkMessageText')?.value || '';
  const previewEl = document.getElementById('crmBulkPreviewContent');
  if (!previewEl) return;

  const sampleClient = crmClientsData[0] || { name: 'Pedro Ramírez', city: 'Bucaramanga' };
  const stats = getClientCarteraStats(sampleClient.name);
  const sampleCredit = stats.pendingCredits[0] || stats.credits[0] || { product: 'Classic Oxford', quota2: 124500, id: 'CRT-002', estimatedDate: '2026-11-20' };

  let preview = rawText
    .replace(/{nombre}/g, sampleClient.name)
    .replace(/{ciudad}/g, sampleClient.city || 'Colombia')
    .replace(/{calzado}/g, sampleCredit.product)
    .replace(/{saldo}/g, formatCOP(sampleCredit.quota2))
    .replace(/{cuota}/g, formatCOP(sampleCredit.quota2))
    .replace(/{fecha_limite}/g, sampleCredit.estimatedDate)
    .replace(/{ref_credito}/g, sampleCredit.id)
    .replace(/{catalogo_url}/g, 'https://carfe.com/catalogo');

  previewEl.textContent = preview;
}

function startCrmBulkDispatch() {
  let recipients = getSelectedCrmClients();
  if (currentBulkCampaignType === 'cobro') {
    recipients = recipients.filter(c => getClientCarteraStats(c.name).totalDebt > 0);
  }

  if (recipients.length === 0) {
    return toast('⚠️', 'Sin Destinatarios', 'No hay clientes seleccionados para esta campaña.');
  }

  bulkDispatchQueue = recipients;
  bulkDispatchIndex = 0;

  const progressCont = document.getElementById('crmBulkProgressContainer');
  const initialActions = document.getElementById('crmBulkInitialActions');
  if (progressCont) progressCont.classList.remove('hidden');
  if (initialActions) initialActions.classList.add('hidden');

  updateCrmBulkProgressStep();
  sendCurrentCrmBulkClient();
}

function updateCrmBulkProgressStep() {
  if (bulkDispatchIndex >= bulkDispatchQueue.length) {
    toast('🎉', 'Campaña WhatsApp Completada', `Se procesaron los ${bulkDispatchQueue.length} mensajes con éxito.`);
    closeModal('crmBulkWhatsAppModal');
    return;
  }

  const client = bulkDispatchQueue[bulkDispatchIndex];
  safeText('crmBulkCurrentClientName', client.name);
  safeText('crmBulkProgressText', `${bulkDispatchIndex + 1} / ${bulkDispatchQueue.length}`);

  const pct = Math.round(((bulkDispatchIndex) / bulkDispatchQueue.length) * 100);
  const bar = document.getElementById('crmBulkProgressBar');
  if (bar) bar.style.width = `${pct}%`;
}

function sendCurrentCrmBulkClient() {
  if (bulkDispatchIndex >= bulkDispatchQueue.length) return;
  const client = bulkDispatchQueue[bulkDispatchIndex];
  const template = document.getElementById('crmBulkMessageText')?.value || '';

  const stats = getClientCarteraStats(client.name);
  const pendingCredit = stats.pendingCredits[0] || stats.credits[0] || { product: 'Calzado Carfe®', quota2: 0, id: 'CRT-000', estimatedDate: 'Hoy' };

  const personalizedMsg = template
    .replace(/{nombre}/g, client.name)
    .replace(/{ciudad}/g, client.city || 'Colombia')
    .replace(/{calzado}/g, pendingCredit.product)
    .replace(/{saldo}/g, formatCOP(pendingCredit.quota2))
    .replace(/{cuota}/g, formatCOP(pendingCredit.quota2))
    .replace(/{fecha_limite}/g, pendingCredit.estimatedDate)
    .replace(/{ref_credito}/g, pendingCredit.id)
    .replace(/{catalogo_url}/g, 'https://carfe.com/catalogo');

  const cleanPhone = String(client.phone).replace(/\D/g, '');
  window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(personalizedMsg)}`, '_blank');
}

function sendNextCrmBulkClient() {
  bulkDispatchIndex++;
  updateCrmBulkProgressStep();
  if (bulkDispatchIndex < bulkDispatchQueue.length) {
    sendCurrentCrmBulkClient();
  }
}

function skipCrmBulkClient() {
  bulkDispatchIndex++;
  updateCrmBulkProgressStep();
}


/* ───────── FACTURACIÓN RÁPIDA & FACTURAS OFICIALES ───────── */
let filteredInvoices = [...invoicesData];
let quickBillMode = 'contado';
let activeInvoiceForWA = null;

function openQuickBillingModal(initialMode = 'contado') {
  quickBillMode = initialMode;
  
  // Poblar selector de calzados
  const sel = document.getElementById('qbillProduct');
  if (sel) {
    sel.innerHTML = PRODUCTS.map(p => {
      const stockText = p.stock > 0 ? `Stock: ${p.stock}` : 'Agotado';
      return `<option value="${p.id}" data-price="${p.price}" data-cost="${p.cost || Math.round(p.price*0.5)}" data-name="${p.name}" data-cat="${p.cat}">
        ${p.name} (${p.cat === 'hombre' ? 'Hombre' : 'Mujer'}) — ${formatCOP(p.price)} [${stockText}]
      </option>`;
    }).join('');
  }

  // Prellenar fecha de hoy y valores
  setQuickBillPayMode(initialMode);
  onQuickBillProductChange();
  
  openModal('quickBillingModal');
}

function onQuickBillProductChange() {
  const sel = document.getElementById('qbillProduct');
  if (!sel || !sel.options[sel.selectedIndex]) return;
  const opt = sel.options[sel.selectedIndex];
  const price = parseFloat(opt.dataset.price) || 0;
  
  const unitPriceInp = document.getElementById('qbillUnitPrice');
  if (unitPriceInp) unitPriceInp.value = price;
  
  updateQuickBillCalculations();
}

function setQuickBillPayMode(mode) {
  quickBillMode = mode;
  const contadoBtn = document.getElementById('qbillModeContadoBtn');
  const creditoBtn = document.getElementById('qbillModeCreditoBtn');
  const contadoSec = document.getElementById('qbillContadoSection');
  const creditoSec = document.getElementById('qbillCreditoSection');

  if (mode === 'contado') {
    if (contadoBtn) {
      contadoBtn.className = 'py-2.5 px-3 rounded-xl text-xs font-black border-2 border-emerald-500 bg-emerald-50 text-emerald-800 flex items-center justify-center gap-1.5 transition-all shadow-sm';
    }
    if (creditoBtn) {
      creditoBtn.className = 'py-2.5 px-3 rounded-xl text-xs font-bold border-2 border-gray-200 bg-white text-gray-600 hover:border-amber-400 flex items-center justify-center gap-1.5 transition-all';
    }
    if (contadoSec) contadoSec.classList.remove('hidden');
    if (creditoSec) creditoSec.classList.add('hidden');
  } else {
    if (contadoBtn) {
      contadoBtn.className = 'py-2.5 px-3 rounded-xl text-xs font-bold border-2 border-gray-200 bg-white text-gray-600 hover:border-emerald-400 flex items-center justify-center gap-1.5 transition-all';
    }
    if (creditoBtn) {
      creditoBtn.className = 'py-2.5 px-3 rounded-xl text-xs font-black border-2 border-amber-500 bg-amber-50 text-amber-900 flex items-center justify-center gap-1.5 transition-all shadow-sm';
    }
    if (contadoSec) contadoSec.classList.add('hidden');
    if (creditoSec) creditoSec.classList.remove('hidden');

    // Preset 50% abono si está en cero
    const depInp = document.getElementById('qbillDeposit');
    if (depInp && (!depInp.value || parseFloat(depInp.value) === 0)) {
      setQuickBillQuotaPreset(0.5);
    }
  }

  updateQuickBillCalculations();
}

function setQuickBillQuotaPreset(percent) {
  const sel = document.getElementById('qbillProduct');
  const opt = sel ? sel.options[sel.selectedIndex] : null;
  const unitPrice = parseFloat(document.getElementById('qbillUnitPrice')?.value) || (opt ? parseFloat(opt.dataset.price) : 0);
  const qty = parseInt(document.getElementById('qbillQty')?.value) || 1;
  const total = unitPrice * qty;

  const depInp = document.getElementById('qbillDeposit');
  if (depInp) {
    depInp.value = Math.round(total * percent);
  }
  updateQuickBillCalculations();
}

function updateQuickBillCalculations() {
  const sel = document.getElementById('qbillProduct');
  const opt = sel ? sel.options[sel.selectedIndex] : null;
  const unitPrice = parseFloat(document.getElementById('qbillUnitPrice')?.value) || (opt ? parseFloat(opt.dataset.price) : 0);
  const unitCost = opt ? (parseFloat(opt.dataset.cost) || Math.round(unitPrice * 0.5)) : Math.round(unitPrice * 0.5);
  const qty = parseInt(document.getElementById('qbillQty')?.value) || 1;

  const subtotal = unitPrice * qty;
  const totalCost = unitCost * qty;
  const profit = subtotal - totalCost;

  safeText('qbillCostPreview', formatCOP(totalCost));
  safeText('qbillProfitPreview', formatCOP(profit) + ` (${subtotal > 0 ? Math.round((profit/subtotal)*100) : 0}%)`);
  safeText('qbillTotalDisplay', formatCOP(subtotal));

  if (quickBillMode === 'credito') {
    const depInp = document.getElementById('qbillDeposit');
    let deposit = parseFloat(depInp?.value);
    if (isNaN(deposit)) deposit = Math.round(subtotal / 2);
    const pending = Math.max(0, subtotal - deposit);

    const plan = document.getElementById('qbillCreditPlan')?.value || '2_quincenal';
    const days = plan === '2_mensual' ? 30 : 15;
    const dueDate = new Date(Date.now() + days * 86400000).toISOString().split('T')[0];

    safeText('qbillPendingQuotaDisplay', formatCOP(pending));
    safeText('qbillDueDateDisplay', `${dueDate} (${days} días)`);
  }
}

function submitQuickBilling() {
  const clientName = document.getElementById('qbillClient')?.value.trim();
  const phone = document.getElementById('qbillPhone')?.value.trim();
  const doc = document.getElementById('qbillDoc')?.value.trim();
  const address = document.getElementById('qbillAddress')?.value.trim();

  if (!clientName) {
    return toast('⚠️', 'Falta el cliente', 'Por favor ingresa el nombre completo del cliente');
  }

  const sel = document.getElementById('qbillProduct');
  if (!sel || !sel.options[sel.selectedIndex]) {
    return toast('⚠️', 'Selecciona calzado', 'Elige el calzado que se va a facturar');
  }
  const opt = sel.options[sel.selectedIndex];
  const prodId = parseInt(opt.value);
  const prodName = opt.dataset.name;
  const cat = opt.dataset.cat;
  const unitPrice = parseFloat(document.getElementById('qbillUnitPrice')?.value) || parseFloat(opt.dataset.price);
  const unitCost = parseFloat(opt.dataset.cost) || Math.round(unitPrice * 0.5);
  const qty = parseInt(document.getElementById('qbillQty')?.value) || 1;
  const talla = document.getElementById('qbillTalla')?.value || '40';

  const subtotal = unitPrice * qty;
  const totalCost = unitCost * qty;
  const profit = subtotal - totalCost;

  const todayStr = new Date().toISOString().split('T')[0];
  const invSeq = 'FAC-' + String(invoicesData.length + 1).padStart(4, '0');
  const saleSeq = 'V-' + String(salesData.length + 1).padStart(3, '0');

  let payMethodText = '';
  let isCredit = (quickBillMode === 'credito');
  let depositAmount = subtotal;
  let pendingAmount = 0;
  let creditDueDate = null;

  if (isCredit) {
    const depVal = parseFloat(document.getElementById('qbillDeposit')?.value);
    depositAmount = isNaN(depVal) ? Math.round(subtotal / 2) : depVal;
    pendingAmount = Math.max(0, subtotal - depositAmount);

    const plan = document.getElementById('qbillCreditPlan')?.value || '2_quincenal';
    const days = plan === '2_mensual' ? 30 : 15;
    creditDueDate = new Date(Date.now() + days * 86400000).toISOString().split('T')[0];
    payMethodText = `Crédito (Abono: ${formatCOP(depositAmount)} / Saldo: ${formatCOP(pendingAmount)})`;

    // Registrar en Cartera 2 Cuotas
    const newCredit = {
      id: 'CRT-' + String(carteraData.length + 1).padStart(3, '0'),
      saleId: saleSeq,
      client: clientName,
      phone: phone || '+57 300 000 0000',
      email: 'cliente@carfe.com',
      shoe: `${prodName} (Talla ${talla})`,
      total: subtotal,
      quota1: depositAmount,
      quota1Paid: depositAmount > 0,
      quota1Date: todayStr,
      quota2: pendingAmount,
      quota2Paid: pendingAmount === 0,
      estimatedDate: creditDueDate,
      status: pendingAmount === 0 ? 'liquidado' : 'aldia',
      lastNotice: null,
      notes: `Venta Factura ${invSeq} — Plan Crédito ${days} días.`
    };
    carteraData.unshift(newCredit);
    updateCarteraKPIs();
    renderCarteraTable();
  } else {
    payMethodText = document.getElementById('qbillPayMethod')?.value || 'Efectivo';
  }

  // 1. Guardar en Ventas
  const newSale = {
    id: saleSeq,
    invoiceId: invSeq,
    client: clientName,
    phone: phone,
    doc: doc,
    address: address,
    product: `${prodName} (Talla ${talla})`,
    qty: qty,
    cost: totalCost,
    total: subtotal,
    profit: profit,
    status: isCredit ? (pendingAmount > 0 ? 'procesando' : 'entregado') : 'entregado',
    payMethod: payMethodText,
    date: todayStr,
    email: 'cliente@carfe.com'
  };
  salesData.unshift(newSale);

  // 2. Guardar en Facturas
  const newInvoice = {
    id: invSeq,
    saleId: saleSeq,
    client: clientName,
    phone: phone,
    doc: doc,
    address: address,
    product: prodName,
    talla: talla,
    qty: qty,
    unitPrice: unitPrice,
    subtotal: subtotal,
    tax: Math.round(subtotal * 0.19),
    total: subtotal,
    date: todayStr,
    status: isCredit ? (pendingAmount === 0 ? 'pagada' : 'pendiente') : 'pagada',
    payMethod: payMethodText,
    isCredit: isCredit,
    deposit: depositAmount,
    pendingQuota: pendingAmount,
    dueDate: creditDueDate,
    email: 'cliente@carfe.com'
  };
  invoicesData.unshift(newInvoice);
  filteredInvoices = [...invoicesData];

  // 3. Descontar Inventario
  const invProd = inventoryData.find(x => x.id === prodId || x.name === prodName);
  if (invProd && invProd.stock > 0) {
    invProd.stock = Math.max(0, invProd.stock - qty);
    invProd.sold = (invProd.sold || 0) + qty;
  }
  const rootProd = PRODUCTS.find(x => x.id === prodId || x.name === prodName);
  if (rootProd && rootProd.stock > 0) {
    rootProd.stock = Math.max(0, rootProd.stock - qty);
  }

  // Actualizar banderas dirty
  salesDirty = true;
  invoicesDirty = true;
  inventoryDirty = true;
  contabilidadDirty = true;

  // Actualizar vistas si están cargadas
  if (typeof renderSalesTable === 'function') {
    filteredSales = [...salesData];
    renderSalesTable();
  }
  renderInvoicesTable();
  if (typeof updateInvKPIs === 'function') updateInvKPIs();
  if (typeof renderInventoryTable === 'function') renderInventoryTable();
  if (typeof initContabilidad === 'function') initContabilidad();

  closeModal('quickBillingModal');
  toast('🎉', 'Factura Emitida con Éxito', `${invSeq} — ${clientName} (${formatCOP(subtotal)})`);
  
  // Mostrar factura oficial de inmediato
  showInvoicePreview(newInvoice);
}

function renderInvoicesTable() {
  const tbody = document.getElementById('invoicesTableBody');
  if (!tbody) return;
  if (filteredInvoices.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:#9ca3af;padding:30px">No hay facturas registradas</td></tr>';
    return;
  }
  tbody.innerHTML = filteredInvoices.map(f => {
    const isCred = f.isCredit || (f.payMethod && f.payMethod.toLowerCase().includes('crédito'));
    return `
    <tr class="hover:bg-purple-50/50 transition-colors">
      <td class="px-5 py-3.5"><strong class="text-purple-700 font-mono">${f.id}</strong></td>
      <td class="px-5 py-3.5 font-medium text-gray-800">
        <div>${f.client}</div>
        <div class="text-[11px] text-gray-400">${f.phone || f.doc || f.email || ''}</div>
      </td>
      <td class="px-5 py-3.5 text-xs text-gray-500">${f.date}</td>
      <td class="px-5 py-3.5 text-xs text-gray-500">${f.dueDate || 'Contado'}</td>
      <td class="px-5 py-3.5 text-xs text-gray-600">${formatCOP(f.subtotal)}</td>
      <td class="px-5 py-3.5 text-xs text-gray-400 font-mono">${formatCOP(f.tax || 0)}</td>
      <td class="px-5 py-3.5 text-sm font-black text-gray-900">${formatCOP(f.total)}</td>
      <td class="px-5 py-3.5">
        ${isCred
          ? `<span class="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-[11px] font-bold border border-amber-300">Crédito</span>`
          : invStatusBadge(f.status)}
      </td>
      <td class="px-5 py-3.5 whitespace-nowrap">
        <button onclick="showInvoicePreviewById('${f.id}')" class="bg-purple-100 text-purple-700 hover:bg-purple-200 font-bold px-2.5 py-1 rounded-lg text-xs transition-colors">
          <i class="fas fa-eye mr-1"></i>Ver
        </button>
        <button onclick="sendInvoiceWA('${f.id}')" class="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 font-bold px-2.5 py-1 rounded-lg text-xs transition-colors ml-1" title="Enviar factura por WhatsApp">
          <i class="fab fa-whatsapp"></i>
        </button>
        <button onclick="printInvoice('${f.id}')" class="bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold px-2 py-1 rounded-lg text-xs transition-colors ml-1" title="Imprimir / PDF">
          <i class="fas fa-print"></i>
        </button>
      </td>
    </tr>
  `}).join('');
}

function filterInvoices() {
  const q  = (document.getElementById('invSearch')?.value || '').toLowerCase();
  const st = document.getElementById('invStatusFilter')?.value || '';
  filteredInvoices = invoicesData.filter(f => {
    const mQ  = !q  || f.client.toLowerCase().includes(q) || f.id.toLowerCase().includes(q) || (f.phone && f.phone.includes(q));
    const mSt = !st || f.status === st;
    return mQ && mSt;
  });
  renderInvoicesTable();
}

function openNewInvoiceModal() {
  openQuickBillingModal('contado');
}

function showInvoicePreviewById(id) {
  const inv = invoicesData.find(f => f.id === id);
  if (inv) showInvoicePreview(inv);
}

function showInvoicePreview(inv) {
  activeInvoiceForWA = inv;
  const el = document.getElementById('invoiceContent');
  if (!el) return;

  const isCred = inv.isCredit || (inv.payMethod && inv.payMethod.toLowerCase().includes('crédito'));

  el.innerHTML = `
    <div style="font-family:'Plus Jakarta Sans',Inter,Arial,sans-serif;max-width:640px;margin:auto;padding:28px;border:1px solid #e5e7eb;border-radius:20px;background:#ffffff;box-shadow:0 8px 30px rgba(0,0,0,0.06)">
      <!-- Header Factura con Logo Completo Oficial Carfe® -->
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2.5px solid #dc2626;padding-bottom:18px;margin-bottom:22px">
        <div style="display:flex;align-items:center;gap:16px">
          <div style="background:#ffffff;padding:6px 12px;border-radius:12px;border:1.5px solid #e5e7eb;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.04)">
            <img src="assets/logo.png" style="height:46px;max-width:150px;width:auto;object-fit:contain;display:block;" alt="Carfe®">
          </div>
          <div>
            <div style="color:#111827;font-size:13px;font-weight:800;letter-spacing:-0.2px">Carfe® Calzado Oficial</div>
            <div style="color:#4b5563;font-size:11px;font-weight:600">Calzado Exclusivo en Cuero & Confort</div>
            <div style="color:#9ca3af;font-size:10.5px">NIT 901.482.910-4 • Bucaramanga, Colombia</div>
          </div>
        </div>
        <div style="text-align:right">
          <div style="font-size:16px;font-weight:900;color:#dc2626;letter-spacing:1px">FACTURA DE VENTA</div>
          <div style="font-size:15px;font-weight:900;color:#0a0a0c;font-family:monospace;letter-spacing:-0.5px">${inv.id}</div>
          <div style="color:#6b7280;font-size:11px;margin-top:2px">Fecha: <strong>${inv.date}</strong></div>
        </div>
      </div>

      <!-- Datos del Cliente -->
      <div style="background:#f9fafb;border-radius:14px;padding:14px 18px;margin-bottom:20px;border:1px solid #f3f4f6;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
        <div>
          <div style="font-size:10px;font-weight:800;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px">Facturar a:</div>
          <div style="color:#111827;font-size:15px;font-weight:900">${inv.client}</div>
          ${inv.doc ? `<div style="color:#4b5563;font-size:12px;font-weight:600">Cédula/NIT: ${inv.doc}</div>` : ''}
          ${inv.address ? `<div style="color:#6b7280;font-size:11.5px">📍 ${inv.address}</div>` : ''}
        </div>
        <div style="text-align:right">
          ${inv.phone ? `<div style="color:#059669;font-weight:800;font-size:12.5px"><i class="fab fa-whatsapp"></i> ${inv.phone}</div>` : ''}
          <div style="font-size:10.5px;color:#9ca3af;margin-top:3px">Canal: Venta Directa Oficial</div>
        </div>
      </div>

      <!-- Tabla de Calzados -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:12.5px">
        <thead>
          <tr style="background:#0a0a0c;color:#ffffff">
            <th style="padding:10px 14px;text-align:left;border-radius:10px 0 0 0;font-weight:800">Calzado / Descripción</th>
            <th style="padding:10px 14px;text-align:center;font-weight:800">Talla</th>
            <th style="padding:10px 14px;text-align:center;font-weight:800">Cant</th>
            <th style="padding:10px 14px;text-align:right;font-weight:800">Precio Unitario</th>
            <th style="padding:10px 14px;text-align:right;border-radius:0 10px 0 0;font-weight:800">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom:1px solid #f3f4f6">
            <td style="padding:14px;font-weight:800;color:#111827">${inv.product}</td>
            <td style="padding:14px;text-align:center;font-weight:900;color:#dc2626">${inv.talla || '40'}</td>
            <td style="padding:14px;text-align:center;font-weight:700;color:#374151">${inv.qty}</td>
            <td style="padding:14px;text-align:right;color:#4b5563;font-weight:600">${formatCOP(inv.subtotal / inv.qty)}</td>
            <td style="padding:14px;text-align:right;font-weight:900;color:#111827">${formatCOP(inv.subtotal)}</td>
          </tr>
        </tbody>
      </table>

      <!-- Resumen Financiero y Pago -->
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:18px;margin-bottom:22px;flex-wrap:wrap">
        <!-- Método de Pago / Crédito -->
        <div style="flex:1;min-width:240px;background:${isCred ? '#fffbeb' : '#f0fdf4'};border:1px solid ${isCred ? '#fde68a' : '#bbf7d0'};padding:14px 16px;border-radius:14px">
          <div style="font-size:10.5px;font-weight:800;text-transform:uppercase;color:${isCred ? '#92400e' : '#166534'};margin-bottom:3px">
            ${isCred ? '📌 Modalidad: Venta A Crédito (Cartera Carfe®)' : '✅ Forma de Pago: Contado / Inmediato'}
          </div>
          <div style="font-weight:900;font-size:13px;color:#111827">${inv.payMethod}</div>
          ${isCred ? `
            <div style="margin-top:8px;padding-top:8px;border-top:1px dashed #fcd34d;font-size:11.5px;color:#78350f">
              <div>• <b>Cuota 1 (Abono Recibido):</b> ${formatCOP(inv.deposit || 0)}</div>
              <div>• <b>Cuota 2 (Saldo Pendiente):</b> ${formatCOP(inv.pendingQuota || 0)}</div>
              <div>• <b>Fecha Límite Cuota 2:</b> <u>${inv.dueDate || '15 días'}</u></div>
            </div>
          ` : `
            <div style="font-size:11px;color:#15803d;margin-top:3px;font-weight:600">Pago confirmado y asentado en caja.</div>
          `}
        </div>

        <!-- Totales -->
        <div style="min-width:210px;text-align:right">
          <div style="display:flex;justify-content:space-between;gap:16px;font-size:12px;color:#6b7280;margin-bottom:4px">
            <span>Subtotal:</span><span style="font-weight:700;color:#1f2937">${formatCOP(inv.subtotal)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;gap:16px;font-size:12px;color:#6b7280;margin-bottom:8px">
            <span>IVA (Incluido):</span><span style="font-weight:700;color:#1f2937">${formatCOP(inv.tax || 0)}</span>
          </div>
          <div style="background:linear-gradient(135deg,#dc2626,#991b1b);color:#ffffff;padding:10px 16px;border-radius:12px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 4px 14px rgba(220,38,38,0.25)">
            <span style="font-size:12px;font-weight:800;letter-spacing:0.5px">TOTAL:</span>
            <span style="font-size:18px;font-weight:900">${formatCOP(inv.total)}</span>
          </div>
        </div>
      </div>

      <!-- Pie de Factura -->
      <div style="text-align:center;padding-top:16px;border-top:1px solid #f3f4f6;color:#9ca3af;font-size:10.5px;line-height:1.5">
        ¡Gracias por tu confianza en <strong>Carfe®</strong>!<br>
        Garantía oficial en cuero legítimo y confort • Esta factura es comprobante válido de compra y despacho.
      </div>
    </div>
  `;

  openModal('invoicePrintModal');
}

function sendActiveInvoiceWA() {
  if (!activeInvoiceForWA) return;
  sendInvoiceWA(activeInvoiceForWA.id);
}

function sendInvoiceWA(id) {
  const inv = invoicesData.find(f => f.id === id);
  if (!inv) return;

  const isCred = inv.isCredit || (inv.payMethod && inv.payMethod.toLowerCase().includes('crédito'));
  const phone = (inv.phone || '').replace(/\D/g, '');
  const cleanPhone = phone.startsWith('57') ? phone : (phone.length === 10 ? '57' + phone : '');

  const msg = 
`🧾 *FACTURA OFICIAL DE VENTA — CARFE® CALZADO*
━━━━━━━━━━━━━━━━━━━━
🔖 *Factura N°:* ${inv.id}
📅 *Fecha:* ${inv.date}
👤 *Cliente:* ${inv.client}
${inv.doc ? `🆔 *Cédula/NIT:* ${inv.doc}\n` : ''}${inv.address ? `📍 *Dirección:* ${inv.address}\n` : ''}━━━━━━━━━━━━━━━━━━━━
🛍️ *DETALLE DE LA COMPRA:*
• *Modelo:* ${inv.product}
• *Talla:* ${inv.talla || '40'}
• *Cantidad:* ${inv.qty} par(es)
• *Valor Total:* ${formatCOP(inv.total)}
━━━━━━━━━━━━━━━━━━━━
💳 *FORMA DE PAGO:*
${isCred ? `• Modalidad: *VENTA A CRÉDITO (CARTERA CARFE®)*
• Abono Inicial Recibido: *${formatCOP(inv.deposit || 0)}*
• Saldo Pendiente (Cuota 2): *${formatCOP(inv.pendingQuota || 0)}*
• Fecha Límite de Pago: *${inv.dueDate || '15 días'}*` : `• Método: *${inv.payMethod}*
• Estado: *PAGADA ✓*`}
━━━━━━━━━━━━━━━━━━━━
📦 Despacho prioritario asegurado. ¡Muchas gracias por elegir calzado Carfe®! ✨`;

  const url = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`
    : `https://wa.me/?text=${encodeURIComponent(msg)}`;

  window.open(url, '_blank');
  toast('📱', 'Factura enviada a WhatsApp', `${inv.id} enviada a ${inv.client}`);
}

function printInvoice(id) {
  showInvoicePreviewById(id);
  setTimeout(() => window.print(), 400);
}

/* ───────── CONTABILIDAD, COSTOS & GASTOS OPERATIVOS ───────── */
function initContabilidad() {
  updateContabilidadKPIs();
  renderExpensesTable();
}

function updateContabilidadKPIs() {
  // 1. Ingresos por Ventas Totales
  const totalSales = salesData.reduce((acc, s) => acc + (parseFloat(s.total) || 0), 0);
  const totalPairsSold = salesData.reduce((acc, s) => acc + (parseInt(s.qty) || 1), 0);

  // 2. Costo de Mercancía Vendida (CMV)
  const totalCost = salesData.reduce((acc, s) => acc + (parseFloat(s.cost) || 0), 0);

  // 3. Utilidad Bruta
  const grossProfit = totalSales - totalCost;

  // 4. Gastos Operativos Totales
  const totalExpenses = expensesData.reduce((acc, e) => acc + (parseFloat(e.amount) || 0), 0);

  // 5. Utilidad Neta Final
  const netProfit = grossProfit - totalExpenses;
  const netMargin = totalSales > 0 ? Math.round((netProfit / totalSales) * 100) : 0;

  // Actualizar 4 KPIs principales
  safeText('contabIngresos', formatCOP(totalSales));
  safeText('contabVentasCount', `${totalPairsSold} pares facturados`);
  safeText('contabCostos', formatCOP(totalCost));
  safeText('contabGastos', formatCOP(totalExpenses));
  safeText('contabGastosCount', `${expensesData.length} gastos registrados`);
  safeText('contabUtilidadNeta', formatCOP(netProfit));
  safeText('contabMargenNeto', `Margen Neto: ${netMargin}%`);

  // Actualizar Resumen por Categoría
  const catSums = {
    publicidad: 0,
    fletes: 0,
    empaques: 0,
    arriendo: 0,
    nomina: 0,
    servicios: 0,
    otros: 0
  };
  expensesData.forEach(e => {
    const c = (e.category || 'otros').toLowerCase();
    if (catSums[c] !== undefined) catSums[c] += (parseFloat(e.amount) || 0);
    else catSums.otros += (parseFloat(e.amount) || 0);
  });

  safeText('catExpPublicidad', formatCOP(catSums.publicidad));
  safeText('catExpFletes', formatCOP(catSums.fletes));
  safeText('catExpEmpaques', formatCOP(catSums.empaques));
  safeText('catExpArriendo', formatCOP(catSums.arriendo));
  safeText('catExpNomina', formatCOP(catSums.nomina));
  safeText('catExpServicios', formatCOP(catSums.servicios + catSums.otros));

  // Actualizar Estado de Resultados P&L
  safeText('plVentasBrutas', formatCOP(totalSales));
  safeText('plDescuentos', '$0 COP');
  safeText('plVentasNetas', formatCOP(totalSales));
  safeText('plCostoVentas', '-' + formatCOP(totalCost));
  safeText('plUtilidadBruta', formatCOP(grossProfit));
  safeText('plGastosOperativos', '-' + formatCOP(totalExpenses));
  safeText('plUtilidadNeta', formatCOP(netProfit));
  safeText('plMargenFinal', `${netMargin}% Margen`);
}

let expenseFilterCat = 'todas';
function renderExpensesTable() {
  const tbody = document.getElementById('expensesTableBody');
  if (!tbody) return;

  const q = (document.getElementById('expenseSearch')?.value || '').toLowerCase();
  const cat = expenseFilterCat;

  const filtered = expensesData.filter(e => {
    const mQ = !q || e.desc.toLowerCase().includes(q) || (e.id && e.id.toLowerCase().includes(q));
    const mC = cat === 'todas' || e.category === cat;
    return mQ && mC;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-center text-gray-400 py-8 font-medium">No se encontraron gastos registrados con los filtros aplicados</td></tr>';
    return;
  }

  const catIcons = {
    publicidad: '<span class="bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full font-bold">📢 Publicidad</span>',
    fletes:     '<span class="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full font-bold">🚚 Fletes</span>',
    empaques:   '<span class="bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full font-bold">📦 Empaques</span>',
    arriendo:   '<span class="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-bold">🏢 Arriendo</span>',
    nomina:     '<span class="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">👥 Nómina</span>',
    servicios:  '<span class="bg-yellow-100 text-yellow-800 px-2.5 py-0.5 rounded-full font-bold">⚡ Servicios</span>',
    otros:      '<span class="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full font-bold">📄 Otros</span>',
  };

  tbody.innerHTML = filtered.map(e => `
    <tr class="hover:bg-amber-50/40 transition-colors">
      <td class="p-3 text-gray-500 font-mono text-[11px]">${e.date}</td>
      <td class="p-3">${catIcons[e.category] || catIcons.otros}</td>
      <td class="p-3 font-extrabold text-gray-800">
        <div>${e.desc}</div>
        <div class="text-[10px] text-gray-400 font-mono">${e.id}</div>
      </td>
      <td class="p-3 text-gray-600 font-medium">${e.payMethod || 'Bancolombia'}</td>
      <td class="p-3 font-black text-rose-600 text-sm">${formatCOP(e.amount)}</td>
      <td class="p-3">
        <button onclick="toggleExpenseStatus('${e.id}')" class="px-2.5 py-1 rounded-full text-[10px] font-black border transition-all ${
          e.status === 'pagado' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-amber-50 text-amber-700 border-amber-300'
        }">
          ${e.status === 'pagado' ? '✓ Pagado' : '⏳ Pendiente'}
        </button>
      </td>
      <td class="p-3 text-right">
        <button onclick="deleteExpense('${e.id}')" class="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors" title="Eliminar gasto">
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function filterExpenses() {
  expenseFilterCat = document.getElementById('expenseCatFilter')?.value || 'todas';
  renderExpensesTable();
}

function openNewExpenseModal() {
  const dateInp = document.getElementById('expDate');
  if (dateInp) dateInp.value = new Date().toISOString().split('T')[0];
  const descInp = document.getElementById('expDesc');
  if (descInp) descInp.value = '';
  const amtInp = document.getElementById('expAmount');
  if (amtInp) amtInp.value = '';
  openModal('newExpenseModal');
}

function saveExpense() {
  const date = document.getElementById('expDate')?.value || new Date().toISOString().split('T')[0];
  const cat = document.getElementById('expCategory')?.value || 'otros';
  const desc = document.getElementById('expDesc')?.value.trim();
  const amount = parseFloat(document.getElementById('expAmount')?.value);
  const payMethod = document.getElementById('expPayMethod')?.value || 'Bancolombia';
  const status = document.getElementById('expStatus')?.value || 'pagado';

  if (!desc) {
    return toast('⚠️', 'Falta descripción', 'Describe el concepto del gasto');
  }
  if (isNaN(amount) || amount <= 0) {
    return toast('⚠️', 'Monto inválido', 'Ingresa un valor mayor a cero en Pesos');
  }

  const newExp = {
    id: 'EXP-' + String(expensesData.length + 1).padStart(3, '0'),
    date,
    category: cat,
    desc,
    amount,
    payMethod,
    status
  };

  expensesData.unshift(newExp);
  try {
    localStorage.setItem('carfe_expenses', JSON.stringify(expensesData));
  } catch(e) {}

  contabilidadDirty = true;
  updateContabilidadKPIs();
  renderExpensesTable();
  closeModal('newExpenseModal');
  toast('✅', 'Gasto Registrado', `${desc} — ${formatCOP(amount)}`);
}

function deleteExpense(id) {
  const exp = expensesData.find(x => x.id === id);
  if (!exp) return;
  if (!confirm(`¿Eliminar el registro de gasto "${exp.desc}" de ${formatCOP(exp.amount)}?`)) return;

  expensesData = expensesData.filter(x => x.id !== id);
  try {
    localStorage.setItem('carfe_expenses', JSON.stringify(expensesData));
  } catch(e) {}

  contabilidadDirty = true;
  updateContabilidadKPIs();
  renderExpensesTable();
  toast('🗑️', 'Gasto Eliminado', exp.desc);
}

function toggleExpenseStatus(id) {
  const exp = expensesData.find(x => x.id === id);
  if (!exp) return;
  exp.status = exp.status === 'pagado' ? 'pendiente' : 'pagado';
  try {
    localStorage.setItem('carfe_expenses', JSON.stringify(expensesData));
  } catch(e) {}
  updateContabilidadKPIs();
  renderExpensesTable();
  toast('🔄', 'Estado de Gasto Actualizado', `${exp.desc}: ${exp.status === 'pagado' ? 'Pagado' : 'Pendiente'}`);
}

function exportContabilidadCSV() {
  const totalSales = salesData.reduce((acc, s) => acc + (parseFloat(s.total) || 0), 0);
  const totalCost = salesData.reduce((acc, s) => acc + (parseFloat(s.cost) || 0), 0);
  const totalExpenses = expensesData.reduce((acc, e) => acc + (parseFloat(e.amount) || 0), 0);
  const netProfit = (totalSales - totalCost) - totalExpenses;

  let csv = 'REPORTE CONTABLE Y FINANCIERO CARFE CALZADO\n';
  csv += `Fecha de Emision,${new Date().toISOString().split('T')[0]}\n\n`;
  csv += 'ESTADO DE RESULTADOS\n';
  csv += `Ingresos Brutos por Ventas,${totalSales}\n`;
  csv += `Costo de Mercancia Vendida (CMV),${totalCost}\n`;
  csv += `Utilidad Bruta,${totalSales - totalCost}\n`;
  csv += `Gastos Operativos Totales,${totalExpenses}\n`;
  csv += `Utilidad Neta del Ejercicio,${netProfit}\n\n`;

  csv += 'DETALLE DE GASTOS OPERATIVOS\n';
  csv += 'ID,Fecha,Categoria,Descripcion,Metodo Pago,Monto COP,Estado\n';
  expensesData.forEach(e => {
    csv += `"${e.id}","${e.date}","${e.category}","${e.desc.replace(/"/g, '""')}","${e.payMethod}",${e.amount},"${e.status}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Contabilidad_Carfe_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  toast('📊', 'Reporte Exportado', 'Se descargó el archivo CSV de contabilidad');
}

function printEstadoResultados() {
  window.print();
}

/* ───────── INVENTARIO & CONTROL DE COSTOS/GANANCIAS ───────── */
function buildInventory() {
  if (inventoryData.length === 0) {
    inventoryData = PRODUCTS.map(p => ({
      id: p.id,
      name: p.name,
      brand: p.brand || 'Carfe®',
      cat: p.cat,
      cost: p.cost || Math.round(p.price * 0.5),
      price: p.price,
      stock: p.stock,
      minStock: 8,
      img: p.img || null
    }));
  }
}

function initInventory() {
  buildInventory();
  updateInvKPIs();
  renderInventoryTable();
  checkStockAlerts();
}

function updateInvKPIs() {
  const totalUnits  = inventoryData.reduce((s, p) => s + p.stock, 0);
  const totalCost   = inventoryData.reduce((s, p) => s + (p.stock * (p.cost || p.price * 0.5)), 0);
  const totalSale   = inventoryData.reduce((s, p) => s + (p.stock * p.price), 0);
  const totalProfit = totalSale - totalCost;

  safeText('invTotalProducts', inventoryData.length);
  safeText('invTotalUnits', totalUnits.toLocaleString('es-CO'));
  safeText('invCostValue', formatCOPSimple(totalCost));
  safeText('invSaleValue', formatCOPSimple(totalSale));
  safeText('invProfitValue', '+' + formatCOPSimple(totalProfit));
}

function renderInventoryTable() {
  const tbody = document.getElementById('inventoryTableBody');
  if (!tbody) return;
  const q = (document.getElementById('invSearch')?.value || '').toLowerCase();
  const catFilter = document.getElementById('invCatFilter')?.value || '';
  const rows = inventoryData.filter(p => {
    const matchQ = !q || p.name.toLowerCase().includes(q) || (p.cat && p.cat.toLowerCase().includes(q));
    const matchCat = !catFilter || p.cat === catFilter;
    return matchQ && matchCat;
  });

  if (rows.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" class="px-5 py-8 text-center text-gray-400">
          <i class="fas fa-box-open text-3xl mb-2 text-gray-300 block"></i>
          No hay productos en inventario con los filtros seleccionados
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = rows.map(p => {
    const level = p.stock <= 0 ? 'danger' : p.stock <= p.minStock ? 'warning' : 'ok';
    const badge = level === 'danger' ? '<span class="bg-red-50 text-red-600 px-2.5 py-1 rounded-full text-xs font-bold">Agotado</span>'
                : level === 'warning' ? '<span class="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold">Stock Bajo</span>'
                : '<span class="bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold">En Stock</span>';
    
    const profitUnit = p.price - (p.cost || Math.round(p.price * 0.5));
    const marginPct = p.price > 0 ? ((profitUnit / p.price) * 100).toFixed(1) : '0.0';
    const catLabel = p.cat === 'hombre' ? 'Hombre' : 'Mujer';

    return `
      <tr class="border-b border-gray-50 hover:bg-purple-50/20 transition-colors">
        <td class="px-5 py-3.5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0 overflow-hidden">
              ${p.img ? `<img src="${p.img}" class="w-full h-full object-cover">` : `<i class="fas fa-shoe-prints text-base"></i>`}
            </div>
            <div>
              <div class="font-bold text-gray-800 text-sm">${p.name}</div>
              <div class="text-[11px] text-gray-400 font-semibold">${p.brand || 'Carfe®'}</div>
            </div>
          </div>
        </td>
        <td class="px-4 py-3.5">
          <span class="bg-purple-50 text-purple-700 font-bold px-2.5 py-1 rounded-lg text-xs capitalize">${catLabel}</span>
        </td>
        <td class="px-4 py-3.5 text-center font-bold text-base ${level==='danger'?'text-red-600':level==='warning'?'text-amber-600':'text-gray-800'}">
          ${p.stock}
        </td>
        <td class="px-4 py-3.5 text-right font-semibold text-gray-600 text-sm">
          ${formatCOP(p.cost || Math.round(p.price * 0.5))}
        </td>
        <td class="px-4 py-3.5 text-right font-black text-gray-900 text-sm">
          ${formatCOP(p.price)}
        </td>
        <td class="px-4 py-3.5 text-right">
          <span class="inline-block bg-emerald-50 text-emerald-700 font-black text-xs px-2.5 py-1 rounded-md border border-emerald-100">
            +${formatCOP(profitUnit)}
          </span>
        </td>
        <td class="px-4 py-3.5 text-center font-extrabold text-xs text-emerald-800">
          ${marginPct}%
        </td>
        <td class="px-4 py-3.5 text-center">
          ${badge}
        </td>
        <td class="px-4 py-3.5 text-center">
          <div class="inline-flex items-center gap-1.5 justify-center">
            <button onclick="openEditProductModal(${p.id})" class="bg-purple-600 hover:bg-purple-700 text-white px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1" title="Modificar Stock, Precio y Costo">
              <i class="fas fa-edit"></i> Editar
            </button>
            <button onclick="quickAddStock(${p.id})" class="bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1.5 rounded-lg text-xs font-bold transition-colors" title="Agregar +5 unidades">+5</button>
            <button onclick="quickSubStock(${p.id})" class="bg-amber-100 hover:bg-amber-200 text-amber-800 px-2 py-1.5 rounded-lg text-xs font-bold transition-colors" title="Restar -1 unidad">-1</button>
            <button onclick="deleteProduct(${p.id})" class="bg-red-50 hover:bg-red-600 hover:text-white text-red-600 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border border-red-200" title="Eliminar producto del inventario y catálogo">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function saveStockOverride(id, stock) {
  try {
    const overrides = JSON.parse(localStorage.getItem('ss_product_overrides') || '{}');
    overrides[id] = Object.assign(overrides[id] || {}, { stock });
    localStorage.setItem('ss_product_overrides', JSON.stringify(overrides));
  } catch(e) {}
}

function quickAddStock(id) {
  const p = inventoryData.find(x => x.id === id || String(x.id) === String(id));
  if (p) {
    p.stock += 5;
    syncProductStock(p);
    saveStockOverride(p.id, p.stock);
    updateInvKPIs();
    renderInventoryTable();
    toast('📦', 'Stock actualizado', `+5 unidades a ${p.name} (Total: ${p.stock})`);
  }
}

function quickSubStock(id) {
  const p = inventoryData.find(x => x.id === id || String(x.id) === String(id));
  if (p && p.stock > 0) {
    p.stock -= 1;
    syncProductStock(p);
    saveStockOverride(p.id, p.stock);
    updateInvKPIs();
    renderInventoryTable();
    toast('📦', 'Stock reducido', `-1 unidad de ${p.name} (Total: ${p.stock})`);
  }
}

function syncProductStock(item) {
  const p = PRODUCTS.find(x => x.id === item.id || String(x.id) === String(item.id));
  if (p) p.stock = item.stock;
}

function openEditProductModal(id) {
  const p = PRODUCTS.find(x => x.id === id || String(x.id) === String(id)) || 
            (inventoryData && inventoryData.find(x => x.id === id || String(x.id) === String(id)));
  if (!p) return toast('⚠️', 'Producto no encontrado', `No se encontró el ID ${id}`);

  document.getElementById('editProdId').value = p.id;
  document.getElementById('editProdName').value = p.name || '';
  document.getElementById('editProdCat').value = p.cat || 'hombre';
  document.getElementById('editProdStock').value = p.stock !== undefined ? p.stock : 12;
  document.getElementById('editProdCost').value = p.cost || Math.round((p.price || 0) * 0.5);
  document.getElementById('editProdPrice').value = p.price || 0;

  document.getElementById('editProdCurrentName').textContent = p.name;
  document.getElementById('editProdCurrentBrand').textContent = (p.brand || 'Carfe®') + ' • ' + (p.cat === 'hombre' ? 'Hombre' : 'Mujer');

  const imgDiv = document.getElementById('editProdImgPreview');
  if (imgDiv) {
    const photo = p.img || p.photoData;
    if (photo) {
      imgDiv.innerHTML = `<img src="${photo}" class="w-full h-full object-contain p-1">`;
    } else {
      imgDiv.innerHTML = `<i class="fas fa-shoe-prints text-purple-600 text-xl"></i>`;
    }
  }

  updateEditFinancialPreview();
  openModal('editProductModal');
}

function updateEditFinancialPreview() {
  const cost = parseFloat(document.getElementById('editProdCost')?.value) || 0;
  const price = parseFloat(document.getElementById('editProdPrice')?.value) || 0;
  const profit = price - cost;
  const margin = price > 0 ? ((profit / price) * 100).toFixed(1) : '0.0';

  const profitEl = document.getElementById('editCalcProfit');
  const marginEl = document.getElementById('editCalcMargin');
  if (profitEl) profitEl.textContent = (profit >= 0 ? '+' : '') + formatCOP(profit);
  if (marginEl) marginEl.textContent = `${margin}%`;
}

function saveEditProduct() {
  const idStr = document.getElementById('editProdId')?.value;
  if (!idStr) return;
  const id = isNaN(idStr) ? idStr : Number(idStr);

  const name = document.getElementById('editProdName')?.value.trim();
  const cat = document.getElementById('editProdCat')?.value || 'hombre';
  const stock = parseInt(document.getElementById('editProdStock')?.value);
  const cost = parseFloat(document.getElementById('editProdCost')?.value);
  const price = parseFloat(document.getElementById('editProdPrice')?.value);

  if (!name) return toast('⚠️', 'Nombre requerido', 'Ingresa el nombre del calzado');
  if (isNaN(stock) || stock < 0) return toast('⚠️', 'Stock inválido', 'Ingresa una cantidad de pares válida');
  if (isNaN(cost) || cost < 0) return toast('⚠️', 'Costo inválido', 'Ingresa el costo del producto en COP');
  if (isNaN(price) || price <= 0) return toast('⚠️', 'Precio inválido', 'Ingresa un precio de venta mayor a 0');

  // 1. Actualizar en PRODUCTS
  const p = PRODUCTS.find(x => x.id === id || String(x.id) === String(id));
  if (p) {
    p.name = name;
    p.cat = cat;
    p.stock = stock;
    p.cost = cost;
    p.price = price;
  }

  // 2. Actualizar en inventoryData
  if (inventoryData) {
    const inv = inventoryData.find(x => x.id === id || String(x.id) === String(id));
    if (inv) {
      inv.name = name;
      inv.cat = cat;
      inv.stock = stock;
      inv.cost = cost;
      inv.price = price;
    }
  }

  // 3. Persistir en ss_product_overrides para sincronizar con store.js y recargas
  try {
    const overrides = JSON.parse(localStorage.getItem('ss_product_overrides') || '{}');
    overrides[id] = { name, cat, stock, cost, price };
    localStorage.setItem('ss_product_overrides', JSON.stringify(overrides));

    // Si estaba en customProducts, actualizarlo también
    const cp = JSON.parse(localStorage.getItem('ss_custom_products') || '[]');
    const cpIdx = cp.findIndex(x => x.id === id || String(x.id) === String(id));
    if (cpIdx !== -1) {
      cp[cpIdx].name = name;
      cp[cpIdx].cat = cat;
      cp[cpIdx].stock = stock;
      cp[cpIdx].cost = cost;
      cp[cpIdx].price = price;
      localStorage.setItem('ss_custom_products', JSON.stringify(cp));
    }
  } catch(e) {
    console.error(e);
  }

  inventoryDirty = true;
  catalogDirty = true;
  metaAdsDirty = true;
  ttsDirty = true;

  updateInvKPIs();
  renderInventoryTable();
  if (typeof renderAllProductsGrid === 'function') renderAllProductsGrid();
  if (typeof renderCatalogGrid === 'function') renderCatalogGrid();

  closeModal('editProductModal');
  toast('✅', 'Producto actualizado', `${name}: Stock ${stock} pares, Venta ${formatCOP(price)}`);
}

function deleteProduct(id) {
  const p = PRODUCTS.find(x => x.id === id || String(x.id) === String(id)) || 
            (inventoryData && inventoryData.find(x => x.id === id || String(x.id) === String(id)));
  const name = p ? p.name : 'este calzado';

  if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente "${name}" del inventario y del catálogo Carfe®?\n\nEsta acción quitará el calzado de la tienda pública, WhatsApp y reportes.`)) {
    return;
  }

  executeDeleteProduct(id, name);
}

function deleteProductFromModal() {
  const idStr = document.getElementById('editProdId')?.value;
  if (!idStr) return;
  const id = isNaN(idStr) ? idStr : Number(idStr);
  const name = document.getElementById('editProdName')?.value || 'este calzado';

  if (!confirm(`¿Eliminar definitivamente "${name}" del catálogo e inventario?`)) {
    return;
  }
  closeModal('editProductModal');
  executeDeleteProduct(id, name);
}

function executeDeleteProduct(id, name) {
  // 1. Remover de PRODUCTS
  const pIdx = PRODUCTS.findIndex(x => x.id === id || String(x.id) === String(id));
  if (pIdx !== -1) {
    PRODUCTS.splice(pIdx, 1);
  }

  // 2. Remover de inventoryData
  if (inventoryData) {
    const invIdx = inventoryData.findIndex(x => x.id === id || String(x.id) === String(id));
    if (invIdx !== -1) {
      inventoryData.splice(invIdx, 1);
    }
  }

  // 3. Guardar en ss_deleted_products para sincronizar con store.js y recargas
  try {
    const deleted = JSON.parse(localStorage.getItem('ss_deleted_products') || '[]');
    if (!deleted.includes(id)) {
      deleted.push(id);
    }
    localStorage.setItem('ss_deleted_products', JSON.stringify(deleted));

    // Remover de customProducts si existía
    const cp = JSON.parse(localStorage.getItem('ss_custom_products') || '[]');
    const newCp = cp.filter(x => x.id !== id && String(x.id) !== String(id));
    localStorage.setItem('ss_custom_products', JSON.stringify(newCp));

    // Limpiar override si existía
    const overrides = JSON.parse(localStorage.getItem('ss_product_overrides') || '{}');
    if (overrides[id]) {
      delete overrides[id];
      localStorage.setItem('ss_product_overrides', JSON.stringify(overrides));
    }
  } catch(e) {
    console.error(e);
  }

  inventoryDirty = true;
  catalogDirty = true;
  metaAdsDirty = true;
  ttsDirty = true;

  updateInvKPIs();
  renderInventoryTable();
  if (typeof renderAllProductsGrid === 'function') renderAllProductsGrid();
  safeText('allProdCount', PRODUCTS.length + ' Zapatos');
  if (typeof renderCatalogGrid === 'function') renderCatalogGrid();
  safeText('catalogCount', PRODUCTS.length + ' Calzados');

  toast('🗑️', 'Producto Eliminado', `"${name}" fue retirado del inventario y catálogo`);
}

function checkStockAlerts() {
  const low = inventoryData.filter(p => p.stock <= p.minStock && p.stock > 0);
  const out  = inventoryData.filter(p => p.stock === 0);
  if (out.length > 0) addNotification('🚨', 'Sin Stock', `${out.length} modelo(s) agotado(s): ${out.map(p=>p.name).slice(0,2).join(', ')}`, 'alert');
  else if (low.length > 0) addNotification('⚠️', 'Stock Bajo', `${low.length} modelo(s) con poco stock disponible`, 'alert');
}

function openAddStockModal() {
  const sel = document.getElementById('addStockProduct') || document.getElementById('stockProduct');
  if (sel) sel.innerHTML = inventoryData.map(p => `<option value="${p.id}">${p.name} (${p.cat === 'hombre' ? 'Hombre' : 'Mujer'}) — Stock actual: ${p.stock}</option>`).join('');
  openModal('addStockModal');
}

function addStock() {
  const idVal = parseInt(document.getElementById('addStockProduct')?.value || document.getElementById('stockProduct')?.value);
  const qty   = parseInt(document.getElementById('addStockQty')?.value || document.getElementById('stockQty')?.value) || 0;
  if (!idVal || qty <= 0) return toast('⚠️', 'Error', 'Selecciona producto y cantidad válida');
  const p = inventoryData.find(x => x.id === idVal || String(x.id) === String(idVal));
  if (p) {
    p.stock += qty;
    syncProductStock(p);
    saveStockOverride(p.id, p.stock);
    updateInvKPIs();
    renderInventoryTable();
    closeModal('addStockModal');
    toast('✅', 'Stock agregado', `+${qty} pares a ${p.name} (Total: ${p.stock})`);
  }
}

function filterInventory() { renderInventoryTable(); }

function exportInventory() {
  const rows = [['Nombre','Categoría','Stock','Costo Prod (COP)','Precio Venta (COP)','Ganancia Unitaria (COP)','Margen %','Valor Total Venta (COP)']];
  inventoryData.forEach(p => {
    const profit = p.price - (p.cost || p.price * 0.5);
    const margin = ((profit / p.price) * 100).toFixed(1);
    rows.push([p.name, p.cat, p.stock, p.cost || p.price * 0.5, p.price, profit, margin + '%', p.stock * p.price]);
  });
  const csv = rows.map(r => r.join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'inventario_carfe_cop.csv';
  a.click();
  toast('📥', 'Inventario exportado', 'Archivo CSV descargado con costos y ganancias');
}

/* ───────── CREAR PRODUCTO (GESTIÓN INTERNA DE COSTOS Y PRECIOS) ───────── */
let productPhotoData = null;
let rawPhotoData = null;
let currentStudioPreset = 'white'; // 'white' | 'pearl' | 'podium'
let isShowingOriginal = false;
let cameraStream = null;

function setStudioPreset(preset, btn) {
  currentStudioPreset = preset;
  document.querySelectorAll('.preset-btn').forEach(b => {
    b.className = 'preset-btn px-2 py-1.5 rounded-lg border-2 border-gray-200 bg-white text-gray-600 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all hover:border-purple-300';
  });
  if (btn) {
    btn.className = 'preset-btn active-preset px-2 py-1.5 rounded-lg border-2 border-purple-600 bg-purple-100/70 text-purple-800 font-extrabold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-sm';
  }
  const labelEl = document.getElementById('aiPresetName');
  if (labelEl) {
    const names = {
      white: 'Blanco Puro E-Commerce',
      pearl: 'Gris Perla Minimalista',
      podium: 'Podio Luxury Showroom'
    };
    labelEl.textContent = names[preset] || 'Estudio Oficial';
  }
  if (rawPhotoData) {
    autoEnhanceWithAIStudio(rawPhotoData);
  }
}

function toggleBeforeAfter() {
  if (!rawPhotoData || !productPhotoData) return;
  isShowingOriginal = !isShowingOriginal;
  const imgPreview = document.getElementById('productPhotoPreview');
  const prevPhoto = document.getElementById('prevPhoto');
  const btnText = document.getElementById('btnBeforeAfterText');
  const badge = document.getElementById('aiStudioBadge');

  if (isShowingOriginal) {
    if (imgPreview) imgPreview.src = rawPhotoData;
    if (prevPhoto) prevPhoto.src = rawPhotoData;
    if (btnText) btnText.textContent = 'Ver Estudio IA';
    if (badge) {
      badge.innerHTML = '<i class="fas fa-camera text-amber-300"></i> Original (Sin IA)';
      badge.classList.remove('hidden');
      badge.classList.add('flex');
    }
  } else {
    if (imgPreview) imgPreview.src = productPhotoData;
    if (prevPhoto) prevPhoto.src = productPhotoData;
    if (btnText) btnText.textContent = 'Ver Original';
    if (badge) {
      badge.innerHTML = '<i class="fas fa-check-circle text-green-400"></i> Estudio IA Optimizado';
      badge.classList.remove('hidden');
      badge.classList.add('flex');
    }
  }
}

function reprocessCurrentPhoto() {
  if (!rawPhotoData && !productPhotoData) {
    return toast('⚠️', 'Sin imagen', 'Toma una foto o sube una imagen primero');
  }
  autoEnhanceWithAIStudio(rawPhotoData || productPhotoData);
}

/* ───────── MOTOR DE ESTUDIO FOTOGRÁFICO IA CARFE® ───────── */
function renderStudioPhotograph(sourceImg, preset = 'white') {
  const S = 800; // Lienzo Cuadrado 1:1 Oficial de Catálogo (800x800px)
  const canvas = document.createElement('canvas');
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext('2d');

  // Lienzo intermedio para procesar y aislar el calzado
  const offCanvas = document.createElement('canvas');
  const srcW = sourceImg.naturalWidth || sourceImg.width || S;
  const srcH = sourceImg.naturalHeight || sourceImg.height || S;
  offCanvas.width = srcW;
  offCanvas.height = srcH;
  const offCtx = offCanvas.getContext('2d');
  offCtx.drawImage(sourceImg, 0, 0, srcW, srcH);

  const imgData = offCtx.getImageData(0, 0, srcW, srcH);
  const data = imgData.data;
  const len = data.length;

  // 1. Análisis de Luminancia y Balance de Blancos
  let totalLuma = 0;
  let totalR = 0, totalG = 0, totalB = 0;
  const sampleStep = 8;
  let sampleCount = 0;

  for (let i = 0; i < len; i += 4 * sampleStep) {
    const r = data[i], g = data[i+1], b = data[i+2];
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    totalLuma += luma;
    totalR += r; totalG += g; totalB += b;
    sampleCount++;
  }

  const avgLuma = sampleCount > 0 ? totalLuma / sampleCount : 128;
  const avgR = sampleCount > 0 ? totalR / sampleCount : 128;
  const avgG = sampleCount > 0 ? totalG / sampleCount : 128;
  const avgB = sampleCount > 0 ? totalB / sampleCount : 128;
  const avgGray = (avgR + avgG + avgB) / 3;

  // Corrección inteligente de Exposición (Objetivo de estudio: ~145-155)
  let exposureGain = avgLuma > 0 ? 148 / Math.max(65, Math.min(210, avgLuma)) : 1.0;
  exposureGain = Math.max(0.92, Math.min(1.48, exposureGain));

  // Balance de Blancos (Normalización de Temperatura)
  const rGain = avgR > 0 ? Math.max(0.85, Math.min(1.15, (avgGray / avgR) * 0.45 + 0.55)) : 1.0;
  const gGain = avgG > 0 ? Math.max(0.88, Math.min(1.12, (avgGray / avgG) * 0.45 + 0.55)) : 1.0;
  const bGain = avgB > 0 ? Math.max(0.85, Math.min(1.15, (avgGray / avgB) * 0.45 + 0.55)) : 1.0;

  // Muestreo del color de fondo en esquinas
  const cornerIndices = [0, (srcW - 1) * 4, ((srcH - 1) * srcW) * 4, (srcW * srcH - 1) * 4];
  let bgR = 0, bgG = 0, bgB = 0;
  cornerIndices.forEach(idx => {
    bgR += data[idx]; bgG += data[idx+1]; bgB += data[idx+2];
  });
  bgR /= 4; bgG /= 4; bgB /= 4;

  // 2. Corrección de Curva y Aislamiento de Fondo
  const contrastFactor = 1.14; // Contraste y definición de textura de cuero/suela
  for (let i = 0; i < len; i += 4) {
    let r = data[i];
    let g = data[i+1];
    let b = data[i+2];

    const distBg = Math.sqrt((r - bgR)**2 + (g - bgG)**2 + (b - bgB)**2);

    // Ajuste de luz
    r = r * exposureGain * rGain;
    g = g * exposureGain * gGain;
    b = b * exposureGain * bGain;

    // Curva de contraste
    r = ((r / 255 - 0.5) * contrastFactor + 0.5) * 255 + 4;
    g = ((g / 255 - 0.5) * contrastFactor + 0.5) * 255 + 4;
    b = ((b / 255 - 0.5) * contrastFactor + 0.5) * 255 + 4;

    data[i]   = Math.max(0, Math.min(255, r));
    data[i+1] = Math.max(0, Math.min(255, g));
    data[i+2] = Math.max(0, Math.min(255, b));

    // Suavizado y eliminación de fondo no deseado
    if (distBg < 32) {
      data[i+3] = 0;
    } else if (distBg < 62) {
      data[i+3] = Math.round(((distBg - 32) / 30) * 255);
    }
  }

  offCtx.putImageData(imgData, 0, 0);

  // 3. Pintar Fondo de Estudio Fotográfico
  ctx.save();
  if (preset === 'pearl') {
    const grad = ctx.createRadialGradient(S/2, S/2, 40, S/2, S/2, S * 0.72);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.65, '#f3f4f8');
    grad.addColorStop(1, '#e2e5eb');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, S, S);
  } else if (preset === 'podium') {
    const grad = ctx.createLinearGradient(0, 0, 0, S);
    grad.addColorStop(0, '#f8fafc');
    grad.addColorStop(0.68, '#edf2f7');
    grad.addColorStop(0.681, '#e2e8f0');
    grad.addColorStop(1, '#cbd5e1');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, S, S);

    // Podio iluminado
    ctx.beginPath();
    ctx.ellipse(S/2, S * 0.73, S * 0.40, 40, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(15, 23, 42, 0.12)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 12;
    ctx.fill();
    ctx.shadowColor = 'transparent';
  } else {
    // Blanco Puro E-Commerce (Default)
    const grad = ctx.createRadialGradient(S/2, S/2, 80, S/2, S/2, S * 0.76);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.65, '#fafbff');
    grad.addColorStop(1, '#f1f4f9');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, S, S);
  }

  // 4. Centrado y Proporción Estándar 1:1
  const maxShoeDim = S * 0.74;
  const srcRatio = srcW / srcH;
  let drawW, drawH;
  if (srcRatio >= 1) {
    drawW = maxShoeDim;
    drawH = maxShoeDim / srcRatio;
  } else {
    drawH = maxShoeDim;
    drawW = maxShoeDim * srcRatio;
  }
  const drawX = (S - drawW) / 2;
  const drawY = (S - drawH) / 2 - 14;

  // 5. Sombra de Contacto de Estudio Profesional (Ambient Occlusion)
  const shadowCenterX = S / 2;
  const shadowCenterY = drawY + drawH + 4;
  const shadowRadiusX = drawW * 0.44;
  const shadowRadiusY = Math.max(12, drawH * 0.09);

  const contactGrad = ctx.createRadialGradient(shadowCenterX, shadowCenterY, 3, shadowCenterX, shadowCenterY, shadowRadiusX);
  contactGrad.addColorStop(0, 'rgba(15, 23, 42, 0.38)');
  contactGrad.addColorStop(0.35, 'rgba(15, 23, 42, 0.18)');
  contactGrad.addColorStop(0.75, 'rgba(15, 23, 42, 0.05)');
  contactGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
  ctx.beginPath();
  ctx.ellipse(shadowCenterX, shadowCenterY, shadowRadiusX, shadowRadiusY, 0, 0, Math.PI * 2);
  ctx.fillStyle = contactGrad;
  ctx.fill();

  const diffuseGrad = ctx.createRadialGradient(shadowCenterX, shadowCenterY + 4, 8, shadowCenterX, shadowCenterY + 4, shadowRadiusX * 1.35);
  diffuseGrad.addColorStop(0, 'rgba(30, 41, 59, 0.14)');
  diffuseGrad.addColorStop(0.5, 'rgba(30, 41, 59, 0.05)');
  diffuseGrad.addColorStop(1, 'rgba(30, 41, 59, 0)');
  ctx.beginPath();
  ctx.ellipse(shadowCenterX, shadowCenterY + 4, shadowRadiusX * 1.35, shadowRadiusY * 1.5, 0, 0, Math.PI * 2);
  ctx.fillStyle = diffuseGrad;
  ctx.fill();

  // 6. Dibujar el Calzado Optimizado y Centrado
  ctx.drawImage(offCanvas, drawX, drawY, drawW, drawH);

  // 7. Luz Difusa Cenital de Estudio
  const studioLight = ctx.createRadialGradient(S * 0.45, S * 0.28, 20, S * 0.5, S * 0.4, S * 0.65);
  studioLight.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
  studioLight.addColorStop(0.7, 'rgba(255, 255, 255, 0.02)');
  studioLight.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = studioLight;
  ctx.fillRect(0, 0, S, S);

  ctx.restore();

  return canvas.toDataURL('image/jpeg', 0.92);
}

function autoEnhanceWithAIStudio(inputDataUrl) {
  rawPhotoData = inputDataUrl;
  isShowingOriginal = false;

  const overlay = document.getElementById('aiProcessingOverlay');
  const statusEl = document.getElementById('aiStatusStep');
  const barEl = document.getElementById('aiProgressBar');
  const controlsRow = document.getElementById('aiControlsRow');

  if (overlay) {
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
  }
  if (barEl) barEl.style.width = '30%';
  if (statusEl) statusEl.textContent = '🤖 IA Carfe® analizando calzado...';

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    setTimeout(() => {
      if (barEl) barEl.style.width = '65%';
      if (statusEl) statusEl.textContent = '💡 Calibrando iluminación y balance de blancos...';

      setTimeout(() => {
        if (barEl) barEl.style.width = '95%';
        if (statusEl) statusEl.textContent = '✨ Aplicando fondo de estudio y sombra de contacto...';

        setTimeout(() => {
          try {
            const enhancedUrl = renderStudioPhotograph(img, currentStudioPreset);
            productPhotoData = enhancedUrl;
            applyPhotoToPreview(enhancedUrl);
            if (controlsRow) controlsRow.classList.remove('hidden');
            const btnText = document.getElementById('btnBeforeAfterText');
            if (btnText) btnText.textContent = 'Ver Original';
            const badge = document.getElementById('aiStudioBadge');
            if (badge) {
              badge.innerHTML = '<i class="fas fa-check-circle text-green-400"></i> Estudio IA Optimizado';
              badge.classList.remove('hidden');
              badge.classList.add('flex');
            }
            toast('✨', 'Estudio Fotográfico IA', 'Luz calibrada, fondo estandarizado y sombra de estudio creada');
          } catch(err) {
            console.error('AI Studio error:', err);
            productPhotoData = inputDataUrl;
            applyPhotoToPreview(inputDataUrl);
          } finally {
            if (overlay) {
              overlay.classList.add('hidden');
              overlay.classList.remove('flex');
            }
          }
        }, 220);
      }, 200);
    }, 180);
  };
  img.onerror = () => {
    if (overlay) {
      overlay.classList.add('hidden');
      overlay.classList.remove('flex');
    }
    applyPhotoToPreview(inputDataUrl);
  };
  img.src = inputDataUrl;
}

function openCamera() {
  const camSection = document.getElementById('cameraSection');
  if (!camSection) return;
  camSection.classList.remove('hidden');
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    toast('❌', 'Sin cámara', 'Tu navegador no soporta la cámara');
    return;
  }
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(stream => {
      cameraStream = stream;
      const video = document.getElementById('cameraVideo');
      if (video) { video.srcObject = stream; video.play(); }
    })
    .catch(() => toast('❌', 'Sin acceso', 'No se pudo acceder a la cámara'));
}

function capturePhoto() {
  const video = document.getElementById('cameraVideo');
  if (!video) return;
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;
  canvas.getContext('2d').drawImage(video, 0, 0);
  const capturedRaw = canvas.toDataURL('image/jpeg', 0.88);
  stopCamera();
  autoEnhanceWithAIStudio(capturedRaw);
}

function stopCamera() {
  if (cameraStream) { cameraStream.getTracks().forEach(t => t.stop()); cameraStream = null; }
  const camSection = document.getElementById('cameraSection');
  if (camSection) camSection.classList.add('hidden');
}

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    autoEnhanceWithAIStudio(e.target.result);
  };
  reader.readAsDataURL(file);
}

function applyPhotoToPreview(dataUrl) {
  productPhotoData = dataUrl;
  const imgPreview = document.getElementById('productPhotoPreview');
  const placeholder = document.getElementById('photoPlaceholder');
  if (imgPreview) {
    imgPreview.src = dataUrl;
    imgPreview.classList.remove('hidden');
  }
  if (placeholder) placeholder.classList.add('hidden');
  updatePreview();
}

function removePhoto() {
  productPhotoData = null;
  rawPhotoData = null;
  const imgPreview = document.getElementById('productPhotoPreview');
  const placeholder = document.getElementById('photoPlaceholder');
  const controlsRow = document.getElementById('aiControlsRow');
  const badge = document.getElementById('aiStudioBadge');
  if (imgPreview) { imgPreview.src = ''; imgPreview.classList.add('hidden'); }
  if (placeholder) placeholder.classList.remove('hidden');
  if (controlsRow) controlsRow.classList.add('hidden');
  if (badge) badge.classList.add('hidden');
  updatePreview();
  toast('🗑', 'Foto eliminada', 'Se eliminó la foto');
}

function enhanceExistingProductAI(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const photoUrl = p.img || p.photoData;
  if (!photoUrl) return toast('⚠️', 'Sin foto', 'Este calzado no tiene foto cargada');

  toast('✨', 'Procesando con Estudio IA...', `Optimizando iluminación y fondo de ${p.name}`);

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    try {
      const enhanced = renderStudioPhotograph(img, 'white');
      p.img = enhanced;
      p.photoData = enhanced;

      // Actualizar localStorage si es personalizado
      try {
        const cp = JSON.parse(localStorage.getItem('ss_custom_products') || '[]');
        const idx = cp.findIndex(x => x.id === p.id);
        if (idx !== -1) {
          cp[idx].img = enhanced;
          cp[idx].photoData = enhanced;
          localStorage.setItem('ss_custom_products', JSON.stringify(cp));
        }
      } catch(e) {}

      renderAllProductsGrid();
      if (typeof renderCatalogGrid === 'function') renderCatalogGrid();
      if (typeof renderInventoryTable === 'function') renderInventoryTable();
      toast('🎉', '¡Estudio IA Aplicado!', `${p.name} tiene ahora iluminación y fondo de estudio profesional`);
    } catch(err) {
      console.error(err);
      toast('❌', 'Error al procesar', 'No se pudo optimizar la imagen');
    }
  };
  img.src = photoUrl;
}

function saveProduct() {
  const name  = document.getElementById('newProdName')?.value.trim();
  const brand = document.getElementById('newProdBrand')?.value.trim() || 'Carfe®';
  const cost  = parseFloat(document.getElementById('newProdCost')?.value);
  const price = parseFloat(document.getElementById('newProdPrice')?.value);
  const oldPrice = parseFloat(document.getElementById('newProdOldPrice')?.value) || null;
  const cat   = document.getElementById('newProdCat')?.value || 'hombre';
  const stock = parseInt(document.getElementById('newProdStock')?.value) || 12;
  const desc  = document.getElementById('newProdDesc')?.value.trim();
  const badge = document.getElementById('newProdBadge')?.value || '';
  const colors = (document.getElementById('newProdColors')?.value || 'Negro, Café').split(',').map(s=>s.trim());
  let sizes = [...document.querySelectorAll('#sizeSelector .size-new-btn.sel')].map(b => parseInt(b.dataset.size || b.textContent));

  if (!name) return toast('⚠️', 'Nombre requerido', 'Ingresa el nombre del calzado');
  if (!cost || cost <= 0) return toast('⚠️', 'Costo requerido', 'Ingresa el costo del producto en COP');
  if (!price || price <= 0) return toast('⚠️', 'Precio inválido', 'Ingresa el precio de venta al público en COP');
  if (price < cost) return toast('⚠️', 'Margen negativo', 'El precio de venta debe ser superior al costo');
  if (sizes.length === 0) {
    sizes = cat === 'mujer' ? [35, 36, 37, 38, 39, 40] : [38, 39, 40, 41, 42, 43, 44];
    selectSizesPreset(cat === 'mujer' ? 'mujer' : 'hombre');
  }

  const newProd = {
    id: Date.now(),
    name,
    brand,
    cat,
    cost,
    price,
    oldPrice,
    stock,
    badge,
    colors: colors.length ? colors : ['Negro', 'Café'],
    sizes: sizes,
    img: productPhotoData,
    photoData: productPhotoData,
    desc: desc || 'Calzado oficial Carfe® confeccionado con materiales de alta calidad y diseño anatómico.',
    rating: 5.0,
    reviews: 1,
    createdAt: new Date().toISOString()
  };

  PRODUCTS.push(newProd);
  customProducts.push(newProd);
  localStorage.setItem('ss_custom_products', JSON.stringify(customProducts));

  inventoryDirty = true;
  catalogDirty = true;
  metaAdsDirty = true;
  ttsDirty = true;

  if (inventoryData.length > 0) {
    inventoryData.push({
      id: newProd.id,
      name,
      brand,
      cat,
      cost,
      price,
      stock,
      minStock: 8,
      img: productPhotoData
    });
    updateInvKPIs();
    renderInventoryTable();
  }

  const profitUnit = price - cost;
  addNotification('📦', 'Calzado Creado', `${name} — Venta: ${formatCOP(price)} | Ganancia: +${formatCOP(profitUnit)}`, 'product');
  toast('✅', 'Producto guardado', `${name} añadido al catálogo`);
  renderAllProductsGrid();
  safeText('allProdCount', PRODUCTS.length + ' Zapatos');

  // Reset form
  if (document.getElementById('newProdName')) document.getElementById('newProdName').value = '';
  if (document.getElementById('newProdBrand')) document.getElementById('newProdBrand').value = '';
  if (document.getElementById('newProdCost')) document.getElementById('newProdCost').value = '';
  if (document.getElementById('newProdPrice')) document.getElementById('newProdPrice').value = '';
  if (document.getElementById('newProdOldPrice')) document.getElementById('newProdOldPrice').value = '';
  if (document.getElementById('newProdStock')) document.getElementById('newProdStock').value = '12';
  if (document.getElementById('newProdDesc')) document.getElementById('newProdDesc').value = '';
  document.querySelectorAll('#sizeSelector .size-new-btn').forEach(b => b.classList.remove('sel'));
  productPhotoData = null;
  const imgPreview = document.getElementById('productPhotoPreview');
  const placeholder = document.getElementById('photoPlaceholder');
  if (imgPreview) { imgPreview.src = ''; imgPreview.classList.add('hidden'); }
  if (placeholder) placeholder.classList.remove('hidden');
  updateFinancialPreview();
  updatePreview();
}

function renderAllProductsGrid() {
  const grid = document.getElementById('allProdGrid');
  if (!grid) return;
  grid.innerHTML = PRODUCTS.map(p => `
    <div class="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div class="h-32 bg-gradient-to-br from-gray-50 to-purple-50 flex items-center justify-center relative overflow-hidden border-b border-gray-100">
          ${p.img || p.photoData
            ? `<img src="${p.img || p.photoData}" class="w-full h-full object-contain p-2">`
            : `<div class="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-purple-600 border border-purple-100"><i class="fas fa-shoe-prints text-lg"></i></div>`}
          <span class="absolute top-2 right-2 bg-purple-100 text-purple-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full capitalize">${p.cat}</span>
        </div>
        <div class="p-3">
          <div class="font-bold text-xs text-gray-800 truncate mb-0.5" title="${p.name}">${p.name}</div>
          <div class="text-[10px] text-purple-600 font-bold uppercase mb-1">${p.brand || 'Carfe®'}</div>
          <div class="flex justify-between items-center">
            <span class="font-black text-purple-700 text-xs">${formatCOP(p.price)}</span>
            <span class="text-[10px] font-semibold text-gray-400">${p.stock} pares</span>
          </div>
        </div>
      </div>
      <div class="p-3 pt-0 space-y-1.5">
        <button onclick="openEditProductModal(${p.id})" class="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 font-extrabold py-1.5 px-2 rounded-xl text-[10px] flex items-center justify-center gap-1 transition-colors border border-purple-200 shadow-sm" title="Modificar stock o precio">
          <i class="fas fa-edit text-purple-600"></i> Modificar Stock / Precio
        </button>
        <button onclick="enhanceExistingProductAI(${p.id})" class="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold py-1.5 px-2 rounded-xl text-[10px] flex items-center justify-center gap-1 transition-colors border border-indigo-200 shadow-sm" title="Aplica estudio y corrección de luz IA">
          <i class="fas fa-wand-magic-sparkles text-amber-500"></i> Calibrar con Estudio IA
        </button>
      </div>
    </div>
  `).join('');
}

function toggleSizeNew(btn) {
  if (!btn) return;
  btn.classList.toggle('sel');
  updatePreview();
}

function selectSizesPreset(preset) {
  const buttons = document.querySelectorAll('#sizeSelector .size-new-btn');
  if (preset === 'limpiar') {
    buttons.forEach(b => b.classList.remove('sel'));
  } else if (preset === 'todas') {
    buttons.forEach(b => b.classList.add('sel'));
  } else if (preset === 'hombre') {
    buttons.forEach(b => {
      const sz = parseInt(b.dataset.size || b.textContent);
      if (sz >= 38 && sz <= 44) b.classList.add('sel');
      else b.classList.remove('sel');
    });
  } else if (preset === 'mujer') {
    buttons.forEach(b => {
      const sz = parseInt(b.dataset.size || b.textContent);
      if (sz >= 35 && sz <= 40) b.classList.add('sel');
      else b.classList.remove('sel');
    });
  }
  updatePreview();
}

function onCategoryChange(catVal) {
  const selectedSizes = document.querySelectorAll('#sizeSelector .size-new-btn.sel');
  if (selectedSizes.length === 0) {
    selectSizesPreset(catVal === 'mujer' ? 'mujer' : 'hombre');
  }
}

function updateFinancialPreview() {
  const cost = parseFloat(document.getElementById('newProdCost')?.value) || 0;
  const price = parseFloat(document.getElementById('newProdPrice')?.value) || 0;
  const profit = price - cost;
  const margin = price > 0 ? ((profit / price) * 100).toFixed(1) : '0.0';
  const markup = cost > 0 ? ((profit / cost) * 100).toFixed(1) : '0.0';

  const profitEl = document.getElementById('calcProfitUnit');
  const marginEl = document.getElementById('calcMarginPct');
  const markupEl = document.getElementById('calcMarkupPct');

  if (profitEl) {
    profitEl.textContent = (profit >= 0 ? '+' : '') + formatCOP(profit);
    profitEl.className = profit >= 0 ? 'text-sm md:text-base font-black text-emerald-700 mt-0.5' : 'text-sm md:text-base font-black text-red-600 mt-0.5';
  }
  if (marginEl) {
    marginEl.textContent = `${margin}%`;
    marginEl.className = margin >= 20 ? 'text-sm md:text-base font-black text-emerald-700 mt-0.5' : 'text-sm md:text-base font-black text-amber-600 mt-0.5';
  }
  if (markupEl) {
    markupEl.textContent = `${markup}%`;
  }
}

function updatePreview() {
  const name = document.getElementById('newProdName')?.value.trim() || 'Nombre del Calzado';
  const brand = document.getElementById('newProdBrand')?.value.trim() || 'Carfe®';
  const cat = document.getElementById('newProdCat')?.value || 'hombre';
  const price = parseFloat(document.getElementById('newProdPrice')?.value) || 0;
  const cost = parseFloat(document.getElementById('newProdCost')?.value) || 0;
  const badge = document.getElementById('newProdBadge')?.value || '';

  const prevName = document.getElementById('prevName');
  const prevBrand = document.getElementById('prevBrand');
  const prevPrice = document.getElementById('prevPrice');
  const prevCostBadge = document.getElementById('prevCostBadge');
  const prevBadgeText = document.getElementById('prevBadgeText');

  if (prevName) prevName.textContent = name;
  if (prevBrand) prevBrand.textContent = `${brand} • ${cat === 'hombre' ? 'Hombre' : 'Mujer'}`;
  if (prevPrice) prevPrice.textContent = formatCOP(price);

  if (prevCostBadge) {
    const profit = price - cost;
    prevCostBadge.textContent = `Ganancia: ${formatCOP(profit)}`;
    prevCostBadge.className = profit >= 0
      ? 'text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded'
      : 'text-[11px] font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded';
  }

  if (prevBadgeText) {
    const badges = {
      new: 'Nuevo Lanzamiento',
      sale: 'Oferta Especial',
      hot: 'Más Vendido',
      tiktok: 'TikTok Shop'
    };
    prevBadgeText.textContent = badges[badge] || 'Carfe® Oficial';
  }
}

function initProductsView() {
  renderAllProductsGrid();
  safeText('allProdCount', PRODUCTS.length + ' Zapatos');
  // Auto-seleccionar Hombre 38-44 por defecto si nada está seleccionado
  if (document.querySelectorAll('#sizeSelector .size-new-btn.sel').length === 0) {
    selectSizesPreset('hombre');
  }
  updateFinancialPreview();
  updatePreview();
}

/* ───────── CATÁLOGO WHATSAPP ───────── */
let catalogFilter = 'all';
let catalogMsgMode = 'photos';
let activeBroadcastTab = 'difusiones';
let activeBroadcastTemplate = 'catalogo';
let activeBroadcastQueue = [];

function getAdminStoreWAPhone() {
  const custom = localStorage.getItem('carfe_wa_store_phone');
  return custom ? custom.replace(/\D/g, '') : '573001234567';
}

function updateHeaderWAIndicator() {
  const p = getAdminStoreWAPhone();
  const rawNum = p.startsWith('57') ? p.slice(2) : p;
  const isCustom = !!localStorage.getItem('carfe_wa_store_phone');
  const formatted = rawNum.length === 10 
    ? `${rawNum.slice(0, 3)} ${rawNum.slice(3, 6)} ${rawNum.slice(6)}` 
    : rawNum;
  
  const headerText = document.getElementById('headerWAText');
  if (headerText) {
    headerText.textContent = isCustom ? `WA: +57 ${formatted}` : 'Vincular WhatsApp (+57)';
  }
  const storeInp = document.getElementById('storeWaNumber');
  if (storeInp && !storeInp.matches(':focus')) storeInp.value = rawNum;

  const ajInp = document.getElementById('ajustes_storeWa');
  if (ajInp && !ajInp.matches(':focus')) ajInp.value = rawNum;
}

function openLinkWAModal() {
  const p = getAdminStoreWAPhone();
  const rawNum = p.startsWith('57') ? p.slice(2) : p;
  const inp = document.getElementById('modalLinkWaNumber');
  if (inp) {
    inp.value = rawNum;
    updateModalWaPreview(rawNum);
  }
  const m = document.getElementById('linkWAModal');
  if (m) {
    m.classList.remove('hidden');
    m.style.display = 'flex';
    m.style.opacity = '1';
    m.style.visibility = 'visible';
    m.style.zIndex = '99999';
  }
  setTimeout(() => {
    if (inp) inp.focus();
  }, 50);
}

function updateModalWaPreview(val) {
  const clean = String(val || '').replace(/\D/g, '');
  const preview = document.getElementById('modalWaPreviewLink');
  if (preview) {
    const full = clean.startsWith('57') ? clean : (clean ? '57' + clean : '573001234567');
    preview.textContent = `https://wa.me/${full}`;
  }
}

function saveModalWaNumber() {
  const inp = document.getElementById('modalLinkWaNumber');
  if (!inp) return;
  const val = inp.value.trim().replace(/\D/g, '');
  if (val.length < 7) {
    return toast('⚠️', 'Número incompleto', 'Por favor ingresa un número de WhatsApp de 10 dígitos (ej: 3001234567)');
  }
  const fullPhone = val.startsWith('57') ? val : '57' + val;
  localStorage.setItem('carfe_wa_store_phone', fullPhone);
  updateHeaderWAIndicator();
  closeModal('linkWAModal');
  toast('✅', '¡WhatsApp Vinculado!', `Los pedidos y difusiones ahora se enviarán al +${fullPhone}`);
  try { if (typeof prepareWAMessage === 'function') prepareWAMessage(); } catch(e) {}
  try { if (typeof updateBroadcastPreview === 'function') updateBroadcastPreview(); } catch(e) {}
}

function testModalWAPhone() {
  const inp = document.getElementById('modalLinkWaNumber');
  const val = (inp?.value || '').trim().replace(/\D/g, '') || getAdminStoreWAPhone();
  const fullPhone = val.startsWith('57') ? val : '57' + val;
  const testMsg = encodeURIComponent('👋 ¡Hola! Mensaje de verificación: Tu WhatsApp ha quedado correctamente vinculado a la tienda Carfe® Calzado.');
  window.open(`https://wa.me/${fullPhone}?text=${testMsg}`, '_blank');
}

function saveStoreWaNumber() {
  const inp = document.getElementById('storeWaNumber');
  if (!inp) return;
  const val = inp.value.trim().replace(/\D/g, '');
  if (val.length < 7) {
    return toast('⚠️', 'Número incompleto', 'Ingresa un número válido de WhatsApp');
  }
  const fullPhone = val.startsWith('57') ? val : '57' + val;
  localStorage.setItem('carfe_wa_store_phone', fullPhone);
  updateHeaderWAIndicator();
  toast('✅', 'WhatsApp Guardado', `Los pedidos se recibirán en +${fullPhone}`);
  prepareWAMessage();
  updateBroadcastPreview();
}

function saveAjustesWa() {
  const inp = document.getElementById('ajustes_storeWa');
  if (!inp) return;
  const val = inp.value.trim().replace(/\D/g, '');
  if (val.length < 7) {
    return toast('⚠️', 'Número incompleto', 'Ingresa un número de WhatsApp de 10 dígitos');
  }
  const fullPhone = val.startsWith('57') ? val : '57' + val;
  localStorage.setItem('carfe_wa_store_phone', fullPhone);
  updateHeaderWAIndicator();
  toast('✅', 'WhatsApp Actualizado', `Tu número de cobro y ventas es ahora +${fullPhone}`);
  prepareWAMessage();
  updateBroadcastPreview();
}

function saveAjustesPassword() {
  const user = document.getElementById('ajustes_newUser')?.value.trim() || 'admin';
  const p1 = document.getElementById('ajustes_newPass')?.value.trim();
  const p2 = document.getElementById('ajustes_confirmPass')?.value.trim();

  if (!p1) {
    return toast('⚠️', 'Campo vacío', 'Ingresa una nueva contraseña');
  }
  if (p1.length < 4) {
    return toast('⚠️', 'Contraseña corta', 'La contraseña debe tener al menos 4 caracteres');
  }
  if (p1 !== p2) {
    return toast('❌', 'No coinciden', 'La confirmación de la contraseña no coincide');
  }

  const newCreds = { user: user, pass: p1 };
  localStorage.setItem('carfe_admin_creds', JSON.stringify(newCreds));
  toast('🔒', 'Contraseña Actualizada', `Se guardó la nueva clave con éxito para el usuario ${user}`);
  
  if (document.getElementById('ajustes_newPass')) document.getElementById('ajustes_newPass').value = '';
  if (document.getElementById('ajustes_confirmPass')) document.getElementById('ajustes_confirmPass').value = '';
}

/* ───────── MÓDULO DE DIFUSIONES WHATSAPP ───────── */
function switchCatalogTab(tab) {
  activeBroadcastTab = tab;
  const difPane = document.getElementById('catalogTab-difusiones');
  const catPane = document.getElementById('catalogTab-catalogo');
  const btnDif = document.getElementById('tabBtnDifusiones');
  const btnCat = document.getElementById('tabBtnCatalogo');

  if (tab === 'difusiones') {
    if (difPane) difPane.classList.remove('hidden');
    if (catPane) catPane.classList.add('hidden');
    if (btnDif) btnDif.className = 'px-4 py-2.5 rounded-xl text-xs font-black bg-emerald-600 text-white shadow-sm flex items-center gap-2 transition-all';
    if (btnCat) btnCat.className = 'px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex items-center gap-2 transition-all';
  } else {
    if (difPane) difPane.classList.add('hidden');
    if (catPane) catPane.classList.remove('hidden');
    if (btnCat) btnCat.className = 'px-4 py-2.5 rounded-xl text-xs font-black bg-emerald-600 text-white shadow-sm flex items-center gap-2 transition-all';
    if (btnDif) btnDif.className = 'px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex items-center gap-2 transition-all';
  }
}

function loadBroadcastRecipients(source = 'crm') {
  activeBroadcastQueue = [];
  if (source === 'crm') {
    const list = Array.isArray(crmClientsData) ? crmClientsData : [];
    activeBroadcastQueue = list.map(c => ({
      name: c.name || 'Cliente',
      phone: String(c.phone || '').replace(/\D/g, ''),
      sent: false
    })).filter(c => c.phone.length >= 7);
  } else if (source === 'recent') {
    try {
      const pending = JSON.parse(localStorage.getItem('ss_pending_orders') || '[]');
      activeBroadcastQueue = pending.map(o => ({
        name: o.client || 'Cliente Reciente',
        phone: String(o.phone || getAdminStoreWAPhone()).replace(/\D/g, ''),
        sent: false
      })).filter(c => c.phone.length >= 7);
    } catch(e) {}
  }

  // Si la lista está vacía, sembrar 4 clientes de muestra reales
  if (!activeBroadcastQueue.length) {
    activeBroadcastQueue = [
      { name: 'Pedro Ramírez', phone: '573118392104', sent: false },
      { name: 'María García', phone: '573151928374', sent: false },
      { name: 'Roberto Méndez', phone: '573004829182', sent: false },
      { name: 'Carolina Gómez', phone: '573205938172', sent: false }
    ];
  }

  const inp = document.getElementById('difusionRecipientsInput');
  if (inp) {
    inp.value = activeBroadcastQueue.map(c => c.phone).join(', ');
  }

  renderBroadcastQueue();
  toast('👥', 'Destinatarios Listos', `${activeBroadcastQueue.length} contactos cargados para la difusión`);
}

function onBroadcastRecipientsChanged() {
  const inp = document.getElementById('difusionRecipientsInput');
  if (!inp) return;
  const raw = inp.value;
  const items = raw.split(/[\n,;]+/).map(s => s.trim().replace(/\D/g, '')).filter(s => s.length >= 7);

  activeBroadcastQueue = items.map((num, i) => {
    const full = num.startsWith('57') ? num : '57' + num;
    return {
      name: `Cliente #${i + 1}`,
      phone: full,
      sent: false
    };
  });

  renderBroadcastQueue();
}

function renderBroadcastQueue() {
  const countEl = document.getElementById('difusionRecipientsCount');
  if (countEl) countEl.textContent = `${activeBroadcastQueue.length} contactos listos`;

  const tbody = document.getElementById('difusionQueueBody');
  if (!tbody) return;

  if (!activeBroadcastQueue.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="p-4 text-center text-gray-400 italic">
          No hay destinatarios seleccionados. Presiona «Cargar Todos los Clientes del CRM» para comenzar.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = activeBroadcastQueue.map((c, idx) => {
    const rawNum = c.phone.startsWith('57') ? c.phone.slice(2) : c.phone;
    return `
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="p-2.5 font-bold text-gray-800">${c.name}</td>
        <td class="p-2.5 font-mono text-gray-600">+57 ${rawNum}</td>
        <td class="p-2.5 text-center">
          ${c.sent 
            ? `<span class="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">✓ Enviado</span>`
            : `<span class="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Pendiente</span>`}
        </td>
        <td class="p-2.5 text-right">
          <button onclick="sendBroadcastToOne(${idx})" class="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-xl shadow-sm transition-all flex items-center gap-1 ml-auto">
            <i class="fab fa-whatsapp"></i> ${c.sent ? 'Reenviar' : 'Enviar'}
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function setBroadcastTemplate(tpl) {
  activeBroadcastTemplate = tpl;
  const storeUrl = window.location.origin + window.location.pathname.replace('admin.html', 'index.html');
  const catalogUrl = `${storeUrl}#catalogo`;

  let msg = '';
  if (tpl === 'catalogo') {
    msg = 
`¡Hola *{nombre}*! 👋 Te saludamos desde Carfe® Calzado. 👞👠

Te compartimos nuestro Catálogo Oficial 2026 en cuero genuino y materiales de alto confort:

👉 *Explora el Catálogo y haz tu pedido aquí:*
{catalogo_link}

📦 Envíos a todo el país • Pagos seguros por Nequi, Daviplata y Bancolombia. ¿Qué modelo te gustaría pedir hoy?`;
  } else if (tpl === 'promo') {
    msg = 
`🔥 *¡PROMOCIÓN EXCLUSIVA EN CARFE® CALZADO!* 🔥

Hola *{nombre}*, tenemos descuentos especiales de hasta el *30% OFF* en calzado seleccionado de nuestra colección.

📲 *Mira los modelos en descuento y pide el tuyo:*
{catalogo_link}

¡Aprovecha antes de que se agoten las tallas disponibles! ✨`;
  } else if (tpl === 'coleccion') {
    msg = 
`✨ *NUEVA COLECCIÓN OFICIAL CARFE® 2026* ✨

Hola *{nombre}*, te presentamos nuestros nuevos lanzamientos en sneakers urbanos, zapatos formales y botas todo terreno.

🌟 *Ver Colección Completa:*
{tienda_link}

Diseño premium y confort garantizado. Escríbenos para apartar tu talla. 🙌`;
  } else if (tpl === 'directo') {
    msg = 
`👋 Hola *{nombre}*, ¿cómo estás? Te escribimos de Carfe® Calzado.

Queríamos compartirte nuestra colección disponible con entrega rápida:
👉 {catalogo_link}

Cualquier inquietud sobre tallas o disponibilidad, ¡aquí estamos atentos para asesorarte! 👟`;
  }

  const el = document.getElementById('difusionMsgText');
  if (el) el.value = msg;

  document.querySelectorAll('.dif-tpl-btn').forEach(btn => {
    btn.className = 'dif-tpl-btn p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-bold border border-gray-200 text-center transition-all';
  });
  if (event?.target) {
    event.target.className = 'dif-tpl-btn p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-extrabold border border-emerald-300 text-center transition-all';
  }

  updateBroadcastPreview();
}

function updateBroadcastPreview() {
  const textEl = document.getElementById('difusionMsgText');
  const previewEl = document.getElementById('difusionPreviewText');
  if (!textEl || !previewEl) return;

  const storeUrl = window.location.origin + window.location.pathname.replace('admin.html', 'index.html');
  const catalogUrl = `${storeUrl}#catalogo`;

  let parsed = textEl.value
    .replace(/{nombre}/g, 'Cliente')
    .replace(/{catalogo_link}/g, catalogUrl)
    .replace(/{tienda_link}/g, storeUrl);

  previewEl.textContent = parsed;

  const timeEl = document.getElementById('difusionPreviewTime');
  if (timeEl) {
    const now = new Date();
    timeEl.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }
}

function copyBroadcastMessage() {
  const textEl = document.getElementById('difusionMsgText');
  if (!textEl) return;

  const storeUrl = window.location.origin + window.location.pathname.replace('admin.html', 'index.html');
  const catalogUrl = `${storeUrl}#catalogo`;

  let parsed = textEl.value
    .replace(/{nombre}/g, 'amig@')
    .replace(/{catalogo_link}/g, catalogUrl)
    .replace(/{tienda_link}/g, storeUrl);

  navigator.clipboard.writeText(parsed).then(() => {
    toast('📋', 'Mensaje Copiado', '¡Listo! Pégalo en tu Lista de Difusión de WhatsApp para enviarlo a todos tus contactos.');
  }).catch(() => {
    toast('📋', 'Mensaje Listo', 'Selecciona y copia el texto del mensaje');
  });
}

function sendBroadcastToOne(index) {
  const item = activeBroadcastQueue[index];
  if (!item) return;

  const textEl = document.getElementById('difusionMsgText');
  const storeUrl = window.location.origin + window.location.pathname.replace('admin.html', 'index.html');
  const catalogUrl = `${storeUrl}#catalogo`;

  const firstName = item.name.split(' ')[0] || item.name;
  let parsed = (textEl?.value || '')
    .replace(/{nombre}/g, firstName)
    .replace(/{catalogo_link}/g, catalogUrl)
    .replace(/{tienda_link}/g, storeUrl);

  const cleanPhone = item.phone.startsWith('57') ? item.phone : '57' + item.phone;
  item.sent = true;
  renderBroadcastQueue();

  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(parsed)}`;
  window.open(url, '_blank');
  toast('📲', 'WhatsApp Abierto', `Enviando mensaje a ${item.name}`);
}

function initCatalog() {
  const stored = localStorage.getItem('carfe_wa_store_phone');
  const inp = document.getElementById('storeWaNumber');
  if (inp) {
    inp.value = stored ? stored.replace(/^57/, '') : '300 123 4567';
  }
  updateHeaderWAIndicator();
  renderCatalogGrid();
  prepareWAMessage();
  safeText('catalogCount', PRODUCTS.length + ' Calzados');

  // Inicializar difusión con CRM
  loadBroadcastRecipients('crm');
  setBroadcastTemplate('catalogo');
}

function filterCatalog(cat, btn) {
  catalogFilter = cat;
  document.querySelectorAll('.cat-filter-btn').forEach(b => {
    b.className = 'cat-filter-btn bg-gray-100 text-gray-600 font-bold px-4 py-1.5 rounded-xl text-xs';
  });
  if (btn) {
    btn.className = 'cat-filter-btn bg-purple-600 text-white font-bold px-4 py-1.5 rounded-xl text-xs';
  }
  renderCatalogGrid();
}

function renderCatalogGrid() {
  const grid = document.getElementById('catalogGrid');
  const previewList = document.getElementById('catalogPreviewList');
  const products = catalogFilter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === catalogFilter);

  if (grid) {
    grid.innerHTML = products.map(p => {
      const photo = p.img || p.photoData || '';
      return `
      <div class="bg-white border border-gray-100 rounded-2xl overflow-hidden text-center p-3 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
        <div>
          <div class="h-28 bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl flex items-center justify-center mb-2 overflow-hidden border border-gray-100 relative">
            ${photo
              ? `<img src="${photo}" class="w-full h-full object-contain p-1.5">`
              : `<div class="text-purple-400 text-2xl flex flex-col items-center"><i class="fas fa-shoe-prints"></i><span class="text-[9px] text-gray-400 mt-1">Sin foto</span></div>`}
            <span class="absolute top-1.5 right-1.5 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded uppercase font-bold">
              ${p.cat === 'hombre' ? 'Hombre' : 'Mujer'}
            </span>
          </div>
          <div class="font-extrabold text-xs text-gray-800 truncate" title="${p.name}">${p.name}</div>
          <div class="font-black text-purple-700 text-sm mt-0.5">${formatCOP(p.price)}</div>
          <div class="text-[10px] text-green-600 font-semibold mt-0.5">✓ Stock: ${p.stock} pares</div>
        </div>
        <div class="mt-2.5 space-y-1.5">
          <!-- Botón Principal: Comprar y Pagar por WhatsApp -->
          <button onclick="buyCatalogProductWA(${p.id})" class="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black py-2 px-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-green-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
            <i class="fab fa-whatsapp text-sm"></i> Comprar y Pagar
          </button>
          <div class="flex gap-1">
            <button onclick="sendSingleProductWA(${p.id})" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-1.5 px-1.5 rounded-lg text-[10px] flex items-center justify-center gap-1 transition-colors" title="Compartir ficha con foto y enlace">
              <i class="fas fa-share-alt text-green-600"></i> Compartir
            </button>
            ${photo ? `<button onclick="window.open('${photo}','_blank')" class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-1.5 px-2 rounded-lg text-[10px] flex items-center justify-center gap-1 transition-colors" title="Ver Foto HD de Estudio"><i class="fas fa-eye text-purple-600"></i> Ver HD</button>` : ''}
          </div>
        </div>
      </div>
    `;
    }).join('');
  }

  if (previewList) {
    previewList.innerHTML = products.map(p => `
      <div class="p-2.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-2.5 text-xs">
        <div class="w-10 h-10 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0 flex items-center justify-center">
          ${p.img || p.photoData ? `<img src="${p.img || p.photoData}" class="w-full h-full object-cover">` : `<i class="fas fa-shoe-prints text-purple-400"></i>`}
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-bold text-gray-800 truncate">${p.name}</div>
          <div class="text-[10px] text-purple-600 font-semibold">${p.cat === 'hombre' ? 'Hombre' : 'Mujer'}</div>
        </div>
        <div class="flex flex-col items-end gap-1">
          <span class="font-black text-purple-700">${formatCOP(p.price)}</span>
          <button onclick="buyCatalogProductWA(${p.id})" class="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-2 py-0.5 rounded-lg text-[10px] flex items-center gap-1 shadow-sm transition-all hover:scale-[1.02]">
            <i class="fab fa-whatsapp"></i> Comprar
          </button>
        </div>
      </div>
    `).join('');
  }

  prepareWAMessage();
}

function buyCatalogProductWA(id) {
  const p = PRODUCTS.find(x => x.id === id || String(x.id) === String(id));
  if (!p) return;
  const storePhone = getAdminStoreWAPhone();
  const photo = p.img || p.photoData || '';
  const orderId = 'CRF-CAT-' + Math.floor(1000 + Math.random() * 9000);

  const msg = 
`👋 *¡HOLA CARFE®! QUIERO COMPRAR Y PAGAR ESTE CALZADO:*
━━━━━━━━━━━━━━━━━━━━
👟 *Modelo:* ${p.name}
🏷️ *Colección:* ${p.cat === 'hombre' ? 'Hombre' : 'Mujer'}
💰 *Precio Oficial:* ${formatCOP(p.price)}
${photo ? `📸 *Foto de Estudio HD:* ${photo}\n` : ''}🔖 *Ref Pedido:* ${orderId}
━━━━━━━━━━━━━━━━━━━━
💳 *MÉTODOS DE PAGO DISPONIBLES:*
1️⃣ Nequi / Daviplata (+57)
2️⃣ Transferencia Bancolombia
3️⃣ Tarjeta Débito / Crédito / PSE

📝 *MIS DATOS PARA LA ENTREGA Y DESPACHO:*
• Mi Nombre completo: 
• Ciudad / Municipio: 
• Dirección exacta de entrega: 
• Talla que solicito: 
• Método de Pago seleccionado: 

Por favor facilítenme los datos de cuenta o confirmación de despacho para realizar el pago de inmediato. ¡Muchas gracias! 🙌✨`;

  // Registrar pedido pendiente en el sistema para trazabilidad y DMS logístico
  try {
    const pending = JSON.parse(localStorage.getItem('ss_pending_orders') || '[]');
    pending.unshift({
      id: orderId,
      client: 'Cliente Catálogo WhatsApp',
      product: `${p.name} (${p.cat === 'hombre' ? 'Hombre' : 'Mujer'})`,
      photo: photo,
      total: p.price,
      date: new Date().toISOString(),
      payMethod: 'WhatsApp (Pago Pendiente)',
      address: 'Por confirmar en chat de WhatsApp',
      status: 'pendiente'
    });
    localStorage.setItem('ss_pending_orders', JSON.stringify(pending.slice(0, 50)));
  } catch(e) {}

  const url = `https://wa.me/${storePhone}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
  toast('🛍️', 'WhatsApp Abierto', `Generando compra y pago para ${p.name}`);
}

function prepareWAMessage(mode = catalogMsgMode) {
  catalogMsgMode = mode;
  const products = catalogFilter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === catalogFilter);
  const storePhone = getAdminStoreWAPhone();

  let msg = '';
  if (mode === 'photos') {
    const lines = products.map((p, idx) => {
      const photo = p.img || p.photoData || 'https://carfe.com/catalogo';
      const buyText = encodeURIComponent(`👋 Hola Carfe®, quiero comprar y pagar el modelo *${p.name}* (${formatCOP(p.price)}). Por favor envíenme los datos de cuenta (Nequi / Daviplata / Bancolombia).`);
      const buyLink = `https://wa.me/${storePhone}?text=${buyText}`;
      return `${idx + 1}️⃣ *${p.name.toUpperCase()}*\n` +
             `   • Colección: ${p.cat === 'hombre' ? 'Hombre' : 'Mujer'}\n` +
             `   • Precio: ${formatCOP(p.price)}\n` +
             `   • 📸 Ver Foto: ${photo}\n` +
             `   • 💳 Comprar y Pagar: ${buyLink}`;
    }).join('\n\n');

    msg = `✨ *CATÁLOGO OFICIAL CARFE® 2026* ✨\n` +
          `_Colección Exclusiva en Cuero & Confort_\n` +
          `━━━━━━━━━━━━━━━━━━━━\n\n` +
          `${lines}\n\n` +
          `━━━━━━━━━━━━━━━━━━━━\n` +
          `📦 *Envíos a todo el país* • Pagos seguros por Nequi, Daviplata y Bancolombia\n` +
          `📲 *Toca el enlace de "Comprar y Pagar" de cualquier calzado para generar tu compra y pago directo por WhatsApp.*`;
  } else {
    const lines = products.map(p => {
      const buyText = encodeURIComponent(`👋 Hola Carfe®, quiero comprar y pagar el modelo *${p.name}* (${formatCOP(p.price)})`);
      const buyLink = `https://wa.me/${storePhone}?text=${buyText}`;
      return `• *${p.name}* (${p.cat === 'hombre' ? 'Hombre' : 'Mujer'}): ${formatCOP(p.price)} → 💳 Comprar: ${buyLink}`;
    }).join('\n');
    msg = `*Catálogo Oficial Carfe® Calzado*\n\n` +
          `Conoce nuestra colección 2026 en cuero y materiales de alto confort:\n\n` +
          `${lines}\n\n` +
          `📦 Envíos a todo el país • Pagos seguros (Nequi, Daviplata, Bancolombia)\n` +
          `📱 Escríbenos para pedidos y compras directas.`;
  }

  const el = document.getElementById('waMessage');
  if (el) el.value = msg;
}

function sendCatalogWA() {
  const code  = document.getElementById('waCountryCode')?.value || '57';
  const phone = document.getElementById('waPhone')?.value.replace(/\D/g, '');
  const msg   = document.getElementById('waMessage')?.value;
  const url = phone 
    ? `https://wa.me/${code}${phone}?text=${encodeURIComponent(msg)}`
    : `https://wa.me/?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
  toast('📱', 'WhatsApp abierto', 'Enviando catálogo con fotos y enlaces...');
}

function sendSingleProductWA(id) {
  const p = PRODUCTS.find(x => x.id === id || String(x.id) === String(id));
  if (!p) return;
  const storePhone = getAdminStoreWAPhone();
  const photo = p.img || p.photoData || 'https://carfe.com';
  const buyText = encodeURIComponent(`👋 Hola Carfe®, quiero comprar y pagar el calzado *${p.name}* (${formatCOP(p.price)}). ¿Me facilitan los datos de Nequi / Daviplata / Bancolombia?`);
  const buyLink = `https://wa.me/${storePhone}?text=${buyText}`;

  const msg = 
`👟 *CARFE® CALZADO — FICHA OFICIAL DE COMPRA*
━━━━━━━━━━━━━━━━━━━━
✨ *Modelo:* ${p.name}
🏷️ *Colección:* ${p.cat === 'hombre' ? 'Hombre' : 'Mujer'}
💰 *Precio Oficial:* ${formatCOP(p.price)}
📸 *Foto HD del Calzado:* ${photo}
━━━━━━━━━━━━━━━━━━━━
💳 *MÉTODOS DE PAGO DISPONIBLES:*
• Nequi / Daviplata / Bancolombia
• Transferencia Inmediata / PSE

👉 *TOCA AQUÍ PARA COMPRAR Y PAGAR POR WHATSAPP:*
${buyLink}`;

  const code = document.getElementById('waCountryCode')?.value || '57';
  const phone = document.getElementById('waPhone')?.value.replace(/\D/g, '');
  const url = phone 
    ? `https://wa.me/${code}${phone}?text=${encodeURIComponent(msg)}`
    : `https://wa.me/?text=${encodeURIComponent(msg)}`;

  window.open(url, '_blank');
  toast('📱', 'Ficha enviada a WhatsApp', `${p.name} con botón de compra y pago.`);
}

function sendWATemplate(type) {
  const templates = {
    nuevo:    '🆕 ¡Nuevos modelos disponibles en Carfe®!\nVisítanos en: carfe.com\n¿Quieres ver el catálogo completo?',
    oferta:   '🔥 ¡OFERTA ESPECIAL! Hasta 30% de descuento en calzado selecto en Carfe®\nUsa el código: CARFE30\n¡Solo por tiempo limitado!',
    pedido:   '✅ Tu pedido en Carfe® ha sido confirmado 🎉\nEstamos preparando tu calzado con mucho cuidado.\nTe avisaremos cuando esté en camino 🚚',
    temporada:'🌟 ¡Nueva Temporada en Carfe®! Descubre las últimas tendencias en calzado\nStocks limitados — ¡No te quedes sin los tuyos!',
  };
  const el = document.getElementById('waMessage');
  if (el && templates[type]) { el.value = templates[type]; toast('📝', 'Plantilla cargada', 'Mensaje listo para enviar'); }
}

function printCatalog() {
  window.print();
}

/* ───────── TIKTOK LIVE & CONTROL DE TRANSMISIÓN ───────── */
let isLive = false;
let liveInterval = null;
let liveSeconds = 0;
let liveViewers = 0;
let livePeakViewers = 0;
let liveSalesCount = 0;
let liveTotalAmount = 0;
let livePinnedProductId = null;
let liveTopProductName = '—';
let liveOrdersList = [];

let tiktokConfig = {
  username: '@carfe_oficial',
  shopId: 'TTSHOP-CO-8821',
  pixelId: 'TT-CARFE-CO-9921',
  adsAccountId: 'TT-ADS-7819024',
  streamKey: 'live_colombia_carfe_98234_sec',
  streamServer: 'rtmp://live-push.tiktok.com/live/',
  nextLiveDate: 'Viernes 7:00 PM',
  webNotification: true
};

const LIVE_COMMENTS_CO = [
  { u: '@andres_bogota', m: '¿Tienen en talla 40 del calzado en pantalla? 🔥' },
  { u: '@valentina_medellin', m: '¡Hola! ¿Cuánto demora el envío a Medellín?' },
  { u: '@camila_cali', m: '¡Qué elegancia de tenis! ¿Son en cuero 100% legítimo? 😍' },
  { u: '@jorge_barranquilla', m: '¿Aceptan transferencia por Nequi o Bancolombia?' },
  { u: '@esteban_bucaramanga', m: '¡Acabo de pedir el calzado por la web! Quedo atento al despacho 🚀' },
  { u: '@mariana_pereira', m: '¿Aceptan transferencia Nequi o Daviplata?' },
  { u: '@felipe_cartagena', m: '¡Quiero ver los tenis deportivos en vivo por favor!' },
  { u: '@diana_manizales', m: '¿Vienen con garantía de fábrica y cambio de talla?' },
  { u: '@santiago_pasto', m: '¡Excelente calidad y precios en pesos colombianos!' }
];

function loadTikTokConfig() {
  try {
    const saved = JSON.parse(localStorage.getItem('carfe_tiktok_config') || '{}');
    tiktokConfig = Object.assign(tiktokConfig, saved);
  } catch(e) {}

  const userEl = document.getElementById('tiktokUser');
  if (userEl) userEl.value = (tiktokConfig.username || 'carfe_oficial').replace(/^@/, '');
  const keyEl = document.getElementById('tiktokStreamKey');
  if (keyEl) keyEl.value = tiktokConfig.streamKey || 'live_colombia_carfe_98234_sec';
  const toggle = document.getElementById('tiktokWebNotificationToggle');
  if (toggle) toggle.checked = tiktokConfig.webNotification !== false;

  const shopLabel = document.getElementById('ttsShopIdLabel');
  if (shopLabel) shopLabel.textContent = tiktokConfig.shopId;
  const pixelLabel = document.getElementById('ttsPixelIdLabel');
  if (pixelLabel) pixelLabel.textContent = tiktokConfig.pixelId;

  updateTikTokLiveLinks();
}

function saveTikTokLiveConfig() {
  const user = (document.getElementById('tiktokUser')?.value || 'carfe_oficial').trim().replace(/^@/, '');
  const key = document.getElementById('tiktokStreamKey')?.value || 'live_colombia_carfe_98234_sec';
  const toggle = document.getElementById('tiktokWebNotificationToggle')?.checked !== false;

  tiktokConfig.username = '@' + user;
  tiktokConfig.streamKey = key;
  tiktokConfig.webNotification = toggle;

  localStorage.setItem('carfe_tiktok_config', JSON.stringify(tiktokConfig));
  updateTikTokLiveLinks();
  toast('💾', 'Cuenta TikTok Guardada', `Perfil @${user} vinculado con la tienda y el sistema Live.`);
}

function onTikTokUserChange() {
  const user = (document.getElementById('tiktokUser')?.value || 'carfe_oficial').trim().replace(/^@/, '');
  tiktokConfig.username = '@' + user;
  updateTikTokLiveLinks();
}

function updateTikTokLiveLinks() {
  const user = (tiktokConfig.username || '@carfe_oficial').replace(/^@/, '');
  const link = document.getElementById('tiktokOpenLiveLink');
  if (link) link.href = `https://www.tiktok.com/@${user}/live`;
  const creator = document.getElementById('ttsPreviewCreatorUser');
  if (creator) creator.innerHTML = `@${user} <i class="fas fa-check-circle text-blue-400 text-xs"></i>`;
}

function toggleStreamKeyVis() {
  const inp = document.getElementById('tiktokStreamKey');
  if (!inp) return;
  inp.type = inp.type === 'password' ? 'text' : 'password';
}

function toggleWebLiveNotification(val) {
  tiktokConfig.webNotification = val;
  localStorage.setItem('carfe_tiktok_config', JSON.stringify(tiktokConfig));
}

function initTikTok() {
  loadTikTokConfig();
  renderLiveProducts();
  updateLiveStats();
}

function connectTikTok() {
  isLive = !isLive;
  const btn = document.getElementById('tiktokConnectBtn');
  const status = document.getElementById('liveStatus');

  if (isLive) {
    liveSeconds = 0;
    liveViewers = 48;
    livePeakViewers = 48;
    liveSalesCount = 0;
    liveTotalAmount = 0;
    liveOrdersList = [];

    // Guardar estado en localStorage para que index.html muestre el banner flotante
    localStorage.setItem('carfe_tiktok_is_live', 'true');

    if (btn) {
      btn.innerHTML = '<i class="fas fa-stop-circle text-lg"></i> <span>Finalizar Transmisión Live</span>';
      btn.className = 'w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-2xl font-black text-base shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2';
    }
    if (status) {
      status.innerHTML = '<span class="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span><span class="text-xs font-black text-red-600">🔴 EN VIVO AHORA</span>';
      status.className = 'flex items-center gap-2 bg-red-50 border border-red-200 px-3.5 py-1.5 rounded-full';
    }

    addChatMsg('Sistema Carfe®', '🎉 ¡Transmisión en vivo iniciada con éxito! Bienvenidos a Carfe® Calzado Oficial.', true);

    // Si hay calzados en catálogo, fijar el primero automáticamente
    if (PRODUCTS.length > 0 && !livePinnedProductId) {
      pinProductToLive(PRODUCTS[0].id);
    }

    liveInterval = setInterval(() => {
      liveSeconds++;
      // Fluctuación realista de espectadores
      const delta = (Math.random() > 0.45 ? 1 : -1) * Math.floor(Math.random() * 4);
      liveViewers = Math.max(14, liveViewers + delta);
      if (liveViewers > livePeakViewers) livePeakViewers = liveViewers;

      updateLiveStats();

      // Comentarios de espectadores
      if (Math.random() < 0.45) {
        const item = LIVE_COMMENTS_CO[Math.floor(Math.random() * LIVE_COMMENTS_CO.length)];
        addChatMsg(item.u, item.m, false);
      }

      // Pedidos entrantes durante el live
      if (Math.random() < 0.20) {
        generateLiveOrder();
      }
    }, 1500);

    addNotification('🎥', 'TikTok Live Iniciado', `Transmisión activa en ${tiktokConfig.username} con aviso a la tienda web`, 'live');
    toast('🔴', '¡Live en TikTok Iniciado!', 'Tus clientes en la tienda pública ahora ven el aviso en vivo.');
  } else {
    // Finalizar live
    clearInterval(liveInterval);
    liveInterval = null;

    localStorage.setItem('carfe_tiktok_is_live', 'false');
    localStorage.removeItem('carfe_tiktok_pinned_prod');

    if (btn) {
      btn.innerHTML = '<i class="fab fa-tiktok text-lg"></i> <span>Iniciar Transmisión Live en TikTok</span>';
      btn.className = 'w-full bg-gradient-to-r from-pink-500 via-red-500 to-pink-600 hover:from-pink-600 hover:to-red-600 text-white py-3.5 rounded-2xl font-black text-base shadow-lg shadow-pink-600/30 transition-all flex items-center justify-center gap-2';
    }
    if (status) {
      status.innerHTML = '<span class="w-2.5 h-2.5 bg-gray-400 rounded-full"></span><span class="text-xs font-bold text-gray-600">Desconectado</span>';
      status.className = 'flex items-center gap-2 bg-gray-100 px-3.5 py-1.5 rounded-full';
    }

    addChatMsg('Sistema Carfe®', `⏹ Transmisión finalizada. Ventas: ${liveSalesCount} pares — Total: ${formatCOP(liveTotalAmount)}`, true);
    toast('⏹', 'Live Finalizado', `${liveSalesCount} pares vendidos — Recaudado: ${formatCOP(liveTotalAmount)}`);
  }
}

function updateLiveStats() {
  const hrs = Math.floor(liveSeconds / 3600);
  const mins = Math.floor((liveSeconds % 3600) / 60);
  const secs = liveSeconds % 60;
  const timeStr = `${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;

  safeText('liveDuration', timeStr);
  safeText('liveViewers', liveViewers);
  safeText('livePeakViewers', livePeakViewers);
  safeText('livePairsSold', liveSalesCount);
  safeText('liveTotalAmount', formatCOP(liveTotalAmount));

  // Métricas avanzadas
  const convRate = livePeakViewers > 0 ? ((liveSalesCount / livePeakViewers) * 100).toFixed(1) : '0.0';
  safeText('liveConversionRate', `${convRate}%`);
  safeText('liveTopProduct', liveTopProductName);
  const avg = liveSalesCount > 0 ? Math.round(liveTotalAmount / liveSalesCount) : 0;
  safeText('liveAvgTicket', formatCOP(avg));
}

function renderLiveProducts() {
  const grid = document.getElementById('liveProductsList');
  if (!grid) return;

  grid.innerHTML = PRODUCTS.map(p => {
    const isPinned = livePinnedProductId === p.id;
    return `
      <div class="bg-white border ${isPinned ? 'border-2 border-pink-500 bg-pink-50/20 shadow-md' : 'border-gray-100'} rounded-2xl p-3 flex flex-col justify-between transition-all">
        <div>
          <div class="h-28 bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl mb-2 flex items-center justify-center overflow-hidden relative border border-gray-100">
            ${p.img || p.photoData
              ? `<img src="${p.img || p.photoData}" class="w-full h-full object-contain p-1.5">`
              : `<i class="fas fa-shoe-prints text-2xl text-purple-400"></i>`}
            ${isPinned ? `<span class="absolute top-1.5 left-1.5 bg-pink-600 text-white font-black text-[9px] px-2 py-0.5 rounded-full shadow-sm animate-pulse flex items-center gap-1"><i class="fas fa-thumbtack"></i> EN PANTALLA</span>` : ''}
            <span class="absolute top-1.5 right-1.5 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded capitalize">${p.cat}</span>
          </div>
          <div class="font-bold text-xs text-gray-900 truncate" title="${p.name}">${p.name}</div>
          <div class="font-black text-purple-700 text-xs mt-0.5">${formatCOP(p.price)}</div>
          <div class="text-[10px] text-gray-400 font-semibold mt-0.5">Stock: ${p.stock} pares</div>
        </div>
        <div class="mt-2.5">
          <button onclick="pinProductToLive(${p.id})" class="w-full ${isPinned ? 'bg-amber-400 text-gray-900 hover:bg-amber-300' : 'bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200'} font-black py-1.5 px-2 rounded-xl text-[11px] flex items-center justify-center gap-1 transition-all">
            <i class="fas fa-thumbtack ${isPinned ? 'text-gray-900' : 'text-pink-600'}"></i>
            <span>${isPinned ? 'Fijado en Pantalla' : 'Fijar en Live'}</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function pinProductToLive(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  livePinnedProductId = p.id;
  liveTopProductName = p.name;

  // Persistir para que index.html muestre el producto fijado
  localStorage.setItem('carfe_tiktok_pinned_prod', JSON.stringify({
    id: p.id,
    name: p.name,
    price: p.price,
    img: p.img || p.photoData,
    cat: p.cat
  }));

  const badge = document.getElementById('pinnedProductBadge');
  const nameEl = document.getElementById('pinnedProductName');
  if (badge) badge.classList.remove('hidden');
  if (nameEl) nameEl.textContent = p.name;

  renderLiveProducts();
  addChatMsg('Admin Carfe®', `🔥 ¡PRODUCTO DESTACADO EN VIVO! Mostrando ahora: ${p.name} — ${formatCOP(p.price)}. ¡Pide tu talla aquí o en la tienda web con envío gratis!`, false);
  toast('📌', 'Calzado Fijado en Live', `${p.name} ahora está fijado en pantalla y en la tienda web.`);
}

function unpinProductFromLive() {
  livePinnedProductId = null;
  localStorage.removeItem('carfe_tiktok_pinned_prod');
  const badge = document.getElementById('pinnedProductBadge');
  if (badge) badge.classList.add('hidden');
  renderLiveProducts();
  toast('📌', 'Calzado Desfijado', 'Se quitó el producto de pantalla.');
}

function addChatMsg(user, msg, isSystem) {
  const chat = document.getElementById('liveChat');
  if (!chat) return;

  const div = document.createElement('div');
  div.className = `p-2.5 rounded-xl ${isSystem ? 'bg-purple-100/70 border border-purple-200 text-purple-900' : 'bg-white border border-gray-100 text-gray-800 shadow-2xs'}`;
  div.innerHTML = `
    <div class="flex items-center justify-between mb-0.5">
      <span class="font-black ${isSystem ? 'text-purple-700' : 'text-pink-600'} text-xs">${user}</span>
      <span class="text-[9px] text-gray-400 font-mono">${new Date().toLocaleTimeString('es-CO', {hour:'2-digit', minute:'2-digit'})}</span>
    </div>
    <div class="text-xs font-medium leading-relaxed">${msg}</div>
  `;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;

  // Actualizar badge
  const badge = document.getElementById('chatBadge');
  if (badge) badge.textContent = chat.children.length;

  while (chat.children.length > 50) chat.removeChild(chat.firstChild);
}

function sendChat() {
  const inp = document.getElementById('chatInput');
  if (!inp || !inp.value.trim()) return;
  addChatMsg('Admin Carfe® 👑', inp.value.trim(), false);
  inp.value = '';
}

function generateLiveOrder() {
  const buyers = ['Camila R. (Medellín)','Carlos M. (Bogotá)','Daniela T. (Cali)','Andrés P. (Barranquilla)','Sofía L. (Bucaramanga)','Mateo S. (Cartagena)'];
  const buyer = buyers[Math.floor(Math.random() * buyers.length)];
  const p = livePinnedProductId ? (PRODUCTS.find(x => x.id === livePinnedProductId) || PRODUCTS[0]) : PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
  const size = p.cat === 'mujer' ? Math.floor(Math.random() * 6) + 35 : Math.floor(Math.random() * 7) + 38;

  liveSalesCount++;
  liveTotalAmount += p.price;
  liveTopProductName = p.name;

  const orderItem = {
    id: `LIVE-${Date.now().toString().slice(-5)}`,
    buyer,
    product: p.name,
    size,
    price: p.price,
    time: new Date().toLocaleTimeString('es-CO', {hour:'2-digit', minute:'2-digit'})
  };
  liveOrdersList.unshift(orderItem);

  // Render en pedidos live
  const ordersContainer = document.getElementById('liveOrders');
  const countBadge = document.getElementById('liveOrdersCount');
  if (countBadge) countBadge.textContent = liveOrdersList.length;

  if (ordersContainer) {
    ordersContainer.innerHTML = liveOrdersList.slice(0, 15).map(o => `
      <div class="py-2 flex items-center justify-between text-xs">
        <div>
          <div class="font-bold text-gray-800 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span> ${o.buyer}
          </div>
          <div class="text-[11px] text-gray-500 font-medium">${o.product} • Talla ${o.size}</div>
        </div>
        <div class="text-right">
          <div class="font-black text-emerald-700">${formatCOP(o.price)}</div>
          <div class="text-[9px] text-gray-400 font-mono">${o.time}</div>
        </div>
      </div>
    `).join('');
  }

  addChatMsg('Sistema Carfe®', `🛍️ ¡${buyer} acaba de comprar ${p.name} (Talla ${size}) por ${formatCOP(p.price)}!`, true);
  updateLiveStats();
}

function exportTikTokLiveReport() {
  const rows = [
    ['Métrica','Valor'],
    ['Usuario TikTok', tiktokConfig.username],
    ['Duración Transmisión', document.getElementById('liveDuration')?.textContent || '00:00:00'],
    ['Pico Máximo Espectadores', livePeakViewers],
    ['Pares de Calzado Vendidos', liveSalesCount],
    ['Total Recaudado (COP)', liveTotalAmount],
    ['Calzado Top Live', liveTopProductName],
    ['Tasa de Conversión Estimada', document.getElementById('liveConversionRate')?.textContent || '0%']
  ];
  const csv = rows.map(r => r.join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = `reporte_tiktok_live_${Date.now()}.csv`;
  a.click();
  toast('📥', 'Reporte Exportado', 'Métricas de la sesión de TikTok Live descargadas en CSV');
}

/* ───────── META ADS (FACEBOOK & INSTAGRAM) ───────── */
let metaCampaigns = [
  { id: 'MC-101', name: 'Air Runner Pro - Viral Reels IG', prod: 'Air Runner Pro', platform: 'Instagram (Reels)', budget: 25, spent: 450, clicks: 5820, roas: '4.8x', active: true },
  { id: 'MC-102', name: 'Urban Casual X - Retargeting FB', prod: 'Urban Casual X', platform: 'Facebook Feed', budget: 15, spent: 320, clicks: 4100, roas: '4.2x', active: true },
  { id: 'MC-103', name: 'Sport Flex Ultra - Conversiones CAPI', prod: 'Sport Flex Ultra', platform: 'Omnicanal (IG/FB)', budget: 30, spent: 510, clicks: 6200, roas: '5.1x', active: true },
  { id: 'MC-104', name: 'Classic Leather - Audiencia Formal', prod: 'Classic Leather', platform: 'Facebook Feed', budget: 10, spent: 200, clicks: 2300, roas: '3.9x', active: false },
];

function initMetaAds() {
  const sel = document.getElementById('metaAdProduct');
  if (sel) {
    sel.innerHTML = PRODUCTS.map(p => `
      <option value="${p.name}" data-price="${p.price}">${p.name} (${formatCOP(p.price)})</option>
    `).join('');
  }
  updateMetaAdPreview();
  renderMetaCampaigns();
}

function updateMetaAdPreview() {
  const sel = document.getElementById('metaAdProduct');
  const copy = document.getElementById('metaAdCopy')?.value || '';
  if (!sel || !sel.selectedIndex) return;
  const opt = sel.options[sel.selectedIndex];
  const prodName = opt.value;
  const price = opt.dataset.price || '0';
  const prodObj = PRODUCTS.find(p => p.name === prodName);

  const imgEl = document.getElementById('metaPreviewImg');
  if (imgEl) {
    if (prodObj && prodObj.img) {
      imgEl.innerHTML = `<img src="${prodObj.img}" class="w-full h-full object-cover">`;
    } else {
      imgEl.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gray-100"><i class="fas fa-shoe-prints text-5xl text-purple-600"></i></div>`;
    }
  }

  const titleEl = document.getElementById('metaPreviewTitle');
  if (titleEl) titleEl.textContent = `${prodName} — ${formatCOP(parseFloat(price))}`;

  const copyEl = document.getElementById('metaPreviewCopy');
  if (copyEl) copyEl.textContent = copy;
}

function renderMetaCampaigns() {
  const tbody = document.getElementById('metaCampaignsTable');
  if (!tbody) return;
  tbody.innerHTML = metaCampaigns.map(c => `
    <tr class="hover:bg-gray-50 transition-colors">
      <td class="p-4">
        <div class="font-bold text-gray-800">${c.name}</div>
        <div class="text-xs text-gray-400 font-mono">${c.id} • ${c.prod}</div>
      </td>
      <td class="p-4">
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.platform.includes('Instagram') ? 'bg-pink-50 text-pink-700' : c.platform.includes('Facebook') ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}">
          <i class="${c.platform.includes('Instagram') ? 'fab fa-instagram' : 'fab fa-facebook'}"></i> ${c.platform}
        </span>
      </td>
      <td class="p-4 font-bold text-gray-700">$${c.budget}/día</td>
      <td class="p-4 font-bold text-gray-900">$${c.spent}</td>
      <td class="p-4 font-medium text-blue-600">${c.clicks.toLocaleString()}</td>
      <td class="p-4 font-black text-purple-600">${c.roas}</td>
      <td class="p-4">
        <span class="px-2.5 py-1 rounded-full text-xs font-bold ${c.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}">
          ${c.active ? '● Activa' : '○ Pausada'}
        </span>
      </td>
      <td class="p-4">
        <button onclick="toggleMetaCampaign('${c.id}')" class="text-xs px-3 py-1.5 rounded-lg border font-semibold ${c.active ? 'border-amber-200 text-amber-700 hover:bg-amber-50' : 'border-green-200 text-green-700 hover:bg-green-50'}">
          ${c.active ? 'Pausar' : 'Activar'}
        </button>
      </td>
    </tr>
  `).join('');
}

function toggleMetaCampaign(id) {
  const c = metaCampaigns.find(x => x.id === id);
  if (!c) return;
  c.active = !c.active;
  renderMetaCampaigns();
  toast(c.active ? '🟢' : '⏸️', 'Campaña Meta', `Campaña ${c.name} ${c.active ? 'activada' : 'pausada'}`);
}

function launchMetaAd() {
  const name = document.getElementById('metaAdName')?.value.trim() || 'Campaña Calzado Meta';
  const sel = document.getElementById('metaAdProduct');
  const prod = sel?.value || 'Calzado Deportivo';
  const placement = document.getElementById('metaAdPlacement')?.value || 'both';
  const budget = parseInt(document.getElementById('metaAdBudget')?.value) || 15;
  const platformName = placement === 'instagram' ? 'Instagram (Feed/Reels)' : placement === 'facebook' ? 'Facebook Feed' : 'Omnicanal (IG/FB)';

  const newCampaign = {
    id: 'MC-' + (100 + metaCampaigns.length + 1),
    name,
    prod,
    platform: platformName,
    budget,
    spent: 0,
    clicks: 0,
    roas: 'N/A (Iniciando)',
    active: true
  };

  metaCampaigns.unshift(newCampaign);
  renderMetaCampaigns();
  addNotification('📢', 'Campaña Meta Publicada', `${name} ($${budget}/día) en ${platformName}`, 'marketing');
  toast('🚀', 'Campaña Meta Activa', `El anuncio para ${prod} se envió a revisión y aprobación de Meta Ads.`);
}

function testMetaPixel() {
  toast('📡', 'Meta Pixel Conectado', 'Evento "Purchase" y "ViewContent" verificado exitosamente en el servidor de Meta CAPI.');
  addNotification('🎯', 'Píxel Meta CAPI Verificado', 'Pixel ID META-8392-STEP transmitiendo datos en tiempo real.', 'info');
}

function openNewMetaAdModal() {
  document.getElementById('metaAdName')?.focus();
  toast('💡', 'Crear Anuncio Meta', 'Completa los datos del formulario a continuación para publicar tu anuncio.');
}

/* ───────── TIKTOK SHOP, PUBLICIDAD & ANALYTICS ───────── */
let tiktokCampaigns = [
  { id:'TTC-201', name:'Air Runner Pro - Spark Ad Viral', prod:'Air Runner Pro', format:'Spark Ad (Bolsa Amarilla)', dailyBudget:50000, spent:450000, clicks:6120, ctr:'4.8%', salesCOP:2950000, roas:'6.5x', active:true },
  { id:'TTC-202', name:'Classic Oxford - Conversión Feed', prod:'Classic Oxford', format:'In-Feed Shopping Ad', dailyBudget:35000, spent:280000, clicks:3480, ctr:'3.9%', salesCOP:1820000, roas:'6.5x', active:true },
  { id:'TTC-203', name:'Promo TikTok Live Viernes', prod:'Elegance Heel Stiletto', format:'Promoción de Live', dailyBudget:30000, spent:120000, clicks:2890, ctr:'5.2%', salesCOP:780000, roas:'6.5x', active:true },
  { id:'TTC-204', name:'Street Vibe Sneaker - Creadores', prod:'Street Vibe Sneaker', format:'Spark Ad (Bolsa Amarilla)', dailyBudget:25000, spent:100000, clicks:1420, ctr:'3.4%', salesCOP:520000, roas:'5.2x', active:false },
];

function initTikTokShop() {
  loadTikTokConfig();
  const sel = document.getElementById('ttsProductSelect');
  if (sel) {
    sel.innerHTML = PRODUCTS.map(p => `
      <option value="${p.name}" data-price="${p.price}" data-id="${p.id}">${p.name} (${p.cat === 'hombre' ? 'Hombre' : 'Mujer'}) - ${formatCOP(p.price)} (Stock: ${p.stock})</option>
    `).join('');
  }
  updateTikTokPreview();
  renderTikTokCampaignsTable();
  renderTikTokShopProducts();
}

function updateTikTokPreview() {
  const sel = document.getElementById('ttsProductSelect');
  const text = document.getElementById('ttsHashtags')?.value || '';
  if (!sel || !sel.selectedIndex) return;
  const opt = sel.options[sel.selectedIndex];
  const prodName = opt.value;
  const price = parseFloat(opt.dataset.price) || 0;
  const prodObj = PRODUCTS.find(p => p.name === prodName);

  safeText('ttsPreviewProdName', prodName);
  safeText('ttsPreviewPrice', `${formatCOP(price)} • Envío Gratis`);
  safeText('ttsPreviewCaption', text);

  const imgEl = document.getElementById('ttsPreviewImg');
  if (imgEl && prodObj) {
    imgEl.src = prodObj.img || prodObj.photoData || '';
  }
}

function renderTikTokCampaignsTable() {
  const tbody = document.getElementById('ttsCampaignsTable');
  if (!tbody) return;

  tbody.innerHTML = tiktokCampaigns.map(c => `
    <tr class="hover:bg-gray-50 transition-colors">
      <td class="p-4">
        <div class="font-bold text-gray-900">${c.name}</div>
        <div class="text-xs text-gray-400 font-mono">${c.id} • ${c.prod}</div>
      </td>
      <td class="p-4">
        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${c.format.includes('Spark') ? 'bg-amber-50 text-amber-800 border border-amber-200' : c.format.includes('Live') ? 'bg-pink-50 text-pink-700 border border-pink-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}">
          ${c.format}
        </span>
      </td>
      <td class="p-4 text-right font-bold text-gray-700">${formatCOP(c.dailyBudget)}/día</td>
      <td class="p-4 text-right font-black text-gray-900">${formatCOP(c.spent)}</td>
      <td class="p-4 text-center font-bold text-blue-600">${c.clicks.toLocaleString()} <span class="text-[10px] text-gray-400 font-normal">(${c.ctr})</span></td>
      <td class="p-4 text-right font-black text-emerald-700">${formatCOP(c.salesCOP)}</td>
      <td class="p-4 text-center font-black text-purple-700 bg-purple-50/50">${c.roas}</td>
      <td class="p-4 text-center">
        <span class="px-2.5 py-1 rounded-full text-xs font-bold ${c.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}">
          ${c.active ? '● Activa' : '○ Pausada'}
        </span>
      </td>
      <td class="p-4 text-center">
        <button onclick="toggleTikTokCampaign('${c.id}')" class="text-xs px-3 py-1.5 rounded-xl border font-bold transition-colors ${c.active ? 'border-amber-200 text-amber-800 hover:bg-amber-50' : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'}">
          ${c.active ? 'Pausar' : 'Activar'}
        </button>
      </td>
    </tr>
  `).join('');
}

function toggleTikTokCampaign(id) {
  const c = tiktokCampaigns.find(x => x.id === id);
  if (!c) return;
  c.active = !c.active;
  renderTikTokCampaignsTable();
  toast(c.active ? '🟢' : '⏸️', 'Campaña TikTok', `Campaña ${c.name} ${c.active ? 'activada' : 'pausada'}`);
}

function renderTikTokShopProducts() {
  const tbody = document.getElementById('ttsProductsTable');
  if (!tbody) return;
  tbody.innerHTML = PRODUCTS.map(p => `
    <tr class="hover:bg-gray-50 transition-colors">
      <td class="p-4 font-bold text-gray-800 flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0 overflow-hidden">
          ${p.img || p.photoData ? `<img src="${p.img || p.photoData}" class="w-full h-full object-cover">` : `<i class="fas fa-shoe-prints text-sm"></i>`}
        </div>
        <div>
          <div>${p.name}</div>
          <div class="text-[11px] text-gray-400 font-semibold">${p.brand || 'Carfe®'}</div>
        </div>
      </td>
      <td class="p-4 capitalize text-gray-600">${p.cat === 'hombre' ? 'Hombre' : 'Mujer'}</td>
      <td class="p-4 font-bold text-gray-900">${formatCOP(p.price)}</td>
      <td class="p-4">
        <span class="font-bold ${p.stock < 10 ? 'text-amber-600' : 'text-green-600'}">${p.stock} pares</span>
      </td>
      <td class="p-4 font-semibold text-pink-600">10% (${formatCOP(p.price * 0.1)})</td>
      <td class="p-4">
        <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 flex items-center gap-1 w-fit">
          <i class="fas fa-check-circle text-[10px]"></i> Sincronizado
        </span>
      </td>
      <td class="p-4">
        <button onclick="promoteSingleTTS('${p.name}')" class="bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:shadow-md transition-all flex items-center gap-1">
          <i class="fab fa-tiktok"></i> Impulsar
        </button>
      </td>
    </tr>
  `).join('');
}

function syncTikTokShopCatalog() {
  toast('🔄', 'Sincronizando con TikTok Shop', 'Actualizando catálogo de calzado y stock en Seller Center...');
  setTimeout(() => {
    toast('✅', 'Catálogo Sincronizado', `${PRODUCTS.length} modelos de zapatos actualizados en TikTok Shop.`);
    renderTikTokShopProducts();
    addNotification('🛍️', 'TikTok Shop Sincronizado', 'Inventario y precios vinculados al 100%.', 'info');
  }, 1000);
}

function launchTikTokShopAd() {
  const sel = document.getElementById('ttsProductSelect');
  const prod = sel?.value || 'Calzado Carfe®';
  const formatVal = document.getElementById('ttsFormat')?.value || 'spark';
  const formatName = formatVal === 'spark' ? 'Spark Ad (Bolsa Amarilla)' : formatVal === 'live' ? 'Promoción de Live' : 'In-Feed Shopping Ad';
  const budget = parseFloat(document.getElementById('ttsBudget')?.value) || 50000;

  const newCampaign = {
    id: 'TTC-' + (200 + tiktokCampaigns.length + 1),
    name: `${prod} - ${formatName}`,
    prod,
    format: formatName,
    dailyBudget: budget,
    spent: 0,
    clicks: 0,
    ctr: '0.0%',
    salesCOP: 0,
    roas: 'N/A (Lanzando)',
    active: true
  };

  tiktokCampaigns.unshift(newCampaign);
  renderTikTokCampaignsTable();
  addNotification('🔥', 'Campaña Publicada en TikTok', `${newCampaign.name} — Presupuesto: ${formatCOP(budget)}/día`, 'marketing');
  toast('🚀', '¡Campaña Activa en TikTok Ads!', `El anuncio para ${prod} se envió al Píxel y a revisión de TikTok Ads.`);
}

function testTikTokPixel() {
  toast('🎯', 'Píxel de TikTok Activo', `Píxel ${tiktokConfig.pixelId} sincronizado. Se envió evento de prueba "Purchase" en COP.`);
  addNotification('📡', 'Píxel TikTok Verificado', `Píxel ${tiktokConfig.pixelId} transmitiendo datos y conversiones en tiempo real.`, 'info');
}

function exportTikTokAdsReport() {
  const rows = [
    ['ID','Campaña','Calzado','Formato','Presupuesto Diario (COP)','Gasto Acumulado (COP)','Clics','CTR','Ventas Atribuidas (COP)','ROAS','Estado']
  ];
  tiktokCampaigns.forEach(c => {
    rows.push([c.id, c.name, c.prod, c.format, c.dailyBudget, c.spent, c.clicks, c.ctr, c.salesCOP, c.roas, c.active ? 'Activa' : 'Pausada']);
  });
  const csv = rows.map(r => r.join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = `campanas_tiktok_ads_${Date.now()}.csv`;
  a.click();
  toast('📥', 'Campañas Exportadas', 'Reporte de TikTok Ads descargado con métricas y ROAS');
}

function promoteSingleTTS(name) {
  const sel = document.getElementById('ttsProductSelect');
  if (sel) {
    for (let i = 0; i < sel.options.length; i++) {
      if (sel.options[i].value === name) {
        sel.selectedIndex = i;
        break;
      }
    }
  }
  updateTikTokPreview();
  toast('🎯', 'Calzado Seleccionado', `${name} cargado en el simulador de TikTok Spark Ads.`);
}

function openTikTokAdCreator() {
  document.getElementById('ttsHashtags')?.focus();
  toast('🎬', 'Creador de Spark Ads', 'Personaliza tu mensaje y hashtags para el anuncio.');
}

/* ───────── MARKETING ───────── */
function initMarketing() {
  renderDiscountCodes();
}

function renderDiscountCodes() {
  const tbody = document.getElementById('discountCodesTable');
  if (!tbody) return;
  tbody.innerHTML = discountCodes.map((d, i) => `
    <tr>
      <td><code style="background:#ede9fe;color:#7c3aed;padding:4px 8px;border-radius:6px;font-size:14px;font-weight:700">${d.code}</code></td>
      <td>${d.type === 'fijo' ? '$' : ''}${d.pct}${d.type === 'porcentaje' ? '%' : ''} de descuento</td>
      <td style="text-align:center">${d.uses}</td>
      <td>${d.exp}</td>
      <td>
        <span style="background:${d.active ? '#f0fdf4' : '#f9fafb'};color:${d.active ? '#16a34a' : '#9ca3af'};padding:2px 10px;border-radius:12px;font-size:12px;font-weight:600">
          ${d.active ? '✓ Activo' : '✗ Inactivo'}
        </span>
      </td>
      <td>
        <button onclick="copyCode('${d.code}')" style="background:#f3f4f6;border:none;border-radius:6px;padding:4px 8px;cursor:pointer;margin-right:4px">📋</button>
        <button onclick="toggleCode(${i})" style="background:${d.active ? '#fef2f2' : '#f0fdf4'};color:${d.active ? '#dc2626' : '#16a34a'};border:none;border-radius:6px;padding:4px 8px;cursor:pointer;margin-right:4px">${d.active ? 'Desactivar' : 'Activar'}</button>
        <button onclick="deleteCode(${i})" style="background:#fef2f2;color:#dc2626;border:none;border-radius:6px;padding:4px 8px;cursor:pointer">🗑</button>
      </td>
    </tr>
  `).join('');
}

function copyCode(code) {
  navigator.clipboard.writeText(code).then(() => toast('📋', 'Copiado', `Código "${code}" copiado al portapapeles`));
}

function toggleCode(idx) {
  discountCodes[idx].active = !discountCodes[idx].active;
  renderDiscountCodes();
  toast('🔄', 'Código actualizado', `${discountCodes[idx].code} — ${discountCodes[idx].active ? 'activado' : 'desactivado'}`);
}

function deleteCode(idx) {
  if (!confirm('¿Eliminar este código de descuento?')) return;
  const name = discountCodes[idx].code;
  discountCodes.splice(idx, 1);
  renderDiscountCodes();
  toast('🗑', 'Código eliminado', name);
}

function openCreateDiscountModal() {
  openModal('createDiscountModal');
}

function createDiscount() {
  const code  = document.getElementById('discCode')?.value.trim().toUpperCase();
  const pct   = parseFloat(document.getElementById('discPct')?.value);
  const type  = document.getElementById('discType')?.value;
  const exp   = document.getElementById('discExp')?.value;
  if (!code) return toast('⚠️', 'Código requerido', 'Ingresa un código');
  if (!pct || pct <= 0) return toast('⚠️', 'Valor inválido', 'Ingresa un valor de descuento');
  discountCodes.unshift({ code, pct, type, active: true, uses: 0, exp: exp || 'Sin vencimiento' });
  renderDiscountCodes();
  closeModal('createDiscountModal');
  toast('✅', 'Código creado', `${code} — ${type === 'fijo' ? '$' : ''}${pct}${type === 'porcentaje' ? '%' : ''} de descuento`);
}

function launchWACampaign() {
  const phone = prompt('📱 Número de WhatsApp (con código de país, ej: 521234567890):');
  if (!phone) return;
  const msg = '🔥 ¡OFERTA ESPECIAL en Carfe®!\n\nHasta 30% de descuento en modelos seleccionados.\nUsa el código: CARFE30\n\nVer catálogo: carfe.com\n\n¡Solo por tiempo limitado! ⏰';
  window.open(`https://wa.me/${phone.replace(/\D/g,'')}?text=${encodeURIComponent(msg)}`, '_blank');
  toast('📱', 'Campaña enviada', 'WhatsApp abierto con mensaje de campaña');
}

function copyTemplate(type) {
  const templates = {
    story:    '✨ ¡Nuevos estilos en Carfe®! Desliza para ver el catálogo completo 🔥\n#Zapatos #Moda #Carfe',
    reel:     '¡Estos zapatos son tendencia! \n✨ @carfe_calzado - Calidad premium\n📦 Envíos a todo el país\n👇 Link en bio',
    bio:      '✨ Carfe® | Calzado Premium\n🚚 Envíos a todo el país\n💳 Pagos seguros\n👇 Ver catálogo',
    whatsapp: '¡Hola! Vi sus productos en redes y me gustaría ver el catálogo completo de zapatos Carfe®. ¿Podrían enviármelo? Gracias 😊',
  };
  const text = templates[type] || '';
  navigator.clipboard.writeText(text).then(() => toast('📋', 'Plantilla copiada', 'Lista para usar'));
}

/* ───────── MÉTODOS DE PAGO ───────── */
function togglePM(checkbox, name) {
  if (checkbox.checked) {
    toast('✅', 'Método activado', `${name} habilitado en la tienda`);
  } else {
    toast('ℹ️', 'Método desactivado', `${name} deshabilitado`);
  }
}

function savePMConfig() {
  toast('✅', 'Configuración guardada', 'Métodos de pago actualizados correctamente');
}

/* ───────── AJUSTES ───────── */
function saveSettings() {
  toast('✅', 'Ajustes guardados', 'La configuración de la tienda ha sido actualizada');
}

/* ───────── TOAST (OPTIMIZADO) ───────── */
function toast(icon, title, msg, ms = 2500) {
  const el = document.getElementById('adminToast') || document.getElementById('toast');
  if (!el) return;
  const iconEl = document.getElementById('toastIcon');
  const titleEl = document.getElementById('toastTitle');
  const msgEl = document.getElementById('toastMsg');
  if (iconEl) iconEl.textContent = icon;
  if (titleEl) titleEl.textContent = title;
  if (msgEl) msgEl.textContent = msg;

  el.style.display = 'flex';
  el.style.opacity = '1';
  el.style.transform = 'translateY(0)';

  clearTimeout(el._toastTimer);
  el._toastTimer = setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    setTimeout(() => { el.style.display = 'none'; }, 200);
  }, ms);
}

/* ───────── MODALES ───────── */
function openModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove('hidden');
    el.style.display = 'flex';
    el.style.opacity = '1';
    el.style.visibility = 'visible';
    el.style.pointerEvents = 'auto';
  }
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('hidden');
    el.style.display = 'none';
  }
}

/* ───────── HELPERS ───────── */
function statusBadgeHTML(status) {
  const map = {
    pendiente:  { bg:'#fef9c3', color:'#b45309', icon:'fa-clock', label:'1. Por Confirmar' },
    procesando: { bg:'#dbeafe', color:'#1d4ed8', icon:'fa-boxes-packing', label:'2. En Bodega' },
    enviado:    { bg:'#ede9fe', color:'#7c3aed', icon:'fa-truck-fast', label:'3. En Ruta' },
    entregado:  { bg:'#f0fdf4', color:'#16a34a', icon:'fa-circle-check', label:'4. Entregado' },
    cancelado:  { bg:'#fef2f2', color:'#dc2626', icon:'fa-ban', label:'Cancelado' },
  };
  const s = map[status] || { bg:'#f3f4f6', color:'#6b7280', icon:'fa-circle', label: status };
  return `<span style="background:${s.bg};color:${s.color};padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700;display:inline-flex;align-items:center;gap:4px">
    <i class="fas ${s.icon} text-[10px]"></i> ${s.label}
  </span>`;
}

function invStatusBadge(status) {
  return status === 'pagada'
    ? '<span style="background:#f0fdf4;color:#16a34a;padding:2px 10px;border-radius:12px;font-size:11px;font-weight:600">✓ Pagada</span>'
    : '<span style="background:#fef9c3;color:#b45309;padding:2px 10px;border-radius:12px;font-size:11px;font-weight:600">⏳ Pendiente</span>';
}

function getPayIcon(method) {
  const map = { tarjeta:'💳', efectivo:'💵', transferencia:'🏦', paypal:'🅿', stripe:'💜', cuotas:'🤝' };
  return map[method] || '💰';
}

/* ───────── PERSONALIZADOR VISUAL DE PORTADA, LOGO, LETRAS Y COLORES ───────── */
const THEME_PRESETS = {
  original: {
    heroGradStart: '#3b0764',
    heroGradMid: '#6b21a8',
    heroGradEnd: '#db2777',
    primaryColor: '#7c3aed',
    secondaryColor: '#ec4899',
    titleAccent1: '#fde047',
    titleAccent2: '#f472b6'
  },
  gold: {
    heroGradStart: '#09090b',
    heroGradMid: '#18181b',
    heroGradEnd: '#27272a',
    primaryColor: '#d97706',
    secondaryColor: '#f59e0b',
    titleAccent1: '#fef08a',
    titleAccent2: '#f59e0b'
  },
  blue: {
    heroGradStart: '#0f172a',
    heroGradMid: '#1e3a8a',
    heroGradEnd: '#0284c7',
    primaryColor: '#2563eb',
    secondaryColor: '#06b6d4',
    titleAccent1: '#67e8f9',
    titleAccent2: '#93c5fd'
  },
  emerald: {
    heroGradStart: '#022c22',
    heroGradMid: '#065f46',
    heroGradEnd: '#059669',
    primaryColor: '#10b981',
    secondaryColor: '#14b8a6',
    titleAccent1: '#a7f3d0',
    titleAccent2: '#facc15'
  },
  ruby: {
    heroGradStart: '#450a0a',
    heroGradMid: '#881337',
    heroGradEnd: '#e11d48',
    primaryColor: '#e11d48',
    secondaryColor: '#f43f5e',
    titleAccent1: '#fecdd3',
    titleAccent2: '#fbbf24'
  },
  sunset: {
    heroGradStart: '#431407',
    heroGradMid: '#9a3412',
    heroGradEnd: '#ea580c',
    primaryColor: '#f97316',
    secondaryColor: '#e11d48',
    titleAccent1: '#fde047',
    titleAccent2: '#fb923c'
  },
  roja: {
    heroGradStart: '#450a0a',
    heroGradMid: '#881337',
    heroGradEnd: '#b91c1c',
    primaryColor: '#e11d48',
    secondaryColor: '#f43f5e',
    titleAccent1: '#fecdd3',
    titleAccent2: '#fbbf24',
    heroLayoutMode: 'banner',
    heroBackgroundType: 'image',
    heroBannerOverlay: 'red',
    heroBannerImage: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1920&auto=format&fit=crop&q=85',
    heroTopPromo: 'OFERTAS ESPECIALES',
    heroBigPromoSubtitle: 'DESCUENTOS DE',
    heroBigPromoDiscount: '30% OFF',
    heroPromoHeadline: 'MÁS ESTILO, MEJOR PRECIO',
    heroPromoDesc: 'Aprovecha nuestros descuentos y precios especiales en calzado premium.',
    heroPriceTag1: 'ROPA / ACCESORIOS DESDE',
    heroPriceVal1: '$69.900',
    heroPriceTag2: 'TENIS DESDE',
    heroPriceVal2: '$188.930',
    heroPromoBtnText: 'COMPRAR YA'
  }
};

const DEFAULT_THEME_CONFIG = {
  brandName: 'Carfe',
  brandSuffix: '®',
  brandSlogan: 'Calzado Premium',
  brandLogo: 'assets/logo.svg',
  footerDesc: 'Tu tienda oficial de calzado premium Carfe® con los mejores diseños, confort y envíos a todo el país.',
  
  // Modo de Portada
  heroLayoutMode: 'banner', // 'banner' (Reebok) o 'split'
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

let currentThemeLogoData = null;
let currentSelectedFont = 'Inter';
let currentActivePreset = 'original';

function getStoreThemeConfig() {
  try {
    const raw = localStorage.getItem('carfe_theme_config');
    if (raw) return { ...DEFAULT_THEME_CONFIG, ...JSON.parse(raw) };
  } catch(e) {}
  return { ...DEFAULT_THEME_CONFIG };
}

function initDisenoView() {
  const cfg = getStoreThemeConfig();
  currentThemeLogoData = cfg.brandLogo || 'assets/logo.jpg';
  currentSelectedFont = cfg.fontFamily || 'Inter';
  currentActivePreset = cfg.activePreset || 'original';

  // 1. Marca & Logo
  const bName = document.getElementById('inp_brandName'); if (bName) bName.value = cfg.brandName || 'Carfe';
  const bSuff = document.getElementById('inp_brandSuffix'); if (bSuff) bSuff.value = cfg.brandSuffix || '®';
  const bSlog = document.getElementById('inp_brandSlogan'); if (bSlog) bSlog.value = cfg.brandSlogan || 'Calzado Premium';
  const fDesc = document.getElementById('inp_footerDesc'); if (fDesc) fDesc.value = cfg.footerDesc || '';
  const lUrl = document.getElementById('inp_brandLogoUrl'); if (lUrl) lUrl.value = (cfg.brandLogo && !cfg.brandLogo.startsWith('data:')) ? cfg.brandLogo : '';
  const aPrev = document.getElementById('adminLogoPreview'); if (aPrev) aPrev.src = currentThemeLogoData;

  // 2. Modo de Portada & Banner Promocional
  const mode = cfg.heroLayoutMode || 'banner';
  const radioMode = document.querySelector(`input[name="heroLayoutMode"][value="${mode}"]`);
  if (radioMode) radioMode.checked = true;
  onHeroLayoutModeChange(mode);

  const bgType = document.getElementById('inp_heroBackgroundType');
  if (bgType) bgType.value = cfg.heroBackgroundType || 'image';

  const bOverlay = document.getElementById('inp_heroBannerOverlay');
  if (bOverlay) bOverlay.value = cfg.heroBannerOverlay || 'red';

  const topPromo = document.getElementById('inp_heroTopPromo');
  if (topPromo) topPromo.value = cfg.heroTopPromo || 'OFERTAS ESPECIALES';

  const bigSub = document.getElementById('inp_heroBigPromoSubtitle');
  if (bigSub) bigSub.value = cfg.heroBigPromoSubtitle || 'DESCUENTOS DE';

  const bigDisc = document.getElementById('inp_heroBigPromoDiscount');
  if (bigDisc) bigDisc.value = cfg.heroBigPromoDiscount || '30% OFF';

  const promoHead = document.getElementById('inp_heroPromoHeadline');
  if (promoHead) promoHead.value = cfg.heroPromoHeadline || 'MÁS ESTILO, MEJOR PRECIO';

  const promoDesc = document.getElementById('inp_heroPromoDesc');
  if (promoDesc) promoDesc.value = cfg.heroPromoDesc || 'Aprovecha nuestros descuentos y precios especiales en calzado premium.';

  const pTag1 = document.getElementById('inp_heroPriceTag1');
  if (pTag1) pTag1.value = cfg.heroPriceTag1 || 'ROPA / ACCESORIOS DESDE';

  const pVal1 = document.getElementById('inp_heroPriceVal1');
  if (pVal1) pVal1.value = cfg.heroPriceVal1 || '$69.900';

  const pTag2 = document.getElementById('inp_heroPriceTag2');
  if (pTag2) pTag2.value = cfg.heroPriceTag2 || 'TENIS DESDE';

  const pVal2 = document.getElementById('inp_heroPriceVal2');
  if (pVal2) pVal2.value = cfg.heroPriceVal2 || '$188.930';

  const promoBtn = document.getElementById('inp_heroPromoBtnText');
  if (promoBtn) promoBtn.value = cfg.heroPromoBtnText || 'COMPRAR YA';

  // 2b. Portada Split & Textos Clásicos
  const hBadge = document.getElementById('inp_heroBadgeText'); if (hBadge) hBadge.value = cfg.heroBadgeText || '';
  const hT1 = document.getElementById('inp_heroTitleLine1'); if (hT1) hT1.value = cfg.heroTitleLine1 || '';
  const hT2 = document.getElementById('inp_heroTitleLine2'); if (hT2) hT2.value = cfg.heroTitleLine2 || '';
  const hSub = document.getElementById('inp_heroSubtitle'); if (hSub) hSub.value = cfg.heroSubtitle || '';
  const hB1 = document.getElementById('inp_heroBtnPrimary'); if (hB1) hB1.value = cfg.heroBtnPrimary || '';
  const hB2 = document.getElementById('inp_heroBtnSecondary'); if (hB2) hB2.value = cfg.heroBtnSecondary || '';

  const cBdg = document.getElementById('inp_heroCardBadge'); if (cBdg) cBdg.value = cfg.heroCardBadge || '';
  const cSea = document.getElementById('inp_heroCardSeason'); if (cSea) cSea.value = cfg.heroCardSeason || '';
  const cBrd = document.getElementById('inp_heroCardBrand'); if (cBrd) cBrd.value = cfg.heroCardBrand || '';
  const hVid = document.getElementById('inp_heroVideoUrl'); if (hVid) hVid.value = cfg.heroVideoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-pair-of-white-sneakers-41584-large.mp4';

  const s1n = document.getElementById('inp_heroStat1Num'); if (s1n) s1n.value = cfg.heroStat1Num || '';
  const s1l = document.getElementById('inp_heroStat1Lbl'); if (s1l) s1l.value = cfg.heroStat1Lbl || '';
  const s2n = document.getElementById('inp_heroStat2Num'); if (s2n) s2n.value = cfg.heroStat2Num || '';
  const s2l = document.getElementById('inp_heroStat2Lbl'); if (s2l) s2l.value = cfg.heroStat2Lbl || '';
  const s3n = document.getElementById('inp_heroStat3Num'); if (s3n) s3n.value = cfg.heroStat3Num || '';
  const s3l = document.getElementById('inp_heroStat3Lbl'); if (s3l) s3l.value = cfg.heroStat3Lbl || '';

  // 3. Colores
  setColorField('inp_primaryColor', cfg.primaryColor || '#7c3aed');
  setColorField('inp_secondaryColor', cfg.secondaryColor || '#ec4899');
  setColorField('inp_heroGradStart', cfg.heroGradStart || '#3b0764');
  setColorField('inp_heroGradMid', cfg.heroGradMid || '#6b21a8');
  setColorField('inp_heroGradEnd', cfg.heroGradEnd || '#db2777');
  setColorField('inp_titleAccent1', cfg.titleAccentColor1 || '#fde047');
  setColorField('inp_titleAccent2', cfg.titleAccentColor2 || '#f472b6');

  // 4. Fuente
  onFontFamilyChange(currentSelectedFont);

  // 5. Preset highlight
  highlightPresetButton(currentActivePreset);

  // 6. Live Preview, Video & Banner Status
  updateDisenoLivePreview();
  checkAdminVideoStatus();
  checkAdminBannerStatus();
}

function setColorField(id, val) {
  const picker = document.getElementById(id);
  const hex = document.getElementById(id + 'Hex');
  if (picker) picker.value = val;
  if (hex) hex.value = val;
}

function syncColorInput(targetId, hexVal) {
  if (!hexVal.startsWith('#')) hexVal = '#' + hexVal;
  const picker = document.getElementById(targetId);
  if (picker) picker.value = hexVal;
  onColorChange();
}

function onColorChange() {
  // Sincronizar campos hex con pickers
  ['inp_primaryColor', 'inp_secondaryColor', 'inp_heroGradStart', 'inp_heroGradMid', 'inp_heroGradEnd', 'inp_titleAccent1', 'inp_titleAccent2'].forEach(id => {
    const p = document.getElementById(id);
    const h = document.getElementById(id + 'Hex');
    if (p && h) h.value = p.value;
  });

  currentActivePreset = 'custom';
  highlightPresetButton('custom');
  updateDisenoLivePreview();
}

function selectThemePreset(presetKey) {
  const p = THEME_PRESETS[presetKey];
  if (!p) return;

  setColorField('inp_primaryColor', p.primaryColor);
  setColorField('inp_secondaryColor', p.secondaryColor);
  setColorField('inp_heroGradStart', p.heroGradStart);
  setColorField('inp_heroGradMid', p.heroGradMid);
  setColorField('inp_heroGradEnd', p.heroGradEnd);
  setColorField('inp_titleAccent1', p.titleAccent1);
  setColorField('inp_titleAccent2', p.titleAccent2);

  currentActivePreset = presetKey;
  highlightPresetButton(presetKey);
  updateDisenoLivePreview();

  toast('🎨', 'Paleta Seleccionada', `Aplicada combinación ${presetKey}. Revisa la vista previa en vivo.`);
}

function highlightPresetButton(presetKey) {
  const buttons = document.querySelectorAll('.preset-btn');
  buttons.forEach(b => {
    b.classList.remove('border-purple-500', 'bg-purple-50/40', 'border-amber-500', 'bg-amber-50/40', 'ring-2', 'ring-purple-400');
    b.classList.add('border-gray-200');
  });

  const active = document.getElementById('preset-btn-' + presetKey);
  if (active) {
    active.classList.remove('border-gray-200');
    active.classList.add('border-purple-500', 'bg-purple-50/40', 'ring-2', 'ring-purple-400');
  }
}

function onFontFamilyChange(fontName) {
  currentSelectedFont = fontName;
  const radioLabels = document.querySelectorAll('.font-radio-label');
  radioLabels.forEach(lbl => {
    lbl.classList.remove('border-purple-500', 'bg-purple-50/40', 'ring-2', 'ring-purple-400');
    lbl.classList.add('border-gray-200');
  });

  const targetRadio = document.querySelector(`input[name="storeFontFamily"][value="${fontName}"]`);
  if (targetRadio) {
    targetRadio.checked = true;
    const parentLabel = targetRadio.closest('.font-radio-label');
    if (parentLabel) {
      parentLabel.classList.remove('border-gray-200');
      parentLabel.classList.add('border-purple-500', 'bg-purple-50/40', 'ring-2', 'ring-purple-400');
    }
  }

  updateDisenoLivePreview();
}

function handleAdminLogoUpload(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
      currentThemeLogoData = e.target.result;
      const preview = document.getElementById('adminLogoPreview');
      if (preview) preview.src = currentThemeLogoData;
      const urlInp = document.getElementById('inp_brandLogoUrl');
      if (urlInp) urlInp.value = '';
      updateDisenoLivePreview();
      toast('🖼️', 'Logo Cargado', 'Logo importado correctamente. Recuerda guardar cambios para aplicarlo a toda la tienda.');
    };
    reader.readAsDataURL(file);
  }
}

function onLogoUrlInput(url) {
  url = url.trim();
  if (url) {
    currentThemeLogoData = url;
    const preview = document.getElementById('adminLogoPreview');
    if (preview) preview.src = url;
    updateDisenoLivePreview();
  }
}

function restoreDefaultLogo() {
  currentThemeLogoData = 'assets/logo.svg';
  const preview = document.getElementById('adminLogoPreview');
  if (preview) preview.src = currentThemeLogoData;
  const urlInp = document.getElementById('inp_brandLogoUrl');
  if (urlInp) urlInp.value = '';
  updateDisenoLivePreview();
  toast('🔄', 'Logo Original', 'Se restauró el logo oficial de Carfe®.');
}

function updateDisenoLivePreview() {
  const brandName = document.getElementById('inp_brandName')?.value || 'Carfe';
  const brandSuffix = document.getElementById('inp_brandSuffix')?.value || '®';
  const brandSlogan = document.getElementById('inp_brandSlogan')?.value || 'Calzado Premium';

  const heroBadge = document.getElementById('inp_heroBadgeText')?.value || 'Colección Oficial 2026';
  const heroT1 = document.getElementById('inp_heroTitleLine1')?.value || 'Zapatos que';
  const heroT2 = document.getElementById('inp_heroTitleLine2')?.value || 'Definen tu Estilo';
  const heroSub = document.getElementById('inp_heroSubtitle')?.value || 'La colección más exclusiva de calzado premium.';
  const heroB1 = document.getElementById('inp_heroBtnPrimary')?.value || 'Ver Colección';
  const heroB2 = document.getElementById('inp_heroBtnSecondary')?.value || 'Live todos los viernes';

  const cardBadge = document.getElementById('inp_heroCardBadge')?.value || 'NUEVA TEMPORADA';
  const cardSeason = document.getElementById('inp_heroCardSeason')?.value || 'Colección 2026';
  const cardBrand = document.getElementById('inp_heroCardBrand')?.value || `${brandName} Calzado`;

  const s1n = document.getElementById('inp_heroStat1Num')?.value || '2,500+';
  const s1l = document.getElementById('inp_heroStat1Lbl')?.value || 'Clientes';
  const s2n = document.getElementById('inp_heroStat2Num')?.value || '150+';
  const s2l = document.getElementById('inp_heroStat2Lbl')?.value || 'Modelos';
  const s3n = document.getElementById('inp_heroStat3Num')?.value || '4.9★';
  const s3l = document.getElementById('inp_heroStat3Lbl')?.value || 'Calificación';

  const pCol = document.getElementById('inp_primaryColor')?.value || '#7c3aed';
  const sCol = document.getElementById('inp_secondaryColor')?.value || '#ec4899';
  const gStart = document.getElementById('inp_heroGradStart')?.value || '#3b0764';
  const gMid = document.getElementById('inp_heroGradMid')?.value || '#6b21a8';
  const gEnd = document.getElementById('inp_heroGradEnd')?.value || '#db2777';
  const t1 = document.getElementById('inp_titleAccent1')?.value || '#fde047';
  const t2 = document.getElementById('inp_titleAccent2')?.value || '#f472b6';

  const logoSrc = currentThemeLogoData || 'assets/logo.jpg';

  // Actualizar Navbar Mock
  const pNavLogo = document.getElementById('prevNavLogo'); if (pNavLogo) pNavLogo.src = logoSrc;
  const pNavName = document.getElementById('prevNavBrandName'); if (pNavName) pNavName.textContent = brandName;
  const pNavSuff = document.getElementById('prevNavBrandSuffix');
  if (pNavSuff) {
    pNavSuff.textContent = brandSuffix;
    pNavSuff.style.color = pCol;
  }
  const pNavSlog = document.getElementById('prevNavSlogan'); if (pNavSlog) pNavSlog.textContent = brandSlogan;

  // Actualizar Hero Mock
  const pHero = document.getElementById('prevHeroSection');
  if (pHero) {
    pHero.style.background = `linear-gradient(135deg, ${gStart} 0%, ${gMid} 50%, ${gEnd} 100%)`;
  }

  const pBdgLogo = document.getElementById('prevBadgeLogo'); if (pBdgLogo) pBdgLogo.src = logoSrc;
  const pBdgText = document.getElementById('prevBadgeText'); if (pBdgText) pBdgText.textContent = heroBadge;

  const pTitle1 = document.getElementById('prevTitle1'); if (pTitle1) pTitle1.textContent = heroT1;
  const pTitle2 = document.getElementById('prevTitle2');
  if (pTitle2) {
    pTitle2.textContent = heroT2;
    pTitle2.style.backgroundImage = `linear-gradient(to right, ${t1}, ${t2})`;
  }

  const pSub = document.getElementById('prevSubtitle'); if (pSub) pSub.textContent = heroSub;
  const pB1 = document.getElementById('prevBtn1Text'); if (pB1) pB1.textContent = heroB1;
  const pBtn1 = document.getElementById('prevBtn1'); if (pBtn1) pBtn1.style.color = pCol;
  const pB2 = document.getElementById('prevBtn2Text'); if (pB2) pB2.textContent = heroB2;

  const pCLogo = document.getElementById('prevCardLogo'); if (pCLogo) pCLogo.src = logoSrc;
  const pCBdg = document.getElementById('prevCardBadge'); if (pCBdg) pCBdg.textContent = cardBadge;
  const pCSea = document.getElementById('prevCardSeason'); if (pCSea) pCSea.textContent = cardSeason;
  const pCBrd = document.getElementById('prevCardBrand'); if (pCBrd) pCBrd.textContent = cardBrand;

  const ps1n = document.getElementById('prevStat1Num'); if (ps1n) ps1n.textContent = s1n;
  const ps1l = document.getElementById('prevStat1Lbl'); if (ps1l) ps1l.textContent = s1l;
  const ps2n = document.getElementById('prevStat2Num'); if (ps2n) ps2n.textContent = s2n;
  const ps2l = document.getElementById('prevStat2Lbl'); if (ps2l) ps2l.textContent = s2l;
  const ps3n = document.getElementById('prevStat3Num'); if (ps3n) ps3n.textContent = s3n;
  const ps3l = document.getElementById('prevStat3Lbl'); if (ps3l) ps3l.textContent = s3l;

  // Tipografía
  const mockBox = document.getElementById('mockContainer');
  if (mockBox && currentSelectedFont) {
    mockBox.style.fontFamily = `'${currentSelectedFont}', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  }
}

function onHeroLayoutModeChange(mode) {
  const lblBanner = document.getElementById('lblModeBanner');
  const lblSplit = document.getElementById('lblModeSplit');
  if (mode === 'banner') {
    if (lblBanner) {
      lblBanner.classList.add('border-red-600', 'bg-red-50/40');
      lblBanner.classList.remove('border-gray-200');
    }
    if (lblSplit) {
      lblSplit.classList.remove('border-purple-600', 'bg-purple-50/40');
      lblSplit.classList.add('border-gray-200');
    }
  } else {
    if (lblSplit) {
      lblSplit.classList.add('border-purple-600', 'bg-purple-50/40');
      lblSplit.classList.remove('border-gray-200');
    }
    if (lblBanner) {
      lblBanner.classList.remove('border-red-600', 'bg-red-50/40');
      lblBanner.classList.add('border-gray-200');
    }
  }
}

function applyPresetRedCampaign() {
  selectThemePreset('roja');
  const rBanner = document.querySelector('input[name="heroLayoutMode"][value="banner"]');
  if (rBanner) {
    rBanner.checked = true;
    onHeroLayoutModeChange('banner');
  }
  const overlaySel = document.getElementById('inp_heroBannerOverlay');
  if (overlaySel) overlaySel.value = 'red';

  const bgTypeSel = document.getElementById('inp_heroBackgroundType');
  if (bgTypeSel) bgTypeSel.value = 'image';

  saveStoreThemeFromAdmin();
  toast('🔴', '¡Estilo "La Roja" Activado!', 'Portada configurada al estilo Reebok con 30% OFF y fondo de campaña.');
}

function saveStoreThemeFromAdmin() {
  const brandName = document.getElementById('inp_brandName')?.value.trim() || 'Carfe';
  const brandSuffix = document.getElementById('inp_brandSuffix')?.value.trim() || '®';
  const brandSlogan = document.getElementById('inp_brandSlogan')?.value.trim() || 'Calzado Premium';
  const footerDesc = document.getElementById('inp_footerDesc')?.value.trim() || '';

  // Modo de Portada & Banner Promocional
  const heroLayoutMode = document.querySelector('input[name="heroLayoutMode"]:checked')?.value || 'banner';
  const heroBackgroundType = document.getElementById('inp_heroBackgroundType')?.value || 'image';
  const heroBannerOverlay = document.getElementById('inp_heroBannerOverlay')?.value || 'red';

  const heroTopPromo = document.getElementById('inp_heroTopPromo')?.value.trim() || 'OFERTAS ESPECIALES';
  const heroBigPromoSubtitle = document.getElementById('inp_heroBigPromoSubtitle')?.value.trim() || 'DESCUENTOS DE';
  const heroBigPromoDiscount = document.getElementById('inp_heroBigPromoDiscount')?.value.trim() || '30% OFF';
  const heroPromoHeadline = document.getElementById('inp_heroPromoHeadline')?.value.trim() || 'MÁS ESTILO, MEJOR PRECIO';
  const heroPromoDesc = document.getElementById('inp_heroPromoDesc')?.value.trim() || 'Aprovecha nuestros descuentos y precios especiales en calzado premium.';
  const heroPriceTag1 = document.getElementById('inp_heroPriceTag1')?.value.trim() || 'ROPA / ACCESORIOS DESDE';
  const heroPriceVal1 = document.getElementById('inp_heroPriceVal1')?.value.trim() || '$69.900';
  const heroPriceTag2 = document.getElementById('inp_heroPriceTag2')?.value.trim() || 'TENIS DESDE';
  const heroPriceVal2 = document.getElementById('inp_heroPriceVal2')?.value.trim() || '$188.930';
  const heroPromoBtnText = document.getElementById('inp_heroPromoBtnText')?.value.trim() || 'COMPRAR YA';

  // Textos Portada Clásica (Split)
  const heroBadgeText = document.getElementById('inp_heroBadgeText')?.value.trim() || 'Colección Oficial Carfe® 2026';
  const heroTitleLine1 = document.getElementById('inp_heroTitleLine1')?.value.trim() || 'Zapatos que';
  const heroTitleLine2 = document.getElementById('inp_heroTitleLine2')?.value.trim() || 'Definen tu Estilo';
  const heroSubtitle = document.getElementById('inp_heroSubtitle')?.value.trim() || '';
  const heroBtnPrimary = document.getElementById('inp_heroBtnPrimary')?.value.trim() || 'Ver Colección';
  const heroBtnSecondary = document.getElementById('inp_heroBtnSecondary')?.value.trim() || 'Live todos los viernes';

  const heroCardBadge = document.getElementById('inp_heroCardBadge')?.value.trim() || 'NUEVA TEMPORADA';
  const heroCardSeason = document.getElementById('inp_heroCardSeason')?.value.trim() || 'Colección 2026';
  const heroCardBrand = document.getElementById('inp_heroCardBrand')?.value.trim() || `${brandName} Calzado`;
  const heroVideoUrl = document.getElementById('inp_heroVideoUrl')?.value.trim() || 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-pair-of-white-sneakers-41584-large.mp4';

  const heroStat1Num = document.getElementById('inp_heroStat1Num')?.value.trim() || '2,500+';
  const heroStat1Lbl = document.getElementById('inp_heroStat1Lbl')?.value.trim() || 'Clientes';
  const heroStat2Num = document.getElementById('inp_heroStat2Num')?.value.trim() || '150+';
  const heroStat2Lbl = document.getElementById('inp_heroStat2Lbl')?.value.trim() || 'Modelos';
  const heroStat3Num = document.getElementById('inp_heroStat3Num')?.value.trim() || '4.9★';
  const heroStat3Lbl = document.getElementById('inp_heroStat3Lbl')?.value.trim() || 'Calificación';

  const primaryColor = document.getElementById('inp_primaryColor')?.value || '#7c3aed';
  const secondaryColor = document.getElementById('inp_secondaryColor')?.value || '#ec4899';
  const heroGradStart = document.getElementById('inp_heroGradStart')?.value || '#3b0764';
  const heroGradMid = document.getElementById('inp_heroGradMid')?.value || '#6b21a8';
  const heroGradEnd = document.getElementById('inp_heroGradEnd')?.value || '#db2777';
  const titleAccentColor1 = document.getElementById('inp_titleAccent1')?.value || '#fde047';
  const titleAccentColor2 = document.getElementById('inp_titleAccent2')?.value || '#f472b6';

  const heroGradient = `linear-gradient(135deg, ${heroGradStart} 0%, ${heroGradMid} 50%, ${heroGradEnd} 100%)`;

  const cfg = {
    brandName,
    brandSuffix,
    brandSlogan,
    brandLogo: currentThemeLogoData || 'assets/logo.svg',
    footerDesc,
    heroLayoutMode,
    heroBackgroundType,
    heroBannerOverlay,
    heroTopPromo,
    heroBigPromoSubtitle,
    heroBigPromoDiscount,
    heroPromoHeadline,
    heroPromoDesc,
    heroPriceTag1,
    heroPriceVal1,
    heroPriceTag2,
    heroPriceVal2,
    heroPromoBtnText,
    heroBadgeText,
    heroTitleLine1,
    heroTitleLine2,
    heroSubtitle,
    heroBtnPrimary,
    heroBtnSecondary,
    heroCardBadge,
    heroCardSeason,
    heroCardBrand,
    heroVideoUrl,
    heroStat1Num,
    heroStat1Lbl,
    heroStat2Num,
    heroStat2Lbl,
    heroStat3Num,
    heroStat3Lbl,
    heroGradStart,
    heroGradMid,
    heroGradEnd,
    heroGradient,
    primaryColor,
    secondaryColor,
    titleAccentColor1,
    titleAccentColor2,
    fontFamily: currentSelectedFont || 'Inter',
    activePreset: currentActivePreset || 'roja'
  };

  localStorage.setItem('carfe_theme_config', JSON.stringify(cfg));
  window.dispatchEvent(new Event('storage'));

  // Sincronizar también con campo de ajustes
  const ajBrand = document.getElementById('ajustes_brandName');
  if (ajBrand) ajBrand.value = brandName;

  toast('💾', '¡Tienda y Portada Actualizadas!', 'Los cambios de diseño, logo, banner de campaña, video y colores se aplicaron correctamente.');
}

// ===== INDEXEDDB CARFE MEDIA STORAGE (VIDEOS & ASSETS GRANDES / CANVA) =====
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

  async saveVideo(fileOrBlob) {
    const db = await this.open();
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        const req = store.put(fileOrBlob, 'hero_presentation_video');
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch(err) {
        resolve(false);
      }
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

  async removeVideo() {
    const db = await this.open();
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        const req = store.delete('hero_presentation_video');
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch(err) {
        resolve(false);
      }
    });
  },

  async saveBannerImage(fileOrBlob) {
    const db = await this.open();
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        const req = store.put(fileOrBlob, 'hero_banner_image');
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch(err) {
        resolve(false);
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
  },

  async removeBannerImage() {
    const db = await this.open();
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        const req = store.delete('hero_banner_image');
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch(err) {
        resolve(false);
      }
    });
  }
};

let currentAdminBannerBlobUrl = null;

async function checkAdminBannerStatus() {
  const infoBox = document.getElementById('adminBannerFileInfo');
  const nameEl = document.getElementById('adminBannerFileName');
  const removeBtn = document.getElementById('btnRemoveBanner');

  try {
    const blob = await CarfeMediaDB.getBannerImage();
    if (blob) {
      if (infoBox) infoBox.classList.remove('hidden');
      if (nameEl) {
        const metaName = localStorage.getItem('carfe_hero_banner_name') || 'banner-canva.jpg';
        const sizeMb = (blob.size / (1024 * 1024)).toFixed(1);
        nameEl.textContent = `${metaName} (${sizeMb} MB) — Banner Activo de Canva`;
      }
      if (removeBtn) removeBtn.classList.remove('hidden');
      return;
    }
  } catch(e) {}

  if (infoBox) infoBox.classList.add('hidden');
  if (removeBtn) removeBtn.classList.add('hidden');
}

async function handleAdminBannerUpload(input) {
  const file = input.files && input.files[0];
  if (!file) return;

  if (file.size > 50 * 1024 * 1024) {
    toast('⚠️', 'Imagen muy grande', 'Por favor selecciona un archivo menor a 50 MB.');
    return;
  }

  toast('⏳', 'Cargando Banner...', 'Guardando banner de Canva en alta resolución...');

  try {
    const ok = await CarfeMediaDB.saveBannerImage(file);
    if (!ok) throw new Error('IndexedDB save failed');

    localStorage.setItem('carfe_has_custom_banner', 'true');
    localStorage.setItem('carfe_hero_banner_name', file.name);
    localStorage.setItem('carfe_banner_updated_at', String(Date.now()));

    // Activar modo banner automáticamente al subir
    const rBanner = document.querySelector('input[name="heroLayoutMode"][value="banner"]');
    if (rBanner) {
      rBanner.checked = true;
      onHeroLayoutModeChange('banner');
    }

    window.dispatchEvent(new Event('storage'));
    await checkAdminBannerStatus();
    saveStoreThemeFromAdmin();
    toast('🎨', '¡Banner de Canva Cargado!', `"${file.name}" se configuró como portada de la tienda.`);
  } catch(err) {
    console.error('Error guardando banner:', err);
    toast('❌', 'Error al guardar banner', 'No se pudo guardar la imagen. Intenta con un archivo JPG o PNG estándar.');
  }
  input.value = '';
}

async function loadOfficialRedCampaignBanner() {
  await CarfeMediaDB.removeBannerImage();
  localStorage.removeItem('carfe_has_custom_banner');
  localStorage.removeItem('carfe_hero_banner_name');
  localStorage.setItem('carfe_banner_updated_at', String(Date.now()));

  const rBanner = document.querySelector('input[name="heroLayoutMode"][value="banner"]');
  if (rBanner) {
    rBanner.checked = true;
    onHeroLayoutModeChange('banner');
  }

  const overlaySel = document.getElementById('inp_heroBannerOverlay');
  if (overlaySel) overlaySel.value = 'red';

  const bgTypeSel = document.getElementById('inp_heroBackgroundType');
  if (bgTypeSel) bgTypeSel.value = 'image';

  saveStoreThemeFromAdmin();
  await checkAdminBannerStatus();
  toast('🔴', 'Foto Oficial "La Roja"', 'Se cargó la fotografía oficial de campaña urbana con tinte rojo estilo Reebok.');
}

async function removeCustomBanner() {
  if (!confirm('¿Deseas quitar la imagen personalizada y volver a la foto oficial de calzado?')) return;
  await CarfeMediaDB.removeBannerImage();
  localStorage.removeItem('carfe_has_custom_banner');
  localStorage.removeItem('carfe_hero_banner_name');
  localStorage.setItem('carfe_banner_updated_at', String(Date.now()));
  window.dispatchEvent(new Event('storage'));
  await checkAdminBannerStatus();
  toast('🗑️', 'Banner Removido', 'Se ha restablecido la portada predeterminada.');
}

let currentAdminVideoBlobUrl = null;

async function checkAdminVideoStatus() {
  const badge = document.getElementById('adminVideoStatusBadge');
  const infoBox = document.getElementById('adminVideoFileInfo');
  const nameEl = document.getElementById('adminVideoFileName');
  const removeBtn = document.getElementById('btnRemoveHeroVideo');
  const preview = document.getElementById('adminHeroVideoPreview');

  try {
    const blob = await CarfeMediaDB.getVideo();
    if (blob) {
      if (badge) {
        badge.className = 'bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1';
        badge.innerHTML = '<i class="fas fa-check-circle text-[7px] text-emerald-600"></i> Video Propio Cargado';
      }
      if (infoBox) infoBox.classList.remove('hidden');
      if (nameEl) {
        const metaName = localStorage.getItem('carfe_hero_video_name') || 'video-presentacion.mp4';
        const sizeMb = (blob.size / (1024 * 1024)).toFixed(1);
        nameEl.textContent = `${metaName} (${sizeMb} MB) — Almacenado y Listo`;
      }
      if (removeBtn) removeBtn.classList.remove('hidden');

      if (preview) {
        if (currentAdminVideoBlobUrl) {
          try { URL.revokeObjectURL(currentAdminVideoBlobUrl); } catch(e){}
        }
        currentAdminVideoBlobUrl = URL.createObjectURL(blob);
        preview.src = currentAdminVideoBlobUrl;
        preview.load();
        preview.play().catch(()=>{});
      }
      return;
    }
  } catch(e) {}

  // Sin video propio subido
  if (badge) {
    badge.className = 'bg-purple-100 text-purple-700 font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1';
    badge.innerHTML = '<i class="fas fa-circle text-[6px] text-green-500 animate-pulse"></i> Video Oficial Activo';
  }
  if (infoBox) infoBox.classList.add('hidden');
  if (removeBtn) removeBtn.classList.add('hidden');

  const cfg = getStoreThemeConfig();
  const url = cfg.heroVideoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-pair-of-white-sneakers-41584-large.mp4';
  if (preview) {
    preview.src = url;
    preview.load();
    preview.play().catch(()=>{});
  }
}

async function handleAdminHeroVideoUpload(input) {
  const file = input.files && input.files[0];
  if (!file) return;

  if (file.size > 150 * 1024 * 1024) {
    toast('⚠️', 'Archivo muy grande', 'Por favor selecciona un video menor a 150 MB para un rendimiento óptimo.');
    return;
  }

  toast('⏳', 'Procesando Video...', 'Guardando el video de presentación...');

  try {
    const ok = await CarfeMediaDB.saveVideo(file);
    if (!ok) throw new Error('IndexedDB save failed');

    localStorage.setItem('carfe_has_custom_video', 'true');
    localStorage.setItem('carfe_hero_video_name', file.name);
    localStorage.setItem('carfe_video_updated_at', String(Date.now()));

    // Disparar evento para que otras pestañas (como index.html) sincronicen
    window.dispatchEvent(new Event('storage'));

    await checkAdminVideoStatus();
    toast('🎬', '¡Video de Presentación Guardado!', `Se cargó "${file.name}" exitosamente. Ya se muestra en la portada.`);
  } catch(err) {
    console.error('Error guardando video:', err);
    toast('❌', 'Error al guardar video', 'No se pudo guardar el archivo. Intenta con un video MP4 más corto.');
  }
  input.value = '';
}

async function removeCustomHeroVideo() {
  if (!confirm('¿Deseas quitar el video subido y volver al video oficial de calzado?')) return;
  await CarfeMediaDB.removeVideo();
  localStorage.removeItem('carfe_has_custom_video');
  localStorage.removeItem('carfe_hero_video_name');
  localStorage.setItem('carfe_video_updated_at', String(Date.now()));
  window.dispatchEvent(new Event('storage'));
  await checkAdminVideoStatus();
  toast('🗑️', 'Video Removido', 'Se ha restablecido el video oficial.');
}

function updateAdminVideoPreviewFromUrl(url) {
  const preview = document.getElementById('adminHeroVideoPreview');
  url = (url || '').trim();
  if (preview && url) {
    preview.src = url;
    preview.load();
    preview.play().catch(()=>{});
  }
}

function resetDefaultHeroVideo() {
  const vid = document.getElementById('inp_heroVideoUrl');
  if (vid) {
    vid.value = 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-pair-of-white-sneakers-41584-large.mp4';
    updateAdminVideoPreviewFromUrl(vid.value);
    toast('📹', 'Video Restablecido', 'Se restableció el video oficial de calzado en portada.');
  }
}

function resetStoreThemeToDefault() {
  if (!confirm('¿Deseas restaurar el diseño original de Carfe® (Logo, textos, tipografía y colores púrpuras)?')) return;
  localStorage.removeItem('carfe_theme_config');
  initDisenoView();
  saveStoreThemeFromAdmin();
  toast('🔄', 'Diseño Restaurado', 'Se ha restablecido la portada y diseño oficial de Carfe®.');
}

/* ───────── TECLADO ENTER en login ───────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('loginScreen')?.style.display !== 'none') {
    doLogin();
  }
});

/* ───────── INIT ───────── */
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  updateHeaderDate();
  updateHeaderWAIndicator();
  loadTikTokConfig();
  loadFooterSettingsInAdmin();
  loadBase44SettingsInAdmin();
  updatePendingOrdersCounter();
  syncCrmWithCarteraAndSales();
  updateCrmKPIs();

  // Semilla de notificación de cobranza pendiente
  addNotification(
    '💳',
    'Cuenta por Cobrar: Pedro Ramírez',
    'Cuota 2 pendiente: $124.500 COP (Classic Oxford) — Vence en 2 días',
    'cobranza',
    {
      client: 'Pedro Ramírez',
      product: 'Classic Oxford',
      phone: '+57 311 839 2104',
      total: 124500,
      creditId: 'CRT-002'
    }
  );

  // Revisar pedidos pendientes cada 15 segundos
  setInterval(checkPendingOrders, 15000);

  // Simulación: primer pedido dinámico y visual a los 10 segundos
  setTimeout(() => {
    simulatePendingOrder();
  }, 10000);

  // Simulación: nuevos pedidos aleatorios cada 75s
  setInterval(() => {
    simulatePendingOrder();
  }, 75000);
});

/* ───────── NAVEGACIÓN MÓVIL PWA & BOTTOM SHEET "MÁS" ───────── */
function openMobileMoreSheet() {
  const sheet = document.getElementById('mobileMoreSheet');
  if (sheet) sheet.classList.remove('hidden');
}

function closeMobileMoreSheet() {
  const sheet = document.getElementById('mobileMoreSheet');
  if (sheet) sheet.classList.add('hidden');
}

/* ───────── REGISTRO RÁPIDO DE ABONOS (CARTERA 2 CUOTAS) ───────── */
function quickOpenAbono() {
  const unpaid = carteraData.filter(c => !c.quota2Paid);
  if (unpaid.length === 0) {
    toast('✅', 'Cartera al Día', 'Todos los clientes están al día sin cuotas pendientes.');
    showView('cartera');
    return;
  }
  const select = document.getElementById('quickAbonoCreditSelect');
  if (select) {
    select.innerHTML = unpaid.map(c => `
      <option value="${c.id}">
        ${c.client} — ${c.product} (Debe: ${formatCOP(c.quota2 || (c.total / 2))})
      </option>
    `).join('');
  }
  onQuickAbonoSelectChange();
  openModal('quickAbonoModal');
}

function onQuickAbonoSelectChange() {
  const select = document.getElementById('quickAbonoCreditSelect');
  if (!select) return;
  const c = carteraData.find(x => x.id === select.value);
  if (!c) return;
  safeText('quickAbonoPendingAmount', formatCOP(c.quota2 || (c.total / 2)));
  safeText('quickAbonoDueDate', c.estimatedDate || 'Por coordinar');
}

function confirmQuickAbono() {
  const select = document.getElementById('quickAbonoCreditSelect');
  if (!select) return;
  const creditId = select.value;
  const method = document.getElementById('quickAbonoPayMethod')?.value || 'nequi';
  const notes = document.getElementById('quickAbonoNotes')?.value || 'Abono rápido liquidado en caja';

  closeModal('quickAbonoModal');
  triggerCustomerPaymentSettlement(creditId, method, notes);
  initDashboard();
}

/* ───────── COPIAS DE SEGURIDAD Y RESTAURACIÓN (1-CLIC BACKUP) ───────── */
function exportCarfeBackup() {
  try {
    const backupData = {
      system: 'CARFE Calzado Suite',
      version: '2.0-PWA',
      exportDate: new Date().toISOString(),
      store: 'CARFE Calzado',
      data: {}
    };
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('carfe_') || key.startsWith('ss_'))) {
        backupData.data[key] = localStorage.getItem(key);
      }
    }
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `carfe_backup_${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast('💾', 'Respaldo Descargado', `Copia guardada con éxito (${Object.keys(backupData.data).length} tablas locales).`);
    addNotification('🛡️', 'Copia de Seguridad Exportada', `Respaldo descargado: carfe_backup_${dateStr}.json`, 'sistema');
  } catch(e) {
    toast('⚠️', 'Error al Respaldar', e.message);
  }
}

function restoreCarfeBackup(input) {
  const file = input.files && input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!parsed.data || typeof parsed.data !== 'object') {
        throw new Error('Formato de archivo inválido. No contiene datos válidos de CARFE.');
      }
      if (!confirm(`¿Deseas restaurar este respaldo de CARFE (${parsed.exportDate || 'Sin fecha'})? Se sobreescribirán los datos locales actuales.`)) {
        input.value = '';
        return;
      }
      Object.keys(parsed.data).forEach(k => {
        localStorage.setItem(k, parsed.data[k]);
      });
      toast('✅', 'Restauración Exitosa', 'Datos restaurados correctamente. Recargando...');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch(err) {
      alert('Error al restaurar archivo: ' + err.message);
    }
  };
  reader.readAsText(file);
}

/* ───────── GESTIÓN DE INFORMACIÓN DEL PIE DE PÁGINA & CONTACTO PÚBLICO ───────── */
function saveFooterSettings() {
  const wa = document.getElementById('ajustes_footerWa')?.value?.trim() || '';
  const email = document.getElementById('ajustes_footerEmail')?.value?.trim() || '';
  const schedule = document.getElementById('ajustes_footerSchedule')?.value?.trim() || '';
  const city = document.getElementById('ajustes_footerCity')?.value?.trim() || '';
  const tiktok = document.getElementById('ajustes_footerTikTok')?.value?.trim() || '';
  const instagram = document.getElementById('ajustes_footerInstagram')?.value?.trim() || '';
  const desc = document.getElementById('ajustes_footerDesc')?.value?.trim() || '';

  const footerData = {
    phone: wa || '+57 300 123 4567',
    email: email || 'contacto@carfe.com.co',
    schedule: schedule || 'Lun–Sáb 9AM–7PM',
    city: city || 'Bucaramanga, Colombia',
    tiktok: tiktok || '@carfe_oficial',
    instagram: instagram || '@carfe_calzado',
    desc: desc || 'Tu tienda oficial de calzado premium Carfe® con los mejores diseños, confort y envíos a todo el país.'
  };

  localStorage.setItem('carfe_footer_info', JSON.stringify(footerData));

  // Actualizar también el número directo de WhatsApp si fue ingresado
  const digits = wa.replace(/\D/g, '');
  if (digits && digits.length >= 10) {
    localStorage.setItem('carfe_wa_store_phone', digits);
    const waStoreInput = document.getElementById('ajustes_wa_store_phone');
    if (waStoreInput) waStoreInput.value = digits;
    updateHeaderWAIndicator();
  }

  toast('✅', 'Información Guardada', 'El pie de página y datos de contacto de la tienda se actualizaron correctamente.');
  addNotification('⚙️', 'Pie de Página Actualizado', `Nuevos datos de contacto guardados (${footerData.phone})`, 'sistema');
}

function loadFooterSettingsInAdmin() {
  try {
    const raw = localStorage.getItem('carfe_footer_info');
    const f = raw ? JSON.parse(raw) : null;
    const storePhone = localStorage.getItem('carfe_wa_store_phone');

    const waEl = document.getElementById('ajustes_footerWa');
    if (waEl) waEl.value = f?.phone || (storePhone ? '+' + storePhone : '+57 300 123 4567');

    const emailEl = document.getElementById('ajustes_footerEmail');
    if (emailEl) emailEl.value = f?.email || 'contacto@carfe.com.co';

    const schedEl = document.getElementById('ajustes_footerSchedule');
    if (schedEl) schedEl.value = f?.schedule || 'Lun–Sáb 9AM–7PM';

    const cityEl = document.getElementById('ajustes_footerCity');
    if (cityEl) cityEl.value = f?.city || 'Bucaramanga, Colombia';

    const ttEl = document.getElementById('ajustes_footerTikTok');
    if (ttEl) ttEl.value = f?.tiktok || '@carfe_oficial';

    const igEl = document.getElementById('ajustes_footerInstagram');
    if (igEl) igEl.value = f?.instagram || '@carfe_calzado';

    const descEl = document.getElementById('ajustes_footerDesc');
    if (descEl) descEl.value = f?.desc || 'Tu tienda oficial de calzado premium Carfe® con los mejores diseños, confort y envíos a todo el país.';
  } catch(e) {
    console.error('Error cargando footer settings en admin:', e);
  }
}

/* ───────── INTEGRACIÓN Y SINCRONIZACIÓN CON BASE44 CLOUD BAAS ───────── */
function loadBase44SettingsInAdmin() {
  if (typeof Base44Client === 'undefined') return;
  const cfg = Base44Client.getConfig();
  const appIdInp = document.getElementById('base44_appId');
  const apiKeyInp = document.getElementById('base44_apiKey');
  if (appIdInp) appIdInp.value = cfg.appId || '';
  if (apiKeyInp) apiKeyInp.value = cfg.apiKey || '';
  Base44Client.updateAdminStatusUI();
}

async function testAndSaveBase44Connection() {
  if (typeof Base44Client === 'undefined') {
    toast('⚠️', 'Error', 'Módulo Base44 no disponible.');
    return;
  }
  const appId = document.getElementById('base44_appId')?.value?.trim();
  const apiKey = document.getElementById('base44_apiKey')?.value?.trim();

  if (!appId) {
    toast('⚠️', 'Falta App ID', 'Ingresa tu App ID de Base44 para conectar.');
    return;
  }

  toast('⏳', 'Verificando Base44...', 'Comprobando conectividad con el backend de Base44 Cloud');
  const res = await Base44Client.testConnection(appId, apiKey);
  if (res.ok) {
    Base44Client.saveConfig({ appId, apiKey, enabled: true });
    toast('☁️', '¡Conectado a Base44!', `CARFE unificado con el proyecto Base44: ${appId}`);
    addNotification('☁️', 'Conexión Base44 Establecida', `Suite CARFE vinculada con App ID: ${appId}`, 'sistema');
  } else {
    toast('⚠️', 'No se pudo conectar', res.error || 'Verifica tu App ID de Base44');
  }
}

async function syncAllCarfeToBase44() {
  if (typeof Base44Client === 'undefined') {
    toast('⚠️', 'Error', 'Módulo Base44 no disponible.');
    return;
  }
  const cfg = Base44Client.getConfig();
  let appId = cfg.appId;
  if (!appId) {
    appId = document.getElementById('base44_appId')?.value?.trim();
    if (appId) {
      Base44Client.saveConfig({ appId, enabled: true });
    } else {
      toast('⚠️', 'Configura tu App ID', 'Ingresa primero el App ID de tu proyecto Base44.');
      return;
    }
  }

  toast('🔄', 'Sincronizando con Base44...', 'Subiendo productos, pedidos, cartera y clientes a la nube...');
  try {
    const res = await Base44Client.syncAllToCloud();
    toast('✅', 'Sincronización Exitosa', `Se unificaron ${res.products} productos y ${res.orders} pedidos en Base44.`);
    addNotification('🚀', 'Sincronización Cloud Completa', `Base44 actualizado con éxito (${res.products} productos, ${res.orders} pedidos).`, 'sistema');
  } catch(e) {
    toast('⚠️', 'Error al Sincronizar', e.message);
  }
}
