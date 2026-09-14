import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

type Row = { nome: string; horas: number }

export function HoursByMemberChart({ data }: { data: Row[] }) {
  const top = data.slice(0, 12)
  const height = Math.max(140, top.length * 32 + 20)

  return (
    <div className="chart-card">
      <h3>Horas por membro</h3>
      <p className="chart-note">Soma do tempo gasto registrado em tarefas.</p>
      {top.length === 0 ? (
        <p className="empty-state">Sem horas registradas para os filtros selecionados.</p>
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={top} layout="vertical" margin={{ top: 0, right: 28, bottom: 0, left: 0 }}>
            <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--ink-faint)' }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="nome"
              width={150}
              tick={{ fontSize: 12.5, fill: 'var(--ink)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'var(--blue-100)' }}
              formatter={(value: number) => [`${value.toFixed(1)} h`, 'Horas']}
              contentStyle={{ fontSize: 12.5, borderRadius: 8, border: '1px solid var(--line)' }}
            />
            <Bar dataKey="horas" radius={[0, 4, 4, 0]} barSize={16}>
              {top.map((_, i) => (
                <Cell key={i} fill="var(--blue-500)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
