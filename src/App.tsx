import { useMemo, useState } from 'react'
import type { WorkItem } from './types'
import { parseWorkbook } from './lib/parseFile'
import { filterItems, pctAtendido, porProjeto, teamSummary, uniqueProjects } from './lib/metrics'
import { UploadZone } from './components/UploadZone'
import { Filters } from './components/Filters'
import { StatPanel } from './components/StatPanel'
import { FulfillmentByProject } from './components/FulfillmentByProject'
import { TeamTable } from './components/TeamTable'
import './styles.css'

export default function App() {
  const [items, setItems] = useState<WorkItem[] | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  async function handleFile(file: File) {
    setError(null)
    try {
      const parsed = await parseWorkbook(file)
      if (parsed.length === 0) {
        setError('Não encontrei linhas reconhecíveis nesse arquivo. Confira as colunas.')
        return
      }
      setItems(parsed)
      setFileName(file.name)
      setSelectedProjects([])
      setFrom('')
      setTo('')
    } catch {
      setError('Não consegui ler esse arquivo. Confira se é um .xlsx, .xls ou .csv válido.')
    }
  }

  const allProjects = useMemo(() => (items ? uniqueProjects(items) : []), [items])

  const filtered = useMemo(() => {
    if (!items) return []
    const fromDate = from ? new Date(from) : null
    const toDate = to ? new Date(to) : null
    return filterItems(items, selectedProjects, fromDate, toDate)
  }, [items, selectedProjects, from, to])

  const necessidades = useMemo(() => pctAtendido(filtered, 'Necessidade'), [filtered])
  const requisitos = useMemo(() => pctAtendido(filtered, 'Requisito'), [filtered])
  const necessidadesPorProjeto = useMemo(() => porProjeto(filtered, 'Necessidade'), [filtered])
  const requisitosPorProjeto = useMemo(() => porProjeto(filtered, 'Requisito'), [filtered])
  const equipe = useMemo(() => teamSummary(filtered), [filtered])

  if (!items) {
    return (
      <div className="app">
        <div className="main" style={{ margin: '0 auto', maxWidth: 640 }}>
          <UploadZone onFile={handleFile} error={error} />
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <Filters
        allProjects={allProjects}
        selectedProjects={selectedProjects}
        onToggleProject={(p) =>
          setSelectedProjects((prev) =>
            prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
          )
        }
        onClearProjects={() => setSelectedProjects([])}
        from={from}
        to={to}
        onFromChange={setFrom}
        onToChange={setTo}
        onReload={() => {
          setItems(null)
          setFileName(null)
        }}
        fileName={fileName}
      />

      <main className="main">
        <div className="page-header">
          <h1>Pacotes de trabalho</h1>
          <p>
            Atendimento de necessidades e requisitos, e distribuição de tarefas da equipe,
            com base na planilha importada.
          </p>
        </div>

        <section className="section">
          <h2 className="section-title">Necessidades e requisitos</h2>
          <p className="section-subtitle">
            Considerado "atendido" o item com status Confirmada.
          </p>

          <div className="stat-pair">
            <StatPanel
              label="Necessidades atendidas"
              atendidos={necessidades.atendidos}
              total={necessidades.total}
              pct={necessidades.pct}
            />
            <StatPanel
              label="Requisitos atendidos"
              atendidos={requisitos.atendidos}
              total={requisitos.total}
              pct={requisitos.pct}
            />
          </div>

          <FulfillmentByProject
            title="Necessidades atendidas por projeto"
            note="Percentual de necessidades com status Confirmada, por projeto."
            data={necessidadesPorProjeto}
          />
          <FulfillmentByProject
            title="Requisitos atendidos por projeto"
            note="Percentual de requisitos com status Confirmada, por projeto."
            data={requisitosPorProjeto}
          />
        </section>

        <section className="section">
          <h2 className="section-title">Equipe</h2>
          <p className="section-subtitle">
            Tarefas e horas registradas por membro, com a distribuição por status.
          </p>
          <TeamTable members={equipe} />
        </section>
      </main>
    </div>
  )
}
