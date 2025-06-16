// src/pages/api/auth/[...nextauth].ts
import { InvalidCredentialsError, UserNotVerifiedError } from './errors';
import { ROLE, User } from './types/user';
import NextAuth, { type Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

const authOptions = {
    session: {
        strategy: 'jwt' as const,
        maxAge: 30 * 24 * 60 * 60 // 30 days
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials.password) {
                    return null;
                }
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: credentials.email,
                        password: credentials.password
                    })
                });
                const data = await response.json();
                console.log('data', data);

                if (!response.ok) {
                    const message = data?.message || 'Login failed. Please try again.';
                    console.log('message', message);
                    console.log('Response status:', response.status);

                    if (response.status === 403) {
                        throw new UserNotVerifiedError(message);
                    }

                    throw new InvalidCredentialsError(message);
                }

                return data;
            }
        })
    ],
    callbacks: {
        // @ts-expect-error: user type may not match expected type, but merging is intentional
        async jwt({ token, user }) {
            if (user) {
                return { ...token, ...user };
            }

            return token;
        },

        // Expose them in the client-side session
        async session({ session, token }: { session: Session; token: JWT }) {
            if (token.user)
                session.user = {
                    ...token.user,
                    role: (token.user.role as ROLE) || ROLE.USER
                } as User;

            if (token.accessToken) session.accessToken = token.accessToken;
            if (token.iat) session.iat = token.iat;
            if (token.exp) session.exp = token.exp;
            if (token.jti) session.jti = token.jti;

            return session;
        }
    }
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
