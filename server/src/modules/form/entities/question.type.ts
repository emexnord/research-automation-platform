export type QuestionType =
  | 'SHORT_PARAGRAPH'
  | 'PARAGRAPH'
  | 'MULTIPLE_CHOICE'
  | 'CHECKBOXES'
  | 'DROPDOWN'
  | 'IMAGE_UPLOAD'; // for example,in social media reporting

export type GeneratedQuestion = {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[];
  required: boolean;
};
