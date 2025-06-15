 'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Input } from '@/registry/new-york-v4/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { toast } from 'sonner';

export default function VerifyOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement OTP verification API call
      // const response = await verifyOtp(otp.join(''));
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
      // TODO: Implement resend OTP API call
      // await resendOtp(email);
      toast.success('New OTP sent to your email');
    } catch (error) {
      toast.error('Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to {email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 justify-center mb-6">
            {otp.map((digit, index) => (
              <Input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                className="w-12 h-12 text-center text-xl"
                name={`otp-${index}`}
                disabled={isLoading}
              />
            ))}
          </div>
          <Button 
            className="w-full mb-4" 
            onClick={handleSubmit}
            disabled={isLoading || otp.some(digit => !digit)}
          >
            Verify
          </Button>
          <Button
            variant="link"
            className="w-full"
            onClick={handleResendOTP}
            disabled={isLoading}
          >
            Resend OTP
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}