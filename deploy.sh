#!/bin/bash
# =============================================================
# DEPLOY SCRIPT — CIS MARCOBRE FRONTEND
# Fase 1: GitHub + Vercel
# =============================================================
# Ejecutar desde la carpeta raíz del proyecto (cis-marcobre/)
# =============================================================

echo "======================================================="
echo "  CIS MARCOBRE — Deploy Fase 1"
echo "======================================================="
echo ""

# PASO 1: Verificar que el build está limpio
echo "▶ PASO 1: Verificando build..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ El build falló. Revisar errores antes de continuar."
  exit 1
fi
echo "✅ Build exitoso"
echo ""

# PASO 2: GitHub — crear y subir el repo
echo "▶ PASO 2: Subiendo a GitHub..."
echo ""
echo "  Ejecutar estos comandos en tu terminal:"
echo ""
echo "  git remote add origin https://github.com/Seitikperu/cis-marcobre-frontend.git"
echo "  git push -u origin main"
echo ""
echo "  O con SSH:"
echo "  git remote add origin git@github.com:Seitikperu/cis-marcobre-frontend.git"
echo "  git push -u origin main"
echo ""

# PASO 3: Variables de entorno
echo "▶ PASO 3: Variables de entorno para Vercel"
echo ""
echo "  Agregar en vercel.com → Settings → Environment Variables:"
echo ""
echo "  NEXT_PUBLIC_SUPABASE_URL"
echo "  = https://omyihtkxczzvbsexonsk.supabase.co"
echo ""
echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "  = (copiar desde Supabase → Settings → API → anon key)"
echo ""

# PASO 4: Supabase Auth redirect URLs
echo "▶ PASO 4: Configurar Supabase Auth"
echo ""
echo "  En supabase.com → Authentication → URL Configuration:"
echo ""
echo "  Site URL:"
echo "  https://cis-marcobre-frontend.vercel.app"
echo ""
echo "  Redirect URLs (agregar las dos):"
echo "  https://cis-marcobre-frontend.vercel.app/**"
echo "  http://localhost:3000/**"
echo ""

echo "======================================================="
echo "  ✅ Instrucciones completadas"
echo "======================================================="
