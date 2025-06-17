'use client';

import { useState } from 'react';



import { useParams } from 'next/navigation';



import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Input } from '@/registry/new-york-v4/ui/input';
import { Label } from '@/registry/new-york-v4/ui/label';

export default function SharedLinkAccessPage() {
    const params = useParams();
    const linkId = params.linkId as string;
    const { toast } = useToast();

    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const token =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hbWVtb2hhbW1lZDIwMTdAZ21haWwuY29tIiwiaWQiOiIzZGM4ZDJiYS01MzI5LTQ0NjYtYmQ4MS1mNGFmNjYwNjEyNjciLCJpbWFnZSI6IiIsInVzZXJuYW1lIjoiIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTAxMTY3OTUsImV4cCI6MTc1MDcyMTU5NX0.TPJRpycLgy1P2To7HC2VQXVAONgFbSgq89UDgWuMZbI';


        try {
            const res = await fetch(`http://localhost:4000/shared-links/${linkId}/access`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ password })
            });

            const data = await res.json();

            if (res.ok) {
                toast({
                    title: 'Success',
                    description: 'Access granted successfully!'
                });
            } else {
                toast({
                    title: 'Access Denied',
                    description: data.message || 'Incorrect password.',
                    variant: 'destructive'
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Something went wrong. Please try again.',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='mx-auto mt-20 max-w-md space-y-6 rounded-xl border p-6 shadow-sm'>
            <h1 className='text-center text-xl font-bold'>Enter Password to Access Link</h1>
            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <Label htmlFor='password'>Password</Label>
                    <Input
                        id='password'
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <Button type='submit' disabled={loading} className='w-full'>
                    {loading ? 'Verifying...' : 'Submit'}
                </Button>
            </form>
        </div>
    );
}