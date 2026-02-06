import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// 🏛️ CONEXIÓN BLINDADA
const supabaseUrl = "https://stenaxhdsfxrzhetetiz.supabase.co";
const supabaseAnonKey = "sb_publishable_Sk2d6wvlqXrwLKfBEfS8fw_t5PfImJN";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const FORMATS = [
  { value: "Foto", label: "Foto", icon: "📸", color: "bg-blue-600" },
  { value: "Reels", label: "Reels", icon: "🎬", color: "bg-slate-500" },
  { value: "Enlaces", label: "Enlaces", icon: "🔗", color: "bg-emerald-600" },
  { value: "Historias", label: "Historias", icon: "📱", color: "bg-slate-400" }
];

// 📊 DATA MAESTRA (ENERO REAL)
const ENERO_DATA = [
  { day: 1, date: "2026-01-01", views: 0.76, revenue: 7.85, topic: "🚫 PROHIBIDO QUEJARSE", followers: 167 },
  { day: 5, date: "2026-01-05", views: 13.07, revenue: 103.96, topic: "😭 SUSURRARON JESÚS", followers: 3081 },
  { day: 11, date: "2026-01-11", views: 9.19, revenue: 84.27, topic: "🏟️ CALIFORNIA 50K", followers: 1969 },
  { day: 25, date: "2026-01-25", views: 8.32, revenue: 70.59, topic: "🩸 PAGAN CON SANGRE", followers: 2101 },
  { day: 31, date: "2026-01-31", views: 1.83, revenue: 21.20, topic: "🇺🇸 CALIFORNIA FE", followers: 512 }
];

const DEMOGRAPHICS = {
  gender: [{ label: "MUJERES", val: 67.1, color: "bg-slate-400" }, { label: "HOMBRES", val: 32.9, color: "bg-blue-600" }],
  geo: [["🇲🇽 México", 25.8], ["🇨🇴 Colombia", 13.3], ["🇦🇷 Argentina", 10.0], ["🇵🇪 Perú", 6.2]]
};

export default function App() {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());
  const [showInsights, setShowInsights] = useState(true);
  
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    revenue: "", views: "", interactions: "", followers: "", format: "Foto", topic: ""
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const { data: m, error } = await supabase.from("metrics").select("*").order('date', { ascending: false });
      if (error) throw error;
      setData(m || []);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (e) => {
    e.preventDefault();
    await supabase.from("metrics").insert([{
      ...form,
      revenue: parseFloat(form.revenue) || 0,
      views: (parseFloat(form.views) || 0) * 1000000,
      interactions: (parseFloat(form.interactions) || 0) * 1000,
      followers: parseFloat(form.followers) || 0,
      topic: form.topic.toUpperCase()
    }]);
    setForm({ ...form, revenue: "", views: "", interactions: "", followers: "", topic: "" });
    load();
  };

  const del = async (id) => {
    if(window.confirm("¿BORRAR?")) {
      await supabase.from("metrics").delete().eq('id', id);
      load();
    }
  };

  // 🧠 CÁLCULOS FIXEADOS (DENTRO DEL COMPONENTE)
  const febData = data.filter(i => i.date.includes("-02-"));
  const febRev = febData.reduce((s, i) => s + (Number(i.revenue) || 0), 0);
  const janRev = ENERO_DATA.reduce((s, i) => s + i.revenue, 0);
  const janViews = ENERO_DATA.reduce((s, i) => s + i.views, 0);
  
  // SOLUCIÓN AL ERROR BESTDAY
  const bestDay = ENERO_DATA.length > 0 
    ? ENERO_DATA.reduce((prev, curr) => (prev.revenue > curr.revenue) ? prev : curr) 
    : { topic: "N/A", revenue: 0, date: "2026-01-01", views: 0 };

  const daysPassed = new Date().getDate();
  const dailyTarget = (1250 - febRev) / (28 - daysPassed || 1);
  const sameDayEnero = ENERO_DATA.find(item => item.day === daysPassed);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 border-[8px] md:border-[15px] border-[#003566]">
      
      {/* 🎖️ NAV RESPONSIVE */}
      <nav className="bg-[#003566] text-white p-3 md:p-5 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-xl md:text-3xl font-black italic tracking-tighter uppercase">IBIELE <span className="text-blue-400">INTEL</span></h1>
            <p className="text-[7px] md:text-[10px] font-bold opacity-60 uppercase tracking-widest">{time.toLocaleTimeString()} • HQ COMMAND</p>
          </div>
          
          <div className="w-full md:w-auto overflow-x-auto no-scrollbar">
            <div className="flex bg-white/5 p-1 rounded-xl min-w-max">
              {["dashboard", "audiencia", "estrategia", "historial"].map(t => (
                <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 rounded-lg text-[9px] md:text-[11px] font-black uppercase transition-all ${activeTab === t ? "bg-white text-[#003566] shadow-lg" : "text-blue-200 hover:text-white"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-3 md:p-8 space-y-6 md:space-y-8">

        {/* 📟 PESTAÑA: DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="animate-in fade-in duration-500 space-y-6">
            
            {/* REFERENCIA ENERO TÁCTICA */}
            {showInsights && sameDayEnero && (
              <section className="bg-[#001d3d] rounded-2xl md:rounded-[40px] shadow-2xl border-2 border-slate-400 overflow-hidden relative">
                <div className="bg-slate-800/50 p-4 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                   <div className="flex items-center gap-4">
                      <div className="bg-slate-200 text-[#003566] p-4 rounded-2xl font-black text-2xl shadow-inner">0{daysPassed}</div>
                      <div>
                        <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase">Referencia Enero</p>
                        <h3 className="text-sm md:text-2xl font-black text-white uppercase italic truncate max-w-[200px] md:max-w-none">{sameDayEnero.topic}</h3>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <div className="text-center"><p className="text-[8px] opacity-50 text-white">CAJA</p><p className="text-xl font-black text-green-400">${sameDayEnero.revenue}</p></div>
                      <div className="text-center"><p className="text-[8px] opacity-50 text-white">VISTAS</p><p className="text-xl font-black text-blue-400">{sameDayEnero.views}M</p></div>
                   </div>
                </div>
                <button onClick={()=>setShowInsights(false)} className="absolute top-2 right-4 text-white font-black opacity-30 hover:opacity-100">✕</button>
              </section>
            )}

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* TARGET */}
              <div className="lg:col-span-2 bg-white p-6 md:p-10 rounded-[30px] md:rounded-[50px] shadow-xl border-b-[10px] border-[#003566]">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Meta Diaria Febrero</p>
                <p className="text-5xl md:text-7xl font-black text-[#003566] italic tracking-tighter mb-6">${dailyTarget > 0 ? dailyTarget.toFixed(2) : "0.00"}</p>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                   <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-full transition-all duration-1000" style={{width: `${Math.min((febRev/1250)*100, 100)}%`}}></div>
                </div>
                <p className="text-[10px] font-black text-center mt-3 uppercase opacity-50">Progreso total: {((febRev/1250)*100).toFixed(1)}% de $1,250</p>
              </div>

              {/* INPUT */}
              <div className="bg-[#003566] p-6 rounded-[30px] md:rounded-[50px] shadow-xl text-white">
                <h3 className="text-xs font-black uppercase mb-4 italic">Sincronizar Datos</h3>
                <form onSubmit={save} className="space-y-3">
                  <input placeholder="TEMA" value={form.topic} onChange={e=>setForm({...form, topic:e.target.value})} className="w-full p-3 rounded-xl bg-white/10 border border-white/20 font-bold text-xs uppercase" required/>
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder="Vistas (M)" type="number" step="0.01" value={form.views} onChange={e=>setForm({...form, views:e.target.value})} className="p-3 rounded-xl bg-white/10 border border-white/20 font-bold text-xs" required/>
                    <input placeholder="Caja ($)" type="number" step="0.01" value={form.revenue} onChange={e=>setForm({...form, revenue:e.target.value})} className="p-3 rounded-xl bg-green-400/20 border border-green-400/30 font-black text-xs text-green-400" required/>
                  </div>
                  <button className="w-full bg-white text-[#003566] p-4 rounded-2xl font-black uppercase text-xs shadow-lg hover:scale-105 transition-all italic">Ejecutar Comando 🚀</button>
                </form>
              </div>
            </section>
          </div>
        )}

        {/* 🛡️ PESTAÑA: AUDIENCIA (OPTIMIZADA MÓVIL) */}
        {activeTab === "audiencia" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 animate-in zoom-in-95 duration-500">
            <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-xl border-2 border-slate-300">
              <h2 className="text-xl md:text-2xl font-black text-[#003566] uppercase italic mb-8">Segmentación</h2>
              <div className="space-y-8">
                 {DEMOGRAPHICS.gender.map(g => (
                   <div key={g.label}>
                     <div className="flex justify-between font-black text-[10px] md:text-xs mb-2"><span>{g.label}</span><span>{g.val}%</span></div>
                     <div className="w-full bg-slate-100 h-6 md:h-8 rounded-full overflow-hidden border-2 border-slate-200"><div className={`${g.color} h-full`} style={{width: `${g.val}%`}}></div></div>
                   </div>
                 ))}
              </div>
            </div>
            <div className="bg-[#001d3d] p-6 md:p-10 rounded-[40px] text-white shadow-2xl border-b-[10px] border-slate-400">
              <h2 className="text-xl md:text-2xl font-black uppercase italic mb-8 tracking-tighter text-blue-400">Territorios</h2>
              <div className="space-y-4">
                {DEMOGRAPHICS.geo.map(p => (
                  <div key={p[0]} className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="font-black text-[10px] md:text-sm uppercase tracking-widest">{p[0]}</span>
                    <span className="font-black text-lg md:text-xl text-blue-400">{p[1]}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 🎯 PESTAÑA: ESTRATEGIA (CON FIX DE BESTDAY) */}
        {activeTab === "estrategia" && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <div className="bg-[#001d3d] p-8 md:p-16 rounded-[40px] md:rounded-[60px] text-white border-b-[15px] border-slate-400 text-center">
               <p className="text-[10px] md:text-xs font-black text-blue-400 uppercase mb-4 tracking-[0.3em]">IA Predictive Command</p>
               <h2 className="text-4xl md:text-7xl font-black italic mb-8 uppercase tracking-tighter leading-none">REELS + TRAGEDIA</h2>
               <div className="max-w-2xl mx-auto space-y-4">
                 <p className="text-xs md:text-lg font-bold text-slate-400 uppercase leading-tight">
                   Basado en tu día de oro (${bestDay.revenue.toFixed(2)}), el imperio debe centrarse hoy en temas de impacto social alto con formato Reel.
                 </p>
                 <div className="inline-block bg-white/5 px-6 py-2 rounded-full border border-white/10 text-[10px] font-black tracking-widest text-blue-200">
                   CONVERSIÓN: 315 SEGUIDORES / MILLÓN
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* 📜 PESTAÑA: HISTORIAL (SCROLL HORIZONTAL PROTEGIDO) */}
        {activeTab === "historial" && (
          <section className="bg-white rounded-2xl md:rounded-[40px] shadow-2xl p-4 md:p-10 border-2 border-slate-300 animate-in fade-in duration-500">
            <h2 className="text-2xl md:text-3xl font-black text-[#003566] italic uppercase mb-8 border-b-4 border-slate-100 pb-4">Archivo Histórico</h2>
            <div className="overflow-x-auto no-scrollbar">
              <div className="min-w-[650px]">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <tr><th className="p-4">Día</th><th className="p-4">Titular</th><th className="p-4">Caja</th><th className="p-4">Alcance</th><th className="p-4 text-right">Acción</th></tr>
                  </thead>
                  <tbody className="divide-y-2">
                    {febData.map(i => (
                      <tr key={i.id} className="hover:bg-blue-50 transition-all">
                        <td className="p-4 font-black text-slate-400">0{i.date.split("-")[2]}</td>
                        <td className="p-4 font-black text-[#003566] uppercase italic truncate max-w-[200px]">{i.topic}</td>
                        <td className="p-4 font-black text-green-600 text-xl">${Number(i.revenue).toFixed(2)}</td>
                        <td className="p-4 font-black text-blue-600">{(i.views/1000000).toFixed(2)}M</td>
                        <td className="p-4 text-right"><button onClick={()=>del(i.id)} className="text-red-400 hover:text-red-600 transition-transform hover:scale-125">🗑️</button></td>
                      </tr>
                    ))}
                    {ENERO_DATA.map(i => (
                      <tr key={i.day} className="bg-slate-50/50 grayscale-[0.5]">
                        <td className="p-4 font-black text-slate-300">0{i.day}</td>
                        <td className="p-4 font-black text-slate-400 uppercase italic truncate max-w-[200px]">{i.topic}</td>
                        <td className="p-4 font-black text-slate-400 text-xl">${i.revenue.toFixed(2)}</td>
                        <td className="p-4 font-black text-slate-300">{i.views}M</td>
                        <td className="p-4 text-right text-[8px] font-black text-slate-300 uppercase italic">Lock</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}