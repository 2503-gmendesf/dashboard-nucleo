type Props = {
  allProjects: string[]
  selectedProjects: string[]
  onToggleProject: (projeto: string) => void
  onClearProjects: () => void
  from: string
  to: string
  onFromChange: (v: string) => void
  onToChange: (v: string) => void
  onReload: () => void
  fileName: string | null
}

export function Filters({
  allProjects,
  selectedProjects,
  onToggleProject,
  onClearProjects,
  from,
  to,
  onFromChange,
  onToChange,
  onReload,
  fileName,
}: Props) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">LED</div>
        <div>
          <p className="brand-title">Painel LED</p>
          <p className="brand-subtitle">Pacotes de trabalho</p>
        </div>
      </div>

      <div className="field-group">
        <span className="field-label">Projeto</span>
        <div className="checkbox-list">
          {allProjects.map((p) => (
            <label className="checkbox-row" key={p}>
              <input
                type="checkbox"
                checked={selectedProjects.includes(p)}
                onChange={() => onToggleProject(p)}
              />
              {p}
            </label>
          ))}
        </div>
        {selectedProjects.length > 0 && (
          <button className="reset-link" onClick={onClearProjects}>
            Limpar seleção
          </button>
        )}
      </div>

      <div className="field-group">
        <span className="field-label">Período (data de início)</span>
        <div className="date-row">
          <input type="date" value={from} onChange={(e) => onFromChange(e.target.value)} />
          <input type="date" value={to} onChange={(e) => onToChange(e.target.value)} />
        </div>
      </div>

      <div className="field-group">
        <span className="field-label">Arquivo</span>
        <p style={{ fontSize: 12.5, color: '#cddaef', wordBreak: 'break-word' }}>
          {fileName}
        </p>
        <button className="reload-btn" onClick={onReload}>
          Importar outra planilha
        </button>
      </div>
    </aside>
  )
}
