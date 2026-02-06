import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://stenaxhdsfxrzhetetiz.supabase.co";
const supabaseAnonKey = "sb_publishable_Sk2d6wvlqXrwLKfBEfS8fw_t5PfImJN";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const FORMATS = [
  { value: "Foto", label: "Foto", icon: "📸" },
  { value: "Reels", label: "Reels", icon: "🎬" },
  { value: "Enlaces", label: "Enlaces", icon: "🔗" },
  { value: "Historias", label: "Historias", icon: "📱" }
];

const ENERO_DATA = [
  { day: 1, date: "2026-01-01", views: 0.76, revenue: 7.85, topic: "🚫 PROHIBIDO QUEJARSE", followers: 167 },
  { day: 5, date: "2026-01-05", views: 13.07, revenue: 103.96, topic: "😭 SUSURRARON JESÚS", followers: 3081 },
  { day: 11, date: "2026-01-11", views: 9.19, revenue: 84.27, topic: "🏟️ CALIFORNIA 50K", followers: 1969 },
  { day: 25, date: "2026-01-25", views: 8.32, revenue: 70.59, topic: "🩸 PAGAN CON SANGRE", followers: 2101 },
  { day: 31, date: "2026-01-31", views: 1.83, revenue: 21.20, topic: "🇺🇸 CALIFORNIA FE", followers: 512 }
];

export default function App() {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [time, setTime] = useState(new Date());
  
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
      const { data: m, error } = await supabase.from("metrics").select("*").order('date', { ascending: false });
      if (error) throw error;
      setData(m || []);
    } catch (err) { console.error(err); }
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

  // --- LÓGICA DE CÁLCULOS (FIXEADA) ---
  const febData = data.filter(i => i.date.includes("-02-"));
  const febRev = febData.reduce((s, i) => s + (Number(i.revenue) || 0), 0);
  const bestDay = ENERO_DATA.reduce((prev, curr) => (prev.revenue > curr.revenue) ? prev : curr);
  const daysPassed = new Date().getDate();
  const dailyTarget = (1250 - febRev) / (28 - daysPassed || 1);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 border-[6px] md:border-[15px] border-[#003566]">
      
      {/* 🎖️ NAV MOBILE OPTIMIZED */}
      <nav className="bg-[#003566] text-white p-3 md:p-5 sticky top-0 z-50 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-3">
        <h1 className="text-xl md:text-3xl font-black italic tracking-tighter uppercase">IBIELE <span className="text-blue-400">INTEL</span></h1>
        <div className="w-full md:w-auto overflow-x-auto no-scrollbar flex justify-center">
          <div className="flex bg-white/5 p-1 rounded-xl min-w-max">
            {["dashboard", "audiencia", "estrategia", "historial"].map(t => (
              <button key={t} onClick={() => setActiveTab(t)} className={`px-3 md:px-4 py-2 rounded-lg text-[9px] md:text-[11px] font-black uppercase transition-all ${activeTab === t ? "bg-white text-[#003566]" : "text-blue-200"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-3 md:p-8 space-y-6">

        {/* 📟 DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="animate-in fade-in duration-500 space-y-6">
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-[#001d3d] p-6 md:p-10 rounded-2xl md:rounded-[40px] text-white border-b-8 border-slate-400">
                <p className="text-[10px] font-black opacity-50 uppercase tracking-widest mb-1">Target Diario</p>
                <p className="text-5xl md:text-7xl font-black text-blue-400 italic tracking-tighter">${dailyTarget > 0 ? dailyTarget.toFixed(2) : "0.00"}</p>
                <div className="mt-6 flex justify-between text-[10px] font-black"><span>META $1,250</span><span>{((febRev/1250)*100).toFixed(1)}%</span></div>
                <div className="w-full bg-white/10 h-2 md:h-4 rounded-full overflow-hidden mt-1">
                   <div className="bg-gradient-to-r from-blue-600 to-green-400 h-full" style={{width: `${Math.min((febRev/1250)*100, 100)}%`}}></div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl md:rounded-[40px] shadow-xl border-2 border-slate-300">
                <form onSubmit={save} className="space-y-2">
                  <input placeholder="TEMA" value={form.topic} onChange={e=>setForm({...form, topic:e.target.value})} className="w-full p-2 md:p-3 rounded-xl bg-slate-50 border font-bold text-xs uppercase" required/>
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder="Vistas (M)" type="number" step="0.01" value={form.views} onChange={e=>setForm({...form, views:e.target.value})} className="p-2 md:p-3 rounded-xl bg-slate-50 border font-bold text-xs" required/>
                    <input placeholder="Caja ($)" type="number" step="0.01" value={form.revenue} onChange={e=>setForm({...form, revenue:e.target.value})} className="p-2 md:p-3 rounded-xl bg-green-50 border-2 border-green-100 font-black text-xs" required/>
                  </div>
                  <button className="w-full bg-[#003566] text-white p-3 md:p-4 rounded-xl font-black uppercase text-[10px] md:text-xs italic">Sincronizar 🚀</button>
                </form>
              </div>
            </section>

            <div className="bg-white rounded-2xl md:rounded-[40px] p-4 md:p-8 shadow-xl border-2 border-slate-300">
               <h3 className="text-lg md:text-2xl font-black text-[#003566] mb-4 uppercase italic">Registros Actuales</h3>
               <div className="space-y-2">
                 {febData.map(i => (
                   <div key={i.id} className="flex justify-between items-center p-3 md:p-5 bg-slate-50 rounded-xl border border-slate-200">
                     <div className="min-w-0">
                       <p className="font-black text-[#003566] text-[10px] md:text-sm uppercase truncate">{i.topic}</p>
                       <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase">{(i.views/1000000).toFixed(2)}M Vistas</p>
                     </div>
                     <div className="flex items-center gap-3">
                       <p className="font-black text-green-600 text-sm md:text-xl">${Number(i.revenue).toFixed(2)}</p>
                       <button onClick={() => del(i.id)} className="text-red-300 text-xs">🗑️</button>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}

        {/* 👥 AUDIENCIA */}
        {activeTab === "audiencia" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 animate-in zoom-in-95 duration-500">
            <div className="bg-white p-6 rounded-2xl md:rounded-[50px] shadow-xl border-2 border-slate-300 text-center">
              <h2 className="text-xl md:text-2xl font-black text-[#003566] uppercase mb-8">Género</h2>
              <div className="space-y-6 text-left">
                 {[["MUJERES", 67.1, "bg-slate-400"], ["HOMBRES", 32.9, "bg-blue-600"]].map(g => (
                   <div key={g[0]}>
                     <div className="flex justify-between font-black text-[10px] mb-1"><span>{g[0]}</span><span>{g[1]}%</span></div>
                     <div className="w-full bg-slate-100 h-4 md:h-6 rounded-full overflow-hidden border"><div className={`${g[2]} h-full`} style={{width: `${g[1]}%`}}></div></div>
                   </div>
                 ))}
              </div>
            </div>
            <div className="bg-[#001d3d] p-6 rounded-2xl md:rounded-[50px] text-white shadow-xl">
              <h2 className="text-xl md:text-2xl font-black uppercase mb-6 text-blue-400">Territorios</h2>
              <div className="space-y-3">
                {[["🇲🇽 México", 25.8], ["🇨🇴 Colombia", 13.3], ["🇦🇷 Argentina", 10.0], ["🇵🇪 Perú", 6.2]].map(p => (
                  <div key={p[0]} className="flex justify-between items-center border-b border-white/5 pb-1">
                    <span className="font-black text-[10px] uppercase">{p[0]}</span>
                    <span className="font-black text-blue-400">{p[1]}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 🎯 ESTRATEGIA (CON FIX DE BESTDAY) */}
        {activeTab === "estrategia" && (
          <div className="animate-in slide-in-from-right-4 duration-500">
            <div className="bg-[#001d3d] p-8 md:p-16 rounded-2xl md:rounded-[60px] text-white border-b-[10px] border-slate-400 text-center">
               <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4">Estrategia Recomendada</p>
               <h2 className="text-3xl md:text-6xl font-black italic mb-6">REELS + TRAGEDIA</h2>
               <p className="text-[10px] md:text-lg font-bold text-slate-400 uppercase max-w-xl mx-auto">
                 Basado en el éxito récord de ${bestDay.revenue.toFixed(2)}, el imperio debe enfocar el fin de semana en contenido de alto impacto emocional.
               </p>
            </div>
          </div>
        )}

        {/* 📜 HISTORIAL (SCROLL LATERAL) */}
        {activeTab === "historial" && (
          <div className="bg-white rounded-2xl md:rounded-[40px] shadow-2xl p-4 md:p-10 border-2 border-slate-300 animate-in fade-in">
            <h2 className="text-xl md:text-3xl font-black text-[#003566] uppercase italic mb-6 border-b-4 border-slate-100 pb-2">Archivo Enero</h2>
            <div className="overflow-x-auto no-scrollbar">
              <div className="min-w-[500px]">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase">
                    <tr><th className="p-3">Día</th><th className="p-3">Titular</th><th className="p-3">Caja</th><th className="p-3">Alcance</th></tr>
                  </thead>
                  <tbody className="divide-y-2">
                    {ENERO_DATA.map(i => (
                      <tr key={i.day} className="hover:bg-blue-50/50">
                        <td className="p-3 font-black text-slate-400">0{i.day}</td>
                        <td className="p-3 font-black text-[#003566] uppercase italic truncate max-w-[150px] md:max-w-sm">{i.topic}</td>
                        <td className="p-3 font-black text-green-600 text-base">${i.revenue.toFixed(2)}</td>
                        <td className="p-3 font-black text-blue-600">{i.views}M</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}