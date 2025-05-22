
export interface VideoSummary {
  title: string;
  transcript: string;
  summary: string;
  keyPoints: string[];
  language: string;
  videoId: string;
  thumbnailUrl: string;
  channelName: string;
  videoUrl: string;
  timestamps: TimeStamp[];
}

export interface TimeStamp {
  time: string; // format: "00:00"
  text: string;
  seconds: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface Quiz {
  id: string;
  videoId: string;
  title: string;
  questions: QuizQuestion[];
  language: string;
}

export interface UserNote {
  id: string;
  videoId: string;
  timestamp: string;
  seconds: number;
  text: string;
  createdAt: Date;
}

export interface CommentVariation {
  id: string;
  text: string;
}

export type ExportFormat = 'pdf' | 'docx';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
