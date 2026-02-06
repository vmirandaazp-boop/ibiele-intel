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

  // Lógica de Dashboard
  const febData = data.filter(i => i.date.includes("-02-"));
  const febRev = febData.reduce((s, i) => s + (Number(i.revenue) || 0), 0);
  const daysPassed = new Date().getDate();
  const dailyTarget = (1250 - febRev) / (28 - daysPassed || 1);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 border-[10px] border-[#003566]">
      
      {/* 🎖️ NAVEGACIÓN SUPREMA (CORREGIDA) */}
      <nav className="bg-[#003566] text-white p-4 sticky top-0 z-50 shadow-2xl flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-black italic tracking-tighter">IBIELE <span className="text-blue-400">INTEL</span></h1>
        <div className="flex bg-white/10 p-1 rounded-xl">
          {["mando", "audiencia", "estrategia", "historial"].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition ${activeTab === t ? "bg-white text-[#003566]" : "hover:bg-white/5"}`}>
              {t}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-4 md:p-8">

        {/* 📟 PESTAÑA: MANDO */}
        {activeTab === "mando" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#001d3d] p-8 rounded-[40px] text-white border-b-8 border-blue-500">
                <p className="text-[10px] font-black opacity-50 uppercase tracking-widest">Target Diario Febrero</p>
                <p className="text-6xl font-black text-blue-400 italic">${dailyTarget.toFixed(2)}</p>
                <div className="mt-4 bg-white/10 h-2 rounded-full overflow-hidden">
                   <div className="bg-green-400 h-full" style={{width: `${(febRev/1250)*100}%`}}></div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-[40px] shadow-xl border-2 border-slate-200">
                <form onSubmit={save} className="grid grid-cols-2 gap-4">
                  <input placeholder="TEMA" value={form.topic} onChange={e=>setForm({...form, topic:e.target.value})} className="col-span-2 p-3 bg-slate-50 rounded-xl border font-bold uppercase text-xs" required/>
                  <input placeholder="VISTAS (M)" type="number" step="0.01" value={form.views} onChange={e=>setForm({...form, views:e.target.value})} className="p-3 bg-slate-50 rounded-xl border font-bold text-xs" required/>
                  <input placeholder="CAJA ($)" type="number" step="0.01" value={form.revenue} onChange={e=>setForm({...form, revenue:e.target.value})} className="p-3 bg-green-50 rounded-xl border font-black text-xs" required/>
                  <button className="col-span-2 bg-[#003566] text-white p-4 rounded-2xl font-black uppercase text-xs italic shadow-lg">Sincronizar 🚀</button>
                </form>
              </div>
            </section>

            <div className="bg-white rounded-[40px] p-6 shadow-xl border-2 border-slate-200">
              <h2 className="text-xl font-black text-[#003566] mb-4 uppercase italic">Registros de Hoy</h2>
              <div className="space-y-3">
                {febData.map(i => (
                  <div key={i.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border">
                    <div>
                      <p className="font-black text-[#003566] text-sm uppercase">{i.topic}</p>
                      <p className="text-[10px] font-bold text-slate-400">{(i.views/1000000).toFixed(2)}M VISTAS</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-black text-green-600 text-xl">${Number(i.revenue).toFixed(2)}</p>
                      <button onClick={() => del(i.id)} className="text-red-300 hover:text-red-600">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 👥 PESTAÑA: AUDIENCIA */}
        {activeTab === "audiencia" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in zoom-in-95 duration-500">
            <div className="bg-white p-8 rounded-[50px] shadow-2xl border-2 border-slate-300">
              <h2 className="text-2xl font-black text-[#003566] mb-6 uppercase italic">Demografía de Género</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between font-black text-xs mb-2"><span>MUJERES</span><span>67.1%</span></div>
                  <div className="w-full bg-slate-100 h-6 rounded-full overflow-hidden border"><div className="bg-blue-600 h-full" style={{width: '67.1%'}}></div></div>
                </div>
                <div>
                  <div className="flex justify-between font-black text-xs mb-2"><span>HOMBRES</span><span>32.9%</span></div>
                  <div className="w-full bg-slate-100 h-6 rounded-full overflow-hidden border"><div className="bg-slate-400 h-full" style={{width: '32.9%'}}></div></div>
                </div>
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 italic text-xs font-bold text-blue-800 text-center">
                  Insight: El 85% de tus compras/estrellas provienen del sector femenino 35-44 años.
                </div>
              </div>
            </div>
            <div className="bg-[#001d3d] p-8 rounded-[50px] text-white shadow-2xl border-b-[10px] border-slate-400">
              <h2 className="text-2xl font-black mb-6 uppercase italic">Alcance por País</h2>
              <div className="space-y-4">
                {[["🇲🇽 MÉXICO", 25.8], ["🇨🇴 COLOMBIA", 13.3], ["🇦🇷 ARGENTINA", 10.0], ["🇵🇪 PERÚ", 6.2]].map(p => (
                  <div key={p[0]} className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="font-black text-xs">{p[0]}</span>
                    <span className="font-black text-blue-400">{p[1]}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 🎯 PESTAÑA: ESTRATEGIA */}
        {activeTab === "estrategia" && (
          <div className="space-y-8 animate-in slide-in-from-right-4">
            <h2 className="text-3xl font-black text-[#003566] uppercase italic text-center">Patrones de Éxito Enero</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ENERO_DATA.slice(0,3).map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-[40px] shadow-xl border-t-8 border-[#003566]">
                  <p className="text-[10px] font-black text-slate-400 mb-2 uppercase">Top {idx+1}</p>
                  <h3 className="font-black text-[#003566] italic leading-tight mb-4">{item.topic}</h3>
                  <div className="bg-slate-50 p-4 rounded-2xl flex justify-between">
                    <div><p className="text-[8px] font-black opacity-50">CAJA</p><p className="font-black text-green-600">${item.revenue}</p></div>
                    <div><p className="text-[8px] font-black opacity-50">VISTAS</p><p className="font-black text-blue-600">{item.views}M</p></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white p-10 rounded-[50px] shadow-2xl border-2 border-slate-200 text-center">
               <p className="text-xs font-black text-slate-400 uppercase mb-2 tracking-[0.3em]">IA Sugerencia Operativa</p>
               <p className="text-5xl font-black italic text-[#003566] mb-4">REELS + TRAGEDIA</p>
               <p className="max-w-md mx-auto text-sm font-bold text-slate-500 uppercase">Usa el formato Reels para noticias de persecución hoy. Es el combo con mayor tasa de conversión de seguidores (315/M).</p>
            </div>
          </div>
        )}

        {/* 📜 PESTAÑA: HISTORIAL */}
        {activeTab === "historial" && (
          <div className="bg-white rounded-[40px] shadow-2xl p-8 border-2 border-slate-300 animate-in fade-in">
            <h2 className="text-2xl font-black text-[#003566] mb-8 uppercase italic border-b-4 border-slate-100 pb-4">Log Completo Enero 2026</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase bg-slate-50"><th className="p-4">Día</th><th className="p-4">Tema</th><th className="p-4">Vistas</th><th className="p-4">Caja</th></tr>
                </thead>
                <tbody className="divide-y-2">
                  {ENERO_DATA.map(i => (
                    <tr key={i.day} className="hover:bg-slate-50"><td className="p-4 font-black text-slate-400">0{i.day}</td><td className="p-4 font-black text-[#003566] italic uppercase truncate max-w-xs">{i.topic}</td><td className="p-4 font-black text-blue-600">{i.views}M</td><td className="p-4 font-black text-green-600 text-lg">${i.revenue.toFixed(2)}</td></tr>
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