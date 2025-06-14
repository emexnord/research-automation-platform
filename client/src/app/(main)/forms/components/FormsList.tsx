"use client"
import { Button } from "@/registry/new-york-v4/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card";
import { Share2, Users, Calendar, Copy, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { Survey, mockApi } from "../mock-data";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/registry/new-york-v4/ui/dialog";
import { Input } from "@/registry/new-york-v4/ui/input";

const FormsList = () => {
    const router = useRouter();
    const [forms, setForms] = useState<Survey[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const data = await mockApi.getSurveys();
                setForms(data);
            } catch (error) {
                console.error('Failed to fetch forms:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchForms();
    }, []);

    const handleShare = (survey: Survey) => {
        setSelectedSurvey(survey);
        setShareDialogOpen(true);
        setCopied(false);
    };

    const handleCopyLink = async () => {
        if (selectedSurvey?.shareUrl) {
            await navigator.clipboard.writeText(selectedSurvey.shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleViewResponses = (surveyId: string) => {
        router.push(`/forms/${surveyId}/responses`);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (forms.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">No surveys yet</h3>
                <p className="mt-2 text-sm text-gray-500">
                    Create your first research survey to start collecting responses from your collaborators
                </p>
            </div>
        );
    }

    const getStatusColor = (status: Survey['status']) => {
        switch (status) {
            case 'published':
                return 'bg-green-100 text-green-800';
            case 'draft':
                return 'bg-yellow-100 text-yellow-800';
            case 'closed':
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {forms.map((form) => (
                    <Card key={form.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{form.title}</CardTitle>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(form.status)}`}>
                                    {form.status}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex items-center text-sm text-gray-500">
                                    <Users className="w-4 h-4 mr-2" />
                                    {form.responses} responses
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Created {new Date(form.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleShare(form)}
                                disabled={form.status !== 'published'}
                            >
                                <Share2 className="w-4 h-4 mr-2" />
                                Share Survey
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleViewResponses(form.id)}
                                disabled={form.responses === 0}
                            >
                                View Responses
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Share Survey</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <p className="text-sm text-gray-500">
                            Share this link with your collaborators to collect responses:
                        </p>
                        <div className="flex items-center gap-2">
                            <Input
                                value={selectedSurvey?.shareUrl || ''}
                                readOnly
                                className="flex-1"
                            />
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleCopyLink}
                            >
                                {copied ? (
                                    <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                    <Copy className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default FormsList; 