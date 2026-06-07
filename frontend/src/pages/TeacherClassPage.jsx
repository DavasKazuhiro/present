import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { AppLayout } from '../layout/AppLayout/AppLayout'
import ClassHeader from '../features/classes/ClassHeader'
import ClassActions from '../features/classes/ClassActions'
import AttendanceList from '../features/classes/AttendanceList'
import NewAttendanceModal from '../features/classes/NewAttendanceModal'
import LiveAttendanceModal from '../features/classes/LiveAttendanceModal'
import { turmaInfo, chamadas } from '../mocks/class.mock'

export default function TeacherClassPage() {
  // qual modal está aberto: 'none' | 'config' | 'live'
  const [modal, setModal] = useState('none')
  // dados da chamada que o professor configurou
  const [activeAttendance, setActiveAttendance] = useState(null)

  const proximoNumero = turmaInfo.attendancesDone + 1

  const navigate = useNavigate()

  function handleAbrirChamadaDetalhe(id) {
    navigate(`/teacher/classes/${turmaInfo.id}/attendances/${id}`)
  }

  function handleOpenConfig() {
    setModal('config')
  }

  // confirmou no modal de config -> abre o modal ao vivo
  function handleStartAttendance(dados) {
    setActiveAttendance(dados)
    setModal('live')
  }

  // encerrou (ou o tempo zerou)
  function handleEndAttendance() {
    // TODO: navegar pra página da chamada com os dados
    console.log('chamada encerrada', activeAttendance)
    setModal('none')
    setActiveAttendance(null)
  }

  function handleBaixar(id) {
    // TODO: gerar a lista no formato da faculdade
    console.log('baixar lista', id)
  }

  function handleVerTodas() {
    console.log('ver todas as chamadas')
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 px-7 py-6 pb-12 max-sm:px-4">
        <nav className="flex items-center gap-2 text-sm">
          <button
            type="button"
            onClick={() => console.log('voltar')}
            aria-label="Voltar para Matérias"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border-default text-text-secondary transition hover:bg-neutral-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-text-secondary">Matérias</span>
          <span className="text-text-muted">/</span>
          <span className="font-semibold text-text-primary">
            {turmaInfo.name} · {turmaInfo.section}
          </span>
        </nav>

        <ClassHeader info={turmaInfo} />
        <ClassActions onAbrirChamada={handleOpenConfig} />
        <AttendanceList
          items={chamadas}
          total={turmaInfo.attendancesDone}
          onBaixar={handleBaixar}
          onAbrir={handleAbrirChamadaDetalhe}
          onVerTodas={handleVerTodas}
        />

        <NewAttendanceModal
          open={modal === 'config'}
          onClose={() => setModal('none')}
          turma={turmaInfo}
          proximoNumero={proximoNumero}
          onAbrir={handleStartAttendance}
        />

        <LiveAttendanceModal
          open={modal === 'live'}
          attendance={activeAttendance}
          turma={turmaInfo}
          onClose={handleEndAttendance}
        />
      </div>
    </AppLayout>
  )
}