export interface Question {
    id: string;
    formId: string; // stringified object, you may parse it if needed
    content: string;
    type: QuestionType;
    options?: string[];
    isRequired: boolean;
    createdAt: string; // or Date if you parse it
    updatedAt: string; // or Date if you parse it
}

export type QuestionType =
    | 'SHORT_PARAGRAPH'
    | 'PARAGRAPH'
    | 'MULTIPLE_CHOICE'
    | 'CHECKBOXES'
    | 'DROPDOWN'
    | 'IMAGE_UPLOAD'; // for example,in social media reporting
