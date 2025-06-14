export interface Question {
    id: string;
    type: 'text' | 'multiple_choice' | 'rating' | 'boolean';
    text: string;
    required: boolean;
    options?: string[];
}

export interface Survey {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    isPublished: boolean;
    responseCount: number;
    questions: Question[];
    shareUrl?: string;
}

export interface SurveyResponse {
    id: string;
    surveyId: string;
    submittedAt: string;
    answers: { [questionId: string]: string | string[] | number | boolean };
}

// Mock data
const mockSurveys: Survey[] = [
    {
        id: '1',
        title: 'Research Participant Survey',
        description: 'Gather feedback from research participants about their experience',
        createdAt: '2024-03-15',
        isPublished: true,
        responseCount: 45,
        shareUrl: `${window.location.origin}/forms/1`,
        questions: [
            {
                id: 'q1',
                type: 'text',
                text: 'What aspects of the research process were most valuable to you?',
                required: true
            },
            {
                id: 'q2',
                type: 'rating',
                text: 'How would you rate your overall experience?',
                required: true
            }
        ]
    },
    {
        id: '2',
        title: 'Team Collaboration Assessment',
        description: 'Evaluate team collaboration and communication effectiveness',
        createdAt: '2024-03-14',
        isPublished: true,
        responseCount: 28,
        shareUrl: `${window.location.origin}/forms/2`,
        questions: [
            {
                id: 'q1',
                type: 'multiple_choice',
                text: 'How often do you collaborate with team members?',
                required: true,
                options: ['Daily', 'Weekly', 'Monthly', 'Rarely']
            },
            {
                id: 'q2',
                type: 'boolean',
                text: 'Do you feel your team communicates effectively?',
                required: true
            }
        ]
    },
    {
        id: '3',
        title: 'Project Impact Analysis',
        description: 'Measure the impact of research projects on target outcomes',
        createdAt: '2024-03-13',
        isPublished: false,
        responseCount: 0,
        shareUrl: `${window.location.origin}/forms/3`,
        questions: [
            {
                id: 'q1',
                type: 'text',
                text: 'What were the key outcomes of the project?',
                required: true
            },
            {
                id: 'q2',
                type: 'rating',
                text: 'How would you rate the project\'s success?',
                required: true
            }
        ]
    }
];

const mockResponses: SurveyResponse[] = [
    {
        id: 'resp1',
        surveyId: '1',
        submittedAt: '2024-03-15T10:00:00Z',
        answers: {
            q1: 'The hands-on workshops were very helpful.',
            q2: 4
        }
    },
    {
        id: 'resp2',
        surveyId: '1',
        submittedAt: '2024-03-15T11:30:00Z',
        answers: {
            q1: 'I enjoyed the interactive sessions.',
            q2: 5
        }
    },
    {
        id: 'resp3',
        surveyId: '2',
        submittedAt: '2024-03-14T09:00:00Z',
        answers: {
            q1: 'Weekly',
            q2: true
        }
    },
    {
        id: 'resp4',
        surveyId: '2',
        submittedAt: '2024-03-14T10:15:00Z',
        answers: {
            q1: 'Daily',
            q2: false
        }
    }
];

// Mock API functions
export const mockApi = {
    getSurveys: async (): Promise<Survey[]> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return mockSurveys;
    },

    createSurvey: async (survey: Omit<Survey, 'id' | 'createdAt' | 'responseCount'>): Promise<Survey> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        const newSurvey: Survey = {
            ...survey,
            id: `survey-${Date.now()}`,
            createdAt: new Date().toISOString(),
            responseCount: 0
        };
        mockSurveys.push(newSurvey);
        return newSurvey;
    },

    publishSurvey: async (surveyId: string): Promise<Survey> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        const survey = mockSurveys.find(s => s.id === surveyId);
        if (!survey) throw new Error('Survey not found');
        survey.isPublished = true;
        return survey;
    },

    getSurveyResponses: async (surveyId: string): Promise<SurveyResponse[]> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        return mockResponses.filter(response => response.surveyId === surveyId);
    },

    getSurveyById: async (surveyId: string): Promise<Survey | undefined> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockSurveys.find(survey => survey.id === surveyId);
    }
};