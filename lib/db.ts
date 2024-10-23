// lib/db.ts
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL as string,
  authToken: process.env.TURSO_AUTH_TOKEN as string,
});

export interface Question {
  id: number;
  question_text: string;
  correct_answer: string;
  wrong_answers: string[];
  difficulty: number;
}

export interface ExamParams {
  comunidadAutonoma: string;
  nivel: string;
  curso: string;
  asignatura: string;
}

export async function getRandomQuestions(params: ExamParams): Promise<Question[]> {
  const { comunidadAutonoma, nivel, curso, asignatura } = params;
  
  const result = await (<any>client).execute(`
    WITH filtered_questions AS (
      SELECT 
        q.id,
        q.question_text,
        q.correct_answer,
        q.difficulty,
        GROUP_CONCAT(wa.answer_text) as wrong_answers
      FROM questions q
      LEFT JOIN wrong_answers wa ON wa.question_id = q.id
      JOIN subjects s ON s.id = q.subject_id
      JOIN education_levels el ON el.id = q.education_level_id
      JOIN regions r ON r.id = q.region_id
      WHERE r.name = ?
      AND el.name = ?
      AND el.grade = ?
      AND s.name = ?
      GROUP BY q.id
      ORDER BY RANDOM()
      LIMIT 10
    )
    SELECT * FROM filtered_questions;
  `, [comunidadAutonoma, nivel, parseInt(curso), asignatura]);

  return result.rows.map((row: { id: number; question_text: string; correct_answer: string; difficulty: number; wrong_answers: string; }) => ({
    id: row.id as number,
    question_text: row.question_text as string,
    correct_answer: row.correct_answer as string,
    difficulty: row.difficulty as number,
    wrong_answers: row.wrong_answers ? (row.wrong_answers as string).split(',') : []
  }));
  
}


export interface Options {
    regions: string[];
    subjects: string[];
    educationLevels: {
      name: string;
      grades: number[];
    }[];
  }
  
  export async function getOptions(): Promise<Options> {
    // Obtener comunidades autónomas
    const regionsResult = await client.execute(`
      SELECT DISTINCT name 
      FROM regions 
      ORDER BY name`
    );
    
    // Obtener asignaturas
    const subjectsResult = await client.execute(`
      SELECT DISTINCT name 
      FROM subjects 
      ORDER BY name`
    );
    
    // Obtener niveles educativos y sus cursos
    const educationLevelsResult = await client.execute(`
      SELECT DISTINCT name, GROUP_CONCAT(grade) as grades
      FROM education_levels
      GROUP BY name
      ORDER BY name`
    );
  
    const educationLevels = educationLevelsResult.rows.map(row => ({
      name: row.name as string,
      grades: (row.grades as string).split(',').map(Number).sort((a, b) => a - b)
    }));
  
    return {
      regions: regionsResult.rows.map(row => row.name as string),
      subjects: subjectsResult.rows.map(row => row.name as string),
      educationLevels
    };
  }
  