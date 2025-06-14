'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { mockApi, Survey, SurveyResponse } from '@/app/(main)/forms/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/registry/new-york-v4/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';

export default function SurveyResponsesPage() {
    const params = useParams();
    const surveyId = Array.isArray(params.surveyId) ? params.surveyId[0] : params.surveyId;
    const [survey, setSurvey] = useState<Survey | null>(null);
    const [responses, setResponses] = useState<SurveyResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!surveyId) {
                setError('Survey ID is missing.');
                setIsLoading(false);
                return;
            }

            try {
                const fetchedSurvey = await mockApi.getSurveyById(surveyId);
                if (fetchedSurvey) {
                    setSurvey(fetchedSurvey);
                    const fetchedResponses = await mockApi.getSurveyResponses(surveyId);
                    setResponses(fetchedResponses);
                } else {
                    setError('Survey not found.');
                }
            } catch (err) {
                console.error('Failed to fetch data:', err);
                setError('Failed to load survey responses.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [surveyId]);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p>Loading responses...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-center text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    if (!survey) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p>Survey details could not be loaded.</p>
            </div>
        );
    }

    const getAnswerDisplay = (questionId: string, answer: string | string[] | number | boolean) => {
        const question = survey.questions.find(q => q.id === questionId);
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
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Responses for: {survey.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    {responses.length === 0 ? (
                        <p className="text-center text-gray-500">No responses submitted yet for this survey.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Submitted At</TableHead>
                                        {survey.questions.map(question => (
                                            <TableHead key={question.id}>{question.text}</TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {responses.map(response => (
                                        <TableRow key={response.id}>
                                            <TableCell>{new Date(response.submittedAt).toLocaleString()}</TableCell>
                                            {survey.questions.map(question => (
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