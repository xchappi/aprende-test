import axios from 'axios';

const CLAUDE_API_URL = process.env.CLAUDE_API_URL;
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

export async function generateExam(comunidadAutonoma: string, nivel: string, curso: string, asignatura: string): Promise<string> {
  try {
    const response = await axios.post(
      CLAUDE_API_URL!,
      {
        prompt: `Genera un examen de ${asignatura} para ${curso} de ${nivel} en la comunidad autónoma de ${comunidadAutonoma}. El examen debe tener 10 preguntas variadas y adecuadas al nivel educativo. Incluye también las respuestas correctas al final.`,
        max_tokens_to_sample: 1000,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
        },
      }
    );

    return response.data.completion;
  } catch (error) {
    console.error('Error al llamar a la API de Claude:', error);
    throw new Error('No se pudo generar el examen');
  }
}