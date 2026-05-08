import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data, error } = await supabase.auth.getUser()
  const user = data?.user
  
  console.log('--- MIDDLEWARE DEBUG ---')
  console.log('Pathname:', request.nextUrl.pathname)
  console.log('Cookies present:', request.cookies.getAll().map(c => c.name))
  console.log('User ID:', user?.id || 'NO USER')
  console.log('Auth Error:', error?.message || 'NONE')
  console.log('------------------------')

  const { pathname } = request.nextUrl

  // Rutas públicas que no necesitan auth
  const publicPaths = ['/login', '/api/debug', '/_next', '/favicon']
  const isPublic = publicPaths.some(p => pathname.startsWith(p))

  // Si no tiene sesión y trata de acceder a ruta protegida → login
  if (!user && !isPublic) {
    console.log('Redirecting to /login because no user')
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Si tiene sesión y va a /login → proyectos
  if (user && pathname === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/proyectos'
    return NextResponse.redirect(url)
  }

  // CRÍTICO: devolver siempre supabaseResponse para que las cookies se propaguen
  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
