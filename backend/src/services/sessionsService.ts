import { get, run } from '../db/mysql.js'

export async function openClassSession(input: {
  professorUsuarioId: string
  turmaId: number
  conteudo?: string
  latitude?: number
  longitude?: number
}): Promise<{
  chamadaId: number
  turmaId: number
  dataChamada: string
  conteudo: string | null
}> {
  const professor = await get<{ id: number }>(
    'SELECT id FROM professores WHERE usuario_id = ? LIMIT 1',
    [Number(input.professorUsuarioId)]
  )
  if (!professor) throw new Error('Usuário não é professor.')

  const turma = await get<{ id: number }>(
    'SELECT id FROM turmas WHERE id = ? AND professor_id = ? LIMIT 1',
    [input.turmaId, professor.id]
  )
  if (!turma) throw new Error('Turma não encontrada para este professor.')

  const insert = await run(
    `INSERT INTO chamadas (turma_id, data_chamada, conteudo, latitude, longitude)
     VALUES (?, CURDATE(), ?, ?, ?)`,
    [input.turmaId, input.conteudo ?? null, input.latitude ?? null, input.longitude ?? null]
  )

  const chamadaId = insert.insertId
  if (!chamadaId) throw new Error('Falha ao abrir chamada.')

  return {
    chamadaId,
    turmaId: input.turmaId,
    dataChamada: new Date().toISOString().slice(0, 10),
    conteudo: input.conteudo ?? null,
  }
}

export async function studentCheckIn(input: {
  studentUsuarioId: string
  chamadaId: number
}): Promise<{ chamadaId: number; alunoId: number; presente: true }> {
  const aluno = await get<{ id: number }>(
    'SELECT id FROM alunos WHERE usuario_id = ? LIMIT 1',
    [Number(input.studentUsuarioId)]
  )
  if (!aluno) throw new Error('Usuário não é aluno.')

  const session = await get<{
    id: number
  }>(
    `SELECT id
     FROM chamadas
     WHERE id = ?
     LIMIT 1`,
    [input.chamadaId]
  )

  if (!session) {
    throw new Error('Chamada não encontrada.')
  }

  try {
    await run(
      `INSERT INTO chamada_alunos (chamada_id, aluno_id, presente)
       VALUES (?, ?, 1)`,
      [session.id, aluno.id]
    )
  } catch (err: any) {
    if (String(err?.message ?? '').toUpperCase().includes('DUPLICATE')) {
      throw new Error('Você já fez check-in nesta chamada.')
    }
    throw err
  }

  return { chamadaId: session.id, alunoId: aluno.id, presente: true }
}

