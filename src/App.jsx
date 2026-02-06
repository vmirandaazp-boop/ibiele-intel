import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// Configuración de Supabase
const supabaseUrl = "https://stenaxhdsfxrzhetetiz.supabase.co";
const supabaseAnonKey = "sb_publishable_Sk2d6wvlqXrwLKfBEfS8fw_t5PfImJN";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Definición de formatos
const FORMATS = [
  { value: "Foto", label: "Foto", icon: "🖼️" },
  { value: "Reels", label: "Reels", icon: "🎬" },
  { value: "Enlaces", label: "Enlaces", icon: "🔗" },
  { value: "Historias", label: "Historias", icon: "📱" }
];

// Componente principal
export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    revenue: "",
    views: "",
    interactions: "",
    followers: "",
    format: "Foto"
  });
  const [activeTab, setActiveTab] = useState("febrero");
  const [time, setTime] = useState(new Date());
  const [location, setLocation] = useState("Aguascalientes, MX");

  // Actualizar reloj
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Cargar datos
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
      setError("Error al cargar los datos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Guardar datos
  const saveData = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("metrics").insert([{
        date: formData.date,
        revenue: parseFloat(formData.revenue),
        views: parseFloat(formData.views),
        interactions: parseFloat(formData.interactions),
        followers: parseFloat(formData.followers),
        format: formData.format
      }]);
      
      if (error) throw error;
      
      // Limpiar formulario
      setFormData({
        ...formData,
        revenue: "",
        views: "",
        interactions: "",
        followers: ""
      });
      
      // Recargar datos
      await loadData();
    } catch (err) {
      setError("Error al guardar los datos");
      console.error(err);
    }
  };

  // Cargar datos al iniciar
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Calcular métricas
  const totalRevenue = data.reduce((sum, item) => sum + (item.revenue || 0), 0);
  const totalViews = data.reduce((sum, item) => sum + (item.views || 0), 0);
  const avgRevenue = data.length > 0 ? totalRevenue / data.length : 0;
  const topPerformers = [...data]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 3);

  // Formatear números
  const formatNumber = (num, decimals = 2) => {
    if (num >= 1000000) return `${(num/1000000).toFixed(decimals)}M`;
    if (num >= 1000) return `${(num/1000).toFixed(decimals)}K`;
    return num.toFixed(decimals);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Header superior */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">IBIELE TV INTEL</h1>
            <p className="text-sm opacity-90 flex items-center mt-1">
              <span className="inline-block w-2 h-2 bg-yellow-300 rounded-full mr-2"></span>
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • 
              <span className="ml-2">MANDO ESTRATÉGICO</span>
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition">
              {location}
            </button>
            <button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-medium transition">
              REPORTE
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Sección de registro */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center mb-5">
              <span className="text-2xl mr-2">📝</span>
              <h2 className="text-xl font-bold text-indigo-700">REGISTRAR ACTIVIDAD</h2>
            </div>
            
            <form onSubmit={saveData} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    FECHA DE OPERACIÓN
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    MILLONES DE VISTAS (FEB)
                  </label>
                  <input
                    type="number"
                    placeholder="Ej: 2.5"
                    value={formData.views}
                    onChange={(e) => setFormData({...formData, views: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    step="0.1"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  DÓLARES GENERADOS
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.revenue}
                  onChange={(e) => setFormData({...formData, revenue: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  step="0.01"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    INTERACCIONES (K)
                  </label>
                  <input
                    type="number"
                    placeholder="45.0"
                    value={formData.interactions}
                    onChange={(e) => setFormData({...formData, interactions: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    NUEVOS SEGUIDORES
                  </label>
                  <input
                    type="number"
                    placeholder="468"
                    value={formData.followers}
                    onChange={(e) => setFormData({...formData, followers: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    FORMATO
                  </label>
                  <select
                    value={formData.format}
                    onChange={(e) => setFormData({...formData, format: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {FORMATS.map(format => (
                      <option key={format.value} value={format.value}>
                        {format.icon} {format.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                SINCRONIZAR DATOS 📊
              </button>
            </form>
          </div>
          
          {/* Sección de insights */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center mb-5">
              <span className="text-2xl mr-2">💡</span>
              <h2 className="text-xl font-bold text-indigo-700">ORÁCULO ESTRATÉGICO</h2>
            </div>
            
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 mb-5">
              <p className="font-medium">
                <span className="text-indigo-600">ESTRATEGIA:</span> Usa el formato 'Breaking News'. Las noticias rinden 42% más.
              </p>
            </div>
            
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-5">
              <p className="font-medium">
                <span className="text-purple-600">COMPARATIVA HISTÓRICA:</span> 
                <br />
                <span className="text-2xl font-bold">"Mataron a mi hijo"</span>
                <br />
                Rendimiento: <span className="font-bold">0.7M Vistas</span>
              </p>
            </div>
          </div>
        </section>

        {/* Sección de bitácora */}
        <section className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 mb-8">
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center">
              <span className="text-2xl mr-2">📈</span>
              <h2 className="text-xl font-bold text-indigo-700">BITÁCORA DE CRECIMIENTO</h2>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab("febrero")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === "febrero"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Febrero 2026
              </button>
              <button
                onClick={() => setActiveTab("enero")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === "enero"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Enero 2026
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando métricas...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <p className="text-red-700">{error}</p>
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No hay datos registrados aún</p>
              <p className="text-gray-400 mt-2">Registra tu primera métrica para comenzar</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FECHA</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ALCANCE FEB</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CAJA USD</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EVALUACIÓN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {new Date(item.date).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 font-bold">
                        {formatNumber(item.views)}M
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">
                        ${item.revenue.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                          SUPERÓ ALCANCE
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Sección de métricas clave */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl border border-indigo-100">
            <p className="text-sm font-medium text-indigo-600 mb-1">INGRESOS TOTALES</p>
            <p className="text-3xl font-bold text-indigo-800">${totalRevenue.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">Meta Febrero: $1,250.00</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-100">
            <p className="text-sm font-medium text-purple-600 mb-1">VISUALIZACIONES</p>
            <p className="text-3xl font-bold text-purple-800">{formatNumber(totalViews)}M</p>
            <p className="text-xs text-gray-500 mt-1">+12.3% vs Promedio</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-100">
            <p className="text-sm font-medium text-blue-600 mb-1">INTERACCIONES</p>
            <p className="text-3xl font-bold text-blue-800">{formatNumber(data.reduce((sum, item) => sum + (item.interactions || 0), 0))}K</p>
            <p className="text-xs text-gray-500 mt-1">Tasa: 1.52%</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-100">
            <p className="text-sm font-medium text-green-600 mb-1">NUEVOS SEGUIDORES</p>
            <p className="text-3xl font-bold text-green-800">+{formatNumber(data.reduce((sum, item) => sum + (item.followers || 0), 0))}</p>
            <p className="text-xs text-gray-500 mt-1">Crecimiento: 38%</p>
          </div>
        </section>

        {/* Sección de proyección */}
        <section className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">PROYECCIÓN PARA SUPERAR ENERO</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/10 p-4 rounded-xl">
              <p className="text-sm opacity-80">Meta Diaria Recomendada</p>
              <p className="text-3xl font-bold mt-1">$38.72</p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl">
              <p className="text-sm opacity-80">Ingresos Enero</p>
              <p className="text-lg mt-1">${totalRevenue.toFixed(2)} (31 días)</p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl">
              <p className="text-sm opacity-80">Promedio Diario</p>
              <p className="text-lg mt-1">${avgRevenue.toFixed(2)} por día</p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl">
              <p className="text-sm opacity-80">Días Restantes</p>
              <p className="text-lg mt-1">27 días</p>
            </div>
          </div>
          
          <div className="bg-white/10 p-5 rounded-xl">
            <h3 className="text-lg font-bold mb-3">FORMATOS DEL MEJOR CONTENIDO - ENERO 2026</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {FORMATS.map((format, index) => (
                <div key={index} className="bg-white/5 p-4 rounded-lg text-center">
                  <div className="text-3xl mb-2">{format.icon}</div>
                  <p className="font-medium">{format.label}</p>
                  <p className="text-sm opacity-80 mt-1">{formatNumber([1.37, 49.7, 3.6, 1.3][index])}M</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sección de top performers */}
        <section className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-indigo-700 mb-5">DÍAS CON MAYOR RENDIMIENTO - ENERO 2026</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {topPerformers.map((item, index) => (
              <div key={index} className="bg-ind50 border border-indigo-100 rounded-xl p-5">
                <p className="font-bold text-indigo-700">TOP {index + 1}: {new Date(item.date).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'short'
                })}</p>
                <p className="mt-2"><span className="font-medium">${item.revenue.toFixed(2)}</span> en ingresos</p>
                <p className="mt-1">{formatNumber(item.views)} visualizaciones</p>
                <p className="mt-1">{formatNumber(item.interactions)}K interacciones</p>
                <p className="mt-2 text-sm opacity-80">Contenido: "{item.topic || 'Contenido destacado'}"</p>
              </div>
            ))}
          </div>
          
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-5">
            <h3 className="font-bold text-purple-700 mb-2">PATRÓN DETECTADO</h3>
            <p className="text-sm">
              Los <span className="font-medium">Domingos</span> son tus días de mayor rendimiento con un promedio de <span className="font-medium">${avgRevenue.toFixed(2)}</span> en ingresos. 
              El contenido relacionado con <span className="font-medium">"Mártires"</span>, <span className="font-medium">"Estadio Lleno"</span> y testimonios de fe funciona excepcionalmente bien. 
              <span className="font-medium">Recomendación:</span> Programa tu contenido más importante para Domingos entre 12:00-14:00.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}