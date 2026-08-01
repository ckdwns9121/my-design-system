import { Badge } from './components/badge'
import { Button } from './components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './components/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './components/table'
import { TextField } from './components/text-field'
import { ToggleButton } from './components/toggle-button'
import { ColorPalette, Spacing, Typography } from './foundation'

function App() {
  return (
    <main className="min-h-svh bg-surface-canvas px-5 py-8 text-content-default sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-4 border-b border-border-default pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <Badge tone="primary">Tailwind + Storybook</Badge>
            <h1 className="text-3xl font-semibold text-content-strong sm:text-4xl">
              My Design System
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-content-muted">
              녹색 Primary를 primitive 토큰의 기준으로 두고 semantic 토큰을 통해 컴포넌트에 연결합니다.
            </p>
          </div>
          <div className="flex gap-2">
            <Button>시작하기</Button>
            <Button variant="secondary">문서 보기</Button>
          </div>
        </header>

        <ColorPalette />
        <Typography />
        <Spacing />

        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Components</CardTitle>
              <CardDescription>버튼, 배지, 카드, 입력 필드부터 확장합니다.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge tone="success">Success</Badge>
              <Badge tone="warning">Warning</Badge>
              <Badge tone="danger">Danger</Badge>
              <ToggleButton defaultPressed>자동 배차</ToggleButton>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Table</CardTitle>
              <CardDescription>네이티브 table semantics 위에 토큰 스타일을 입힙니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-content-strong">ToggleButton</TableCell>
                    <TableCell>Ready</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-content-strong">Checkbox</TableCell>
                    <TableCell>Next</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Form controls</CardTitle>
              <CardDescription>접근성 속성과 에러 상태를 기본으로 포함합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <TextField label="이메일" placeholder="you@example.com" helperText="제품 업데이트를 받을 주소입니다." />
            </CardContent>
            <CardFooter>
              <Button size="sm">저장</Button>
              <Button size="sm" variant="subtle">취소</Button>
            </CardFooter>
          </Card>
        </section>
      </div>
    </main>
  )
}

export default App
