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

// 📊 DATOS REALES RECUPERADOS DE ENERO 2026
const ENERO_DATA = [
  { day: 1, date: "2026-01-01", views: 0.76, revenue: 7.85, topic: "🚫 PROHIBIDO QUEJARSE EN ESTE 2026", format: "Foto" },
  { day: 2, date: "2026-01-02", views: 0.78, revenue: 8.04, topic: "🚨 ¡LA TIERRA SE MOVIÓ, PERO DIOS ES NUESTRA ROCA!", format: "Foto" },
  { day: 3, date: "2026-01-03", views: 2.01, revenue: 20.83, topic: "NOTICIA DE ÚLTIMA HORA: TRUMP", format: "Foto" },
  { day: 4, date: "2026-01-04", views: 0.78, revenue: 12.8, topic: "😭 MATARON A MI HIJO Y QUEMARON MI IGLESIA", format: "Foto" },
  { day: 5, date: "2026-01-05", views: 13.07, revenue: 103.96, topic: "😭 NO GRITARON DE MIEDO... SUSURRARON EL NOMBRE DE JESÚS", format: "Foto" },
  { day: 6, date: "2026-01-06", views: 6.24, revenue: 51.84, topic: "😭 DE RODILLAS ESPERANDO EL FIN...", format: "Foto" },
  { day: 7, date: "2026-01-07", views: 5.3, revenue: 44.32, topic: "💔 ¿CUÁNTAS BIBLIAS TIENES EN TU CASA QUE NO ABRES?", format: "Foto" },
  { day: 8, date: "2026-01-08", views: 6.86, revenue: 61.68, topic: "💔🇪🇨 LLEGARON CON ENGAÑOS", format: "Foto" },
  { day: 9, date: "2026-01-09", views: 4.32, revenue: 45.48, topic: "50 AÑOS DE CÁRCEL POR ORAR? 😱", format: "Reels" },
  { day: 10, date: "2026-01-10", views: 5.3, revenue: 37.98, topic: "⚠️ PREFIERE LA MUERTE ANTES QUE VER A SUS HIJOS", format: "Foto" },
  { day: 11, date: "2026-01-11", views: 9.19, revenue: 84.27, topic: "🏟️ CALIFORNIA: 50,000 ALMAS", format: "Foto" },
  { day: 12, date: "2026-01-12", views: 3.22, revenue: 31.96, topic: "⚠️ IRÁN SE HA CONVERTIDO EN UN VALLE DE LÁGRIMAS", format: "Foto" },
  { day: 13, date: "2026-01-13", views: 2.02, revenue: 22.29, topic: "🌊 🇧🇷 CREÍAN QUE ESTABA SOLO CONTRA EL MAR", format: "Foto" },
  { day: 14, date: "2026-01-14", views: 2.06, revenue: 21.54, topic: "😭 ¿SU DELITO? QUERER UN FUTURO MEJOR", format: "Foto" },
  { day: 15, date: "2026-01-15", views: 2.68, revenue: 23.74, topic: "🚨 CHINA ENVÍA FUERZAS ESPECIALES", format: "Foto" },
  { day: 16, date: "2026-01-16", views: 0.93, revenue: 8.16, topic: "🛑 LE DIJERON QUE SU CÁNCER ERA TERMINAL", format: "Foto" },
  { day: 17, date: "2026-01-17", views: 7.51, revenue: 60.45, topic: "😭 NOS ATARON LAS MANOS... Y CERRAMOS LOS OJOS", format: "Foto" },
  { day: 18, date: "2026-01-18", views: 2.93, revenue: 25.13, topic: "🚫 LÉELO ANTES DE PONER UNA EXCUSA PARA NO IR AL CULTO", format: "Foto" },
  { day: 19, date: "2026-01-19", views: 4.59, revenue: 43.14, topic: "🛑 LA ORDEN DE DISPARAR YA ESTABA DADA...", format: "Foto" },
  { day: 20, date: "2026-01-20", views: 4.53, revenue: 46.21, topic: "🚫 IBA A DARLE MUERTE ... PERO ALGUIEN SE INTERPUSO", format: "Foto" },
  { day: 21, date: "2026-01-21", views: 2.13, revenue: 16.41, topic: "¡ESTABA ATADO, GOLPEADO Y A PUNTO DE MORIR...", format: "Foto" },
  { day: 22, date: "2026-01-22", views: 1.08, revenue: 9.99, topic: "¡MIENTRAS EL MUNDO LO NIEGA, UNA NACIÓN ENTERA", format: "Foto" },
  { day: 23, date: "2026-01-23", views: 1.09, revenue: 12.67, topic: "¡LA PEOR OLA EN 30 AÑOS... PRISIÓN", format: "Foto" },
  { day: 24, date: "2026-01-24", views: 2.02, revenue: 21.03, topic: "😱¡YA ESTABAN ALINEADOS FRENTE AL POZO...", format: "Foto" },
  { day: 25, date: "2026-01-25", views: 8.32, revenue: 70.59, topic: "ELLOS PAGAN CON SANGRE POR IR AL CULTO...", format: "Foto" },
  { day: 26, date: "2026-01-26", views: 4.76, revenue: 41.61, topic: "LA POLICÍA DIJO AQUÍ NO PASA NADA...", format: "Foto" },
  { day: 27, date: "2026-01-27", views: 3.05, revenue: 27.5, topic: "EL GOLPE EN LA PUERTA QUE TODA FAMILIA TEME", format: "Foto" },
  { day: 28, date: "2026-01-28", views: 1.56, revenue: 14.83, topic: "SU PROFESOR LE ORDENÓ: ESCONDE ESA CRUZ", format: "Foto" },
  { day: 29, date: "2026-01-29", views: 1.19, revenue: 10.86, topic: "DORMÍAN TRANQUILOS... Y DESPERTARON EN LA ETERNIDAD", format: "Foto" },
  { day: 30, date: "2026-01-30", views: 0.95, revenue: 11.47, topic: "¿QUIÉNES ERAN ESOS HOMBRES?", format: "Foto" },
  { day: 31, date: "2026-01-31", views: 1.83, revenue: 21.2, topic: "DICEN QUE EN CALIFORNIA YA NO CREEN EN DIOS...", format: "Foto" }
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

  const todayDay = new Date().getDate();
  const sameDayEnero = ENERO_DATA.find(item => item.day === todayDay);

  const getRecommendations = () => {
    const topPerformers = [...ENERO_DATA].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
    const weekendContent = ENERO_DATA.filter(item => {
      const date = new Date(item.date);
      return date.getDay() === 0 || date.getDay() === 6;
    }).sort((a, b) => b.revenue - a.revenue)[0];
    return { topPerformers, weekendContent, dayOfWeek: new Date().getDay() };
  };

  const recommendations = getRecommendations();
  const filteredData = data.filter(item => item.date.split("-")[1] === activeTab);

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

  const eneroRevenue = ENERO_DATA.reduce((sum, item) => sum + item.revenue, 0);
  const eneroViews = ENERO_DATA.reduce((sum, item) => sum + item.views, 0);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 border-[10px] border-[#003566]">
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
        {activeTab === "02" && showAlerts && sameDayEnero && (
          <section className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-[40px] shadow-2xl text-white mb-8 animate-fade-in">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-3">🚨</span>
                  <h2 className="text-2xl font-black uppercase">ALERTA ESTRATÉGICA</h2>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-4">
                  <p className="text-sm font-bold opacity-90 mb-3">EL MISMO DÍA DE ENERO PUBLICASTE:</p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white/5 p-4 rounded-xl text-center"><p className="text-xs opacity-70">TEMA</p><p className="font-black truncate">{sameDayEnero.topic}</p></div>
                    <div className="bg-white/5 p-4 rounded-xl text-center"><p className="text-xs opacity-70">VISTAS</p><p className="font-black text-2xl">{sameDayEnero.views}M</p></div>
                    <div className="bg-white/5 p-4 rounded-xl text-center"><p className="text-xs opacity-70">INGRESOS</p><p className="font-black text-2xl text-green-300">${sameDayEnero.revenue}</p></div>
                    <div className="bg-white/5 p-4 rounded-xl text-center"><p className="text-xs opacity-70">FORMATO</p><p className="font-black">{sameDayEnero.format}</p></div>
                  </div>
                </div>
                <div className="bg-white/20 rounded-2xl p-5"><p className="font-bold">🎯 CONSEJO: Replica este éxito hoy usando el formato {sameDayEnero.format}.</p></div>
              </div>
              <button onClick={() => setShowAlerts(false)} className="text-2xl font-black">✕</button>
            </div>
          </section>
        )}

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-[40px] text-white">
            <h2 className="text-2xl font-black uppercase mb-6">ENERO 2026 (CIERRE REAL)</h2>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/10 p-6 rounded-2xl"><p className="text-xs opacity-70">REVENUE</p><p className="text-4xl font-black">${eneroRevenue.toFixed(2)}</p></div>
              <div className="bg-white/10 p-6 rounded-2xl"><p className="text-xs opacity-70">VISTAS</p><p className="text-4xl font-black">{eneroViews.toFixed(1)}M</p></div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-800 p-8 rounded-[40px] text-white">
            <h2 className="text-2xl font-black uppercase mb-6">FEBRERO (EN MARCHA)</h2>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/10 p-6 rounded-2xl"><p className="text-xs opacity-70">ACTUAL</p><p className="text-4xl font-black">${totalRevenue.toFixed(2)}</p></div>
              <div className="bg-white/10 p-6 rounded-2xl"><p className="text-xs opacity-70">META PROG.</p><p className="text-4xl font-black">{((totalRevenue/1250)*100).toFixed(1)}%</p></div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-[40px] shadow-xl p-8 border border-slate-200">
          <h2 className="text-2xl font-black text-[#003566] mb-6 uppercase">📝 Registrar Datos</h2>
          <form onSubmit={saveData} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="p-4 rounded-2xl bg-slate-50 border-2 font-bold" />
            <input placeholder="VISTAS (MILLONES)" type="number" step="0.01" value={formData.views} onChange={(e) => setFormData({...formData, views: e.target.value})} className="p-4 rounded-2xl bg-slate-50 border-2 font-bold" />
            <input placeholder="CAJA (USD)" type="number" step="0.01" value={formData.revenue} onChange={(e) => setFormData({...formData, revenue: e.target.value})} className="p-4 rounded-2xl bg-green-50 border-2 font-black text-green-700" />
            <input placeholder="TITULAR" value={formData.topic} onChange={(e) => setFormData({...formData, topic: e.target.value})} className="md:col-span-2 p-4 rounded-2xl bg-slate-50 border-2 font-bold uppercase" />
            <select value={formData.format} onChange={(e) => setFormData({...formData, format: e.target.value})} className="p-4 rounded-2xl bg-slate-50 border-2 font-bold">
              {FORMATS.map(f => <option key={f.value} value={f.value}>{f.icon} {f.label}</option>)}
            </select>
            <button type="submit" className="md:col-span-3 bg-[#003566] p-6 rounded-[30px] text-white font-black text-2xl shadow-xl italic">SINCRONIZAR 📊</button>
          </form>
        </section>

        <section className="bg-white rounded-[40px] shadow-2xl p-8 border border-slate-200">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black text-[#003566] uppercase">Bitácora</h2>
            <div className="bg-slate-100 p-2 rounded-2xl flex gap-2">
              <button onClick={() => setActiveTab("02")} className={`px-6 py-2 rounded-xl font-black ${activeTab === "02" ? "bg-[#003566] text-white" : "text-slate-500"}`}>FEBRERO</button>
              <button onClick={() => setActiveTab("01")} className={`px-6 py-2 rounded-xl font-black ${activeTab === "01" ? "bg-[#003566] text-white" : "text-slate-500"}`}>ENERO (REAL)</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b-4"><th className="p-4 uppercase">Fecha</th><th className="p-4 uppercase">Tema</th><th className="p-4 uppercase">Vistas</th><th className="p-4 uppercase">Caja</th><th className="p-4 text-right uppercase">Acción</th></tr></thead>
              <tbody>
                {(activeTab === "01" ? ENERO_DATA : filteredData).map((item, idx) => (
                  <tr key={idx} className="hover:bg-blue-50">
                    <td className="p-4 font-bold">{item.date.split("-").reverse().slice(0,2).join("/")}</td>
                    <td className="p-4 font-black text-[#003566] uppercase truncate max-w-xs">{item.topic}</td>
                    <td className="p-4 font-black text-blue-600">{activeTab === "01" ? `${item.views}M` : formatNumber(item.views)}</td>
                    <td className="p-4 font-black text-green-600 text-xl">${Number(item.revenue).toFixed(2)}</td>
                    <td className="p-4 text-right">{activeTab === "02" && <button onClick={() => deleteRow(item.id)}>🗑️</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}