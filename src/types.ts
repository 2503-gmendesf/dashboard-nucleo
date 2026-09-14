export type WorkItem = {
  id: string
  tipo: string
  assunto: string
  status: string
  atribuicao: string
  prioridade: string
  dataInicio: Date | null
  sprint: string
  tempoGasto: number
  dataConclusao: Date | null
  projeto: string
}

export type MemberSummary = {
  nome: string
  totalTarefas: number
  horas: number
  porStatus: Record<string, number>
}
