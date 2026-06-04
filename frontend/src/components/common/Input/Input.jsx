// Input com label e suporte a erro
// o icon é o nome do Tabler icon (opcional, aparece à esquerda)
// se tiver erro, o input fica vermelho e mostra a mensagem embaixo

import { forwardRef, useId } from 'react'

const Input = forwardRef(function Input(
  { label, icon, error, type = 'text', className = '', ...rest },
  ref
) {
  // useId gera um id único pro input — assim o label sempre aponta pro campo certo
  const id = useId()
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <i
            className={`ti ti-${icon} absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400`}
            style={{ fontSize: 20 }}
            aria-hidden="true"
          />
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          aria-describedby={errorId}
          aria-invalid={error ? true : undefined}
          className={`w-full rounded-lg border bg-neutral-0 px-4 py-3
            text-neutral-700 placeholder-neutral-400
            focus:outline-none focus:border-primary-400 transition-colors
            ${icon ? 'pl-12' : ''}
            ${error ? 'border-danger-400' : 'border-neutral-200'}`}
          {...rest}
        />
      </div>

      {error && (
        <p id={errorId} className="text-danger-400 text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  )
})

export default Input
