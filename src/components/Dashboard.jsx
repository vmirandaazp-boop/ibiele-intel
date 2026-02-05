import { useState } from "react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

/* =====================
   DATA BASE INICIAL - MEJORADA
===================== */

const initialData = [
  { id: 1, date: "2026-01-01", revenue: 420, posts: 2, topic: "Mártires" },
  { id: 2, date: "2026-01-02", revenue: 610, posts: 3, topic: "Persecución" },
  { id: 3, date: "2026-01-03", revenue: 300, posts: 1, topic: "Fe" },
  { id: 4, date: "2026-01-04", revenue: 980, posts: 5, topic: "Estadio Lleno" },
  { id: 5, date: "2026-01-05", revenue: 740, posts: 4, topic: "Sangre/Domingo" },
]

/* =====================
   COMPONENTES MEJORADOS
===================== */

function KPI({ title, value, trend, color = "#2563eb" }) {
  return (
    <div style={{
      background: "white",
      padding: 20,
      borderRadius: 14,
      boxShadow: "0 4px 12px rgba(0,0,0,.05)",
      borderLeft: `4px solid ${color}`
    }}>
      <p style={{ color:"#64748b", fontSize: '0.9rem', margin: 0 }}>{title}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <h2 style={{ margin: '5px 0 0 0', color: '#1e293b' }}>{value}</h2>
        {trend && <span style={{ color: trend > 0 ? '#10b981' : '#ef4444', fontSize: '1.2rem' }}>
          {trend > 0 ? '📈' : '📉'} {Math.abs(trend)}%
        </span>}
      </div>
    </div>
  )
}

function RevenueChart({ data }) {
  const max = Math.max(...data.map(d => d.revenue))
  const h = 200
  const w = 650
  const pad = 40

  const points = data.map((d,i)=>{
    const x = pad + (i * (w/(data.length-1)))
    const y = h - (d.revenue/max)*h + 10
    return `${x},${y}`
  }).join(" ")

  return (
    <div style={{ 
      background: 'white', 
      padding: 20, 
      borderRadius: 14, 
      boxShadow: "0 4px 12px rgba(0,0,0,.05)",
      marginTop: 20
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#1e293b' }}>📈 Gráfica de Ingresos</h3>
      <svg width="100%" height="260" viewBox={`0 0 ${w+60} ${h+40}`}>
        {/* Grid lines */}
        <line x1={pad} y1="10" x2={w+pad} y2="10" stroke="#e2e8f0" strokeWidth="1" />
        <line x1={pad} y1="60" x2={w+pad} y2="60" stroke="#e2e8f0" strokeWidth="1" />
        <line x1={pad} y1="110" x2={w+pad} y2="110" stroke="#e2e8f0" strokeWidth="1" />
        <line x1={pad} y1="160" x2={w+pad} y2="160" stroke="#e2e8f0" strokeWidth="1" />
        
        <polyline
          points={points}
          fill="none"
          stroke="#2563eb"
          strokeWidth="4"
          strokeDasharray="10,5"
        />
        
        {/* Points */}
        {data.map((d,i) => {
          const x = pad + (i * (w/(data.length-1)))
          const y = h - (d.revenue/max)*h + 10
          return (
            <circle key={i} cx={x} cy={y} r="6" fill="#2563eb" />
          )
        })}
      </svg>
    </div>
  )
}

function AIAdvisor({ revenue, data }) {
  const avgDaily = data.length > 0 ? revenue / data.length : 0
  const lastRevenue = data[data.length - 1]?.revenue || 0
  const prevRevenue = data[data.length - 2]?.revenue || 0
  const growth = prevRevenue ? ((lastRevenue - prevRevenue) / prevRevenue * 100).toFixed(1) : 0

  let advice = ""
  let urgency = "low"

  if (revenue > 5000) {
    advice = "🚀 Excelente rendimiento. Considera escalar la inversión en contenido similar."
    urgency = "high"
  } else if (avgDaily > 500) {
    advice = "📈 Buen rendimiento sostenido. Mantén la frecuencia actual."
    urgency = "medium"
  } else if (lastRevenue < prevRevenue) {
    advice = `⚠️ Último día: ${growth}% vs anterior. Revisa el formato o tema publicado.`
    urgency = "medium"
  } else {
    advice = `💡 Promedio diario: $${avgDaily.toFixed(2)}. Incrementa frecuencia de publicación para alcanzar meta.`
    urgency = "low"
  }

  const colors = {
    high: { bg: "#dbeafe", border: "#3b82f6", icon: "🚀" },
    medium: { bg: "#fef3c7", border: "#f59e0b", icon: "⚠️" },
    low: { bg: "#dcfce7", border: "#22c55e", icon: "💡" }
  }

  const color = colors[urgency]

  return (
    <div style={{
      background: color.bg,
      padding: 20,
      borderRadius: 12,
      marginTop: 20,
      borderLeft: `4px solid ${color.border}`,
      boxShadow: "0 2px 8px rgba(0,0,0,.08)"
    }}>
      <strong style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span>{color.icon}</span>
        JARVIS IA - Análisis Inteligente
      </strong>
      <p style={{ margin: '10px 0 0 0', color: '#1e293b' }}>{advice}</p>
    </div>
  )
}

/* =====================
   APP PRINCIPAL MEJORADA
===================== */

export default function App() {
  const [data, setData] = useState(initialData)
  const [dark, setDark] = useState(false)
  const [form, setForm] = useState({ revenue: "", posts: "", topic: "" })

  const totalRevenue = data.reduce((a,b)=>a+b.revenue,0)
  const avgDaily = data.length > 0 ? totalRevenue / data.length : 0
  const growthRate = data.length >= 2 
    ? ((data[data.length-1].revenue - data[data.length-2].revenue) / data[data.length-2].revenue * 100)
    : 0

  const addRevenue = (e) => {
    e.preventDefault()
    
    if (!form.revenue || !form.posts) {
      alert("Por favor completa todos los campos")
      return
    }

    const today = new Date().toISOString().slice(0,10)
    const newEntry = {
      id: Date.now(),
      date: today,
      revenue: parseFloat(form.revenue),
      posts: parseInt(form.posts),
      topic: form.topic || "Sin tema"
    }

    setData([...data, newEntry])
    setForm({ revenue: "", posts: "", topic: "" })
  }

  const exportPDF = () => {
    const input = document.getElementById('jarvis-dashboard')
    html2canvas(input).then(canvas => {
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgData = canvas.toDataURL('image/png')
      const imgWidth = 210
      const pageHeight = 297
      const imgHeight = canvas.height * imgWidth / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`JARVIS-Reporte-${new Date().toISOString().slice(0,10)}.pdf`)
    })
  }

  const fullscreen = () => {
    document.getElementById('jarvis-dashboard').requestFullscreen()
  }

  const deleteEntry = (id) => {
    if (window.confirm("¿Eliminar este registro?")) {
      setData(data.filter(d => d.id !== id))
    }
  }

  return (
    <div id="jarvis-dashboard" style={{
      background: dark ? "#0f172a" : "#f8fafc",
      color: dark ? "#e2e8f0" : "#1e293b",
      minHeight: "100vh",
      padding: 40,
      fontFamily: "'Inter', system-ui, sans-serif"
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
          <h1 style={{ margin: 0, fontSize: '2.5rem', background: 'linear-gradient(90deg, #2563eb, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            🏛️ JARVIS — Executive Control Panel
          </h1>
          <button 
            onClick={() => setDark(!dark)}
            style={{
              background: dark ? '#3b82f6' : '#64748b',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {dark ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
          </button>
        </div>

        <div style={{ marginBottom: 25, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={exportPDF} style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer' }}>
            📄 Exportar PDF
          </button>
          <button onClick={fullscreen} style={{ background: '#8b5cf6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer' }}>
            🖥️ Pantalla Completa
          </button>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 20,
          marginBottom: 20
        }}>
          <KPI title="Ingresos Totales" value={`$${totalRevenue.toFixed(2)}`} trend={growthRate} color="#2563eb" />
          <KPI title="Meta Mensual" value="$20,000" color="#ef4444" />
          <KPI title="Promedio Diario" value={`$${avgDaily.toFixed(2)}`} color="#10b981" />
          <KPI title="Total Posts" value={data.length} color="#f59e0b" />
        </div>

        <RevenueChart data={data} />

        <AIAdvisor revenue={totalRevenue} data={data} />

        {/* Formulario de entrada */}
        <div style={{ 
          background: 'white', 
          padding: 25, 
          borderRadius: 14, 
          boxShadow: "0 4px 12px rgba(0,0,0,.05)",
          marginTop: 20
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#1e293b' }}>➕ Agregar Nuevo Registro</h3>
          <form onSubmit={addRevenue} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 15 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 5, fontSize: '0.9rem', color: '#64748b' }}>Ingresos ($)</label>
              <input
                type="number"
                value={form.revenue}
                onChange={(e) => setForm({...form, revenue: e.target.value})}
                placeholder="Ej: 450"
                style={{
                  width: '100%',
                  padding: 10,
                  borderRadius: 8,
                  border: '2px solid #e2e8f0',
                  fontSize: '1rem'
                }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 5, fontSize: '0.9rem', color: '#64748b' }}>Posts</label>
              <input
                type="number"
                value={form.posts}
                onChange={(e) => setForm({...form, posts: e.target.value})}
                placeholder="Ej: 3"
                style={{
                  width: '100%',
                  padding: 10,
                  borderRadius: 8,
                  border: '2px solid #e2e8f0',
                  fontSize: '1rem'
                }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 5, fontSize: '0.9rem', color: '#64748b' }}>Tema</label>
              <input
                type="text"
                value={form.topic}
                onChange={(e) => setForm({...form, topic: e.target.value})}
                placeholder="Ej: Mártires"
                style={{
                  width: '100%',
                  padding: 10,
                  borderRadius: 8,
                  border: '2px solid #e2e8f0',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button 
                type="submit"
                style={{
                  width: '100%',
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}
              >
                ✅ Registrar
              </button>
            </div>
          </form>
        </div>

        {/* Tabla de datos */}
        <div style={{ 
          background: 'white', 
          padding: 20, 
          borderRadius: 14, 
          boxShadow: "0 4px 12px rgba(0,0,0,.05)",
          marginTop: 20,
          overflowX: 'auto'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#1e293b' }}>📊 Historial de Registros</h3>
          <table width="100%" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #e2e8f0', fontWeight: 'bold', color: '#64748b' }}>Fecha</th>
                <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #e2e8f0', fontWeight: 'bold', color: '#64748b' }}>Tema</th>
                <th style={{ textAlign: 'right', padding: '12px', borderBottom: '2px solid #e2e8f0', fontWeight: 'bold', color: '#64748b' }}>Ingresos</th>
                <th style={{ textAlign: 'center', padding: '12px', borderBottom: '2px solid #e2e8f0', fontWeight: 'bold', color: '#64748b' }}>Posts</th>
                <th style={{ textAlign: 'center', padding: '12px', borderBottom: '2px solid #e2e8f0', fontWeight: 'bold', color: '#64748b' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={d.id} style={{ 
                  borderBottom: '1px solid #e2e8f0',
                  background: i % 2 === 0 ? '#f8fafc' : 'white'
                }}>
                  <td style={{ padding: '12px', fontSize: '0.95rem' }}>{d.date}</td>
                  <td style={{ padding: '12px', fontSize: '0.95rem' }}>{d.topic}</td>
                  <td style={{ padding: '12px', fontSize: '0.95rem', textAlign: 'right', fontWeight: 'bold', color: '#2563eb' }}>${d.revenue}</td>
                  <td style={{ padding: '12px', fontSize: '0.95rem', textAlign: 'center' }}>{d.posts}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button 
                      onClick={() => deleteEntry(d.id)}
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}