import { all, get, run, transaction } from '../db/mysql.js'

const EARTH_RADIUS_METERS = 6371000

function haversineDistanceMeters(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number }
) {
  const toRad = (value: number) => (value * Math.PI) / 180
  const dLat = toRad(b.latitude - a.latitude)
  const dLon = toRad(b.longitude - a.longitude)
  const lat1 = toRad(a.latitude)
  const lat2 = toRad(b.latitude)

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2

  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(h))
}

function formatDate(value: Date | string) {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value).slice(0, 10)
}

function formatTime(value: string) {
  return String(value).slice(0, 5)
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

async function insertAbsentRecords(chamadaId: number, turmaId: number) {
  await run(
    `INSERT IGNORE INTO chamada_alunos (chamada_id, aluno_id, presente, data_resposta)
     SELECT ?, ta.aluno_id, 0, NOW()
     FROM turma_alunos ta
     WHERE ta.turma_id = ?
       AND ta.status = 'active'
       AND NOT EXISTS (
         SELECT 1
         FROM chamada_alunos ca
         WHERE ca.chamada_id = ? AND ca.aluno_id = ta.aluno_id
       )`,
    [chamadaId, turmaId, chamadaId]
  )
}

async function refreshSessionCounters(chamadaId: number) {
  await run(
    `UPDATE chamadas c
     SET
       c.total_matriculados = (
         SELECT COUNT(*)
         FROM turma_alunos ta
         WHERE ta.turma_id = c.turma_id AND ta.status = 'active'
       ),
       c.total_respondidos = (
         SELECT COUNT(*)
         FROM chamada_alunos ca
         WHERE ca.chamada_id = c.id AND ca.presente = 1
       )
     WHERE c.id = ?`,
    [chamadaId]
  )
}

export async function autoCloseExpiredSessions() {
  const expired = await all<{ id: number; turma_id: number }>(
    `SELECT id, turma_id
     FROM chamadas
     WHERE status = 'open'
       AND aberta_ate <= NOW()
       AND encerrada_em IS NULL`
  )

  for (const session of expired) {
    await transaction(async (client) => {
      await run(
        `INSERT IGNORE INTO chamada_alunos (chamada_id, aluno_id, presente, data_resposta)
         SELECT ?, ta.aluno_id, 0, NOW()
         FROM turma_alunos ta
         WHERE ta.turma_id = ?
           AND ta.status = 'active'
           AND NOT EXISTS (
             SELECT 1
             FROM chamada_alunos ca
             WHERE ca.chamada_id = ? AND ca.aluno_id = ta.aluno_id
           )`,
        [session.id, session.turma_id, session.id],
        client
      )
      await run(
        `UPDATE chamadas
         SET status = 'auto_closed', encerrada_em = NOW()
         WHERE id = ? AND status = 'open'`,
        [session.id],
        client
      )
    })
    await refreshSessionCounters(session.id)
  }

  return expired.length
}

export async function openClassSession(input: {
  professorUsuarioId: string
  turmaId: number
  titulo?: string
  conteudo?: string
  latitude: number
  longitude: number
  raioMetros: number
  duracaoMinutos: number
}): Promise<{
  chamadaId: number
  turmaId: number
  dataChamada: string
  titulo: string | null
  conteudo: string | null
  expiresAt: string
  radiusMeters: number
  latitude: number
  longitude: number
}> {
  const professorId = await getProfessorId(input.professorUsuarioId)

  const activeSession = await get<{ id: number }>(
    `SELECT c.id
     FROM chamadas c
     INNER JOIN turmas t ON t.id = c.turma_id
     WHERE c.turma_id = ?
       AND t.professor_id = ?
       AND c.aberta_ate > NOW()
       AND c.encerrada_em IS NULL
       AND c.status = 'open'
     LIMIT 1`,
    [input.turmaId, professorId]
  )
  if (activeSession) throw new Error('Já existe uma chamada aberta para esta matéria.')

  const turma = await get<{ id: number }>(
    'SELECT id FROM turmas WHERE id = ? AND professor_id = ? LIMIT 1',
    [input.turmaId, professorId]
  )
  if (!turma) throw new Error('Turma não encontrada para este professor.')

  const enrolled = await get<{ total: number }>(
    `SELECT COUNT(*) AS total
     FROM turma_alunos
     WHERE turma_id = ? AND status = 'active'`,
    [input.turmaId]
  )
  const totalEnrolled = Number(enrolled?.total ?? 0)
  if (totalEnrolled <= 0) throw new Error('Adicione alunos antes de abrir a chamada.')

  const insert = await run(
    `INSERT INTO chamadas
       (turma_id, data_chamada, titulo, conteudo, latitude, longitude, raio_metros, aberta_ate, status, total_matriculados, total_respondidos)
     VALUES (?, CURDATE(), ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL ? MINUTE), 'open', ?, 0)`,
    [
      input.turmaId,
      input.titulo ?? null,
      input.conteudo ?? null,
      input.latitude,
      input.longitude,
      input.raioMetros,
      input.duracaoMinutos,
      totalEnrolled,
    ]
  )

  const chamada = await get<{
    id: number
    turma_id: number
    data_chamada: Date | string
    titulo: string | null
    conteudo: string | null
    aberta_ate: string
    raio_metros: number
    latitude: string | number
    longitude: string | number
  }>(
    `SELECT id, turma_id, data_chamada, titulo, conteudo, aberta_ate, raio_metros, latitude, longitude
     FROM chamadas
     WHERE id = ?
     LIMIT 1`,
    [insert.insertId]
  )

  if (!chamada) throw new Error('Falha ao abrir chamada.')

  return {
    chamadaId: chamada.id,
    turmaId: chamada.turma_id,
    dataChamada: formatDate(chamada.data_chamada),
    titulo: chamada.titulo,
    conteudo: chamada.conteudo,
    expiresAt: String(chamada.aberta_ate),
    radiusMeters: Number(chamada.raio_metros),
    latitude: Number(chamada.latitude),
    longitude: Number(chamada.longitude),
  }
}

export async function closeClassSession(input: {
  professorUsuarioId: string
  chamadaId: number
}) {
  const professorId = await getProfessorId(input.professorUsuarioId)
  const session = await get<{ id: number; turma_id: number }>(
    `SELECT c.id, c.turma_id
     FROM chamadas c
     INNER JOIN turmas t ON t.id = c.turma_id
     WHERE c.id = ? AND t.professor_id = ? AND c.encerrada_em IS NULL
     LIMIT 1`,
    [input.chamadaId, professorId]
  )
  if (!session) throw new Error('Chamada não encontrada ou já encerrada.')

  await insertAbsentRecords(session.id, session.turma_id)
  await run(
    `UPDATE chamadas
     SET encerrada_em = NOW(), status = 'closed'
     WHERE id = ? AND encerrada_em IS NULL`,
    [session.id]
  )
  await refreshSessionCounters(session.id)
  return { chamadaId: input.chamadaId, closed: true }
}

export async function studentCheckIn(input: {
  studentUsuarioId: string
  chamadaId: number
  latitude: number
  longitude: number
}): Promise<{
  chamadaId: number
  alunoId: number
  presente: true
  distanceMeters: number
  radiusMeters: number
}> {
  const alunoId = await getAlunoId(input.studentUsuarioId)

  const session = await get<{
    id: number
    turma_id: number
    latitude: string | number
    longitude: string | number
    raio_metros: number
  }>(
    `SELECT id, turma_id, latitude, longitude, raio_metros
     FROM chamadas
     WHERE id = ?
       AND aberta_ate > NOW()
       AND encerrada_em IS NULL
       AND status = 'open'
     LIMIT 1`,
    [input.chamadaId]
  )

  if (!session) throw new Error('Chamada expirada ou não encontrada.')

  const enrolled = await get<{ turma_id: number }>(
    `SELECT turma_id
     FROM turma_alunos
     WHERE turma_id = ? AND aluno_id = ?
       AND status = 'active'
     LIMIT 1`,
    [session.turma_id, alunoId]
  )
  if (!enrolled) throw new Error('Você não está matriculado nesta matéria.')

  const distanceMeters = haversineDistanceMeters(
    {
      latitude: Number(session.latitude),
      longitude: Number(session.longitude),
    },
    {
      latitude: input.latitude,
      longitude: input.longitude,
    }
  )

  if (distanceMeters > Number(session.raio_metros)) {
    throw new Error(
      `Você está a ${Math.round(distanceMeters)}m do professor. O raio permitido é ${session.raio_metros}m.`
    )
  }

  try {
    await run(
      `INSERT INTO chamada_alunos (chamada_id, aluno_id, presente, data_resposta)
       VALUES (?, ?, 1, NOW())`,
      [session.id, alunoId]
    )
  } catch (err: any) {
    if (String(err?.message ?? '').toUpperCase().includes('DUPLICATE')) {
      throw new Error('Você já respondeu esta chamada.')
    }
    throw err
  }

  await run(
    `UPDATE chamada_alunos
     SET latitude = ?, longitude = ?, distancia_metros = ?
     WHERE chamada_id = ? AND aluno_id = ?`,
    [input.latitude, input.longitude, Math.round(distanceMeters * 100) / 100, session.id, alunoId]
  )
  await refreshSessionCounters(session.id)

  const counters = await get<{ total_matriculados: number; total_respondidos: number }>(
    `SELECT total_matriculados, total_respondidos
     FROM chamadas
     WHERE id = ?
     LIMIT 1`,
    [session.id]
  )
  if (
    counters &&
    Number(counters.total_matriculados) > 0 &&
    Number(counters.total_respondidos) >= Number(counters.total_matriculados)
  ) {
    await run(
      `UPDATE chamadas
       SET status = 'auto_closed', encerrada_em = NOW()
       WHERE id = ? AND status = 'open'`,
      [session.id]
    )
  }

  return {
    chamadaId: session.id,
    alunoId,
    presente: true,
    distanceMeters: Math.round(distanceMeters),
    radiusMeters: Number(session.raio_metros),
  }
}

export async function requestManualCheckIn(input: {
  studentUsuarioId: string
  chamadaId: number
  latitude?: number
  longitude?: number
}) {
  const alunoId = await getAlunoId(input.studentUsuarioId)

  const session = await get<{
    id: number
    turma_id: number
    latitude: string | number
    longitude: string | number
    raio_metros: number
  }>(
    `SELECT id, turma_id, latitude, longitude, raio_metros
     FROM chamadas
     WHERE id = ?
       AND aberta_ate > NOW()
       AND encerrada_em IS NULL
       AND status = 'open'
     LIMIT 1`,
    [input.chamadaId]
  )

  if (!session) throw new Error('Chamada expirada ou não encontrada.')

  const enrolled = await get<{ turma_id: number }>(
    `SELECT turma_id
     FROM turma_alunos
     WHERE turma_id = ? AND aluno_id = ?
       AND status = 'active'
     LIMIT 1`,
    [session.turma_id, alunoId]
  )
  if (!enrolled) throw new Error('Você não está matriculado nesta matéria.')

  const alreadyAnswered = await get<{ chamada_id: number }>(
    `SELECT chamada_id
     FROM chamada_alunos
     WHERE chamada_id = ? AND aluno_id = ?
     LIMIT 1`,
    [session.id, alunoId]
  )
  if (alreadyAnswered) throw new Error('Você já respondeu esta chamada.')

  const distanceMeters = input.latitude != null && input.longitude != null
    ? haversineDistanceMeters(
        { latitude: Number(session.latitude), longitude: Number(session.longitude) },
        { latitude: input.latitude, longitude: input.longitude }
      )
    : null

  if (distanceMeters != null && distanceMeters <= Number(session.raio_metros)) {
    throw new Error('Você está dentro do raio. Use o check-in normal.')
  }

  try {
    const insert = await run(
      `INSERT INTO chamada_solicitacoes
         (chamada_id, aluno_id, latitude, longitude, distancia_metros)
       VALUES (?, ?, ?, ?, ?)`,
      [session.id, alunoId, input.latitude ?? null, input.longitude ?? null, distanceMeters != null ? Math.round(distanceMeters * 100) / 100 : null]
    )

    const request = await get<{
      id: number
      chamada_id: number
      aluno_id: number
      status: string
      created_at: string
      latitude: string | number | null
      longitude: string | number | null
      distancia_metros: number | null
    }>(
      `SELECT id, chamada_id, aluno_id, status, created_at, latitude, longitude, distancia_metros
       FROM chamada_solicitacoes
       WHERE id = ?
       LIMIT 1`,
      [insert.insertId]
    )

    return request
  } catch (err: any) {
    if (String(err?.message ?? '').toUpperCase().includes('DUPLICATE')) {
      throw new Error('Já existe uma solicitação pendente para esta chamada.')
    }
    throw err
  }
}

export async function listAttendanceRequests(input: {
  professorUsuarioId: string
  turmaId: number
  chamadaId: number
}) {
  const professorId = await getProfessorId(input.professorUsuarioId)
  const turma = await get<{ id: number }>(
    'SELECT id FROM turmas WHERE id = ? AND professor_id = ? LIMIT 1',
    [input.turmaId, professorId]
  )
  if (!turma) throw new Error('Turma não encontrada para este professor.')

  const requests = await all<{
    id: number
    alunoId: number
    name: string
    email: string
    status: string
    createdAt: string
    latitude: string | number | null
    longitude: string | number | null
    distanceMeters: number | null
  }>(
    `SELECT
       cs.id,
       cs.aluno_id AS alunoId,
       u.nome AS name,
       u.email AS email,
       cs.status,
       cs.created_at AS createdAt,
       cs.latitude,
       cs.longitude,
       cs.distancia_metros AS distanceMeters
     FROM chamada_solicitacoes cs
     INNER JOIN alunos a ON a.id = cs.aluno_id
     INNER JOIN usuarios u ON u.id = a.usuario_id
     INNER JOIN chamadas c ON c.id = cs.chamada_id
     WHERE cs.chamada_id = ?
       AND c.turma_id = ?
       AND cs.status = 'pending'
     ORDER BY cs.created_at ASC`,
    [input.chamadaId, input.turmaId]
  )

  return requests.map((request) => ({
    ...request,
    distanceMeters: request.distanceMeters != null ? Number(request.distanceMeters) : null,
  }))
}

export async function approveManualCheckIn(input: {
  professorUsuarioId: string
  requestId: number
}) {
  const professorId = await getProfessorId(input.professorUsuarioId)
  const request = await get<{
    id: number
    chamada_id: number
    aluno_id: number
    status: string
    latitude: string | number | null
    longitude: string | number | null
    distancia_metros: number | null
  }>(
    `SELECT cs.*
     FROM chamada_solicitacoes cs
     INNER JOIN chamadas c ON c.id = cs.chamada_id
     INNER JOIN turmas t ON t.id = c.turma_id
     WHERE cs.id = ?
       AND t.professor_id = ?
     LIMIT 1`,
    [input.requestId, professorId]
  )

  if (!request) throw new Error('Solicitação não encontrada.')
  if (request.status !== 'pending') throw new Error('Solicitação já foi processada.')

  const existing = await get<{ chamada_id: number }>(
    `SELECT chamada_id
     FROM chamada_alunos
     WHERE chamada_id = ? AND aluno_id = ?
     LIMIT 1`,
    [request.chamada_id, request.aluno_id]
  )
  if (existing) {
    await run(
      `UPDATE chamada_solicitacoes
       SET status = 'approved', resolved_at = NOW()
       WHERE id = ?`,
      [request.id]
    )
    return { requestId: request.id, approved: true, alreadyRecorded: true }
  }

  await run(
    `INSERT INTO chamada_alunos (chamada_id, aluno_id, presente, data_resposta, latitude, longitude, distancia_metros)
     VALUES (?, ?, 1, NOW(), ?, ?, ?)`,
    [request.chamada_id, request.aluno_id, request.latitude ?? null, request.longitude ?? null, request.distancia_metros ?? null]
  )

  await run(
    `UPDATE chamada_solicitacoes
     SET status = 'approved', resolved_at = NOW()
     WHERE id = ?`,
    [request.id]
  )

  await refreshSessionCounters(request.chamada_id)

  return { requestId: request.id, approved: true, alreadyRecorded: false }
}

export async function listClassSessions(input: { professorUsuarioId: string; turmaId: number }) {
  const professorId = await getProfessorId(input.professorUsuarioId)
  const turma = await get<{ id: number }>(
    'SELECT id FROM turmas WHERE id = ? AND professor_id = ? LIMIT 1',
    [input.turmaId, professorId]
  )
  if (!turma) throw new Error('Turma não encontrada para este professor.')

  return all<{
    id: number
    lessonNumber: number
    title: string
    date: string
    time: string
    durationMin: number
    expiresAt: string
    secondsLeft: number
    present: number
    absent: number
    rate: number
    isOpen: number
  }>(
    `SELECT
       c.id,
       ROW_NUMBER() OVER (ORDER BY c.data_registro ASC, c.id ASC) AS lessonNumber,
       COALESCE(c.titulo, CONCAT('Chamada ', c.id)) AS title,
       DATE_FORMAT(c.data_chamada, '%Y-%m-%d') AS date,
       DATE_FORMAT(c.data_registro, '%H:%i') AS time,
       GREATEST(1, TIMESTAMPDIFF(MINUTE, c.data_registro, c.aberta_ate)) AS durationMin,
       c.aberta_ate AS expiresAt,
       GREATEST(0, TIMESTAMPDIFF(SECOND, NOW(), c.aberta_ate)) AS secondsLeft,
       COUNT(DISTINCT ca.aluno_id) AS present,
       GREATEST(COUNT(DISTINCT ta.aluno_id) - COUNT(DISTINCT ca.aluno_id), 0) AS absent,
       CASE
         WHEN COUNT(DISTINCT ta.aluno_id) = 0 THEN 0
         ELSE ROUND((COUNT(DISTINCT ca.aluno_id) / COUNT(DISTINCT ta.aluno_id)) * 100, 1)
       END AS rate,
       CASE WHEN c.aberta_ate > NOW() AND c.encerrada_em IS NULL AND c.status = 'open' THEN 1 ELSE 0 END AS isOpen
     FROM chamadas c
     LEFT JOIN turma_alunos ta ON ta.turma_id = c.turma_id AND ta.status = 'active'
     LEFT JOIN chamada_alunos ca ON ca.chamada_id = c.id AND ca.presente = 1
     WHERE c.turma_id = ?
     GROUP BY c.id
     ORDER BY c.data_registro DESC, c.id DESC`,
    [input.turmaId]
  )
}

export async function getAttendanceDetail(input: {
  professorUsuarioId: string
  turmaId: number
  chamadaId: number
}) {
  const professorId = await getProfessorId(input.professorUsuarioId)
  const chamada = await get<{
    id: number
    turma_id: number
    turma_nome: string
    disciplina: string
    curso: string
    titulo: string | null
    conteudo: string | null
    date: string
    time: string
    durationMin: number
    radiusMeters: number
    latitude: string | number
    longitude: string | number
    isOpen: number
  }>(
    `SELECT
       c.id,
       c.turma_id,
       t.nome AS turma_nome,
       t.disciplina,
       t.curso,
       c.titulo,
       c.conteudo,
       DATE_FORMAT(c.data_chamada, '%Y-%m-%d') AS date,
       DATE_FORMAT(c.data_registro, '%H:%i') AS time,
       GREATEST(1, TIMESTAMPDIFF(MINUTE, c.data_registro, c.aberta_ate)) AS durationMin,
       c.raio_metros AS radiusMeters,
       c.latitude,
       c.longitude,
       CASE WHEN c.aberta_ate > NOW() AND c.encerrada_em IS NULL AND c.status = 'open' THEN 1 ELSE 0 END AS isOpen
     FROM chamadas c
     INNER JOIN turmas t ON t.id = c.turma_id
     WHERE c.id = ? AND c.turma_id = ? AND t.professor_id = ?
     LIMIT 1`,
    [input.chamadaId, input.turmaId, professorId]
  )
  if (!chamada) throw new Error('Chamada não encontrada.')

  const students = await all<{
    id: number
    name: string
    email: string
    present: number
    answeredAt: string | null
  }>(
    `SELECT
       a.id,
       u.nome AS name,
       u.email,
       CASE WHEN ca.presente = 1 THEN 1 ELSE 0 END AS present,
       ca.data_resposta AS answeredAt
     FROM turma_alunos ta
     INNER JOIN alunos a ON a.id = ta.aluno_id
     INNER JOIN usuarios u ON u.id = a.usuario_id
     LEFT JOIN chamada_alunos ca ON ca.chamada_id = ? AND ca.aluno_id = a.id
     WHERE ta.turma_id = ? AND ta.status = 'active'
     ORDER BY present DESC, u.nome ASC`,
    [input.chamadaId, input.turmaId]
  )

  const present = students.filter((student) => Boolean(student.present)).length
  const total = students.length

  return {
    attendance: {
      id: chamada.id,
      turmaId: chamada.turma_id,
      title: chamada.titulo ?? `Chamada ${chamada.id}`,
      content: chamada.conteudo,
      date: chamada.date,
      time: chamada.time,
      durationMin: Number(chamada.durationMin),
      radiusMeters: Number(chamada.radiusMeters),
      latitude: Number(chamada.latitude),
      longitude: Number(chamada.longitude),
      isOpen: Boolean(chamada.isOpen),
      present,
      absent: Math.max(total - present, 0),
      rate: total > 0 ? Math.round((present / total) * 1000) / 10 : 0,
      class: {
        id: chamada.turma_id,
        name: chamada.turma_nome,
        subject: chamada.disciplina,
        course: chamada.curso,
      },
    },
    students: students.map((student) => ({
      ...student,
      present: Boolean(student.present),
    })),
  }
}

export async function listStudentNotifications(usuarioId: string) {
  const alunoId = await getAlunoId(usuarioId)
  return all<{
    id: number
    turmaId: number
    className: string
    subject: string
    professorName: string
    title: string
    expiresAt: string
    secondsLeft: number
    radiusMeters: number
  }>(
    `SELECT
       c.id,
       t.id AS turmaId,
       t.nome AS className,
       t.disciplina AS subject,
       up.nome AS professorName,
       COALESCE(c.titulo, CONCAT('Chamada ', c.id)) AS title,
       c.aberta_ate AS expiresAt,
       GREATEST(0, TIMESTAMPDIFF(SECOND, NOW(), c.aberta_ate)) AS secondsLeft,
       c.raio_metros AS radiusMeters
     FROM chamadas c
     INNER JOIN turmas t ON t.id = c.turma_id
     INNER JOIN professores p ON p.id = t.professor_id
     INNER JOIN usuarios up ON up.id = p.usuario_id
     INNER JOIN turma_alunos ta ON ta.turma_id = t.id AND ta.aluno_id = ?
     LEFT JOIN chamada_alunos ca ON ca.chamada_id = c.id AND ca.aluno_id = ?
     WHERE c.aberta_ate > NOW()
       AND c.encerrada_em IS NULL
       AND c.status = 'open'
       AND ca.aluno_id IS NULL
     ORDER BY c.data_registro DESC`,
    [alunoId, alunoId]
  )
}

export async function getStudentSession(usuarioId: string, chamadaId: number) {
  const alunoId = await getAlunoId(usuarioId)
  const session = await get<{
    id: number
    turmaId: number
    className: string
    subject: string
    professorName: string
    title: string
    expiresAt: string
    secondsLeft: number
    radiusMeters: number
    status: string
    latitude: string | number
    longitude: string | number
    answered: number
  }>(
    `SELECT
       c.id,
       t.id AS turmaId,
       t.nome AS className,
       t.disciplina AS subject,
       up.nome AS professorName,
       COALESCE(c.titulo, CONCAT('Chamada ', c.id)) AS title,
       c.aberta_ate AS expiresAt,
       GREATEST(0, TIMESTAMPDIFF(SECOND, NOW(), c.aberta_ate)) AS secondsLeft,
       c.raio_metros AS radiusMeters,
       c.status,
       c.latitude,
       c.longitude,
       CASE WHEN ca.aluno_id IS NULL THEN 0 ELSE 1 END AS answered
     FROM chamadas c
     INNER JOIN turmas t ON t.id = c.turma_id
     INNER JOIN professores p ON p.id = t.professor_id
     INNER JOIN usuarios up ON up.id = p.usuario_id
     INNER JOIN turma_alunos ta ON ta.turma_id = t.id AND ta.aluno_id = ?
     LEFT JOIN chamada_alunos ca ON ca.chamada_id = c.id AND ca.aluno_id = ?
     WHERE c.id = ?
     LIMIT 1`,
    [alunoId, alunoId, chamadaId]
  )
  if (!session) throw new Error('Chamada não encontrada para este aluno.')
  return {
    ...session,
    latitude: Number(session.latitude),
    longitude: Number(session.longitude),
    answered: Boolean(session.answered),
  }
}

export async function listStudentClassSessions(input: {
  studentUsuarioId: string
  turmaId: number
}) {
  const alunoId = await getAlunoId(input.studentUsuarioId)
  const enrolled = await get<{ turma_id: number }>(
    `SELECT turma_id
     FROM turma_alunos
     WHERE turma_id = ? AND aluno_id = ? AND status = 'active'
     LIMIT 1`,
    [input.turmaId, alunoId]
  )
  if (!enrolled) throw new Error('Você não está matriculado nesta matéria.')

  return all<{
    id: number
    title: string
    createdAt: string
    date: string
    time: string
    closesAt: string
    secondsLeft: number
    durationMin: number
    isOpen: number
    responded: number
    present: number
    distanceMeters: string | number | null
    answeredAt: string | null
  }>(
    `SELECT
       c.id,
       COALESCE(c.titulo, CONCAT('Chamada ', c.id)) AS title,
       c.data_registro AS createdAt,
       DATE_FORMAT(c.data_chamada, '%Y-%m-%d') AS date,
       DATE_FORMAT(c.data_registro, '%H:%i') AS time,
       c.aberta_ate AS closesAt,
       GREATEST(0, TIMESTAMPDIFF(SECOND, NOW(), c.aberta_ate)) AS secondsLeft,
       GREATEST(1, TIMESTAMPDIFF(MINUTE, c.data_registro, c.aberta_ate)) AS durationMin,
       CASE WHEN c.aberta_ate > NOW() AND c.encerrada_em IS NULL AND c.status = 'open' THEN 1 ELSE 0 END AS isOpen,
       CASE WHEN ca.aluno_id IS NULL THEN 0 ELSE 1 END AS responded,
       CASE WHEN ca.presente = 1 THEN 1 ELSE 0 END AS present,
       ca.distancia_metros AS distanceMeters,
       ca.data_resposta AS answeredAt
     FROM chamadas c
     LEFT JOIN chamada_alunos ca ON ca.chamada_id = c.id AND ca.aluno_id = ?
     WHERE c.turma_id = ?
     ORDER BY c.data_registro DESC, c.id DESC`,
    [alunoId, input.turmaId]
  )
}
