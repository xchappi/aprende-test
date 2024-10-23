'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExamDisplay } from './exam-display';
import { Card, CardContent } from '@/components/ui/card';

interface Options {
  regions: string[];
  subjects: string[];
  educationLevels: {
    name: string;
    grades: number[];
  }[];
}

interface ExamData {
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

export function ExamGenerator() {
  const [comunidadAutonoma, setComunidadAutonoma] = useState('Madrid');
  const [nivel, setNivel] = useState('primaria');
  const [curso, setCurso] = useState('4');
  const [asignatura, setAsignatura] = useState('Matemáticas');
  const [exam, setExam] = useState<ExamData | null>(null);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<Options | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    async function fetchOptions() {
      try {
        const response = await fetch('/api/options');
        if (!response.ok) {
          throw new Error('Error al cargar las opciones');
        }
        const data = await response.json();
        setOptions(data);
      } catch (error) {
        setError('No se pudieron cargar las opciones. Por favor, intenta más tarde.');
        console.error('Error al cargar las opciones:', error);
      }
    }

    fetchOptions();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setShowAnswers(false);
    try {
      const response = await fetch('/api/generate-exam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comunidadAutonoma, nivel, curso, asignatura }),
      });
      
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      
      const data = await response.json();
      setExam(data.exam);
    } catch (error) {
      console.error('Error al generar el examen:', error);
      setError('Hubo un error al generar el examen. Por favor, inténtalo de nuevo.');
    }
    setLoading(false);
  };

  const availableGrades = options?.educationLevels.find(el => el.name === nivel)?.grades || [];

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <Select value={comunidadAutonoma} onValueChange={setComunidadAutonoma}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una comunidad autónoma" />
            </SelectTrigger>
            <SelectContent>
              {options?.regions.map(region => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={nivel} onValueChange={setNivel}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un nivel" />
            </SelectTrigger>
            <SelectContent>
              {options?.educationLevels.map(level => (
                <SelectItem key={level.name} value={level.name}>
                  {level.name.charAt(0).toUpperCase() + level.name.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={curso} onValueChange={setCurso} disabled={!nivel}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un curso" />
            </SelectTrigger>
            <SelectContent>
              {availableGrades.map(grade => (
                <SelectItem key={grade} value={grade.toString()}>
                  {grade}º de {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={asignatura} onValueChange={setAsignatura}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una asignatura" />
            </SelectTrigger>
            <SelectContent>
              {options?.subjects.map(subject => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-4">
            <Button 
              onClick={handleGenerate} 
              disabled={loading || !comunidadAutonoma || !nivel || !curso || !asignatura}
              className="flex-1"
            >
              {loading ? 'Generando...' : 'Generar Examen'}
            </Button>
            
            {exam && (
              <Button 
                variant="outline" 
                onClick={() => setShowAnswers(!showAnswers)}
              >
                {showAnswers ? 'Ocultar Respuestas' : 'Ver Respuestas'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {exam && (
        <ExamDisplay exam={exam} showAnswers={showAnswers} />
      )}
    </div>
  );
}