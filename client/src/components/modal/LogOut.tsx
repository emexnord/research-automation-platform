'use client';

import { useState } from 'react';

import { Button } from '@/registry/new-york-v4/ui/button';

import { useDialog } from '../DialogProvider';
import { signOut } from 'next-auth/react';

export default function LogoutModal({ email }: { email: string }) {
    const { closeDialog } = useDialog();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await signOut({ redirect: false });
            window.location.href = '/task';
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log('Failed to Logout:', error.message);
            } else {
                console.log('Failed to Logout:', error);
            }
        } finally {
            setIsLoading(false);
            closeDialog();
        }
    };

    return (
        <div className='flex flex-col gap-6 p-4 text-center'>
            <h2 className='mb-2 text-xl font-semibold'>Are you sure you want to log out?</h2>
            <p className='mb-6 text-lg'>
                Log out of reasearch collab as <span className='font-medium'>{email}</span>?
            </p>
            <div className='flex justify-center gap-3'>
                <Button size='lg' className='cursor-pointer' onClick={handleLogout} disabled={isLoading}>
                    Log out
                </Button>
                <Button size='lg' variant='outline' className='cursor-pointer' onClick={() => closeDialog()}>
                    Cancel
                </Button>
            </div>
        </div>
    );
}
