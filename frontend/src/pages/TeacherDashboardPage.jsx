import { AppLayout } from '../layout/AppLayout/AppLayout'
import { Footer } from '../layout/Footer/Footer'
import { DashboardHeader } from '../features/dashboard/DashboardHeader'
import { MetricCard } from '../features/dashboard/MetricCard'
import { TodayClassesCard } from '../features/dashboard/TodayClassesCard'
import { WeekCalendarCard } from '../features/dashboard/WeekCalendarCard'
import { AttendanceDistributionCard } from '../features/dashboard/AttendanceDistributionCard'
import { RecentAttendancesCard } from '../features/dashboard/RecentAttendancesCard'

import {
  mockTeacherProfile,
  mockMetrics,
  mockAulasHoje,
  mockWeekCalendar,
  mockUltimasChamadas,
  mockDistribuicaoPresenca,
} from '../mocks/dashboard.mock'

function formatDataHora() {
  const agora = new Date()
  const dias = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado']
  const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
  const dia = dias[agora.getDay()]
  const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return `${dia} · ${agora.getDate()} ${meses[agora.getMonth()]} · ${hora}`
}

export function TeacherDashboardPage() {
  const handleAulaAction = (aula) => {
    console.log('Ação na aula:', aula)
  }

  const handleChamadaMenu = (chamada) => {
    console.log('Menu da chamada:', chamada)
  }

  const handleExportChart = () => {
    console.log('Exportar gráfico')
  }

  return (
    <AppLayout>
      <DashboardHeader
        professorName={mockTeacherProfile.name}
        dataHora={formatDataHora()}
        onNotification={() => console.log('Notificações')}
      />

      <div className="px-7 max-sm:px-4 py-6 pb-10 flex flex-col gap-4">
        {/* métricas — 3 colunas no desktop, 1 no mobile */}
        <section className="grid grid-cols-3 max-lg:grid-cols-1 gap-3.5" aria-label="Métricas gerais">
          <MetricCard icon="book" value={mockMetrics.aulasHoje} label="Aulas hoje" darkIcon />
          <MetricCard
            icon="chart-line"
            value={`${mockMetrics.frequenciaMedia}%`}
            label="Frequência média"
            deltaType="positive"
            darkIcon
          />
          <MetricCard icon="clipboard-check" value={mockMetrics.chamadasMes} label="Chamadas mês" darkIcon />
        </section>

        {/* aulas de hoje + calendário — 2 colunas no desktop, empilhado no mobile */}
        <section className="grid grid-cols-[1.1fr_0.9fr] max-lg:grid-cols-1 gap-3.5 items-stretch" aria-label="Agenda">
          <TodayClassesCard aulas={mockAulasHoje} onAction={handleAulaAction} />
          <WeekCalendarCard eventos={mockWeekCalendar} diaAtual={3} />
        </section>

        {/* últimas chamadas + distribuição — 2 colunas no desktop, empilhado no mobile */}
        <section className="grid grid-cols-2 max-lg:grid-cols-1 gap-3.5 items-stretch" aria-label="Chamadas e presença">
          <RecentAttendancesCard chamadas={mockUltimasChamadas} onMenu={handleChamadaMenu} />
          <AttendanceDistributionCard dados={mockDistribuicaoPresenca} onExport={handleExportChart} />
        </section>
      </div>

      <Footer />
    </AppLayout>
  )
}

export default TeacherDashboardPage
