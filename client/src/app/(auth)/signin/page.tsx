'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@/registry/new-york-v4/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/registry/new-york-v4/ui/form';
import { Input } from '@/registry/new-york-v4/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';

import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const signinSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
});

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address')
});

const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number')
            .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
        confirmPassword: z.string()
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword']
    });

export default function SignInPage() {
    const router = useRouter();
    const [step, setStep] = useState<'signin' | 'forgot-password' | 'reset-password'>('signin');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [resetToken, setResetToken] = useState<string>('');

    const form = useForm<z.infer<typeof signinSchema>>({
        resolver: zodResolver(signinSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: ''
        }
    });

    const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    });

    const handleVerifyEmail = () => {
        router.push('/verify-email');
    };

    const onSubmit = async (data: z.infer<typeof signinSchema>) => {
        console.log('Submitting sign in with data:', data);
        setError('');
        setLoading(true);

        const res = await signIn('credentials', {
            redirect: false,
            email: data.email,
            password: data.password
        });

        if (res?.error) {
            if (res.code === '403') {
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
            toast.success('Welcome back!');
          
            router.push('/task');

        }
        setLoading(false);
    };

    // const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    //   try {
    //     // TODO: Implement signin API call
    //     // const response = await signin(data);
    //     router.push('/task');
    //   } catch (error) {
    //     toast.error('Invalid credentials');
    //   }
    // };

    const handleForgotPassword = async (data: z.infer<typeof forgotPasswordSchema>) => {
        try {
            // TODO: Implement forgot password API call
            // await forgotPassword(data.email);
            toast.success('Password reset instructions sent to your email');
            setStep('signin');
        } catch (error) {
            toast.error('Failed to send reset instructions');
        }
    };

    const handleResetPassword = async (data: z.infer<typeof resetPasswordSchema>) => {
        try {
            // TODO: Implement reset password API call
            // await resetPassword(resetToken, data.password);
            toast.success('Password reset successful');
            setStep('signin');
        } catch (error) {
            toast.error('Failed to reset password');
        }
    };

    if (step === 'forgot-password') {
        return (
            <div className='flex min-h-screen items-center justify-center'>
                <Card className='w-[400px]'>
                    <CardHeader>
                        <CardTitle>Forgot Password</CardTitle>
                        <CardDescription>Enter your email to reset your password</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...forgotPasswordForm}>
                            <form
                                onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)}
                                className='space-y-4'>
                                <FormField
                                    control={forgotPasswordForm.control}
                                    name='email'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type='email' placeholder='Enter your email' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type='submit' className='w-full'>
                                    Send Reset Instructions
                                </Button>

                                <Button
                                    type='button'
                                    variant='link'
                                    className='w-full'
                                    onClick={() => setStep('signin')}>
                                    Back to Sign In
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (step === 'reset-password') {
        return (
            <div className='flex min-h-screen items-center justify-center'>
                <Card className='w-[400px]'>
                    <CardHeader>
                        <CardTitle>Reset Password</CardTitle>
                        <CardDescription>Enter your new password</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...resetPasswordForm}>
                            <form onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)} className='space-y-4'>
                                <FormField
                                    control={resetPasswordForm.control}
                                    name='password'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl>
                                                <Input type='password' placeholder='Enter new password' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={resetPasswordForm.control}
                                    name='confirmPassword'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <Input type='password' placeholder='Confirm new password' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type='submit' className='w-full'>
                                    Reset Password
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className='flex min-h-screen items-center justify-center'>
            <Card className='w-[400px]'>
                <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                    <CardDescription>Enter your credentials to continue</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                            <FormField
                                control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type='email' placeholder='Enter your email' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='password'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type='password' placeholder='Enter your password' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {error && <p className='text-sm text-red-500'>{error}</p>}

                            <Button type='submit' className='w-full'>
                                Sign In
                            </Button>

                            <div className='flex flex-col gap-2 text-center text-sm'>
                                <Button variant='link' className='p-0' onClick={() => router.push('/forgot-password')}>
                                    Forgot Password?
                                </Button>

                                <div>
                                    Don't have an account?{' '}
                                    <Button variant='link' className='p-0' onClick={() => router.push('/signup')}>
                                        Create an Account
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
