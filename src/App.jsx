import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// --- CONFIGURACIÓN DE PODER ---
const supabaseUrl = "https://stenaxhdsfxrzhetetiz.supabase.co";
const supabaseAnonKey = "sb_publishable_Sk2d6wvlqXrwLKfBEfS8fw_t5PfImJN";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const FORMATS = [
  { value: "Foto", label: "Foto", icon: "🖼️" },
  { value: "Reels", label: "Reels", icon: "🎬" },
  { value: "Enlaces", label: "Enlaces", icon: "🔗" },
  { value: "Historias", label: "Historias", icon: "📱" }
];

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [time, setTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("febrero");
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    revenue: "",
    views: "",
    interactions: "",
    followers: "",
    format: "Reels",
    topic: ""
  });

  // Reloj en tiempo real
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Carga de Inteligencia
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
      setError("Fallo en conexión con la base de datos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Sincronización con Supabase
  const saveData = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("metrics").insert([{
        date: formData.date,
        revenue: parseFloat(formData.revenue) || 0,
        views: (parseFloat(formData.views) || 0) * 1000000, // Convertimos M a unidades
        interactions: (parseFloat(formData.interactions) || 0) * 1000, // Convertimos K a unidades
        followers: parseFloat(formData.followers) || 0,
        format: formData.format,
        topic: formData.topic.toUpperCase()
      }]);
      
      if (error) throw error;
      
      setFormData({ ...formData, revenue: "", views: "", interactions: "", followers: "", topic: "" });
      await loadData();
    } catch (err) {
      setError("Error al sincronizar datos");
    }
  };

  // Cálculos de Mando
  const totalRevenue = data.reduce((sum, item) => sum + (Number(item.revenue) || 0), 0);
  const totalViews = data.reduce((sum, item) => sum + (Number(item.views) || 0), 0);
  const avgRevenue = data.length > 0 ? totalRevenue / data.length : 0;
  const topPerformers = [...data].sort((a, b) => b.revenue - a.revenue).slice(0, 3);

  const formatNumber = (num) => {
    const n = Number(num) || 0;
    if (n >= 1000000) return `${(n/1000000).toFixed(2)}M`;
    if (n >= 1000) return `${(n/1000).toFixed(1)}K`;
    return n.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 border-[10px] border-[#4f46e5]">
      {/* HEADER ESTRATÉGICO */}
      <header className="bg-gradient-to-r from-indigo-700 to-purple-800 text-white p-6 shadow-2xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">IBIELE TV <span className="text-indigo-300">INTEL</span></h1>
            <p className="text-xs font-bold opacity-80 mt-1 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              SISTEMA VIVO • {time.toLocaleTimeString()} • AGUASCALIENTES, MX
            </p>
          </div>
          <div className="bg-white/10 p-4 rounded-2xl border border-white/20 text-center">
             <p className="text-[10px] font-black uppercase opacity-60">Revenue Total</p>
             <p className="text-2xl font-black text-green-400">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* REGISTRO DE ACTIVIDAD */}
          <div className="lg:col-span-2 bg-white rounded-[40px] shadow-xl p-8 border border-slate-100">
            <h2 className="text-2xl font-black text-indigo-700 mb-6 flex items-center gap-3 italic">
              <span className="bg-indigo-100 p-2 rounded-xl">📝</span> REGISTRAR OPERACIÓN
            </h2>
            
            <form onSubmit={saveData} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-2">Fecha de Operación</label>
                  <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 font-bold focus:border-indigo-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-2">Vistas (Millones)</label>
                  <input type="number" step="0.01" placeholder="Ej: 2.5" value={formData.views} onChange={(e) => setFormData({...formData, views: e.target.value})} className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 font-bold outline-none" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase ml-2">Titular o Tema</label>
                <input placeholder="NOMBRE DEL CONTENIDO / NOTICIA" value={formData.topic} onChange={(e) => setFormData({...formData, topic: e.target.value})} className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 font-bold uppercase outline-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-2">Caja (USD)</label>
                  <input type="number" step="0.01" placeholder="0.00" value={formData.revenue} onChange={(e) => setFormData({...formData, revenue: e.target.value})} className="w-full p-4 rounded-2xl bg-green-50 border-2 border-green-100 font-black text-green-700 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-2">Interacciones (K)</label>
                  <input type="number" placeholder="Ej: 45" value={formData.interactions} onChange={(e) => setFormData({...formData, interactions: e.target.value})} className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 font-bold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-2">Formato</label>
                  <select value={formData.format} onChange={(e) => setFormData({...formData, format: e.target.value})} className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 font-bold outline-none">
                    {FORMATS.map(f => <option key={f.value} value={f.value}>{f.icon} {f.label}</option>)}
                  </select>
                </div>
              </div>
              
              <button type="submit" className="w-full bg-indigo-600 p-6 rounded-[30px] text-white font-black text-2xl shadow-2xl hover:bg-indigo-700 active:scale-95 transition-all italic">
                SINCRONIZAR DATOS 📊
              </button>
            </form>
          </div>

          {/* ORÁCULO ESTRATÉGICO */}
          <div className="space-y-6">
            <div className="bg-white rounded-[40px] shadow-xl p-8 border border-slate-100 h-full">
              <h2 className="text-xl font-black text-indigo-700 mb-6 flex items-center gap-3 italic">
                <span className="bg-yellow-100 p-2 rounded-xl">💡</span> ORÁCULO
              </h2>
              <div className="space-y-6">
                <div className="bg-indigo-50 p-6 rounded-3xl border-l-8 border-indigo-600">
                  <p className="text-xs font-black text-indigo-600 uppercase mb-2">Estrategia sugerida</p>
                  <p className="font-bold italic">"Usa el formato 'Breaking News'. Las noticias rinden 42% más hoy."</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-3xl border-l-8 border-purple-600">
                  <p className="text-xs font-black text-purple-600 uppercase mb-2">Referencia Histórica</p>
                  <p className="text-2xl font-black text-slate-800 leading-tight">"MATARON A MI HIJO"</p>
                  <p className="font-bold text-purple-700 mt-2">Rendimiento: 0.7M Vistas</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BITÁCORA DE CRECIMIENTO */}
        <section className="bg-white rounded-[50px] shadow-2xl p-8 border border-slate-100 overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-3xl font-black text-indigo-700 italic uppercase tracking-tighter">Bitácora de Crecimiento</h2>
            <div className="bg-slate-100 p-2 rounded-2xl flex gap-2">
              <button onClick={() => setActiveTab("febrero")} className={`px-6 py-2 rounded-xl font-black transition ${activeTab === "febrero" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-500 hover:bg-slate-200"}`}>FEBRERO 2026</button>
              <button onClick={() => setActiveTab("enero")} className={`px-6 py-2 rounded-xl font-black transition ${activeTab === "enero" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-500 hover:bg-slate-200"}`}>ENERO 2026</button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 animate-pulse text-indigo-600 font-black">ANALIZANDO DATOS...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-4 border-indigo-50">
                    <th className="p-4 text-xs font-black text-slate-400 uppercase">Fecha</th>
                    <th className="p-4 text-xs font-black text-slate-400 uppercase">Tema / Titular</th>
                    <th className="p-4 text-xs font-black text-slate-400 uppercase">Alcance</th>
                    <th className="p-4 text-xs font-black text-slate-400 uppercase">Caja USD</th>
                    <th className="p-4 text-xs font-black text-slate-400 uppercase text-center">Evaluación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-5 font-bold text-slate-400">{new Date(item.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}</td>
                      <td className="p-5 font-black text-indigo-900 italic uppercase">{item.topic || "CONTENIDO SIN TÍTULO"}</td>
                      <td className="p-5 font-black text-indigo-600">{formatNumber(item.views)}</td>
                      <td className="p-5 font-black text-green-600 text-2xl">${(Number(item.revenue) || 0).toFixed(2)}</td>
                      <td className="p-5 text-center">
                        <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-[10px] font-black uppercase">Firme 🔥</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* MÉTRICAS CLAVE */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {[
             { label: "INGRESOS TOTALES", value: `$${totalRevenue.toFixed(2)}`, color: "indigo", sub: "Meta Feb: $1,250" },
             { label: "VISTAS TOTALES", value: formatNumber(totalViews), color: "purple", sub: "+12.3% vs Promedio" },
             { label: "INTERACCIONES", value: formatNumber(data.reduce((s, i) => s + (i.interactions || 0), 0)), color: "blue", sub: "Tasa: 1.52%" },
             { label: "NUEVOS SEGUIDORES", value: `+${formatNumber(data.reduce((s, i) => s + (i.followers || 0), 0))}`, color: "green", sub: "Crecimiento: 38%" }
           ].map((card, i) => (
             <div key={i} className={`bg-white p-6 rounded-[35px] border-b-8 border-${card.color}-600 shadow-xl`}>
               <p className={`text-[10px] font-black text-${card.color}-600 uppercase mb-2 tracking-widest`}>{card.label}</p>
               <p className="text-3xl font-black text-slate-800">{card.value}</p>
               <p className="text-[10px] font-bold text-slate-400 mt-2">{card.sub}</p>
             </div>
           ))}
        </section>

        {/* PROYECCIÓN */}
        <section className="bg-[#10b981] p-8 rounded-[50px] shadow-2xl text-white">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 border-b border-white/20 pb-4 text-center">Proyección Estratégica</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
             <div className="text-center">
               <p className="text-[10px] font-black opacity-70 uppercase mb-1">Meta Diaria</p>
               <p className="text-4xl font-black italic tracking-tighter">$38.72</p>
             </div>
             <div className="text-center">
               <p className="text-[10px] font-black opacity-70 uppercase mb-1">Promedio Real</p>
               <p className="text-4xl font-black italic tracking-tighter">${avgRevenue.toFixed(2)}</p>
             </div>
             <div className="text-center">
               <p className="text-[10px] font-black opacity-70 uppercase mb-1">Días Restantes</p>
               <p className="text-4xl font-black italic tracking-tighter">27</p>
             </div>
             <div className="text-center">
               <p className="text-[10px] font-black opacity-70 uppercase mb-1">Rendimiento</p>
               <p className="text-4xl font-black italic tracking-tighter">Óptimo</p>
             </div>
          </div>
          <div className="bg-white/10 p-6 rounded-[35px] border border-white/20">
             <h3 className="text-center text-xs font-black uppercase mb-6 tracking-widest italic">Rendimiento por Formato (Enero 2026)</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {FORMATS.map(f => (
                  <div key={f.value} className="text-center bg-white/5 p-4 rounded-3xl">
                    <div className="text-4xl mb-2">{f.icon}</div>
                    <p className="text-xs font-black uppercase">{f.label}</p>
                    <p className="text-2xl font-black italic mt-1">1.4M</p>
                  </div>
                ))}
             </div>
          </div>
        </section>
      </main>
    </div>
  );
}