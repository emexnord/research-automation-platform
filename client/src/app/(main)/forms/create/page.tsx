'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@/registry/new-york-v4/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Input } from '@/registry/new-york-v4/ui/input';
import { Textarea } from '@/registry/new-york-v4/ui/textarea';

import { useSession } from 'next-auth/react';

const CreateSurvey = () => {
    const router = useRouter();
    const [context, setContext] = useState('');
    const [numberOfQuestions, setNumberOfQuestions] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);

    const teamId = '634577e5-c57b-4772-80fa-92b2a796e507';

    const { data: session, status } = useSession();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';

        return 'Good evening';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsGenerating(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/form/ai`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.accessToken ?? ''}`
                },
                body: JSON.stringify({
                    context,
                    numberOfQuestions,
                    teamId
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to generate form: ${response.statusText}`);
            }

            const form = await response.json();

            // Redirect to form edit page
            router.push(`/forms/${form.id}`);
        } catch (error) {
            console.error('Error generating form:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className='container mx-auto max-w-2xl py-8'>
            <Card>
                <CardHeader>
                    <CardTitle className='text-2xl'>{getGreeting()}, Researcher!</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <div className='space-y-2'>
                            <label htmlFor='context' className='text-lg font-medium'>
                                What's the research context or topic?
                            </label>
                            <p className='text-sm text-gray-500'>
                                Describe the purpose of your research, and our AI will help you generate the right
                                survey questions.
                            </p>
                            <Textarea
                                id='context'
                                value={context}
                                onChange={(e) => setContext(e.target.value)}
                                placeholder='e.g., How remote work affects team productivity'
                                className='text-lg'
                                required
                            />
                        </div>
                        <div className='space-y-2'>
                            <label htmlFor='context' className='text-lg font-medium'>
                                Number of Questions
                            </label>
                            <Input
                                id='numberOfQuestions'
                                type='number'
                                value={numberOfQuestions}
                                onChange={(e) => setNumberOfQuestions(e.target.value ? parseInt(e.target.value) : 5)}
                                placeholder='e.g., How remote work affects team productivity'
                                className='text-lg'
                                required
                            />
                        </div>
                        <div className='flex gap-4'>
                            <Button type='button' variant='outline' onClick={() => router.back()}>
                                Cancel
                            </Button>
                            <Button type='submit' disabled={isGenerating} className='flex-1'>
                                {isGenerating ? 'Generating Survey...' : 'Generate Survey'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateSurvey;
