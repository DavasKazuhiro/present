import Card from "@/components/common/Card/Card"; 
import Badge from "@/components/common/Badge/Badge";   
import { BellRing, CheckCircle2, ChevronRight } from "lucide-react";

export function ClassItem({ data, onOpenCheckin, onClick }) {
  const hasActiveSession = Boolean(data.activeSession && !data.activeSession.answered)
  const answered = Boolean(data.activeSession?.answered)

  return (
    <Card className="bg-neutral-0 hover:border-primary-300" onClick={onClick}>
      <div className="flex items-center gap-5">
        <div className="flex flex-col items-center justify-center rounded-xl bg-muted px-4 py-3 text-center">
          <span className="text-xs font-medium text-muted-foreground">início</span>
          <span className="font-display text-lg font-semibold tabular-nums">{data.startTime}</span>
          <div className="my-1 h-px w-full bg-border" />
          <span className="text-xs font-medium text-muted-foreground">fim</span>
          <span className="font-display text-lg font-semibold tabular-nums">{data.endTime}</span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-display text-lg font-semibold">{data.subject}</h3>
            {hasActiveSession && (
              <Badge className="bg-success-50 text-success-600">Chamada aberta</Badge>
            )}
            {answered && <Badge className="bg-primary-50 text-primary-700">Respondida</Badge>}
          </div>
          <p className="truncate text-sm text-muted-foreground">
            {data.course} · Prof. {data.professorName}
          </p>
          <div className="mt-1 flex w-full items-center gap-4 justify-start text-xs text-muted-foreground">
            <span className="flex w-full justify-start">
              <Badge className="bg-primary-300 text-white">{data.group}</Badge>
            </span>
          </div>
        </div>

        {hasActiveSession ? (
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
        ) : answered ? (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-success-600" />
        ) : (
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
        )}
      </div>
    </Card>);

}
