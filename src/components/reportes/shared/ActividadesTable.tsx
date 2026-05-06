'use client'
import { useCodigos } from '@/hooks/useCodigos'
import type { DetalleRow } from '@/hooks/useReporte'
import type { TipoEquipo } from '@/lib/types/database.types'

interface Props {
  detalle: DetalleRow[]
  tipo: TipoEquipo
  onChange: (item: number, updates: Partial<DetalleRow>) => void
}

const COD_COLOR: Record<string, string> = {
  ACTIVIDAD_OPERATIVA:  '#1A4B8C',
  DEMORA_OPERATIVA_1:   '#5B21B6',
  DEMORA_OPERATIVA_2:   '#92400E',
  DEMORA_MANTENIMIENTO: '#7F1D1D',
}
const CAT_LABEL: Record<string, string> = {
  ACTIVIDAD_OPERATIVA:  'Act. Operativa',
  DEMORA_OPERATIVA_1:   'Demora Op. 1',
  DEMORA_OPERATIVA_2:   'Demora Op. 2',
  DEMORA_MANTENIMIENTO: 'Mantenimiento',
}

// Columnas específicas por flota
const showCols = (tipo: TipoEquipo) => ({
  brazos:   ['JUMBO','EMPERNADOR','SHOCRETE-ROBOT'].includes(tipo),
  taladros: ['JUMBO','EMPERNADOR'].includes(tipo),
  viajes:   ['SCOOPTRAM','VOLQUETE'].includes(tipo),
})

const TH = ({ children, rowSpan = 1, colSpan = 1 }: { children: React.ReactNode; rowSpan?: number; colSpan?: number }) => (
  <th
    rowSpan={rowSpan}
    colSpan={colSpan}
    className="text-center py-2 px-1 text-[9px] font-semibold uppercase tracking-wider text-white whitespace-nowrap"
    style={{ background: '#0B1E3D', borderRight: '1px solid rgba(255,255,255,0.1)' }}
  >
    {children}
  </th>
)
const TH2 = ({ children }: { children: React.ReactNode }) => (
  <th
    className="text-center py-1 px-1 text-[8px] uppercase tracking-wider"
    style={{ background: '#162E5C', color: 'rgba(255,255,255,0.6)', borderRight: '1px solid rgba(255,255,255,0.06)' }}
  >
    {children}
  </th>
)

const InpN = ({
  value, onChange, w = 'w-14',
}: { value: number | null; onChange: (v: number | null) => void; w?: string }) => (
  <td className="border-r p-0" style={{ borderColor: '#D8E2EC' }}>
    <input
      type="number" step="0.1" min="0"
      value={value ?? ''}
      onChange={e => onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
      className={`${w} text-center text-[11px] py-1 border-none outline-none bg-transparent`}
      style={{ color: '#0F1C30' }}
    />
  </td>
)

export default function ActividadesTable({ detalle, tipo, onChange }: Props) {
  const { codigos, byCategoria } = useCodigos()
  const cols = showCols(tipo)

  return (
    <div className="rounded-xl overflow-hidden shadow-sm" style={{ border: '1px solid #C4CDD8' }}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth: '900px', fontSize: '11px' }}>
          <thead>
            <tr>
              <TH rowSpan={2}>Item</TH>
              <TH rowSpan={2}>Hora<br />Inicio</TH>
              <TH rowSpan={2}>Hora<br />Final</TH>
              <TH rowSpan={2}>Código Actividad</TH>
              {cols.brazos && <>
                <TH colSpan={2}>Brazo Izquierdo<br /><small style={{ fontWeight: 400 }}>Eléctrico</small></TH>
                <TH colSpan={2}>Brazo Derecho<br /><small style={{ fontWeight: 400 }}>Eléctrico</small></TH>
              </>}
              <TH rowSpan={2}>Nivel</TH>
              <TH rowSpan={2}>Labor</TH>
              <TH rowSpan={2}>Mat.<br />M/D</TH>
              {cols.taladros && <>
                <TH rowSpan={2}>Long. Perf.<br />(pies)</TH>
                <TH rowSpan={2}>N° Tal.<br />Perf.</TH>
                <TH rowSpan={2}>N° Tal.<br />Rimados</TH>
              </>}
              {cols.viajes && <>
                <TH rowSpan={2}>N° Viajes</TH>
                <TH rowSpan={2}>M³</TH>
              </>}
              <TH rowSpan={2}>Observaciones</TH>
            </tr>
            {cols.brazos && (
              <tr>
                <TH2>Inicial</TH2><TH2>Final</TH2>
                <TH2>Inicial</TH2><TH2>Final</TH2>
              </tr>
            )}
            {!cols.brazos && <tr></tr>}
          </thead>
          <tbody>
            {detalle.map((row, idx) => {
              const isEven = idx % 2 === 1
              const codObj = codigos.find(c => c.id === row.codigo_actividad_id)
              const catColor = codObj ? COD_COLOR[codObj.categoria] : '#6B7A92'

              return (
                <tr
                  key={row.item}
                  style={{ background: isEven ? '#F0F3F7' : '#fff', borderBottom: '1px solid #D8E2EC' }}
                >
                  {/* ITEM */}
                  <td className="text-center font-bold text-[11px] px-2 border-r w-8"
                    style={{ color: '#0B1E3D', borderColor: '#C4CDD8', background: '#E8EDF5' }}>
                    {row.item}
                  </td>

                  {/* HORAS */}
                  <td className="p-0 border-r" style={{ borderColor: '#D8E2EC' }}>
                    <input type="time" value={row.hora_inicio ?? ''} onChange={e => onChange(row.item, { hora_inicio: e.target.value || null })}
                      className="w-20 text-center text-[11px] py-1 border-none outline-none bg-transparent" />
                  </td>
                  <td className="p-0 border-r" style={{ borderColor: '#D8E2EC' }}>
                    <input type="time" value={row.hora_final ?? ''} onChange={e => onChange(row.item, { hora_final: e.target.value || null })}
                      className="w-20 text-center text-[11px] py-1 border-none outline-none bg-transparent" />
                  </td>

                  {/* CÓDIGO ACTIVIDAD */}
                  <td className="p-0 border-r" style={{ borderColor: '#D8E2EC', minWidth: '190px' }}>
                    <select
                      value={row.codigo_actividad_id ?? ''}
                      onChange={e => onChange(row.item, { codigo_actividad_id: e.target.value || null })}
                      className="w-full text-[11px] py-1 px-1 border-none outline-none bg-transparent"
                      style={{ color: catColor, fontWeight: row.codigo_actividad_id ? '600' : '400' }}
                    >
                      <option value="">— Seleccionar —</option>
                      {Object.entries(byCategoria).map(([cat, items]) => (
                        <optgroup key={cat} label={CAT_LABEL[cat]}>
                          {items.map(c => (
                            <option key={c.id} value={c.id}>{c.codigo} – {c.descripcion}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </td>

                  {/* BRAZOS */}
                  {cols.brazos && <>
                    <InpN value={row.brazo_izq_elec_inicial} onChange={v => onChange(row.item, { brazo_izq_elec_inicial: v })} />
                    <InpN value={row.brazo_izq_elec_final}   onChange={v => onChange(row.item, { brazo_izq_elec_final: v })} />
                    <InpN value={row.brazo_der_elec_inicial} onChange={v => onChange(row.item, { brazo_der_elec_inicial: v })} />
                    <InpN value={row.brazo_der_elec_final}   onChange={v => onChange(row.item, { brazo_der_elec_final: v })} />
                  </>}

                  {/* NIVEL */}
                  <td className="p-0 border-r" style={{ borderColor: '#D8E2EC' }}>
                    <input value={row.nivel ?? ''} onChange={e => onChange(row.item, { nivel: e.target.value || null })}
                      placeholder="—" className="w-16 text-[11px] text-center py-1 border-none outline-none bg-transparent" />
                  </td>

                  {/* LABOR */}
                  <td className="p-0 border-r" style={{ borderColor: '#D8E2EC' }}>
                    <input value={row.labor_descripcion ?? ''} onChange={e => onChange(row.item, { labor_descripcion: e.target.value || null })}
                      placeholder="Labor" className="w-full min-w-24 text-[11px] py-1 px-1 border-none outline-none bg-transparent" />
                  </td>

                  {/* MATERIAL M/D */}
                  <td className="border-r" style={{ borderColor: '#D8E2EC' }}>
                    <div className="flex">
                      {(['M','D'] as const).map(m => (
                        <button key={m} type="button"
                          onClick={() => onChange(row.item, { material: row.material === m ? null : m })}
                          className="flex-1 text-[11px] font-bold py-1 border-none transition-all"
                          style={row.material === m
                            ? { background: m === 'M' ? '#DCFCE7' : '#FEF9C3', color: m === 'M' ? '#15803D' : '#92400E' }
                            : { background: 'transparent', color: '#9CA8B8' }
                          }
                        >{m}</button>
                      ))}
                    </div>
                  </td>

                  {/* TALADROS */}
                  {cols.taladros && <>
                    <InpN value={row.long_perf_pies}    onChange={v => onChange(row.item, { long_perf_pies: v })} />
                    <InpN value={row.n_tal_perforados}  onChange={v => onChange(row.item, { n_tal_perforados: v ? Math.round(v) : null })} />
                    <InpN value={row.n_tal_rimados}     onChange={v => onChange(row.item, { n_tal_rimados: v ? Math.round(v) : null })} />
                  </>}

                  {/* VIAJES */}
                  {cols.viajes && <>
                    <InpN value={row.n_viajes}      onChange={v => onChange(row.item, { n_viajes: v ? Math.round(v) : null })} />
                    <InpN value={row.m3_acarreados} onChange={v => onChange(row.item, { m3_acarreados: v })} />
                  </>}

                  {/* OBSERVACIONES */}
                  <td className="p-0">
                    <input value={row.observaciones ?? ''} onChange={e => onChange(row.item, { observaciones: e.target.value || null })}
                      placeholder="—" className="w-full min-w-20 text-[11px] py-1 px-1 border-none outline-none bg-transparent" />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
