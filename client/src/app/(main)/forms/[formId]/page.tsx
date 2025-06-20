'use client';

import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import { SurveyResponse, mockApi } from '@/app/(main)/forms/mock-data';
import SurveyForm from '@/components/SurveyForm';
import { Button } from '@/registry/new-york-v4/ui/button';

import { Form } from '../../../../../types/form.type';
import { useSession } from 'next-auth/react';
import { IoShareSocial } from 'react-icons/io5';
import { toast } from 'sonner';

export default function SurveyResponsesPage() {
    const params = useParams();
    const formId = Array.isArray(params.formId) ? params.formId[0] : params.formId;
    const [form, setForm] = useState<Form | null>(null);
    const [responses, setResponses] = useState<SurveyResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { data: session } = useSession();

    useEffect(() => {
        if (!session) return;
        const fetchData = async () => {
            if (!formId) {
                setError('Survey ID is missing.');
                setIsLoading(false);

                return;
            }

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/form/${formId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session?.accessToken ?? ''}`
                    }
                });

                if (!res.ok) {
                    throw new Error(`Failed to fetch survey. Status: ${res.status}`);
                }

                const fetchedForm = await res.json();
                console.log('Fetched form:', fetchedForm);
                setForm(fetchedForm);

                // Optionally fetch responses separately if needed
                // const res2 = await fetch(`/form/${formId}/responses`);
                // const fetchedResponses = await res2.json();
                // setResponses(fetchedResponses);
            } catch (err) {
                console.error('Failed to fetch data:', err);
                setError('Failed to load survey.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [formId, session]);

    if (isLoading) {
        return (
            <div className='container mx-auto px-4 py-8 text-center'>
                <p>Loading responses...</p>
            </div>
        );
    }

    const copyLinkToClipboard = () => {
        const baseUrl = process.env.NEXT_PUBLIC_DOMAIN;
        const surveyLink = `${baseUrl}/response/${form?.id}`;

        try {
            navigator.clipboard.writeText(surveyLink).then(() => {
                toast.success('Share link copied!');

                return;
            });
        } catch (error) {
            console.error('Error copying link:', error);
        }
    };

    if (error) {
        return (
            <div className='container mx-auto px-4 py-8 text-center text-red-500'>
                <p>{error}</p>
            </div>
        );
    }

    if (!form) {
        return (
            <div className='container mx-auto px-4 py-8 text-center'>
                <p>Survey details could not be loaded.</p>
            </div>
        );
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            <div className='mb-10 flex w-full justify-between rounded border border-gray-300 bg-white p-5 dark:border-gray-700 dark:bg-black'>
                <div>
                    <h1 className='text-2xl font-bold'>Title:</h1>
                    <h1 className='text-xl'>{form.title}</h1>
                </div>
                <Button
                    onClick={copyLinkToClipboard}
                    className='w-auto rounded-sm px-2 py-1'
                    aria-label='Share link'
                    variant={'outline'}>
                    Publish
                    <IoShareSocial className='text-lg text-gray-700 dark:text-white' />
                </Button>
            </div>
            <SurveyForm questions={form.questions} onSubmit={() => {}} />
        </div>
    );
}
