import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://stenaxhdsfxrzhetetiz.supabase.co";
const supabaseAnonKey = "sb_publishable_Sk2d6wvlqXrwLKfBEfS8fw_t5PfImJN";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const FORMATS = [
  { value: "Foto", label: "Foto", icon: "🖼️", color: "bg-blue-500" },
  { value: "Reels", label: "Reels", icon: "🎬", color: "bg-purple-600" },
  { value: "Enlaces", label: "Enlaces", icon: "🔗", color: "bg-green-500" },
  { value: "Historias", label: "Historias", icon: "📱", color: "bg-orange-500" }
];

// 📊 DATOS REALES DE ENERO 2026
const ENERO_DATA = [
  { day: 1, date: "2026-01-01", views: 0.76, revenue: 7.85, topic: "🚫 PROHIBIDO QUEJARSE EN ESTE 2026", format: "Foto", followers: 240 },
  { day: 2, date: "2026-01-02", views: 0.78, revenue: 8.04, topic: "🚨 ¡LA TIERRA SE MOVIÓ, PERO DIOS ES NUESTRA ROCA!", format: "Foto", followers: 246 },
  { day: 3, date: "2026-01-03", views: 2.01, revenue: 20.83, topic: "NOTICIA DE ÚLTIMA HORA: TRUMP", format: "Foto", followers: 633 },
  { day: 4, date: "2026-01-04", views: 0.78, revenue: 12.8, topic: "😭 MATARON A MI HIJO Y QUEMARON MI IGLESIA", format: "Foto", followers: 403 },
  { day: 5, date: "2026-01-05", views: 13.07, revenue: 103.96, topic: "😭 NO GRITARON DE MIEDO... SUSURRARON EL NOMBRE DE JESÚS", format: "Foto", followers: 4117 },
  { day: 6, date: "2026-01-06", views: 6.24, revenue: 51.84, topic: "😭 DE RODILLAS ESPERANDO EL FIN...", format: "Foto", followers: 1966 },
  { day: 7, date: "2026-01-07", views: 5.3, revenue: 44.32, topic: "💔 ¿CUÁNTAS BIBLIAS TIENES EN TU CASA QUE NO ABRES?", format: "Foto", followers: 1669 },
  { day: 8, date: "2026-01-08", views: 6.86, revenue: 61.68, topic: "💔🇪🇨 LLEGARON CON ENGAÑOS", format: "Foto", followers: 2161 },
  { day: 9, date: "2026-01-09", views: 4.32, revenue: 45.48, topic: "50 AÑOS DE CÁRCEL POR ORAR? 😱", format: "Reels", followers: 1432 },
  { day: 10, date: "2026-01-10", views: 5.3, revenue: 37.98, topic: "⚠️ PREFIERE LA MUERTE ANTES QUE VER A SUS HIJOS", format: "Foto", followers: 1196 },
  { day: 11, date: "2026-01-11", views: 9.19, revenue: 84.27, topic: "🏟️ CALIFORNIA: 50,000 ALMAS", format: "Foto", followers: 2894 },
  { day: 12, date: "2026-01-12", views: 3.22, revenue: 31.96, topic: "⚠️ IRÁN SE HA CONVERTIDO EN UN VALLE DE LÁGRIMAS", format: "Foto", followers: 1007 },
  { day: 13, date: "2026-01-13", views: 2.02, revenue: 22.29, topic: "🌊 🇧🇷 CREÍAN QUE ESTABA SOLO CONTRA EL MAR", format: "Foto", followers: 701 },
  { day: 14, date: "2026-01-14", views: 2.06, revenue: 21.54, topic: "😭 ¿SU DELITO? QUERER UN FUTURO MEJOR", format: "Foto", followers: 678 },
  { day: 15, date: "2026-01-15", views: 2.68, revenue: 23.74, topic: "🚨 CHINA ENVÍA FUERZAS ESPECIALES", format: "Foto", followers: 748 },
  { day: 16, date: "2026-01-16", views: 0.93, revenue: 8.16, topic: "🛑 LE DIJERON QUE SU CÁNCER ERA TERMINAL", format: "Foto", followers: 257 },
  { day: 17, date: "2026-01-17", views: 7.51, revenue: 60.45, topic: "😭 NOS ATARON LAS MANOS... Y CERRAMOS LOS OJOS", format: "Foto", followers: 2374 },
  { day: 18, date: "2026-01-18", views: 2.93, revenue: 25.13, topic: "🚫 LÉELO ANTES DE PONER UNA EXCUSA PARA NO IR AL CULTO", format: "Foto", followers: 791 },
  { day: 19, date: "2026-01-19", views: 4.59, revenue: 43.14, topic: "🛑 LA ORDEN DE DISPARAR YA ESTABA DADA...", format: "Foto", followers: 1441 },
  { day: 20, date: "2026-01-20", views: 4.53, revenue: 46.21, topic: "🚫 IBA A DARLE MUERTE ... PERO ALGUIEN SE INTERPUSO", format: "Foto", followers: 1458 },
  { day: 21, date: "2026-01-21", views: 2.13, revenue: 16.41, topic: "¡ESTABA ATADO, GOLPEADO Y A PUNTO DE MORIR...", format: "Foto", followers: 517 },
  { day: 22, date: "2026-01-22", views: 1.08, revenue: 9.99, topic: "¡MIENTRAS EL MUNDO LO NIEGA, UNA NACIÓN ENTERA", format: "Foto", followers: 315 },
  { day: 23, date: "2026-01-23", views: 1.09, revenue: 12.67, topic: "¡LA PEOR OLA EN 30 AÑOS... PRISIÓN", format: "Foto", followers: 399 },
  { day: 24, date: "2026-01-24", views: 2.02, revenue: 21.03, topic: "😱¡YA ESTABAN ALINEADOS FRENTE AL POZO...", format: "Foto", followers: 663 },
  { day: 25, date: "2026-01-25", views: 8.32, revenue: 70.59, topic: "ELLOS PAGAN CON SANGRE POR IR AL CULTO...", format: "Foto", followers: 2631 },
  { day: 26, date: "2026-01-26", views: 4.76, revenue: 41.61, topic: "LA POLICÍA DIJO AQUÍ NO PASA NADA...", format: "Foto", followers: 1311 },
  { day: 27, date: "2026-01-27", views: 3.05, revenue: 27.5, topic: "EL GOLPE EN LA PUERTA QUE TODA FAMILIA TEME", format: "Foto", followers: 866 },
  { day: 28, date: "2026-01-28", views: 1.56, revenue: 14.83, topic: "SU PROFESOR LE ORDENÓ: ESCONDE ESA CRUZ", format: "Foto", followers: 467 },
  { day: 29, date: "2026-01-29", views: 1.19, revenue: 10.86, topic: "DORMÍAN TRANQUILOS... Y DESPERTARON EN LA ETERNIDAD", format: "Foto", followers: 342 },
  { day: 30, date: "2026-01-30", views: 0.95, revenue: 11.47, topic: "¿QUIÉNES ERAN ESOS HOMBRES?", format: "Foto", followers: 361 },
  { day: 31, date: "2026-01-31", views: 1.83, revenue: 21.2, topic: "DICEN QUE EN CALIFORNIA YA NO CREEN EN DIOS...", format: "Foto", followers: 669 }
];

// 🌍 DEMOGRAFÍA REAL
const DEMOGRAPHICS = {
  gender: [{ label: "Mujeres", value: 67.1, color: "bg-pink-500" }, { label: "Hombres", value: 32.9, color: "bg-blue-500" }],
  age: [
    { range: "18-24", percent: 12.3 },
    { range: "25-34", percent: 18.7 },
    { range: "35-44", percent: 29.1, highlight: true },
    { range: "45-54", percent: 23.4, highlight: true },
    { range: "55-64", percent: 11.2 },
    { range: "65+", percent: 5.3 }
  ],
  countries: [
    { name: "México", percent: 25.8, flag: "🇲🇽" },
    { name: "Colombia", percent: 13.3, flag: "🇨🇴" },
    { name: "Argentina", percent: 10.0, flag: "🇦🇷" },
    { name: "Perú", percent: 6.2, flag: "🇵🇪" },
    { name: "Ecuador", percent: 5.7, flag: "🇪🇨" },
    { name: "Otros", percent: 39.0, flag: "🌍" }
  ]
};

// 📱 RENDIMIENTO POR FORMATO
const FORMAT_STATS = {
  Foto: { count: 28, views: 109.57, revenue: 966.76, rpm: 0.88, color: "bg-blue-500" },
  Reels: { count: 1, views: 4.32, revenue: 45.48, rpm: 1.05, color: "bg-purple-600" },
  Historias: { count: 2, views: 0, revenue: 0, rpm: 0, color: "bg-orange-500" }
};

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showInsights, setShowInsights] = useState(true);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    revenue: "", views: "", interactions: "", followers: "", format: "Foto", topic: ""
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: metrics, error } = await supabase.from("metrics").select("*").order('date', { ascending: false });
      if (error) throw error;
      setData(metrics || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const saveData = async (e) => {
    e.preventDefault();
    try {
      await supabase.from("metrics").insert([{
        ...formData,
        revenue: parseFloat(formData.revenue) || 0,
        views: (parseFloat(formData.views) || 0) * 1000000,
        interactions: (parseFloat(formData.interactions) || 0) * 1000,
        followers: parseFloat(formData.followers) || 0,
        topic: formData.topic.toUpperCase()
      }]);
      setFormData({ ...formData, revenue: "", views: "", interactions: "", followers: "", topic: "" });
      loadData();
    } catch (err) { alert("Error al guardar"); }
  };

  const deleteRow = async (id) => {
    if(window.confirm("¿BORRAR REGISTRO DEL IMPERIO?")) {
      await supabase.from("metrics").delete().eq('id', id);
      loadData();
    }
  };

  // --- DATOS DEL MISMO DÍA EN ENERO ---
  const todayDay = new Date().getDate();
  const sameDayEnero = ENERO_DATA.find(item => item.day === todayDay);
  const filteredData = data.filter(item => item.date.split("-")[1] === "02");

  // --- CÁLCULOS ---
  const totalRevenue = filteredData.reduce((sum, item) => sum + (Number(item.revenue) || 0), 0);
  const totalViews = filteredData.reduce((sum, item) => sum + (Number(item.views) || 0), 0);
  const totalFollowersFeb = filteredData.reduce((sum, item) => sum + (Number(item.followers) || 0), 0);
  const daysInMonth = 29;
  const daysPassed = new Date().getDate();
  const daysLeft = daysInMonth - daysPassed;
  const dailyTarget = (1250 - totalRevenue) / (daysLeft || 1);
  const avgRevenue = daysPassed > 0 ? totalRevenue / daysPassed : 0;
  
  // --- ESTADÍSTICAS DE ENERO ---
  const eneroRevenue = ENERO_DATA.reduce((sum, item) => sum + item.revenue, 0);
  const eneroViews = ENERO_DATA.reduce((sum, item) => sum + item.views, 0);
  const eneroFollowers = ENERO_DATA.reduce((sum, item) => sum + item.followers, 0);
  const conversionRate = eneroViews > 0 ? (eneroFollowers / eneroViews) : 315;
  
  // --- TOP PERFORMERS ---
  const topPerformers = [...ENERO_DATA].sort((a, b) => b.revenue - a.revenue).slice(0, 3);
  const bestDay = ENERO_DATA.reduce((max, item) => item.revenue > max.revenue ? item : max);

  const formatNumber = (num) => {
    const n = Number(num) || 0;
    if (n >= 1000000) return `${(n/1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n/1000).toFixed(1)}K`;
    return n.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      
      {/* HEADER ELITE - OPTIMIZADO PARA MÓVIL */}
      <header className="bg-[#003566] text-white p-4 shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="text-center md:text-left w-full md:w-auto">
              <h1 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase">IBIELE <span className="text-slate-400">INTEL</span></h1>
              <p className="text-[8px] md:text-[10px] font-bold tracking-widest opacity-70 uppercase mt-1">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • COMANDO AGUASCALIENTES
              </p>
            </div>
            
            {/* Tabs en scroll horizontal para móvil */}
            <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <div className="flex gap-1 md:gap-2 min-w-max md:min-w-0">
                {["dashboard", "audiencia", "estrategia", "historico"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 md:px-4 py-2 rounded-lg md:rounded-xl font-black text-[10px] md:text-xs whitespace-nowrap transition ${
                      activeTab === tab 
                        ? "bg-white text-[#003566] shadow-lg" 
                        : "bg-[#002a55] text-blue-200 hover:bg-[#002f5e]"
                    }`}
                  >
                    {tab === "dashboard" ? "DASHBOARD" : 
                     tab === "audiencia" ? "AUDIENCIA" :
                     tab === "estrategia" ? "ESTRATEGIA" : "HISTÓRICO"}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="text-center md:text-right w-full md:w-auto mt-2 md:mt-0">
              <p className="text-[8px] md:text-[10px] font-black opacity-50 uppercase">Revenue Feb</p>
              <p className="text-xl md:text-3xl font-black text-green-400">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-3 md:p-6 space-y-6">
        
        {/* 🚨 INTELIGENCIA HISTÓRICA - MÓVIL OPTIMIZADO */}
        {activeTab === "dashboard" && showInsights && sameDayEnero && (
          <section className="bg-[#001d3d] rounded-xl md:rounded-[40px] shadow-2xl border-2 border-slate-400 overflow-hidden animate-fade-in">
            <div className="bg-slate-800/50 p-4 md:p-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="bg-slate-200 text-[#003566] p-3 md:p-4 rounded-xl md:rounded-2xl font-black text-xl md:text-2xl shadow-inner flex-shrink-0">0{todayDay}</div>
                  <div className="min-w-0">
                    <h2 className="text-slate-200 font-black text-base md:text-xl uppercase tracking-tighter italic truncate">Referencia Enero 2026</h2>
                    <p className="text-[8px] md:text-xs font-bold uppercase text-slate-400 truncate">{sameDayEnero.topic}</p>
                  </div>
                </div>
                
                <div className="w-full md:w-auto mt-4 md:mt-0">
                  <div className="grid grid-cols-3 gap-2 md:gap-4">
                    <div className="bg-white/5 border border-white/10 p-3 md:p-4 rounded-xl md:rounded-2xl text-center">
                       <p className="text-[7px] md:text-[9px] font-black text-slate-500 uppercase">Caja</p>
                       <p className="text-lg md:text-xl font-black text-green-400">${sameDayEnero.revenue.toFixed(2)}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-3 md:p-4 rounded-xl md:rounded-2xl text-center">
                       <p className="text-[7px] md:text-[9px] font-black text-slate-500 uppercase">Vistas</p>
                       <p className="text-lg md:text-xl font-black text-blue-400">{sameDayEnero.views}M</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-3 md:p-4 rounded-xl md:rounded-2xl text-center">
                       <p className="text-[7px] md:text-[9px] font-black text-slate-500 uppercase">Seguidores</p>
                       <p className="text-lg md:text-xl font-black text-yellow-400">+{sameDayEnero.followers}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-3 md:p-4 bg-[#003566] text-center">
              <p className="text-[7px] md:text-[10px] font-black text-slate-300 uppercase tracking-[0.1em] md:tracking-[0.2em]">
                Sugerencia: Duplicar formato {sameDayEnero.format}. Conversión: {(sameDayEnero.followers/sameDayEnero.views).toFixed(0)}/M
              </p>
            </div>
            <button 
              onClick={() => setShowInsights(false)}
              className="absolute top-2 right-2 bg-red-500/20 hover:bg-red-500/30 text-white px-2 py-1 md:px-3 md:py-1 rounded-lg text-[8px] md:text-xs font-bold"
            >
              ✕
            </button>
          </section>
        )}

        {/* DASHBOARD PRINCIPAL */}
        {activeTab === "dashboard" && (
          <>
            {/* PANEL COMPARATIVO - OPTIMIZADO PARA MÓVIL */}
            <section className="grid grid-cols-1 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-800 to-blue-900 p-4 md:p-8 rounded-xl md:rounded-[40px] shadow-2xl text-white border-2 border-slate-700">
                <div className="flex items-center mb-4 md:mb-6">
                  <div className="text-3xl md:text-5xl mr-2 md:mr-4">📊</div>
                  <div>
                    <h2 className="text-lg md:text-2xl font-black uppercase">ENERO 2026</h2>
                    <p className="text-[8px] md:text-sm opacity-70">Datos históricos completos</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                  <div className="text-center bg-white/5 p-3 md:p-5 rounded-lg md:rounded-2xl border border-white/10">
                    <p className="text-[7px] md:text-[10px] opacity-60 mb-1">INGRESOS</p>
                    <p className="text-xl md:text-4xl font-black">${eneroRevenue.toFixed(2)}</p>
                  </div>
                  <div className="text-center bg-white/5 p-3 md:p-5 rounded-lg md:rounded-2xl border border-white/10">
                    <p className="text-[7px] md:text-[10px] opacity-60 mb-1">VISUALIZACIONES</p>
                    <p className="text-xl md:text-4xl font-black">{eneroViews.toFixed(1)}M</p>
                  </div>
                  <div className="text-center bg-white/5 p-3 md:p-5 rounded-lg md:rounded-2xl border border-white/10">
                    <p className="text-[7px] md:text-[10px] opacity-60 mb-1">SEGUIDORES</p>
                    <p className="text-xl md:text-4xl font-black">{(eneroFollowers/1000).toFixed(1)}K</p>
                  </div>
                  <div className="text-center bg-white/5 p-3 md:p-5 rounded-lg md:rounded-2xl border border-white/10">
                    <p className="text-[7px] md:text-[10px] opacity-60 mb-1">CONVERSIÓN</p>
                    <p className="text-xl md:text-4xl font-black">{conversionRate.toFixed(0)}/M</p>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-6 p-3 md:p-4 bg-yellow-400/10 rounded-lg md:rounded-xl border border-yellow-500/30">
                  <p className="text-[7px] md:text-[10px] font-bold text-yellow-300 uppercase">Mejor día: {bestDay.date.split("-").reverse().join("/")}</p>
                  <p className="text-base md:text-xl font-black mt-1">${bestDay.revenue.toFixed(2)} • {bestDay.views}M vistas</p>
                  <p className="text-[8px] md:text-sm mt-1 truncate">{bestDay.topic}</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-800 to-green-900 p-4 md:p-8 rounded-xl md:rounded-[40px] shadow-2xl text-white border-2 border-slate-700">
                <div className="flex items-center mb-4 md:mb-6">
                  <div className="text-3xl md:text-5xl mr-2 md:mr-4">📈</div>
                  <div>
                    <h2 className="text-lg md:text-2xl font-black uppercase">FEBRERO 2026</h2>
                    <p className="text-[8px] md:text-sm opacity-70">Progreso actual</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                  <div className="text-center bg-white/5 p-3 md:p-5 rounded-lg md:rounded-2xl border border-white/10">
                    <p className="text-[7px] md:text-[10px] opacity-60 mb-1">INGRESOS</p>
                    <p className="text-xl md:text-4xl font-black">${totalRevenue.toFixed(2)}</p>
                  </div>
                  <div className="text-center bg-white/5 p-3 md:p-5 rounded-lg md:rounded-2xl border border-white/10">
                    <p className="text-[7px] md:text-[10px] opacity-60 mb-1">VISUALIZACIONES</p>
                    <p className="text-xl md:text-4xl font-black">{(totalViews/1000000).toFixed(1)}M</p>
                  </div>
                  <div className="text-center bg-white/5 p-3 md:p-5 rounded-lg md:rounded-2xl border border-white/10">
                    <p className="text-[7px] md:text-[10px] opacity-60 mb-1">PROMEDIO DIARIO</p>
                    <p className="text-xl md:text-4xl font-black">${avgRevenue.toFixed(2)}</p>
                  </div>
                  <div className="text-center bg-white/5 p-3 md:p-5 rounded-lg md:rounded-2xl border border-white/10">
                    <p className="text-[7px] md:text-[10px] opacity-60 mb-1">META DIARIA</p>
                    <p className="text-xl md:text-4xl font-black text-yellow-300">${dailyTarget.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-6">
                  <p className="text-[7px] md:text-[10px] font-bold opacity-60 mb-2">PROGRESO HACIA META $1,250</p>
                  <div className="w-full bg-white/10 rounded-full h-2 md:h-4 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-600 h-2 md:h-4 rounded-full transition-all duration-700"
                      style={{ width: `${Math.min((totalRevenue/1250)*100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-[8px] md:text-sm text-center mt-2 font-bold">
                    {((totalRevenue/1250)*100).toFixed(1)}% • {daysLeft} días restantes
                  </p>
                </div>
              </div>
            </section>

            {/* TOP PERFORMERS - MÓVIL OPTIMIZADO */}
            <section className="bg-white rounded-xl md:rounded-[40px] shadow-xl p-4 md:p-8 border-2 border-slate-300 mb-6">
              <div className="flex items-center mb-4 md:mb-6">
                <div className="text-2xl md:text-4xl mr-2 md:mr-3">🏆</div>
                <h2 className="text-base md:text-2xl font-black text-[#003566] uppercase">TOP 3 ENERO</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {topPerformers.map((item, idx) => (
                  <div key={idx} className={`p-3 md:p-6 rounded-lg md:rounded-2xl border-l-3 md:border-l-4 ${
                    idx === 0 ? 'border-yellow-500 bg-yellow-50' :
                    idx === 1 ? 'border-orange-500 bg-orange-50' : 'border-red-500 bg-red-50'
                  }`}>
                    <div className="flex justify-between items-start mb-3 md:mb-4">
                      <div className="text-xl md:text-3xl font-black">{idx + 1}</div>
                      <div className={`w-8 md:w-12 h-8 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center font-black text-[10px] md:text-base text-white ${
                        idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-orange-500' : 'bg-red-500'
                      }`}>
                        ${item.revenue.toFixed(0)}
                      </div>
                    </div>
                    <p className="font-black text-sm md:text-lg text-[#003566] mb-2 truncate" title={item.topic}>{item.topic}</p>
                    <div className="grid grid-cols-2 gap-2 md:gap-3 mt-3 md:mt-4">
                      <div className="text-center p-2 md:p-3 bg-slate-100 rounded-lg">
                        <p className="text-[7px] md:text-[10px] font-bold text-slate-500">Vistas</p>
                        <p className="font-black text-[10px] md:text-base text-blue-600">{item.views}M</p>
                      </div>
                      <div className="text-center p-2 md:p-3 bg-slate-100 rounded-lg">
                        <p className="text-[7px] md:text-[10px] font-bold text-slate-500">Fecha</p>
                        <p className="font-black text-[10px] md:text-base text-slate-700">{item.date.split("-").reverse().join("/")}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 md:mt-8 p-3 md:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg md:rounded-2xl border border-blue-200">
                <div className="flex items-start">
                  <div className="text-2xl md:text-4xl mr-2 md:mr-4 mt-1">💡</div>
                  <div>
                    <h3 className="font-black text-sm md:text-lg text-blue-800 mb-1 md:mb-2">PATRÓN DETECTADO</h3>
                    <p className="text-[8px] md:text-sm text-blue-700">
                      Palabras clave: <span className="font-bold">"MATARON"</span>, <span className="font-bold">"ESTADIO"</span>, <span className="font-bold">"SUSURRARON"</span>. 
                      Formato <span className="font-bold">Foto</span> domina (28/31). Publica 11am-2pm.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* REGISTRO TÁCTICO - MÓVIL OPTIMIZADO */}
            <section className="bg-white rounded-xl md:rounded-[40px] shadow-xl p-4 md:p-8 border-2 border-slate-300">
              <form onSubmit={saveData} className="space-y-3 md:space-y-0 md:grid md:grid-cols-3 md:gap-4">
                <div className="space-y-1">
                  <label className="text-[7px] md:text-[10px] font-black text-slate-400 uppercase">Fecha</label>
                  <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full p-2 md:p-4 rounded-lg md:rounded-2xl bg-slate-50 border-2 font-bold text-sm md:text-base outline-none focus:border-[#003566] focus:ring-2 focus:ring-blue-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-[7px] md:text-[10px] font-black text-slate-400 uppercase">Vistas (M)</label>
                  <input placeholder="0.00" type="number" step="0.01" value={formData.views} onChange={(e) => setFormData({...formData, views: e.target.value})} className="w-full p-2 md:p-4 rounded-lg md:rounded-2xl bg-slate-50 border-2 font-bold text-sm md:text-base outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-[7px] md:text-[10px] font-black text-slate-400 uppercase">Caja (USD)</label>
                  <input placeholder="0.00" type="number" step="0.01" value={formData.revenue} onChange={(e) => setFormData({...formData, revenue: e.target.value})} className="w-full p-2 md:p-4 rounded-lg md:rounded-2xl bg-green-50 border-2 border-green-200 font-black text-green-700 outline-none focus:border-green-500 text-sm md:text-base" />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[7px] md:text-[10px] font-black text-slate-400 uppercase">Titular</label>
                  <input placeholder="TITULAR DE LA PUBLICACIÓN" value={formData.topic} onChange={(e) => setFormData({...formData, topic: e.target.value})} className="w-full p-2 md:p-4 rounded-lg md:rounded-2xl bg-slate-50 border-2 font-bold uppercase outline-none focus:border-blue-500 text-[8px] md:text-base" />
                </div>
                <div className="space-y-1">
                  <label className="text-[7px] md:text-[10px] font-black text-slate-400 uppercase">Formato</label>
                  <select value={formData.format} onChange={(e) => setFormData({...formData, format: e.target.value})} className="w-full p-2 md:p-4 rounded-lg md:rounded-2xl bg-slate-50 border-2 font-bold outline-none focus:border-blue-500 text-sm md:text-base">
                    {FORMATS.map(f => <option key={f.value} value={f.value}>{f.icon} {f.label}</option>)}
                  </select>
                </div>
                <button type="submit" className="md:col-span-3 bg-[#003566] p-3 md:p-6 rounded-xl md:rounded-[35px] text-white font-black text-base md:text-2xl shadow-xl hover:bg-slate-800 active:scale-95 transition-all transform italic">
                  SINCRONIZAR 🚀
                </button>
              </form>
            </section>

            {/* BITÁCORA - MÓVIL OPTIMIZADO CON SCROLL */}
            <section className="bg-white rounded-xl md:rounded-[40px] shadow-2xl p-4 md:p-8 border-2 border-slate-300">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-8 gap-3">
                <h2 className="text-xl md:text-3xl font-black text-[#003566] uppercase italic tracking-tighter">Historial</h2>
                <div className="text-[8px] md:text-sm text-slate-500 text-right">
                  {filteredData.length} registros • ${totalRevenue.toFixed(2)}
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <div className="min-w-[600px] md:min-w-0">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[#003566] text-[7px] md:text-[10px] font-black uppercase bg-slate-50">
                        <th className="p-2 md:p-4 whitespace-nowrap">Fecha</th>
                        <th className="p-2 md:p-4 whitespace-nowrap">Titular</th>
                        <th className="p-2 md:p-4 whitespace-nowrap">Vistas</th>
                        <th className="p-2 md:p-4 whitespace-nowrap">Caja</th>
                        <th className="p-2 md:p-4 whitespace-nowrap">Seguidores</th>
                        <th className="p-2 md:p-4 whitespace-nowrap text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredData.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-2 md:p-4 font-bold text-[8px] md:text-sm text-slate-400 whitespace-nowrap">{item.date.split("-").reverse().slice(0,2).join("/")}</td>
                          <td className="p-2 md:p-4 font-black text-[8px] md:text-sm text-[#003566] uppercase truncate max-w-[150px] md:max-w-xs italic" title={item.topic}>{item.topic}</td>
                          <td className="p-2 md:p-4 font-black text-[10px] md:text-base text-blue-600 whitespace-nowrap">{(item.views/1000000).toFixed(2)}M</td>
                          <td className="p-2 md:p-4 font-black text-[10px] md:text-xl text-green-600 whitespace-nowrap">${Number(item.revenue).toFixed(2)}</td>
                          <td className="p-2 md:p-4 font-black text-[10px] md:text-base text-yellow-600 whitespace-nowrap">+{Number(item.followers).toLocaleString()}</td>
                          <td className="p-2 md:p-4 text-right">
                            <button onClick={() => deleteRow(item.id)} className="text-red-400 hover:text-red-600 hover:scale-125 transition-transform text-sm">🗑️</button>
                          </td>
                        </tr>
                      ))}
                      {filteredData.length === 0 && (
                        <tr>
                          <td colSpan="6" className="p-4 md:p-8 text-center text-[8px] md:text-sm text-slate-400 italic">
                            No hay registros aún. ¡Registra tu primera operación!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </>
        )}

        {/* 👥 AUDIENCIA Y DEMOGRAFÍA - MÓVIL OPTIMIZADO */}
        {activeTab === "audiencia" && (
          <section className="space-y-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl md:text-4xl font-black text-[#003566] italic uppercase">AUDIENCIA</h1>
              <p className="text-[8px] md:text-sm text-slate-500 mt-1 md:mt-2">Análisis completo - Enero 2026</p>
            </div>

            {/* GÉNERO - MÓVIL OPTIMIZADO */}
            <div className="bg-white rounded-xl md:rounded-[40px] shadow-xl p-4 md:p-8 border-2 border-slate-300">
              <div className="flex items-center mb-4 md:mb-6">
                <div className="text-3xl md:text-5xl mr-2 md:mr-4">👥</div>
                <h2 className="text-lg md:text-2xl font-black text-[#003566] uppercase">GÉNERO</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="flex justify-center">
                  <div className="relative w-32 md:w-64 h-32 md:h-64">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 md:w-48 h-24 md:h-48 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
                        <span className="text-lg md:text-3xl font-black text-white">67.1%</span>
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-18 md:w-36 h-18 md:h-36 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                        <span className="text-sm md:text-2xl font-black text-white">32.9%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {DEMOGRAPHICS.gender.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[8px] md:text-sm font-bold">
                        <span>{item.label}</span>
                        <span>{item.value}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 md:h-4">
                        <div 
                          className={`${item.color} h-2 md:h-4 rounded-full transition-all duration-700`}
                          style={{ width: `${item.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 p-3 md:p-4 bg-blue-50 rounded-lg md:rounded-2xl border border-blue-200">
                    <p className="font-bold text-[8px] md:text-sm text-blue-800">💡 INSIGHT:</p>
                    <p className="text-[7px] md:text-sm mt-1">
                      67.1% femenina. Contenido emocional con testimonios familiares tiene 42% más engagement.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RANGO DE EDAD - MÓVIL OPTIMIZADO */}
            <div className="bg-white rounded-xl md:rounded-[40px] shadow-xl p-4 md:p-8 border-2 border-slate-300">
              <div className="flex items-center mb-4 md:mb-6">
                <div className="text-3xl md:text-5xl mr-2 md:mr-4">🎂</div>
                <h2 className="text-lg md:text-2xl font-black text-[#003566] uppercase">EDAD</h2>
              </div>
              
              <div className="space-y-3">
                {DEMOGRAPHICS.age.map((item, idx) => (
                  <div key={idx} className={`p-3 md:p-4 rounded-lg md:rounded-2xl ${
                    item.highlight ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200' : 'bg-slate-50'
                  }`}>
                    <div className="flex justify-between mb-1 md:mb-2">
                      <span className="font-bold text-[8px] md:text-sm">{item.range}</span>
                      <span className={`font-black text-[10px] md:text-base ${item.highlight ? 'text-blue-600' : 'text-slate-600'}`}>{item.percent}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 md:h-3">
                      <div 
                        className={`h-1.5 md:h-3 rounded-full ${item.highlight ? 'bg-blue-600' : 'bg-slate-400'} transition-all duration-700`}
                        style={{ width: `${item.percent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PAÍSES - MÓVIL OPTIMIZADO */}
            <div className="bg-white rounded-xl md:rounded-[40px] shadow-xl p-4 md:p-8 border-2 border-slate-300">
              <div className="flex items-center mb-4 md:mb-6">
                <div className="text-3xl md:text-5xl mr-2 md:mr-4">🌎</div>
                <h2 className="text-lg md:text-2xl font-black text-[#003566] uppercase">PAÍSES TOP</h2>
              </div>
              
              <div className="space-y-3">
                {DEMOGRAPHICS.countries.map((country, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="w-8 md:w-12 h-8 md:h-12 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center mr-2 md:mr-4 text-xl md:text-3xl border-2 border-white shadow">
                      {country.flag}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-1">
                        <span className="font-bold text-[8px] md:text-sm truncate">{country.name}</span>
                        <span className="font-black text-[10px] md:text-base text-blue-600">{country.percent}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 md:h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1.5 md:h-3 rounded-full"
                          style={{ width: `${country.percent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 📱 RENDIMIENTO POR FORMATO - MÓVIL OPTIMIZADO */}
        {activeTab === "estrategia" && (
          <section className="space-y-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl md:text-4xl font-black text-[#003566] italic uppercase">FORMATOS</h1>
              <p className="text-[8px] md:text-sm text-slate-500 mt-1 md:mt-2">Análisis estratégico - Enero 2026</p>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-6">
              {Object.entries(FORMAT_STATS).map(([format, stats], idx) => (
                <div key={idx} className={`${stats.color} p-4 md:p-8 rounded-xl md:rounded-[40px] shadow-2xl text-white`}>
                  <div className="text-4xl md:text-6xl mb-2 md:mb-4">
                    {format === "Foto" ? "🖼️" : format === "Reels" ? "🎬" : "📱"}
                  </div>
                  <h3 className="text-lg md:text-2xl font-black mb-2">{format}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-3 md:mt-4">
                    <div>
                      <p className="text-[7px] md:text-sm opacity-80">Publicaciones</p>
                      <p className="text-xl md:text-3xl font-black">{stats.count}</p>
                    </div>
                    <div>
                      <p className="text-[7px] md:text-sm opacity-80">Vistas</p>
                      <p className="text-xl md:text-3xl font-black">{stats.views.toFixed(1)}M</p>
                    </div>
                    <div>
                      <p className="text-[7px] md:text-sm opacity-80">Ingresos</p>
                      <p className="text-xl md:text-3xl font-black">${stats.revenue.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-[7px] md:text-sm opacity-80">RPM</p>
                      <p className="text-lg md:text-2xl font-black">${stats.rpm.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 📈 COMPARATIVA HISTÓRICA - MÓVIL OPTIMIZADO */}
        {activeTab === "historico" && (
          <section className="space-y-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl md:text-4xl font-black text-[#003566] italic uppercase">ENERO 2026</h1>
              <p className="text-[8px] md:text-sm text-slate-500 mt-1 md:mt-2">Análisis detallado - 31 días</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-4 md:p-8 rounded-xl md:rounded-[40px] shadow-2xl text-white mb-6">
              <div className="text-center">
                <div className="text-4xl md:text-8xl font-black mb-2 md:mb-4">${eneroRevenue.toFixed(2)}</div>
                <h2 className="text-lg md:text-3xl font-black mb-2 md:mb-3">INGRESOS TOTALES</h2>
                <p className="text-[8px] md:text-xl mb-3 md:mb-6 opacity-90">{eneroViews.toFixed(1)}M vistas</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-8 text-center">
                  <div className="p-2 md:p-4">
                    <p className="text-[7px] md:text-sm opacity-90">RPM</p>
                    <p className="text-lg md:text-3xl font-black">${(eneroRevenue/eneroViews).toFixed(2)}</p>
                  </div>
                  <div className="p-2 md:p-4">
                    <p className="text-[7px] md:text-sm opacity-90">MEJOR DÍA</p>
                    <p className="text-lg md:text-3xl font-black">${bestDay.revenue.toFixed(0)}</p>
                  </div>
                  <div className="p-2 md:p-4">
                    <p className="text-[7px] md:text-sm opacity-90">CONVERSIÓN</p>
                    <p className="text-lg md:text-3xl font-black">{conversionRate.toFixed(0)}/M</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl md:rounded-[40px] shadow-2xl p-4 md:p-8 border-2 border-slate-300">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-8 gap-3">
                <h2 className="text-xl md:text-3xl font-black text-[#003566] uppercase italic tracking-tighter">Registro Enero</h2>
                <div className="text-[8px] md:text-sm text-slate-500 text-right">
                  31 días • ${eneroRevenue.toFixed(2)}
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <div className="min-w-[600px] md:min-w-0">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[#003566] text-[7px] md:text-[10px] font-black uppercase bg-slate-50">
                        <th className="p-2 md:p-4">Día</th>
                        <th className="p-2 md:p-4">Fecha</th>
                        <th className="p-2 md:p-4">Titular</th>
                        <th className="p-2 md:p-4">Formato</th>
                        <th className="p-2 md:p-4">Vistas</th>
                        <th className="p-2 md:p-4">Caja</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {ENERO_DATA.map((item) => (
                        <tr key={item.day} className={`hover:bg-slate-50 transition-colors ${
                          item.revenue > 50 ? 'bg-green-50/50' : ''
                        }`}>
                          <td className="p-2 md:p-4 font-bold text-[8px] md:text-sm text-slate-400 whitespace-nowrap">Día {item.day}</td>
                          <td className="p-2 md:p-4 text-[8px] md:text-sm text-slate-500 whitespace-nowrap">{item.date.split("-").reverse().join("/")}</td>
                          <td className="p-2 md:p-4 font-black text-[7px] md:text-sm text-[#003566] uppercase truncate max-w-[120px] md:max-w-md italic" title={item.topic}>{item.topic}</td>
                          <td className="p-2 md:p-4 font-bold text-[8px] md:text-sm whitespace-nowrap">{item.format}</td>
                          <td className="p-2 md:p-4 font-black text-[10px] md:text-base text-blue-600 whitespace-nowrap">{item.views}M</td>
                          <td className="p-2 md:p-4 font-black text-[10px] md:text-base text-green-600 whitespace-nowrap">${item.revenue.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* PROYECCIÓN ESTRATÉGICA - MÓVIL OPTIMIZADO */}
        {activeTab === "dashboard" && (
          <section className="bg-[#003566] p-4 md:p-8 rounded-xl md:rounded-[50px] shadow-2xl text-white border-b-4 md:border-b-[12px] border-slate-400">
            <h2 className="text-lg md:text-2xl font-black italic uppercase text-center mb-4 md:mb-8 opacity-40">Proyección</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
               <div className="text-center bg-white/5 p-3 md:p-8 rounded-lg md:rounded-3xl border border-white/10">
                 <p className="text-[7px] md:text-[10px] font-black opacity-50 uppercase mb-1 md:mb-2 tracking-widest">Meta Diaria</p>
                 <p className="text-2xl md:text-5xl font-black italic text-green-400">${dailyTarget > 0 ? dailyTarget.toFixed(2) : "0.00"}</p>
               </div>
               <div className="text-center bg-white/5 p-3 md:p-8 rounded-lg md:rounded-3xl border border-white/10">
                 <p className="text-[7px] md:text-[10px] font-black opacity-50 uppercase mb-1 md:mb-2 tracking-widest">Días Restantes</p>
                 <p className="text-2xl md:text-5xl font-black italic text-blue-300">{daysLeft}</p>
               </div>
               <div className="text-center bg-white/5 p-3 md:p-8 rounded-lg md:rounded-3xl border border-white/10">
                 <p className="text-[7px] md:text-[10px] font-black opacity-50 uppercase mb-1 md:mb-2 tracking-widest">Ingreso Actual</p>
                 <p className="text-2xl md:text-5xl font-black italic text-slate-200">${totalRevenue.toFixed(2)}</p>
               </div>
               <div className="text-center bg-white/5 p-3 md:p-8 rounded-lg md:rounded-3xl border border-white/10">
                 <p className="text-[7px] md:text-[10px] font-black opacity-50 uppercase mb-1 md:mb-2 tracking-widest">Promedio Diario</p>
                 <p className="text-2xl md:text-5xl font-black italic text-yellow-300">${avgRevenue.toFixed(2)}</p>
               </div>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}