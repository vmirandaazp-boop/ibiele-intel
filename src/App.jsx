import { useEffect, useState, useCallback } from "react"
import { createClient } from "@supabase/supabase-js"

// Configuración con variables de entorno recomendadas
const supabaseUrl = "https://stenaxhdsfxrzhetetiz.supabase.co";
const supabaseAnonKey = "sb_publishable_Sk2d6wvlqXrwLKfBEfS8fw_t5PfImJN";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const FORMATS = [
  { value: "🎬 Reels", label: "🎬 Reels", color: "bg-gradient-to-br from-pink-500 to-purple-600" },
  { value: "📸 Imagen", label: "📸 Imagen", color: "bg-gradient-to-br from-blue-500 to-cyan-600" },
  { value: "📱 Historia", label: "📱 Historia", color: "bg-gradient-to-br from-orange-500 to-red-600" },
  { value: "✍️ Texto", label: "✍️ Texto", color: "bg-gradient-to-br from-green-500 to-emerald-600" }
];

// Componente para el reloj digital
const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-[12px] font-bold opacity-80 mt-2 bg-white/15 backdrop-blur-sm w-fit px-4 py-1.5 rounded-xl border border-white/20 uppercase tabular-nums shadow-lg">
      {time.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
      })}
    </div>
  );
};

// Componente para el simulador de ganancias
const ProfitSimulator = ({ simViews, setSimViews, estimatedGain }) => {
  const formatViews = (views) => {
    if (views >= 1000000) return `${(views/1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views/1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <section className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-slate-100 text-center relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 text-8xl font-black italic text-blue-600 transition-all group-hover:opacity-20">$</div>
      
      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold uppercase text-blue-700 mb-2 tracking-widest border-b-2 border-blue-200 pb-1 px-2">
            🔮 Simulador de Impacto
          </p>
          <div className="text-xs font-bold text-slate-500">
            {formatViews(simViews)} vistas
          </div>
        </div>
        
        <div className="space-y-4">
          <input 
            type="range" 
            min="100000" 
            max="10000000" 
            step="100000" 
            value={simViews} 
            onChange={(e) => setSimViews(Number(e.target.value))}
            className="w-full h-3 bg-gradient-to-r from-blue-100 via-blue-300 to-blue-500 rounded-full appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all"
          />
          
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all">
            <p className="text-xs font-bold uppercase text-blue-200 mb-2">Ganancia Estimada:</p>
            <p className="text-5xl font-black italic text-yellow-300 leading-none">
              ${estimatedGain.toFixed(2)}
            </p>
            <p className="text-xs mt-2 text-blue-100">
              Basado en RPM actual: ${(estimatedGain/simViews * 1000).toFixed(4)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Componente para el formulario de registro
const MetricsForm = ({ form, setForm, onSave }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.topic || !form.views || !form.revenue) {
      alert("Por favor completa todos los campos");
      return;
    }
    await onSave(e);
  };

  return (
    <section className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border-t-4 border-blue-600">
      <h3 className="text-center text-xs font-bold uppercase text-slate-500 mb-6 italic tracking-widest">
        📊 Registrar Nuevas Métricas
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <input 
            placeholder=" " 
            value={form.topic} 
            onChange={e => setForm({...form, topic: e.target.value})}
            className="w-full p-5 rounded-2xl bg-slate-50 font-bold border-2 border-slate-200 text-lg outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
            required 
          />
          <label className="absolute left-4 top-2 text-xs text-slate-400 font-bold uppercase">
            Título del Contenido
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-2xl border-2 border-blue-200">
            <p className="text-xs font-bold text-blue-700 mb-2 text-center">👁️ Vistas</p>
            <input 
              type="number"
              placeholder="0" 
              value={form.views} 
              onChange={e => setForm({...form, views: e.target.value})}
              className="bg-transparent w-full text-3xl font-bold text-center outline-none text-blue-800"
              required 
            />
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-2xl border-2 border-green-200">
            <p className="text-xs font-bold text-green-700 mb-2 text-center">💰 Ingresos $</p>
            <input 
              type="number"
              step="0.01"
              placeholder="0" 
              value={form.revenue} 
              onChange={e => setForm({...form, revenue: e.target.value})}
              className="bg-transparent w-full text-3xl font-bold text-center outline-none text-green-800"
              required 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {FORMATS.map((format) => (
            <button
              key={format.value}
              type="button"
              onClick={() => setForm({...form, format: format.value})}
              className={`p-4 rounded-xl font-bold text-sm transition-all ${
                form.format === format.value 
                  ? `${format.color} text-white shadow-lg scale-105` 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {format.label}
            </button>
          ))}
        </div>

        <button 
          type="submit"
          className="w-full p-5 rounded-2xl font-bold uppercase text-xl shadow-xl bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900 active:scale-95 transition-all transform hover:shadow-2xl"
        >
          📈 Guardar Registro
        </button>
      </form>
    </section>
  );
};

// Componente para la tarjeta de métricas
const MetricCard = ({ data }) => {
  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num/1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num/1000).toFixed(1)}K`;
    return num.toString();
  };

  const getFormatStyle = (format) => {
    const f = FORMATS.find(f => f.value === format);
    return f ? f.color : 'bg-slate-300';
  };

  return (
    <div className="p-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-100 flex flex-col gap-4 hover:shadow-2xl transition-all cursor-pointer group">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-4">
          <div className={`${getFormatStyle(data.format)} w-16 h-16 rounded-xl flex flex-col items-center justify-center text-white shadow-xl shrink-0`}>
            <span className="text-2xl font-bold leading-none">
              {data.date.split("-")[2]}
            </span>
            <span className="text-[8px] font-bold uppercase opacity-80">
              {data.date.split("-")[1]}
            </span>
          </div>
          
          <div className="flex-1">
            <p className="text-xs font-bold text-blue-600 uppercase mb-1">
              {data.format}
            </p>
            <p className="text-xl font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
              {data.topic}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {new Date(data.date).toLocaleDateString('es-ES', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-around bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="text-center">
          <p className="text-[9px] font-bold text-slate-500 uppercase">Vistas</p>
          <p className="text-3xl font-bold text-blue-700">
            {formatNumber(Number(data.views))}
          </p>
        </div>
        
        <div className="w-px bg-slate-200 h-8 self-center"></div>
        
        <div className="text-center">
          <p className="text-[9px] font-bold text-slate-500 uppercase">Ingresos</p>
          <p className="text-3xl font-bold text-green-600">
            ${Number(data.revenue).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

// Componente principal
export default function App() {
  const [data, setData] = useState([]);
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [script, setScript] = useState("");
  const [simViews, setSimViews] = useState(1000000);
  const [form, setForm] = useState({ 
    date: new Date().toISOString().slice(0, 10), 
    topic: "", 
    views: "", 
    revenue: "", 
    format: "🎬 Reels" 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMetrics = useCallback(async () => {
    try {
      setLoading(true);
      const {  cloud, error } = await supabase
        .from("metrics")
        .select("*")
        .order('date', { ascending: false });
      
      if (error) throw error;
      if (cloud) setData(cloud);
    } catch (err) {
      console.error('Error loading metrics:', err);
      setError('Error al cargar las métricas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (auth) loadMetrics();
  }, [auth, loadMetrics]);

  const totalRev = data.reduce((a, b) => a + Number(b.revenue), 0);
  const totalViews = data.reduce((a, b) => a + Number(b.views), 0);
  const globalRPM = totalViews > 0 ? (totalRev / totalViews * 1000) : 0;
  const healthScore = data.length > 0 
    ? Math.min(Math.max(50 + (Number(data[0].revenue) > (totalRev/data.length || 1) ? 25 : -15), 0), 100) 
    : 0;
  const estimatedGain = simViews * (globalRPM / 1000);

  const saveMetrics = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.from("metrics").insert([{
        ...form, 
        views: parseFloat(form.views), 
        revenue: parseFloat(form.revenue)
      }]);
      
      if (error) throw error;
      
      setForm({ 
        date: new Date().toISOString().slice(0, 10), 
        topic: "", 
        views: "", 
        revenue: "", 
        format: "🎬 Reels" 
      });
      
      await loadMetrics();
    } catch (err) {
      console.error('Error saving metrics:', err);
      alert('Error al guardar las métricas');
    } finally {
      setLoading(false);
    }
  };

  if (!auth) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-6">
      <div className="bg-white/95 backdrop-blur-sm p-10 rounded-3xl shadow-2xl text-center w-full max-w-md border-t-4 border-blue-600">
        <div className="mb-8">
          <h2 className="text-4xl font-black text-blue-800 italic mb-2">IBIELE TV</h2>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Sistema de Métricas</p>
        </div>
        
        <div className="space-y-4">
          <input 
            type="password" 
            placeholder="CÓDIGO DE ACCESO" 
            className="w-full p-4 rounded-xl bg-slate-50 text-center mb-6 text-lg font-bold border-2 border-slate-200 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
            value={pass} 
            onChange={(e) => setPass(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (pass === "IBIELE2026" ? setAuth(true) : alert("Código incorrecto"))}
          />
          
          <button 
            onClick={() => pass === "IBIELE2026" ? setAuth(true) : alert("Código incorrecto")}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 rounded-xl font-black uppercase shadow-lg hover:from-blue-700 hover:to-blue-900 transition-all transform hover:scale-105 active:scale-95"
          >
            ACCEDER AL SISTEMA
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 font-sans text-slate-900 pb-10">
      
      {/* HEADER PROFESIONAL */}
      <header className="bg-gradient-to-br from-blue-800 to-blue-900 text-white p-8 rounded-b-3xl shadow-2xl mb-10 border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-5xl font-black italic tracking-tighter leading-none">
                IBIELE TV
                <span className="text-xl block text-blue-300 font-bold mt-2">Sistema de Inteligencia de Métricas</span>
              </h1>
              <DigitalClock />
            </div>
            
            <div className="text-right bg-white/10 backdrop-blur-sm p-5 rounded-2xl border border-white/20 shadow-lg">
              <p className="text-xs font-bold uppercase opacity-70 mb-1">Salud del Sistema</p>
              <div className={`text-4xl font-black ${
                healthScore > 80 ? 'text-green-400' : 
                healthScore > 60 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {healthScore}%
              </div>
              <p className="text-xs mt-1 opacity-60">
                {healthScore > 80 ? 'Óptimo' : healthScore > 60 ? 'Estable' : 'Requiere atención'}
              </p>
            </div>
          </div>
          
          {/* Panel de métricas resumen */}
          <div className="grid grid-cols-4 gap-4 mt-8 bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
            <div className="text-center">
              <p className="text-xs font-bold text-blue-200">Total Vistas</p>
              <p className="text-3xl font-bold mt-2">
                {totalViews >= 1000000 ? `${(totalViews/1000000).toFixed(1)}M` : `${(totalViews/1000).toFixed(1)}K`}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-green-200">Total Ingresos</p>
              <p className="text-3xl font-bold mt-2 text-green-300">${totalRev.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-yellow-200">RPM Global</p>
              <p className="text-3xl font-bold mt-2 text-yellow-300">${globalRPM.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-purple-200">Registros</p>
              <p className="text-3xl font-bold mt-2">{data.length}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 space-y-8">
        
        {/* SIMULADOR MEJORADO */}
        <ProfitSimulator 
          simViews={simViews} 
          setSimViews={setSimViews} 
          estimatedGain={estimatedGain} 
        />

        {/* FORMULARIO MEJORADO */}
        <MetricsForm 
          form={form} 
          setForm={setForm} 
          onSave={saveMetrics} 
        />

        {/* BITÁCORA MEJORADA */}
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-black text-blue-800 uppercase italic tracking-widest">
              Bitácora de Métricas
            </h2>
            {loading && (
              <div className="text-sm text-blue-600 font-bold">
                Cargando...
              </div>
            )}
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            {data.map(d => (
              <MetricCard key={d.id} data={d} />
            ))}
            
            {data.length === 0 && (
              <div className="bg-white/95 backdrop-blur-sm p-12 rounded-2xl text-center border-2 border-dashed border-slate-300">
                <p className="text-xl text-slate-400 font-bold">
                  No hay métricas registradas aún
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  Comienza registrando tus primeras métricas
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}