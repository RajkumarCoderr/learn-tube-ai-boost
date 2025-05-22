
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { QuizQuestion } from '@/types';
import { generateQuiz } from '@/services/apiService';

export const QuizTab = () => {
  const { quiz, setQuiz, isLoading, setIsLoading, videoSummary, currentVideoId } = useApp();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [revealAnswer, setRevealAnswer] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [questionCount, setQuestionCount] = useState(10);

  const handleGenerateQuiz = async () => {
    if (!videoSummary || !currentVideoId) return;
    
    setIsLoading(true);
    try {
      const result = await generateQuiz(currentVideoId, questionCount);
      if (result.success && result.data) {
        setQuiz(result.data);
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setRevealAnswer(false);
        setQuizCompleted(false);
        setCorrectAnswers(0);
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = (option: string) => {
    if (!revealAnswer) {
      setSelectedOption(option);
    }
  };

  const handleNextQuestion = () => {
    const question = quiz?.questions[currentQuestionIndex];
    if (question && selectedOption === question.correctAnswer) {
      setCorrectAnswers(prev => prev + 1);
    }
    
    setRevealAnswer(false);
    setSelectedOption(null);
    
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setRevealAnswer(false);
    setQuizCompleted(false);
    setCorrectAnswers(0);
  };

  const currentQuestion: QuizQuestion | undefined = 
    quiz?.questions[currentQuestionIndex];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-40 w-full" />
        <div className="space-y-2 mt-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h3 className="text-xl font-semibold mb-3">Quiz Generator</h3>
        <p className="text-muted-foreground mb-4">Generate quiz questions based on the video to test your knowledge.</p>
        
        <div className="w-full max-w-xs mb-4">
          <Label htmlFor="question-count" className="text-sm font-medium mb-2 block">
            Number of questions: {questionCount}
          </Label>
          <Slider
            id="question-count"
            min={5}
            max={20}
            step={1}
            value={[questionCount]}
            onValueChange={(value) => setQuestionCount(value[0])}
            className="mb-6"
          />
        </div>
        
        <Button 
          onClick={handleGenerateQuiz} 
          disabled={!videoSummary || !currentVideoId}
        >
          Generate Quiz
        </Button>
        
        {!videoSummary && (
          <p className="text-sm text-muted-foreground mt-4">
            Please generate a video summary first.
          </p>
        )}
      </div>
    );
  }

  if (quizCompleted) {
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    return (
      <div className="flex flex-col items-center justify-center animate-in">
        <h2 className="text-2xl font-bold mb-2">Quiz Completed!</h2>
        <p className="text-lg mb-6">
          Your score: {correctAnswers} out of {quiz.questions.length} ({score}%)
        </p>
        
        <div className="w-full mb-6">
          <Progress value={score} className="h-3" />
        </div>
        
        <div className="space-y-4 w-full">
          {score >= 80 ? (
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="text-center">
                <span className="text-4xl mb-2 block">🎉</span>
                <h3 className="font-bold text-green-800">Excellent Work!</h3>
                <p className="text-green-700">You've mastered this content.</p>
              </div>
            </Card>
          ) : score >= 50 ? (
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <div className="text-center">
                <span className="text-4xl mb-2 block">👍</span>
                <h3 className="font-bold text-yellow-800">Good Job!</h3>
                <p className="text-yellow-700">You're on the right track.</p>
              </div>
            </Card>
          ) : (
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="text-center">
                <span className="text-4xl mb-2 block">📚</span>
                <h3 className="font-bold text-red-800">Keep Learning!</h3>
                <p className="text-red-700">Review the material and try again.</p>
              </div>
            </Card>
          )}
        </div>
        
        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={resetQuiz}>
            Retry Quiz
          </Button>
          <Button variant="default" onClick={handleGenerateQuiz}>
            Generate New Quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </p>
          <Progress 
            value={((currentQuestionIndex + 1) / quiz.questions.length) * 100} 
            className="h-1.5 mt-1" 
          />
        </div>
      </div>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">
          {currentQuestion?.question}
        </h3>
        
        <div className="space-y-2">
          {currentQuestion?.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className={`w-full justify-start text-left h-auto py-3 px-4 whitespace-normal ${
                selectedOption === option
                  ? revealAnswer
                    ? option === currentQuestion.correctAnswer
                      ? 'bg-green-100 border-green-500'
                      : 'bg-red-100 border-red-500'
                    : 'bg-primary/10 border-primary/30'
                  : revealAnswer && option === currentQuestion.correctAnswer
                  ? 'bg-green-100 border-green-500'
                  : ''
              }`}
              onClick={() => handleOptionSelect(option)}
            >
              <div className="flex items-start">
                <span className="mr-2 font-semibold">{String.fromCharCode(65 + index)}.</span>
                <span>{option}</span>
              </div>
            </Button>
          ))}
        </div>
        
        <div className="mt-6 flex justify-between">
          {!revealAnswer ? (
            <Button
              disabled={!selectedOption}
              onClick={() => setRevealAnswer(true)}
            >
              Check Answer
            </Button>
          ) : (
            <Button onClick={handleNextQuestion}>
              {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'See Results'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
