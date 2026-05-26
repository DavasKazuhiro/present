// Input de senha com botão de olho pra mostrar/esconder o que tá digitado.

import { useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'

export default function PasswordInput({ value, onChange, placeholder = 'Senha', ...rest }) {
  // Estado interno: mostra ou não a senha em texto puro
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative w-full">
      {/* Ícone de cadeado à esquerda (decoração, não interage) */}
      <Lock
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        size={20}
      />

      {/* O input em si — type muda conforme o estado */}
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent border border-slate-700 rounded-lg py-3 pl-12 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
        {...rest}
      />

      {/* Botão de olho à direita — alterna o showPassword */}
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
        aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  )
}