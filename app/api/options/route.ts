import { NextResponse } from 'next/server';
import { getOptions } from '@/lib/db';

export async function GET() {
  try {
    const options = await getOptions();
    return NextResponse.json(options);
  } catch (error) {
    console.error('Error al obtener las opciones:', error);
    return NextResponse.json(
      { error: 'Error al obtener las opciones' },
      { status: 500 }
    );
  }
}