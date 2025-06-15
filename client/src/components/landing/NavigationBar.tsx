'use client';

import { useEffect, useRef, useState } from 'react';

import Link from 'next/link';

import { Button } from '@/registry/new-york-v4/ui/button';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from '@/registry/new-york-v4/ui/drawer';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import Logo from '../Logo';
import { Menu, X } from 'lucide-react';

export function Navbar() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('hero');
    const [underlineStyle, setUnderlineStyle] = useState({
        left: 0,
        width: 0,
        opacity: 0
    });

    const navRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    const navigationItems = [
        { href: 'hero', label: 'Home' },
        { href: 'about', label: 'About' },
        { href: 'pricing', label: 'Pricing' },
        { href: 'faq', label: 'FAQ' }
    ];

    // Update underline position when active link changes
    useEffect(() => {
        const currentLink = navRefs.current[activeLink];
        if (currentLink) {
            const rect = currentLink.getBoundingClientRect();
            const navbarRect = currentLink.parentElement?.getBoundingClientRect();

            if (navbarRect) {
                setUnderlineStyle({
                    left: rect.left - navbarRect.left,
                    width: (rect.width / 3) * 2, // Adjust width to 2/3 of the link width
                    opacity: 1
                });
            }
        }
    }, [activeLink]);

    const handleLinkClick = (href: string, e: React.MouseEvent) => {
        e.preventDefault();
        setActiveLink(href);

        const element = document.getElementById(href);

        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header className='bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 flex w-full justify-center border-b backdrop-blur'>
            <div className='flex h-16 w-full items-center justify-between px-4 md:px-12'>
                <Link href='/' className='flex justify-center'>
                    <Logo />
                </Link>

                {/* Desktop Navigation */}
                <nav className='relative hidden items-center gap-10 md:flex'>
                    {/* Sliding underline */}
                    <div
                        className='bg-primary absolute bottom-[-1px] h-[2px] transition-all duration-300 ease-in-out'
                        style={{
                            left: `${underlineStyle.left}px`,
                            width: `${underlineStyle.width}px`,
                            opacity: underlineStyle.opacity
                        }}
                    />

                    {navigationItems.map((item) => (
                        <button
                            key={item.href}
                            // href={item.href}
                            ref={(el) => {
                                navRefs.current[item.href] = el;
                            }}
                            className={`hover:text-primary py-1 text-sm font-medium transition-colors ${
                                activeLink === item.href ? 'text-primary' : ''
                            }`}
                            onClick={(e) => handleLinkClick(item.href, e)}>
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Desktop Get Started Button */}
                <div className='hidden md:flex'>
                    <Button asChild>
                        <Link href='/signup'>Get Started</Link>
                    </Button>
                </div>

                {/* Mobile Menu */}
                <div className='md:hidden'>
                    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction='left'>
                        <DrawerTrigger asChild>
                            <Button variant='outline' size='icon'>
                                <Menu className='h-4 w-4' />
                                <span className='sr-only'>Toggle menu</span>
                            </Button>
                        </DrawerTrigger>
                        <VisuallyHidden>
                            <DrawerHeader>
                                <DrawerTitle></DrawerTitle>
                                <DrawerDescription></DrawerDescription>
                            </DrawerHeader>
                        </VisuallyHidden>

                        <DrawerContent className='h-full w-[280px]'>
                            <div className='flex h-full flex-col'>
                                <div className='flex items-center justify-between border-b p-4'>
                                    <Link href='/' className='flex items-center' onClick={() => setIsDrawerOpen(false)}>
                                        <Logo />
                                    </Link>
                                    <Button variant='outline' size='icon' onClick={() => setIsDrawerOpen(false)}>
                                        <X className='h-4 w-4' />
                                        <span className='sr-only'>Close menu</span>
                                    </Button>
                                </div>

                                <nav className='flex flex-col gap-2 p-4'>
                                    {navigationItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`hover:text-primary hover:bg-accent rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                                activeLink === item.href ? 'text-primary bg-accent/50' : ''
                                            }`}
                                            onClick={(e) => handleLinkClick(item.href, e)}>
                                            {item.label}
                                        </Link>
                                    ))}
                                </nav>

                                <div className='mt-auto p-4'>
                                    <Button asChild className='w-full'>
                                        <Link href='/task' onClick={() => setIsDrawerOpen(false)}>
                                            Get Started
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </DrawerContent>
                    </Drawer>
                </div>
            </div>
        </header>
    );
}
