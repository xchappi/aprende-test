'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { generateExam } from '@/lib/claude-api';

export function ExamGenerator() {
  const [comunidadAutonoma, setComunidadAutonoma] = useState('');
  const [nivel, setNivel] = useState('');
  const [curso, setCurso] = useState('');
  const [asignatura, setAsignatura] = useState('');
  const [exam, setExam] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const generatedExam = await generateExam(comunidadAutonoma, nivel, curso, asignatura);
      setExam(generatedExam);
    } catch (error) {
      console.error('Error al generar el examen:', error);
      setExam('Hubo un error al generar el examen. Por favor, inténtalo de nuevo.');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <Select onValueChange={setComunidadAutonoma}>
        <SelectTrigger>
          <SelectValue placeholder="Selecciona una comunidad autónoma" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="andalucia">Andalucía</SelectItem>
          <SelectItem value="madrid">Madrid</SelectItem>
          {/* Añadir más comunidades autónomas */}
        </SelectContent>
      </Select>

      <Select onValueChange={setNivel}>
        <SelectTrigger>
          <SelectValue placeholder="Selecciona un nivel" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="primaria">Primaria</SelectItem>
          <SelectItem value="eso">ESO</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={setCurso}>
        <SelectTrigger>
          <SelectValue placeholder="Selecciona un curso" />
        </SelectTrigger>
        <SelectContent>
          {nivel === 'primaria' ? (
            <>
              <SelectItem value="1">1º de Primaria</SelectItem>
              <SelectItem value="2">2º de Primaria</SelectItem>
              <SelectItem value="3">3º de Primaria</SelectItem>
              <SelectItem value="4">4º de Primaria</SelectItem>
              <SelectItem value="5">5º de Primaria</SelectItem>
              <SelectItem value="6">6º de Primaria</SelectItem>
            </>
          ) : (
            <>
              <SelectItem value="1">1º de ESO</SelectItem>
              <SelectItem value="2">2º de ESO</SelectItem>
              <SelectItem value="3">3º de ESO</SelectItem>
              <SelectItem value="4">4º de ESO</SelectItem>
            </>
          )}
        </SelectContent>
      </Select>

      <Select onValueChange={setAsignatura}>
        <SelectTrigger>
          <SelectValue placeholder="Selecciona una asignatura" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="matematicas">Matemáticas</SelectItem>
          <SelectItem value="lengua">Lengua Castellana y Literatura</SelectItem>
          <SelectItem value="ciencias">Ciencias Naturales</SelectItem>
          <SelectItem value="sociales">Ciencias Sociales</SelectItem>
          {/* Añadir más asignaturas según el nivel y curso */}
        </SelectContent>
      </Select>

      <Button onClick={handleGenerate} disabled={loading || !comunidadAutonoma || !nivel || !curso || !asignatura}>
        {loading ? 'Generando...' : 'Generar Examen'}
      </Button>

      {exam && (
        <Textarea
          value={exam}
          readOnly
          className="h-64"
          placeholder="El examen generado aparecerá aquí"
        />
      )}
    </div>
  );
}