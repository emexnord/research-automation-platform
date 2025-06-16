'use client';

import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import { Survey, SurveyResponse, mockApi } from '@/app/(main)/forms/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/registry/new-york-v4/ui/table';

import { useSession } from 'next-auth/react';

export default function SurveyResponsesPage() {
    const params = useParams();
    const formId = Array.isArray(params.formId) ? params.formId[0] : params.formId;
    const [form, setForm] = useState<Survey | null>(null);
    const [responses, setResponses] = useState<SurveyResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { data: session } = useSession();
    console.log('Session data:', session?.accessToken);

    useEffect(() => {
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
    }, [formId]);

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

    const getAnswerDisplay = (questionId: string, answer: string | string[] | number | boolean) => {
        const question = form.questions.find((q) => q.id === questionId);
        if (!question) return String(answer);

        switch (question.type) {
            case 'boolean':
                return answer ? 'Yes' : 'No';
            case 'multiple_choice':
                return Array.isArray(answer) ? answer.join(', ') : String(answer);
            default:
                return String(answer);
        }
    };

    return (
        <div className='container mx-auto px-4 py-8'>
            <Card>
                <CardHeader>
                    <CardTitle className='text-2xl font-bold'>Responses for: {form.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    {responses.length === 0 ? (
                        <p className='text-center text-gray-500'>No responses submitted yet for this survey.</p>
                    ) : (
                        <div className='overflow-x-auto'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Submitted At</TableHead>
                                        {form.questions.map((question) => (
                                            <TableHead key={question.id}>{question.text}</TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {responses.map((response) => (
                                        <TableRow key={response.id}>
                                            <TableCell>{new Date(response.submittedAt).toLocaleString()}</TableCell>
                                            {form.questions.map((question) => (
                                                <TableCell key={question.id}>
                                                    {getAnswerDisplay(question.id, response.answers[question.id])}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
