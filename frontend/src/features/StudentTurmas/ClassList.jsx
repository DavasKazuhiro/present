import { ClassItem } from "./ClassItem";
import { useNavigate } from 'react-router-dom'
import { getStudentClass, getClassAttendances } from '../../services/classes.service'

export function ClassList({ items, onOpenCheckin }) {
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
        Nenhuma turma cadastrada ainda.
      </div>);

  }
  return (
    <div className="flex flex-col gap-3">
      {items.map((c) =>
      <ClassItem key={c.id} data={c} onOpenCheckin={onOpenCheckin} onClick={() => navigate(`/student/classes/${c.id}`)}/>
      )}
    </div>);

}
