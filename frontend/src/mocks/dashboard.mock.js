export const mockTeacherProfile = {
  name: 'Carlos',
  email: 'carlos@pucpr.edu.br',
};

export const mockMetrics = {
  aulasHoje: 4,
  frequenciaMedia: 86,
  frequenciaMediaDelta: 2.4,
  chamadasMes: 42,
};

export const mockAulasHoje = [
  {
    id: 1,
    inicio: '08:00',
    fim: '09:30',
    disciplina: 'Cálculo Numérico',
    turma: 'T.B',
    sala: 'A-101',
    totalAlunos: 32,
    presentes: 25,
    percentualPresenca: 78,
    status: 'encerrada',
  },
  {
    id: 2,
    inicio: '10:30',
    fim: '12:00',
    disciplina: 'Eng. de Software',
    turma: 'T.A',
    sala: 'B-204',
    totalAlunos: 30,
    presentes: 19,
    percentualPresenca: 63,
    status: 'em_curso',
    automatica: true,
  },
  {
    id: 3,
    inicio: '14:00',
    fim: '15:30',
    disciplina: 'Eng. de Software',
    turma: 'T.B',
    sala: 'B-204',
    totalAlunos: 28,
    presentes: 0,
    percentualPresenca: 0,
    status: 'programada',
  },
  {
    id: 4,
    inicio: '16:00',
    fim: '17:30',
    disciplina: 'Padrões de Projeto',
    turma: 'T.A',
    sala: 'C-316',
    totalAlunos: 25,
    presentes: 0,
    percentualPresenca: 0,
    status: 'nao_definida',
  },
];

/**
 * Status possíveis: 'encerrada' | 'em_curso' | 'programada' | 'nao_definida'
 * Dias: 0 = SEG, 1 = TER, 2 = QUA, 3 = QUI, 4 = SEX
 */
export const mockWeekCalendar = [
  { dia: 0, hora: '08h', label: 'Cálc. enc.', status: 'encerrada' },
  { dia: 0, hora: '10h', label: 'Eng.SW B-204', status: 'encerrada' },
  { dia: 0, hora: '14h', label: 'Eng.SW T.B', status: 'encerrada' },
  { dia: 0, hora: '16h', label: 'Padrões', status: 'encerrada' },

  { dia: 1, hora: '10h', label: 'Eng.SW', status: 'encerrada' },

  { dia: 2, hora: '08h', label: 'Cálc. enc.', status: 'encerrada' },
  { dia: 2, hora: '10h', label: 'Eng.SW auto', status: 'programada' },
  { dia: 2, hora: '16h', label: 'Padrões', status: 'encerrada' },

  { dia: 3, hora: '10h', label: 'Eng.SW ★', status: 'em_curso' },
  { dia: 3, hora: '14h', label: 'Eng.SW T.B prog.', status: 'programada' },
  { dia: 3, hora: '16h', label: 'Padrões', status: 'nao_definida' },

  { dia: 4, hora: '10h', label: 'Eng.SW', status: 'programada' },
];

export const mockIndicadores = {
  totalAlunos: 186,
  totalTurmas: 6,
  alunosNovosDelta: 4,
  proximosEventos: 12,
  proximasAulas: 8,
  proximasProvas: 4,
  eventosDelta: 5,
  alunosEmRisco: 7,
  limiteRisco: 75,
  alunosEmRiscoDelta: 1,
};

export const mockUltimasChamadas = [
  {
    id: 1,
    codigo: '#CC-3041',
    disciplina: 'Eng. de Software',
    turma: 'A',
    presenca: 87,
    ultimaChamada: '07/05/2026',
  },
  {
    id: 2,
    codigo: '#CC-3041',
    disciplina: 'Eng. de Software',
    turma: 'B',
    presenca: 92,
    ultimaChamada: '06/05/2026',
  },
  {
    id: 3,
    codigo: '#MA-2014',
    disciplina: 'Cálculo Numérico',
    turma: 'B',
    presenca: 68,
    ultimaChamada: '07/05/2026',
  },
];

export const mockDistribuicaoPresenca = {
  totalAlunos: 186,
  mes: 'Maio',
  categorias: [
    { label: 'Frequência regular', valor: 93, percentual: 50, cor: '#22c55e' },
    { label: 'Em observação',      valor: 46, percentual: 25, cor: '#38bdf8' },
    { label: 'Justificativa pendente', valor: 19, percentual: 10, cor: '#fb923c' },
    { label: 'Abaixo do mínimo',   valor: 28, percentual: 15, cor: '#ef4444' },
  ],
};
