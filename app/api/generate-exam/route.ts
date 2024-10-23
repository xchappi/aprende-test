// app/api/generate-exam/route.ts
import { NextResponse } from 'next/server';
import { getRandomQuestions } from '@/lib/db';
import type { ExamParams } from '@/lib/db';

interface ExamResponse {
  title: string;
  subject: string;
  level: string;
  grade: string;
  region: string;
  questions: {
    number: number;
    text: string;
    options: string[];
    correctAnswer: string;
  }[];
}

export async function POST(request: Request) {
  try {
    const params: ExamParams = await request.json();
    
    // Obtener preguntas aleatorias de la base de datos
    const questions = await getRandomQuestions(params);
    
    // Formar el examen como una estructura de datos
    const exam: ExamResponse = {
      title: `Examen de ${params.asignatura}`,
      subject: params.asignatura,
      level: params.nivel,
      grade: params.curso,
      region: params.comunidadAutonoma,
      questions: questions.map((q, index) => ({
        number: index + 1,
        text: q.question_text,
        // Mezclar las opciones de respuesta
        options: [...q.wrong_answers, q.correct_answer]
          .sort(() => Math.random() - 0.5),
        correctAnswer: q.correct_answer
      }))
    };

    return NextResponse.json({ exam });
  } catch (error) {
    console.error('Error al generar el examen:', error);
    return NextResponse.json(
      { error: 'Error al generar el examen' }, 
      { status: 500 }
    );
  }
}