import { useState } from 'react'
import { Sidebar } from '../layout/Sidebar/Sidebar'
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
  mockIndicadores,
  mockUltimasChamadas,
  mockDistribuicaoPresenca,
} from '../mocks/dashboard.mock'

import styles from './TeacherDashboardPage.module.css'

function formatDataHora() {
  const agora = new Date()
  const dias = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado']
  const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
  const dia = dias[agora.getDay()]
  const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return `${dia} · ${agora.getDate()} ${meses[agora.getMonth()]} · ${hora}`
}

export function TeacherDashboardPage() {
  const [activeRoute, setActiveRoute] = useState('dashboard')

  const handleAulaAction = (aula) => {
    console.log('Ação na aula:', aula)
    // TODO: navegar para tela de chamada ativa quando existir
  }

  const handleChamadaMenu = (chamada) => {
    console.log('Menu da chamada:', chamada)
    // TODO: abrir menu de opções
  }

  const handleExportChart = () => {
    console.log('Exportar gráfico')
    // TODO: integrar exportação quando back estiver pronto
  }

  return (
    <div className={styles.layout}>
      <Sidebar activeRoute={activeRoute} onNavigate={setActiveRoute} />

      <main className={styles.main}>
        <DashboardHeader
          professorName={mockTeacherProfile.name}
          dataHora={formatDataHora()}
          onNotification={() => console.log('Notificações')}
        />

        <div className={styles.content}>
          {/* Métricas do topo */}
          <section className={styles.metricsRow} aria-label="Métricas gerais">
            <MetricCard
              icon="books"
              value={mockMetrics.aulasHoje}
              label="Aulas hoje"
              darkIcon
            />
            <MetricCard
              icon="chart-line"
              value={`${mockMetrics.frequenciaMedia}%`}
              label="Frequência média"
              delta={`▲ ${mockMetrics.frequenciaMediaDelta}% vs sem. anterior`}
              deltaType="positive"
              darkIcon
            />
            <MetricCard
              icon="clipboard-check"
              value={mockMetrics.chamadasMes}
              label="Chamadas mês"
            />
          </section>

          {/* Aulas de hoje + Calendário semanal */}
          <section className={styles.midRow} aria-label="Agenda">
            <TodayClassesCard
              aulas={mockAulasHoje}
              onAction={handleAulaAction}
            />
            <WeekCalendarCard
              eventos={mockWeekCalendar}
              diaAtual={3}
            />
          </section>

          {/* Indicadores úteis */}
          <section className={styles.indicadoresRow} aria-label="Indicadores úteis">
            <div className={styles.indCard}>
              <div className={styles.indIcon}>
                <i className="ti ti-users" aria-hidden="true" />
              </div>
              <div>
                <p className={styles.indLabel}>Total de alunos ativos</p>
                <p className={styles.indValue}>{mockIndicadores.totalAlunos}</p>
                <p className={styles.indSub}>em {mockIndicadores.totalTurmas} turmas</p>
                <span className={`${styles.indBadge} ${styles.positive}`}>
                  + {mockIndicadores.alunosNovosDelta}
                </span>
              </div>
            </div>

            <div className={styles.indCard}>
              <div className={styles.indIcon}>
                <i className="ti ti-calendar-event" aria-hidden="true" />
              </div>
              <div>
                <p className={styles.indLabel}>Próximos eventos</p>
                <p className={styles.indValue}>{mockIndicadores.proximosEventos}</p>
                <p className={styles.indSub}>
                  {mockIndicadores.proximasAulas} aulas · {mockIndicadores.proximasProvas} provas
                </p>
                <span className={`${styles.indBadge} ${styles.positive}`}>
                  + {mockIndicadores.eventosDelta}%
                </span>
              </div>
            </div>

            <div className={styles.indCard}>
              <div className={styles.indIcon}>
                <i className="ti ti-alert-triangle" aria-hidden="true" />
              </div>
              <div>
                <p className={styles.indLabel}>Alunos em risco</p>
                <p className={styles.indValue}>
                  {String(mockIndicadores.alunosEmRisco).padStart(2, '0')}
                </p>
                <p className={styles.indSub}>
                  abaixo de {mockIndicadores.limiteRisco}%
                </p>
                <span className={`${styles.indBadge} ${styles.warning}`}>
                  + {mockIndicadores.alunosEmRiscoDelta}
                </span>
              </div>
            </div>
          </section>

          {/* Últimas chamadas + Distribuição de presença */}
          <section className={styles.bottomRow} aria-label="Chamadas e presença">
            <RecentAttendancesCard
              chamadas={mockUltimasChamadas}
              onMenu={handleChamadaMenu}
            />
            <AttendanceDistributionCard
              dados={mockDistribuicaoPresenca}
              onExport={handleExportChart}
            />
          </section>
        </div>
      </main>
    </div>
  )
}

export default TeacherDashboardPage