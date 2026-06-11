import { api } from './api'

function apiError(error, fallback) {
  return error?.response?.data?.error ?? fallback
}

export async function getTeacherClasses() {
  const { data } = await api.get('/classes/teacher')
  return data.classes ?? []
}

export async function createTeacherClass(payload) {
  try {
    const { data } = await api.post('/classes/teacher', payload)
    return { success: true, class: data.class }
  } catch (error) {
    return { success: false, error: apiError(error, 'Não foi possível criar a matéria.') }
  }
}

export async function getTeacherClass(turmaId) {
  const { data } = await api.get(`/classes/teacher/${turmaId}`)
  return data.class
}

export async function getClassStudents(turmaId) {
  const { data } = await api.get(`/classes/teacher/${turmaId}/students`)
  return data.students ?? []
}

export async function getAvailableStudents(turmaId) {
  const { data } = await api.get(`/classes/teacher/${turmaId}/available-students`)
  return data.students ?? []
}

export async function enrollStudent(turmaId, email) {
  try {
    const { data } = await api.post(`/classes/teacher/${turmaId}/students`, { email })
    return { success: true, student: data.student }
  } catch (error) {
    return { success: false, error: apiError(error, 'Não foi possível adicionar o aluno.') }
  }
}

export async function removeStudent(turmaId, alunoId) {
  try {
    await api.delete(`/classes/teacher/${turmaId}/students/${alunoId}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: apiError(error, 'Não foi possível remover o aluno.') }
  }
}

export async function getInviteLink(turmaId) {
  const { data } = await api.get(`/classes/teacher/${turmaId}/invite-link`)
  return data.invite
}

export async function regenerateInviteLink(turmaId) {
  const { data } = await api.post(`/classes/teacher/${turmaId}/invite-link/regenerate`)
  return data.invite
}

export async function joinClassByInvite(token) {
  try {
    const { data } = await api.post(`/classes/join/${token}`)
    return { success: true, enrollment: data.enrollment }
  } catch (error) {
    return { success: false, error: apiError(error, 'Não foi possível entrar na matéria.') }
  }
}

export async function getStudentClasses() {
  const { data } = await api.get('/classes/student')
  return data.classes ?? []
}

export async function openAttendance(payload) {
  try {
    const { data } = await api.post('/sessions/open', payload)
    return { success: true, session: data.session }
  } catch (error) {
    return { success: false, error: apiError(error, 'Não foi possível abrir a chamada.') }
  }
}

export async function closeAttendance(chamadaId) {
  try {
    const { data } = await api.post(`/sessions/${chamadaId}/close`)
    return { success: true, session: data.session }
  } catch (error) {
    return { success: false, error: apiError(error, 'Não foi possível encerrar a chamada.') }
  }
}

export async function getClassAttendances(turmaId) {
  const { data } = await api.get(`/sessions/teacher/classes/${turmaId}`)
  return data.sessions ?? []
}

export async function getAttendanceDetail(turmaId, chamadaId) {
  const { data } = await api.get(`/sessions/teacher/classes/${turmaId}/${chamadaId}`)
  return {
    attendance: data.attendance,
    students: data.students ?? [],
  }
}

export async function getStudentNotifications() {
  const { data } = await api.get('/sessions/notifications')
  return data.notifications ?? []
}

export async function getStudentSession(chamadaId) {
  const { data } = await api.get(`/sessions/student/${chamadaId}`)
  return data.session
}

export async function confirmStudentCheckin(payload) {
  try {
    const { data } = await api.post('/sessions/check-in', payload)
    return { success: true, checkIn: data.checkIn }
  } catch (error) {
    return { success: false, error: apiError(error, 'Não foi possível responder a chamada.') }
  }
}

export async function getStudentClass(turmaId) {
  const { data } = await api.get(`/classes/student/${turmaId}`)
  return data.class
}

export async function getClassAttendancesByStudent(turmaId) {
  const { data } = await api.get(`/sessions/student/classes/${turmaId}`)
  return data.sessions ?? []
}
