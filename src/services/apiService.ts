
import { VideoSummary, Quiz, CommentVariation, ApiResponse } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Mock implementation for the demo
// In a real extension, these would make API calls to OpenAI or other services

export const generateSummary = async (videoId: string): Promise<ApiResponse<VideoSummary>> => {
  // This is a mock implementation - in a real extension this would call an API
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock data for demonstration
  const summary: VideoSummary = {
    title: "Understanding Modern JavaScript",
    transcript: "This is a mock transcript of the video content...",
    summary: "This comprehensive tutorial covers JavaScript ES6+ features including arrow functions, destructuring, async/await, and modern best practices. The presenter explains how these features improve code readability and maintainability while reducing common errors. Several examples demonstrate practical applications in real-world scenarios.",
    keyPoints: [
      "Arrow functions provide shorter syntax and lexical 'this' binding",
      "Destructuring allows extracting values from objects and arrays more efficiently",
      "Async/await simplifies asynchronous code compared to promise chains",
      "Template literals improve string formatting with embedded expressions",
      "Modern module system helps organize code better than older approaches"
    ],
    language: "English",
    videoId: videoId,
    thumbnailUrl: "https://i.ytimg.com/vi/example/maxresdefault.jpg",
    channelName: "JavaScript Mastery",
    videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
    timestamps: [
      { time: "00:45", text: "Introduction to ES6 features", seconds: 45 },
      { time: "03:22", text: "Arrow function syntax explained", seconds: 202 },
      { time: "07:15", text: "Destructuring objects and arrays", seconds: 435 },
      { time: "12:48", text: "Working with async/await", seconds: 768 },
      { time: "18:30", text: "Real-world application examples", seconds: 1110 }
    ]
  };
  
  return {
    success: true,
    data: summary
  };
};

export const generateQuiz = async (videoId: string, questionCount: number = 10): Promise<ApiResponse<Quiz>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate mock quiz questions
  const questions = Array.from({ length: questionCount }, (_, i) => ({
    id: uuidv4(),
    question: `What is the primary benefit of using ${i % 2 === 0 ? 'arrow functions' : 'async/await'} in modern JavaScript?`,
    options: [
      "They automatically handle memory management",
      `They ${i % 2 === 0 ? 'provide lexical this binding' : 'simplify asynchronous code'}`,
      `They reduce file size by ${i % 3 + 1}0%`,
      "They automatically prevent security vulnerabilities"
    ],
    correctAnswer: `They ${i % 2 === 0 ? 'provide lexical this binding' : 'simplify asynchronous code'}`,
    explanation: `${i % 2 === 0 ? 'Arrow functions' : 'Async/await'} are a key feature of modern JavaScript that makes code cleaner and more maintainable.`
  }));
  
  return {
    success: true,
    data: {
      id: uuidv4(),
      videoId,
      title: "Modern JavaScript Quiz",
      questions,
      language: "English"
    }
  };
};

export const generateCommentVariations = async (
  videoId: string,
  title: string,
  summary: string,
  customPrompt?: string
): Promise<ApiResponse<CommentVariation[]>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Mock comment variations
  const comments: CommentVariation[] = [
    {
      id: uuidv4(),
      text: "Really appreciated how you explained arrow functions with practical examples. Made the concept click for me finally!"
    },
    {
      id: uuidv4(),
      text: "The section on async/await at 12:48 was particularly helpful for a project I'm working on. Thanks for the clear explanation!"
    },
    {
      id: uuidv4(),
      text: "Question: How would you handle error cases when using async/await? Would love to see a follow-up video on that topic."
    },
    {
      id: uuidv4(),
      text: "This video helped me understand destructuring better than my entire CS degree 😂 Subscribed for more content like this!"
    },
    {
      id: uuidv4(),
      text: "I've been coding in JavaScript for years and still learned new tricks from this video. The examples around 18:30 were eye-opening."
    }
  ];
  
  return {
    success: true,
    data: comments
  };
};

export const exportNotes = async (
  format: 'pdf' | 'docx',
  summary: VideoSummary,
  quiz?: Quiz
): Promise<ApiResponse<string>> => {
  // In a real extension, this would generate and return a download URL
  // For the demo, we'll just return success
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    data: "export_successful"
  };
};
