'use client'
import type { Equipo, ReporteEquipo } from '@/lib/types/database.types'

interface Props {
  cabecera: Partial<ReporteEquipo>
  equipos: Equipo[]
  onChange: (updates: Partial<ReporteEquipo>) => void
  tipoLabel: string
}

const EL = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-stretch border-b" style={{ borderColor: '#C4CDD8' }}>
    <div
      className="flex items-center px-3 py-2 text-xs font-semibold uppercase tracking-wide flex-shrink-0 w-36"
      style={{ background: '#0B1E3D', color: '#fff' }}
    >
      {label}
    </div>
    <div className="flex-1 flex items-center px-2 py-1">{children}</div>
  </div>
)

const bare = {
  border: 'none', outline: 'none', background: 'transparent',
  fontSize: '12px', width: '100%', color: '#0F1C30', padding: '2px 4px',
}

export default function EncabezadoForm({ cabecera, equipos, onChange, tipoLabel }: Props) {
  return (
    <div className="rounded-xl overflow-hidden shadow-sm" style={{ border: '1px solid #C4CDD8' }}>
      {/* Logos + título */}
      <div
        className="grid"
        style={{ gridTemplateColumns: '130px 1fr 160px', borderBottom: '2px solid #0B1E3D' }}
      >
        <div className="flex items-center justify-center p-3 border-r" style={{ borderColor: '#C4CDD8' }}>
          <div className="flex flex-col items-center justify-center w-20 h-12 rounded border-2 border-[#0B1E3D]">
            <span className="font-condensed font-extrabold text-2xl leading-none text-[#0B1E3D]">AESA</span>
            <span className="text-[6px] text-[#0B1E3D] text-center leading-tight">INFRAESTRUCTURA Y MINERÍA</span>
          </div>
        </div>
        <div className="flex items-center justify-center p-3">
          <div className="text-center">
            <div className="font-condensed font-bold text-lg uppercase tracking-widest text-[#0B1E3D]">
              Reporte Diario de Perforación
            </div>
            <div className="font-condensed font-semibold text-sm tracking-widest text-[#2E7DC4] uppercase">
              {tipoLabel}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center border-l p-3" style={{ borderColor: '#C4CDD8' }}>
          <div className="w-8 h-8 rounded-full bg-[#E05B2B] flex items-center justify-center text-white font-bold text-lg">M</div>
          <div className="font-condensed font-bold text-base tracking-widest text-gray-700 mt-1">MARCOBRE</div>
        </div>
      </div>

      {/* Campos */}
      <div style={{ background: '#fff' }}>
        {/* Row: MINA + EMPRESA */}
        <div className="grid grid-cols-2 border-b" style={{ borderColor: '#C4CDD8' }}>
          <EL label="Mina">
            <select style={bare} value={cabecera.mina_id ?? ''} disabled>
              <option>Cargando...</option>
            </select>
          </EL>
          <EL label="Empresa">
            <input style={bare} value={cabecera.empresa ?? ''} onChange={e => onChange({ empresa: e.target.value })} />
          </EL>
        </div>

        {/* Row: FECHA + TURNO + OPERADOR */}
        <div className="grid grid-cols-3 border-b" style={{ borderColor: '#C4CDD8' }}>
          <EL label="Fecha">
            <input type="date" style={bare} value={cabecera.fecha ?? ''} onChange={e => onChange({ fecha: e.target.value })} />
          </EL>
          <EL label="Turno">
            <div className="flex gap-2">
              {(['DIA', 'NOCHE'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => onChange({ turno: t })}
                  className="px-3 py-1 rounded text-xs font-condensed font-bold uppercase tracking-wider transition-all"
                  style={cabecera.turno === t
                    ? t === 'DIA'
                      ? { background: '#FEF3C7', border: '1px solid #D97706', color: '#78350F' }
                      : { background: '#1E3A6E', border: '1px solid #3B82F6', color: '#93C5FD' }
                    : { background: '#F5F7FA', border: '1px solid #C4CDD8', color: '#5A6B80' }
                  }
                >
                  {t === 'DIA' ? '☀ Día' : '☾ Noche'}
                </button>
              ))}
            </div>
          </EL>
          <EL label="Operador">
            <input style={bare} placeholder="Nombre del operador" value={cabecera.nombre_operador ?? ''} onChange={e => onChange({ nombre_operador: e.target.value })} />
          </EL>
        </div>

        {/* Row: CODIGO EQUIPO + ZONA + AYUDANTE */}
        <div className="grid grid-cols-3">
          <EL label="Cód. Equipo">
            <select style={bare} value={cabecera.equipo_id ?? ''} onChange={e => onChange({ equipo_id: e.target.value })}>
              <option value="">— Seleccionar —</option>
              {equipos.map(eq => (
                <option key={eq.id} value={eq.id}>{eq.codigo}{eq.placa ? ` · ${eq.placa}` : ''}</option>
              ))}
            </select>
          </EL>
          <EL label="Zona">
            <input style={bare} placeholder="Nivel / Galería" value={cabecera.zona ?? ''} onChange={e => onChange({ zona: e.target.value })} />
          </EL>
          <EL label="Ayudante">
            <input style={bare} placeholder="Nombre del ayudante" value={cabecera.nombre_ayudante ?? ''} onChange={e => onChange({ nombre_ayudante: e.target.value })} />
          </EL>
        </div>
      </div>
    </div>
  )
}
