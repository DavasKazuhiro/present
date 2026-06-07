import Card from "@/components/common/Card/Card"; 
import Badge from "@/components/common/Badge/Badge";   
import { ChevronRight, Clock, Users } from "lucide-react";

export function ClassItem({ data }) {
  return (
    <Card className="cursor-pointer bg-neutral-0 hover:border-primary-300">
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
            
          </div>
          <p className="truncate text-sm text-muted-foreground">{data.course}</p>
          <div className="mt-1 flex w-full items-center gap-4 justify-start text-xs text-muted-foreground">
            <span className="flex w-full justify-start">
              <Badge className="bg-primary-300 text-primary-foreground">{data.group}</Badge>
            </span>
          </div>
        </div>

        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
      </div>
    </Card>);

}