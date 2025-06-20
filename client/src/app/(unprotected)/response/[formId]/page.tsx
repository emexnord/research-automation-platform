'use client';

import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import { SurveyResponse, mockApi } from '@/app/(main)/forms/mock-data';
import SurveyForm from '@/components/SurveyForm';

import { Answer } from '../../../../../types/answer.type';
import { Form } from '../../../../../types/form.type';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

export default function SurveyResponsesPage() {
    const params = useParams();
    const formId = Array.isArray(params.formId) ? params.formId[0] : params.formId;
    const [form, setForm] = useState<Form | null>(null);
    const [responses, setResponses] = useState<SurveyResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { data: session } = useSession();

    const onSubmit = async (responses: Answer[]) => {
        console.log('Submitting responses:', responses);
        try {
            const payload = {
                formId,
                answers: responses.map((r) => ({
                    questionId: r.questionId,
                    content: Array.isArray(r.text) ? r.text.join(', ') : r.text
                }))
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/response`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                throw new Error(`Submission failed with status ${res.status}`);
            }

            const data = await res.json();
            console.log('Submitted successfully:', data);
            toast.success('Response submitted successfully!');

            // You can show a success message or redirect
        } catch (error) {
            console.error('Failed to submit response:', error);
            // You can show an error toast/message here
        }
    };

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
        <div className='container mx-auto px-4 py-8 text-center'>
            <div>
                <h1 className='mb-4 text-2xl font-bold'>{form.title}</h1>
            </div>
            <SurveyForm questions={form.questions} onSubmit={onSubmit} />
        </div>
    );
}
