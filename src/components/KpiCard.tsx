import type { ReactNode } from 'react'

type Props = {
  label: string
  value: number
  icon: ReactNode
  accent?: boolean
}

export function KpiCard({ label, value, icon, accent = false }: Props) {
  return (
    <div className={`kpi-card${accent ? ' kpi-card--accent' : ''}`}>
      <div className="kpi-icon">{icon}</div>
      <div>
        <p className="kpi-label">{label}</p>
        <p className="kpi-value">{value.toLocaleString('pt-BR')}</p>
      </div>
    </div>
  )
}
