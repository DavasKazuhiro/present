import crypto from 'node:crypto'
import { all, get, run, transaction } from '../db/mysql.js'

type ClassSchedule = {
  id: number
  diaSemana: number
  horaInicio: string
  horaFim: string
}

type TeacherClassRow = {
  id: number
  nome: string
  disciplina: string
  curso: string
  descricao: string | null
  cor: string
  turno: string
  hora_inicio: string
  hora_fim: string
  enrolled_count: number
  attendances_done: number
  present_count: number
  possible_count: number
  open_session_id: number | null
}

function formatTime(value: string) {
  return String(value).slice(0, 5)
}

function mapClass(row: TeacherClassRow, schedules: ClassSchedule[] = []) {
  const possible = Number(row.possible_count)
  const present = Number(row.present_count)
  const rate = possible > 0 ? Math.round((present / possible) * 1000) / 10 : 0

  return {
    id: row.id,
    nome: row.nome,
    name: row.nome,
    disciplina: row.disciplina,
    subject: row.disciplina,
    curso: row.curso,
    course: row.curso,
    descricao: row.descricao,
    description: row.descricao,
    cor: row.cor,
    color: row.cor,
    turno: row.turno,
    startTime: formatTime(row.hora_inicio),
    endTime: formatTime(row.hora_fim),
    schedule: schedules.length
      ? schedules.map((item) => `${item.horaInicio}-${item.horaFim}`).join(', ')
      : `${formatTime(row.hora_inicio)} - ${formatTime(row.hora_fim)}`,
    schedules,
    section: row.turno,
    code: `TUR-${row.id}`,
    room: 'Local definido pelo professor',
    group: row.nome,
    enrolledCount: Number(row.enrolled_count),
    attendancesDone: Number(row.attendances_done),
    semesterRate: rate,
    openSessionId: row.open_session_id,
  }
}

async function getProfessorId(usuarioId: string) {
  const professor = await get<{ id: number }>(
    'SELECT id FROM professores WHERE usuario_id = ? LIMIT 1',
    [Number(usuarioId)]
  )
  if (!professor) throw new Error('Usuário não é professor.')
  return professor.id
}

async function getAlunoId(usuarioId: string) {
  const aluno = await get<{ id: number }>(
    'SELECT id FROM alunos WHERE usuario_id = ? LIMIT 1',
    [Number(usuarioId)]
  )
  if (!aluno) throw new Error('Usuário não é aluno.')
  return aluno.id
}

async function listSchedulesForClassIds(turmaIds: number[]) {
  const grouped = new Map<number, ClassSchedule[]>()
  if (!turmaIds.length) return grouped

  const rows = await all<{
    turma_id: number
    id: number
    dia_semana: number
    hora_inicio: string
    hora_fim: string
  }>(
    `SELECT turma_id, id, dia_semana, hora_inicio, hora_fim
     FROM turma_horarios
     WHERE turma_id IN (${turmaIds.map(() => '?').join(',')})
     ORDER BY dia_semana ASC, hora_inicio ASC`,
    turmaIds
  )

  for (const row of rows) {
    grouped.set(row.turma_id, [
      ...(grouped.get(row.turma_id) ?? []),
      {
        id: row.id,
        diaSemana: Number(row.dia_semana),
        horaInicio: formatTime(row.hora_inicio),
        horaFim: formatTime(row.hora_fim),
      },
    ])
  }

  return grouped
}

function baseClassSelect(where: string) {
  return `
    SELECT
      t.id,
      t.nome,
      t.disciplina,
      t.curso,
      t.descricao,
      t.cor,
      t.turno,
      t.hora_inicio,
      t.hora_fim,
      COUNT(DISTINCT ta.aluno_id) AS enrolled_count,
      COUNT(DISTINCT c.id) AS attendances_done,
      COUNT(DISTINCT ca.aluno_id, ca.chamada_id) AS present_count,
      COUNT(DISTINCT c.id) * COUNT(DISTINCT ta.aluno_id) AS possible_count,
      MAX(
        CASE
          WHEN c.aberta_ate > NOW()
           AND c.encerrada_em IS NULL
           AND c.status = 'open'
          THEN c.id
          ELSE NULL
        END
      ) AS open_session_id
    FROM turmas t
    LEFT JOIN turma_alunos ta ON ta.turma_id = t.id AND ta.status = 'active'
    LEFT JOIN chamadas c ON c.turma_id = t.id
    LEFT JOIN chamada_alunos ca ON ca.chamada_id = c.id AND ca.presente = 1
    ${where}
    GROUP BY t.id
  `
}

export async function listTeacherClasses(usuarioId: string) {
  const professorId = await getProfessorId(usuarioId)
  const rows = await all<TeacherClassRow>(
    `${baseClassSelect('WHERE t.professor_id = ?')}
     ORDER BY t.data_criacao DESC, t.id DESC`,
    [professorId]
  )
  const schedules = await listSchedulesForClassIds(rows.map((row) => row.id))
  return rows.map((row) => mapClass(row, schedules.get(row.id)))
}

export async function createClass(
  usuarioId: string,
  input: {
    nome: string
    disciplina: string
    curso: string
    descricao?: string
    cor: string
    turno: 'Manhã' | 'Tarde' | 'Noite' | 'Integral'
    horaInicio: string
    horaFim: string
    horarios?: Array<{
      diaSemana: number
      horaInicio: string
      horaFim: string
    }>
  }
) {
  const professorId = await getProfessorId(usuarioId)
  const horarios = input.horarios?.length
    ? input.horarios
    : [{ diaSemana: 1, horaInicio: input.horaInicio, horaFim: input.horaFim }]
  const firstSchedule = horarios[0]
  if (!firstSchedule) throw new Error('Informe pelo menos um horário.')

  const turmaId = await transaction(async (client) => {
    const insert = await run(
      `INSERT INTO turmas
         (professor_id, nome, disciplina, curso, descricao, cor, turno, hora_inicio, hora_fim, duracao_chamada)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '00:07:00')`,
      [
        professorId,
        input.nome,
        input.disciplina,
        input.curso,
        input.descricao ?? null,
        input.cor,
        input.turno,
        firstSchedule.horaInicio,
        firstSchedule.horaFim,
      ],
      client
    )

    for (const horario of horarios) {
      await run(
        `INSERT INTO turma_horarios (turma_id, dia_semana, hora_inicio, hora_fim)
         VALUES (?, ?, ?, ?)`,
        [insert.insertId, horario.diaSemana, horario.horaInicio, horario.horaFim],
        client
      )
    }

    return insert.insertId
  })

  const turma = await getTeacherClass(usuarioId, turmaId)
  if (!turma) throw new Error('Falha ao criar turma.')
  return turma
}

export async function getTeacherClass(usuarioId: string, turmaId: number) {
  const professorId = await getProfessorId(usuarioId)
  const rows = await all<TeacherClassRow>(
    `${baseClassSelect('WHERE t.id = ? AND t.professor_id = ?')}
     LIMIT 1`,
    [turmaId, professorId]
  )

  if (!rows[0]) return null
  const schedules = await listSchedulesForClassIds([rows[0].id])
  return mapClass(rows[0], schedules.get(rows[0].id))
}

export async function listClassStudents(usuarioId: string, turmaId: number) {
  const professorId = await getProfessorId(usuarioId)
  const turma = await get<{ id: number }>(
    'SELECT id FROM turmas WHERE id = ? AND professor_id = ? LIMIT 1',
    [turmaId, professorId]
  )
  if (!turma) throw new Error('Turma não encontrada para este professor.')

  return all<{
    id: number
    name: string
    email: string
    status: string
    enrolledAt: string
  }>(
    `SELECT a.id, u.nome AS name, u.email, ta.status, ta.data_matricula AS enrolledAt
     FROM turma_alunos ta
     INNER JOIN alunos a ON a.id = ta.aluno_id
     INNER JOIN usuarios u ON u.id = a.usuario_id
     WHERE ta.turma_id = ? AND ta.status = 'active'
     ORDER BY u.nome ASC`,
    [turmaId]
  )
}

export async function enrollStudentByEmail(usuarioId: string, turmaId: number, email: string) {
  const professorId = await getProfessorId(usuarioId)
  const student = await get<{ aluno_id: number; name: string; email: string }>(
    `SELECT a.id AS aluno_id, u.nome AS name, u.email
     FROM usuarios u
     INNER JOIN alunos a ON a.usuario_id = u.id
     WHERE u.email = ? AND u.tipo = 'aluno'
     LIMIT 1`,
    [email]
  )
  if (!student) throw new Error('Aluno não encontrado com este e-mail.')

  await transaction(async (client) => {
    const turma = await get<{ id: number }>(
      'SELECT id FROM turmas WHERE id = ? AND professor_id = ? LIMIT 1',
      [turmaId, professorId],
      client
    )
    if (!turma) throw new Error('Turma não encontrada para este professor.')

    await run(
      `INSERT INTO turma_alunos (turma_id, aluno_id, status)
       VALUES (?, ?, 'active')
       ON DUPLICATE KEY UPDATE status = 'active'`,
      [turmaId, student.aluno_id],
      client
    )
  })

  return {
    id: student.aluno_id,
    name: student.name,
    email: student.email,
  }
}

export async function removeStudentFromClass(usuarioId: string, turmaId: number, alunoId: number) {
  const professorId = await getProfessorId(usuarioId)
  const result = await run(
    `UPDATE turma_alunos ta
     INNER JOIN turmas t ON t.id = ta.turma_id
     SET ta.status = 'removed'
     WHERE ta.turma_id = ? AND ta.aluno_id = ? AND t.professor_id = ?`,
    [turmaId, alunoId, professorId]
  )
  if (!result.affectedRows) throw new Error('Aluno não encontrado nesta matéria.')
  return { removed: true }
}

export async function listAvailableStudents(usuarioId: string, turmaId: number) {
  const professorId = await getProfessorId(usuarioId)
  const turma = await get<{ id: number }>(
    'SELECT id FROM turmas WHERE id = ? AND professor_id = ? LIMIT 1',
    [turmaId, professorId]
  )
  if (!turma) throw new Error('Turma não encontrada para este professor.')

  return all<{ id: number; name: string; email: string }>(
    `SELECT a.id, u.nome AS name, u.email
     FROM alunos a
     INNER JOIN usuarios u ON u.id = a.usuario_id
     WHERE NOT EXISTS (
       SELECT 1 FROM turma_alunos ta
       WHERE ta.turma_id = ? AND ta.aluno_id = a.id AND ta.status = 'active'
     )
     ORDER BY u.nome ASC`,
    [turmaId]
  )
}

export async function listStudentClasses(usuarioId: string) {
  const alunoId = await getAlunoId(usuarioId)
  const rows = await all<
    TeacherClassRow & {
      professor_name: string
      active_session_id: number | null
      active_expires_at: string | null
      active_radius: number | null
      active_answered: number
    }
  >(
    `SELECT
       t.id,
       t.nome,
       t.disciplina,
       t.curso,
       t.descricao,
       t.cor,
       t.turno,
       t.hora_inicio,
       t.hora_fim,
       0 AS enrolled_count,
       COUNT(DISTINCT c_all.id) AS attendances_done,
       COUNT(DISTINCT ca_all.aluno_id, ca_all.chamada_id) AS present_count,
       COUNT(DISTINCT c_all.id) AS possible_count,
       NULL AS open_session_id,
       up.nome AS professor_name,
       c_open.id AS active_session_id,
       c_open.aberta_ate AS active_expires_at,
       c_open.raio_metros AS active_radius,
       CASE WHEN ca_open.aluno_id IS NULL THEN 0 ELSE 1 END AS active_answered
     FROM turma_alunos ta
     INNER JOIN turmas t ON t.id = ta.turma_id
     INNER JOIN professores p ON p.id = t.professor_id
     INNER JOIN usuarios up ON up.id = p.usuario_id
     LEFT JOIN chamadas c_all ON c_all.turma_id = t.id
     LEFT JOIN chamada_alunos ca_all
       ON ca_all.chamada_id = c_all.id AND ca_all.aluno_id = ? AND ca_all.presente = 1
     LEFT JOIN chamadas c_open
       ON c_open.turma_id = t.id
      AND c_open.aberta_ate > NOW()
      AND c_open.encerrada_em IS NULL
      AND c_open.status = 'open'
     LEFT JOIN chamada_alunos ca_open
       ON ca_open.chamada_id = c_open.id AND ca_open.aluno_id = ?
     WHERE ta.aluno_id = ? AND ta.status = 'active'
     GROUP BY t.id, c_open.id, ca_open.aluno_id
     ORDER BY t.hora_inicio ASC, t.nome ASC`,
    [alunoId, alunoId, alunoId]
  )

  const schedules = await listSchedulesForClassIds(rows.map((row) => row.id))
  return rows.map((row) => ({
    ...mapClass({ ...row, enrolled_count: 0 }, schedules.get(row.id)),
    professorName: row.professor_name,
    activeSession: row.active_session_id
      ? {
          id: row.active_session_id,
          expiresAt: row.active_expires_at,
          radiusMeters: row.active_radius,
          answered: Boolean(row.active_answered),
        }
      : null,
  }))
}

export async function getOrCreateInviteLink(usuarioId: string, turmaId: number) {
  const professorId = await getProfessorId(usuarioId)
  const turma = await get<{ id: number }>(
    'SELECT id FROM turmas WHERE id = ? AND professor_id = ? LIMIT 1',
    [turmaId, professorId]
  )
  if (!turma) throw new Error('Turma não encontrada para este professor.')

  const existing = await get<{
    id: number
    token: string
    usos: number
    expira_em: string | null
    max_usos: number | null
  }>(
    `SELECT id, token, usos, expira_em, max_usos
     FROM convite_links
     WHERE turma_id = ? AND ativo = 1
     ORDER BY id DESC
     LIMIT 1`,
    [turmaId]
  )

  if (existing) {
    return {
      id: existing.id,
      turmaId,
      token: existing.token,
      uses: Number(existing.usos),
      expiresAt: existing.expira_em,
      maxUses: existing.max_usos,
    }
  }

  return regenerateInviteLink(usuarioId, turmaId)
}

export async function regenerateInviteLink(usuarioId: string, turmaId: number) {
  const professorId = await getProfessorId(usuarioId)
  const turma = await get<{ id: number }>(
    'SELECT id FROM turmas WHERE id = ? AND professor_id = ? LIMIT 1',
    [turmaId, professorId]
  )
  if (!turma) throw new Error('Turma não encontrada para este professor.')

  const token = crypto.randomUUID()
  await transaction(async (client) => {
    await run('UPDATE convite_links SET ativo = 0 WHERE turma_id = ?', [turmaId], client)
    await run(
      `INSERT INTO convite_links (turma_id, token, criado_por)
       VALUES (?, ?, ?)`,
      [turmaId, token, professorId],
      client
    )
  })

  return { turmaId, token, uses: 0, expiresAt: null, maxUses: null }
}

export async function joinClassByInvite(usuarioId: string, token: string) {
  const alunoId = await getAlunoId(usuarioId)
  const invite = await get<{
    id: number
    turma_id: number
    expira_em: string | null
    max_usos: number | null
    usos: number
  }>(
    `SELECT id, turma_id, expira_em, max_usos, usos
     FROM convite_links
     WHERE token = ? AND ativo = 1
     LIMIT 1`,
    [token]
  )

  if (!invite) throw new Error('Convite inválido ou expirado.')
  if (invite.expira_em && new Date(invite.expira_em).getTime() <= Date.now()) {
    throw new Error('Convite expirado.')
  }
  if (invite.max_usos !== null && Number(invite.usos) >= Number(invite.max_usos)) {
    throw new Error('Convite atingiu o limite de usos.')
  }

  await transaction(async (client) => {
    await run(
      `INSERT INTO turma_alunos (turma_id, aluno_id, status)
       VALUES (?, ?, 'active')
       ON DUPLICATE KEY UPDATE status = 'active'`,
      [invite.turma_id, alunoId],
      client
    )
    await run('UPDATE convite_links SET usos = usos + 1 WHERE id = ?', [invite.id], client)
  })

  const turma = await get<{
    id: number
    nome: string
    disciplina: string
  }>('SELECT id, nome, disciplina FROM turmas WHERE id = ? LIMIT 1', [invite.turma_id])

  return {
    turmaId: invite.turma_id,
    className: turma?.nome,
    subject: turma?.disciplina,
  }
}
