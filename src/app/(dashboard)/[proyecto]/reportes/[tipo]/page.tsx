/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ReporteForm from '@/components/reportes/ReporteForm'
import type { TipoEquipo } from '@/lib/types/database.types'

const TIPO_CONFIG: Record<string, { tipo: TipoEquipo; label: string }> = {
  'jumbo':       { tipo: 'JUMBO',        label: 'Jumbo Frontonero' },
  'empernador':  { tipo: 'EMPERNADOR',   label: 'Jumbo Empernador' },
  'scooptram':   { tipo: 'SCOOPTRAM',    label: 'Scooptram' },
  'desatador':   { tipo: 'DESATADOR',    label: 'Desatador / Scaler' },
  'volquete':    { tipo: 'VOLQUETE',     label: 'Volquete' },
}

function unslugify(s: string) { return s.replace(/-/g, ' ').toUpperCase() }

export default async function NuevoReporteTipoPage({ params }: { params: { proyecto: string; tipo: string } }) {
  const config = TIPO_CONFIG[params.tipo]
  if (!config) notFound()

  const sb = createClient() as any
  const nombreMina = unslugify(params.proyecto)

  const { data: mina } = await sb.from('minas').select('id').ilike('nombre', nombreMina).maybeSingle()
  if (!mina) notFound()

  const { data: tipoRow } = await sb.from('tipos_equipo').select('id').eq('nombre', config.tipo).maybeSingle()
  const { data: equipos } = await sb.from('equipos').select('*')
    .eq('mina_id', mina.id)
    .eq('tipo_equipo_id', tipoRow?.id ?? '')
    .eq('activo', true)
    .order('codigo')

  return (
    <ReporteForm
      minaId={mina.id}
      proyecto={params.proyecto}
      tipo={config.tipo}
      tipoLabel={config.label}
      equipos={equipos ?? []}
    />
  )
}
