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

// 📊 DATA REAL DE ENERO 2026 (BASE DE INTELIGENCIA)
const ENERO_DATA = [
  { day: 1, date: "2026-01-01", views: 0.76, revenue: 7.85, topic: "🚫 PROHIBIDO QUEJARSE", followers: 240 },
  { day: 5, date: "2026-01-05", views: 13.07, revenue: 103.96, topic: "😭 SUSURRARON JESÚS", followers: 4117 },
  { day: 11, date: "2026-01-11", views: 9.19, revenue: 84.27, topic: "🏟️ CALIFORNIA 50K", followers: 2894 },
  { day: 25, date: "2026-01-25", views: 8.32, revenue: 70.59, topic: "🩸 PAGAN CON SANGRE", followers: 2631 },
  { day: 31, date: "2026-01-31", views: 1.83, revenue: 21.20, topic: "🇺🇸 CALIFORNIA FE", followers: 669 }
];

const DEMO = {
  gender: [{ l: "Mujeres", v: 67.1, c: "bg-slate-400" }, { l: "Hombres", v: 32.9, c: "bg-blue-600" }],
  geo: [["🇲🇽 México", 25.8], ["🇨🇴 Colombia", 13.3], ["🇦🇷 Argentina", 10.0], ["🇵🇪 Perú", 6.2]],
  age: [{ r: "18-34", p: 31.0 }, { r: "35-44", p: 29.1 }, { r: "45-54", p: 23.4 }, { r: "55+", p: 16.5 }]
};

export default function App() {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    revenue: "", views: "", interactions: "", followers: "", format: "Foto", topic: ""
  });

  const load = useCallback(async () => {
    setLoading(true);
    const { data: m } = await supabase.from("metrics").select("*").order('date', { ascending: false });
    if (m) setData(m);
    setLoading(false);
  }, []);

  useEffect(() => { load(); const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, [load]);

  const save = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      revenue: parseFloat(form.revenue) || 0,
      views: (parseFloat(form.views) || 0) * 1000000,
      interactions: (parseFloat(form.interactions) || 0) * 1000,
      followers: parseFloat(form.followers) || 0,
      topic: form.topic.toUpperCase()
    };

    if (editingId) {
      await supabase.from("metrics").update(payload).eq('id', editingId);
      setEditingId(null);
    } else {
      await supabase.from("metrics").insert([payload]);
    }
    setForm({ date: new Date().toISOString().split('T')[0], revenue: "", views: "", interactions: "", followers: "", format: "Foto", topic: "" });
    load();
  };

  const handleEdit = (i) => {
    setEditingId(i.id);
    setForm({ date: i.date, revenue: i.revenue.toString(), views: (i.views/1000000).toString(), interactions: (i.interactions/1000).toString(), followers: i.followers.toString(), format: i.format, topic: i.topic });
    setActiveTab("dashboard");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const del = async (id) => { if(window.confirm("¿BORRAR?")) { await supabase.from("metrics").delete().eq('id', id); load(); } };

  // --- CÁLCULOS ---
  const febData = data.filter(i => i.date.includes("-02-"));
  const febRev = febData.reduce((s, i) => s + (Number(i.revenue) || 0), 0);
  const dailyTarget = (1250 - febRev) / (28 - new Date().getDate() || 1);
  const bestJan = ENERO_DATA.reduce((p, c) => (p.revenue > c.revenue) ? p : c);

  return (
    <div className="min-h-screen bg-slate-200 font-sans text-slate-900 border-[8px] md:border-[15px] border-[#003566]">
      
      {/* 🎖️ HEADER MÓVIL OPTIMIZADO */}
      <nav className="bg-[#003566] text-white p-3 md:p-5 sticky top-0 z-50 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-3">
        <h1 className="text-xl md:text-3xl font-black italic uppercase">IBIELE <span className="text-blue-400">INTEL</span></h1>
        <div className="flex bg-white/5 p-1 rounded-xl overflow-x-auto no-scrollbar max-w-full">
          {["dashboard", "audiencia", "estrategia", "historial"].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 rounded-lg text-[9px] md:text-[11px] font-black uppercase transition-all ${activeTab === t ? "bg-white text-[#003566] shadow-lg" : "text-blue-200"}`}>
              {t}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-3 md:p-8 space-y-6">

        {activeTab === "dashboard" && (
          <div className="animate-in fade-in duration-500 space-y-6">
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* TARGET CARD */}
              <div className="lg:col-span-2 bg-[#001d3d] p-6 md:p-10 rounded-[30px] md:rounded-[50px] text-white border-b-8 border-slate-400">
                <p className="text-[10px] font-black opacity-50 uppercase tracking-widest mb-1">Target Diario Meta $1,250</p>
                <p className="text-5xl md:text-8xl font-black text-blue-400 italic tracking-tighter">${dailyTarget > 0 ? dailyTarget.toFixed(2) : "0.00"}</p>
                <div className="mt-8 flex justify-between text-[10px] font-black uppercase opacity-60"><span>Febrero Acumulado</span><span>${febRev.toFixed(2)}</span></div>
                <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden mt-1"><div className="bg-gradient-to-r from-blue-600 to-green-400 h-full" style={{width: `${Math.min((febRev/1250)*100, 100)}%`}}></div></div>
              </div>

              {/* FORMULARIO DINÁMICO */}
              <div className={`p-6 rounded-[30px] md:rounded-[50px] shadow-xl border-4 ${editingId ? 'bg-blue-50 border-blue-500' : 'bg-white border-slate-300'}`}>
                <h3 className="text-xs font-black text-[#003566] uppercase mb-4 border-b-2 pb-2 italic">{editingId ? "⚡ EDITANDO" : "📝 REGISTRO"}</h3>
                <form onSubmit={save} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} className="p-2 bg-slate-50 rounded-xl border font-bold text-[10px]" required/>
                    <select value={form.format} onChange={e=>setForm({...form, format:e.target.value})} className="p-2 bg-slate-50 rounded-xl border font-bold text-[10px]">
                      {FORMATS.map(f => <option key={f.value} value={f.value}>{f.icon} {f.label}</option>)}
                    </select>
                  </div>
                  <input placeholder="TEMA / TITULAR" value={form.topic} onChange={e=>setForm({...form, topic:e.target.value})} className="w-full p-2 bg-slate-50 rounded-xl border font-bold text-xs uppercase" required/>
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder="Vistas (M)" type="number" step="0.01" value={form.views} onChange={e=>setForm({...form, views:e.target.value})} className="p-2 bg-slate-50 rounded-xl border font-bold text-xs" required/>
                    <input placeholder="Caja ($)" type="number" step="0.01" value={form.revenue} onChange={e=>setForm({...form, revenue:e.target.value})} className="p-2 bg-green-50 border-2 border-green-100 font-black text-xs text-green-700" required/>
                  </div>
                  <button className="w-full bg-[#003566] text-white p-3 rounded-2xl font-black uppercase text-xs italic shadow-lg">{editingId ? "ACTUALIZAR" : "SINCRONIZAR"} 🚀</button>
                </form>
              </div>
            </section>

            {/* BITÁCORA FUNCIONAL */}
            <div className="bg-white rounded-[40px] p-4 md:p-10 border-2 border-slate-300 shadow-xl overflow-x-auto no-scrollbar">
               <h3 className="text-xl font-black text-[#003566] mb-6 uppercase italic">Operaciones de Febrero</h3>
               <div className="min-w-[500px] space-y-2">
                 {febData.map(i => (
                   <div key={i.id} onClick={() => handleEdit(i)} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-blue-50 cursor-pointer transition-all">
                     <div className="flex-1"><p className="font-black text-[#003566] text-sm uppercase truncate">{i.topic}</p><p className="text-[9px] font-bold text-slate-400 uppercase">{i.date} • {(i.views/1000000).toFixed(2)}M</p></div>
                     <div className="flex items-center gap-6"><p className="font-black text-green-600 text-2xl">${Number(i.revenue).toFixed(2)}</p><button onClick={(e)=>{e.stopPropagation(); del(i.id);}} className="text-red-300 hover:text-red-600">🗑️</button></div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}

        {activeTab === "audiencia" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in zoom-in-95 duration-500">
            <div className="bg-white p-8 rounded-[40px] shadow-xl border-2 border-slate-300">
              <h2 className="text-xl font-black text-[#003566] mb-8 uppercase italic">Género</h2>
              <div className="space-y-6">
                {DEMO.gender.map(g => (
                  <div key={g.l}><div className="flex justify-between font-black text-[10px] mb-1"><span>{g.l}</span><span>{g.v}%</span></div><div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden border"><div className={`${g.c} h-full`} style={{width: `${g.v}%`}}></div></div></div>
                ))}
              </div>
            </div>
            <div className="bg-[#001d3d] p-8 rounded-[40px] text-white shadow-xl">
              <h2 className="text-xl font-black uppercase mb-6 text-blue-400 italic">Países</h2>
              <div className="space-y-3">
                {DEMO.geo.map(p => (
                  <div key={p[0]} className="flex justify-between border-b border-white/5 pb-1"><span className="font-black text-[10px] uppercase">{p[0]}</span><span className="font-black text-blue-400">{p[1]}%</span></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "estrategia" && (
          <div className="bg-[#001d3d] p-8 md:p-16 rounded-[40px] md:rounded-[60px] text-white text-center animate-in slide-in-from-right-4">
             <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4">IA Predictive Strategy</p>
             <h2 className="text-4xl md:text-7xl font-black italic mb-6">REELS + TRAGEDIA</h2>
             <p className="text-xs md:text-lg font-bold text-slate-400 uppercase max-w-xl mx-auto">Basado en el éxito de ${bestJan.revenue}, enfócate en impacto emocional. Conversión: 315 seguidores/M.</p>
          </div>
        )}

        {activeTab === "historial" && (
          <div className="bg-white rounded-2xl md:rounded-[40px] p-4 md:p-10 border-2 border-slate-300 animate-in fade-in">
            <h2 className="text-xl font-black text-[#003566] uppercase italic mb-6 border-b-4 pb-2">Enero Real</h2>
            <div className="overflow-x-auto"><table className="w-full text-left min-w-[500px]">
                <thead className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase"><tr><th className="p-3">Día</th><th className="p-3">Titular</th><th className="p-3">Caja</th><th className="p-3">Vistas</th></tr></thead>
                <tbody className="divide-y-2">{ENERO_DATA.map(i => (
                  <tr key={i.day} className="hover:bg-blue-50/50"><td className="p-3 font-black text-slate-400">0{i.day}</td><td className="p-3 font-black text-[#003566] uppercase italic truncate max-w-[150px]">{i.topic}</td><td className="p-3 font-black text-green-600 text-base">${i.revenue.toFixed(2)}</td><td className="p-3 font-black text-blue-600">{i.views}M</td></tr>
                ))}</tbody>
            </table></div>
          </div>
        )}
      </main>
    </div>
  );
}