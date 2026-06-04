import { IconButton } from "@/components/common/IconButton/IconButton";
import { Plus } from "lucide-react";
import logo from '../../assets/logo.png'


export function Header({ title, onAdd }) {
  return (
    <header className="border-b border-gray-200 bg-neutral-0 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-5">
        <img src={logo} alt="Present logo" className="h-14" />
        <h1 className="flex-1 text-center font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>
        <IconButton aria-label="Adicionar turma" onClick={onAdd} className="bg-surface-600 text-white hover:brightness-110">
          <Plus className="h-5 w-5" />
        </IconButton>
      </div>
    </header>);

}