// adjust the path if needed
import { Question } from './question.type';

export interface Form {
    id: string;
    teamId: string;
    owner: string;
    title: string;
    context?: string;
    questions: Question[];
    createdAt: string; // or Date if you parse it
    updatedAt: string; // or Date if you parse it
}
