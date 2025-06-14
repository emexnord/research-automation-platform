import { GeneratedQuestion } from 'src/modules/form/entities/question.type';

export const OTP_LENGTH = 6;
export const OTP_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes
export const OTP_RETRY_LIMIT = 3; // Number of attempts allowed
export const PASSWORD_RESET_EXP_TIME = 60 * 60 * 1000; // 1 hour
export const PASSWORD_RESET_TOKEN_LENGTH = 16;

export const MOCK_AI_RESPONSE: GeneratedQuestion[] = [
  {
    question:
      'How often do you use AI tools (e.g., ChatGPT, Grammarly) for academic purposes (research, writing, studying)?',
    type: 'MULTIPLE_CHOICE',
    options: [
      'Never',
      'Rarely (Less than once a week)',
      'Sometimes (1-3 times a week)',
      'Frequently (4 or more times a week)',
    ],
    required: true,
    id: '1',
  },
  {
    question:
      'Which of the following AI tools have you used for your university studies?',
    type: 'CHECKBOXES',
    options: [
      'ChatGPT or other large language models',
      'Grammarly or other grammar/writing assistants',
      'AI-powered research tools (e.g., Elicit, Consensus)',
      'AI-powered presentation tools',
      'Other (Please specify in the next question)',
    ],
    required: false,
    id: '2',
  },
  {
    question:
      "If you selected 'Other' in the previous question, please specify the AI tools you have used.",
    type: 'SHORT_PARAGRAPH',
    required: false,
    id: '3',
  },
  {
    question:
      "To what extent do you agree with the following statement: 'I am confident in my ability to effectively use AI tools to enhance my learning and academic performance.' Please explain your reasoning.",
    type: 'PARAGRAPH',
    required: true,
    id: '4',
  },
  {
    question:
      'From which source did you primarily learn how to use AI tools for academic purposes?',
    type: 'DROPDOWN',
    options: [
      'Self-taught (Experimentation, online tutorials)',
      'University workshops/courses',
      'Peers/Friends',
      'Online forums/communities',
    ],
    required: true,
    id: '5',
  },
];
