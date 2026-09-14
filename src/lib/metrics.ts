import type { WorkItem, MemberSummary } from '../types'

export const ATENDIDO_STATUS = 'Confirmada'

export function uniqueProjects(items: WorkItem[]): string[] {
  return Array.from(new Set(items.map((i) => i.projeto).filter(Boolean))).sort()
}

export function filterItems(
  items: WorkItem[],
  projetos: string[],
  from: Date | null,
  to: Date | null
): WorkItem[] {
  return items.filter((item) => {
    if (projetos.length > 0 && !projetos.includes(item.projeto)) return false
    if (from && item.dataInicio && item.dataInicio < from) return false
    if (to && item.dataInicio && item.dataInicio > to) return false
    return true
  })
}

export function pctAtendido(items: WorkItem[], tipo: 'Necessidade' | 'Requisito') {
  const universo = items.filter((i) => i.tipo === tipo)
  const atendidos = universo.filter((i) => i.status === ATENDIDO_STATUS)
  return {
    total: universo.length,
    atendidos: atendidos.length,
    pct: universo.length ? atendidos.length / universo.length : 0,
  }
}

export function porProjeto(items: WorkItem[], tipo: 'Necessidade' | 'Requisito') {
  const projetos = uniqueProjects(items.filter((i) => i.tipo === tipo))
  return projetos
    .map((projeto) => {
      const r = pctAtendido(
        items.filter((i) => i.projeto === projeto),
        tipo
      )
      return { projeto, ...r }
    })
    .filter((r) => r.total > 0)
    .sort((a, b) => b.pct - a.pct)
}

export function teamSummary(items: WorkItem[]): MemberSummary[] {
  const tarefas = items.filter((i) => i.tipo === 'Tarefa' && i.atribuicao)
  const byMember = new Map<string, MemberSummary>()
  for (const t of tarefas) {
    if (!byMember.has(t.atribuicao)) {
      byMember.set(t.atribuicao, { nome: t.atribuicao, totalTarefas: 0, horas: 0, porStatus: {} })
    }
    const m = byMember.get(t.atribuicao)!
    m.totalTarefas += 1
    m.horas += t.tempoGasto
    m.porStatus[t.status] = (m.porStatus[t.status] ?? 0) + 1
  }
  return Array.from(byMember.values()).sort((a, b) => b.totalTarefas - a.totalTarefas)
}

export const STATUS_ORDER = [
  'Nova',
  'Especificada',
  'Em especificação',
  'Em progresso',
  'Em teste',
  'Em espera',
  'Confirmada',
]
