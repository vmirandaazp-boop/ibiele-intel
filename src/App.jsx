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
  { value: 1, label: "Unidades", multiplier: 1 },
  { value: 1000, label: "Miles (K)", multiplier: 1000 },
  { value: 1000000, label: "Millones (M)", multiplier: 1000000 }
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
    date: "2026-02-07",
    revenue: "",
    views: "",
    interactions: "",
    followers: "",
    format: "Foto",
    topic: ""
  });

  const [formErrors, setFormErrors] = useState({});

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

  const { 
    febData, 
    totalRevenue, 
    dailyTarget, 
    progressPercent,
    todayFebData,
    todayFebTotal,
    todayFebCount,
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
    
    const todayTotal = todayData.reduce((sum, item) => sum + (parseFloat(item.revenue) || 0), 0);
    const todayCount = todayData.length;
    
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
      todayFebData: todayData,
      todayFebTotal: todayTotal,
      todayFebCount: todayCount,
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

  const onThisDayJanuary = ENERO_DATA.find(item => item.day === 7);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 border-[4px] md:border-[15px] border-[#003566]">
      {/* HEADER */}
      <header className="bg-[#003566] text-white p-3 md:p-4 shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 md:gap-3">
          <div className="text-center md:text-left w-full md:w-auto">
            <h1 className="text-xl md:text-4xl font-black italic tracking-tighter uppercase">
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
                  className={`px-3 md:px-4 py-2 rounded-lg font-black text-[10px] uppercase transition whitespace-nowrap ${
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
          
          <div className="text-center md:text-right w-full md:w-auto hidden md:block">
            <p className="text-[8px] md:text-[10px] font-black opacity-50 uppercase tracking-widest">
              Feb Revenue
            </p>
            <p className="text-xl md:text-3xl font-black text-green-400">
              ${totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-2 md:p-6 space-y-4 md:space-y-6">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 md:p-4 rounded text-sm">
            <p className="font-bold">⚠️ Error</p>
            <p className="text-xs">{error}</p>
          </div>
        )}

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-4 md:space-y-6">
            
            {/* RESUMEN SUPERIOR COMPACTO */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              <div className="bg-[#003566] p-3 md:p-4 rounded-xl text-white border-b-4 border-blue-900">
                <p className="text-[8px] md:text-[10px] uppercase opacity-60">Total Feb</p>
                <p className="text-lg md:text-2xl font-black text-blue-400">${totalRevenue.toFixed(2)}</p>
              </div>
              <div className="bg-slate-500 p-3 md:p-4 rounded-xl text-white border-b-4 border-slate-700">
                <p className="text-[8px] md:text-[10px] uppercase opacity-60">Proyección</p>
                <p className="text-lg md:text-2xl font-black">${comparisonStats.projectedTotal.toFixed(0)}</p>
              </div>
              <div className="bg-[#003566] p-3 md:p-4 rounded-xl text-white border-b-4 border-blue-900">
                <p className="text-[8px] md:text-[10px] uppercase opacity-60">Meta Hoy</p>
                <p className="text-lg md:text-2xl font-black text-green-400">${dailyTarget.toFixed(0)}</p>
              </div>
              <div className={`p-3 md:p-4 rounded-xl text-white border-b-4 ${comparisonStats.vsEneroPercent >= 0 ? 'bg-green-600 border-green-800' : 'bg-red-500 border-red-700'}`}>
                <p className="text-[8px] md:text-[10px] uppercase opacity-60">vs Enero</p>
                <p className="text-lg md:text-2xl font-black">{comparisonStats.vsEneroPercent >= 0 ? '+' : ''}{comparisonStats.vsEneroPercent.toFixed(0)}%</p>
              </div>
            </div>

            {/* UN DÍA COMO HOY - VERSIÓN ELEGANTE */}
            {onThisDayJanuary && (
              <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-[30px] border-2 border-slate-200 shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      📅 Un día como hoy • 7 de Enero
                    </p>
                    <h2 className="text-base md:text-lg font-black text-[#003566] uppercase">
                      {onThisDayJanuary.topic}
                    </h2>
                  </div>
                  <div className="bg-slate-100 px-3 py-1 rounded-full">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Histórico</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4">
                  <div className="bg-slate-50 p-2 md:p-3 rounded-lg text-center">
                    <p className="text-lg md:text-xl font-black text-[#003566]">${onThisDayJanuary.revenue}</p>
                    <p className="text-[8px] md:text-[10px] text-slate-400 uppercase">Revenue</p>
                  </div>
                  <div className="bg-slate-50 p-2 md:p-3 rounded-lg text-center">
                    <p className="text-lg md:text-xl font-black text-[#003566]">{onThisDayJanuary.views}M</p>
                    <p className="text-[8px] md:text-[10px] text-slate-400 uppercase">Views</p>
                  </div>
                  <div className="bg-slate-50 p-2 md:p-3 rounded-lg text-center">
                    <p className="text-lg md:text-xl font-black text-[#003566]">{onThisDayJanuary.interactions}K</p>
                    <p className="text-[8px] md:text-[10px] text-slate-400 uppercase">Interac.</p>
                  </div>
                </div>

                {/* ESTADO DE HOY */}
                {todayFebCount > 0 ? (
                  <div className={`p-3 md:p-4 rounded-xl border-2 ${
                    todayFebTotal >= onThisDayJanuary.revenue 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-2">
                      <p className="text-xs md:text-sm font-black text-slate-600">
                        📊 Hoy: {todayFebCount} publicaciones
                      </p>
                      <span className={`text-[10px] md:text-xs font-black px-2 py-1 rounded-full text-white ${
                        todayFebTotal >= onThisDayJanuary.revenue ? 'bg-green-500' : 'bg-blue-500'
                      }`}>
                        {todayFebTotal >= onThisDayJanuary.revenue ? '✓ SUPERADO' : 'EN PROGRESO'}
                      </span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-2xl md:text-3xl font-black text-slate-800">${todayFebTotal.toFixed(2)}</p>
                        <p className="text-[10px] text-slate-500">
                          vs ${onThisDayJanuary.revenue} histórico
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-base md:text-lg font-bold ${todayFebTotal >= onThisDayJanuary.revenue ? 'text-green-600' : 'text-blue-600'}`}>
                          {todayFebTotal >= onThisDayJanuary.revenue ? '+' : ''}${(todayFebTotal - onThisDayJanuary.revenue).toFixed(2)}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {((todayFebTotal / onThisDayJanuary.revenue) * 100).toFixed(0)}% del día histórico
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 p-3 md:p-4 rounded-xl border border-slate-200">
                    <p className="text-sm font-bold text-slate-600 mb-1">📝 Sin publicaciones hoy</p>
                    <p className="text-[10px] text-slate-400">Meta sugerida: Superar ${onThisDayJanuary.revenue}</p>
                  </div>
                )}
              </div>
            )}

            {/* FORMULARIO */}
            <div className={`p-3 md:p-6 rounded-xl md:rounded-[30px] shadow-lg border-2 transition-colors ${
              editingId ? 'bg-blue-50 border-blue-500' : 'bg-white border-slate-200'
            }`}>
              <div className="flex justify-between items-center mb-3 md:mb-4 border-b-2 pb-2">
                <h3 className="text-xs md:text-sm font-black text-[#003566] uppercase italic">
                  {editingId ? "⚡ EDITANDO" : "📝 NUEVO REGISTRO"}
                </h3>
                {editingId && (
                  <button onClick={handleCancelEdit} className="text-[10px] text-red-500 font-bold uppercase px-2 py-1 bg-red-50 rounded">
                    ✕ Cancelar
                  </button>
                )}
              </div>
              
              <form onSubmit={saveData} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Fecha</label>
                    <input 
                      type="date" 
                      value={formData.date} 
                      onChange={e => setFormData({...formData, date: e.target.value})} 
                      className="w-full p-2 md:p-3 rounded-lg border-2 font-bold border-slate-200 text-sm"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Visualizaciones</label>
                    <div className="flex gap-2">
                      <input 
                        placeholder="Ej: 1500" 
                        type="number" 
                        step="any"
                        min="0"
                        value={viewInput} 
                        onChange={e => setViewInput(e.target.value)} 
                        className="flex-1 p-2 md:p-3 rounded-lg border-2 font-bold border-slate-200 text-sm"
                        required
                      />
                      <select 
                        value={viewUnit} 
                        onChange={e => setViewUnit(Number(e.target.value))}
                        className="p-2 md:p-3 rounded-lg border-2 font-bold border-slate-200 bg-slate-50 text-xs w-24 md:w-32"
                      >
                        {VIEW_UNITS.map(unit => (
                          <option key={unit.value} value={unit.value}>{unit.label}</option>
                        ))}
                      </select>
                    </div>
                    {viewInput && (
                      <p className="text-[10px] text-slate-500 mt-1">
                        = {parseFloat(viewInput * viewUnit).toLocaleString()} vistas
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Revenue ($)</label>
                    <input 
                      placeholder="Ej: 50.00" 
                      type="number" 
                      step="0.01" 
                      min="0"
                      value={formData.revenue} 
                      onChange={e => setFormData({...formData, revenue: e.target.value})} 
                      className="w-full p-2 md:p-3 rounded-lg border-2 font-black text-green-700 bg-green-50 border-slate-200 text-sm"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Titular</label>
                    <input 
                      placeholder="TITULAR LLAMATIVO" 
                      value={formData.topic} 
                      onChange={e => setFormData({...formData, topic: e.target.value})} 
                      className="w-full p-2 md:p-3 rounded-lg border-2 font-bold uppercase border-slate-200 text-sm"
                      maxLength={100}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Formato</label>
                    <select 
                      value={formData.format} 
                      onChange={e => setFormData({...formData, format: e.target.value})} 
                      className="w-full p-2 md:p-3 rounded-lg border-2 font-bold border-slate-200 text-sm bg-white"
                    >
                      {FORMATS.map(f => (
                        <option key={f.value} value={f.value}>{f.icon} {f.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Interac. (K)</label>
                    <input 
                      placeholder="Opcional" 
                      type="number" 
                      step="0.1" 
                      value={formData.interactions} 
                      onChange={e => setFormData({...formData, interactions: e.target.value})} 
                      className="w-full p-2 md:p-3 rounded-lg border-2 font-bold border-slate-200 text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Followers</label>
                    <input 
                      placeholder="Opcional" 
                      type="number" 
                      value={formData.followers} 
                      onChange={e => setFormData({...formData, followers: e.target.value})} 
                      className="w-full p-2 md:p-3 rounded-lg border-2 font-bold border-slate-200 text-sm"
                    />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-[#003566] text-white p-3 md:p-4 rounded-xl font-black text-base md:text-lg shadow-lg uppercase disabled:opacity-50 hover:bg-blue-800 transition"
                >
                  {isSubmitting ? "SINCRONIZANDO..." : editingId ? "💾 ACTUALIZAR" : "🚀 SINCRONIZAR"}
                </button>
              </form>
            </div>

            {/* BITÁCORA FEBRERO */}
            <div className="bg-white rounded-xl md:rounded-[30px] p-3 md:p-6 border-2 border-slate-200 shadow-lg">
              <h2 className="text-lg md:text-2xl font-black text-[#003566] uppercase italic mb-3 md:mb-4">
                Operaciones Febrero
              </h2>
              {febData.length === 0 ? (
                <p className="text-center text-slate-400 font-bold py-8 text-sm">No hay registros</p>
              ) : (
                <div className="space-y-2">
                  {febData.map(item => (
                    <div key={item.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 bg-slate-50 rounded-xl border hover:bg-blue-50 gap-2">
                      <div className="flex-1 cursor-pointer w-full" onClick={() => handleEdit(item)}>
                        <p className="font-black text-[#003566] text-sm uppercase truncate">{item.topic}</p>
                        <p className="text-[10px] text-slate-400">
                          {item.date} • {formatViews(item.views)} • {item.format}
                        </p>
                      </div>
                      <div className="flex items-center justify-between w-full md:w-auto gap-3">
                        <p className="font-black text-green-600 text-xl md:text-2xl">${Number(item.revenue).toFixed(2)}</p>
                        <div className="flex gap-1">
                          <button onClick={() => handleEdit(item)} className="text-blue-400 hover:bg-blue-100 p-2 rounded-full text-sm">✏️</button>
                          <button onClick={() => deleteRow(item.id)} className="text-red-300 hover:bg-red-50 p-2 rounded-full text-sm">🗑️</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* INTEL */}
        {activeTab === "intel" && (
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-[#003566] uppercase italic">🧠 Centro de Inteligencia</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 md:p-6 rounded-xl border-2 border-slate-200 shadow-lg">
                <h3 className="text-base md:text-lg font-black text-[#003566] uppercase italic mb-4">📊 Comparativa</h3>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="font-bold text-sm">Total Enero</span>
                    <span className="font-black text-[#003566]">${ENERO_STATS.totalRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="font-bold text-sm">Total Febrero</span>
                    <span className="font-black text-blue-600">${totalRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="font-bold text-sm">Diferencia</span>
                    <span className={`font-black ${totalRevenue >= ENERO_STATS.totalRevenue ? 'text-green-600' : 'text-red-500'}`}>
                      {totalRevenue >= ENERO_STATS.totalRevenue ? '+' : ''}${(totalRevenue - ENERO_STATS.totalRevenue).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#003566] p-4 md:p-6 rounded-xl text-white border-b-8 border-blue-900 shadow-lg">
                <h3 className="text-base md:text-lg font-black uppercase italic mb-4">🎯 Proyecciones</h3>
                <div className="space-y-3">
                  <div className="bg-white/10 p-3 rounded-lg">
                    <p className="text-[10px] uppercase opacity-70">Proyección final</p>
                    <p className="text-2xl font-black text-blue-400">${comparisonStats.projectedTotal.toFixed(2)}</p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg">
                    <p className="text-[10px] uppercase opacity-70">Para superar enero</p>
                    <p className="text-2xl font-black text-green-400">${(ENERO_STATS.totalRevenue - totalRevenue).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BUSCAR */}
        {activeTab === "buscar" && (
          <div className="space-y-4">
            <div className="bg-white p-4 md:p-6 rounded-xl border-2 border-slate-200 shadow-lg">
              <h2 className="text-xl md:text-2xl font-black text-[#003566] uppercase italic mb-4">🔍 Buscar</h2>
              <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                <select 
                  value={searchMonth} 
                  onChange={e => setSearchMonth(e.target.value)}
                  className="p-2 md:p-3 rounded-lg border-2 font-bold border-slate-200 text-sm"
                >
                  <option value="febrero">Febrero 2026</option>
                  <option value="enero">Enero 2026</option>
                </select>
                <input 
                  type="date" 
                  value={searchDate} 
                  onChange={e => setSearchDate(e.target.value)}
                  className="flex-1 p-2 md:p-3 rounded-lg border-2 font-bold border-slate-200 text-sm"
                />
                <button 
                  onClick={handleSearch}
                  disabled={!searchDate}
                  className="bg-[#003566] text-white p-2 md:p-3 rounded-lg font-black uppercase text-sm disabled:opacity-50"
                >
                  Buscar
                </button>
              </div>
              {searchResults.length > 0 && (
                <div className="mt-4 space-y-2">
                  {searchResults.map(item => (
                    <div key={item.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="font-black text-sm uppercase text-[#003566]">{item.topic}</p>
                      <p className="text-xs text-slate-500">{item.date} • ${item.revenue}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* HISTORICO */}
        {activeTab === "historico" && (
          <div className="space-y-4">
            <div className="bg-slate-500 p-4 md:p-6 rounded-xl text-white border-b-8 border-slate-700 shadow-lg">
              <h2 className="text-xl md:text-2xl font-black uppercase italic mb-4">Enero 2026</h2>
              <div className="grid grid-cols-2 gap-2 md:gap-4">
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-[10px] uppercase opacity-70">Total</p>
                  <p className="text-xl md:text-2xl font-black">${ENERO_STATS.totalRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-[10px] uppercase opacity-70">Promedio</p>
                  <p className="text-xl md:text-2xl font-black">${ENERO_STATS.avgDailyRevenue}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-3 md:p-6 border-2 border-slate-200 shadow-lg overflow-x-auto">
              <table className="w-full text-left min-w-[500px]">
                <thead className="bg-slate-100 text-[10px] font-black uppercase text-slate-500">
                  <tr>
                    <th className="p-2">Día</th>
                    <th className="p-2">Título</th>
                    <th className="p-2 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {ENERO_DATA.map(i => (
                    <tr key={i.id} className="text-sm">
                      <td className="p-2 font-bold">{i.day}</td>
                      <td className="p-2 font-bold uppercase text-xs truncate max-w-[150px]">{i.topic}</td>
                      <td className="p-2 text-right font-black text-green-600">${i.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}