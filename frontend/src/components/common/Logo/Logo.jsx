// Logo do Present — usa o arquivo SVG como imagem

import logoSrc from '../../../assets/logo.png'

export default function Logo({ size = 26 }) {
  return (
    <img
      src={logoSrc}
      alt="Present"
      width={size}
      height={size}
      className="object-contain"
    />
  )
}
