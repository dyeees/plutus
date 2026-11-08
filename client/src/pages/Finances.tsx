type FinancesProps = {
  navigate: (screen: string, params?: { returnTo?: string }) => void;
};

export default function Finances({ navigate }: FinancesProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col-reverse sm:flex-row sm:items-end justify-between gap-1 sm:gap-3 pb-2 border-b border-black/10">
        <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#1E2D26]">
          Commitments
        </h2>
      </div>
    </div>
  )
}