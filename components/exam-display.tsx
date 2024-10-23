import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ExamQuestion {
  number: number;
  text: string;
  options: string[];
  correctAnswer: string;
}

interface ExamData {
  title: string;
  subject: string;
  level: string;
  grade: string;
  region: string;
  questions: ExamQuestion[];
}

interface ExamDisplayProps {
  exam: ExamData;
  showAnswers?: boolean;
}

export function ExamDisplay({ exam, showAnswers = false }: ExamDisplayProps) {
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<number, string>>({});

  const handleAnswerChange = (questionNumber: number, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionNumber]: answer
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{exam.title}</CardTitle>
          <div className="text-sm text-muted-foreground">
            <p>Nivel: {exam.grade}º - {exam.level} </p>
            <p>Asignatura: {exam.subject}</p>
            <p>Comunidad Autónoma: {exam.region}</p>
          </div>
        </CardHeader>
      </Card>

      {exam.questions.map((question) => (
        <Card key={question.number} className="relative">
          <CardHeader>
            <CardTitle className="text-lg">
              Pregunta {question.number}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-base mb-4">{question.text}</p>
            <RadioGroup
              value={selectedAnswers[question.number]}
              onValueChange={(value) => handleAnswerChange(question.number, value)}
            >
              {question.options.map((option, index) => {
                const isCorrect = option === question.correctAnswer;
                const isSelected = selectedAnswers[question.number] === option;
                let optionClassName = "relative flex items-center rounded-lg border p-4 hover:bg-muted/50";
                
                if (showAnswers) {
                  if (isCorrect) {
                    optionClassName += " border-green-500 bg-green-50 dark:bg-green-900/10";
                  } else if (isSelected && !isCorrect) {
                    optionClassName += " border-red-500 bg-red-50 dark:bg-red-900/10";
                  }
                }

                return (
                  <div key={index} className={optionClassName}>
                    <RadioGroupItem
                      value={option}
                      id={`q${question.number}-option${index}`}
                      className="mr-2"
                    />
                    <Label
                      htmlFor={`q${question.number}-option${index}`}
                      className="flex-grow cursor-pointer"
                    >
                      {option}
                    </Label>
                    {showAnswers && isCorrect && (
                      <span className="absolute right-4 text-green-600 dark:text-green-400">
                        ✓ Correcta
                      </span>
                    )}
                  </div>
                );
              })}
            </RadioGroup>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}