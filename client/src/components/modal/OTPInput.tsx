'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/new-york-v4/ui/button';

// import { verifyEmailOTP } from '@/server-actions/auth-actions';

import { useDialog } from '../DialogProvider';
import SignIn from './SignIn';
import { toast } from 'sonner';

type Props = {
    email: string;
};

export default function EmailOTPVerificationModal({ email }: Props) {
    const OTP_LENGTH = 6;
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const [status, setStatus] = useState<'idle' | 'typing' | 'success' | 'error'>('idle');
    const { openDialog } = useDialog();

    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setStatus('typing');

        if (value && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     const fullOtp = otp.join('');

    //     if (fullOtp.length !== OTP_LENGTH) {
    //         return;
    //     }

    //     try {
    //         await verifyEmailOTP(email, fullOtp);
    //         setStatus('success');
    //         toast.success('Email verified successfully!');

    //         await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for toast to show

    //         openDialog({
    //             title: 'Sign in to your account',
    //             content: <SignIn />
    //         });
    //     } catch (error) {
    //         setStatus('error');
    //         if (error instanceof Error) {
    //             toast.error(error.message || 'Verification failed.');
    //         } else {
    //             toast.error('Something went wrong. Please try again.');
    //         }
    //     }
    // };

    const handleSignInClick = () => {
        openDialog({
            title: 'Sign in to your account',
            content: <SignIn />
        });
    };

    return (
        <form onSubmit={() => {}} className='p-4'>
            <div className='flex flex-col gap-6 text-center'>
                <div className='flex items-center justify-center'>
                    <Image src={'/email-inbox.svg'} alt='inbox' width={100} height={100} className='h-10 w-10' />
                </div>
                <h2 className='text-xl font-semibold'>Check Your mail</h2>
                <p className='text-muted-foreground'>We have sent OTP to your email</p>

                <div className='flex justify-center gap-2'>
                    {otp.map((digit, i) => (
                        <input
                            key={i}
                            type='text'
                            inputMode='numeric'
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            ref={(el) => {
                                inputRefs.current[i] = el;
                            }}
                            className={cn(
                                'h-14 w-12 rounded-md border text-center text-xl font-bold transition-colors outline-none',
                                status === 'idle' && 'border-gray-300',
                                status === 'typing' && 'border-yellow-500 focus:border-yellow-600',
                                status === 'success' && 'border-green-500',
                                status === 'error' && 'border-red-500'
                            )}
                        />
                    ))}
                </div>

                <Button
                    type='submit'
                    className='mt-4 w-full cursor-pointer'
                    disabled={status === 'success' || otp.join('').length !== OTP_LENGTH}>
                    Verify
                </Button>
            </div>

            <div className='mt-4 text-center text-sm md:mx-4'>
                Didn&apos;t receive the email? Check your spam filter, or{' '}
                <button
                    type='button'
                    onClick={handleSignInClick}
                    className='text-primary cursor-pointer underline underline-offset-4'>
                    try another email address
                </button>
            </div>
        </form>
    );
}
