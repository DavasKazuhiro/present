import { ClassItem } from "./ClassItem";

export function ClassList({ items, onOpenCheckin }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
        Nenhuma turma cadastrada ainda.
      </div>);

  }
  return (
    <div className="flex flex-col gap-3">
      {items.map((c) =>
      <ClassItem key={c.id} data={c} onOpenCheckin={onOpenCheckin} />
      )}
    </div>);

}
