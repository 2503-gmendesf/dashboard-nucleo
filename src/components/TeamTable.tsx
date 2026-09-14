import type { MemberSummary } from '../types'
import { statusColor } from '../lib/colors'

type Props = {
  members: MemberSummary[]
}

export function TeamTable({ members }: Props) {
  if (members.length === 0) {
    return <p className="empty-state">Sem tarefas para os filtros selecionados.</p>
  }

  const allStatuses = Array.from(new Set(members.flatMap((m) => Object.keys(m.porStatus))))

  return (
    <>
      <table className="team-table">
        <thead>
          <tr>
            <th>Membro</th>
            <th>Tarefas</th>
            <th>Horas</th>
            <th>Distribuição por status</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.nome}>
              <td className="member-name">{m.nome}</td>
              <td className="num-cell">{m.totalTarefas}</td>
              <td className="num-cell">{m.horas.toFixed(1)}</td>
              <td>
                <div className="mini-bar">
                  {Object.entries(m.porStatus).map(([status, count]) => (
                    <div
                      key={status}
                      title={`${status}: ${count}`}
                      style={{
                        width: `${(count / m.totalTarefas) * 100}%`,
                        background: statusColor(status),
                      }}
                    />
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="legend-row">
        {allStatuses.map((s) => (
          <span className="legend-item" key={s}>
            <span className="legend-swatch" style={{ background: statusColor(s) }} />
            {s}
          </span>
        ))}
      </div>
    </>
  )
}
