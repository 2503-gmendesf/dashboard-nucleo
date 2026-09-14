import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { Milestone } from '../lib/metrics'
import { statusColor } from '../lib/colors'

const DAY = 1000 * 60 * 60 * 24

function diffDays(a: Date, b: Date) {
  return Math.round((a.getTime() - b.getTime()) / DAY)
}

function formatShort(d: Date) {
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

export function GanttChart({ data }: { data: Milestone[] }) {
  if (data.length === 0) {
    return (
      <div className="chart-card">
        <h3>Linha do tempo de marcos</h3>
        <p className="chart-note">Datas de início e conclusão dos marcos e sub-marcos.</p>
        <p className="empty-state">Sem marcos para os filtros selecionados.</p>
      </div>
    )
  }

  const minDate = data.reduce((min, m) => (m.start < min ? m.start : min), data[0].start)
  const maxDate = data.reduce((max, m) => (m.end > max ? m.end : max), data[0].end)
  const totalDays = Math.max(1, diffDays(maxDate, minDate))

  const rows = data.map((m) => {
    const offset = diffDays(m.start, minDate)
    const duration = Math.max(diffDays(m.end, m.start), Math.max(1, Math.round(totalDays * 0.01)))
    return { ...m, offset, duration }
  })

  const chartHeight = Math.max(160, rows.length * 30 + 30)

  return (
    <div className="chart-card">
      <h3>Linha do tempo de marcos</h3>
      <p className="chart-note">
        {rows.length} marcos, de {formatShort(minDate)} a {formatShort(maxDate)}.
      </p>
      <div style={{ maxHeight: 560, overflowY: rows.length > 18 ? 'auto' : 'visible' }}>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 24, bottom: 0, left: 0 }}>
            <XAxis
              type="number"
              domain={[0, totalDays]}
              tickFormatter={(v) => formatShort(new Date(minDate.getTime() + v * DAY))}
              tick={{ fontSize: 10.5, fill: 'var(--ink-faint)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="nome"
              width={220}
              tick={{ fontSize: 11.5, fill: 'var(--ink)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: string) => (v.length > 34 ? v.slice(0, 32) + '…' : v)}
            />
            <Tooltip
              cursor={{ fill: 'var(--blue-100)' }}
              formatter={(_value, _name, item) => {
                const row = item.payload as (typeof rows)[number]
                return [`${formatShort(row.start)} – ${formatShort(row.end)} · ${row.projeto}`, row.status]
              }}
              contentStyle={{ fontSize: 12.5, borderRadius: 8, border: '1px solid var(--line)' }}
            />
            <Bar dataKey="offset" stackId="gantt" fill="transparent" isAnimationActive={false} />
            <Bar dataKey="duration" stackId="gantt" radius={[3, 3, 3, 3]} barSize={12}>
              {rows.map((row) => (
                <Cell key={row.id} fill={statusColor(row.status)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
