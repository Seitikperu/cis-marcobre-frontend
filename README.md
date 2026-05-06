# CIS Marcobre — Sistema de Reportes de Equipos

Plataforma centralizada de registro de reportes diarios de operación de equipos mineros para AESA / MARCOBRE.

## Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend / DB**: Supabase (Auth + PostgreSQL + RLS)
- **Hosting**: Vercel
- **Repo**: GitHub

## Proyectos soportados

- San Rafael · Mina Justa · Raura · Chungar · Cerro Lindo

## Flotas soportadas

| Flota | Ruta |
|---|---|
| Jumbo Frontonero | `/[proyecto]/reportes/jumbo` |
| Jumbo Empernador | `/[proyecto]/reportes/empernador` |
| Scooptram | `/[proyecto]/reportes/scooptram` |
| Desatador / Scaler | `/[proyecto]/reportes/desatador` |
| Volquete | `/[proyecto]/reportes/volquete` |

## Setup local

```bash
# 1. Clonar repositorio
git clone https://github.com/TU_ORG/cis-marcobre-frontend.git
cd cis-marcobre-frontend

# 2. Instalar dependencias
npm install

# 3. Variables de entorno
cp .env.example .env.local
# Editar .env.local con las keys de Supabase

# 4. Desarrollo
npm run dev
```

## Variables de entorno requeridas

```
NEXT_PUBLIC_SUPABASE_URL=https://omyihtkxczzvbsexonsk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
```

## Deploy en Vercel

1. Push al repo de GitHub
2. Importar proyecto en vercel.com
3. Agregar las variables de entorno en Settings → Environment Variables
4. Deploy automático en cada `git push main`

## Estructura de BD (Supabase)

- `minas` — Catálogo de proyectos/minas
- `tipos_equipo` — Flotas de equipos
- `equipos` — Equipos físicos por mina
- `codigos_actividad` — 44 códigos estandarizados (101–407)
- `zonas_labores` — Niveles y labores por mina
- `profiles` — Usuarios extendidos (rol: facilitador/supervisor/admin)
- `reportes_equipos` — Cabecera del reporte (una tabla para todos los equipos)
- `reporte_detalle_actividades` — 18 filas de actividades por reporte
- `kpi_bd_equipos` — Histórico KPI importado del Excel BD_53

## Roles

| Rol | Permisos |
|---|---|
| facilitador | Crear y editar sus propios reportes en estado borrador |
| supervisor | Ver y aprobar todos los reportes |
| admin | Gestionar catálogos (minas, equipos, códigos) |
