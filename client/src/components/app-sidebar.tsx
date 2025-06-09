'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar
} from '@/registry/new-york-v4/ui/sidebar';

import Logo from './Logo';
import { UserProfile } from './user-profile';
import { History, SquarePen } from 'lucide-react';
import { IoChevronDown, IoChevronForward } from 'react-icons/io5';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { state, setOpen } = useSidebar();
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        if (state === 'collapsed') {
            setShowHistory(false);
        }
    }, [state]);

    const handleRecentClick = () => {
        setOpen(true);
        setShowHistory((prev) => !prev);
    };

    // const toggleHistory = () => {
    //   setShowHistory((prev) => !prev);
    // };

    return (
        <Sidebar collapsible='icon' {...props}>
            <SidebarHeader>
                <Link href='/' className='mb-2'>
                    {state === 'expanded' ? <Logo /> : <Logo iconOnly />}
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu className='gap-4 px-2'>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            className='mt-2 cursor-pointer overflow-visible rounded-lg'
                            onClick={() => window.open('/task', '_self')}
                            title='Tasks'>
                            <div className='mx-1'>
                                <SquarePen size={20} />
                            </div>
                            <span className='text-md'>Tasks</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            className='mt-2 cursor-pointer overflow-visible rounded-lg'
                            onClick={() => window.open('/form', '_self')}
                            title='Tasks'>
                            <div className='mx-1'>
                                <SquarePen size={20} />
                            </div>
                            <span className='text-md'>Form</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            className='mt-2 cursor-pointer overflow-visible rounded-lg'
                            onClick={() => window.open('/files', '_self')}
                            title='Tasks'>
                            <div className='mx-1'>
                                <SquarePen size={20} />
                            </div>
                            <span className='text-md'>Storage</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            className='mt-2 cursor-pointer overflow-visible rounded-lg'
                            onClick={() => window.open('/task', '_self')}
                            title='Tasks'>
                            <div className='mx-1'>
                                <SquarePen size={20} />
                            </div>
                            <span className='text-md'>Tasks</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <UserProfile />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
