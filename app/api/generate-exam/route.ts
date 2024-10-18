import { NextResponse } from 'next/server';
import { generateExam } from '@/lib/claude-api';



export async function POST(request: Request) {
  const { comunidadAutonoma, nivel, curso, asignatura } = await request.json();
  console.log({ comunidadAutonoma, nivel, curso, asignatura } );
  
  try {
    const response = await generateExam(comunidadAutonoma, nivel, curso, asignatura);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error al generar el examen:', error);
    return NextResponse.json({ error: 'Error al generar el examen' }, { status: 500 });
  }
}