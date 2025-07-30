// middleware.ts
//  import { authMiddleware } from "@clerk/nextjs/server";


//  export default authMiddleware();

//  export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/"],
//  };

// 




// middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    '/',            // your homepage
    '/game(.*)',    // protect all /game routes
    '/sign-in(.*)', // auth pages
    '/sign-up(.*)',
  ],
};









