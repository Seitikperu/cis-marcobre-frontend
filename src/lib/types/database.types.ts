// Tipos generados manualmente desde el schema de Supabase
// Para regenerar: npx supabase gen types typescript --project-id omyihtkxczzvbsexonsk

export type TurnoTipo = 'DIA' | 'NOCHE'
export type RolUsuario = 'facilitador' | 'supervisor' | 'admin'
export type EstadoReporte = 'borrador' | 'enviado' | 'aprobado' | 'rechazado'
export type TipoMaterial = 'M' | 'D'
export type CategoriaCode =
  | 'ACTIVIDAD_OPERATIVA'
  | 'DEMORA_OPERATIVA_1'
  | 'DEMORA_OPERATIVA_2'
  | 'DEMORA_MANTENIMIENTO'

export type TipoEquipo =
  | 'JUMBO'
  | 'EMPERNADOR'
  | 'SCOOPTRAM'
  | 'DESATADOR'
  | 'VOLQUETE'
  | 'SHOCRETE-ROBOT'

export interface Mina {
  id: string
  nombre: string
  descripcion: string | null
  ubicacion: string | null
  activo: boolean
  created_at: string
}

export interface TipoEquipoRow {
  id: string
  nombre: string
  descripcion: string | null
  activo: boolean
}

export interface Equipo {
  id: string
  mina_id: string
  tipo_equipo_id: string
  codigo: string
  placa: string | null
  marca: string | null
  modelo: string | null
  activo: boolean
}

export interface CodigoActividad {
  id: string
  codigo: number
  descripcion: string
  categoria: CategoriaCode
  activo: boolean
}

export interface ZonaLabor {
  id: string
  mina_id: string
  nombre: string
  nivel: string | null
  activo: boolean
}

export interface Profile {
  id: string
  user_id: string
  nombre: string
  apellido: string
  cargo: string | null
  empresa: string | null
  rol: RolUsuario
  activo: boolean
}

export interface ReporteEquipo {
  id: string
  tipo_reporte: TipoEquipo
  mina_id: string
  equipo_id: string | null
  fecha: string
  turno: TurnoTipo
  zona: string | null
  empresa: string | null
  // Horómetros
  horometro_inicial: number | null
  horometro_final: number | null
  km_inicial: number | null
  km_final: number | null
  // Brazos percusión
  percusion_bi_inicial: number | null
  percusion_bi_final: number | null
  percusion_bd_inicial: number | null
  percusion_bd_final: number | null
  // Brazos eléctrico
  electrico_bi_inicial: number | null
  electrico_bi_final: number | null
  electrico_bd_inicial: number | null
  electrico_bd_final: number | null
  // Perforación
  diametro_broca_mm: number | null
  // Firmas
  nombre_operador: string | null
  nombre_ayudante: string | null
  nombre_jefe_guardia_aesa: string | null
  nombre_jefe_guardia_cliente: string | null
  nombre_jefe_superintendente: string | null
  // Control
  observaciones_finales: string | null
  estado: EstadoReporte
  creado_por: string | null
  aprobado_por: string | null
  aprobado_at: string | null
  created_at: string
  updated_at: string
}

export interface ReporteDetalleActividad {
  id: string
  reporte_id: string
  item: number
  hora_inicio: string | null
  hora_final: string | null
  codigo_actividad_id: string | null
  brazo_izq_elec_inicial: number | null
  brazo_izq_elec_final: number | null
  brazo_der_elec_inicial: number | null
  brazo_der_elec_final: number | null
  nivel: string | null
  labor_id: string | null
  labor_descripcion: string | null
  material: TipoMaterial | null
  long_perf_pies: number | null
  n_tal_perforados: number | null
  n_tal_rimados: number | null
  n_viajes: number | null
  m3_acarreados: number | null
  observaciones: string | null
}

// Tipo de la base de datos completo para el cliente Supabase
export interface Database {
  public: {
    Tables: {
      minas: { Row: Mina; Insert: Omit<Mina,'id'|'created_at'>; Update: Partial<Mina> }
      tipos_equipo: { Row: TipoEquipoRow; Insert: Omit<TipoEquipoRow,'id'>; Update: Partial<TipoEquipoRow> }
      equipos: { Row: Equipo; Insert: Omit<Equipo,'id'>; Update: Partial<Equipo> }
      codigos_actividad: { Row: CodigoActividad; Insert: Omit<CodigoActividad,'id'>; Update: Partial<CodigoActividad> }
      zonas_labores: { Row: ZonaLabor; Insert: Omit<ZonaLabor,'id'>; Update: Partial<ZonaLabor> }
      profiles: { Row: Profile; Insert: Omit<Profile,'id'>; Update: Partial<Profile> }
      reportes_equipos: { Row: ReporteEquipo; Insert: Omit<ReporteEquipo,'id'|'created_at'|'updated_at'>; Update: Partial<ReporteEquipo> }
      reporte_detalle_actividades: { Row: ReporteDetalleActividad; Insert: Omit<ReporteDetalleActividad,'id'>; Update: Partial<ReporteDetalleActividad> }
    }
  }
}
