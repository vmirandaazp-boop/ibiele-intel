import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://stenaxhdsfxrzhetetiz.supabase.co";
const supabaseAnonKey = "sb_publishable_Sk2d6wvlqXrwLKfBEfS8fw_t5PfImJN";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const FORMATS = [
  { value: "Foto", label: "Foto", icon: "🖼️" },
  { value: "Reels", label: "Reels", icon: "🎬" },
  { value: "Enlaces", label: "Enlaces", icon: "🔗" },
  { value: "Historias", label: "Historias", icon: "📱" }
];

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [time, setTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("02"); // Mes actual (Febrero)
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    revenue: "",
    views: "",
    interactions: "",
    followers: "",
    format: "Reels",
    topic: ""
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: metrics, error } = await supabase
        .from("metrics")
        .select("*")
        .order('date', { ascending: false });
      if (error) throw error;
      setData(metrics || []);
    } catch (err) {
      setError("Fallo en conexión");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const saveData = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("metrics").insert([{
        ...formData,
        revenue: parseFloat(formData.revenue) || 0,
        views: (parseFloat(formData.views) || 0) * 1000000,
        interactions: (parseFloat(formData.interactions) || 0) * 1000,
        followers: parseFloat(formData.followers) || 0,
        topic: formData.topic.toUpperCase()
      }]);
      if (error) throw error;
      setFormData({ ...formData, revenue: "", views: "", interactions: "", followers: "", topic: "" });
      await loadData();
    } catch (err) { setError("Error al guardar"); }
  };

  const deleteRow = async (id) => {
    if(window.confirm("¿BORRAR REGISTRO DEL IMPERIO?")) {
      const { error } = await supabase.from("metrics").delete().eq('id', id);
      if (!error) loadData();
    }
  };

  // --- FILTRADO REAL POR MES ---
  const filteredData = data.filter(item => item.date.split("-")[1] === activeTab);

  // --- CÁLCULOS DINÁMICOS ---
  const totalRevenue = filteredData.reduce((sum, item) => sum + (Number(item.revenue) || 0), 0);
  const totalViews = filteredData.reduce((sum, item) => sum + (Number(item.views) || 0), 0);
  const daysInMonth = new Date(2026, parseInt(activeTab), 0).getDate();
  const daysPassed = activeTab === "02" ? new Date().getDate() : daysInMonth;
  const daysLeft = daysInMonth - daysPassed;
  const dailyTarget = (1250 - totalRevenue) / (daysLeft || 1);

  const formatNumber = (num) => {
    const n = Number(num) || 0;
    if (n >= 1000000) return `${(n/1000000).toFixed(2)}M`;
    if (n >= 1000) return `${(n/1000).toFixed(1)}K`;
    return n.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 border-[10px] border-[#003566]">
      {/* HEADER AZUL IMPERIAL */}
      <header className="bg-[#003566] text-white p-6 shadow-2xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">IBIELE TV <span className="text-blue-400">INTEL</span></h1>
            <p className="text-xs font-bold opacity-80 mt-1 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              {time.toLocaleTimeString()} • MANDO ESTRATÉGICO
            </p>
          </div>
          <div className="bg-white/10 p-4 rounded-2xl border border-white/20 text-center">
             <p className="text-[10px] font-black uppercase opacity-60">Revenue {activeTab === "02" ? "Feb" : "Ene"}</p>
             <p className="text-2xl font-black text-green-400">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        
        {/* FORMULARIO */}
        <section className="bg-white rounded-[40px] shadow-xl p-8 border border-slate-200">
          <h2 className="text-2xl font-black text-[#003566] mb-6 italic uppercase tracking-tighter">📝 Registrar Operación</h2>
          <form onSubmit={saveData} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 font-bold outline-none focus:border-blue-500" />
            <input placeholder="MILLONES DE VISTAS" type="number" step="0.01" value={formData.views} onChange={(e) => setFormData({...formData, views: e.target.value})} className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 font-bold outline-none" />
            <input placeholder="CAJA (USD)" type="number" step="0.01" value={formData.revenue} onChange={(e) => setFormData({...formData, revenue: e.target.value})} className="p-4 rounded-2xl bg-green-50 border-2 border-green-100 font-black text-green-700 outline-none" />
            <input placeholder="TEMA / TITULAR" value={formData.topic} onChange={(e) => setFormData({...formData, topic: e.target.value})} className="md:col-span-2 p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 font-bold uppercase outline-none" />
            <select value={formData.format} onChange={(e) => setFormData({...formData, format: e.target.value})} className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 font-bold outline-none">
              {FORMATS.map(f => <option key={f.value} value={f.value}>{f.icon} {f.label}</option>)}
            </select>
            <button type="submit" className="md:col-span-3 bg-[#003566] p-6 rounded-[30px] text-white font-black text-2xl shadow-xl hover:bg-blue-800 active:scale-95 transition-all italic">SINCRONIZAR 📊</button>
          </form>
        </section>

        {/* BITÁCORA CON FILTRADO REAL */}
        <section className="bg-white rounded-[40px] shadow-2xl p-8 border border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-3xl font-black text-[#003566] italic uppercase">Bitácora</h2>
            <div className="bg-slate-100 p-2 rounded-2xl flex gap-2">
              <button onClick={() => setActiveTab("02")} className={`px-6 py-2 rounded-xl font-black transition ${activeTab === "02" ? "bg-[#003566] text-white" : "text-slate-500"}`}>FEBRERO</button>
              <button onClick={() => setActiveTab("01")} className={`px-6 py-2 rounded-xl font-black transition ${activeTab === "01" ? "bg-[#003566] text-white" : "text-slate-500"}`}>ENERO</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-4 border-slate-100">
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Fecha</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Tema</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Alcance</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Caja</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="p-4 font-bold text-slate-400">{item.date.split("-").reverse().slice(0,2).join("/") }</td>
                    <td className="p-4 font-black text-[#003566] italic uppercase">{item.topic}</td>
                    <td className="p-4 font-black text-blue-600">{formatNumber(item.views)}</td>
                    <td className="p-4 font-black text-green-600 text-xl">${(Number(item.revenue) || 0).toFixed(2)}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => deleteRow(item.id)} className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* PROYECCIÓN ESTRATÉGICA ACTUALIZADA */}
        <section className="bg-[#10b981] p-8 rounded-[50px] shadow-2xl text-white">
          <h2 className="text-2xl font-black italic uppercase text-center mb-8 border-b border-white/20 pb-4">Proyección Estratégica {activeTab === "02" ? "Febrero" : "Enero"}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
             <div className="text-center bg-white/10 p-6 rounded-3xl">
               <p className="text-[10px] font-black opacity-70 uppercase mb-1">Meta Diaria Hoy</p>
               <p className="text-4xl font-black italic">${dailyTarget > 0 ? dailyTarget.toFixed(2) : "0.00"}</p>
             </div>
             <div className="text-center bg-white/10 p-6 rounded-3xl">
               <p className="text-[10px] font-black opacity-70 uppercase mb-1">Días Restantes</p>
               <p className="text-4xl font-black italic">{daysLeft}</p>
             </div>
             <div className="text-center bg-white/10 p-6 rounded-3xl">
               <p className="text-[10px] font-black opacity-70 uppercase mb-1">Ingresos Acum.</p>
               <p className="text-4xl font-black italic">${totalRevenue.toFixed(2)}</p>
             </div>
             <div className="text-center bg-white/10 p-6 rounded-3xl">
               <p className="text-[10px] font-black opacity-70 uppercase mb-1">Promedio Real</p>
               <p className="text-4xl font-black italic">${(totalRevenue/daysPassed || 0).toFixed(2)}</p>
             </div>
          </div>
        </section>
      </main>
    </div>
  );
}