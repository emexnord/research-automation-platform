export const ROLE = {
    ADMIN: 'admin',
    USER: 'user'
} as const;

export type ROLE = (typeof ROLE)[keyof typeof ROLE];

export interface User {
    _id: string;
    name: string;
    username?: string;
    email: string;
    image?: string;
    role: ROLE;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}
