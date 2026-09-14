type Props = {
  label: string
  atendidos: number
  total: number
  pct: number
}

export function StatPanel({ label, atendidos, total, pct }: Props) {
  return (
    <div className="stat-block">
      <p className="stat-label">{label}</p>
      <div className="stat-value-row">
        <span className="stat-value">{total ? Math.round(pct * 100) : 0}%</span>
        <span className="stat-fraction">
          {atendidos} de {total} atendidos
        </span>
      </div>
      <div className="stat-bar-track">
        <div className="stat-bar-fill" style={{ width: `${total ? pct * 100 : 0}%` }} />
      </div>
    </div>
  )
}
