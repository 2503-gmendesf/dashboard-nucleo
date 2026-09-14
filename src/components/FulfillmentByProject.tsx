import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

type Row = { projeto: string; pct: number; atendidos: number; total: number }

type Props = {
  title: string
  note: string
  data: Row[]
}

export function FulfillmentByProject({ title, note, data }: Props) {
  const height = Math.max(120, data.length * 34 + 20)

  return (
    <div className="chart-card">
      <h3>{title}</h3>
      <p className="chart-note">{note}</p>
      {data.length === 0 ? (
        <p className="empty-state">Sem dados para os filtros selecionados.</p>
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 24, bottom: 0, left: 0 }}>
            <XAxis
              type="number"
              domain={[0, 1]}
              tickFormatter={(v) => `${Math.round(v * 100)}%`}
              tick={{ fontSize: 11, fill: 'var(--ink-faint)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="projeto"
              width={190}
              tick={{ fontSize: 12.5, fill: 'var(--ink)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'var(--blue-100)' }}
              formatter={(value: number, _name, item) => {
                const row = item.payload as Row
                return [`${Math.round(value * 100)}% (${row.atendidos}/${row.total})`, 'Atendido']
              }}
              contentStyle={{
                fontSize: 12.5,
                borderRadius: 8,
                border: '1px solid var(--line)',
              }}
            />
            <Bar dataKey="pct" radius={[0, 4, 4, 0]} barSize={16}>
              {data.map((_, i) => (
                <Cell key={i} fill="var(--blue-600)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
