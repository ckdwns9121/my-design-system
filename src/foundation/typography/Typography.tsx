const typographyRows = [
  {
    name: 'Display',
    className: 'text-4xl font-semibold leading-tight text-content-strong',
    sample: 'Headless Core FE Design System',
    usage: '큰 화면의 핵심 제목',
  },
  {
    name: 'Heading',
    className: 'text-2xl font-semibold leading-8 text-content-strong',
    sample: 'Foundation typography',
    usage: '섹션 제목과 주요 패널 제목',
  },
  {
    name: 'Subheading',
    className: 'text-lg font-semibold leading-7 text-content-strong',
    sample: 'Primitive to semantic',
    usage: '컴포넌트 그룹 제목',
  },
  {
    name: 'Body',
    className: 'text-base leading-7 text-content-default',
    sample: '컴포넌트는 semantic token을 통해 일관된 시각 언어를 유지합니다.',
    usage: '기본 본문과 설명',
  },
  {
    name: 'Body small',
    className: 'text-sm leading-6 text-content-muted',
    sample: '상태, 설명, 보조 정보를 표시합니다.',
    usage: '도움말 텍스트와 카드 설명',
  },
  {
    name: 'Caption',
    className: 'text-xs font-medium leading-5 text-content-subtle',
    sample: 'TOKEN / COMPONENT / STATE',
    usage: '메타 정보와 짧은 라벨',
  },
]

export function Typography() {
  return (
    <section className="grid gap-4">
      <div>
        <h2 className="text-lg font-semibold text-content-strong">Typography</h2>
        <p className="text-sm leading-6 text-content-muted">
          현재 typography foundation은 Tailwind type scale과 semantic content token을 기준으로 사용합니다.
        </p>
      </div>

      <div className="grid gap-3">
        {typographyRows.map((row) => (
          <div
            className="grid gap-3 rounded-md border border-border-muted bg-surface-panel p-4 md:grid-cols-[9rem_1fr_12rem]"
            key={row.name}
          >
            <div>
              <p className="text-sm font-semibold text-content-strong">{row.name}</p>
              <p className="text-xs leading-5 text-content-subtle">{row.usage}</p>
            </div>
            <p className={row.className}>{row.sample}</p>
            <code className="self-start rounded-sm bg-surface-muted px-2 py-1 text-xs text-content-muted">
              {row.className}
            </code>
          </div>
        ))}
      </div>
    </section>
  )
}
