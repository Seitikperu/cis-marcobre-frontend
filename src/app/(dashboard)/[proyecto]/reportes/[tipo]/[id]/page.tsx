/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ReporteForm from '@/components/reportes/ReporteForm'
import type { TipoEquipo } from '@/lib/types/database.types'

const TIPO_LABEL: Record<string, string> = {
  JUMBO: 'Jumbo Frontonero', EMPERNADOR: 'Jumbo Empernador',
  SCOOPTRAM: 'Scooptram', DESATADOR: 'Desatador / Scaler', VOLQUETE: 'Volquete',
}
function unslugify(s: string) { return s.replace(/-/g, ' ').toUpperCase() }

export default async function EditReportePage({ params }: { params: { proyecto: string; tipo: string; id: string } }) {
  const sb = createClient() as any

  const { data: reporte } = await sb.from('reportes_equipos').select('*').eq('id', params.id).maybeSingle()
  if (!reporte) notFound()

  const nombreMina = unslugify(params.proyecto)
  const { data: mina } = await sb.from('minas').select('id').ilike('nombre', nombreMina).maybeSingle()
  const { data: tipoRow } = await sb.from('tipos_equipo').select('id').eq('nombre', reporte.tipo_reporte).maybeSingle()
  const { data: equipos } = await sb.from('equipos').select('*').eq('mina_id', mina?.id ?? '').eq('tipo_equipo_id', tipoRow?.id ?? '').eq('activo', true).order('codigo')

  return (
    <ReporteForm
      minaId={reporte.mina_id}
      proyecto={params.proyecto}
      tipo={reporte.tipo_reporte as TipoEquipo}
      tipoLabel={TIPO_LABEL[reporte.tipo_reporte] ?? reporte.tipo_reporte}
      equipos={equipos ?? []}
      reporteId={params.id}
    />
  )
}
