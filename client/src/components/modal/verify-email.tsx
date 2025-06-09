'use client';

import { useState } from 'react';

import { Button } from '@/registry/new-york-v4/ui/button';
import { Input } from '@/registry/new-york-v4/ui/input';

import { useDialog } from '../DialogProvider';
// import { verifyEmail } from "@/server-actions/auth-actions";
import EmailOTPVerification from './OTPInput';
import { toast } from 'sonner';

export default function VerifyEmailModal() {
    const { openDialog } = useDialog();

    const [email, setEmail] = useState('');

    // const handleVerifyEmail = async (e: React.FormEvent) => {
    //   e.preventDefault();

    //   if (!email) return;

    //   try {
    //     await verifyEmail(email);
    //     openDialog({
    //       title: "One-Time Password",
    //       content: <EmailOTPVerification email={email} />,
    //     });
    //   } catch (error) {
    //     toast.error(
    //       (error instanceof Error && error.message) ||
    //         "Something went wrong. Please try again later."
    //     );
    //   }
    // };

    return (
        <form onSubmit={() => {}}>
            <div className='flex flex-col gap-6 p-4'>
                <p className='text-muted-foreground text-sm'>Enter your email to receive a verification code.</p>
                <div className='grid gap-2'>
                    {/* <Label htmlFor="email">Email</Label> */}
                    <Input
                        id='email'
                        type='text'
                        placeholder='Email or Username'
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <Button type='submit' className='w-full cursor-pointer'>
                    Verify
                </Button>
            </div>
        </form>
    );
}
