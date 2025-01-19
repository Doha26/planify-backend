// // front/middleware.ts
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { auth } from './lib/auth';

// export default async function middleware(request: NextRequest) {
//   const session = await auth();
//   const isAuth = !!session;
//   const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
//   const isRootPage = request.nextUrl.pathname === '/';

//   // Handle root page redirect
//   if (isRootPage) {
//     if (isAuth) { 
//       return NextResponse.redirect(new URL('/dashboard', request.url));
//     }
//     return NextResponse.redirect(new URL('/auth/login', request.url));
//   }

//   // Handle auth pages access
//   if (isAuthPage) {
//     if (isAuth) {
//       return NextResponse.redirect(new URL('/dashboard', request.url));
//     }
//     return null;
//   }

//   // Handle protected pages access
//   if (!isAuth) {
//     const from = encodeURIComponent(request.nextUrl.pathname);
//     return NextResponse.redirect(
//       new URL(`/auth/login?from=${from}`, request.url)
//     );
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * - public folder
//      */
//     '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
//   ],
// };
