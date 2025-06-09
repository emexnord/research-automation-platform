'use client';
import Logo from '@/components/Logo';
import { AppSidebar } from '@/components/app-sidebar';
import { Button } from '@/registry/new-york-v4/ui/button';
import { SidebarProvider, SidebarTrigger } from '@/registry/new-york-v4/ui/sidebar';
import { usePathname } from 'next/navigation';
import { AlignJustify, Bell, Search, Settings } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const getHeading = () => {
        const path = pathname.split('/')[1];
        if (!path) return 'Tasks';
        return path.charAt(0).toUpperCase() + path.slice(1);
    };

    return (
        <SidebarProvider className='font-roboto'>
            <AppSidebar />
            <main className='flex w-full flex-col md:h-screen'>
                <div className='sticky top-0 z-10 mb-6 border-b bg-white shadow-sm'>
                    <div className='flex h-16 items-center justify-between px-4'>
                        <div className='flex items-center'>
                            <SidebarTrigger className='-ml-1'>
                                <AlignJustify />
                            </SidebarTrigger>
                            <h2 className='ml-2 text-lg font-semibold text-gray-900 capitalize'>{getHeading()}</h2>
                        </div>

                        <div className='flex items-center space-x-4'>
                            <Button variant='ghost' size='sm'>
                                <Search className='h-4 w-4' />
                            </Button>
                            <Button variant='ghost' size='sm'>
                                <Bell className='h-4 w-4' />
                            </Button>
                            <Button variant='ghost' size='sm'>
                                <Settings className='h-4 w-4' />
                            </Button>
                        </div>
                    </div>
                </div>
                {children}
            </main>
        </SidebarProvider>
    );
}
