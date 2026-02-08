import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Faltan variables de entorno de Supabase");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const FORMATS = [
  { value: "Foto", label: "Foto", icon: "📸" },
  { value: "Reels", label: "Reels", icon: "🎬" },
  { value: "Enlaces", label: "Enlaces", icon: "🔗" },
  { value: "Historias", label: "Historias", icon: "📱" }
];

const VIEW_UNITS = [
  { value: 1, label: "Unidades", suffix: "", multiplier: 1 },
  { value: 1000, label: "Miles (K)", suffix: "K", multiplier: 1000 },
  { value: 1000000, label: "Millones (M)", suffix: "M", multiplier: 1000000 }
];

// DATOS REALES DE ENERO 2026
const ENERO_DATA = [
  { id: "ene-01", day: 1, date: "2026-01-01", views: 0.76, revenue: 7.85, interactions: 12.8, followers: 167, topic: "🚫 PROHIBIDO QUEJARSE", format: "Foto" },
  { id: "ene-02", day: 2, date: "2026-01-02", views: 0.78, revenue: 8.04, interactions: 13.1, followers: 225, topic: "CONTENIDO DÍA 2", format: "Foto" },
  { id: "ene-03", day: 3, date: "2026-01-03", views: 2.01, revenue: 20.83, interactions: 20.0, followers: 559, topic: "CONTENIDO DÍA 3", format: "Reels" },
  { id: "ene-04", day: 4, date: "2026-01-04", views: 0.78, revenue: 12.80, interactions: 10.1, followers: 182, topic: "CONTENIDO DÍA 4", format: "Foto" },
  { id: "ene-05", day: 5, date: "2026-01-05", views: 13.07, revenue: 103.96, interactions: 131.3, followers: 3081, topic: "😭 SUSURRARON JESÚS", format: "Reels" },
  { id: "ene-06", day: 6, date: "2026-01-06", views: 6.24, revenue: 51.84, interactions: 81.2, followers: 1691, topic: "CONTENIDO DÍA 6", format: "Foto" },
  { id: "ene-07", day: 7, date: "2026-01-07", views: 5.30, revenue: 44.32, interactions: 59.2, followers: 1225, topic: "CONTENIDO DÍA 7", format: "Foto" },
  { id: "ene-08", day: 8, date: "2026-01-08", views: 6.86, revenue: 61.68, interactions: 70.1, followers: 1591, topic: "CONTENIDO DÍA 8", format: "Foto" },
  { id: "ene-09", day: 9, date: "2026-01-09", views: 4.32, revenue: 45.48, interactions: 62.1, followers: 1448, topic: "CONTENIDO DÍA 9", format: "Foto" },
  { id: "ene-10", day: 10, date: "2026-01-10", views: 5.30, revenue: 37.98, interactions: 59.7, followers: 971, topic: "CONTENIDO DÍA 10", format: "Foto" },
  { id: "ene-11", day: 11, date: "2026-01-11", views: 9.19, revenue: 84.27, interactions: 84.2, followers: 1969, topic: "🏟️ CALIFORNIA 50K", format: "Reels" },
  { id: "ene-12", day: 12, date: "2026-01-12", views: 3.22, revenue: 31.96, interactions: 33.3, followers: 737, topic: "CONTENIDO DÍA 12", format: "Foto" },
  { id: "ene-13", day: 13, date: "2026-01-13", views: 2.02, revenue: 22.29, interactions: 22.7, followers: 438, topic: "CONTENIDO DÍA 13", format: "Foto" },
  { id: "ene-14", day: 14, date: "2026-01-14", views: 2.06, revenue: 21.54, interactions: 34.6, followers: 453, topic: "CONTENIDO DÍA 14", format: "Foto" },
  { id: "ene-15", day: 15, date: "2026-01-15", views: 2.68, revenue: 23.74, interactions: 36.6, followers: 657, topic: "CONTENIDO DÍA 15", format: "Foto" },
  { id: "ene-16", day: 16, date: "2026-01-16", views: 0.93, revenue: 8.16, interactions: 12.3, followers: 178, topic: "CONTENIDO DÍA 16", format: "Foto" },
  { id: "ene-17", day: 17, date: "2026-01-17", views: 7.51, revenue: 60.45, interactions: 123.3, followers: 2193, topic: "CONTENIDO DÍA 17", format: "Reels" },
  { id: "ene-18", day: 18, date: "2026-01-18", views: 2.93, revenue: 25.13, interactions: 49.4, followers: 740, topic: "CONTENIDO DÍA 18", format: "Foto" },
  { id: "ene-19", day: 19, date: "2026-01-19", views: 4.59, revenue: 43.14, interactions: 82.3, followers: 1526, topic: "CONTENIDO DÍA 19", format: "Foto" },
  { id: "ene-20", day: 20, date: "2026-01-20", views: 4.53, revenue: 46.21, interactions: 79.8, followers: 1380, topic: "CONTENIDO DÍA 20", format: "Foto" },
  { id: "ene-21", day: 21, date: "2026-01-21", views: 2.13, revenue: 16.41, interactions: 33.2, followers: 465, topic: "CONTENIDO DÍA 21", format: "Foto" },
  { id: "ene-22", day: 22, date: "2026-01-22", views: 1.08, revenue: 9.99, interactions: 21.6, followers: 252, topic: "CONTENIDO DÍA 22", format: "Foto" },
  { id: "ene-23", day: 23, date: "2026-01-23", views: 1.09, revenue: 12.67, interactions: 25.4, followers: 301, topic: "CONTENIDO DÍA 23", format: "Foto" },
  { id: "ene-24", day: 24, date: "2026-01-24", views: 2.02, revenue: 21.03, interactions: 38.8, followers: 470, topic: "CONTENIDO DÍA 24", format: "Foto" },
  { id: "ene-25", day: 25, date: "2026-01-25", views: 8.32, revenue: 70.59, interactions: 74.7, followers: 1200, topic: "🩸 PAGAN CON SANGRE", format: "Reels" },
  { id: "ene-26", day: 26, date: "2026-01-26", views: 4.76, revenue: 41.61, interactions: 45.9, followers: 717, topic: "CONTENIDO DÍA 26", format: "Foto" },
  { id: "ene-27", day: 27, date: "2026-01-27", views: 3.05, revenue: 27.50, interactions: 29.7, followers: 424, topic: "CONTENIDO DÍA 27", format: "Foto" },
  { id: "ene-28", day: 28, date: "2026-01-28", views: 1.56, revenue: 14.83, interactions: 16.5, followers: 231, topic: "CONTENIDO DÍA 28", format: "Foto" },
  { id: "ene-29", day: 29, date: "2026-01-29", views: 1.19, revenue: 10.86, interactions: 13.0, followers: 215, topic: "CONTENIDO DÍA 29", format: "Foto" },
  { id: "ene-30", day: 30, date: "2026-01-30", views: 0.95, revenue: 11.47, interactions: 11.2, followers: 186, topic: "CONTENIDO DÍA 30", format: "Foto" },
  { id: "ene-31", day: 31, date: "2026-01-31", views: 1.83, revenue: 21.20, interactions: 32.4, followers: 257, topic: "🇺🇸 CALIFORNIA FE", format: "Foto" }
];

const ENERO_STATS = {
  totalRevenue: 1019.82,
  totalViews: 113.06,
  totalInteractions: 1442.3,
  totalFollowers: 2193,
  avgDailyRevenue: 32.90,
  avgDailyViews: 3.65,
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

  const [searchDate, setSearchDate] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchMonth, setSearchMonth] = useState("febrero");

  const [viewUnit, setViewUnit] = useState(1000000);
  const [viewInput, setViewInput] = useState("");

  const [formData, setFormData] = useState({
    date: "2026-02-07", // Fecha corregida: 7 de febrero
    revenue: "",
    views: "",
    interactions: "",
    followers: "",
    format: "Foto",
    topic: ""
  });

  const [formErrors, setFormErrors] = useState({});

  // FECHA CORREGIDA: Hoy es 07 de febrero de 2026
  const TODAY_DATE = "2026-02-07";
  const currentDay = 7;
  const currentMonth = 2;
  const currentYear = 2026;

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

  const convertToBase = (value, unit) => {
    const num = parseFloat(value) || 0;
    return num * unit;
  };

  const validateForm = useCallback(() => {
    const errors = {};
    if (!formData.date || isNaN(new Date(formData.date).getTime())) {
      errors.date = "Fecha inválida";
    }
    const revenue = parseFloat(formData.revenue);
    if (isNaN(revenue) || revenue < 0) {
      errors.revenue = "Ingresa un número positivo";
    }
    const views = parseFloat(viewInput);
    if (isNaN(views) || views < 0) {
      errors.views = "Ingresa un número positivo";
    }
    if (!formData.topic.trim()) {
      errors.topic = "El titular es obligatorio";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, viewInput]);

  const saveData = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setError(null);

    const viewsInBase = convertToBase(viewInput, viewUnit);

    const payload = {
      date: formData.date,
      revenue: parseFloat(formData.revenue),
      views: viewsInBase,
      interactions: (parseFloat(formData.interactions) || 0) * 1000,
      followers: parseFloat(formData.followers) || 0,
      format: formData.format,
      topic: formData.topic.toUpperCase().trim().slice(0, 100)
    };

    try {
      if (editingId) {
        const { error: updateError } = await supabase.from("metrics").update(payload).eq('id', editingId);
        if (updateError) throw updateError;
        setEditingId(null);
      } else {
        const { error: insertError } = await supabase.from("metrics").insert([payload]);
        if (insertError) throw insertError;
      }
      
      setFormData({
        date: "2026-02-07",
        revenue: "",
        views: "",
        interactions: "",
        followers: "",
        format: "Foto",
        topic: ""
      });
      setViewInput("");
      setViewUnit(1000000);
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
    const views = item.views || 0;
    let bestUnit = 1000000;
    let displayValue = views / 1000000;
    
    if (views < 1000) {
      bestUnit = 1;
      displayValue = views;
    } else if (views < 1000000) {
      bestUnit = 1000;
      displayValue = views / 1000;
    }
    
    setViewUnit(bestUnit);
    setViewInput(displayValue.toString());
    
    setFormData({
      date: item.date,
      revenue: item.revenue?.toString() || "",
      views: views.toString(),
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
      date: "2026-02-07",
      revenue: "",
      views: "",
      interactions: "",
      followers: "",
      format: "Foto",
      topic: ""
    });
    setViewInput("");
    setViewUnit(1000000);
    setFormErrors({});
  };

  const deleteRow = async (id) => {
    if (!window.confirm("¿BORRAR REGISTRO?")) return;
    try {
      setError(null);
      const { error: deleteError } = await supabase.from("metrics").delete().eq('id', id);
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

  // Cálculos memoizados
  const { 
    febData, 
    totalRevenue, 
    dailyTarget, 
    progressPercent,
    todayFebData,
    todayFebTotal,
    comparisonStats 
  } = useMemo(() => {
    const febPrefix = `${currentYear}-02-`;
    const filtered = data.filter(item => item.date?.startsWith(febPrefix));
    
    const total = filtered.reduce((sum, item) => sum + (parseFloat(item.revenue) || 0), 0);
    const totalViews = filtered.reduce((sum, item) => sum + (parseFloat(item.views) || 0), 0);
    
    // Buscar TODAS las publicaciones del día 7 de febrero
    const todayData = filtered.filter(item => {
      const itemDay = new Date(item.date).getDate();
      return itemDay === 7;
    });
    
    // Sumar totales del día de hoy
    const todayTotal = todayData.reduce((sum, item) => sum + (parseFloat(item.revenue) || 0), 0);
    
    // Comparativa con enero día 7
    const eneroSameDay = ENERO_DATA.find(item => item.day === 7);
    
    const daysInFeb = 28;
    const remainingDays = Math.max(daysInFeb - currentDay, 1);
    const target = 1250;
    const daily = Math.max((target - total) / remainingDays, 0);
    
    const dailyAvgSoFar = currentDay > 1 ? total / (currentDay - 1) : total;
    const projectedTotal = total + (dailyAvgSoFar * remainingDays);
    
    const eneroAvg = ENERO_STATS.avgDailyRevenue;
    const febAvg = currentDay > 1 ? total / (currentDay - 1) : 0;
    
    return {
      febData: filtered,
      totalRevenue: total,
      totalViews: totalViews,
      dailyTarget: daily,
      progressPercent: Math.min((total / target) * 100, 100),
      todayFebData: todayData, // Array de publicaciones de hoy
      todayFebTotal: todayTotal, // Total revenue de hoy
      comparisonStats: {
        eneroSameDay,
        projectedTotal,
        vsEneroDay: todayTotal - (eneroSameDay?.revenue || 0),
        vsEneroAvg: febAvg - eneroAvg,
        vsEneroPercent: eneroAvg > 0 ? ((febAvg - eneroAvg) / eneroAvg) * 100 : 0
      }
    };
  }, [data, currentDay, currentYear]);

  const formatViews = (views) => {
    if (!views) return "0";
    if (views >= 1000000) return `${(views / 1000000).toFixed(2)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  // Encontrar datos de enero para "Un día como hoy" - DÍA 7
  const onThisDayJanuary = ENERO_DATA.find(item => item.day === 7);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 border-[8px] md:border-[15px] border-[#003566]">
      <header className="bg-[#003566] text-white p-4 shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase">
              IBIELE <span className="text-blue-400">INTEL</span>
            </h1>
            <p className="text-[8px] md:text-[10px] font-bold opacity-70 uppercase mt-1">
              {time.toLocaleTimeString()} • 07/02/2026 • VIERNES
            </p>
          </div>
          
          <div className="w-full md:w-auto overflow-x-auto no-scrollbar flex justify-center">
            <div className="flex bg-white/5 p-1 rounded-xl">
              {["dashboard", "intel", "buscar", "historico"].map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)} 
                  className={`px-4 py-2 rounded-lg font-black text-[10px] uppercase transition ${
                    activeTab === tab 
                      ? "bg-white text-[#003566] shadow-lg" 
                      : "text-blue-200 hover:text-white"
                  }`}
                >
                  {tab === "intel" ? "🧠 INTEL" : tab === "buscar" ? "🔍 BUSCAR" : tab.toUpperCase()}
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
            <button onClick={() => setError(null)} className="text-xs underline mt-2">Cerrar</button>
          </div>
        )}

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="animate-in fade-in duration-500 space-y-6">
            
            {/* SECCIÓN: UN DÍA COMO HOY - DISEÑO ELEGANTE */}
            {onThisDayJanuary && (
              <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* NUEVO DISEÑO: Un día como hoy - Elegante, sobrio */}
                <div className="bg-white p-6 rounded-xl md:rounded-[40px] border-2 border-slate-200 shadow-xl relative overflow-hidden">
                  {/* Línea decorativa sutil arriba */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#003566]" />
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        📅 Un día como hoy
                      </p>
                      <h2 className="text-lg font-black text-[#003566] uppercase italic">
                        7 de Enero 2026
                      </h2>
                    </div>
                    <div className="bg-slate-100 px-3 py-1 rounded-full">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Histórico</span>
                    </div>
                  </div>

                  <p className="text-xl font-black text-slate-800 uppercase mb-4 truncate">
                    {onThisDayJanuary.topic}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-slate-50 p-3 rounded-xl text-center border border-slate-100">
                      <p className="text-xl font-black text-[#003566]">${onThisDayJanuary.revenue}</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Revenue</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl text-center border border-slate-100">
                      <p className="text-xl font-black text-[#003566]">{onThisDayJanuary.views}M</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Views</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl text-center border border-slate-100">
                      <p className="text-xl font-black text-[#003566]">{onThisDayJanuary.interactions}K</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Interac.</p>
                    </div>
                  </div>

                  {/* Estado de hoy - Diseño limpio y elegante */}
                  {todayFebData && todayFebData.length > 0 ? (
                    <div className={`p-4 rounded-xl border-2 ${
                      todayFebTotal >= onThisDayJanuary.revenue 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-blue-50 border-blue-200'
                    }`}>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs font-black uppercase text-slate-600">
                          📊 Hoy llevas ({todayFebData.length} publicaciones)
                        </p>
                        <span className={`text-xs font-black px-2 py-1 rounded-full ${
                          todayFebTotal >= onThisDayJanuary.revenue 
                            ? 'bg-green-500 text-white' 
                            : 'bg-blue-500 text-white'
                        }`}>
                          {todayFebTotal >= onThisDayJanuary.revenue ? '✓ SUPERADO' : 'EN PROGRESO'}
                        </span>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-3xl font-black text-slate-800">${todayFebTotal.toFixed(2)}</p>
                          <p className="text-[10px] text-slate-500 mt-1">
                            vs ${onThisDayJanuary.revenue} del 7 de enero
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${todayFebTotal >= onThisDayJanuary.revenue ? 'text-green-600' : 'text-blue-600'}`}>
                            {todayFebTotal >= onThisDayJanuary.revenue ? '+' : ''}${(todayFebTotal - onThisDayJanuary.revenue).toFixed(2)}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {((todayFebTotal / onThisDayJanuary.revenue) * 100).toFixed(0)}% del histórico
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <p className="text-sm font-bold text-slate-600 mb-1">📝 Sin publicaciones hoy</p>
                      <p className="text-[10px] text-slate-400">Meta: Superar ${onThisDayJanuary.revenue}</p>
                    </div>
                  )}
                </div>

                {/* Tu ritmo vs Enero - Azul imperial */}
                <div className="bg-[#003566] p-6 rounded-xl md:rounded-[40px] text-white border-b-8 border-blue-900 shadow-xl">
                  <h2 className="text-sm font-black uppercase opacity-60 mb-2 italic">
                    🎯 Tu Ritmo vs Enero
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-white/10 p-3 rounded-xl">
                      <span className="text-xs uppercase opacity-70">Promedio diario Feb</span>
                      <span className="text-2xl font-black">${(totalRevenue / Math.max(currentDay - 1, 1)).toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center bg-white/10 p-3 rounded-xl">
                      <span className="text-xs uppercase opacity-70">Promedio diario Ene</span>
                      <span className="text-2xl font-black text-blue-300">${ENERO_STATS.avgDailyRevenue}</span>
                    </div>

                    <div className={`p-4 rounded-xl text-center border-2 ${comparisonStats.vsEneroPercent >= 0 ? 'bg-green-500/20 border-green-400' : 'bg-red-500/20 border-red-400'}`}>
                      <p className="text-xs uppercase opacity-70 mb-1">Diferencia</p>
                      <p className="text-3xl font-black">
                        {comparisonStats.vsEneroPercent >= 0 ? '+' : ''}{comparisonStats.vsEneroPercent.toFixed(1)}%
                      </p>
                      <p className="text-[10px] mt-1 opacity-80">
                        {comparisonStats.vsEneroPercent >= 0 ? '🚀 Vas mejor que enero' : '📉 Necesitas acelerar'}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* PROYECCIONES */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#003566] p-6 rounded-xl md:rounded-[40px] text-white border-b-8 border-blue-900 shadow-xl">
                <h3 className="text-[10px] font-black uppercase opacity-60 mb-2">Proyección Febrero</h3>
                <p className="text-4xl font-black italic text-blue-400">${comparisonStats.projectedTotal.toFixed(2)}</p>
                <p className="text-[8px] uppercase opacity-70 mt-1">Si mantienes este ritmo</p>
              </div>
              
              <div className="bg-slate-500 p-6 rounded-xl md:rounded-[40px] text-white border-b-8 border-slate-700 shadow-xl opacity-90">
                <h3 className="text-[10px] font-black uppercase opacity-60 mb-2">Meta igualar Enero</h3>
                <p className="text-4xl font-black italic">${ENERO_STATS.totalRevenue.toFixed(2)}</p>
                <p className="text-[8px] uppercase opacity-70 mt-1">Faltan: ${(ENERO_STATS.totalRevenue - totalRevenue).toFixed(2)}</p>
              </div>

              <div className="bg-[#003566] p-6 rounded-xl md:rounded-[40px] text-white border-b-8 border-blue-900 shadow-xl">
                <h3 className="text-[10px] font-black uppercase opacity-60 mb-2">Meta Diaria Hoy</h3>
                <p className="text-4xl font-black italic text-green-400">${dailyTarget.toFixed(2)}</p>
                <p className="text-[8px] uppercase opacity-70 mt-1">Para llegar a $1,250</p>
              </div>
            </section>

            {/* FORMULARIO CON FECHA CORREGIDA */}
            <section className={`p-4 md:p-8 rounded-xl md:rounded-[40px] shadow-xl border-4 transition-colors ${
              editingId ? 'bg-blue-50 border-blue-500' : 'bg-white border-slate-300'
            }`}>
              <div className="flex justify-between items-center mb-4 border-b-2 pb-2">
                <h3 className="text-xs font-black text-[#003566] uppercase italic">
                  {editingId ? "⚡ EDITANDO REGISTRO" : "📝 NUEVO REGISTRO"}
                </h3>
                {editingId && (
                  <button onClick={handleCancelEdit} className="text-[10px] text-red-500 font-bold uppercase px-3 py-1 bg-red-50 rounded-lg">
                    ✕ Cancelar
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
                    className="w-full p-2 md:p-4 rounded-xl border-2 font-bold border-slate-200"
                    required
                  />
                </div>
                
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Visualizaciones</label>
                  <div className="flex gap-2">
                    <input 
                      placeholder="Ej: 1500" 
                      type="number" 
                      step="any"
                      min="0"
                      value={viewInput} 
                      onChange={e => setViewInput(e.target.value)} 
                      className="flex-1 p-2 md:p-4 rounded-xl border-2 font-bold border-slate-200"
                      required
                    />
                    <select 
                      value={viewUnit} 
                      onChange={e => setViewUnit(Number(e.target.value))}
                      className="p-2 md:p-4 rounded-xl border-2 font-bold border-slate-200 bg-slate-50 text-xs"
                    >
                      {VIEW_UNITS.map(unit => (
                        <option key={unit.value} value={unit.value}>{unit.label}</option>
                      ))}
                    </select>
                  </div>
                  {viewInput && (
                    <p className="text-[10px] text-slate-500">
                      = {parseFloat(viewInput * viewUnit).toLocaleString()} visualizaciones totales
                    </p>
                  )}
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
                    className="w-full p-2 md:p-4 rounded-xl border-2 font-black text-green-700 bg-green-50 border-slate-200"
                    required
                  />
                </div>
                
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Titular</label>
                  <input 
                    placeholder="TITULAR LLAMATIVO" 
                    value={formData.topic} 
                    onChange={e => setFormData({...formData, topic: e.target.value})} 
                    className="w-full p-2 md:p-4 rounded-xl border-2 font-bold uppercase border-slate-200"
                    maxLength={100}
                    required
                  />
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
                      value={formData.followers} 
                      onChange={e => setFormData({...formData, followers: e.target.value})} 
                      className="w-full p-2 md:p-4 rounded-xl border-2 font-bold border-slate-200"
                    />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="md:col-span-3 bg-[#003566] text-white p-3 md:p-5 rounded-xl font-black text-xl shadow-xl italic uppercase disabled:opacity-50 hover:bg-blue-800"
                >
                  {isSubmitting ? "SINCRONIZANDO..." : editingId ? "💾 ACTUALIZAR" : "🚀 SINCRONIZAR"}
                </button>
              </form>
            </section>

            {/* BITÁCORA FEBRERO */}
            <section className="bg-white rounded-xl md:rounded-[40px] p-4 md:p-8 border-2 border-slate-300 shadow-xl">
              <h2 className="text-xl md:text-3xl font-black text-[#003566] uppercase italic mb-4">
                Operaciones Febrero
              </h2>
              {febData.length === 0 ? (
                <p className="text-center text-slate-400 font-bold py-8">No hay registros</p>
              ) : (
                <div className="space-y-2">
                  {febData.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border hover:bg-blue-50">
                      <div className="flex-1 cursor-pointer" onClick={() => handleEdit(item)}>
                        <p className="font-black text-[#003566] text-sm uppercase">{item.topic}</p>
                        <p className="text-[8px] text-slate-400">
                          {item.date} • {formatViews(item.views)} views • {item.format}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-black text-green-600 text-2xl">${Number(item.revenue).toFixed(2)}</p>
                        <button onClick={() => handleEdit(item)} className="text-blue-400 hover:bg-blue-100 p-2 rounded-full">✏️</button>
                        <button onClick={() => deleteRow(item.id)} className="text-red-300 hover:bg-red-50 p-2 rounded-full">🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* OTRAS PESTAÑAS... */}
        {activeTab === "intel" && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-[#003566] uppercase italic">🧠 Centro de Inteligencia</h2>
            {/* Contenido de intel... */}
          </div>
        )}

        {activeTab === "buscar" && (
          <div className="space-y-6">
            <section className="bg-white p-6 rounded-xl border-2 border-slate-300 shadow-xl">
              <h2 className="text-2xl font-black text-[#003566] uppercase italic mb-6">🔍 Consulta por Fecha</h2>
              {/* Buscador... */}
            </section>
          </div>
        )}

        {activeTab === "historico" && (
          <div className="space-y-6">
            <section className="bg-slate-500 p-6 rounded-xl text-white border-b-8 border-slate-700 shadow-xl">
              <h2 className="text-2xl font-black uppercase italic mb-4">Resumen Enero 2026</h2>
              {/* Histórico... */}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}