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
  { day: 1, date: "2026-01-01", views: 0.76, revenue: 7.85, topic: "🚫 PROHIBIDO QUEJARSE", format: "Foto" },
  { day: 5, date: "2026-01-05", views: 13.07, revenue: 103.96, topic: "😭 SUSURRARON JESÚS", format: "Foto" },
  { day: 11, date: "2026-01-11", views: 9.19, revenue: 84.27, topic: "🏟️ CALIFORNIA 50K", format: "Foto" },
  { day: 25, date: "2026-01-25", views: 8.32, revenue: 70.59, topic: "🩸 PAGAN CON SANGRE", format: "Foto" },
  { day: 31, date: "2026-01-31", views: 1.83, revenue: 21.20, topic: "🇺🇸 CALIFORNIA FE", format: "Foto" }
];

export default function App() {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [time, setTime] = useState(new Date());
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    revenue: "", views: "", interactions: "", followers: "", format: "Foto", topic: ""
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    const { data: m, error } = await supabase.from("metrics").select("*").order('date', { ascending: false });
    if (!error) setData(m || []);
    setLoading(false);
  }, []);

  useEffect(() => { 
    loadData(); 
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [loadData]);

  const saveData = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      revenue: parseFloat(formData.revenue) || 0,
      views: (parseFloat(formData.views) || 0) * 1000000,
      interactions: (parseFloat(formData.interactions) || 0) * 1000,
      followers: parseFloat(formData.followers) || 0,
      topic: formData.topic.toUpperCase()
    };

    if (editingId) {
      await supabase.from("metrics").update(payload).eq('id', editingId);
      setEditingId(null);
    } else {
      await supabase.from("metrics").insert([payload]);
    }
    setFormData({ date: new Date().toISOString().split('T')[0], revenue: "", views: "", interactions: "", followers: "", format: "Foto", topic: "" });
    loadData();
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      date: item.date,
      revenue: item.revenue.toString(),
      views: (item.views / 1000000).toString(),
      interactions: (item.interactions / 1000).toString() || "",
      followers: item.followers?.toString() || "",
      format: item.format,
      topic: item.topic
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteRow = async (id) => {
    if(window.confirm("¿BORRAR?")) {
      await supabase.from("metrics").delete().eq('id', id);
      loadData();
    }
  };

  const febData = data.filter(item => item.date.split("-")[1] === "02");
  const totalRevenue = febData.reduce((sum, item) => sum + (Number(item.revenue) || 0), 0);
  const dailyTarget = (1250 - totalRevenue) / (28 - new Date().getDate() || 1);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 border-[8px] md:border-[15px] border-[#003566]">
      
      {/* 🎖️ HEADER TÁCTICO */}
      <header className="bg-[#003566] text-white p-4 shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase">IBIELE <span className="text-blue-400">INTEL</span></h1>
            <p className="text-[8px] md:text-[10px] font-bold opacity-70 uppercase">{time.toLocaleTimeString()} • COMANDO</p>
          </div>
          <div className="flex bg-white/5 p-1 rounded-xl overflow-x-auto no-scrollbar">
            {["dashboard", "audiencia", "estrategia", "historico"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg font-black text-[10px] uppercase transition ${activeTab === tab ? "bg-white text-[#003566] shadow-lg" : "text-blue-200"}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">

        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* TARGET CARD (FEBRERO) */}
              <div className="lg:col-span-2 bg-[#001d3d] p-6 md:p-10 rounded-[30px] md:rounded-[40px] text-white border-b-8 border-blue-500 shadow-2xl">
                <p className="text-[10px] font-black opacity-50 uppercase tracking-widest mb-1">Target Diario Febrero</p>
                <p className="text-5xl md:text-8xl font-black text-blue-400 italic tracking-tighter">${dailyTarget > 0 ? dailyTarget.toFixed(2) : "0.00"}</p>
                <div className="mt-8 flex justify-between text-[10px] font-black"><span>PROGRESO ACTUAL</span><span>{((totalRevenue/1250)*100).toFixed(1)}%</span></div>
                <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden mt-1"><div className="bg-gradient-to-r from-blue-600 to-green-400 h-full" style={{width: `${Math.min((totalRevenue/1250)*100, 100)}%`}}></div></div>
              </div>

              {/* FORMULARIO BLINDADO */}
              <div className={`p-6 rounded-[30px] md:rounded-[40px] shadow-xl border-4 ${editingId ? 'bg-blue-50 border-blue-600' : 'bg-white border-slate-300'}`}>
                <h3 className="text-xs font-black text-[#003566] uppercase mb-4 border-b-2 pb-2 italic">{editingId ? "⚡ EDITANDO" : "📝 REGISTRO"}</h3>
                <form onSubmit={saveData} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input type="date" value={formData.date} onChange={e=>setFormData({...formData, date:e.target.value})} className="p-2 bg-slate-50 rounded-xl border font-bold text-[10px]" required/>
                    <select value={formData.format} onChange={e=>setFormData({...formData, format:e.target.value})} className="p-2 bg-slate-50 rounded-xl border font-bold text-[10px]">
                      {FORMATS.map(f => <option key={f.value} value={f.value}>{f.icon} {f.label}</option>)}
                    </select>
                  </div>
                  <input placeholder="TEMA / TITULAR" value={formData.topic} onChange={e=>setFormData({...formData, topic:e.target.value})} className="w-full p-2 bg-slate-50 rounded-xl border font-bold text-xs uppercase" required/>
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder="Vistas (M)" type="number" step="0.01" value={formData.views} onChange={e=>setFormData({...formData, views:e.target.value})} className="p-2 bg-slate-50 rounded-xl border font-bold text-xs" required/>
                    <input placeholder="Caja ($)" type="number" step="0.01" value={formData.revenue} onChange={e=>setFormData({...formData, revenue:e.target.value})} className="p-2 bg-green-50 border-2 border-green-100 font-black text-xs text-green-700" required/>
                  </div>
                  <button className="w-full bg-[#003566] text-white p-4 rounded-2xl font-black uppercase text-xs italic shadow-lg hover:bg-slate-800 transition-all">{editingId ? "Actualizar" : "Sincronizar"} 🚀</button>
                </form>
              </div>
            </section>

            {/* BITÁCORA FEBRERO */}
            <div className="bg-white rounded-[40px] p-4 md:p-8 border-2 border-slate-300 shadow-xl overflow-x-auto no-scrollbar">
               <h3 className="text-xl md:text-2xl font-black text-[#003566] mb-6 uppercase italic">Operaciones Febrero</h3>
               <div className="min-w-[500px] space-y-2">
                 {febData.map(i => (
                   <div key={i.id} onClick={() => handleEdit(i)} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:bg-blue-50 cursor-pointer">
                     <div className="flex-1 min-w-0"><p className="font-black text-[#003566] text-sm md:text-base uppercase truncate pr-4">{i.topic}</p><p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase">{i.date} • {(i.views/1000000).toFixed(2)}M VISTAS</p></div>
                     <div className="flex items-center gap-6"><p className="font-black text-green-600 text-xl md:text-3xl">${Number(i.revenue).toFixed(2)}</p><button onClick={(e)=>{e.stopPropagation(); deleteRow(i.id);}} className="text-red-400 text-xl">🗑️</button></div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}

        {/* 📜 HISTORIAL ENERO (ELEGANTE Y DISTINTO) */}
        {activeTab === "historico" && (
          <div className="bg-white rounded-[40px] shadow-2xl p-6 md:p-10 border-2 border-slate-300 animate-in fade-in">
            <h2 className="text-2xl font-black text-slate-400 mb-8 uppercase italic border-b-4 border-slate-100 pb-4">Log Histórico Enero <span className="text-[10px] italic font-bold">(Lectura)</span></h2>
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left min-w-[500px]">
                <thead className="bg-slate-100 text-[10px] font-black uppercase text-slate-500">
                  <tr><th className="p-4">Día</th><th className="p-4">Titular de Noticia</th><th className="p-4">Caja</th><th className="p-4">Alcance</th></tr>
                </thead>
                <tbody className="divide-y-2">
                  {ENERO_DATA.map(i => (
                    <tr key={i.day} className="grayscale-[0.5] opacity-70">
                      <td className="p-4 font-black text-slate-400">DÍA 0{i.day}</td>
                      <td className="p-4 font-black text-slate-600 uppercase italic truncate max-w-xs">{i.topic}</td>
                      <td className="p-4 font-black text-slate-700 text-xl">${i.revenue.toFixed(2)}</td>
                      <td className="p-4 font-black text-slate-500">{i.views}M</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REPLICAR AQUÍ TABS AUDIENCIA Y ESTRATEGIA CON DISEÑO SIMPLE Y ROBUSTO SI ES NECESARIO */}
        {activeTab === "audiencia" && (
           <div className="bg-white p-8 rounded-[40px] text-center shadow-xl border-2 border-slate-300 animate-in zoom-in-95">
             <h2 className="text-2xl font-black text-[#003566] uppercase mb-4 italic">Audiencia del Imperio</h2>
             <p className="text-slate-500 font-bold uppercase text-xs">Mujeres: 67.1% | Hombres: 32.9%</p>
             <div className="mt-6 flex justify-center gap-2"><div className="bg-slate-400 h-8 w-40 rounded-l-full"></div><div className="bg-blue-600 h-8 w-20 rounded-r-full"></div></div>
           </div>
        )}

      </main>
    </div>
  );
}