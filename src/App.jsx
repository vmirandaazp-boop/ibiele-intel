import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://stenaxhdsfxrzhetetiz.supabase.co";
const supabaseAnonKey = "sb_publishable_Sk2d6wvlqXrwLKfBEfS8fw_t5PfImJN";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const FORMATS = [
  { value: "Foto", label: "Foto", icon: "📸", color: "bg-blue-600" },
  { value: "Reels", label: "Reels", icon: "🎬", color: "bg-slate-500" },
  { value: "Enlaces", label: "Enlaces", icon: "🔗", color: "bg-emerald-600" },
  { value: "Historias", label: "Historias", icon: "📱", color: "bg-slate-400" }
];

// 📊 DATA REAL RECUPERADA (ENERO 2026)
const ENERO_DATA = [
  { day: 1, date: "2026-01-01", views: 0.76, revenue: 7.85, topic: "🚫 PROHIBIDO QUEJARSE", followers: 167 },
  { day: 5, date: "2026-01-05", views: 13.07, revenue: 103.96, topic: "😭 SUSURRARON JESÚS", followers: 3081 },
  { day: 11, date: "2026-01-11", views: 9.19, revenue: 84.27, topic: "🏟️ CALIFORNIA 50K", followers: 1969 },
  { day: 25, date: "2026-01-25", views: 8.32, revenue: 70.59, topic: "🩸 PAGAN CON SANGRE", followers: 2101 },
  { day: 31, date: "2026-01-31", views: 1.83, revenue: 21.20, topic: "🇺🇸 CALIFORNIA FE", followers: 512 }
];

// 👥 DEMOGRAFÍA REAL
const DEMOGRAPHICS = {
  gender: [{ label: "Mujeres", val: 67.1, color: "bg-slate-400" }, { label: "Hombres", val: 32.9, color: "bg-blue-600" }],
  age: [{ r: "18-24", p: 5.0 }, { r: "25-34", p: 22.2 }, { r: "35-44", p: 29.1 }, { r: "45-54", p: 23.4 }, { r: "55+", p: 20.3 }],
  geo: [["🇲🇽 México", 25.8], ["🇨🇴 Colombia", 13.3], ["🇦🇷 Argentina", 10.0], ["🇵🇪 Perú", 6.2], ["🇪🇨 Ecuador", 5.7]]
};

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
    const { data: m } = await supabase.from("metrics").select("*").order('date', { ascending: false });
    if (m) setData(m);
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

  // --- LOGICA DE CÁLCULOS ---
  const febData = data.filter(i => i.date.includes("-02-"));
  const febRev = febData.reduce((s, i) => s + (Number(i.revenue) || 0), 0);
  const daysPassed = new Date().getDate();
  const dailyTarget = (1250 - febRev) / (28 - daysPassed || 1);
  const bestDay = ENERO_DATA.reduce((prev, curr) => (prev.revenue > curr.revenue) ? prev : curr);

  return (
    <div className="min-h-screen bg-slate-200 font-sans text-slate-900 border-[8px] md:border-[15px] border-[#003566]">
      
      {/* 🎖️ NAVBAR SUPREMA */}
      <nav className="bg-[#003566] text-white p-3 md:p-5 sticky top-0 z-50 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-3">
        <h1 className="text-xl md:text-3xl font-black italic uppercase">IBIELE <span className="text-blue-400">INTEL</span></h1>
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

        {/* 📟 PESTAÑA: DASHBOARD (AQUÍ ESTÁ EL FORMULARIO CORREGIDO) */}
        {activeTab === "dashboard" && (
          <div className="animate-in fade-in duration-500 space-y-6">
            
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* TARGET */}
              <div className="lg:col-span-2 bg-[#001d3d] p-6 md:p-10 rounded-[30px] md:rounded-[50px] text-white border-b-[10px] border-slate-400">
                <p className="text-[10px] font-black opacity-50 uppercase tracking-widest mb-1">Target Diario para Meta $1,250</p>
                <p className="text-5xl md:text-8xl font-black text-blue-400 italic tracking-tighter">${dailyTarget > 0 ? dailyTarget.toFixed(2) : "0.00"}</p>
                <div className="mt-8 flex justify-between text-[10px] font-black"><span>PROGRESO ACTUAL</span><span>{((febRev/1250)*100).toFixed(1)}%</span></div>
                <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden mt-1">
                   <div className="bg-gradient-to-r from-blue-600 to-green-400 h-full transition-all duration-1000" style={{width: `${Math.min((febRev/1250)*100, 100)}%`}}></div>
                </div>
              </div>

              {/* 📝 FORMULARIO CORREGIDO (YA APARECE TODO) */}
              <div className="bg-white p-6 rounded-[30px] md:rounded-[50px] shadow-xl border-2 border-slate-300">
                <h3 className="text-xs font-black text-[#003566] uppercase mb-4 italic tracking-widest border-b-2 pb-2">Registrar Operación</h3>
                <form onSubmit={save} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase ml-2">Fecha</label>
                      <input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} className="w-full p-2 bg-slate-50 rounded-xl border font-bold text-[10px]" required/>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase ml-2">Formato</label>
                      <select value={form.format} onChange={e=>setForm({...form, format:e.target.value})} className="w-full p-2 bg-slate-50 rounded-xl border font-bold text-[10px]">
                        {FORMATS.map(f => <option key={f.value} value={f.value}>{f.icon} {f.label}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-400 uppercase ml-2">Titular</label>
                    <input placeholder="NOMBRE DE LA NOTICIA" value={form.topic} onChange={e=>setForm({...form, topic:e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl border font-bold text-xs uppercase" required/>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase ml-2">Vistas (M)</label>
                      <input placeholder="0.00" type="number" step="0.01" value={form.views} onChange={e=>setForm({...form, views:e.target.value})} className="w-full p-2 bg-slate-50 rounded-xl border font-bold text-xs" required/>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase ml-2">Caja ($)</label>
                      <input placeholder="0.00" type="number" step="0.01" value={form.revenue} onChange={e=>setForm({...form, revenue:e.target.value})} className="w-full p-2 bg-green-50 border-2 border-green-100 font-black text-xs text-green-700" required/>
                    </div>
                  </div>
                  <button className="w-full bg-[#003566] text-white p-4 rounded-2xl font-black uppercase text-xs italic shadow-lg hover:bg-slate-800 transition-all">Sincronizar Imperio 🚀</button>
                </form>
              </div>
            </section>

            <div className="bg-white rounded-[40px] p-6 md:p-10 border-2 border-slate-300 shadow-xl">
               <h3 className="text-xl md:text-2xl font-black text-[#003566] mb-6 uppercase italic">Registros de Febrero</h3>
               <div className="space-y-3">
                 {febData.map(i => (
                   <div key={i.id} className="flex justify-between items-center p-4 md:p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-blue-50 transition-all">
                     <div className="min-w-0">
                       <p className="font-black text-[#003566] text-xs md:text-lg uppercase italic truncate">{i.topic}</p>
                       <p className="text-[8px] md:text-[10px] font-bold text-slate-400">FECHA: {i.date.split("-").reverse().join("/")} • {(i.views/1000000).toFixed(2)}M IMPACTO</p>
                     </div>
                     <div className="flex items-center gap-4">
                       <p className="font-black text-green-600 text-xl md:text-3xl">${Number(i.revenue).toFixed(2)}</p>
                       <button onClick={() => del(i.id)} className="text-red-300 hover:text-red-600 text-xs">🗑️</button>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}

        {/* 👥 PESTAÑA: AUDIENCIA (CON TODA LA INFO) */}
        {activeTab === "audiencia" && (
          <div className="space-y-8 animate-in zoom-in-95 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[50px] shadow-xl border-2 border-slate-300">
                <h2 className="text-2xl font-black text-[#003566] mb-8 uppercase italic tracking-tighter">Segmentación de Género</h2>
                <div className="space-y-8">
                   {DEMOGRAPHICS.gender.map(g => (
                     <div key={g.label}>
                       <div className="flex justify-between font-black text-xs mb-2"><span>{g.label.toUpperCase()}</span><span>{g.val}%</span></div>
                       <div className="w-full bg-slate-100 h-8 rounded-full overflow-hidden border-2"><div className={`${g.color} h-full`} style={{width: `${g.val}%`}}></div></div>
                     </div>
                   ))}
                </div>
              </div>
              <div className="bg-[#001d3d] p-8 rounded-[50px] text-white shadow-2xl border-b-[15px] border-slate-400">
                <h2 className="text-2xl font-black uppercase italic mb-8 tracking-tighter text-blue-400">Rango de Edad (Top)</h2>
                <div className="space-y-4">
                  {DEMOGRAPHICS.age.map(a => (
                    <div key={a.r} className="flex items-center justify-between">
                      <span className="font-black text-xs">{a.r} AÑOS</span>
                      <div className="flex-1 mx-4 bg-white/10 h-1 rounded-full overflow-hidden">
                        <div className="bg-blue-400 h-full" style={{width: `${a.p*3}%`}}></div>
                      </div>
                      <span className="font-black text-blue-300">{a.p}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-[50px] shadow-xl border-2 border-slate-300">
               <h2 className="text-2xl font-black text-[#003566] mb-6 uppercase italic text-center">Geografía del Imperio</h2>
               <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                 {DEMOGRAPHICS.geo.map(p => (
                   <div key={p[0]} className="text-center p-4 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-2xl mb-1">{p[0].split(" ")[0]}</p>
                      <p className="font-black text-[10px] text-[#003566] uppercase">{p[0].split(" ")[1]}</p>
                      <p className="text-xl font-black text-blue-600">{p[1]}%</p>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}

        {/* 🎯 PESTAÑA: ESTRATEGIA (ORÁCULO) */}
        {activeTab === "estrategia" && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <div className="bg-[#001d3d] p-10 md:p-16 rounded-[60px] text-white border-b-[15px] border-slate-400 text-center">
               <p className="text-xs font-black text-blue-400 uppercase tracking-[0.3em] mb-4">Estrategia Predictiva</p>
               <h2 className="text-4xl md:text-7xl font-black italic mb-8 uppercase tracking-tighter leading-none">REELS + TRAGEDIA</h2>
               <p className="max-w-2xl mx-auto text-sm md:text-lg font-bold text-slate-400 uppercase leading-tight">
                 Basado en el récord de <span className="text-white">${bestDay.revenue}</span>, tu contenido debe centrarse en "Noticias de Clamor" con formato Reel. 
                 La tasa de conversión es de <span className="text-white">315 seguidores</span> por millón de vistas.
               </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ENERO_DATA.slice(0,3).map((item, idx) => (
                <div key={idx} className="bg-white p-8 rounded-[40px] shadow-xl border-t-8 border-[#003566]">
                  <p className="text-[10px] font-black text-slate-400 mb-2 uppercase">Patrón #{idx+1}</p>
                  <h3 className="font-black text-[#003566] italic leading-tight mb-4">{item.topic}</h3>
                  <p className="text-green-600 font-black text-2xl">${item.revenue}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 📜 PESTAÑA: HISTORIAL (MOBILE PROTECTED) */}
        {activeTab === "historial" && (
          <div className="bg-white rounded-[40px] shadow-2xl p-6 md:p-10 border-2 border-slate-300 animate-in fade-in">
            <h2 className="text-2xl font-black text-[#003566] mb-8 uppercase italic border-b-4 border-slate-100 pb-4">Log Maestro 2026</h2>
            <div className="overflow-x-auto no-scrollbar">
              <div className="min-w-[600px] md:min-w-0">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <tr><th className="p-4">Fecha</th><th className="p-4">Titular</th><th className="p-4">Caja</th><th className="p-4">Alcance</th></tr>
                  </thead>
                  <tbody className="divide-y-2">
                    {febData.map(i => (
                      <tr key={i.id} className="hover:bg-blue-50 transition-colors">
                        <td className="p-4 font-bold text-slate-400">{i.date.split("-").reverse().slice(0,2).join("/")}</td>
                        <td className="p-4 font-black text-[#003566] uppercase italic truncate max-w-xs">{i.topic}</td>
                        <td className="p-4 font-black text-green-600 text-xl">${Number(i.revenue).toFixed(2)}</td>
                        <td className="p-4 font-black text-blue-600">{(i.views/1000000).toFixed(2)}M</td>
                      </tr>
                    ))}
                    {ENERO_DATA.map(i => (
                      <tr key={i.day} className="bg-slate-50/50 grayscale"><td className="p-4 font-bold text-slate-300">{i.date.split("-").reverse().slice(0,2).join("/")}</td><td className="p-4 font-black text-slate-400 uppercase italic truncate max-w-xs">{i.topic}</td><td className="p-4 font-black text-slate-400 text-xl">${i.revenue}</td><td className="p-4 font-black text-slate-300">{i.views}M</td></tr>
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