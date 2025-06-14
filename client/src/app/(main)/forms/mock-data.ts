export interface Survey {
    id: string;
    title: string;
    responses: number;
    createdAt: string;
    status: 'draft' | 'published' | 'closed';
    questions?: Question[];
    shareUrl?: string;
}

export interface Question {
    id: string;
    type: 'text' | 'multiple_choice' | 'rating' | 'checkbox';
    question: string;
    required: boolean;
    options?: string[];
}

export const mockSurveys: Survey[] = [
    {
        id: "1",
        title: "Remote Work Productivity Study",
        responses: 45,
        createdAt: "2024-03-15T10:00:00Z",
        status: "published",
        shareUrl: "https://research-platform.com/survey/1",
        questions: [
            {
                id: "q1",
                type: "multiple_choice",
                question: "How many hours per day do you work remotely?",
                required: true,
                options: ["0-4 hours", "4-6 hours", "6-8 hours", "8+ hours"]
            },
            {
                id: "q2",
                type: "rating",
                question: "Rate your productivity while working remotely (1-5)",
                required: true
            }
        ]
    },
    {
        id: "2",
        title: "Team Collaboration Tools Survey",
        responses: 28,
        createdAt: "2024-03-14T15:30:00Z",
        status: "published",
        shareUrl: "https://research-platform.com/survey/2",
        questions: [
            {
                id: "q1",
                type: "checkbox",
                question: "Which collaboration tools do you use?",
                required: true,
                options: ["Slack", "Microsoft Teams", "Zoom", "Google Meet", "Other"]
            }
        ]
    },
    {
        id: "3",
        title: "AI in Research Practices",
        responses: 0,
        createdAt: "2024-03-16T09:15:00Z",
        status: "draft",
        questions: [
            {
                id: "q1",
                type: "text",
                question: "How do you currently use AI in your research?",
                required: true
            }
        ]
    }
];

// Mock API functions
export const mockApi = {
    getSurveys: async (): Promise<Survey[]> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return mockSurveys;
    },

    createSurvey: async (title: string): Promise<Survey> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const newSurvey: Survey = {
            id: Math.random().toString(36).substr(2, 9),
            title,
            responses: 0,
            createdAt: new Date().toISOString(),
            status: "draft",
            questions: []
        };
        
        return newSurvey;
    },

    generateSurveyQuestions: async (title: string): Promise<Question[]> => {
        // Simulate AI generation delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock AI-generated questions based on title
        return [
            {
                id: "q1",
                type: "text",
                question: `What is your primary research interest in ${title}?`,
                required: true
            },
            {
                id: "q2",
                type: "multiple_choice",
                question: "How long have you been working in this field?",
                required: true,
                options: ["0-2 years", "2-5 years", "5-10 years", "10+ years"]
            },
            {
                id: "q3",
                type: "rating",
                question: "Rate the importance of this topic in your research (1-5)",
                required: true
            }
        ];
    }
}; 