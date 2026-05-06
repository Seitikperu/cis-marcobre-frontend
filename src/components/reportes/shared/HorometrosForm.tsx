'use client'
import type { ReporteEquipo, TipoEquipo } from '@/lib/types/database.types'

interface Props {
  cabecera: Partial<ReporteEquipo>
  tipo: TipoEquipo
  onChange: (updates: Partial<ReporteEquipo>) => void
}

const HCell = ({ children }: { children: React.ReactNode }) => (
  <div
    className="text-center py-1.5 text-[9px] font-semibold uppercase tracking-wider text-white"
    style={{ background: '#0B1E3D', borderRight: '1px solid rgba(255,255,255,0.1)' }}
  >
    {children}
  </div>
)

const SubH = ({ label }: { label: string }) => (
  <div
    className="text-center py-1 text-[8px] uppercase tracking-wider"
    style={{ background: '#162E5C', color: 'rgba(255,255,255,0.6)', borderRight: '1px solid rgba(255,255,255,0.06)' }}
  >
    {label}
  </div>
)

const ValCell = ({
  id, value, onChange, optional = false,
}: { id: keyof ReporteEquipo; value: number | null; onChange: (v: number | null) => void; optional?: boolean }) => (
  <div className="border-r" style={{ borderColor: '#C4CDD8' }}>
    <input
      type="number"
      step="0.1"
      min="0"
      value={value ?? ''}
      placeholder={optional ? '—' : '0.0'}
      onChange={e => onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
      className="w-full text-center text-xs py-1.5 border-none outline-none"
      style={{ background: optional ? '#FAFBFD' : '#fff', color: optional ? '#9CA8B8' : '#0F1C30' }}
    />
  </div>
)

// Qué columnas mostrar según tipo de equipo
const COLS_BY_TIPO: Record<TipoEquipo, string[]> = {
  JUMBO:        ['diesel','perc_bi','perc_bd','elec_bi','elec_bd'],
  EMPERNADOR:   ['diesel','perc_bi','perc_bd','elec_bi','elec_bd'],
  SCOOPTRAM:    ['diesel'],
  DESATADOR:    ['diesel'],
  VOLQUETE:     ['diesel'],
  'SHOCRETE-ROBOT': ['diesel','elec_bi'],
}

export default function HorometrosForm({ cabecera, tipo, onChange }: Props) {
  const cols = COLS_BY_TIPO[tipo] ?? ['diesel']
  const show = (c: string) => cols.includes(c)
  const colCount = 1 + cols.length  // label + cols activos (cada col tiene 2 sub-cols)

  type Num = number | null
  const upd = (k: keyof ReporteEquipo) => (v: Num) => onChange({ [k]: v })

  return (
    <div className="rounded-xl overflow-hidden shadow-sm" style={{ border: '1px solid #C4CDD8' }}>
      {/* Headers principales */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: `120px ${cols.map(() => '1fr 1fr').join(' ')}`,
        }}
      >
        <HCell>Horómetros</HCell>
        <HCell>Motor Diesel</HCell>
        {show('perc_bi') && <><HCell>Perc. Brazo Izq.</HCell><HCell>Perc. Brazo Der.</HCell></>}
        {show('elec_bi') && <><HCell>Eléc. Brazo Izq.</HCell>{show('elec_bd') && <HCell>Eléc. Brazo Der.</HCell>}</>}
      </div>

      {/* Sub-headers */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: `120px ${cols.map(() => '1fr 1fr').join(' ')}`,
          borderBottom: '1px solid #C4CDD8',
        }}
      >
        <SubH label="" />
        <SubH label="Inicial" /><SubH label="Final" />
        {show('perc_bi') && <><SubH label="Inicial" /><SubH label="Final" /><SubH label="Inicial" /><SubH label="Final" /></>}
        {show('elec_bi') && <><SubH label="Inicial" /><SubH label="Final" />{show('elec_bd') && <><SubH label="Inicial" /><SubH label="Final" /></>}</>}
      </div>

      {/* Valores */}
      <div
        className="grid items-center"
        style={{
          gridTemplateColumns: `120px ${cols.map(() => '1fr 1fr').join(' ')}`,
          background: '#fff',
        }}
      >
        <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-[#5A6B80] border-r" style={{ borderColor: '#C4CDD8' }}>
          Valores
        </div>
        <ValCell id="horometro_inicial" value={cabecera.horometro_inicial ?? null} onChange={upd('horometro_inicial')} />
        <ValCell id="horometro_final"   value={cabecera.horometro_final ?? null}   onChange={upd('horometro_final')} />

        {show('perc_bi') && <>
          <ValCell id="percusion_bi_inicial" value={cabecera.percusion_bi_inicial ?? null} onChange={upd('percusion_bi_inicial')} />
          <ValCell id="percusion_bi_final"   value={cabecera.percusion_bi_final   ?? null} onChange={upd('percusion_bi_final')} />
          <ValCell id="percusion_bd_inicial" value={cabecera.percusion_bd_inicial ?? null} onChange={upd('percusion_bd_inicial')} optional />
          <ValCell id="percusion_bd_final"   value={cabecera.percusion_bd_final   ?? null} onChange={upd('percusion_bd_final')} optional />
        </>}
        {show('elec_bi') && <>
          <ValCell id="electrico_bi_inicial" value={cabecera.electrico_bi_inicial ?? null} onChange={upd('electrico_bi_inicial')} />
          <ValCell id="electrico_bi_final"   value={cabecera.electrico_bi_final   ?? null} onChange={upd('electrico_bi_final')} />
          {show('elec_bd') && <>
            <ValCell id="electrico_bd_inicial" value={cabecera.electrico_bd_inicial ?? null} onChange={upd('electrico_bd_inicial')} optional />
            <ValCell id="electrico_bd_final"   value={cabecera.electrico_bd_final   ?? null} onChange={upd('electrico_bd_final')} optional />
          </>}
        </>}
      </div>

      {/* Diámetro broca (solo Jumbo/Empernador) */}
      {(tipo === 'JUMBO' || tipo === 'EMPERNADOR') && (
        <div
          className="flex items-center gap-4 px-4 py-2 border-t"
          style={{ borderColor: '#C4CDD8', background: '#F5F7FA' }}
        >
          <span
            className="text-[9px] font-semibold uppercase tracking-widest px-3 py-1 text-white rounded"
            style={{ background: '#0B1E3D' }}
          >
            Diámetro Broca Perforación
          </span>
          <input
            type="number"
            step="0.5"
            min="20"
            max="200"
            placeholder="45"
            value={cabecera.diametro_broca_mm ?? ''}
            onChange={e => onChange({ diametro_broca_mm: e.target.value === '' ? null : parseFloat(e.target.value) })}
            className="w-20 text-center text-xs border rounded py-1 px-2"
            style={{ borderColor: '#C4CDD8' }}
          />
          <span className="text-xs" style={{ color: '#5A6B80' }}>mm</span>
        </div>
      )}
    </div>
  )
}
