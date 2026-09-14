import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { statusColor } from '../lib/colors'

type Row = { status: string; count: number }

export function TasksByStatusChart({ data }: { data: Row[] }) {
  return (
    <div className="chart-card">
      <h3>Tarefas por status</h3>
      <p className="chart-note">Quantidade de tarefas em cada etapa do fluxo.</p>
      {data.length === 0 ? (
        <p className="empty-state">Sem tarefas para os filtros selecionados.</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
            <XAxis
              dataKey="status"
              tick={{ fontSize: 11, fill: 'var(--ink-soft)' }}
              axisLine={{ stroke: 'var(--line)' }}
              tickLine={false}
              interval={0}
              angle={-18}
              textAnchor="end"
              height={54}
            />
            <YAxis tick={{ fontSize: 11, fill: 'var(--ink-faint)' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip
              cursor={{ fill: 'var(--blue-100)' }}
              contentStyle={{ fontSize: 12.5, borderRadius: 8, border: '1px solid var(--line)' }}
            />
            <Bar dataKey="count" name="Tarefas" radius={[5, 5, 0, 0]} barSize={34}>
              {data.map((row) => (
                <Cell key={row.status} fill={statusColor(row.status)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
