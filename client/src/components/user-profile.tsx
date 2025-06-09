'use client';

import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york-v4/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/registry/new-york-v4/ui/dropdown-menu';
// import { AccountSettingsDialog } from "../account-settings-dialog";
// import { BillingInfoDialog } from "../billing-info-dialog";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/registry/new-york-v4/ui/sidebar';
import { createNameFromEmail, firstTwoLetters } from '@/utils/string-operations';

import { useDialog } from './DialogProvider';
import LogoutModal from './modal/LogOut';
import SignIn from './modal/SignIn';
import SignUp from './modal/SignUp';
import { BadgeCheck, ChevronsUpDown, CreditCard, LogOut, Sparkles } from 'lucide-react';
import { useSession } from 'next-auth/react';

export function UserProfile() {
    const { data: session } = useSession();

    const { isMobile } = useSidebar();
    const { openDialog } = useDialog();
    const [isOpen, setIsOpen] = useState(false);

    // const handleAccountSettingsClick = () => {
    //   setIsOpen(false);
    //   openDialog({
    //     title: "Account Settings",
    //     description: "Manage your account settings and preferences.",
    //     content: <AccountSettingsDialog />,
    //   });
    // };

    // const handleBillingInfoClick = () => {
    //   setIsOpen(false);
    //   openDialog({
    //     title: "Billing Information",
    //     description: "Manage your billing information and preferences.",
    //     content: <BillingInfoDialog />,
    //   });
    // };

    const handleLogoutClick = () => {
        if (!session?.user.email) return;
        setIsOpen(false);

        openDialog({
            content: <LogoutModal email={session?.user.email} />
        });
    };

    const handleSignInClick = () => {
        setIsOpen(false);
        openDialog({
            title: 'Sign in to your account',
            content: <SignIn />
        });
    };

    const handleSignUpClick = () => {
        setIsOpen(false);
        openDialog({
            title: 'Create an account',
            content: <SignUp />
        });
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size='lg'
                            className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'>
                            <Avatar className='h-8 w-8 rounded-lg'>
                                {session?.user.image ? (
                                    <AvatarImage src={session.user.image} alt='avatar' />
                                ) : (
                                    <AvatarFallback className='rounded-lg'>
                                        {session ? firstTwoLetters(session.user.email) : 'U'}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <div className='grid flex-1 text-left text-sm leading-tight'>
                                <span className='truncate font-medium'>
                                    {session?.user.name ?? createNameFromEmail(session?.user.email || '')}
                                </span>
                                {session && <span className='truncate text-xs'>{session.user.email}</span>}
                            </div>
                            <ChevronsUpDown className='ml-auto size-4' />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    {session?.user ? (
                        <DropdownMenuContent
                            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
                            side={isMobile ? 'bottom' : 'right'}
                            align='end'
                            sideOffset={4}>
                            <DropdownMenuLabel className='p-0 font-normal'>
                                <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                                    <Avatar className='h-8 w-8 rounded-lg'>
                                        <AvatarImage src={session.user.image} alt={session.user.name || 'User'} />
                                        <AvatarFallback className='rounded-lg'>
                                            {session.user.email ? session.user.email.slice(0, 2).toUpperCase() : 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className='grid flex-1 text-left text-sm leading-tight'>
                                        <span className='truncate font-medium'>
                                            {session.user.name ?? createNameFromEmail(session.user.email)}
                                        </span>
                                        <span className='truncate text-xs'>{session.user.email}</span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => (window.location.hash = '#pricing')}>
                                    <Sparkles />
                                    Upgrade to Pro
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <BadgeCheck />
                                    Account
                                    {/* <AccountSettingsDialog /> */}
                                </DropdownMenuItem>
                                {/* <DropdownMenuItem>
                  <Settings />
                  Settings
                </DropdownMenuItem> */}
                                <DropdownMenuItem>
                                    <CreditCard />
                                    Billing
                                    {/* <BillingInfoDialog /> */}
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogoutClick} className='cursor-pointer'>
                                <LogOut />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    ) : (
                        <DropdownMenuContent
                            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-sm p-2'
                            side={isMobile ? 'bottom' : 'right'}
                            align='end'
                            sideOffset={4}>
                            <DropdownMenuItem
                                onClick={handleSignUpClick}
                                className='bg-background focus:bg-accent focus:text-accent-foreground mt-2 mb-3 h-10 cursor-pointer justify-center rounded-md border px-6 py-2 shadow-xs'>
                                Sign Up
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={handleSignInClick}
                                className='bg-primary focus:bg-primary/90 text-primary-foreground focus:text-primary-foreground my-2 h-10 cursor-pointer justify-center rounded-md px-6 py-2 shadow-xs'>
                                Sign In
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    )}
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
