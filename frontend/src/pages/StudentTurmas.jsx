import { useState } from "react";
import { AppLayout } from "@/layout/AppLayout/AppLayout";
import { ClassList } from "../features/StudentTurmas/ClassList";
import { mockClasses } from "@/mocks/classes";
import { StudentCheckinModal } from "./StudentCheckinModal";

export default function StudentTurmas() {
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  const handleOpenCheckin = (turma) => {
    setSelectedClass(turma);
    setCheckInOpen(true);
  };

  return (
    <AppLayout title="Turmas">
  <button
    onClick={() => setCheckInOpen(true)}
    className="mb-4 rounded-xl bg-primary-600 px-4 py-2 text-white"
  >
    Abrir Check-in
  </button>

  <StudentCheckinModal
    open={checkInOpen}
    onClose={() => setCheckInOpen(false)}
  />

  <ClassList items={mockClasses} />
</AppLayout>
  );
}