import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { isSetupComplete } from "@/lib/setup"

export default auth(async (req) => {
  const isLoggedIn = !!req.auth
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
  const isSetupPage = req.nextUrl.pathname.startsWith('/setup')
  const isSetupApi = req.nextUrl.pathname.startsWith('/api/setup')
  
  // Allow setup API calls
  if (isSetupApi) {
    return NextResponse.next()
  }
  
  // Check if setup is needed
  const setupComplete = await isSetupComplete()
  
  if (!setupComplete && !isSetupPage) {
    return NextResponse.redirect(new URL('/setup', req.url))
  }
  
  // Redirect from setup page if already complete
  if (setupComplete && isSetupPage) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }
  
  // Don't apply auth checks to setup page
  if (isSetupPage) {
    return NextResponse.next()
  }
  
  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return NextResponse.next()
  }
  
  if (!isLoggedIn && !req.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
