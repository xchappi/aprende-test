import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';


const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

const anthropic = new Anthropic({
  apiKey: CLAUDE_API_KEY,
});

export async function generateExam(comunidadAutonoma: string, nivel: string, curso: string, asignatura: string) {
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1024,
      messages: [{ role: "user", content: `Genera un examen de ${asignatura} para ${curso} de ${nivel} en la comunidad autónoma de ${comunidadAutonoma}. El examen debe tener 10 preguntas variadas y adecuadas al nivel educativo. Incluye también las respuestas correctas al final.` }],
    });
    console.log({content: response.content});
    
    return ({ exam: (<any>response.content[0]).text });
  } catch (error) {
    console.error('Error al llamar a la API de Claude:', error);
    return NextResponse.json({ error: 'No se pudo generar el examen' }, { status: 500 });
  }
}