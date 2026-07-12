# Table을 넘어 Data Grid로: React에서 Headless Table 직접 구현하기

`Table` 컴포넌트를 만든다고 하면 보통 `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`에 스타일을 입히는 작업부터 떠올린다. 데이터를 읽기 전용으로 보여주는 용도라면 이것만으로 충분하다.

하지만 요구사항에 정렬, 행 선택, 전체 선택, 키보드 탐색이 추가되면 이야기가 달라진다. 이제 이 컴포넌트는 단순한 표가 아니라 상태와 포커스를 관리하는 인터랙티브 위젯이다.

이 글에서는 외부 Headless UI 라이브러리 없이 다음 기능을 직접 구현한 과정을 다룬다.

- 단일 컬럼 오름차순/내림차순 정렬
- 단일 및 다중 행 선택
- 전체 선택과 `indeterminate` 상태
- Arrow, Home, End, Ctrl/Cmd+Home/End, PageUp/PageDown 탐색
- Controlled/Uncontrolled API
- `aria-sort`, `aria-selected`, `aria-multiselectable`
- Tailwind 스타일과 Headless 동작의 분리

구현 환경은 React 19, TypeScript, Tailwind CSS 4, Storybook 10이다.

## 먼저 Table과 Grid를 구분해야 한다

가장 먼저 결정할 것은 “어떻게 구현할까?”가 아니라 “이 컴포넌트가 정말 grid인가?”이다.

정적인 데이터 표는 네이티브 `<table>`만으로도 브라우저와 보조 기술에 행, 열, 헤더 관계를 전달한다. 별도의 방향키 탐색도 요구되지 않는다. 반면 WAI-ARIA의 `grid`는 여러 포커스 대상을 포함하고, 작성자가 내부 포커스 이동을 직접 구현해야 하는 composite widget이다.

[WAI-ARIA Grid Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)은 grid 내부에서 페이지의 Tab 순서에 포함되는 대상을 하나로 유지하고, 방향키로 셀 사이를 이동하도록 설명한다. 즉, `role="grid"`만 추가한다고 grid 구현이 끝나는 것이 아니다.

그래서 기본 Table은 기존 네이티브 동작을 유지하고, 인터랙션이 필요한 경우에만 `grid`를 켜도록 설계했다.

```tsx
<Table>...</Table>

<Table grid aria-multiselectable>
  ...
</Table>
```

이 구분이 중요한 이유는 명확하다.

- 모든 표를 grid로 만들면 필요하지 않은 포커스 관리 코드가 생긴다.
- 잘못 구현된 ARIA는 네이티브 HTML보다 접근성이 나빠질 수 있다.
- 정적 Table과 인터랙티브 Data Grid는 키보드 사용자의 기대가 다르다.

## 책임부터 나눈다

Headless 컴포넌트는 “CSS가 없는 컴포넌트”가 아니다. 동작과 표현의 책임을 분리한 컴포넌트다.

이번 구현은 네 계층으로 나눴다.

| 계층 | 책임 |
| --- | --- |
| 상태 Hook | 정렬과 선택 상태, Controlled/Uncontrolled API |
| Headless Primitive | DOM semantics, ARIA, 이벤트, 포커스 이동 |
| Styled Component | Tailwind, semantic token, focus/selection 표현 |
| Consumer | 실제 데이터, 컬럼 정의, 정렬 값, 선택된 행 처리 |

데이터 흐름은 다음과 같다.

```text
rows ──> useTableSort ──> sortedRows ──> render
  │
rowIds ──> useTableSelection ──> selectedRowIds
                                      │
                                      ▼
                           <Table grid> + ARIA
                                      │
                                      ▼
                          semantic token styles
```

정렬과 선택은 데이터 상태다. 방향키 탐색은 DOM과 포커스 상태다. 둘을 한 컴포넌트 안에 모두 넣으면 데이터 모델과 DOM 탐색 코드가 강하게 결합된다. 따라서 데이터 상태는 Hook으로, 포커스 동작은 Primitive로 분리했다.

## Controlled와 Uncontrolled를 공통 상태 모델로 만든다

디자인 시스템 컴포넌트는 두 가지 사용 방식을 지원할 필요가 있다.

- 부모가 상태를 소유하는 Controlled 방식
- 컴포넌트가 내부 상태를 소유하는 Uncontrolled 방식

예를 들어 서버 검색 조건과 연결된 정렬은 부모가 상태를 소유해야 한다. 반대로 단순한 로컬 예제는 `defaultSortDescriptor`만 전달해도 동작하는 편이 편리하다.

공통 Hook의 핵심은 `value`가 전달됐는지 확인하는 것이다.

```tsx
function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateOptions<T>) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : uncontrolledValue

  const setValue = (nextValue: T | ((previousValue: T) => T)) => {
    const resolvedValue =
      typeof nextValue === 'function'
        ? (nextValue as (previousValue: T) => T)(currentValue)
        : nextValue

    if (!isControlled) {
      setUncontrolledValue(resolvedValue)
    }

    onChange?.(resolvedValue)
  }

  return [currentValue, setValue] as const
}
```

이 Hook을 정렬과 선택이 함께 사용한다. 중요한 점은 Controlled 모드에서 내부 상태를 바꾸지 않는다는 것이다. 변경 요청은 `onChange`로 부모에게 전달하고, 화면에 표시할 값은 계속 부모가 전달한 `value`를 사용한다.

## 정렬 상태는 boolean이 아니라 descriptor다

정렬 상태를 `isAscending` 같은 boolean 하나로 표현하면 어느 컬럼이 정렬 중인지 알 수 없다. 따라서 컬럼과 방향을 함께 보관한다.

```ts
type TableSortDirection = 'ascending' | 'descending'

type TableSortDescriptor<ColumnId extends string> = {
  columnId: ColumnId
  direction: TableSortDirection
}
```

`useTableSort`는 데이터 구조를 직접 알지 않는다. Consumer가 `getSortValue`를 제공한다.

```tsx
const {
  sortDescriptor,
  sortedRows,
  toggleSort,
} = useTableSort({
  rows,
  getSortValue: (row, columnId) => row[columnId],
})
```

이 구조에는 두 가지 장점이 있다.

1. Headless Hook이 특정 Row 타입이나 컬럼 이름에 의존하지 않는다.
2. 화면에 렌더링하는 값과 실제 정렬 기준을 다르게 만들 수 있다.

예를 들어 화면에는 날짜를 `2026년 7월 12일`로 보여주면서 정렬 값으로는 `Date` 객체를 반환할 수 있다.

정렬 결과는 같은 값의 기존 순서를 보존하도록 index를 함께 비교한다.

```ts
const sortedRows = rows
  .map((row, index) => ({ index, row }))
  .sort((left, right) => {
    const comparison = compareValues(
      getSortValue(left.row, columnId),
      getSortValue(right.row, columnId),
      columnId,
    )

    return comparison === 0
      ? left.index - right.index
      : comparison * directionMultiplier
  })
  .map(({ row }) => row)
```

정렬 기능을 Header가 직접 수행하지 않는 것도 중요하다. Header는 `onSortChange`를 호출하고 현재 `sortDirection`을 표현할 뿐이다. 데이터 순서를 결정하는 책임은 Hook에 남는다.

## 정렬 가능한 Header에는 네이티브 button을 사용한다

초기 구현에서는 `<th>`에 click과 keydown 이벤트를 직접 연결할 수 있다. 하지만 그러면 `<th>`를 버튼처럼 동작하게 만드는 키보드 규칙까지 직접 재현해야 한다.

더 단순하고 정확한 방법은 `<th>` 내부에 네이티브 `<button>`을 두는 것이다.

```tsx
<th
  aria-sort={
    sortable && sortDirection !== 'none'
      ? sortDirection
      : undefined
  }
  data-grid-cell={grid ? '' : undefined}
>
  {sortable ? (
    <button
      data-grid-focus-target=""
      onClick={onSortChange}
      type="button"
    >
      {children}
    </button>
  ) : (
    children
  )}
</th>
```

이제 Enter와 Space 활성화는 브라우저가 처리한다. Headless Primitive는 정렬 요청과 grid 포커스 대상 연결만 담당한다.

`aria-sort`는 현재 정렬 기준인 Header에만 `ascending` 또는 `descending`으로 설정한다. WAI-ARIA 1.2는 한 Table 또는 Grid에서 현재 정렬을 나타내는 Header 하나에 `aria-sort`를 적용하도록 권고한다. 정렬 아이콘은 `aria-hidden="true"`로 접근성 트리에서 제외한다.

[WAI-ARIA Sortable Table Example](https://www.w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/) 역시 네이티브 Table 구조를 유지하면서 Header 내부의 button과 현재 정렬 컬럼의 `aria-sort`를 조합한다.

## 선택 상태와 포커스 상태를 분리한다

Grid 구현에서 자주 섞이는 두 상태가 있다.

- Focused: 현재 키보드 포커스가 있는 셀
- Selected: 사용자가 작업 대상으로 선택한 행

포커스가 이동한다고 선택까지 자동으로 바뀌면 다중 선택 UX를 만들기 어렵다. 반대로 선택된 행이 반드시 포커스를 가져야 하는 것도 아니다. 따라서 선택 상태는 `useTableSelection`, 포커스 상태는 Table Primitive가 각각 관리한다.

선택 API는 배열을 사용하고, 조회에는 `Set`을 사용했다.

```tsx
const selectedRowIdSet = useMemo(
  () => new Set(selectedRowIds),
  [selectedRowIds],
)

const isRowSelected = useCallback(
  (rowId: RowId) => selectedRowIdSet.has(rowId),
  [selectedRowIdSet],
)
```

배열은 props와 callback으로 전달하고 직렬화하기 편하다. `Set`은 렌더링 중 각 행의 선택 여부를 반복 조회할 때 사용한다.

전체 선택 상태는 세 가지다.

```ts
const allRowsSelected =
  rowIds.length > 0 &&
  rowIds.every((rowId) => selectedRowIdSet.has(rowId))

const someRowsSelected =
  !allRowsSelected &&
  rowIds.some((rowId) => selectedRowIdSet.has(rowId))
```

- 아무것도 선택하지 않음
- 일부만 선택한 `indeterminate`
- 모두 선택함

HTML checkbox의 `indeterminate`는 JSX attribute가 아니라 DOM property다. 따라서 ref로 직접 동기화해야 한다.

```tsx
const inputRef = useRef<HTMLInputElement>(null)

useEffect(() => {
  if (inputRef.current) {
    inputRef.current.indeterminate = indeterminate
  }
}, [indeterminate])

return (
  <input
    ref={inputRef}
    type="checkbox"
    checked={checked}
    aria-checked={indeterminate ? 'mixed' : checked}
  />
)
```

선택된 Row에는 `aria-selected`를 함께 노출한다.

```tsx
<tr
  aria-selected={selectable ? Boolean(selected) : undefined}
  data-state={selected ? 'selected' : undefined}
/>
```

Styled 계층은 `data-state="selected"`를 semantic color token에 연결한다. Headless 계층은 선택 색상을 알 필요가 없다.

## Row click에서 중복 선택을 막는다

행 전체를 클릭해 선택할 수 있게 만들면 checkbox 클릭이 Row의 click 이벤트까지 bubble된다. 아무 처리도 하지 않으면 checkbox가 한 번 선택하고 Row가 다시 해제하는 문제가 생긴다.

그래서 Row는 이벤트가 interactive element에서 시작했는지 확인한다.

```ts
const interactiveElementSelector = [
  'a[href]',
  'button',
  'input',
  'select',
  'textarea',
  '[contenteditable="true"]',
  '[role="button"]',
  '[role="checkbox"]',
].join(',')

if (event.target.closest(interactiveElementSelector)) {
  return
}
```

`stopPropagation()`을 checkbox마다 반복하는 대신 Row가 자신의 선택 규칙을 책임지도록 했다. Consumer가 Row 안에 새로운 버튼이나 링크를 추가해도 같은 보호 로직을 재사용할 수 있다.

현재 학습용 구현은 일반 data cell에서 Space를 누르면 Row 선택을 전환한다. APG가 제시하는 대표적인 다중 선택 관례에는 Shift+Space가 포함된다. 실제 제품에서는 plain Space, Shift+Space, checkbox 전용 선택 중 어떤 모델을 사용할지 먼저 정하고, 화면 안내와 테스트도 같은 규칙에 맞춰야 한다.

## Roving tabindex로 Tab stop을 하나만 유지한다

Grid의 핵심은 roving tabindex다.

- 현재 진입점만 `tabIndex=0`
- 나머지 셀은 `tabIndex=-1`
- 방향키가 눌리면 새 대상에 `tabIndex=0`을 옮기고 `focus()` 호출

```ts
function setGridTabStop(
  table: HTMLTableElement,
  target: HTMLElement,
) {
  for (const row of getGridRows(table)) {
    for (const cell of getGridCells(row)) {
      cell.tabIndex = -1

      for (const nestedTarget of cell.querySelectorAll<HTMLElement>(
        '[data-grid-focus-target]',
      )) {
        nestedTarget.tabIndex = -1
      }
    }
  }

  target.tabIndex = 0
}
```

이 구조에서 Tab은 Grid 안의 모든 셀을 순회하지 않는다. 사용자는 Tab으로 Grid에 진입한 뒤 방향키로 내부를 탐색하고, 다시 Tab을 누르면 다음 컴포넌트로 이동한다.

## 셀과 셀 내부 위젯 중 무엇에 포커스할까?

모든 경우에 `<td>`만 포커스하면 checkbox나 button의 역할이 제대로 전달되지 않을 수 있다. 반대로 모든 자식 요소를 Tab 순서에 넣으면 Grid의 단일 Tab stop 규칙이 깨진다.

이번 구현은 `data-grid-focus-target`으로 셀의 대표 포커스 대상을 지정한다.

```ts
function getGridFocusTarget(cell: HTMLTableCellElement) {
  const nestedTarget = cell.querySelector<HTMLElement>(
    '[data-grid-focus-target]',
  )

  if (nestedTarget && !nestedTarget.matches(':disabled')) {
    return nestedTarget
  }

  return cell
}
```

- 텍스트만 있는 셀은 셀 자체에 포커스
- 선택 셀은 checkbox에 포커스
- 정렬 Header는 button에 포커스

이는 Grid Pattern에서 설명하는 “셀에 단일 위젯이 있으면 위젯에 포커스하고, 텍스트 셀은 셀 자체에 포커스한다”는 방식과 맞는다.

## 키보드 이벤트는 Root에서 위임한다

각 셀에 `onKeyDown`을 반복하지 않고 Table Root에서 이벤트를 위임한다.

```tsx
<table
  role={grid ? 'grid' : undefined}
  onKeyDown={(event) => {
    const cell = getGridCellFromTarget(event.target, table)

    if (!cell || event.defaultPrevented) {
      return
    }

    if (moveGridFocus(
      table,
      cell,
      event.key,
      event.ctrlKey || event.metaKey,
    )) {
      event.preventDefault()
    }
  }}
>
  {children}
</table>
```

현재 구현의 키 매핑은 다음과 같다.

| 키 | 이동 |
| --- | --- |
| ArrowLeft / ArrowRight | 같은 Row의 이전/다음 셀 |
| ArrowUp / ArrowDown | 같은 Column 위치의 이전/다음 Row |
| Home / End | 현재 Row의 첫/마지막 셀 |
| Ctrl/Cmd + Home / End | 전체 Grid의 첫/마지막 셀 |
| PageUp / PageDown | 현재 구현에서는 첫/마지막 렌더링 Row |

`PageUp`과 `PageDown`은 데이터 양과 viewport에 따라 제품별 정의가 필요하다. WAI-ARIA APG는 보통 현재 보이는 Row 묶음을 기준으로 이동하도록 설명한다. 작은 학습용 Grid에서는 렌더링된 경계로 이동하게 했지만, virtualized grid에서는 viewport와 scroll position을 기준으로 다시 구현해야 한다.

## 정렬 후에도 포커스를 잃지 않게 한다

정렬하면 Row의 DOM 순서가 바뀐다. 이때 단순히 첫 번째 셀을 다시 `tabIndex=0`으로 만들면 사용자가 있던 위치를 잃는다.

Root effect는 다음 우선순위로 roving tab stop을 복구한다.

1. 현재 `document.activeElement`가 Grid 안에 있으면 해당 대상 유지
2. 기존 `tabIndex=0` 대상 유지
3. 둘 다 없으면 첫 번째 셀 또는 셀 내부 위젯 선택

```ts
const activeElement = document.activeElement
const activeCell = getGridCellFromTarget(activeElement, table)
const currentTabStop = table.querySelector<HTMLElement>(
  '[data-grid-cell][tabindex="0"], ' +
  '[data-grid-focus-target][tabindex="0"]',
)

const preferredTarget = activeCell
  ? getGridFocusTarget(activeCell)
  : currentTabStop ?? getGridFocusTarget(firstCell)
```

Row를 렌더링할 때 안정적인 `key`를 사용하는 것도 필요하다. 정렬 전후에 같은 Row가 같은 DOM identity를 유지해야 브라우저가 포커스를 보존하기 쉽다.

## Styled 계층에서는 semantic token만 사용한다

Headless Primitive에는 Tailwind class가 없다. Styled Table이 Headless Primitive를 감싸고 focus, hover, selected 상태를 표현한다.

```tsx
function TableRow({ className, ...props }: TableRowProps) {
  return (
    <HeadlessTableRow
      className={cn(
        'transition-colors hover:bg-surface-muted/70',
        'data-[state=selected]:bg-primary-surface',
        className,
      )}
      {...props}
    />
  )
}
```

여기서 `primary-surface`, `surface-muted`, `focus-default`는 semantic token이다. Headless 로직은 Primary가 초록색인지, 선택 배경이 어떤 색인지 알지 못한다.

이 경계를 지키면 다음 변화가 서로 독립적이다.

- 키보드 동작을 고쳐도 색상 토큰은 바뀌지 않는다.
- 테마를 바꿔도 정렬과 선택 로직은 바뀌지 않는다.
- 스타일 없이 Primitive만 다른 제품에서 재사용할 수 있다.

## 최종 사용 API

Consumer는 상태 Hook과 Table Primitive를 조합한다.

```tsx
function ComponentGrid({ rows }: { rows: Row[] }) {
  const {
    sortDescriptor,
    sortedRows,
    toggleSort,
  } = useTableSort({
    rows,
    getSortValue: (row, columnId) => row[columnId],
  })

  const {
    allRowsSelected,
    someRowsSelected,
    isRowSelected,
    setAllRowsSelected,
    setRowSelected,
  } = useTableSelection({
    rowIds: rows.map((row) => row.id),
  })

  return (
    <Table grid aria-multiselectable>
      <TableHeader>
        <TableRow>
          <TableHead>
            <TableSelectionCheckbox
              aria-label="Select all rows"
              checked={allRowsSelected}
              indeterminate={someRowsSelected}
              onChange={(event) =>
                setAllRowsSelected(event.currentTarget.checked)
              }
            />
          </TableHead>

          <TableHead
            sortDirection={
              sortDescriptor?.columnId === 'name'
                ? sortDescriptor.direction
                : 'none'
            }
            onSortChange={() => toggleSort('name')}
          >
            Name
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {sortedRows.map((row) => (
          <TableRow
            key={row.id}
            selected={isRowSelected(row.id)}
            onSelectedChange={(selected) =>
              setRowSelected(row.id, selected)
            }
          >
            <TableCell>
              <TableSelectionCheckbox
                aria-label={`Select ${row.name}`}
                checked={isRowSelected(row.id)}
                onChange={(event) =>
                  setRowSelected(row.id, event.currentTarget.checked)
                }
              />
            </TableCell>
            <TableCell>{row.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

Headless는 모든 것을 자동으로 추측하지 않는다. 데이터의 Row ID와 정렬 값은 Consumer가 알고, ARIA와 포커스 규칙은 Primitive가 안다. 이 분리가 API를 조금 더 명시적으로 만들지만 각 계층의 책임은 훨씬 선명해진다.

## 무엇을 테스트해야 하는가

접근성 컴포넌트는 DOM 모양만 확인해서는 부족하다. 상태와 실제 키보드 이동을 함께 검증해야 한다.

### Unit test

- 오름차순과 내림차순 전환
- 같은 정렬 값의 안정적인 순서
- Controlled 상태에서 callback만 호출되는지
- 단일/다중/전체 선택
- checkbox의 native `indeterminate` property
- Grid를 끈 Table에 `role="grid"`와 roving tabindex가 생기지 않는지

### Storybook interaction test

- 정렬 button 클릭 후 Row 순서와 `aria-sort`가 함께 바뀌는지
- 일부 선택 시 전체 선택 checkbox가 `mixed`가 되는지
- 선택된 Row가 `aria-selected="true"`인지
- Arrow 키가 checkbox, Header button, data cell 사이를 이동하는지
- End와 Ctrl/Cmd+Home이 올바른 경계로 이동하는지
- 포커스 링과 선택 배경이 semantic token 색상으로 렌더링되는지

자동화 검증과 별개로 실제 스크린리더와 브라우저 조합을 확인해야 한다. APG 예제도 브라우저와 보조 기술 조합에 따라 지원 차이가 있을 수 있음을 명시한다.

## 현재 구현의 경계

이 구현은 Headless Data Grid의 핵심을 학습하기 위한 범위다. 다음 요구사항은 별도의 설계가 필요하다.

- Virtualization: `aria-rowcount`, `aria-rowindex`, `aria-colcount`, `aria-colindex`
- 편집 가능한 셀: Enter/F2로 탐색 모드와 편집 모드 전환
- Range selection: Shift+Arrow 또는 Shift+Space 규칙
- 다중 컬럼 정렬: 우선순위를 별도로 설명할 UI와 접근성 전략
- `rowSpan`/`colSpan`: 단순 DOM cell index가 아닌 논리 좌표 계산
- 서버 정렬: Hook이 직접 정렬하지 않고 descriptor만 상위 데이터 요청에 전달
- 대용량 PageUp/PageDown: viewport 및 scroll position 기반 이동
- 브라우저 및 스크린리더 조합별 수동 검증

특히 DOM에 전체 Row가 존재하지 않는 virtualization에서는 브라우저가 전체 Row 수와 위치를 추론할 수 없다. 이 경우 [Grid and Table Properties](https://www.w3.org/WAI/ARIA/apg/practices/grid-and-table-properties/)에서 설명하는 count/index 속성이 필요하다.

## 구현 순서를 정리하면

Headless Table을 직접 구현할 때는 다음 순서가 안전하다.

1. 네이티브 `<table>` 구조로 정적 Table을 먼저 만든다.
2. 인터랙션이 있을 때만 `grid`를 opt-in한다.
3. 정렬과 선택을 DOM에서 분리된 상태 Hook으로 만든다.
4. `aria-sort`, `aria-selected`, `aria-multiselectable`을 실제 상태와 연결한다.
5. roving tabindex로 Grid의 Tab stop을 하나로 만든다.
6. 텍스트 셀과 셀 내부 위젯의 포커스 대상을 구분한다.
7. 이벤트 위임으로 방향키 탐색을 Root에 모은다.
8. Styled 계층에서 semantic token으로 상태를 표현한다.
9. Unit test와 실제 브라우저 Storybook test를 함께 작성한다.
10. 구현하지 않은 범위를 문서에 명시한다.

## 마무리

Table을 Headless로 만든다는 것은 HTML tag를 여러 컴포넌트로 나누는 일이 아니다. 데이터 상태, 접근성 상태, 포커스 상태, 시각 상태의 소유자를 결정하는 일이다.

이번 구현에서 가장 중요했던 결정은 세 가지였다.

- 정적인 Table을 억지로 Grid로 만들지 않는다.
- 선택과 정렬은 상태 Hook, 키보드와 ARIA는 Primitive가 소유한다.
- 직접 재현할 필요가 없는 버튼과 checkbox 동작은 네이티브 HTML에 맡긴다.

이 경계가 잡히면 정렬, 선택, 키보드 탐색은 서로 뒤엉킨 기능이 아니라 독립적으로 테스트하고 조합할 수 있는 Headless 기능이 된다.

## 참고 자료

- [WAI-ARIA APG: Grid Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
- [WAI-ARIA 1.2: aria-sort](https://www.w3.org/TR/wai-aria/#aria-sort)
- [WAI-ARIA APG: Sortable Table Example](https://www.w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/)
- [WAI-ARIA APG: Grid and Table Properties](https://www.w3.org/WAI/ARIA/apg/practices/grid-and-table-properties/)
- [WAI-ARIA APG: Developing a Keyboard Interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)
