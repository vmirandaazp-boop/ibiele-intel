import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://stenaxhdsfxrzhetetiz.supabase.co";
const supabaseAnonKey = "sb_publishable_Sk2d6wvlqXrwLKfBEfS8fw_t5PfImJN";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 📊 DATOS MAESTROS REALES (ENERO 2026)
const ENERO_DATA = [
  { day: 1, date: "2026-01-01", views: 0.76, revenue: 7.85, topic: "🚫 PROHIBIDO QUEJARSE", followers: 167 },
  { day: 5, date: "2026-01-05", views: 13.07, revenue: 103.96, topic: "😭 SUSURRARON JESÚS", followers: 3081 },
  { day: 11, date: "2026-01-11", views: 9.19, revenue: 84.27, topic: "🏟️ CALIFORNIA 50K", followers: 1969 },
  { day: 25, date: "2026-01-25", views: 8.32, revenue: 70.59, topic: "🩸 PAGAN CON SANGRE", followers: 2101 },
  { day: 31, date: "2026-01-31", views: 1.83, revenue: 21.20, topic: "🇺🇸 CALIFORNIA FE", followers: 512 }
];

export default function App() {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState("mando");
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
      const { data: m, error } = await supabase.from("metrics").select("*").order('date', { ascending: false });
      if (error) throw error;
      setData(m || []);
    } catch (err) { console.error("Error Supabase:", err); } 
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("metrics").insert([{
      ...form,
      revenue: parseFloat(form.revenue) || 0,
      views: (parseFloat(form.views) || 0) * 1000000,
      interactions: (parseFloat(form.interactions) || 0) * 1000,
      followers: parseFloat(form.followers) || 0,
      topic: form.topic.toUpperCase()
    }]);
    if (!error) {
      setForm({ ...form, revenue: "", views: "", interactions: "", followers: "", topic: "" });
      load();
    }
  };

  const del = async (id) => {
    if(window.confirm("¿ELIMINAR REGISTRO?")) {
      await supabase.from("metrics").delete().eq('id', id);
      load();
    }
  };

  // --- CÁLCULOS DE INTELIGENCIA (SIN ERRORES) ---
  const febData = data.filter(i => i.date.includes("-02-"));
  const febRev = febData.reduce((s, i) => s + (Number(i.revenue) || 0), 0);
  const febViews = febData.reduce((s, i) => s + (Number(i.views) || 0), 0);
  const janRev = ENERO_DATA.reduce((s, i) => s + i.revenue, 0);
  const janViews = ENERO_DATA.reduce((s, i) => s + i.views, 0);
  const janFollowers = ENERO_DATA.reduce((s, i) => s + i.followers, 0);
  
  // Variables que faltaban y causaban el error:
  const bestDay = ENERO_DATA.reduce((prev, current) => (prev.revenue > current.revenue) ? prev : current);
  const conversionRate = janViews > 0 ? (janFollowers / janViews).toFixed(0) : 315;
  const daysPassed = new Date().getDate();
  const dailyTarget = (1250 - febRev) / (28 - daysPassed || 1);

  return (
    <div className="min-h-screen bg-slate-200 font-sans text-slate-900 border-[12px] border-[#003566]">
      
      {/* 🎖️ NAVEGACIÓN TÁCTICA */}
      <nav className="bg-[#003566] text-white p-5 sticky top-0 z-50 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-slate-300 text-[#003566] px-3 py-1 rounded font-black italic tracking-tighter">IMPERIAL INTEL</div>
          <p className="text-[10px] font-bold opacity-60 uppercase">{time.toLocaleTimeString()} • HQ AGUASCALIENTES</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          {["mando", "audiencia", "estrategia", "historial"].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${activeTab === t ? "bg-white text-[#003566] shadow-lg" : "text-blue-200 hover:text-white"}`}>
              {t}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">

        {/* 📟 PESTAÑA: MANDO (REGISTRO Y TARGET) */}
        {activeTab === "mando" && (
          <div className="animate-in fade-in duration-500 space-y-6">
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-[#001d3d] p-8 rounded-[40px] text-white border-b-8 border-slate-400">
                <h2 className="text-4xl font-black italic mb-2 tracking-tighter uppercase">Target Febrero</h2>
                <div className="flex gap-8 items-end">
                   <div>
                     <p className="text-[10px] font-black opacity-50 uppercase tracking-widest">Meta Diaria Recomendada</p>
                     <p className="text-5xl font-black text-blue-400">${dailyTarget > 0 ? dailyTarget.toFixed(2) : "0.00"}</p>
                   </div>
                   <div className="flex-1">
                     <div className="flex justify-between text-[10px] font-black mb-2"><span>PROGRESO META $1,250</span><span>{((febRev/1250)*100).toFixed(1)}%</span></div>
                     <div className="w-full bg-white/10 h-4 rounded-full overflow-hidden border border-white/10">
                        <div className="bg-gradient-to-r from-blue-600 to-green-400 h-full transition-all duration-1000" style={{width: `${Math.min((febRev/1250)*100, 100)}%`}}></div>
                     </div>
                   </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-[40px] shadow-xl border-2 border-slate-300">
                <form onSubmit={save} className="space-y-3">
                  <input placeholder="TEMA / NOTICIA" value={form.topic} onChange={e=>setForm({...form, topic:e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl border font-bold uppercase text-xs" required/>
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder="Vistas (M)" type="number" step="0.01" value={form.views} onChange={e=>setForm({...form, views:e.target.value})} className="p-3 bg-slate-50 rounded-xl border font-bold text-xs" required/>
                    <input placeholder="Caja ($)" type="number" step="0.01" value={form.revenue} onChange={e=>setForm({...form, revenue:e.target.value})} className="p-3 bg-green-50 rounded-xl border font-black text-xs" required/>
                  </div>
                  <button className="w-full bg-[#003566] text-white p-4 rounded-2xl font-black uppercase text-xs italic shadow-lg">Ejecutar Sincronización 🚀</button>
                </form>
              </div>
            </section>

            <div className="bg-white rounded-[40px] p-8 border-2 border-slate-300 shadow-xl">
               <h3 className="text-2xl font-black text-[#003566] uppercase italic mb-6">Bitácora de Hoy</h3>
               <div className="space-y-3">
                 {febData.map(i => (
                   <div key={i.id} className="flex justify-between items-center p-5 bg-slate-50 rounded-[25px] border border-slate-100 hover:bg-blue-50 transition-all">
                     <div>
                       <p className="font-black text-[#003566] uppercase italic">{i.topic}</p>
                       <p className="text-[10px] font-bold text-slate-400">{(i.views/1000000).toFixed(2)}M IMPACTO</p>
                     </div>
                     <div className="flex items-center gap-6">
                       <p className="font-black text-green-600 text-2xl">${Number(i.revenue).toFixed(2)}</p>
                       <button onClick={() => del(i.id)} className="text-red-300 hover:text-red-600 transition-colors">🗑️</button>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}

        {/* 👥 PESTAÑA: AUDIENCIA (CSS PURO) */}
        {activeTab === "audiencia" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in zoom-in-95 duration-500">
            <div className="bg-white p-10 rounded-[50px] shadow-2xl border-2 border-slate-300">
              <h2 className="text-3xl font-black text-[#003566] uppercase italic mb-8">Género</h2>
              <div className="space-y-8">
                 <div>
                   <div className="flex justify-between font-black text-sm mb-2"><span>MUJERES</span><span>67.1%</span></div>
                   <div className="w-full bg-slate-100 h-8 rounded-full overflow-hidden border-2"><div className="bg-blue-600 h-full" style={{width: '67.1%'}}></div></div>
                 </div>
                 <div>
                   <div className="flex justify-between font-black text-sm mb-2"><span>HOMBRES</span><span>32.9%</span></div>
                   <div className="w-full bg-slate-100 h-8 rounded-full overflow-hidden border-2"><div className="bg-slate-400 h-full" style={{width: '32.9%'}}></div></div>
                 </div>
              </div>
            </div>
            <div className="bg-[#001d3d] p-10 rounded-[50px] text-white shadow-2xl border-b-[15px] border-slate-400">
              <h2 className="text-3xl font-black uppercase italic mb-8 tracking-tighter text-blue-400">Países TOP</h2>
              <div className="space-y-4">
                {[["🇲🇽 México", 25.8], ["🇨🇴 Colombia", 13.3], ["🇦🇷 Argentina", 10.0], ["🇵🇪 Perú", 6.2]].map(p => (
                  <div key={p[0]} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                    <span className="font-black text-sm uppercase">{p[0]}</span>
                    <span className="font-black text-xl text-blue-400">{p[1]}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 🎯 PESTAÑA: ESTRATEGIA (ANÁLISIS REAL) */}
        {activeTab === "estrategia" && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <h2 className="text-4xl font-black text-[#003566] italic uppercase text-center border-b-4 border-slate-300 pb-4">Terminal Predictiva</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ENERO_DATA.slice(1,4).map((item, idx) => (
                <div key={idx} className="bg-white p-8 rounded-[40px] shadow-xl border-t-8 border-[#003566] relative overflow-hidden">
                  <div className="text-5xl font-black opacity-10 absolute -top-2 -right-2 italic">#{idx+1}</div>
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Patrón de Éxito</p>
                  <h3 className="text-xl font-black text-[#003566] leading-tight mb-6 italic uppercase">{item.topic}</h3>
                  <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border">
                    <div><p className="text-[8px] font-black opacity-50">CAJA</p><p className="text-2xl font-black text-green-600">${item.revenue}</p></div>
                    <div className="text-right"><p className="text-[8px] font-black opacity-50">ALCANCE</p><p className="text-2xl font-black text-blue-600">{item.views}M</p></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-[#001d3d] p-12 rounded-[60px] text-white border-b-[15px] border-slate-400 text-center">
               <p className="text-xs font-black text-blue-400 uppercase mb-2 tracking-[0.3em]">IA Estrategia Sugerida</p>
               <p className="text-6xl font-black italic mb-6">REELS + TRAGEDIA</p>
               <p className="max-w-2xl mx-auto text-lg font-bold text-slate-400 uppercase leading-tight">
                 Basado en el día de mayor rendimiento (${bestDay.revenue}), tu contenido debe centrarse en testimonios de impacto con formato Reel. 
                 La tasa de conversión es de <span className="text-white">{conversionRate}</span> seguidores por millón de vistas.
               </p>
            </div>
          </div>
        )}

        {/* 📜 PESTAÑA: HISTORIAL (EL LOG COMPLETO) */}
        {activeTab === "historial" && (
          <section className="bg-white rounded-[40px] shadow-2xl p-10 border-2 border-slate-300 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 border-b-4 border-slate-100 pb-8">
              <h2 className="text-3xl font-black text-[#003566] italic uppercase tracking-tighter">Archivo Enero 2026</h2>
              <div className="flex gap-10">
                 <div className="text-center"><p className="text-[10px] font-black opacity-50 uppercase">Ingreso Real</p><p className="text-3xl font-black">${janRev.toFixed(2)}</p></div>
                 <div className="text-center"><p className="text-[10px] font-black opacity-50 uppercase">Alcance Total</p><p className="text-3xl font-black text-blue-600">{(janViews/1).toFixed(1)}M</p></div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b-2">
                    <th className="p-4">Día</th>
                    <th className="p-4">Titular de Impacto</th>
                    <th className="p-4">Ingresos</th>
                    <th className="p-4">Vistas</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2">
                  {ENERO_DATA.map(i => (
                    <tr key={i.day} className="hover:bg-blue-50 transition-colors">
                      <td className="p-4 font-black text-slate-400">0{i.day}</td>
                      <td className="p-4 font-black text-[#003566] uppercase italic truncate max-w-sm">{i.topic}</td>
                      <td className="p-4 font-black text-green-600 text-xl">${i.revenue.toFixed(2)}</td>
                      <td className="p-4 font-black text-blue-600">{i.views}M</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}