// Intensity increases with how far along the workflow a status is —
// so color encodes progress rather than an arbitrary category.
export const STATUS_COLORS: Record<string, string> = {
  Nova: '#c6dbf1',
  Especificada: '#9cbde8',
  'Em especificação': '#9cbde8',
  'Em espera': '#6a9adb',
  'Em progresso': '#3d78c9',
  'Em teste': '#1e5296',
  Confirmada: '#12335f',
}

export function statusColor(status: string): string {
  return STATUS_COLORS[status] ?? '#8497b5'
}
