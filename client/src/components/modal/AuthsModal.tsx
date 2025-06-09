'use client';

import { Button } from '@/registry/new-york-v4/ui/button';

import { useDialog } from '../DialogProvider';
import SignIn from './SignIn';
import SignUp from './SignUp';

export default function AuthModal() {
    const { openDialog } = useDialog();

    const handleSignInClick = () => {
        openDialog({
            title: 'Sign in to your account',
            content: <SignIn />
        });
    };

    const handleSignUpClick = () => {
        openDialog({
            title: 'Create an account',
            content: <SignUp />
        });
    };

    return (
        <div className='flex w-36 flex-col gap-6 text-center'>
            <Button size='lg' className='cursor-pointer' onClick={handleSignInClick}>
                Sign In
            </Button>
            <Button size='lg' variant='outline' className='cursor-pointer' onClick={handleSignUpClick}>
                Sign Up
            </Button>
        </div>
    );
}
