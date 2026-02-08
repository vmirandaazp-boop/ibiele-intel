import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";

// Variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Faltan variables de entorno de Supabase. Verifica tu archivo .env");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const FORMATS = [
  { value: "Foto", label: "Foto", icon: "📸" },
  { value: "Reels", label: "Reels", icon: "🎬" },
  { value: "Enlaces", label: "Enlaces", icon: "🔗" },
  { value: "Historias", label: "Historias", icon: "📱" }
];

// Datos históricos de enero 2026
const ENERO_DATA = [
  { id: "ene-1", day: 1, date: "2026-01-01", views: 0.76, revenue: 7.85, topic: "🚫 PROHIBIDO QUEJARSE", followers: 240, format: "Foto" },
  { id: "ene-5", day: 5, date: "2026-01-05", views: 13.07, revenue: 103.96, topic: "😭 SUSURRARON JESÚS", followers: 4117, format: "Reels" },
  { id: "ene-11", day: 11, date: "2026-01-11", views: 9.19, revenue: 84.27, topic: "🏟️ CALIFORNIA 50K", followers: 2894, format: "Foto" },
  { id: "ene-25", day: 25, date: "2026-01-25", views: 8.32, revenue: 70.59, topic: "🩸 PAGAN CON SANGRE", followers: 2631, format: "Reels" },
  { id: "ene-31", day: 31, date: "2026-01-31", views: 1.83, revenue: 21.20, topic: "🇺🇸 CALIFORNIA FE", followers: 669, format: "Foto" }
];

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingId, setEditingId] = useState(null);
  const [time, setTime] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para búsqueda por fecha
  const [searchDate, setSearchDate] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchMonth, setSearchMonth] = useState("febrero"); // 'enero' o 'febrero'

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    revenue: "",
    views: "",
    interactions: "",
    followers: "",
    format: "Foto",
    topic: ""
  });

  const [formErrors, setFormErrors] = useState({});

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: metrics, error: supabaseError } = await supabase
        .from("metrics")
        .select("*")
        .order('date', { ascending: false });
      
      if (supabaseError) throw supabaseError;
      
      setData(metrics || []);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError(`Error al cargar datos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    loadData(); 
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [loadData]);

  // Validación de formulario
  const validateForm = useCallback(() => {
    const errors = {};
    
    if (!formData.date || isNaN(new Date(formData.date).getTime())) {
      errors.date = "Fecha inválida";
    }
    
    const revenue = parseFloat(formData.revenue);
    if (isNaN(revenue) || revenue < 0) {
      errors.revenue = "Ingresa un número positivo";
    }
    
    const views = parseFloat(formData.views);
    if (isNaN(views) || views < 0) {
      errors.views = "Ingresa un número positivo";
    }
    
    if (!formData.topic.trim()) {
      errors.topic = "El titular es obligatorio";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const saveData = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError(null);

    const payload = {
      date: formData.date,
      revenue: parseFloat(formData.revenue),
      views: parseFloat(formData.views) * 1000000,
      interactions: (parseFloat(formData.interactions) || 0) * 1000,
      followers: parseFloat(formData.followers) || 0,
      format: formData.format,
      topic: formData.topic.toUpperCase().trim().slice(0, 100)
    };

    try {
      if (editingId) {
        const { error: updateError } = await supabase
          .from("metrics")
          .update(payload)
          .eq('id', editingId);
          
        if (updateError) throw updateError;
        setEditingId(null);
      } else {
        const { error: insertError } = await supabase
          .from("metrics")
          .insert([payload]);
          
        if (insertError) throw insertError;
      }
      
      // Resetear formulario
      setFormData({
        date: new Date().toISOString().split('T')[0],
        revenue: "",
        views: "",
        interactions: "",
        followers: "",
        format: "Foto",
        topic: ""
      });
      setFormErrors({});
      
      await loadData();
    } catch (err) {
      console.error("Error guardando:", err);
      setError(`Error al guardar: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
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
    setFormErrors({});
    setActiveTab("dashboard");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      revenue: "",
      views: "",
      interactions: "",
      followers: "",
      format: "Foto",
      topic: ""
    });
    setFormErrors({});
  };

  const deleteRow = async (id) => {
    if (!window.confirm("¿BORRAR REGISTRO? Esta acción no se puede deshacer.")) return;
    
    try {
      setError(null);
      const { error: deleteError } = await supabase
        .from("metrics")
        .delete()
        .eq('id', id);
        
      if (deleteError) throw deleteError;
      
      await loadData();
    } catch (err) {
      console.error("Error eliminando:", err);
      setError(`Error al eliminar: ${err.message}`);
    }
  };

  // Función de búsqueda por fecha
  const handleSearch = useCallback(() => {
    if (!searchDate) {
      setSearchResults([]);
      return;
    }

    let results = [];
    
    if (searchMonth === "enero") {
      // Buscar en datos hardcodeados de enero
      results = ENERO_DATA.filter(item => item.date === searchDate);
    } else {
      // Buscar en datos de Supabase (febrero)
      results = data.filter(item => item.date === searchDate);
    }
    
    setSearchResults(results);
  }, [searchDate, searchMonth, data]);

  // Limpiar búsqueda cuando cambia el mes
  useEffect(() => {
    setSearchResults([]);
    setSearchDate("");
  }, [searchMonth]);

  // Cálculos memoizados
  const { febData, totalRevenue, dailyTarget, progressPercent } = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const febPrefix = `${currentYear}-02-`;
    const filtered = data.filter(item => item.date?.startsWith(febPrefix));
    
    const total = filtered.reduce((sum, item) => sum + (parseFloat(item.revenue) || 0), 0);
    
    const today = new Date().getDate();
    const daysInFeb = (currentYear % 4 === 0 && currentYear % 100 !== 0) || (currentYear % 400 === 0) ? 29 : 28;
    const remainingDays = Math.max(daysInFeb - today, 1);
    const target = 1250;
    const daily = Math.max((target - total) / remainingDays, 0);
    
    return {
      febData: filtered,
      totalRevenue: total,
      dailyTarget: daily,
      progressPercent: Math.min((total / target) * 100, 100)
    };
  }, [data]);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 border-[8px] md:border-[15px] border-[#003566]">
      <header className="bg-[#003566] text-white p-4 shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase">
              IBIELE <span className="text-blue-400">INTEL</span>
            </h1>
            <p className="text-[8px] md:text-[10px] font-bold opacity-70 uppercase mt-1">
              {time.toLocaleTimeString()} • COMANDO CENTRAL
            </p>
          </div>
          
          <div className="w-full md:w-auto overflow-x-auto no-scrollbar flex justify-center">
            <div className="flex bg-white/5 p-1 rounded-xl">
              {["dashboard", "buscar", "historico"].map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)} 
                  className={`px-4 py-2 rounded-lg font-black text-[10px] uppercase transition ${
                    activeTab === tab 
                      ? "bg-white text-[#003566] shadow-lg" 
                      : "text-blue-200 hover:text-white"
                  }`}
                >
                  {tab === "buscar" ? "🔍 BUSCAR" : tab.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-[8px] md:text-[10px] font-black opacity-50 uppercase tracking-widest">
              Feb Revenue
            </p>
            <p className="text-xl md:text-3xl font-black text-green-400">
              ${totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-3 md:p-6 space-y-6">
        {/* Mensaje de error global */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded animate-pulse">
            <p className="font-bold">⚠️ Error del Sistema</p>
            <p className="text-sm">{error}</p>
            <button 
              onClick={() => setError(null)} 
              className="text-xs underline mt-2 hover:text-red-900"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="animate-in fade-in duration-500 space-y-6">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* ENERO: GRIS/PIZARRA ELEGANTE */}
               <div className="bg-slate-500 p-6 rounded-xl md:rounded-[40px] text-white border-b-8 border-slate-700 shadow-xl opacity-90">
                  <h2 className="text-sm font-black uppercase opacity-60 mb-2 italic">Enero Histórico</h2>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-4xl font-black italic">$1,104.32</p>
                      <p className="text-[8px] font-bold uppercase tracking-widest">Cierre de Archivo</p>
                    </div>
                    <div className="text-[10px] font-black bg-white/10 px-3 py-1 rounded-full">LECTURA</div>
                  </div>
               </div>
               
               {/* FEBRERO: AZUL IMPERIAL VIVO */}
               <div className="bg-[#003566] p-6 rounded-xl md:rounded-[40px] text-white border-b-8 border-blue-900 shadow-xl relative overflow-hidden">
                  <div 
                    className="absolute bottom-0 left-0 h-1 bg-green-400 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                  <h2 className="text-sm font-black uppercase opacity-60 mb-2 italic">Febrero Actual</h2>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-4xl font-black italic text-blue-400">${totalRevenue.toFixed(2)}</p>
                      <p className="text-[8px] font-bold uppercase tracking-widest">
                        Progreso Meta $1,250 ({progressPercent.toFixed(1)}%)
                      </p>
                    </div>
                    <div className="text-[10px] font-black bg-blue-500 px-3 py-1 rounded-full animate-pulse tracking-tighter">
                      OPERATIVO
                    </div>
                  </div>
                  <p className="text-[10px] mt-2 opacity-80">
                    Meta diaria restante: ${dailyTarget.toFixed(2)}
                  </p>
               </div>
            </section>

            {/* FORMULARIO */}
            <section className={`p-4 md:p-8 rounded-xl md:rounded-[40px] shadow-xl border-4 transition-colors ${
              editingId ? 'bg-blue-50 border-blue-500' : 'bg-white border-slate-300'
            }`}>
              <div className="flex justify-between items-center mb-4 border-b-2 pb-2">
                <h3 className="text-xs font-black text-[#003566] uppercase italic">
                  {editingId ? "⚡ EDITANDO REGISTRO" : "📝 NUEVO REGISTRO"}
                </h3>
                {editingId && (
                  <button 
                    onClick={handleCancelEdit}
                    className="text-[10px] text-red-500 hover:text-red-700 font-bold uppercase px-3 py-1 bg-red-50 rounded-lg"
                  >
                    ✕ Cancelar Edición
                  </button>
                )}
              </div>
              
              <form onSubmit={saveData} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Fecha</label>
                  <input 
                    type="date" 
                    value={formData.date} 
                    onChange={e => setFormData({...formData, date: e.target.value})} 
                    className={`w-full p-2 md:p-4 rounded-xl border-2 font-bold ${
                      formErrors.date ? 'border-red-500 bg-red-50' : 'border-slate-200'
                    }`}
                    required
                  />
                  {formErrors.date && <p className="text-[10px] text-red-500 font-bold">{formErrors.date}</p>}
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Vistas (Millones)</label>
                  <input 
                    placeholder="Ej: 1.5" 
                    type="number" 
                    step="0.01" 
                    min="0"
                    value={formData.views} 
                    onChange={e => setFormData({...formData, views: e.target.value})} 
                    className={`w-full p-2 md:p-4 rounded-xl border-2 font-bold ${
                      formErrors.views ? 'border-red-500 bg-red-50' : 'border-slate-200'
                    }`}
                    required
                  />
                  {formErrors.views && <p className="text-[10px] text-red-500 font-bold">{formErrors.views}</p>}
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Revenue ($)</label>
                  <input 
                    placeholder="Ej: 50.00" 
                    type="number" 
                    step="0.01" 
                    min="0"
                    value={formData.revenue} 
                    onChange={e => setFormData({...formData, revenue: e.target.value})} 
                    className={`w-full p-2 md:p-4 rounded-xl border-2 font-black text-green-700 bg-green-50 ${
                      formErrors.revenue ? 'border-red-500' : 'border-slate-200'
                    }`}
                    required
                  />
                  {formErrors.revenue && <p className="text-[10px] text-red-500 font-bold">{formErrors.revenue}</p>}
                </div>
                
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Titular / Topic</label>
                  <input 
                    placeholder="TITULAR LLAMATIVO" 
                    value={formData.topic} 
                    onChange={e => setFormData({...formData, topic: e.target.value})} 
                    className={`w-full p-2 md:p-4 rounded-xl border-2 font-bold uppercase ${
                      formErrors.topic ? 'border-red-500 bg-red-50' : 'border-slate-200'
                    }`}
                    maxLength={100}
                    required
                  />
                  {formErrors.topic && <p className="text-[10px] text-red-500 font-bold">{formErrors.topic}</p>}
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Formato</label>
                  <select 
                    value={formData.format} 
                    onChange={e => setFormData({...formData, format: e.target.value})} 
                    className="w-full p-2 md:p-4 rounded-xl border-2 font-bold border-slate-200"
                  >
                    {FORMATS.map(f => (
                      <option key={f.value} value={f.value}>{f.icon} {f.label}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-3 grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Interacciones (Miles)</label>
                    <input 
                      placeholder="Opcional" 
                      type="number" 
                      step="0.1" 
                      min="0"
                      value={formData.interactions} 
                      onChange={e => setFormData({...formData, interactions: e.target.value})} 
                      className="w-full p-2 md:p-4 rounded-xl border-2 font-bold border-slate-200"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Followers</label>
                    <input 
                      placeholder="Opcional" 
                      type="number" 
                      min="0"
                      value={formData.followers} 
                      onChange={e => setFormData({...formData, followers: e.target.value})} 
                      className="w-full p-2 md:p-4 rounded-xl border-2 font-bold border-slate-200"
                    />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="md:col-span-3 bg-[#003566] text-white p-3 md:p-5 rounded-xl md:rounded-[35px] font-black text-base md:text-xl shadow-xl italic uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-800 transition-colors"
                >
                  {isSubmitting ? "SINCRONIZANDO..." : editingId ? "💾 ACTUALIZAR REGISTRO" : "🚀 SINCRONIZAR IMPERIO"}
                </button>
              </form>
            </section>

            {/* BITÁCORA FEBRERO */}
            <section className="bg-white rounded-xl md:rounded-[40px] p-4 md:p-8 border-2 border-slate-300 shadow-xl overflow-x-auto no-scrollbar">
              <h2 className="text-xl md:text-3xl font-black text-[#003566] uppercase italic mb-4">
                Operaciones Febrero {loading && <span className="text-sm animate-pulse">(Cargando...)</span>}
              </h2>
              
              {febData.length === 0 && !loading ? (
                <p className="text-center text-slate-400 font-bold py-8">No hay registros para febrero</p>
              ) : (
                <div className="min-w-[500px] space-y-2">
                  {febData.map(item => (
                    <div 
                      key={item.id} 
                      className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:bg-blue-50 transition-colors group"
                    >
                      <div className="flex-1 cursor-pointer" onClick={() => handleEdit(item)}>
                        <p className="font-black text-[#003566] text-sm uppercase truncate pr-4">
                          {item.topic || "SIN TÍTULO"}
                        </p>
                        <p className="text-[8px] font-bold text-slate-400">
                          {(item.date || "").split("-").reverse().slice(0,2).join("/")} • {((item.views || 0)/1000000).toFixed(2)}M VISTAS • {item.format}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-black text-green-600 text-xl md:text-3xl">
                          ${Number(item.revenue || 0).toFixed(2)}
                        </p>
                        <button 
                          onClick={() => handleEdit(item)}
                          className="text-blue-400 hover:text-blue-600 text-lg p-2 hover:bg-blue-100 rounded-full transition-colors"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => deleteRow(item.id)} 
                          className="text-red-300 hover:text-red-600 text-lg p-2 hover:bg-red-50 rounded-full transition-colors"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* BUSCADOR POR FECHA */}
        {activeTab === "buscar" && (
          <div className="animate-in fade-in duration-500 space-y-6">
            <section className="bg-white p-6 md:p-8 rounded-xl md:rounded-[40px] border-2 border-slate-300 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-black text-[#003566] uppercase italic mb-6">
                🔍 Consulta por Fecha
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Mes</label>
                  <select 
                    value={searchMonth} 
                    onChange={e => setSearchMonth(e.target.value)}
                    className="w-full p-3 rounded-xl border-2 font-bold border-slate-200"
                  >
                    <option value="febrero">📅 Febrero 2026 (Activo)</option>
                    <option value="enero">📅 Enero 2026 (Histórico)</option>
                  </select>
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Fecha específica</label>
                  <input 
                    type="date" 
                    value={searchDate} 
                    onChange={e => setSearchDate(e.target.value)}
                    className="w-full p-3 rounded-xl border-2 font-bold border-slate-200"
                  />
                </div>
                
                <div className="flex items-end">
                  <button 
                    onClick={handleSearch}
                    disabled={!searchDate}
                    className="w-full bg-[#003566] text-white p-3 rounded-xl font-black uppercase disabled:opacity-50 hover:bg-blue-800 transition-colors"
                  >
                    Buscar
                  </button>
                </div>
              </div>

              {/* Resultados de búsqueda */}
              {searchResults.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-slate-500 uppercase mb-3">
                    Resultados encontrados ({searchResults.length})
                  </h3>
                  {searchResults.map(item => (
                    <div 
                      key={item.id} 
                      className={`p-4 rounded-2xl border-2 ${
                        searchMonth === "enero" 
                          ? "bg-slate-100 border-slate-300 grayscale opacity-80" 
                          : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-black text-[#003566] text-lg uppercase">
                            {item.topic}
                          </p>
                          <div className="flex gap-4 mt-2 text-[10px] font-bold text-slate-500 uppercase">
                            <span>📅 {item.date}</span>
                            <span>👁️ {item.views}M vistas</span>
                            <span>💰 ${item.revenue}</span>
                            <span>📝 {item.format}</span>
                            {item.followers && <span>👥 {item.followers} followers</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-black text-green-600">
                            ${Number(item.revenue).toFixed(2)}
                          </p>
                          {searchMonth === "febrero" && (
                            <button 
                              onClick={() => handleEdit(item)}
                              className="mt-2 text-xs bg-blue-500 text-white px-3 py-1 rounded-lg font-bold uppercase hover:bg-blue-600"
                            >
                              ✏️ Editar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchDate ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300">
                  <p className="text-4xl mb-2">🔍</p>
                  <p className="font-black text-slate-400 uppercase">No hay publicaciones para esta fecha</p>
                  <p className="text-xs text-slate-400 mt-1">{searchDate}</p>
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300">
                  <p className="text-4xl mb-2">📅</p>
                  <p className="font-black text-slate-400 uppercase">Selecciona una fecha para buscar</p>
                </div>
              )}
            </section>

            {/* Calendario visual rápido */}
            <section className="bg-white p-6 rounded-xl md:rounded-[40px] border-2 border-slate-300 shadow-xl">
              <h3 className="text-lg font-black text-[#003566] uppercase italic mb-4">
                📊 Fechas con publicaciones - {searchMonth === "enero" ? "Enero" : "Febrero"} 2026
              </h3>
              <div className="flex flex-wrap gap-2">
                {(searchMonth === "enero" ? ENERO_DATA : febData).map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSearchDate(item.date);
                      setSearchResults([item]);
                    }}
                    className={`px-4 py-2 rounded-xl font-bold text-xs uppercase transition ${
                      searchDate === item.date
                        ? "bg-[#003566] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-blue-100"
                    }`}
                  >
                    {item.date.split("-")[2]}/{item.date.split("-")[1]}
                    <span className="block text-[8px] opacity-70">${item.revenue}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* HISTÓRICO ENERO */}
        {activeTab === "historico" && (
          <section className="bg-white rounded-xl md:rounded-[40px] p-4 md:p-8 border-2 border-slate-300 overflow-x-auto">
             <h2 className="text-xl md:text-2xl font-black text-slate-400 uppercase italic mb-6">
               Archivo Enero 2026
             </h2>
             <table className="w-full text-left min-w-[500px]">
                <thead className="bg-slate-100 text-[10px] font-black uppercase text-slate-500">
                  <tr>
                    <th className="p-3">Día</th>
                    <th className="p-3">Formato</th>
                    <th className="p-3">Titular</th>
                    <th className="p-3 text-right">Caja</th>
                    <th className="p-3 text-right">Alcance</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2">
                  {ENERO_DATA.map(i => (
                    <tr key={i.id} className="grayscale opacity-60 hover:opacity-80 transition-opacity">
                      <td className="p-3 font-bold">0{i.day}/01</td>
                      <td className="p-3 text-xs">{i.format}</td>
                      <td className="p-3 font-black uppercase truncate max-w-[200px]">{i.topic}</td>
                      <td className="p-3 font-black text-slate-600 text-right">${i.revenue.toFixed(2)}</td>
                      <td className="p-3 font-black text-right">{i.views}M</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-200 font-black text-xs uppercase">
                  <tr>
                    <td className="p-3" colSpan="3">Total Enero</td>
                    <td className="p-3 text-right text-green-700">
                      ${ENERO_DATA.reduce((sum, i) => sum + i.revenue, 0).toFixed(2)}
                    </td>
                    <td className="p-3 text-right">
                      {ENERO_DATA.reduce((sum, i) => sum + i.views, 0).toFixed(2)}M
                    </td>
                  </tr>
                </tfoot>
             </table>
          </section>
        )}
      </main>
    </div>
  );
}