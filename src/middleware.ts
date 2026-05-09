import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
          // Primero setear en request
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          // Recrear response con cookies actualizadas
          response = NextResponse.next({ request: { headers: request.headers } })
          // Setear en response para que el browser las reciba
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // CRÍTICO: getUser() verifica la sesión con el servidor de Supabase
  // NO usar getSession() — solo lee la cookie local sin verificar
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Rutas que no necesitan autenticación
  const isPublic = pathname.startsWith('/login') ||
                   pathname.startsWith('/api/') ||
                   pathname.startsWith('/_next') ||
                   pathname === '/favicon.ico'

  // Sin sesión → login
  if (!user && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Con sesión en /login → proyectos
  if (user && pathname === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/proyectos'
    return NextResponse.redirect(url)
  }

  // Redirigir raíz → proyectos si autenticado
  if (user && pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/proyectos'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
