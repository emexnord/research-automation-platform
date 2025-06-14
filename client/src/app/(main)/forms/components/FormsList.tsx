"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/registry/new-york-v4/ui/dialog';
import { Input } from '@/registry/new-york-v4/ui/input';
import { Share2, Eye, Copy, Check, Users, Calendar } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Survey, mockApi } from '../mock-data';

export default function FormsList() {
    const router = useRouter();
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
    const [copied, setCopied] = useState(false);

    // Fetch surveys on component mount
    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                const data = await mockApi.getSurveys();
                setSurveys(data);
            } catch (error) {
                console.error('Failed to fetch surveys:', error);
                toast({
                    title: "Error",
                    description: "Failed to load surveys. Please try again.",
                    variant: "destructive"
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchSurveys();
    }, []);

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
                title: "Link copied!",
                description: "The survey link has been copied to your clipboard.",
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
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (surveys.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">No surveys yet</h3>
                <p className="mt-2 text-sm text-gray-500">
                    Create your first research survey to start collecting responses from your collaborators
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {surveys.map((survey) => (
                    <Card key={survey.id} className="group flex flex-col hover:shadow-lg transition-all duration-200">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg font-semibold">{survey.title}</CardTitle>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(survey.isPublished)}`}>
                                    {survey.isPublished ? 'Published' : 'Draft'}
                                </span>
                            </div>
                            <CardDescription className="text-sm text-gray-600">{survey.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-2">
                            <div className="flex items-center text-sm text-gray-500">
                                <Users className="h-4 w-4 mr-2 text-gray-400" />
                                <span>{survey.responseCount} Responses</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                <span>Created: {new Date(survey.createdAt).toLocaleDateString()}</span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleShare(survey)}
                                disabled={!survey.isPublished}
                                className="flex-1 transition-all duration-200 group-hover:scale-[1.02]"
                            >
                                <Share2 className="h-4 w-4 mr-2" />
                                Share Survey
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleViewResponses(survey.id)}
                                disabled={survey.responseCount === 0}
                                className="flex-1 transition-all duration-200 group-hover:scale-[1.02]"
                            >
                                <Eye className="h-4 w-4 mr-2" />
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
                        <DialogDescription>
                            Copy the link below to share this survey.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center gap-2">
                        <Input
                            readOnly
                            value={selectedSurvey?.shareUrl || ''}
                            className="flex-1"
                        />
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleCopyLink}
                            className="shrink-0"
                        >
                            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsShareDialogOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}