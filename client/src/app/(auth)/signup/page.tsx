'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import api from '@/lib/api';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/registry/new-york-v4/ui/form';
import { Input } from '@/registry/new-york-v4/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/new-york-v4/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';

import { se } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const signupSchema = z
    .object({
        username: z.string().min(3, 'Username must be at least 3 characters'),
        email: z.string().email('Invalid email address'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number')
            .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
        confirmPassword: z.string(),
        profilePicture: z.any().optional()
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword']
    });

const optionalInfoSchema = z.object({
    occupation: z.enum(['student', 'researcher', 'project_manager']),
    industry: z.enum(['software', 'engineering', 'health', 'social_sector']),
    yearsOfExperience: z.enum(['1', '2', '5', '10', '10+'])
});

export default function SignUpPage() {
    const router = useRouter();
    const [step, setStep] = useState<'signup' | 'otp' | 'optional'>('signup');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    });

    const optionalForm = useForm<z.infer<typeof optionalInfoSchema>>({
        resolver: zodResolver(optionalInfoSchema),
        defaultValues: {
            occupation: undefined,
            industry: undefined,
            yearsOfExperience: undefined
        }
    });

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.querySelector(`input[name=otp-${index + 1}]`) as HTMLInputElement;
            nextInput?.focus();
        }
    };

    const onSubmit = async (data: z.infer<typeof signupSchema>) => {
        try {
            setLoading(true);
            const response = await api.post('/user/register', {
                email: data.email,
                password: data.password
            });
            if (response.status === 201) {
                console.log('Registration successful:', response.data);
                setStep('otp');
                setOtp(['', '', '', '', '', '']); // Reset OTP inputs
            } else {
                throw new Error('Registration failed');
            }
            setLoading(false);
            toast.success('Registration successful! Please verify your email.');
            // TODO: Implement signup API call
            // const response = await signup(data);
            router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('Failed to sign up', error.response?.data?.message || 'Please try again later');
        }
    };

    const handleOtpSubmit = async () => {
        try {
            const response = await api.post('/user/verify-email', {
                email: form.getValues('email'),
                otp: otp.join('')
            });
            if (response.status === 200) {
                toast.success('OTP verified successfully!');
            }
        } catch (error) {
            toast.error('Invalid OTP');
        }
    };

    const handleOptionalSubmit = async (data: z.infer<typeof optionalInfoSchema>) => {
        try {
            setLoading(true);

            // TODO: Implement optional info submission API call
            // await submitOptionalInfo(data);
            router.push('/task');
        } catch (error) {
            toast.error('Failed to save optional information');
        }
    };

    if (step === 'otp') {
        return (
            <div className='flex min-h-screen items-center justify-center'>
                <Card className='w-[400px]'>
                    <CardHeader>
                        <CardTitle>Verify Your Email</CardTitle>
                        <CardDescription>Enter the 6-digit code sent to your email</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='mb-6 flex justify-center gap-2'>
                            {otp.map((digit, index) => (
                                <Input
                                    key={index}
                                    type='text'
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    className='h-12 w-12 text-center text-xl'
                                    name={`otp-${index}`}
                                />
                            ))}
                        </div>
                        <Button className='w-full' onClick={handleOtpSubmit}>
                            Verify
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (step === 'optional') {
        return (
            <div className='flex min-h-screen items-center justify-center'>
                <Card className='w-[400px]'>
                    <CardHeader>
                        <CardTitle>Additional Information</CardTitle>
                        <CardDescription>Tell us more about yourself (Optional)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...optionalForm}>
                            <form onSubmit={optionalForm.handleSubmit(handleOptionalSubmit)} className='space-y-4'>
                                <FormField
                                    control={optionalForm.control}
                                    name='occupation'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Occupation</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select your occupation' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value='student'>Student</SelectItem>
                                                    <SelectItem value='researcher'>Researcher</SelectItem>
                                                    <SelectItem value='project_manager'>Project Manager</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={optionalForm.control}
                                    name='industry'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Industry</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select your industry' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value='software'>Software</SelectItem>
                                                    <SelectItem value='engineering'>Engineering</SelectItem>
                                                    <SelectItem value='health'>Health</SelectItem>
                                                    <SelectItem value='social_sector'>Social Sector</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={optionalForm.control}
                                    name='yearsOfExperience'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Years of Experience in Research</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select years of experience' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value='1'>1 year</SelectItem>
                                                    <SelectItem value='2'>2 years</SelectItem>
                                                    <SelectItem value='5'>5 years</SelectItem>
                                                    <SelectItem value='10'>10 years</SelectItem>
                                                    <SelectItem value='10+'>10+ years</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className='flex gap-2'>
                                    <Button type='submit' className='flex-1'>
                                        Save
                                    </Button>
                                    <Button
                                        type='button'
                                        variant='outline'
                                        className='flex-1'
                                        onClick={() => router.push('/task')}>
                                        Skip
                                    </Button>
                                </div>
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
                    <CardTitle>Create an Account</CardTitle>
                    <CardDescription>Enter your details to get started</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                            <FormField
                                control={form.control}
                                name='username'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Enter your username' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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

                            <FormField
                                control={form.control}
                                name='confirmPassword'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input type='password' placeholder='Confirm your password' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='profilePicture'
                                render={({ field: { value, onChange, ...field } }) => (
                                    <FormItem>
                                        <FormLabel>Profile Picture (Optional)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='file'
                                                accept='image/*'
                                                onChange={(e) => onChange(e.target.files?.[0])}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type='submit' className='w-full'>
                                Sign Up
                            </Button>

                            <div className='text-center text-sm'>
                                Already have an account?{' '}
                                <Button variant='link' className='p-0' onClick={() => router.push('/signin')}>
                                    Sign In
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
