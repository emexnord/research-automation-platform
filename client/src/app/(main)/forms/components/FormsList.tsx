'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { toast } from '@/components/ui/use-toast';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/registry/new-york-v4/ui/dialog';
import { Input } from '@/registry/new-york-v4/ui/input';

import { Survey, mockApi } from '../mock-data';
import { Calendar, Check, Copy, Eye, Share2, Users } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function FormsList() {
    const router = useRouter();
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { data: session, status } = useSession();

    // Fetch surveys on component mount
    const teamId = 'cacc1a2c-a70d-40f8-ba6b-dac1d3c539ac'; // Replace with actual teamId logic (session, route param, etc.)

    useEffect(() => {
        if (!session) return;
        const fetchForms = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/form/team/${teamId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session?.accessToken ?? ''}`
                    }
                });
                if (!res.ok) throw new Error('Failed to fetch forms');
                const data = await res.json();
                setSurveys(data);
            } catch (err) {
                setError('Could not load forms.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchForms();
    }, [teamId, session]);

    const handleShare = (survey: Survey) => {
        setSelectedSurvey(survey);
        setIsShareDialogOpen(true);
        setCopied(false);
    };

    const handleCopyLink = () => {
        if (selectedSurvey?.shareUrl) {
            navigator.clipboard.writeText(selectedSurvey.shareUrl);
            setCopied(true);
            toast({
                title: 'Link copied!',
                description: 'The survey link has been copied to your clipboard.'
            });
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleViewResponses = (surveyId: string) => {
        router.push(`/forms/${surveyId}/responses`);
    };

    const getStatusColor = (isPublished: boolean) => {
        return isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
    };

    if (isLoading) {
        return (
            <div className='flex items-center justify-center py-12'>
                <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900'></div>
            </div>
        );
    }

    if (surveys.length === 0) {
        return (
            <div className='rounded-lg bg-gray-50 py-12 text-center'>
                <h3 className='text-lg font-medium text-gray-900'>No surveys yet</h3>
                <p className='mt-2 text-sm text-gray-500'>
                    Create your first research survey to start collecting responses from your collaborators
                </p>
            </div>
        );
    }

    return (
        <>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {surveys.map((survey) => (
                    <Card key={survey.id} className='group flex flex-col transition-all duration-200 hover:shadow-lg'>
                        <CardHeader className='cursor-pointer'>
                            <Link href={`/forms/${survey.id}`}>
                                {' '}
                                <div className='flex items-start justify-between'>
                                    <CardTitle className='text-lg font-semibold'>{survey.title}</CardTitle>
                                    <span
                                        className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(survey.isPublished)}`}>
                                        {survey.isPublished ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                            </Link>

                            <CardDescription className='text-sm text-gray-600'>{survey.description}</CardDescription>
                        </CardHeader>
                        <CardContent className='flex-grow space-y-2'>
                            <div className='flex items-center text-sm text-gray-500'>
                                <Users className='mr-2 h-4 w-4 text-gray-400' />
                                <span>{survey.responseCount} Responses</span>
                            </div>
                            <div className='flex items-center text-sm text-gray-500'>
                                <Calendar className='mr-2 h-4 w-4 text-gray-400' />
                                <span>Created: {new Date(survey.createdAt).toLocaleDateString()}</span>
                            </div>
                        </CardContent>
                        <CardFooter className='flex justify-between space-x-2'>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => handleShare(survey)}
                                disabled={!survey.isPublished}
                                className='flex-1 transition-all duration-200 group-hover:scale-[1.02]'>
                                <Share2 className='mr-2 h-4 w-4' />
                                Share Survey
                            </Button>
                            <Button
                                variant='secondary'
                                size='sm'
                                onClick={() => handleViewResponses(survey.id)}
                                disabled={survey.responseCount === 0}
                                className='flex-1 transition-all duration-200 group-hover:scale-[1.02]'>
                                <Eye className='mr-2 h-4 w-4' />
                                View Responses
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Share Survey</DialogTitle>
                        <DialogDescription>Copy the link below to share this survey.</DialogDescription>
                    </DialogHeader>
                    <div className='flex items-center gap-2'>
                        <Input readOnly value={selectedSurvey?.shareUrl || ''} className='flex-1' />
                        <Button variant='outline' size='icon' onClick={handleCopyLink} className='shrink-0'>
                            {copied ? <Check className='h-4 w-4 text-green-500' /> : <Copy className='h-4 w-4' />}
                        </Button>
                    </div>
                    <DialogFooter>
                        <Button variant='outline' onClick={() => setIsShareDialogOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
