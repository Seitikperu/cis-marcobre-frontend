import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

function unslugify(slug: string) {
  return slug.replace(/-/g, ' ').toUpperCase()
}

const EQUIPOS = [
  { tipo: 'jumbo',      label: 'Jumbo Frontonero', icon: '⛏' },
  { tipo: 'empernador', label: 'Empernador',       icon: '🔩' },
  { tipo: 'scooptram',  label: 'Scooptram',        icon: '🚜' },
  { tipo: 'desatador',  label: 'Desatador',        icon: '⚒' },
  { tipo: 'volquete',   label: 'Volquete',         icon: '🚛' },
]

const ESTADO_COLOR: Record<string, string> = {
  borrador: '#9CA8B8', enviado: '#2E7DC4', aprobado: '#15803D', rechazado: '#B91C1C',
}

export default async function ProyectoDashboard({ params }: { params: { proyecto: string } }) {
  const supabase = createClient()
  const nombreMina = unslugify(params.proyecto)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const { data: minaData } = await sb.from('minas').select('id,nombre,ubicacion').ilike('nombre', nombreMina).maybeSingle()
  const minaId: string = minaData?.id ?? ''
  const minaNombre: string = minaData?.nombre ?? nombreMina
  const minaUbi: string = minaData?.ubicacion ?? ''

  const { data: reportesData } = await sb
    .from('reportes_equipos')
    .select('id,tipo_reporte,fecha,turno,estado,nombre_operador')
    .eq('mina_id', minaId)
    .order('fecha', { ascending: false })
    .limit(8)
  const reportes: Array<Record<string,string>> = reportesData ?? []

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#5A6B80' }}>Proyecto activo</p>
          <h1 className="font-condensed font-bold text-3xl uppercase tracking-wide" style={{ color: '#0B1E3D' }}>{minaNombre}</h1>
          <p className="text-sm mt-0.5" style={{ color: '#5A6B80' }}>{minaUbi}</p>
        </div>
        <Link href="/proyectos" className="text-xs px-3 py-2 rounded-lg font-condensed font-semibold uppercase tracking-wider"
          style={{ background: '#fff', border: '1px solid #C4CDD8', color: '#5A6B80' }}>
          ← Cambiar proyecto
        </Link>
      </div>

      {/* Selector de equipo */}
      <div className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid #C4CDD8' }}>
        <div className="px-5 py-3" style={{ background: '#0B1E3D' }}>
          <h2 className="font-condensed font-semibold text-white text-sm uppercase tracking-widest">Nuevo Reporte de Turno</h2>
        </div>
        <div className="p-5">
          <p className="text-sm mb-4" style={{ color: '#5A6B80' }}>Selecciona el tipo de equipo:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {EQUIPOS.map(({ tipo, label, icon }) => (
              <Link key={tipo} href={`/${params.proyecto}/reportes/${tipo}`}
                className="group flex flex-col items-center gap-2 p-4 rounded-lg text-center transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
                style={{ background: '#F5F7FA', border: '1px solid #D8E2EC' }}>
                <span className="text-3xl">{icon}</span>
                <span className="font-condensed font-semibold text-xs uppercase tracking-wide" style={{ color: '#0B1E3D' }}>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Últimos reportes */}
      <div className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid #C4CDD8' }}>
        <div className="px-5 py-3 flex items-center justify-between" style={{ background: '#0B1E3D' }}>
          <h2 className="font-condensed font-semibold text-white text-sm uppercase tracking-widest">Últimos Reportes</h2>
          <Link href={`/${params.proyecto}/reportes`} className="text-xs font-condensed font-semibold uppercase tracking-wider" style={{ color: '#E8B82A' }}>
            Ver todos →
          </Link>
        </div>
        <div className="divide-y" style={{ borderColor: '#E8ECF2' }}>
          {reportes.length === 0 ? (
            <p className="px-5 py-8 text-sm text-center" style={{ color: '#9CA8B8' }}>No hay reportes registrados aún.</p>
          ) : reportes.map((r) => (
            <Link key={r.id} href={`/${params.proyecto}/reportes/${r.tipo_reporte?.toLowerCase()}/${r.id}`}
              className="flex items-center justify-between px-5 py-3 hover:bg-[#F5F7FA] transition-colors">
              <div className="flex items-center gap-3">
                <span className="font-condensed font-bold text-sm uppercase" style={{ color: '#0B1E3D' }}>{r.tipo_reporte}</span>
                <span className="text-xs" style={{ color: '#5A6B80' }}>{new Date(r.fecha).toLocaleDateString('es-PE')} · {r.turno}</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded font-semibold uppercase tracking-wider"
                style={{ background: `${ESTADO_COLOR[r.estado] ?? '#9CA8B8'}18`, color: ESTADO_COLOR[r.estado] ?? '#9CA8B8' }}>
                {r.estado}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
