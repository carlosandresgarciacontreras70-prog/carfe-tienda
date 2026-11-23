/**
 * CARFE® Calzado — Cliente Oficial de Supabase BaaS (Database, Storage & Realtime)
 * Proporciona persistencia en la nube PostgreSQL y sincronización en tiempo real
 */

const CarfeSupabase = {
  STORAGE_KEY: 'carfe_supabase_config',
  client: null,
  realtimeSubscription: null,

  getConfig() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) return JSON.parse(raw);
      return {
        url: 'https://eyecwrkqwgsmbgkcxqoe.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5ZWN3cmtxd2dzbWJna2N4cW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1NjUxMDYsImV4cCI6MjEwODE0MTEwNn0.Rf0NcSG7ufxA0Bza-QlVquTX1u9ekcUX5Nrp5wyYttM',
        enabled: true,
        autoSync: true
      };
    } catch(e) {
      return {
        url: 'https://eyecwrkqwgsmbgkcxqoe.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5ZWN3cmtxd2dzbWJna2N4cW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1NjUxMDYsImV4cCI6MjEwODE0MTEwNn0.Rf0NcSG7ufxA0Bza-QlVquTX1u9ekcUX5Nrp5wyYttM',
        enabled: true,
        autoSync: true
      };
    }
  },

  saveConfig(cfg) {
    const current = this.getConfig();
    const updated = { ...current, ...cfg };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    this.client = null; // Reiniciar instancia
    this.init();
    return updated;
  },

  isConfigured() {
    const cfg = this.getConfig();
    return !!(cfg.enabled && cfg.url && cfg.anonKey && cfg.url.startsWith('http'));
  },

  init() {
    if (!this.isConfigured()) return null;
    if (this.client) return this.client;

    const cfg = this.getConfig();
    if (typeof supabase !== 'undefined' && supabase.createClient) {
      try {
        this.client = supabase.createClient(cfg.url, cfg.anonKey, {
          auth: { persistSession: true },
          realtime: { params: { eventsPerSecond: 10 } }
        });
        console.log('[CARFE Supabase] Cliente inicializado correctamente con:', cfg.url);
        return this.client;
      } catch(err) {
        console.warn('[CARFE Supabase] Error al crear cliente:', err);
        return null;
      }
    }
    return null;
  },

  async testConnection(testUrl, testKey) {
    const url = testUrl || this.getConfig().url;
    const key = testKey || this.getConfig().anonKey;

    if (!url || !key) {
      return { ok: false, error: 'Ingresa la URL y la Anon Key de tu proyecto Supabase.' };
    }

    try {
      if (typeof supabase === 'undefined' || !supabase.createClient) {
        throw new Error('Librería de Supabase no cargada en el navegador.');
      }
      const testClient = supabase.createClient(url, key);
      const { data, error } = await testClient.from('products').select('count', { count: 'exact', head: true });
      if (error) throw error;
      return { ok: true, count: data };
    } catch(err) {
      return { ok: false, error: err.message || 'No se pudo conectar a la base de datos Supabase.' };
    }
  },

  /* ───────── OPERACIONES DE PRODUCTOS (CRUD) ───────── */
  async getProducts() {
    const client = this.init();
    if (!client) return null;
    try {
      const { data, error } = await client
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('id', { ascending: false });
      if (error) throw error;
      return data;
    } catch(e) {
      console.warn('[CARFE Supabase] Error obteniendo productos:', e);
      return null;
    }
  },

  async upsertProduct(product) {
    const client = this.init();
    if (!client) return null;
    try {
      const payload = {
        name: product.name,
        brand: product.brand || 'Carfe®',
        category: product.cat || product.category || 'hombre',
        cost: Number(product.cost) || 0,
        price: Number(product.price) || 0,
        old_price: (product.oldPrice || product.old_price) ? Number(product.oldPrice || product.old_price) : null,
        stock: product.stock !== undefined ? Number(product.stock) : 12,
        badge: product.badge || 'new',
        colors: Array.isArray(product.colors) ? product.colors : ['Negro', 'Café'],
        sizes: Array.isArray(product.sizes) ? product.sizes : [38, 39, 40, 41, 42, 43],
        image_url: product.img || product.image_url || product.photoData || null,
        description: product.desc || product.description || 'Calzado exclusivo Carfe® en cuero 100% legítimo con suela ergonómica.',
        is_active: true,
        updated_at: new Date().toISOString()
      };

      const numId = Number(product.id);
      // Si tiene ID real existente en Postgres (< 1000000000), actualizarlo
      if (numId && !isNaN(numId) && numId < 1000000000) {
        payload.id = numId;
        const { data, error } = await client
          .from('products')
          .upsert(payload, { onConflict: 'id' })
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Es un producto nuevo: insertar para que Postgres asigne el ID automáticamente con su secuencia
        const { data, error } = await client
          .from('products')
          .insert(payload)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    } catch(e) {
      console.warn('[CARFE Supabase] Error guardando producto:', e);
      return null;
    }
  },

  async deleteProduct(id) {
    const client = this.init();
    if (!client) return false;
    try {
      const numId = Number(id);
      if (!numId || isNaN(numId)) return false;
      const { error } = await client
        .from('products')
        .update({ is_active: false })
        .eq('id', numId);
      if (error) throw error;
      return true;
    } catch(e) {
      console.warn('[CARFE Supabase] Error eliminando producto:', e);
      return false;
    }
  },

  /* ───────── STORAGE: SUBIDA DE FOTOS Y VIDEOS ───────── */
  async uploadProductImage(file) {
    const client = this.init();
    if (!client || !file) return null;
    try {
      const ext = file.name ? file.name.split('.').pop() : 'jpg';
      const fileName = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
      const { data, error } = await client.storage
        .from('product-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: true });

      if (error) throw error;
      const { data: pubData } = client.storage.from('product-images').getPublicUrl(fileName);
      return pubData.publicUrl;
    } catch(e) {
      console.warn('[CARFE Supabase] Error subiendo imagen:', e);
      return null;
    }
  },

  async uploadHeroVideo(file) {
    const client = this.init();
    if (!client || !file) return null;
    try {
      const ext = file.name ? file.name.split('.').pop() : 'mp4';
      const fileName = `hero_${Date.now()}.${ext}`;
      const { data, error } = await client.storage
        .from('hero-videos')
        .upload(fileName, file, { cacheControl: '86400', upsert: true });

      if (error) throw error;
      const { data: pubData } = client.storage.from('hero-videos').getPublicUrl(fileName);
      return pubData.publicUrl;
    } catch(e) {
      console.warn('[CARFE Supabase] Error subiendo video:', e);
      return null;
    }
  },

  /* ───────── SUSCRIPCIÓN EN TIEMPO REAL ───────── */
  subscribeToProducts(callback) {
    const client = this.init();
    if (!client) return null;

    try {
      if (this.realtimeSubscription) {
        client.removeChannel(this.realtimeSubscription);
      }
      this.realtimeSubscription = client
        .channel('public:products')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, payload => {
          console.log('[CARFE Supabase Realtime] Cambio detectado en productos:', payload);
          if (typeof callback === 'function') callback(payload);
        })
        .subscribe();
      return this.realtimeSubscription;
    } catch(e) {
      console.warn('[CARFE Supabase] Error suscribiendo a realtime:', e);
      return null;
    }
  },

  /* ───────── SINCRONIZACIÓN MAESTRA COMPLETA ───────── */
  async syncLocalCatalogToSupabase(productsList) {
    const client = this.init();
    if (!client) return { ok: false, error: 'Supabase no está configurado.' };
    const list = productsList || (typeof PRODUCTS !== 'undefined' ? PRODUCTS : []);
    if (!list.length) return { ok: false, error: 'No hay productos para sincronizar.' };

    let count = 0;
    try {
      for (const p of list) {
        await this.upsertProduct(p);
        count++;
      }
      return { ok: true, count };
    } catch(e) {
      return { ok: false, error: e.message };
    }
  }
};

// Exportación global en navegador
window.CarfeSupabase = CarfeSupabase;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => CarfeSupabase.init());
} else {
  CarfeSupabase.init();
}
