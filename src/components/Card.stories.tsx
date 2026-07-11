import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './Badge'
import { Button } from './Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './Card'

const meta = {
  component: Card,
  tags: ['ai-generated'],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Billing summary</CardTitle>
        <CardDescription>이번 달 구독 상태와 결제 예정 금액입니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <span className="text-content-muted">Plan</span>
          <Badge tone="primary">Pro</Badge>
        </div>
      </CardContent>
    </Card>
  ),
}

export const WithActions: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Invite member</CardTitle>
        <CardDescription>팀원의 권한을 지정하고 초대를 보냅니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-content-muted">
          초대 링크는 7일 동안 유효하며, 승인 전까지 권한을 변경할 수 있습니다.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="subtle">Cancel</Button>
        <Button>Send invite</Button>
      </CardFooter>
    </Card>
  ),
}
