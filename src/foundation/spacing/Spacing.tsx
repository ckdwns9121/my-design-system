const spacingRows = [
  { name: '1', value: '0.25rem / 4px', className: 'w-1' },
  { name: '2', value: '0.5rem / 8px', className: 'w-2' },
  { name: '3', value: '0.75rem / 12px', className: 'w-3' },
  { name: '4', value: '1rem / 16px', className: 'w-4' },
  { name: '6', value: '1.5rem / 24px', className: 'w-6' },
  { name: '8', value: '2rem / 32px', className: 'w-8' },
  { name: '10', value: '2.5rem / 40px', className: 'w-10' },
  { name: '12', value: '3rem / 48px', className: 'w-12' },
  { name: '16', value: '4rem / 64px', className: 'w-16' },
  { name: '20', value: '5rem / 80px', className: 'w-20' },
  { name: '24', value: '6rem / 96px', className: 'w-24' },
]

export function Spacing() {
  return (
    <section className="grid gap-4">
      <div>
        <h2 className="text-lg font-semibold text-content-strong">Spacing</h2>
        <p className="text-sm leading-6 text-content-muted">
          현재 spacing foundation은 Tailwind 기본 4px scale을 기준으로 사용합니다.
        </p>
      </div>

      <div className="grid gap-2 rounded-md border border-border-muted bg-surface-panel p-4">
        {spacingRows.map((row) => (
          <div className="grid grid-cols-[4rem_8rem_1fr] items-center gap-3" key={row.name}>
            <p className="text-sm font-medium text-content-strong">space.{row.name}</p>
            <p className="text-xs text-content-muted">{row.value}</p>
            <div className="min-w-0">
              <div className={`${row.className} h-4 rounded-sm bg-primary-solid`} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
