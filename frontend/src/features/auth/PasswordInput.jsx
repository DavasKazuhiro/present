// Input de senha com botão de olho pra mostrar/esconder o que tá digitado.

import { useState } from 'react'

export default function PasswordInput({ value, onChange, placeholder = 'Senha', ...rest }) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative w-full">
      {/* cadeado à esquerda */}
      <i
        className="ti ti-lock absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
        style={{ fontSize: 20 }}
        aria-hidden="true"
      />

      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent border border-neutral-200 rounded-lg py-3 pl-12 pr-12 text-neutral-700 placeholder-neutral-400 focus:outline-none focus:border-primary-400"
        {...rest}
      />

      {/* botão de olho à direita */}
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
        aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
      >
        <i
          className={showPassword ? 'ti ti-eye-off' : 'ti ti-eye'}
          style={{ fontSize: 20 }}
          aria-hidden="true"
        />
      </button>
    </div>
  )
}
