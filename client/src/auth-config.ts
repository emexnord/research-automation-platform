import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/signin'
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/task');
            if (isOnDashboard) {
                if (isLoggedIn) return true;

                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/task', nextUrl));
            }

            return true;
        }
    },
    providers: [] // Add providers with an empty array for now
} satisfies NextAuthConfig;
