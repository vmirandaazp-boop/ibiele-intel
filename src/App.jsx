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
  { day: 1, date: "2026-01-01", views: 0.76, revenue: 7.85, topic: "🚫 PROHIBIDO QUEJARSE", followers: 240 },
  { day: 5, date: "2026-01-05", views: 13.07, revenue: 103.96, topic: "😭 SUSURRARON JESÚS", followers: 4117 },
  { day: 11, date: "2026-01-11", views: 9.19, revenue: 84.27, topic: "🏟️ CALIFORNIA 50K", followers: 2894 },
  { day: 25, date: "2026-01-25", views: 8.32, revenue: 70.59, topic: "🩸 PAGAN CON SANGRE", followers: 2631 },
  { day: 31, date: "2026-01-31", views: 1.83, revenue: 21.20, topic: "🇺🇸 CALIFORNIA FE", followers: 669 }
];

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingId, setEditingId] = useState(null);
  const [time, setTime] = useState(new Date());

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    revenue: "", views: "", interactions: "", followers: "", format: "Foto", topic: ""
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: metrics, error } = await supabase.from("metrics").select("*").order('date', { ascending: false });
      if (!error) setData(metrics || []);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
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
      topic: formData.topic.toUpperCase().trim()
    };

    try {
      if (editingId) {
        await supabase.from("metrics").update(payload).eq('id', editingId);
        setEditingId(null);
      } else {
        await supabase.from("metrics").insert([payload]);
      }
      setFormData({ date: new Date().toISOString().split('T')[0], revenue: "", views: "", interactions: "", followers: "", format: "Foto", topic: "" });
      loadData();
    } catch (err) { alert("Error al guardar: Asegúrate de correr el SQL del Paso 1"); }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      date: item.date,
      revenue: item.revenue?.toString() || "",
      views: item.views ? (item.views / 1000000).toString() : "",
      interactions: item.interactions ? (item.interactions / 1000).toString() : "",
      followers: item.followers?.toString() || "",
      format: item.format || "Foto",
      topic: item.topic || ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteRow = async (id) => {
    if(window.confirm("¿BORRAR REGISTRO?")) {
      await supabase.from("metrics").delete().eq('id', id);
      loadData();
    }
  };

  const febData = data.filter(item => item.date?.includes("-02-"));
  const totalRevenue = febData.reduce((sum, item) => sum + (parseFloat(item.revenue) || 0), 0);
  const dailyTarget = (1250 - totalRevenue) / (28 - new Date().getDate() || 1);
  const bestDay = ENERO_DATA.reduce((max, item) => item.revenue > max.revenue ? item : max, ENERO_DATA[0]);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 border-[8px] md:border-[15px] border-[#003566]">
      <header className="bg-[#003566] text-white p-4 shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase">IBIELE <span className="text-blue-400">INTEL</span></h1>
            <p className="text-[8px] md:text-[10px] font-bold opacity-70 uppercase mt-1">{time.toLocaleTimeString()} • COMANDO</p>
          </div>
          <div className="w-full md:w-auto overflow-x-auto no-scrollbar flex justify-center">
            <div className="flex bg-white/5 p-1 rounded-xl">
              {["dashboard", "historico"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg font-black text-[10px] uppercase transition ${activeTab === tab ? "bg-white text-[#003566] shadow-lg" : "text-blue-200"}`}>{tab.toUpperCase()}</button>
              ))}
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-[8px] md:text-[10px] font-black opacity-50 uppercase tracking-widest">Feb Revenue</p>
            <p className="text-xl md:text-3xl font-black text-green-400">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-3 md:p-6 space-y-6">
        {activeTab === "dashboard" && (
          <div className="animate-in fade-in duration-500 space-y-6">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* ENERO: GRIS/PIZARRA ELEGANTE */}
               <div className="bg-slate-500 p-6 rounded-xl md:rounded-[40px] text-white border-b-8 border-slate-700 shadow-xl opacity-90">
                  <h2 className="text-sm font-black uppercase opacity-60 mb-2 italic">Enero Histórico</h2>
                  <div className="flex justify-between items-end">
                    <div><p className="text-4xl font-black italic">$1,104.32</p><p className="text-[8px] font-bold uppercase tracking-widest">Cierre de Archivo</p></div>
                    <div className="text-[10px] font-black bg-white/10 px-3 py-1 rounded-full">LECTURA</div>
                  </div>
               </div>
               {/* FEBRERO: AZUL IMPERIAL VIVO */}
               <div className="bg-[#003566] p-6 rounded-xl md:rounded-[40px] text-white border-b-8 border-blue-900 shadow-xl">
                  <h2 className="text-sm font-black uppercase opacity-60 mb-2 italic">Febrero Actual</h2>
                  <div className="flex justify-between items-end">
                    <div><p className="text-4xl font-black italic text-blue-400">${totalRevenue.toFixed(2)}</p><p className="text-[8px] font-bold uppercase tracking-widest">Progreso Meta $1,250</p></div>
                    <div className="text-[10px] font-black bg-blue-500 px-3 py-1 rounded-full animate-pulse tracking-tighter">OPERATIVO</div>
                  </div>
               </div>
            </section>

            {/* FORMULARIO */}
            <section className={`p-4 md:p-8 rounded-xl md:rounded-[40px] shadow-xl border-4 transition-colors ${editingId ? 'bg-blue-50 border-blue-500' : 'bg-white border-slate-300'}`}>
              <h3 className="text-xs font-black text-[#003566] uppercase mb-4 border-b-2 pb-2 italic">{editingId ? "⚡ EDITANDO" : "📝 REGISTRO"}</h3>
              <form onSubmit={saveData} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input type="date" value={formData.date} onChange={e=>setFormData({...formData, date:e.target.value})} className="p-2 md:p-4 rounded-xl border-2 font-bold" required/>
                <input placeholder="Vistas (M)" type="number" step="0.01" value={formData.views} onChange={e=>setFormData({...formData, views:e.target.value})} className="p-2 md:p-4 rounded-xl border-2 font-bold" required/>
                <input placeholder="Caja ($)" type="number" step="0.01" value={formData.revenue} onChange={e=>setFormData({...formData, revenue:e.target.value})} className="p-2 md:p-4 rounded-xl border-2 font-black text-green-700 bg-green-50" required/>
                <input placeholder="TITULAR" value={formData.topic} onChange={e=>setFormData({...formData, topic:e.target.value})} className="md:col-span-2 p-2 md:p-4 rounded-xl border-2 font-bold uppercase" required/>
                <select value={formData.format} onChange={e=>setFormData({...formData, format:e.target.value})} className="p-2 md:p-4 rounded-xl border-2 font-bold">{FORMATS.map(f => <option key={f.value} value={f.value}>{f.icon} {f.label}</option>)}</select>
                <button type="submit" className="md:col-span-3 bg-[#003566] text-white p-3 md:p-5 rounded-xl md:rounded-[35px] font-black text-base md:text-xl shadow-xl italic uppercase">{editingId ? "Actualizar Registro" : "Sincronizar Imperio"} 🚀</button>
              </form>
            </section>

            {/* BITÁCORA */}
            <section className="bg-white rounded-xl md:rounded-[40px] p-4 md:p-8 border-2 border-slate-300 shadow-xl overflow-x-auto no-scrollbar">
              <h2 className="text-xl md:text-3xl font-black text-[#003566] uppercase italic mb-4">Bitácora Febrero</h2>
              <div className="min-w-[500px] space-y-2">
                {febData.map(item => (
                  <div key={item.id} onClick={() => handleEdit(item)} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:bg-blue-50 cursor-pointer">
                    <div className="flex-1"><p className="font-black text-[#003566] text-sm uppercase truncate pr-4">{item.topic || "SIN TÍTULO"}</p><p className="text-[8px] font-bold text-slate-400">{(item.date || "").split("-").reverse().slice(0,2).join("/")} • {((item.views || 0)/1000000).toFixed(2)}M VISTAS</p></div>
                    <div className="flex items-center gap-4"><p className="font-black text-green-600 text-xl md:text-3xl">${Number(item.revenue || 0).toFixed(2)}</p><button onClick={(e)=>{e.stopPropagation(); deleteRow(item.id);}} className="text-red-300 hover:text-red-600 text-xl">🗑️</button></div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === "historico" && (
          <section className="bg-white rounded-xl md:rounded-[40px] p-4 md:p-8 border-2 border-slate-300 overflow-x-auto">
             <h2 className="text-xl md:text-2xl font-black text-slate-400 uppercase italic mb-6">Archivo Enero 2026</h2>
             <table className="w-full text-left min-w-[500px]">
                <thead className="bg-slate-100 text-[10px] font-black uppercase text-slate-500"><tr><th className="p-3">Día</th><th className="p-3">Titular</th><th className="p-3">Caja</th><th className="p-3">Alcance</th></tr></thead>
                <tbody className="divide-y-2">
                  {ENERO_DATA.map(i => (
                    <tr key={item.day} className="grayscale opacity-60"><td className="p-3 font-bold">0{i.day}/01</td><td className="p-3 font-black uppercase truncate max-w-[150px]">{i.topic}</td><td className="p-3 font-black text-slate-600">${i.revenue.toFixed(2)}</td><td className="p-3 font-black">{i.views}M</td></tr>
                  ))}
                </tbody>
             </table>
          </section>
        )}
      </main>
    </div>
  );
}