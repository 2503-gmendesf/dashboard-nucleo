import * as XLSX from 'xlsx'
import type { WorkItem } from '../types'

// Map many possible header spellings (raw export or the enriched CSV) to a canonical key.
const HEADER_MAP: Record<string, string> = {
  id: 'id',
  tipo: 'tipo',
  assunto: 'assunto',
  status: 'status',
  'atribuição': 'atribuicao',
  atribuicao: 'atribuicao',
  prioridade: 'prioridade',
  'data de início': 'dataInicio',
  'data de inicio': 'dataInicio',
  data_inicio: 'dataInicio',
  sprint: 'sprint',
  'tempo gasto': 'tempoGasto',
  tempo_gasto_horas: 'tempoGasto',
  'data de conclusão': 'dataConclusao',
  'data de conclusao': 'dataConclusao',
  data_conclusao: 'dataConclusao',
  projeto: 'projeto',
}

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase()
}

function toDate(value: unknown): Date | null {
  if (value == null || value === '') return null
  if (value instanceof Date && !isNaN(value.getTime())) return value
  if (typeof value === 'number') {
    // Excel serial date
    const parsed = XLSX.SSF.parse_date_code(value)
    if (!parsed) return null
    return new Date(parsed.y, parsed.m - 1, parsed.d)
  }
  const s = String(value).trim()
  if (!s) return null
  // DD/MM/YYYY
  const br = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (br) {
    const [, d, m, y] = br
    return new Date(Number(y), Number(m) - 1, Number(d))
  }
  // YYYY-MM-DD
  const iso = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)
  if (iso) {
    const [, y, m, d] = iso
    return new Date(Number(y), Number(m) - 1, Number(d))
  }
  const fallback = new Date(s)
  return isNaN(fallback.getTime()) ? null : fallback
}

function toNumber(value: unknown): number {
  if (value == null || value === '') return 0
  if (typeof value === 'number') return value
  const n = Number(String(value).replace(',', '.'))
  return isNaN(n) ? 0 : n
}

export async function parseWorkbook(file: File): Promise<WorkItem[]> {
  const buf = await file.arrayBuffer()
  const wb = XLSX.read(buf, { type: 'array', cellDates: true })
  const sheet = wb.Sheets[wb.SheetNames[0]]
  const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, { defval: '' })

  return rows
    .map((row): WorkItem | null => {
      const canon: Record<string, unknown> = {}
      for (const [rawKey, value] of Object.entries(row)) {
        const key = HEADER_MAP[normalizeHeader(rawKey)]
        if (key) canon[key] = value
      }
      if (!canon.id && !canon.assunto) return null
      return {
        id: String(canon.id ?? ''),
        tipo: String(canon.tipo ?? '').trim(),
        assunto: String(canon.assunto ?? ''),
        status: String(canon.status ?? '').trim(),
        atribuicao: String(canon.atribuicao ?? '').trim(),
        prioridade: String(canon.prioridade ?? '').trim(),
        dataInicio: toDate(canon.dataInicio),
        sprint: String(canon.sprint ?? '').trim(),
        tempoGasto: toNumber(canon.tempoGasto),
        dataConclusao: toDate(canon.dataConclusao),
        projeto: String(canon.projeto ?? '').trim(),
      }
    })
    .filter((r): r is WorkItem => r !== null)
}
