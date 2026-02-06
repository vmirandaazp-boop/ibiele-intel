import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://stenaxhdsfxrzhetetiz.supabase.co";
const supabaseAnonKey = "sb_publishable_Sk2d6wvlqXrwLKfBEfS8fw_t5PfImJN";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const FORMATS = [
  { value: "Foto", label: "Foto", icon: "🖼️" },
  { value: "Reels", label: "Reels", icon: "🎬" },
  { value: "Enlaces", label: "Enlaces", icon: "🔗" },
  { value: "Historias", label: "Historias", icon: "📱" }
];

// 📊 DATOS HISTÓRICOS DE ENERO 2026 (Simulados para demostración)
const ENERO_DATA = [
  { day: 1, date: "2026-01-01", views: 2.3, revenue: 45.20, topic: "AÑO NUEVO BENDICIONES", format: "Reels" },
  { day: 2, date: "2026-01-02", views: 1.8, revenue: 32.50, topic: "TESTIMONIO MILAGRO", format: "Foto" },
  { day: 3, date: "2026-01-03", views: 3.1, revenue: 58.75, topic: "ORACIÓN PODEROSA", format: "Reels" },
  { day: 4, date: "2026-01-04", views: 1.5, revenue: 28.30, topic: "DEVOCIONAL MAÑANA", format: "Foto" },
  { day: 5, date: "2026-01-05", views: 2.7, revenue: 51.20, topic: "SANIDAD DIVINA", format: "Reels" },
  { day: 6, date: "2026-01-06", views: 4.2, revenue: 78.50, topic: "REYES MAGOS FE", format: "Foto" },
  { day: 7, date: "2026-01-07", views: 1.9, revenue: 35.80, topic: "MARTIR CRISTIANO", format: "Reels" },
  { day: 8, date: "2026-01-08", views: 2.5, revenue: 47.30, topic: "PREDICA PODER", format: "Foto" },
  { day: 9, date: "2026-01-09", views: 3.8, revenue: 71.25, topic: "MIRÁ MAMÁ ESTOY VIVO", format: "Reels" },
  { day: 10, date: "2026-01-10", views: 2.1, revenue: 39.50, topic: "FE EN TIEMPOS DUROS", format: "Foto" },
  { day: 11, date: "2026-01-11", views: 3.4, revenue: 63.80, topic: "TESTIMONIO CONVERSIÓN", format: "Reels" },
  { day: 12, date: "2026-01-12", views: 1.7, revenue: 31.90, topic: "PALABRA DEL DÍA", format: "Foto" },
  { day: 13, date: "2026-01-13", views: 4.5, revenue: 84.20, topic: "ESTADIO LLENO ORACIÓN", format: "Reels" },
  { day: 14, date: "2026-01-14", views: 2.8, revenue: 52.60, topic: "AMOR DE DIOS", format: "Foto" },
  { day: 15, date: "2026-01-15", views: 3.6, revenue: 67.40, topic: "MILAGRO SANIDAD", format: "Reels" },
  { day: 16, date: "2026-01-16", views: 2.2, revenue: 41.30, topic: "DEVOCIONAL TARDE", format: "Foto" },
  { day: 17, date: "2026-01-17", views: 5.1, revenue: 95.80, topic: "MATARON A MI HIJO", format: "Reels" },
  { day: 18, date: "2026-01-18", views: 2.4, revenue: 45.10, topic: "FE INQUEBRANTABLE", format: "Foto" },
  { day: 19, date: "2026-01-19", views: 3.2, revenue: 60.20, topic: "ORACIÓN NOCTURNA", format: "Reels" },
  { day: 20, date: "2026-01-20", views: 1.6, revenue: 29.80, topic: "VERSÍCULO PODER", format: "Foto" },
  { day: 21, date: "2026-01-21", views: 4.8, revenue: 89.50, topic: "MARTIR POR CRISTO", format: "Reels" },
  { day: 22, date: "2026-01-22", views: 2.6, revenue: 48.90, topic: "PREDICA MAÑANA", format: "Foto" },
  { day: 23, date: "2026-01-23", views: 3.9, revenue: 73.10, topic: "TESTIMONIO VIDA", format: "Reels" },
  { day: 24, date: "2026-01-24", views: 2.0, revenue: 37.60, topic: "FE Y ESPERANZA", format: "Foto" },
  { day: 25, date: "2026-01-25", views: 5.3, revenue: 99.20, topic: "ESTADIO LLENO 2026", format: "Reels" },
  { day: 26, date: "2026-01-26", views: 2.9, revenue: 54.30, topic: "ORACIÓN FAMILIA", format: "Foto" },
  { day: 27, date: "2026-01-27", views: 4.1, revenue: 76.80, topic: "MILAGRO HOY", format: "Reels" },
  { day: 28, date: "2026-01-28", views: 2.3, revenue: 43.20, topic: "PALABRA VIVA", format: "Foto" },
  { day: 29, date: "2026-01-29", views: 4.7, revenue: 87.90, topic: "TESTIMONIO PODER", format: "Reels" },
  { day: 30, date: "2026-01-30", views: 3.0, revenue: 56.10, topic: "FE EN ACCIÓN", format: "Foto" },
  { day: 31, date: "2026-01-31", views: 5.5, revenue: 102.50, topic: "CIERRE MES BENDICIÓN", format: "Reels" }
];

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [time, setTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("02");
  const [showAlerts, setShowAlerts] = useState(true);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    revenue: "",
    views: "",
    interactions: "",
    followers: "",
    format: "Reels",
    topic: ""
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: metrics, error } = await supabase
        .from("metrics")
        .select("*")
        .order('date', { ascending: false });
      if (error) throw error;
      setData(metrics || []);
    } catch (err) {
      setError("Fallo en conexión");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const saveData = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("metrics").insert([{
        ...formData,
        revenue: parseFloat(formData.revenue) || 0,
        views: (parseFloat(formData.views) || 0) * 1000000,
        interactions: (parseFloat(formData.interactions) || 0) * 1000,
        followers: parseFloat(formData.followers) || 0,
        topic: formData.topic.toUpperCase()
      }]);
      if (error) throw error;
      setFormData({ ...formData, revenue: "", views: "", interactions: "", followers: "", topic: "" });
      await loadData();
    } catch (err) { setError("Error al guardar"); }
  };

  const deleteRow = async (id) => {
    if(window.confirm("¿BORRAR REGISTRO DEL IMPERIO?")) {
      const { error } = await supabase.from("metrics").delete().eq('id', id);
      if (!error) loadData();
    }
  };

  // --- DATOS DEL MISMO DÍA EN ENERO ---
  const todayDay = new Date().getDate();
  const sameDayEnero = ENERO_DATA.find(item => item.day === todayDay);

  // --- RECOMENDACIONES INTELIGENTES ---
  const getRecommendations = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Domingo, 6=Sábado
    
    const topPerformers = [...ENERO_DATA]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    
    const weekendContent = ENERO_DATA.filter(item => {
      const date = new Date(item.date);
      return date.getDay() === 0 || date.getDay() === 6; // Domingo o Sábado
    }).sort((a, b) => b.revenue - a.revenue)[0];

    return {
      topPerformers,
      weekendContent,
      dayOfWeek
    };
  };

  const recommendations = getRecommendations();

  // --- FILTRADO POR MES ---
  const filteredData = data.filter(item => item.date.split("-")[1] === activeTab);

  // --- CÁLCULOS ---
  const totalRevenue = filteredData.reduce((sum, item) => sum + (Number(item.revenue) || 0), 0);
  const totalViews = filteredData.reduce((sum, item) => sum + (Number(item.views) || 0), 0);
  const daysInMonth = new Date(2026, parseInt(activeTab), 0).getDate();
  const daysPassed = activeTab === "02" ? new Date().getDate() : daysInMonth;
  const daysLeft = daysInMonth - daysPassed;
  const dailyTarget = (1250 - totalRevenue) / (daysLeft || 1);
  const avgRevenue = daysPassed > 0 ? totalRevenue / daysPassed : 0;

  const formatNumber = (num) => {
    const n = Number(num) || 0;
    if (n >= 1000000) return `${(n/1000000).toFixed(2)}M`;
    if (n >= 1000) return `${(n/1000).toFixed(1)}K`;
    return n.toLocaleString();
  };

  // --- ESTADÍSTICAS DE ENERO ---
  const eneroRevenue = ENERO_DATA.reduce((sum, item) => sum + item.revenue, 0);
  const eneroViews = ENERO_DATA.reduce((sum, item) => sum + item.views, 0);
  const eneroAvgDaily = eneroRevenue / 31;

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 border-[10px] border-[#003566]">
      
      {/* HEADER AZUL IMPERIAL */}
      <header className="bg-[#003566] text-white p-6 shadow-2xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">IBIELE TV <span className="text-blue-400">INTEL</span></h1>
            <p className="text-xs font-bold opacity-80 mt-1 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              {time.toLocaleTimeString()} • MANDO ESTRATÉGICO
            </p>
          </div>
          <div className="bg-white/10 p-4 rounded-2xl border border-white/20 text-center">
             <p className="text-[10px] font-black uppercase opacity-60">Revenue {activeTab === "02" ? "Feb" : "Ene"}</p>
             <p className="text-2xl font-black text-green-400">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        
        {/* 🚨 ALERTAS INTELIGENTES - LO QUE FUNCIONÓ HOY EN ENERO */}
        {activeTab === "02" && showAlerts && sameDayEnero && (
          <section className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-[40px] shadow-2xl text-white mb-8 animate-fade-in">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-3">🚨</span>
                  <h2 className="text-2xl font-black uppercase">ALERTA ESTRATÉGICA</h2>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-4">
                  <p className="text-sm font-bold opacity-90 mb-3">HOY {todayDay} DE ENERO SE PUBLICÓ:</p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                      <p className="text-xs opacity-70 mb-1">TEMA</p>
                      <p className="font-black text-lg">{sameDayEnero.topic}</p>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                      <p className="text-xs opacity-70 mb-1">VISTAS</p>
                      <p className="font-black text-2xl text-blue-300">{sameDayEnero.views}M</p>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                      <p className="text-xs opacity-70 mb-1">INGRESOS</p>
                      <p className="font-black text-2xl text-green-300">${sameDayEnero.revenue}</p>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                      <p className="text-xs opacity-70 mb-1">FORMATO</p>
                      <p className="font-black text-xl">{sameDayEnero.format}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/20 rounded-2xl p-5">
                  <p className="font-bold text-lg mb-3">🎯 RECOMENDACIÓN:</p>
                  <p className="text-sm opacity-95">
                    Publica contenido similar al de hoy en Enero: <span className="font-black">{sameDayEnero.topic}</span>. 
                    Este tema generó <span className="font-black">${sameDayEnero.revenue}</span> con {sameDayEnero.views}M vistas. 
                    Usa formato <span className="font-black">{sameDayEnero.format}</span> para maximizar resultados.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowAlerts(false)}
                className="ml-4 bg-white/20 hover:bg-white/30 p-3 rounded-xl transition text-2xl font-black"
              >
                ✕
              </button>
            </div>
          </section>
        )}

        {/* 📊 PANEL COMPARATIVO ENERO vs FEBRERO */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-[40px] shadow-2xl text-white">
            <div className="flex items-center mb-6">
              <span className="text-4xl mr-3">📊</span>
              <h2 className="text-2xl font-black uppercase">ENERO 2026 (HISTÓRICO)</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center bg-white/10 p-6 rounded-2xl">
                <p className="text-xs opacity-70 mb-2">INGRESOS TOTALES</p>
                <p className="text-4xl font-black">${eneroRevenue.toFixed(2)}</p>
              </div>
              <div className="text-center bg-white/10 p-6 rounded-2xl">
                <p className="text-xs opacity-70 mb-2">VISUALIZACIONES</p>
                <p className="text-4xl font-black">{eneroViews.toFixed(1)}M</p>
              </div>
              <div className="text-center bg-white/10 p-6 rounded-2xl">
                <p className="text-xs opacity-70 mb-2">PROMEDIO DIARIO</p>
                <p className="text-4xl font-black">${eneroAvgDaily.toFixed(2)}</p>
              </div>
              <div className="text-center bg-white/10 p-6 rounded-2xl">
                <p className="text-xs opacity-70 mb-2">MEJOR DÍA</p>
                <p className="text-2xl font-black">31 Ene</p>
                <p className="text-xl">${Math.max(...ENERO_DATA.map(d => d.revenue)).toFixed(2)}</p>
              </div>
            </div>
            
            <div className="mt-6 bg-white/5 p-5 rounded-2xl">
              <p className="text-xs font-bold opacity-70 mb-3">TOP 3 TEMAS MÁS RENTABLES:</p>
              <ul className="space-y-2">
                {ENERO_DATA.sort((a,b) => b.revenue - a.revenue).slice(0,3).map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center text-sm">
                    <span className="font-bold">{idx + 1}. {item.topic}</span>
                    <span className="font-black text-green-300">${item.revenue}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-600 to-green-800 p-8 rounded-[40px] shadow-2xl text-white">
            <div className="flex items-center mb-6">
              <span className="text-4xl mr-3">📈</span>
              <h2 className="text-2xl font-black uppercase">FEBRERO 2026 (ACTUAL)</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center bg-white/10 p-6 rounded-2xl">
                <p className="text-xs opacity-70 mb-2">INGRESOS ACTUALES</p>
                <p className="text-4xl font-black">${totalRevenue.toFixed(2)}</p>
              </div>
              <div className="text-center bg-white/10 p-6 rounded-2xl">
                <p className="text-xs opacity-70 mb-2">VISUALIZACIONES</p>
                <p className="text-4xl font-black">{(totalViews/1000000).toFixed(1)}M</p>
              </div>
              <div className="text-center bg-white/10 p-6 rounded-2xl">
                <p className="text-xs opacity-70 mb-2">PROMEDIO DIARIO</p>
                <p className="text-4xl font-black">${avgRevenue.toFixed(2)}</p>
              </div>
              <div className="text-center bg-white/10 p-6 rounded-2xl">
                <p className="text-xs opacity-70 mb-2">DÍAS RESTANTES</p>
                <p className="text-4xl font-black">{daysLeft}</p>
              </div>
            </div>
            
            <div className="mt-6 bg-white/5 p-5 rounded-2xl">
              <p className="text-xs font-bold opacity-70 mb-3">META: $1,250.00</p>
              <div className="w-full bg-white/10 rounded-full h-4 mb-3">
                <div 
                  className="bg-white h-4 rounded-full transition-all"
                  style={{ width: `${Math.min((totalRevenue/1250)*100, 100)}%` }}
                ></div>
              </div>
              <p className="text-sm text-center">
                Progreso: <span className="font-black">{((totalRevenue/1250)*100).toFixed(1)}%</span>
              </p>
            </div>
          </div>
        </section>

        {/* 💡 RECOMENDACIONES INTELIGENTES */}
        {activeTab === "02" && (
          <section className="bg-white rounded-[40px] shadow-xl p-8 border border-slate-200 mb-8">
            <div className="flex items-center mb-6">
              <span className="text-4xl mr-3">💡</span>
              <h2 className="text-2xl font-black text-[#003566] uppercase">ORÁCULO ESTRATÉGICO</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-2xl">
                <h3 className="font-black text-lg text-blue-800 mb-3">🎯 TOP 5 CONTENIDOS DE ENERO</h3>
                <div className="space-y-3">
                  {recommendations.topPerformers.map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-black text-blue-900">{idx + 1}. {item.topic}</p>
                          <p className="text-xs text-blue-600 mt-1">{item.date.split("-").reverse().join("/")}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-2xl text-green-600">${item.revenue}</p>
                          <p className="text-xs text-blue-500">{item.views}M vistas</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-2xl">
                <h3 className="font-black text-lg text-purple-800 mb-3">📅 ESTRATEGIA POR DÍA</h3>
                <div className="bg-white p-5 rounded-xl shadow-sm">
                  <p className="font-bold text-purple-900 mb-3">
                    {recommendations.dayOfWeek === 0 ? "🔥 HOY ES DOMINGO" : 
                     recommendations.dayOfWeek === 6 ? "🔥 HOY ES SÁBADO" : 
                     "📅 DÍA DE SEMANA"}
                  </p>
                  <p className="text-sm text-purple-700 mb-4">
                    {recommendations.dayOfWeek === 0 || recommendations.dayOfWeek === 6
                      ? `Los fines de semana rinden más. El mejor contenido fue: "${recommendations.weekendContent?.topic}" con $${recommendations.weekendContent?.revenue}`
                      : "Publica contenido de testimonios o milagros. Funcionan mejor entre semana."}
                  </p>
                  <div className="bg-purple-100 p-4 rounded-lg">
                    <p className="font-bold text-purple-900 text-sm">RECOMENDACIÓN HOY:</p>
                    <p className="text-xs text-purple-800 mt-2">
                      Publica entre 12:00-14:00. Usa formato Reels con temas de testimonios, 
                      milagros o eventos masivos. Evita contenido pasivo los fines de semana.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FORMULARIO */}
        <section className="bg-white rounded-[40px] shadow-xl p-8 border border-slate-200">
          <h2 className="text-2xl font-black text-[#003566] mb-6 italic uppercase tracking-tighter">📝 Registrar Operación</h2>
          <form onSubmit={saveData} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 font-bold outline-none focus:border-blue-500" />
            <input placeholder="MILLONES DE VISTAS" type="number" step="0.01" value={formData.views} onChange={(e) => setFormData({...formData, views: e.target.value})} className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 font-bold outline-none" />
            <input placeholder="CAJA (USD)" type="number" step="0.01" value={formData.revenue} onChange={(e) => setFormData({...formData, revenue: e.target.value})} className="p-4 rounded-2xl bg-green-50 border-2 border-green-100 font-black text-green-700 outline-none" />
            <input placeholder="TEMA / TITULAR" value={formData.topic} onChange={(e) => setFormData({...formData, topic: e.target.value})} className="md:col-span-2 p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 font-bold uppercase outline-none" />
            <select value={formData.format} onChange={(e) => setFormData({...formData, format: e.target.value})} className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 font-bold outline-none">
              {FORMATS.map(f => <option key={f.value} value={f.value}>{f.icon} {f.label}</option>)}
            </select>
            <button type="submit" className="md:col-span-3 bg-[#003566] p-6 rounded-[30px] text-white font-black text-2xl shadow-xl hover:bg-blue-800 active:scale-95 transition-all italic">SINCRONIZAR 📊</button>
          </form>
        </section>

        {/* BITÁCORA CON FILTRADO REAL */}
        <section className="bg-white rounded-[40px] shadow-2xl p-8 border border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-3xl font-black text-[#003566] italic uppercase">Bitácora</h2>
            <div className="bg-slate-100 p-2 rounded-2xl flex gap-2">
              <button onClick={() => setActiveTab("02")} className={`px-6 py-2 rounded-xl font-black transition ${activeTab === "02" ? "bg-[#003566] text-white" : "text-slate-500"}`}>FEBRERO</button>
              <button onClick={() => setActiveTab("01")} className={`px-6 py-2 rounded-xl font-black transition ${activeTab === "01" ? "bg-[#003566] text-white" : "text-slate-500"}`}>ENERO</button>
            </div>
          </div>

          {activeTab === "01" ? (
            // Vista de Enero con datos históricos
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-4 border-slate-100 bg-blue-50">
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Día</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Fecha</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Tema</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Vistas</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Ingresos</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Formato</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {ENERO_DATA.map((item) => (
                    <tr key={item.day} className="hover:bg-blue-50/50 transition-colors">
                      <td className="p-4 font-bold text-blue-600">Día {item.day}</td>
                      <td className="p-4 text-slate-500">{item.date.split("-").reverse().join("/")}</td>
                      <td className="p-4 font-black text-[#003566] italic uppercase">{item.topic}</td>
                      <td className="p-4 font-black text-blue-600">{item.views}M</td>
                      <td className="p-4 font-black text-green-600 text-xl">${item.revenue.toFixed(2)}</td>
                      <td className="p-4 font-bold text-slate-600">{item.format}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // Vista de Febrero con datos reales
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-4 border-slate-100">
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Fecha</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Tema</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Alcance</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Caja</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="p-4 font-bold text-slate-400">{item.date.split("-").reverse().slice(0,2).join("/") }</td>
                      <td className="p-4 font-black text-[#003566] italic uppercase">{item.topic}</td>
                      <td className="p-4 font-black text-blue-600">{formatNumber(item.views)}</td>
                      <td className="p-4 font-black text-green-600 text-xl">${(Number(item.revenue) || 0).toFixed(2)}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => deleteRow(item.id)} className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* PROYECCIÓN ESTRATÉGICA */}
        <section className="bg-[#10b981] p-8 rounded-[50px] shadow-2xl text-white">
          <h2 className="text-2xl font-black italic uppercase text-center mb-8 border-b border-white/20 pb-4">Proyección Estratégica {activeTab === "02" ? "Febrero" : "Enero"}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
             <div className="text-center bg-white/10 p-6 rounded-3xl">
               <p className="text-[10px] font-black opacity-70 uppercase mb-1">Meta Diaria Hoy</p>
               <p className="text-4xl font-black italic">${dailyTarget > 0 ? dailyTarget.toFixed(2) : "0.00"}</p>
             </div>
             <div className="text-center bg-white/10 p-6 rounded-3xl">
               <p className="text-[10px] font-black opacity-70 uppercase mb-1">Días Restantes</p>
               <p className="text-4xl font-black italic">{daysLeft}</p>
             </div>
             <div className="text-center bg-white/10 p-6 rounded-3xl">
               <p className="text-[10px] font-black opacity-70 uppercase mb-1">Ingresos Acum.</p>
               <p className="text-4xl font-black italic">${totalRevenue.toFixed(2)}</p>
             </div>
             <div className="text-center bg-white/10 p-6 rounded-3xl">
               <p className="text-[10px] font-black opacity-70 uppercase mb-1">Promedio Real</p>
               <p className="text-4xl font-black italic">${(totalRevenue/daysPassed || 0).toFixed(2)}</p>
             </div>
          </div>
        </section>
      </main>
    </div>
  );
}