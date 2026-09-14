import { useRef, useState, type DragEvent } from 'react'

type Props = {
  onFile: (file: File) => void
  error: string | null
}

export function UploadZone({ onFile, error }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) onFile(file)
  }

  return (
    <div className="upload-shell">
      <div
        className={`dropzone${dragActive ? ' drag-active' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <h2>Importar planilha de pacotes de trabalho</h2>
        <p>
          Arraste o arquivo .xlsx, .xls ou .csv exportado do seu sistema de gestão,
          ou selecione um arquivo do seu computador.
        </p>
        <button className="upload-btn" onClick={() => inputRef.current?.click()}>
          Selecionar arquivo
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onFile(file)
            e.target.value = ''
          }}
        />
        {error && <p className="upload-error">{error}</p>}
        <p className="upload-hint">
          Colunas esperadas: ID, Tipo, Assunto, Status, Atribuição, Prioridade,
          Data de início, Sprint, Tempo gasto, Data de conclusão, Projeto.
        </p>
      </div>
    </div>
  )
}
