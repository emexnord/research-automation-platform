'use client';

import { Suspense, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import api from '@/lib/api';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Input } from '@/registry/new-york-v4/ui/input';

import { toast } from 'sonner';

function VerifyOTPContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return; // Only allow 1-digit numbers
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.querySelector<HTMLInputElement>(`input[name=otp-${index + 1}]`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        const key = e.key;

        if (key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.querySelector<HTMLInputElement>(`input[name=otp-${index - 1}]`);
            prevInput?.focus();
        }

        if (key === 'ArrowLeft' && index > 0) {
            const prevInput = document.querySelector<HTMLInputElement>(`input[name=otp-${index - 1}]`);
            prevInput?.focus();
        }

        if (key === 'ArrowRight' && index < 5) {
            const nextInput = document.querySelector<HTMLInputElement>(`input[name=otp-${index + 1}]`);
            nextInput?.focus();
        }
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const response = await api.post('user/verify-email', {
                email,
                otp: otp.join('')
            });

            if (response.status !== 201) {
                throw new Error('Verification failed');
            }

            toast.success('Email verified successfully!');
            router.push('/additional-info');
        } catch (error) {
            toast.error('Invalid OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        try {
            setIsLoading(true);
            // TODO: Implement resend OTP logic here
            toast.success('New OTP sent to your email');
        } catch (error) {
            toast.error('Failed to resend OTP');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='flex min-h-screen items-center justify-center'>
            <Card className='w-[400px]'>
                <CardHeader>
                    <CardTitle>Verify Your Email</CardTitle>
                    <CardDescription>Enter the 6-digit code sent to {email}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='mb-6 flex justify-center gap-2'>
                        {otp.map((digit, index) => (
                            <Input
                                key={index}
                                type='text'
                                inputMode='numeric'
                                autoComplete='one-time-code'
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className='h-12 w-12 text-center text-xl'
                                name={`otp-${index}`}
                                disabled={isLoading}
                            />
                        ))}
                    </div>
                    <Button
                        className='mb-4 w-full'
                        onClick={handleSubmit}
                        disabled={isLoading || otp.some((digit) => !digit)}>
                        Verify
                    </Button>
                    <Button variant='link' className='w-full' onClick={handleResendOTP} disabled={isLoading}>
                        Resend OTP
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default function VerifyOTPPage() {
    return (
        <Suspense
            fallback={
                <div className='flex min-h-screen items-center justify-center'>
                    <Card className='w-[400px]'>
                        <CardHeader>
                            <CardTitle>Loading...</CardTitle>
                            <CardDescription>Please wait while we load the verification page</CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            }>
            <VerifyOTPContent />
        </Suspense>
    );
}