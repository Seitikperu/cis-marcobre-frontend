/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

function unslugify(s: string) { return s.replace(/-/g, ' ').toUpperCase() }

const ESTADO_COLOR: Record<string, string> = {
  borrador: '#9CA8B8', enviado: '#2E7DC4', aprobado: '#15803D', rechazado: '#B91C1C',
}
const TIPOS = ['jumbo','empernador','scooptram','desatador','volquete']
const TIPO_LABELS: Record<string,string> = {
  jumbo:'Jumbo', empernador:'Empernador', scooptram:'Scooptram',
  desatador:'Desatador', volquete:'Volquete',
}

export default async function ReportesListPage({ params }: { params: { proyecto: string } }) {
  const sb = createClient() as any
  const nombreMina = unslugify(params.proyecto)
  const { data: mina } = await sb.from('minas').select('id,nombre').ilike('nombre', nombreMina).maybeSingle()

  const { data: reportes } = await sb
    .from('reportes_equipos')
    .select('id,tipo_reporte,fecha,turno,estado,nombre_operador,created_at')
    .eq('mina_id', mina?.id ?? '')
    .order('fecha', { ascending: false })
    .order('created_at', { ascending: false })

  const rows: any[] = reportes ?? []

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#5A6B80' }}>{mina?.nombre ?? nombreMina}</p>
          <h1 className="font-condensed font-bold text-3xl uppercase tracking-wide" style={{ color: '#0B1E3D' }}>Reportes de Turno</h1>
        </div>
        <div className="flex gap-2 flex-wrap">
          {TIPOS.map(t => (
            <Link key={t} href={`/${params.proyecto}/reportes/${t}`}
              className="text-xs font-condensed font-semibold uppercase tracking-wider px-3 py-2 rounded-lg transition-all hover:opacity-90"
              style={{ background: '#0B1E3D', color: '#fff' }}>
              + {TIPO_LABELS[t]}
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid #C4CDD8' }}>
        <div className="px-5 py-3" style={{ background: '#0B1E3D' }}>
          <span className="font-condensed font-semibold text-white text-sm uppercase tracking-widest">Todos los reportes</span>
        </div>
        {rows.length === 0 ? (
          <p className="px-5 py-10 text-sm text-center" style={{ color: '#9CA8B8' }}>No hay reportes registrados aún.</p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #E8ECF2', background: '#F5F7FA' }}>
                {['Fecha','Turno','Tipo Equipo','Operador','Estado',''].map(h => (
                  <th key={h} className="text-left px-4 py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: '#5A6B80' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #E8ECF2', background: i%2===1 ? '#FAFBFD':'#fff' }}>
                  <td className="px-4 py-3 text-xs" style={{ color: '#0F1C30' }}>{new Date(r.fecha).toLocaleDateString('es-PE')}</td>
                  <td className="px-4 py-3 text-xs font-semibold uppercase" style={{ color: '#5A6B80' }}>{r.turno}</td>
                  <td className="px-4 py-3"><span className="font-condensed font-bold text-xs uppercase" style={{ color: '#0B1E3D' }}>{r.tipo_reporte}</span></td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#5A6B80' }}>{r.nombre_operador ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded font-semibold uppercase tracking-wider"
                      style={{ background:`${ESTADO_COLOR[r.estado]??'#9CA8B8'}18`, color:ESTADO_COLOR[r.estado]??'#9CA8B8' }}>
                      {r.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/${params.proyecto}/reportes/${r.tipo_reporte?.toLowerCase()}/${r.id}`}
                      className="text-xs font-condensed font-semibold uppercase tracking-wider" style={{ color: '#2E7DC4' }}>
                      Ver →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
