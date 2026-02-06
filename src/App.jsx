import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://stenaxhdsfxrzhetetiz.supabase.co";
const supabaseAnonKey = "sb_publishable_Sk2d6wvlqXrwLKfBEfS8fw_t5PfImJN";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const FORMATS = [
  { value: "Foto", label: "Foto", icon: "📸", color: "bg-blue-500" },
  { value: "Reels", label: "Reels", icon: "🎬", color: "bg-purple-600" },
  { value: "Enlaces", label: "Enlaces", icon: "🔗", color: "bg-green-500" },
  { value: "Historias", label: "Historias", icon: "📱", color: "bg-orange-500" }
];

const ENERO_DATA = [
  { day: 1, date: "2026-01-01", views: 0.76, revenue: 7.85, topic: "🚫 PROHIBIDO QUEJARSE", format: "Foto", followers: 240 },
  { day: 5, date: "2026-01-05", views: 13.07, revenue: 103.96, topic: "😭 SUSURRARON JESÚS", format: "Foto", followers: 4117 },
  { day: 11, date: "2026-01-11", views: 9.19, revenue: 84.27, topic: "🏟️ CALIFORNIA 50K", format: "Foto", followers: 2894 },
  { day: 25, date: "2026-01-25", views: 8.32, revenue: 70.59, topic: "🩸 PAGAN CON SANGRE", format: "Foto", followers: 2631 },
  { day: 31, date: "2026-01-31", views: 1.83, revenue: 21.20, topic: "🇺🇸 CALIFORNIA FE", format: "Foto", followers: 669 }
];

const DEMOGRAPHICS = {
  gender: [{ label: "Mujeres", value: 67.1, color: "bg-slate-400" }, { label: "Hombres", value: 32.9, color: "bg-blue-600" }],
  age: [{ range: "18-34", percent: 31.0 }, { range: "35-44", percent: 29.1 }, { range: "45-54", percent: 23.4 }, { range: "55+", percent: 16.5 }],
  countries: [{ name: "México", percent: 25.8 }, { name: "Colombia", percent: 13.3 }, { name: "Argentina", percent: 10.0 }, { name: "Perú", percent: 6.2 }, { name: "Ecuador", percent: 5.7 }]
};

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showInsights, setShowInsights] = useState(true);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    revenue: "", views: "", interactions: "", followers: "", format: "Foto", topic: ""
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: m, error } = await supabase.from("metrics").select("*").order('date', { ascending: false });
      if (!error) setData(m || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
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
    setFormData({ date: item.date, revenue: item.revenue.toString(), views: (item.views/1000000).toString(), interactions: (item.interactions/1000).toString(), followers: item.followers.toString(), format: item.format, topic: item.topic });
    setActiveTab("dashboard");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteRow = async (id) => {
    if(window.confirm("¿BORRAR REGISTRO?")) {
      await supabase.from("metrics").delete().eq('id', id);
      loadData();
    }
  };

  const filteredData = data.filter(item => item.date.split("-")[1] === "02");
  const totalRevenue = filteredData.reduce((sum, item) => sum + (Number(item.revenue) || 0), 0);
  const totalViews = filteredData.reduce((sum, item) => sum + (Number(item.views) || 0), 0);
  const dailyTarget = (1250 - totalRevenue) / (28 - new Date().getDate() || 1);
  const conversionRate = 315;
  const bestDay = ENERO_DATA.reduce((max, item) => item.revenue > max.revenue ? item : max);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 border-[8px] md:border-[15px] border-[#003566]">
      <header className="bg-[#003566] text-white p-4 shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase">IBIELE <span className="text-blue-400">INTEL</span></h1>
            <p className="text-[8px] md:text-[10px] font-bold opacity-70 uppercase mt-1">{time.toLocaleTimeString()} • HQ AGUASCALIENTES</p>
          </div>
          <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <div className="flex gap-1 md:gap-2 min-w-max md:min-w-0">
              {["dashboard", "audiencia", "estrategia", "historico"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 md:px-4 py-2 rounded-lg md:rounded-xl font-black text-[10px] md:text-xs whitespace-nowrap transition ${activeTab === tab ? "bg-white text-[#003566]" : "bg-[#002a55] text-blue-200"}`}>{tab.toUpperCase()}</button>
              ))}
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-[8px] md:text-[10px] font-black opacity-50 uppercase">Feb Revenue</p>
            <p className="text-xl md:text-3xl font-black text-green-400">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-3 md:p-6 space-y-6">
        {activeTab === "dashboard" && (
          <>
            <section className="bg-[#001d3d] p-4 md:p-8 rounded-xl md:rounded-[40px] shadow-2xl text-white border-2 border-slate-400">
               <div className="flex items-center mb-4"><div className="text-3xl md:text-5xl mr-2">📊</div><h2 className="text-lg md:text-2xl font-black uppercase">ENERO <span className="text-slate-400">HISTÓRICO</span></h2></div>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10"><p className="text-[7px] md:text-[10px] opacity-60 uppercase">Ingresos</p><p className="text-xl md:text-4xl font-black text-slate-300">$1,104.32</p></div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10"><p className="text-[7px] md:text-[10px] opacity-60 uppercase">Vistas</p><p className="text-xl md:text-4xl font-black text-slate-300">112.9M</p></div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10"><p className="text-[7px] md:text-[10px] opacity-60 uppercase">Feb Acum.</p><p className="text-xl md:text-4xl font-black text-blue-400">${totalRevenue.toFixed(2)}</p></div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10"><p className="text-[7px] md:text-[10px] opacity-60 uppercase">Target</p><p className="text-xl md:text-4xl font-black text-yellow-300">${dailyTarget.toFixed(2)}</p></div>
               </div>
            </section>

            <section className={`p-4 md:p-8 rounded-xl md:rounded-[40px] shadow-xl border-4 ${editingId ? 'bg-blue-50 border-blue-500' : 'bg-white border-slate-300'}`}>
              <h3 className="text-xs font-black text-[#003566] uppercase mb-4 border-b-2 pb-2 italic">{editingId ? "⚡ EDITANDO" : "📝 REGISTRO"}</h3>
              <form onSubmit={saveData} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input type="date" value={formData.date} onChange={e=>setFormData({...formData, date:e.target.value})} className="p-2 md:p-4 rounded-xl border-2 font-bold" required/>
                <input placeholder="Vistas (M)" type="number" step="0.01" value={formData.views} onChange={e=>setFormData({...formData, views:e.target.value})} className="p-2 md:p-4 rounded-xl border-2 font-bold" required/>
                <input placeholder="Caja ($)" type="number" step="0.01" value={formData.revenue} onChange={e=>setFormData({...formData, revenue:e.target.value})} className="p-2 md:p-4 rounded-xl border-2 font-black text-green-700 bg-green-50" required/>
                <input placeholder="TITULAR" value={formData.topic} onChange={e=>setFormData({...formData, topic:e.target.value})} className="md:col-span-2 p-2 md:p-4 rounded-xl border-2 font-bold uppercase" required/>
                <select value={formData.format} onChange={e=>setFormData({...formData, format:e.target.value})} className="p-2 md:p-4 rounded-xl border-2 font-bold">{FORMATS.map(f => <option key={f.value} value={f.value}>{f.icon} {f.label}</option>)}</select>
                <button type="submit" className="md:col-span-3 bg-[#003566] text-white p-3 md:p-6 rounded-xl md:rounded-[35px] font-black text-base md:text-2xl shadow-xl italic uppercase tracking-tighter">{editingId ? "Actualizar Imperio" : "Sincronizar Imperio"} 🚀</button>
              </form>
            </section>

            <section className="bg-white rounded-xl md:rounded-[40px] shadow-2xl p-4 md:p-8 border-2 border-slate-300 overflow-x-auto no-scrollbar">
              <h2 className="text-xl md:text-3xl font-black text-[#003566] uppercase italic mb-4">Bitácora Febrero</h2>
              <div className="min-w-[500px] space-y-2">
                {filteredData.map(item => (
                  <div key={item.id} onClick={() => handleEdit(item)} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:bg-blue-50 cursor-pointer">
                    <div className="flex-1"><p className="font-black text-[#003566] text-sm md:text-base uppercase truncate">{item.topic}</p><p className="text-[8px] md:text-[10px] font-bold text-slate-400">{(item.views/1000000).toFixed(2)}M VISTAS</p></div>
                    <div className="flex items-center gap-6"><p className="font-black text-green-600 text-xl md:text-3xl">${Number(item.revenue).toFixed(2)}</p><button onClick={(e)=>{e.stopPropagation(); deleteRow(item.id);}} className="text-red-400 text-xl">🗑️</button></div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
        {activeTab === "historico" && (
          <section className="bg-white rounded-xl md:rounded-[40px] shadow-2xl p-4 md:p-8 border-2 border-slate-300 overflow-x-auto">
             <h2 className="text-xl md:text-3xl font-black text-slate-400 uppercase italic mb-4">Archivo Enero <span className="text-[10px]">(SOLO LECTURA)</span></h2>
             <table className="w-full text-left min-w-[500px]">
                <thead className="bg-slate-100 text-[10px] font-black uppercase text-slate-500"><tr><th className="p-3">Fecha</th><th className="p-3">Titular</th><th className="p-3">Caja</th><th className="p-3">Alcance</th></tr></thead>
                <tbody className="divide-y-2">
                  {ENERO_DATA.map(i => (
                    <tr key={i.day} className="grayscale opacity-60"><td className="p-3 font-bold">{i.date}</td><td className="p-3 font-black uppercase truncate max-w-[150px]">{i.topic}</td><td className="p-3 font-black text-slate-600">${i.revenue.toFixed(2)}</td><td className="p-3 font-black">{i.views}M</td></tr>
                  ))}
                </tbody>
             </table>
          </section>
        )}
      </main>
    </div>
  );
}