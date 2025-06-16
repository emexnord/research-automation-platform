'use client';

import { Button } from '@/registry/new-york-v4/ui/button';

export default function AuthModal() {
    return (
        <div className='flex w-36 flex-col gap-6 text-center'>
            <Button size='lg' className='cursor-pointer' onClick={() => (window.location.href = '/signin')}>
                Sign In
            </Button>
            <Button
                size='lg'
                variant='outline'
                className='cursor-pointer'
                onClick={() => (window.location.href = '/signup')}>
                Sign Up
            </Button>
        </div>
    );
}
