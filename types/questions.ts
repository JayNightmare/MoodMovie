export interface QuestionOption {
  label: string;
  value: string;
  description?: string;
  weight?: number;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'scale';
  options?: QuestionOption[];
  scaleLabels?: [string, string];
  category: 'mood' | 'genre' | 'intensity' | 'setting' | 'era';
}