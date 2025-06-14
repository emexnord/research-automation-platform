"use client"
import { Button } from "@/registry/new-york-v4/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card";
import { Input } from "@/registry/new-york-v4/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { mockApi } from "../mock-data";

const CreateSurvey = () => {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsGenerating(true);

        try {
            // Create new survey
            const survey = await mockApi.createSurvey(title);
            
            // Generate questions using AI
            const questions = await mockApi.generateSurveyQuestions(title);
            
            // TODO: Update survey with generated questions
            // await mockApi.updateSurvey(survey.id, { questions });
            
            // Redirect to edit page
            router.push(`/forms/${survey.id}/edit`);
        } catch (error) {
            console.error('Failed to generate form:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="container mx-auto py-8 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">
                        {getGreeting()}, Researcher!
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-lg font-medium">
                                What would you like to create a survey about?
                            </label>
                            <p className="text-sm text-gray-500">
                                Enter a title or topic for your research survey, and our AI will help you create the perfect questions.
                            </p>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Impact of Remote Work on Team Collaboration"
                                className="text-lg"
                                required
                            />
                        </div>
                        <div className="flex gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={isGenerating}
                                className="flex-1"
                            >
                                {isGenerating ? "Generating Survey..." : "Generate Survey"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateSurvey; 