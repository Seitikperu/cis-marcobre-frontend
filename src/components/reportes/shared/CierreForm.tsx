'use client'
import type { ReporteEquipo } from '@/lib/types/database.types'

interface Props {
  cabecera: Partial<ReporteEquipo>
  onChange: (updates: Partial<ReporteEquipo>) => void
  resumen: {
    horasMotor: string
    actividadesCount: number
    totalPies: number
    totalTalPerf: number
    totalTalRim: number
    totalViajes: number
    totalM3: number
  }
}

export default function CierreForm({ cabecera, onChange, resumen }: Props) {
  const firmas = [
    { key: 'nombre_operador'            as keyof ReporteEquipo, label: 'Operador' },
    { key: 'nombre_jefe_guardia_aesa'   as keyof ReporteEquipo, label: 'Jefe de Guardia AESA' },
    { key: 'nombre_jefe_guardia_cliente'as keyof ReporteEquipo, label: 'Jefe de Guardia MARCOBRE' },
    { key: 'nombre_jefe_superintendente'as keyof ReporteEquipo, label: 'Jefe / Superintendente Operaciones AESA' },
  ]

  return (
    <div className="space-y-4">
      {/* Barra resumen */}
      <div
        className="flex gap-0 rounded-xl overflow-hidden"
        style={{ border: '1px solid #C4CDD8', background: '#fff' }}
      >
        {[
          { n: resumen.horasMotor, l: 'Horas Motor' },
          { n: resumen.actividadesCount, l: 'Actividades' },
          { n: resumen.totalPies.toFixed(1), l: 'Pies Perf.' },
          { n: resumen.totalTalPerf, l: 'Tal. Perf.' },
          { n: resumen.totalTalRim, l: 'Tal. Rimados' },
          { n: resumen.totalViajes, l: 'Viajes' },
          { n: resumen.totalM3.toFixed(1), l: 'M³' },
        ].map(({ n, l }) => (
          <div key={l} className="flex-1 px-4 py-3 border-r last:border-r-0" style={{ borderColor: '#E8ECF2' }}>
            <div className="font-condensed font-bold text-xl leading-none" style={{ color: '#0B1E3D' }}>{n}</div>
            <div className="text-[9px] uppercase tracking-wider mt-1" style={{ color: '#5A6B80' }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Observaciones finales */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #C4CDD8' }}>
        <div className="px-4 py-2" style={{ background: '#0B1E3D' }}>
          <span className="font-condensed font-semibold text-white text-xs uppercase tracking-widest">
            Observaciones – Ubicación Final de Equipo
          </span>
        </div>
        <div className="p-3" style={{ background: '#fff' }}>
          <textarea
            rows={2}
            className="w-full text-sm border rounded-lg px-3 py-2 resize-none"
            style={{ borderColor: '#C4CDD8', outline: 'none', color: '#0F1C30' }}
            placeholder="Registrar observaciones generales del turno y ubicación final del equipo..."
            value={cabecera.observaciones_finales ?? ''}
            onChange={e => onChange({ observaciones_finales: e.target.value || null })}
          />
        </div>
      </div>

      {/* Firmas */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 rounded-xl overflow-hidden"
        style={{ border: '1px solid #C4CDD8', borderTop: '2px solid #0B1E3D' }}
      >
        {firmas.map(({ key, label }) => (
          <div key={key} className="border-r last:border-r-0" style={{ borderColor: '#C4CDD8' }}>
            <div
              className="px-3 py-2 text-[9px] font-semibold uppercase tracking-wider text-center text-white"
              style={{ background: '#0B1E3D' }}
            >
              {label}
            </div>
            <div className="px-3 py-2" style={{ background: '#fff' }}>
              <input
                type="text"
                className="w-full border-b text-xs py-1 outline-none bg-transparent"
                style={{ borderColor: '#C4CDD8', color: '#0F1C30' }}
                placeholder="Nombre completo"
                value={(cabecera[key] as string) ?? ''}
                onChange={e => onChange({ [key]: e.target.value || null })}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
