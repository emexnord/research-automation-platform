'use client';

import { useState } from 'react';

import { Button } from '@/registry/new-york-v4/ui/button';
import { Input } from '@/registry/new-york-v4/ui/input';

import { useDialog } from '../DialogProvider';
import SignUp from './SignUp';
import VerifyEmail from './verify-email';
import { Eye, EyeOff } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';

export default function SignInModal() {
    const { openDialog, closeDialog } = useDialog();

    const [handle, setHandle] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleVerifyEmail = () => {
        openDialog({
            title: 'Verify your email',
            content: <VerifyEmail />
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const res = await signIn('credentials', {
            redirect: false,
            handle,
            password
        });

        if (res?.error) {
            if (res.code === '403') {
                closeDialog();
                toast('Email not verified', {
                    description: <h1 className='text-foreground'>Please verify your email to continue.</h1>,
                    action: {
                        label: 'Verify',
                        onClick: handleVerifyEmail
                    }
                });
            } else {
                setError('Invalid credentials. Please try again.');
            }
        } else {
            closeDialog();
            toast.success('Welcome back!');
        }
        setLoading(false);
    };

    const handleSignUpClick = () => {
        openDialog({
            title: 'Create an account',
            content: <SignUp />
        });
    };

    return (
        <form onSubmit={handleSubmit} className='p-4'>
            <div className='flex flex-col gap-6'>
                <p className='text-muted-foreground text-sm'>Enter your email to continue.</p>
                <div className='grid gap-2'>
                    {/* <Label htmlFor="email">Email</Label> */}
                    <Input
                        id='handle'
                        type='text'
                        placeholder='Email or Username'
                        required
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                    />
                </div>
                <div className='relative'>
                    <Input
                        id='password'
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Password'
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='pr-10'
                    />
                    <button
                        type='button'
                        onClick={() => setShowPassword((prev) => !prev)}
                        className='text-muted-foreground absolute top-1/2 right-2 -translate-y-1/2 text-sm'>
                        {showPassword ? <EyeOff strokeWidth={1.25} /> : <Eye strokeWidth={1.25} />}
                    </button>
                </div>

                <div className='items-right flex'>
                    <a href='#' className='ml-auto inline-block text-sm underline-offset-4 hover:underline'>
                        Forgot your password?
                    </a>
                </div>

                {error && <p className='text-sm text-red-500'>{error}</p>}

                <Button type='submit' className='w-full cursor-pointer' disabled={loading}>
                    Login
                </Button>
            </div>

            <div className='mt-4 text-center text-sm'>
                Don&apos;t have an account?{' '}
                <button
                    type='button'
                    onClick={handleSignUpClick}
                    className='cursor-pointer underline underline-offset-4'>
                    Sign up
                </button>
            </div>
        </form>
    );
}
