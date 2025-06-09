import type { ReactNode } from 'react';

import type { Metadata } from 'next';
import localFont from 'next/font/local';

import '@/app/globals.css';
import { DialogProvider } from '@/components/DialogProvider';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';

const dmSans = localFont({
    src: './fonts/DMSans-VariableFont_opsz,wght.ttf',
    variable: '--font-dm-sans',
    weight: '100 900'
});

const roboto = localFont({
    src: './fonts/Roboto-VariableFont_wdth,wght.ttf',
    variable: '--font-roboto',
    weight: '100 900'
});

export const metadata: Metadata = {
    title: 'Reasearch Collaboration Platform',
    description: 'Description of the Reasearch Collaboration Platform'
};

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        // ? https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
        // ? https://react.dev/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors
        <html suppressHydrationWarning lang='en'>
            <body
                className={`${dmSans.variable} ${roboto.variable} bg-background text-foreground overscroll-none antialiased`}>
                {/* <ThemeProvider attribute="class"> */}
                <SessionProvider>
                    <DialogProvider>
                        {children}

                        <Toaster />
                    </DialogProvider>
                </SessionProvider>

                {/* </ThemeProvider> */}
            </body>
        </html>
    );
};

export default Layout;
