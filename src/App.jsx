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
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null); // Para saber si estamos editando
  
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    revenue: "", views: "", interactions: "", followers: "", format: "Foto", topic: ""
  });

  const load = useCallback(async () => {
    setLoading(true);
    const { data: m, error } = await supabase.from("metrics").select("*").order('date', { ascending: false });
    if (!error) setData(m || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

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
      // MODO EDICIÓN
      const { error } = await supabase.from("metrics").update(payload).eq('id', editingId);
      if (!error) {
        alert("¡Registro Actualizado!");
        setEditingId(null);
      }
    } else {
      // MODO GUARDAR NUEVO
      const { error } = await supabase.from("metrics").insert([payload]);
      if (!error) alert("¡Sincronización Exitosa!");
    }

    setForm({ date: new Date().toISOString().split('T')[0], revenue: "", views: "", interactions: "", followers: "", format: "Foto", topic: "" });
    load();
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      date: item.date,
      revenue: item.revenue.toString(),
      views: (item.views / 1000000).toString(),
      interactions: (item.interactions / 1000).toString(),
      followers: item.followers.toString(),
      format: item.format,
      topic: item.topic
    });
    setActiveTab("dashboard"); // Volver arriba para editar
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const del = async (id) => {
    if(window.confirm("¿BORRAR REGISTRO DEFINITIVAMENTE?")) {
      await supabase.from("metrics").delete().eq('id', id);
      load();
    }
  };

  // --- CÁLCULOS ---
  const febData = data.filter(i => i.date.includes("-02-"));
  const febRev = febData.reduce((s, i) => s + (Number(i.revenue) || 0), 0);
  const daysPassed = new Date().getDate();
  const dailyTarget = (1250 - febRev) / (28 - daysPassed || 1);

  return (
    <div className="min-h-screen bg-slate-200 font-sans text-slate-900 border-[8px] md:border-[15px] border-[#003566]">
      
      <nav className="bg-[#003566] text-white p-3 md:p-5 sticky top-0 z-50 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-3">
        <h1 className="text-xl md:text-3xl font-black italic uppercase">IBIELE <span className="text-blue-400">INTEL</span></h1>
        <div className="flex bg-white/5 p-1 rounded-xl overflow-x-auto no-scrollbar max-w-full">
          {["dashboard", "audiencia", "estrategia", "historial"].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 rounded-lg text-[10px] md:text-[11px] font-black uppercase transition-all ${activeTab === t ? "bg-white text-[#003566] shadow-lg" : "text-blue-200"}`}>
              {t}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-3 md:p-8 space-y-6">

        {activeTab === "dashboard" && (
          <div className="animate-in fade-in duration-500 space-y-6">
            
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* TARGET */}
              <div className="lg:col-span-2 bg-[#001d3d] p-6 md:p-10 rounded-[30px] md:rounded-[50px] text-white border-b-[10px] border-slate-400">
                <p className="text-[10px] font-black opacity-50 uppercase tracking-widest mb-1">Target Diario para Meta $1,250</p>
                <p className="text-5xl md:text-8xl font-black text-blue-400 italic tracking-tighter">${dailyTarget > 0 ? dailyTarget.toFixed(2) : "0.00"}</p>
                <p className="text-[10px] font-black mt-4 opacity-70 uppercase">Progreso: {((febRev/1250)*100).toFixed(1)}%</p>
              </div>

              {/* FORMULARIO DE PODER */}
              <div className={`p-6 rounded-[30px] md:rounded-[50px] shadow-xl border-4 transition-all ${editingId ? 'bg-blue-50 border-blue-500' : 'bg-white border-slate-300'}`}>
                <h3 className="text-xs font-black text-[#003566] uppercase mb-4 italic tracking-widest border-b-2 pb-2">
                  {editingId ? "⚡ Editando Registro" : "📝 Registrar Operación"}
                </h3>
                <form onSubmit={save} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} className="p-2 bg-slate-50 rounded-xl border font-bold text-[10px]" required/>
                    <select value={form.format} onChange={e=>setForm({...form, format:e.target.value})} className="p-2 bg-slate-50 rounded-xl border font-bold text-[10px]">
                      {FORMATS.map(f => <option key={f.value} value={f.value}>{f.icon} {f.label}</option>)}
                    </select>
                  </div>
                  <input placeholder="TEMA / TITULAR" value={form.topic} onChange={e=>setForm({...form, topic:e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl border font-bold text-xs uppercase" required/>
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder="Vistas (M)" type="number" step="0.01" value={form.views} onChange={e=>setForm({...form, views:e.target.value})} className="p-2 bg-slate-50 rounded-xl border font-bold text-xs" required/>
                    <input placeholder="Caja ($)" type="number" step="0.01" value={form.revenue} onChange={e=>setForm({...form, revenue:e.target.value})} className="p-2 bg-green-50 border-2 border-green-100 font-black text-xs text-green-700" required/>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-[#003566] text-white p-4 rounded-2xl font-black uppercase text-xs italic shadow-lg hover:bg-slate-800 transition-all">
                      {editingId ? "ACTUALIZAR" : "SINCRONIZAR"} 🚀
                    </button>
                    {editingId && (
                      <button type="button" onClick={() => {setEditingId(null); setForm({date: new Date().toISOString().split('T')[0], revenue: "", views: "", interactions: "", followers: "", format: "Foto", topic: ""})}} className="bg-slate-400 text-white p-4 rounded-2xl font-black text-xs uppercase italic">X</button>
                    )}
                  </div>
                </form>
              </div>
            </section>

            <div className="bg-white rounded-[40px] p-6 md:p-10 border-2 border-slate-300 shadow-xl overflow-hidden">
               <h3 className="text-xl md:text-2xl font-black text-[#003566] mb-6 uppercase italic">Registros Actuales</h3>
               <div className="overflow-x-auto no-scrollbar">
                 <div className="min-w-[600px] md:min-w-0 space-y-3">
                   {febData.map(i => (
                     <div key={i.id} className="flex justify-between items-center p-4 md:p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-blue-50 transition-all cursor-pointer" onClick={() => handleEdit(i)}>
                       <div className="min-w-0">
                         <p className="font-black text-[#003566] text-xs md:text-lg uppercase italic truncate">{i.topic}</p>
                         <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase">DÍA: {i.date.split("-").reverse().join("/")} • {(i.views/1000000).toFixed(2)}M VISTAS</p>
                       </div>
                       <div className="flex items-center gap-6">
                         <div className="text-right">
                            <p className="text-[8px] font-black text-slate-400">CAJA USD</p>
                            <p className="font-black text-green-600 text-xl md:text-3xl leading-none">${Number(i.revenue).toFixed(2)}</p>
                         </div>
                         <button onClick={(e) => { e.stopPropagation(); del(i.id); }} className="text-red-300 hover:text-red-600">🗑️</button>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* ... (Otras pestañas se mantienen estéticas como antes) */}
        {activeTab === "historial" && (
          <div className="bg-white rounded-[40px] shadow-2xl p-6 md:p-10 border-2 border-slate-300 animate-in fade-in">
            <h2 className="text-2xl font-black text-[#003566] mb-8 uppercase italic border-b-4 border-slate-100 pb-4">Log Maestro 2026</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <tr><th className="p-4">Día</th><th className="p-4">Titular</th><th className="p-4">Caja</th><th className="p-4">Alcance</th></tr>
                </thead>
                <tbody className="divide-y-2">
                  {ENERO_DATA.map(i => (
                    <tr key={i.day} className="bg-slate-50/50 grayscale"><td className="p-4 font-bold text-slate-300">{i.date.split("-").reverse().slice(0,2).join("/")}</td><td className="p-4 font-black text-slate-400 uppercase italic truncate max-w-xs">{i.topic}</td><td className="p-4 font-black text-slate-400 text-xl">${i.revenue}</td><td className="p-4 font-black text-slate-300">{i.views}M</td></tr>
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