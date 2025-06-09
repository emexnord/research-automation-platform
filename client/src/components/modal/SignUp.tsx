'use client';

import { useState } from 'react';

import { Button } from '@/registry/new-york-v4/ui/button';
import { Input } from '@/registry/new-york-v4/ui/input';
// import { signUpUser } from '@/server-actions/auth-actions';
import { signUpSchema } from '@/utils/validators/signup.schema';

import { useDialog } from '../DialogProvider';
import SignIn from '../modal/SignIn';
import EmailOTPVerificationModal from './OTPInput';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function SignUpModal() {
    const { openDialog, closeDialog } = useDialog();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setErrors({ ...errors, [e.target.id]: '' }); // clear error on change
    };

    // const handleSignUp = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     setErrors({});

    //     const result = signUpSchema.safeParse(formData);

    //     if (!result.success) {
    //         const fieldErrors: Record<string, string> = {};
    //         result.error.errors.forEach((err) => {
    //             if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
    //         });
    //         setErrors(fieldErrors);

    //         return;
    //     }

    //     try {
    //         await signUpUser({ email: formData.email, password: formData.password });
    //         openDialog({
    //             title: 'One-Time Password',
    //             content: <EmailOTPVerificationModal email={formData.email} />
    //         });
    //     } catch (error) {
    //         console.log('error 2:', error);
    //         if (error instanceof Error && error.message === 'Email already exists.') {
    //             setErrors({
    //                 email: 'This email is already registered. Please sign in.'
    //             });

    //             return;
    //         }
    //         toast.error('Something went wrong. Please try again later.');
    //         closeDialog();
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
            <div className='flex flex-col gap-6'>
                <p className='text-muted-foreground text-sm'>Create an account to get started.</p>
                <div className='grid gap-2'>
                    {/* <Label htmlFor="email">Email</Label> */}
                    <Input
                        id='email'
                        type='email'
                        placeholder='Email'
                        required
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <p className='text-sm text-red-500'>{errors.email}</p>}
                </div>

                <div className='grid gap-2'>
                    {/* <Label htmlFor="password">Password</Label> */}
                    <div className='relative'>
                        <Input
                            id='password'
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Password'
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className='pr-10'
                        />
                        <button
                            type='button'
                            onClick={() => setShowPassword((prev) => !prev)}
                            className='text-muted-foreground absolute top-1/2 right-2 -translate-y-1/2 text-sm'>
                            {showPassword ? <EyeOff strokeWidth={1.25} /> : <Eye strokeWidth={1.25} />}
                        </button>
                    </div>
                    {errors.password && <p className='text-sm text-red-500'>{errors.password}</p>}
                </div>

                <div className='grid gap-2'>
                    {/* <Label htmlFor="confirmPassword">Confirm Password</Label> */}
                    <Input
                        id='confirmPassword'
                        type='password'
                        placeholder='Confirm Password'
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    {errors.confirmPassword && <p className='text-sm text-red-500'>{errors.confirmPassword}</p>}
                </div>

                <Button type='submit' className='w-full cursor-pointer'>
                    Create account
                </Button>
            </div>

            <div className='mt-4 text-center text-sm'>
                Already have an account?{' '}
                <button
                    type='button'
                    onClick={handleSignInClick}
                    className='cursor-pointer underline underline-offset-4'>
                    Sign in
                </button>
            </div>
        </form>
    );
}
