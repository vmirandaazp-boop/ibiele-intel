import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ✅ CORRECCIÓN CRÍTICA #1: URL SIN ESPACIOS AL FINAL
const supabaseUrl = "https://stenaxhdsfxrzhetetiz.supabase.co";
const supabaseAnonKey = "sb_publishable_Sk2d6wvlqXrwLKfBEfS8fw_t5PfImJN";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const FORMATS = [
  { value: "Foto", label: "Foto", icon: "📸" },
  { value: "Reels", label: "Reels", icon: "🎬" },
  { value: "Enlaces", label: "Enlaces", icon: "🔗" },
  { value: "Historias", label: "Historias", icon: "📱" }
];

// 📊 DATOS DE ENERO (MINIMAL PARA RAPIDEZ)
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
    revenue: "", 
    views: "", 
    interactions: "", 
    followers: "", 
    format: "Foto", 
    topic: ""
  });

  // ✅ CORRECCIÓN CRÍTICA #2: MANEJO SEGURO DE DATOS
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
      console.error("Error cargando datos:", err.message);
      alert("Error de conexión con la base de datos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    loadData(); 
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => {
      clearInterval(timer);
    };
  }, [loadData]);

  // ✅ CORRECCIÓN CRÍTICA #3: VALIDACIÓN EN GUARDADO
  const saveData = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        revenue: parseFloat(formData.revenue) || 0,
        views: (parseFloat(formData.views) || 0) * 1000000,
        interactions: (parseFloat(formData.interactions) || 0) * 1000,
        followers: parseFloat(formData.followers) || 0,
        topic: formData.topic.toUpperCase().trim()
      };

      if (editingId) {
        const { error } = await supabase
          .from("metrics")
          .update(payload)
          .eq('id', editingId);
        
        if (error) throw error;
        setEditingId(null);
      } else {
        const { error } = await supabase
          .from("metrics")
          .insert([payload]);
        
        if (error) throw error;
      }
      
      setFormData({ 
        date: new Date().toISOString().split('T')[0], 
        revenue: "", 
        views: "", 
        interactions: "", 
        followers: "", 
        format: "Foto", 
        topic: "" 
      });
      
      await loadData();
    } catch (err) {
      console.error("Error guardando datos:", err.message);
      alert("Error al guardar el registro: " + err.message);
    }
  };

  // ✅ CORRECCIÓN CRÍTICA #4: MANEJO SEGURO DE EDICIÓN
  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({ 
      date: item.date || new Date().toISOString().split('T')[0],
      revenue: item.revenue ? item.revenue.toString() : "",
      views: item.views ? (item.views / 1000000).toString() : "",
      interactions: item.interactions ? (item.interactions / 1000).toString() : "",
      followers: item.followers ? item.followers.toString() : "",
      format: item.format || "Foto",
      topic: item.topic || ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteRow = async (id) => {
    if(window.confirm("¿BORRAR REGISTRO DEL IMPERIO?")) {
      try {
        const { error } = await supabase
          .from("metrics")
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        await loadData();
      } catch (err) {
        console.error("Error eliminando:", err.message);
        alert("Error al eliminar el registro");
      }
    }
  };

  // ✅ CORRECCIÓN CRÍTICA #5: CÁLCULOS SEGUROS
  const febData = data.filter(item => item.date?.includes("-02-") || false);
  const totalRevenue = febData.reduce((sum, item) => sum + (parseFloat(item.revenue) || 0), 0);
  const daysInMonth = 29; // Febrero 2026 es bisiesto
  const daysPassed = new Date().getDate();
  const daysLeft = Math.max(daysInMonth - daysPassed, 1);
  const dailyTarget = (1250 - totalRevenue) / daysLeft;
  const bestDay = ENERO_DATA.reduce((max, item) => item.revenue > max.revenue ? item : max, ENERO_DATA[0]);

  return (
    <div className="min-h-screen bg-slate-200 font-sans text-slate-900 border-[8px] md:border-[15px] border-[#003566]">
      
      {/* HEADER AZUL IMPERIAL */}
      <header className="bg-[#003566] text-white p-3 md:p-5 shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="text-center md:text-left">
            <h1 className="text-xl md:text-3xl font-black italic uppercase">IBIELE <span className="text-blue-400">INTEL</span></h1>
            <p className="text-[8px] md:text-[10px] font-bold opacity-70 uppercase mt-1">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • COMANDO AGUASCALIENTES
            </p>
          </div>
          
          <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <div className="flex gap-1 md:gap-2 min-w-max md:min-w-0">
              {["dashboard", "historico"].map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)} 
                  className={`px-3 md:px-4 py-2 rounded-lg md:rounded-xl font-black text-[10px] md:text-xs whitespace-nowrap transition ${
                    activeTab === tab 
                      ? "bg-white text-[#003566] shadow-lg" 
                      : "bg-[#002a55] text-blue-200 hover:bg-[#002f5e]"
                  }`}
                >
                  {tab === "dashboard" ? "DASHBOARD" : "HISTÓRICO"}
                </button>
              ))}
            </div>
          </div>
          
          <div className="text-center md:text-right mt-2 md:mt-0">
            <p className="text-[8px] md:text-[10px] font-black opacity-50 uppercase">Revenue Feb</p>
            <p className="text-lg md:text-2xl font-black text-blue-400">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-3 md:p-6 space-y-6">
        
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            
            {/* PANEL TARGET */}
            <section className="bg-[#001d3d] p-4 md:p-8 rounded-xl md:rounded-[40px] text-white border-2 border-slate-400">
              <p className="text-[10px] font-black opacity-50 uppercase tracking-widest mb-1">Target Diario Meta $1,250</p>
              <p className="text-4xl md:text-6xl font-black text-blue-400 italic">${dailyTarget > 0 ? dailyTarget.toFixed(2) : "0.00"}</p>
              <div className="mt-6 flex justify-between text-[10px] font-black uppercase opacity-60">
                <span>Febrero Acumulado</span>
                <span>${totalRevenue.toFixed(2)}</span>
              </div>
              <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden mt-2">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-green-400 h-full" 
                  style={{ width: `${Math.min((totalRevenue/1250)*100, 100)}%` }}
                ></div>
              </div>
            </section>

            {/* FORMULARIO CON EDICIÓN */}
            <section className={`p-4 md:p-8 rounded-xl md:rounded-[40px] shadow-xl border-4 ${
              editingId ? 'bg-blue-50 border-blue-500' : 'bg-white border-slate-300'
            }`}>
              <h3 className="text-xs font-black text-[#003566] uppercase mb-4 border-b-2 pb-2 italic">
                {editingId ? "⚡ EDITANDO REGISTRO" : "📝 REGISTRO NUEVO"}
              </h3>
              <form onSubmit={saveData} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input 
                  type="date" 
                  value={formData.date} 
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="p-2 md:p-4 rounded-xl border-2 bg-slate-50 font-bold text-[10px] md:text-sm"
                  required
                />
                <input 
                  placeholder="Vistas (M)" 
                  type="number" 
                  step="0.01" 
                  value={formData.views} 
                  onChange={e => setFormData({...formData, views: e.target.value})}
                  className="p-2 md:p-4 rounded-xl border-2 bg-slate-50 font-bold text-[10px] md:text-sm"
                  required
                />
                <input 
                  placeholder="Caja ($)" 
                  type="number" 
                  step="0.01" 
                  value={formData.revenue} 
                  onChange={e => setFormData({...formData, revenue: e.target.value})}
                  className="p-2 md:p-4 rounded-xl border-2 border-green-200 bg-green-50 font-black text-green-700 text-[10px] md:text-sm"
                  required
                />
                <input 
                  placeholder="TITULAR DE LA PUBLICACIÓN" 
                  value={formData.topic} 
                  onChange={e => setFormData({...formData, topic: e.target.value})}
                  className="md:col-span-2 p-2 md:p-4 rounded-xl border-2 bg-slate-50 font-bold uppercase text-[8px] md:text-sm"
                  required
                />
                <select 
                  value={formData.format} 
                  onChange={e => setFormData({...formData, format: e.target.value})}
                  className="p-2 md:p-4 rounded-xl border-2 bg-slate-50 font-bold text-[10px] md:text-sm"
                >
                  {FORMATS.map(f => <option key={f.value} value={f.value}>{f.icon} {f.label}</option>)}
                </select>
                <button 
                  type="submit" 
                  className="md:col-span-3 bg-[#003566] text-white p-3 md:p-5 rounded-xl md:rounded-[35px] font-black text-base md:text-xl shadow-lg hover:bg-slate-800 transition-all italic uppercase"
                >
                  {editingId ? "ACTUALIZAR 🔄" : "SINCRONIZAR IMPERIO 🚀"}
                </button>
              </form>
            </section>

            {/* BITÁCORA */}
            <section className="bg-white rounded-xl md:rounded-[40px] p-4 md:p-8 border-2 border-slate-300">
              <h2 className="text-xl md:text-2xl font-black text-[#003566] uppercase italic mb-4">Operaciones de Febrero</h2>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#003566] mx-auto"></div>
                  <p className="mt-2 text-slate-500 text-sm">Cargando registros...</p>
                </div>
              ) : febData.length === 0 ? (
                <div className="text-center py-8 text-slate-400 italic">
                  No hay registros aún. ¡Registra tu primera operación!
                </div>
              ) : (
                <div className="space-y-3">
                  {febData.map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => handleEdit(item)} 
                      className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:bg-blue-50 cursor-pointer transition-all"
                    >
                      <div className="flex-1 mb-3 md:mb-0">
                        <p className="font-black text-sm md:text-base text-[#003566] uppercase truncate" title={item.topic}>
                          {item.topic || "SIN TÍTULO"}
                        </p>
                        <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase mt-1">
                          {item.date?.split("-").reverse().slice(0,2).join("/")} • 
                          {((item.views || 0)/1000000).toFixed(2)}M vistas • 
                          +{(item.followers || 0)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                        <p className="font-black text-xl md:text-2xl text-green-600">
                          ${(parseFloat(item.revenue) || 0).toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleEdit(item); }} 
                            className="text-blue-600 hover:text-blue-800 text-lg"
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); deleteRow(item.id); }} 
                            className="text-red-400 hover:text-red-600 text-lg"
                            title="Eliminar"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === "historico" && (
          <section className="bg-white rounded-xl md:rounded-[40px] p-4 md:p-8 border-2 border-slate-300">
            <h2 className="text-xl md:text-2xl font-black text-[#003566] uppercase italic mb-6">Enero 2026 - Datos Históricos</h2>
            
            <div className="bg-[#001d3d] p-4 md:p-6 rounded-xl text-white mb-6">
              <div className="text-center">
                <div className="text-3xl md:text-5xl font-black mb-2">${bestDay.revenue.toFixed(2)}</div>
                <p className="text-[10px] md:text-sm opacity-80">Mejor día: 0{bestDay.day} - {bestDay.topic}</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <div className="min-w-[500px]">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase">
                    <tr>
                      <th className="p-3">Día</th>
                      <th className="p-3">Titular</th>
                      <th className="p-3">Vistas</th>
                      <th className="p-3">Caja</th>
                      <th className="p-3">Seguidores</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {ENERO_DATA.map(item => (
                      <tr key={item.day} className="hover:bg-slate-50">
                        <td className="p-3 font-black text-slate-400">0{item.day}</td>
                        <td className="p-3 font-black text-[#003566] uppercase truncate max-w-[150px]">{item.topic}</td>
                        <td className="p-3 font-black text-blue-600">{item.views}M</td>
                        <td className="p-3 font-black text-green-600">${item.revenue.toFixed(2)}</td>
                        <td className="p-3 font-black text-blue-600">+{item.followers}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}