type EditRecordProps = {
  record: any
  onCancel: () => void
  onSaved?: () => void
}

export default function EditRecord({ record, onCancel, onSaved }: EditRecordProps) {
  void record
  void onSaved

  return (
        <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-black/10 pb-3">
        <h2 className="font-serif text-2xl font-medium tracking-tight text-[#1E2D26]">
          Edit Entry
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-mono text-[#4A6358] hover:text-[#1E2D26] transition-colors"
        >
          Cancel
        </button>
      </div>

      <pre className="text-xs font-mono text-[#4A6358] overflow-x-auto">
        {JSON.stringify(record, null, 2)}
      </pre>
    </div>
  )
}