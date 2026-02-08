import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";

// Variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Faltan variables de entorno de Supabase. Verifica tu archivo .env");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const FORMATS = [
  { value: "Foto", label: "Foto", icon: "📸" },
  { value: "Reels", label: "Reels", icon: "🎬" },
  { value: "Enlaces", label: "Enlaces", icon: "🔗" },
  { value: "Historias", label: "Historias", icon: "📱" }
];

// DATOS REALES DE ENERO 2026 (31 días completos)
const ENERO_DATA = [
  { id: "ene-01", day: 1, date: "2026-01-01", views: 0.76, revenue: 7.85, interactions: 12.8, followers: 167, espectadores: 0.44, visitas: 943, topic: "🚫 PROHIBIDO QUEJARSE", format: "Foto" },
  { id: "ene-02", day: 2, date: "2026-01-02", views: 0.78, revenue: 8.04, interactions: 13.1, followers: 225, espectadores: 0.46, visitas: 1365, topic: "CONTENIDO DÍA 2", format: "Foto" },
  { id: "ene-03", day: 3, date: "2026-01-03", views: 2.01, revenue: 20.83, interactions: 20.0, followers: 559, espectadores: 1.10, visitas: 2448, topic: "CONTENIDO DÍA 3", format: "Reels" },
  { id: "ene-04", day: 4, date: "2026-01-04", views: 0.78, revenue: 12.80, interactions: 10.1, followers: 182, espectadores: 0.47, visitas: 913, topic: "CONTENIDO DÍA 4", format: "Foto" },
  { id: "ene-05", day: 5, date: "2026-01-05", views: 13.07, revenue: 103.96, interactions: 131.3, followers: 3081, espectadores: 8.02, visitas: 11049, topic: "😭 SUSURRARON JESÚS", format: "Reels" },
  { id: "ene-06", day: 6, date: "2026-01-06", views: 6.24, revenue: 51.84, interactions: 81.2, followers: 1691, espectadores: 3.64, visitas: 6589, topic: "CONTENIDO DÍA 6", format: "Foto" },
  { id: "ene-07", day: 7, date: "2026-01-07", views: 5.30, revenue: 44.32, interactions: 59.2, followers: 1225, espectadores: 2.86, visitas: 5737, topic: "CONTENIDO DÍA 7", format: "Foto" },
  { id: "ene-08", day: 8, date: "2026-01-08", views: 6.86, revenue: 61.68, interactions: 70.1, followers: 1591, espectadores: 3.83, visitas: 8745, topic: "CONTENIDO DÍA 8", format: "Foto" },
  { id: "ene-09", day: 9, date: "2026-01-09", views: 4.32, revenue: 45.48, interactions: 62.1, followers: 1448, espectadores: 2.50, visitas: 5889, topic: "CONTENIDO DÍA 9", format: "Foto" },
  { id: "ene-10", day: 10, date: "2026-01-10", views: 5.30, revenue: 37.98, interactions: 59.7, followers: 971, espectadores: 2.78, visitas: 5094, topic: "CONTENIDO DÍA 10", format: "Foto" },
  { id: "ene-11", day: 11, date: "2026-01-11", views: 9.19, revenue: 84.27, interactions: 84.2, followers: 1969, espectadores: 5.42, visitas: 8543, topic: "🏟️ CALIFORNIA 50K", format: "Reels" },
  { id: "ene-12", day: 12, date: "2026-01-12", views: 3.22, revenue: 31.96, interactions: 33.3, followers: 737, espectadores: 1.82, visitas: 3375, topic: "CONTENIDO DÍA 12", format: "Foto" },
  { id: "ene-13", day: 13, date: "2026-01-13", views: 2.02, revenue: 22.29, interactions: 22.7, followers: 438, espectadores: 1.12, visitas: 2446, topic: "CONTENIDO DÍA 13", format: "Foto" },
  { id: "ene-14", day: 14, date: "2026-01-14", views: 2.06, revenue: 21.54, interactions: 34.6, followers: 453, espectadores: 1.15, visitas: 2290, topic: "CONTENIDO DÍA 14", format: "Foto" },
  { id: "ene-15", day: 15, date: "2026-01-15", views: 2.68, revenue: 23.74, interactions: 36.6, followers: 657, espectadores: 1.50, visitas: 2925, topic: "CONTENIDO DÍA 15", format: "Foto" },
  { id: "ene-16", day: 16, date: "2026-01-16", views: 0.93, revenue: 8.16, interactions: 12.3, followers: 178, espectadores: 0.49, visitas: 1511, topic: "CONTENIDO DÍA 16", format: "Foto" },
  { id: "ene-17", day: 17, date: "2026-01-17", views: 7.51, revenue: 60.45, interactions: 123.3, followers: 2193, espectadores: 4.63, visitas: 7144, topic: "CONTENIDO DÍA 17", format: "Reels" },
  { id: "ene-18", day: 18, date: "2026-01-18", views: 2.93, revenue: 25.13, interactions: 49.4, followers: 740, espectadores: 1.67, visitas: 3636, topic: "CONTENIDO DÍA 18", format: "Foto" },
  { id: "ene-19", day: 19, date: "2026-01-19", views: 4.59, revenue: 43.14, interactions: 82.3, followers: 1526, espectadores: 2.82, visitas: 6016, topic: "CONTENIDO DÍA 19", format: "Foto" },
  { id: "ene-20", day: 20, date: "2026-01-20", views: 4.53, revenue: 46.21, interactions: 79.8, followers: 1380, espectadores: 2.60, visitas: 5252, topic: "CONTENIDO DÍA 20", format: "Foto" },
  { id: "ene-21", day: 21, date: "2026-01-21", views: 2.13, revenue: 16.41, interactions: 33.2, followers: 465, espectadores: 1.20, visitas: 2442, topic: "CONTENIDO DÍA 21", format: "Foto" },
  { id: "ene-22", day: 22, date: "2026-01-22", views: 1.08, revenue: 9.99, interactions: 21.6, followers: 252, espectadores: 0.62, visitas: 1721, topic: "CONTENIDO DÍA 22", format: "Foto" },
  { id: "ene-23", day: 23, date: "2026-01-23", views: 1.09, revenue: 12.67, interactions: 25.4, followers: 301, espectadores: 0.67, visitas: 1509, topic: "CONTENIDO DÍA 23", format: "Foto" },
  { id: "ene-24", day: 24, date: "2026-01-24", views: 2.02, revenue: 21.03, interactions: 38.8, followers: 470, espectadores: 1.12, visitas: 2315, topic: "CONTENIDO DÍA 24", format: "Foto" },
  { id: "ene-25", day: 25, date: "2026-01-25", views: 8.32, revenue: 70.59, interactions: 74.7, followers: 1200, espectadores: 5.12, visitas: 7911, topic: "🩸 PAGAN CON SANGRE", format: "Reels" },
  { id: "ene-26", day: 26, date: "2026-01-26", views: 4.76, revenue: 41.61, interactions: 45.9, followers: 717, espectadores: 2.73, visitas: 5091, topic: "CONTENIDO DÍA 26", format: "Foto" },
  { id: "ene-27", day: 27, date: "2026-01-27", views: 3.05, revenue: 27.50, interactions: 29.7, followers: 424, espectadores: 1.70, visitas: 3188, topic: "CONTENIDO DÍA 27", format: "Foto" },
  { id: "ene-28", day: 28, date: "2026-01-28", views: 1.56, revenue: 14.83, interactions: 16.5, followers: 231, espectadores: 0.89, visitas: 1846, topic: "CONTENIDO DÍA 28", format: "Foto" },
  { id: "ene-29", day: 29, date: "2026-01-29", views: 1.19, revenue: 10.86, interactions: 13.0, followers: 215, espectadores: 0.66, visitas: 1982, topic: "CONTENIDO DÍA 29", format: "Foto" },
  { id: "ene-30", day: 30, date: "2026-01-30", views: 0.95, revenue: 11.47, interactions: 11.2, followers: 186, espectadores: 0.53, visitas: 1440, topic: "CONTENIDO DÍA 30", format: "Foto" },
  { id: "ene-31", day: 31, date: "2026-01-31", views: 1.83, revenue: 21.20, interactions: 32.4, followers: 257, espectadores: 1.10, visitas: 1759, topic: "🇺🇸 CALIFORNIA FE", format: "Foto" }
];

// Estadísticas agregadas de enero
const ENERO_STATS = {
  totalRevenue: 1019.82,
  totalViews: 113.06, // en millones
  totalInteractions: 1442.3, // en miles
  totalFollowers: 2193, // máximo alcanzado
  avgDailyRevenue: 32.90,
  bestDay: { day: 5, revenue: 103.96, topic: "😭 SUSURRARON JESÚS" },
  worstDay: { day: 1, revenue: 7.85, topic: "🚫 PROHIBIDO QUEJARSE" }
};

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingId, setEditingId] = useState(null);
  const [time, setTime] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para búsqueda por fecha
  const [searchDate, setSearchDate] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchMonth, setSearchMonth] = useState("febrero");

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    revenue: "",
    views: "",
    interactions: "",
    followers: "",
    format: "Foto",
    topic: ""
  });

  const [formErrors, setFormErrors] = useState({});

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: metrics, error: supabaseError } = await supabase
        .from("metrics")
        .select("*")
        .order('date', { ascending: false });
      
      if (supabaseError) throw supabaseError;
      
      setData(metrics || []);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError(`Error al cargar datos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    loadData(); 
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [loadData]);

  const validateForm = useCallback(() => {
    const errors = {};
    
    if (!formData.date || isNaN(new Date(formData.date).getTime())) {
      errors.date = "Fecha inválida";
    }
    
    const revenue = parseFloat(formData.revenue);
    if (isNaN(revenue) || revenue < 0) {
      errors.revenue = "Ingresa un número positivo";
    }
    
    const views = parseFloat(formData.views);
    if (isNaN(views) || views < 0) {
      errors.views = "Ingresa un número positivo";
    }
    
    if (!formData.topic.trim()) {
      errors.topic = "El titular es obligatorio";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const saveData = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError(null);

    const payload = {
      date: formData.date,
      revenue: parseFloat(formData.revenue),
      views: parseFloat(formData.views) * 1000000,
      interactions: (parseFloat(formData.interactions) || 0) * 1000,
      followers: parseFloat(formData.followers) || 0,
      format: formData.format,
      topic: formData.topic.toUpperCase().trim().slice(0, 100)
    };

    try {
      if (editingId) {
        const { error: updateError } = await supabase
          .from("metrics")
          .update(payload)
          .eq('id', editingId);
          
        if (updateError) throw updateError;
        setEditingId(null);
      } else {
        const { error: insertError } = await supabase
          .from("metrics")
          .insert([payload]);
          
        if (insertError) throw insertError;
      }
      
      setFormData({
        date: new Date().toISOString().split('T')[0],
        revenue: "",
        views: "",
        interactions: "",
        followers: "",
        format: "Foto",
        topic: ""
      });
      setFormErrors({});
      
      await loadData();
    } catch (err) {
      console.error("Error guardando:", err);
      setError(`Error al guardar: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      date: item.date,
      revenue: item.revenue?.toString() || "",
      views: item.views ? (item.views / 1000000).toString() : "",
      interactions: item.interactions ? (item.interactions / 1000).toString() : "",
      followers: item.followers?.toString() || "",
      format: item.format || "Foto",
      topic: item.topic || ""
    });
    setFormErrors({});
    setActiveTab("dashboard");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      revenue: "",
      views: "",
      interactions: "",
      followers: "",
      format: "Foto",
      topic: ""
    });
    setFormErrors({});
  };

  const deleteRow = async (id) => {
    if (!window.confirm("¿BORRAR REGISTRO? Esta acción no se puede deshacer.")) return;
    
    try {
      setError(null);
      const { error: deleteError } = await supabase
        .from("metrics")
        .delete()
        .eq('id', id);
        
      if (deleteError) throw deleteError;
      
      await loadData();
    } catch (err) {
      console.error("Error eliminando:", err);
      setError(`Error al eliminar: ${err.message}`);
    }
  };

  const handleSearch = useCallback(() => {
    if (!searchDate) {
      setSearchResults([]);
      return;
    }

    let results = [];
    
    if (searchMonth === "enero") {
      results = ENERO_DATA.filter(item => item.date === searchDate);
    } else {
      results = data.filter(item => item.date === searchDate);
    }
    
    setSearchResults(results);
  }, [searchDate, searchMonth, data]);

  useEffect(() => {
    setSearchResults([]);
    setSearchDate("");
  }, [searchMonth]);

  const { febData, totalRevenue, dailyTarget, progressPercent } = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const febPrefix = `${currentYear}-02-`;
    const filtered = data.filter(item => item.date?.startsWith(febPrefix));
    
    const total = filtered.reduce((sum, item) => sum + (parseFloat(item.revenue) || 0), 0);
    
    const today = new Date().getDate();
    const daysInFeb = (currentYear % 4 === 0 && currentYear % 100 !== 0) || (currentYear % 400 === 0) ? 29 : 28;
    const remainingDays = Math.max(daysInFeb - today, 1);
    const target = 1250;
    const daily = Math.max((target - total) / remainingDays, 0);
    
    return {
      febData: filtered,
      totalRevenue: total,
      dailyTarget: daily,
      progressPercent: Math.min((total / target) * 100, 100)
    };
  }, [data]);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 border-[8px] md:border-[15px] border-[#003566]">
      <header className="bg-[#003566] text-white p-4 shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase">
              IBIELE <span className="text-blue-400">INTEL</span>
            </h1>
            <p className="text-[8px] md:text-[10px] font-bold opacity-70 uppercase mt-1">
              {time.toLocaleTimeString()} • COMANDO CENTRAL
            </p>
          </div>
          
          <div className="w-full md:w-auto overflow-x-auto no-scrollbar flex justify-center">
            <div className="flex bg-white/5 p-1 rounded-xl">
              {["dashboard", "buscar", "historico"].map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)} 
                  className={`px-4 py-2 rounded-lg font-black text-[10px] uppercase transition ${
                    activeTab === tab 
                      ? "bg-white text-[#003566] shadow-lg" 
                      : "text-blue-200 hover:text-white"
                  }`}
                >
                  {tab === "buscar" ? "🔍 BUSCAR" : tab.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-[8px] md:text-[10px] font-black opacity-50 uppercase tracking-widest">
              Feb Revenue
            </p>
            <p className="text-xl md:text-3xl font-black text-green-400">
              ${totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-3 md:p-6 space-y-6">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded animate-pulse">
            <p className="font-bold">⚠️ Error del Sistema</p>
            <p className="text-sm">{error}</p>
            <button 
              onClick={() => setError(null)} 
              className="text-xs underline mt-2 hover:text-red-900"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="animate-in fade-in duration-500 space-y-6">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* ENERO: DATOS REALES COMPLETOS */}
               <div className="bg-slate-500 p-6 rounded-xl md:rounded-[40px] text-white border-b-8 border-slate-700 shadow-xl opacity-90">
                  <h2 className="text-sm font-black uppercase opacity-60 mb-2 italic">Enero 2026 - Archivo Completo</h2>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-4xl font-black italic">${ENERO_STATS.totalRevenue.toFixed(2)}</p>
                      <p className="text-[8px] font-bold uppercase tracking-widest">31 días • {ENERO_STATS.totalViews}M views</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black bg-white/10 px-3 py-1 rounded-full mb-1">PROM: ${ENERO_STATS.avgDailyRevenue}/día</p>
                      <p className="text-[8px] opacity-70">Mejor: Día {ENERO_STATS.bestDay.day} (${ENERO_STATS.bestDay.revenue})</p>
                    </div>
                  </div>
               </div>
               
               {/* FEBRERO: AZUL IMPERIAL VIVO */}
               <div className="bg-[#003566] p-6 rounded-xl md:rounded-[40px] text-white border-b-8 border-blue-900 shadow-xl relative overflow-hidden">
                  <div 
                    className="absolute bottom-0 left-0 h-1 bg-green-400 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                  <h2 className="text-sm font-black uppercase opacity-60 mb-2 italic">Febrero Actual</h2>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-4xl font-black italic text-blue-400">${totalRevenue.toFixed(2)}</p>
                      <p className="text-[8px] font-bold uppercase tracking-widest">
                        Progreso Meta $1,250 ({progressPercent.toFixed(1)}%)
                      </p>
                    </div>
                    <div className="text-[10px] font-black bg-blue-500 px-3 py-1 rounded-full animate-pulse tracking-tighter">
                      OPERATIVO
                    </div>
                  </div>
                  <p className="text-[10px] mt-2 opacity-80">
                    Meta diaria restante: ${dailyTarget.toFixed(2)}
                  </p>
               </div>
            </section>

            {/* FORMULARIO */}
            <section className={`p-4 md:p-8 rounded-xl md:rounded-[40px] shadow-xl border-4 transition-colors ${
              editingId ? 'bg-blue-50 border-blue-500' : 'bg-white border-slate-300'
            }`}>
              <div className="flex justify-between items-center mb-4 border-b-2 pb-2">
                <h3 className="text-xs font-black text-[#003566] uppercase italic">
                  {editingId ? "⚡ EDITANDO REGISTRO" : "📝 NUEVO REGISTRO"}
                </h3>
                {editingId && (
                  <button 
                    onClick={handleCancelEdit}
                    className="text-[10px] text-red-500 hover:text-red-700 font-bold uppercase px-3 py-1 bg-red-50 rounded-lg"
                  >
                    ✕ Cancelar Edición
                  </button>
                )}
              </div>
              
              <form onSubmit={saveData} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Fecha</label>
                  <input 
                    type="date" 
                    value={formData.date} 
                    onChange={e => setFormData({...formData, date: e.target.value})} 
                    className={`w-full p-2 md:p-4 rounded-xl border-2 font-bold ${
                      formErrors.date ? 'border-red-500 bg-red-50' : 'border-slate-200'
                    }`}
                    required
                  />
                  {formErrors.date && <p className="text-[10px] text-red-500 font-bold">{formErrors.date}</p>}
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Vistas (Millones)</label>
                  <input 
                    placeholder="Ej: 1.5" 
                    type="number" 
                    step="0.01" 
                    min="0"
                    value={formData.views} 
                    onChange={e => setFormData({...formData, views: e.target.value})} 
                    className={`w-full p-2 md:p-4 rounded-xl border-2 font-bold ${
                      formErrors.views ? 'border-red-500 bg-red-50' : 'border-slate-200'
                    }`}
                    required
                  />
                  {formErrors.views && <p className="text-[10px] text-red-500 font-bold">{formErrors.views}</p>}
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Revenue ($)</label>
                  <input 
                    placeholder="Ej: 50.00" 
                    type="number" 
                    step="0.01" 
                    min="0"
                    value={formData.revenue} 
                    onChange={e => setFormData({...formData, revenue: e.target.value})} 
                    className={`w-full p-2 md:p-4 rounded-xl border-2 font-black text-green-700 bg-green-50 ${
                      formErrors.revenue ? 'border-red-500' : 'border-slate-200'
                    }`}
                    required
                  />
                  {formErrors.revenue && <p className="text-[10px] text-red-500 font-bold">{formErrors.revenue}</p>}
                </div>
                
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Titular / Topic</label>
                  <input 
                    placeholder="TITULAR LLAMATIVO" 
                    value={formData.topic} 
                    onChange={e => setFormData({...formData, topic: e.target.value})} 
                    className={`w-full p-2 md:p-4 rounded-xl border-2 font-bold uppercase ${
                      formErrors.topic ? 'border-red-500 bg-red-50' : 'border-slate-200'
                    }`}
                    maxLength={100}
                    required
                  />
                  {formErrors.topic && <p className="text-[10px] text-red-500 font-bold">{formErrors.topic}</p>}
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Formato</label>
                  <select 
                    value={formData.format} 
                    onChange={e => setFormData({...formData, format: e.target.value})} 
                    className="w-full p-2 md:p-4 rounded-xl border-2 font-bold border-slate-200"
                  >
                    {FORMATS.map(f => (
                      <option key={f.value} value={f.value}>{f.icon} {f.label}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-3 grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Interacciones (Miles)</label>
                    <input 
                      placeholder="Opcional" 
                      type="number" 
                      step="0.1" 
                      min="0"
                      value={formData.interactions} 
                      onChange={e => setFormData({...formData, interactions: e.target.value})} 
                      className="w-full p-2 md:p-4 rounded-xl border-2 font-bold border-slate-200"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Followers</label>
                    <input 
                      placeholder="Opcional" 
                      type="number" 
                      min="0"
                      value={formData.followers} 
                      onChange={e => setFormData({...formData, followers: e.target.value})} 
                      className="w-full p-2 md:p-4 rounded-xl border-2 font-bold border-slate-200"
                    />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="md:col-span-3 bg-[#003566] text-white p-3 md:p-5 rounded-xl md:rounded-[35px] font-black text-base md:text-xl shadow-xl italic uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-800 transition-colors"
                >
                  {isSubmitting ? "SINCRONIZANDO..." : editingId ? "💾 ACTUALIZAR REGISTRO" : "🚀 SINCRONIZAR IMPERIO"}
                </button>
              </form>
            </section>

            {/* BITÁCORA FEBRERO */}
            <section className="bg-white rounded-xl md:rounded-[40px] p-4 md:p-8 border-2 border-slate-300 shadow-xl overflow-x-auto no-scrollbar">
              <h2 className="text-xl md:text-3xl font-black text-[#003566] uppercase italic mb-4">
                Operaciones Febrero {loading && <span className="text-sm animate-pulse">(Cargando...)</span>}
              </h2>
              
              {febData.length === 0 && !loading ? (
                <p className="text-center text-slate-400 font-bold py-8">No hay registros para febrero</p>
              ) : (
                <div className="min-w-[500px] space-y-2">
                  {febData.map(item => (
                    <div 
                      key={item.id} 
                      className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:bg-blue-50 transition-colors group"
                    >
                      <div className="flex-1 cursor-pointer" onClick={() => handleEdit(item)}>
                        <p className="font-black text-[#003566] text-sm uppercase truncate pr-4">
                          {item.topic || "SIN TÍTULO"}
                        </p>
                        <p className="text-[8px] font-bold text-slate-400">
                          {(item.date || "").split("-").reverse().slice(0,2).join("/")} • {((item.views || 0)/1000000).toFixed(2)}M VISTAS • {item.format}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-black text-green-600 text-xl md:text-3xl">
                          ${Number(item.revenue || 0).toFixed(2)}
                        </p>
                        <button 
                          onClick={() => handleEdit(item)}
                          className="text-blue-400 hover:text-blue-600 text-lg p-2 hover:bg-blue-100 rounded-full transition-colors"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => deleteRow(item.id)} 
                          className="text-red-300 hover:text-red-600 text-lg p-2 hover:bg-red-50 rounded-full transition-colors"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* BUSCADOR POR FECHA */}
        {activeTab === "buscar" && (
          <div className="animate-in fade-in duration-500 space-y-6">
            <section className="bg-white p-6 md:p-8 rounded-xl md:rounded-[40px] border-2 border-slate-300 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-black text-[#003566] uppercase italic mb-6">
                🔍 Consulta por Fecha
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Mes</label>
                  <select 
                    value={searchMonth} 
                    onChange={e => setSearchMonth(e.target.value)}
                    className="w-full p-3 rounded-xl border-2 font-bold border-slate-200"
                  >
                    <option value="febrero">📅 Febrero 2026 (Activo)</option>
                    <option value="enero">📅 Enero 2026 (31 días)</option>
                  </select>
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Fecha específica</label>
                  <input 
                    type="date" 
                    value={searchDate} 
                    onChange={e => setSearchDate(e.target.value)}
                    className="w-full p-3 rounded-xl border-2 font-bold border-slate-200"
                  />
                </div>
                
                <div className="flex items-end">
                  <button 
                    onClick={handleSearch}
                    disabled={!searchDate}
                    className="w-full bg-[#003566] text-white p-3 rounded-xl font-black uppercase disabled:opacity-50 hover:bg-blue-800 transition-colors"
                  >
                    Buscar
                  </button>
                </div>
              </div>

              {/* Resultados de búsqueda */}
              {searchResults.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-slate-500 uppercase mb-3">
                    Resultados encontrados ({searchResults.length})
                  </h3>
                  {searchResults.map(item => (
                    <div 
                      key={item.id} 
                      className={`p-4 rounded-2xl border-2 ${
                        searchMonth === "enero" 
                          ? "bg-slate-100 border-slate-300" 
                          : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-black text-[#003566] text-lg uppercase mb-2">
                            {item.topic}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] font-bold text-slate-600">
                            <span className="bg-white px-2 py-1 rounded">📅 {item.date}</span>
                            <span className="bg-white px-2 py-1 rounded">👁️ {item.views}M views</span>
                            <span className="bg-white px-2 py-1 rounded">💰 ${item.revenue}</span>
                            <span className="bg-white px-2 py-1 rounded">📝 {item.format}</span>
                            {item.interactions && <span className="bg-white px-2 py-1 rounded">👍 {item.interactions}K interac.</span>}
                            {item.followers && <span className="bg-white px-2 py-1 rounded">👥 {item.followers} followers</span>}
                            {item.espectadores && <span className="bg-white px-2 py-1 rounded">📺 {item.espectadores}M espect.</span>}
                            {item.visitas && <span className="bg-white px-2 py-1 rounded">🏠 {item.visitas} visitas</span>}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-3xl font-black text-green-600">
                            ${Number(item.revenue).toFixed(2)}
                          </p>
                          {searchMonth === "febrero" && (
                            <button 
                              onClick={() => handleEdit(item)}
                              className="mt-2 text-xs bg-blue-500 text-white px-3 py-1 rounded-lg font-bold uppercase hover:bg-blue-600"
                            >
                              ✏️ Editar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchDate ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300">
                  <p className="text-4xl mb-2">🔍</p>
                  <p className="font-black text-slate-400 uppercase">No hay publicaciones para esta fecha</p>
                  <p className="text-xs text-slate-400 mt-1">{searchDate}</p>
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300">
                  <p className="text-4xl mb-2">📅</p>
                  <p className="font-black text-slate-400 uppercase">Selecciona una fecha para buscar</p>
                </div>
              )}
            </section>

            {/* Calendario visual rápido */}
            <section className="bg-white p-6 rounded-xl md:rounded-[40px] border-2 border-slate-300 shadow-xl">
              <h3 className="text-lg font-black text-[#003566] uppercase italic mb-4">
                📊 Fechas con publicaciones - {searchMonth === "enero" ? "Enero" : "Febrero"} 2026
              </h3>
              <div className="flex flex-wrap gap-2">
                {(searchMonth === "enero" ? ENERO_DATA : febData).map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSearchDate(item.date);
                      setSearchResults([item]);
                    }}
                    className={`px-3 py-2 rounded-xl font-bold text-xs uppercase transition ${
                      searchDate === item.date
                        ? "bg-[#003566] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-blue-100"
                    }`}
                  >
                    {item.date.split("-")[2]}/{item.date.split("-")[1]}
                    <span className="block text-[8px] opacity-70">${item.revenue}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* HISTÓRICO ENERO - DATOS COMPLETOS */}
        {activeTab === "historico" && (
          <div className="space-y-6">
            {/* Resumen de enero */}
            <section className="bg-slate-500 p-6 rounded-xl md:rounded-[40px] text-white border-b-8 border-slate-700 shadow-xl">
              <h2 className="text-2xl font-black uppercase italic mb-4">Resumen Enero 2026</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 p-4 rounded-xl">
                  <p className="text-[10px] uppercase opacity-70">Total Ingresos</p>
                  <p className="text-2xl font-black">${ENERO_STATS.totalRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-white/10 p-4 rounded-xl">
                  <p className="text-[10px] uppercase opacity-70">Visualizaciones</p>
                  <p className="text-2xl font-black">{ENERO_STATS.totalViews}M</p>
                </div>
                <div className="bg-white/10 p-4 rounded-xl">
                  <p className="text-[10px] uppercase opacity-70">Promedio Diario</p>
                  <p className="text-2xl font-black">${ENERO_STATS.avgDailyRevenue}</p>
                </div>
                <div className="bg-white/10 p-4 rounded-xl">
                  <p className="text-[10px] uppercase opacity-70">Mejor Día</p>
                  <p className="text-2xl font-black">Día {ENERO_STATS.bestDay.day}</p>
                  <p className="text-[10px]">${ENERO_STATS.bestDay.revenue}</p>
                </div>
              </div>
            </section>

            {/* Tabla completa de enero */}
            <section className="bg-white rounded-xl md:rounded-[40px] p-4 md:p-8 border-2 border-slate-300 overflow-x-auto">
              <h2 className="text-xl md:text-2xl font-black text-slate-400 uppercase italic mb-6">
                Archivo Completo - Enero 2026 (31 días)
              </h2>
              <table className="w-full text-left min-w-[600px]">
                <thead className="bg-slate-100 text-[10px] font-black uppercase text-slate-500">
                  <tr>
                    <th className="p-3">Día</th>
                    <th className="p-3">Fecha</th>
                    <th className="p-3">Titular</th>
                    <th className="p-3 text-right">Views</th>
                    <th className="p-3 text-right">Caja</th>
                    <th className="p-3 text-right">Interac.</th>
                    <th className="p-3 text-right">Followers</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2">
                  {ENERO_DATA.map(i => (
                    <tr key={i.id} className="grayscale opacity-70 hover:opacity-100 transition-opacity">
                      <td className="p-3 font-bold">{i.day}</td>
                      <td className="p-3 text-xs">{i.date}</td>
                      <td className="p-3 font-black uppercase text-xs max-w-[200px] truncate">{i.topic}</td>
                      <td className="p-3 text-right font-bold">{i.views}M</td>
                      <td className="p-3 text-right font-black text-green-600">${i.revenue.toFixed(2)}</td>
                      <td className="p-3 text-right text-xs">{i.interactions}K</td>
                      <td className="p-3 text-right text-xs">{i.followers}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-200 font-black text-xs uppercase">
                  <tr>
                    <td className="p-3" colSpan="4">TOTAL ENERO</td>
                    <td className="p-3 text-right text-green-700 text-lg">
                      ${ENERO_STATS.totalRevenue.toFixed(2)}
                    </td>
                    <td className="p-3 text-right">{ENERO_STATS.totalInteractions}K</td>
                    <td className="p-3 text-right">Max: {ENERO_STATS.totalFollowers}</td>
                  </tr>
                </tfoot>
              </table>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}