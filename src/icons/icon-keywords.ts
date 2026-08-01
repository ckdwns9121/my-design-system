/**
 * Search terms for each icon, in the same spirit as `ComponentDoc.keywords`.
 *
 * An icon's export name is English and describes its shape, so "화살표" or
 * "쓰레기통" would find nothing. These map intent and Korean terms onto the
 * shape. Kept out of the icon modules so none of it ships to the browser.
 *
 * A unit test fails if an icon is added without an entry.
 */
export const iconKeywords: Record<string, string[]> = {
  ArrowLeftIcon: ['arrow', 'left', '화살표', '왼쪽', '뒤로', 'back', 'previous'],
  ArrowRightIcon: ['arrow', 'right', '화살표', '오른쪽', '앞으로', 'forward', 'next'],
  BellIcon: ['bell', '종', '알림', 'notification', 'alarm'],
  CalendarIcon: ['calendar', '달력', '날짜', 'date', 'schedule'],
  CheckCircleIcon: ['check circle', '체크', '완료', '성공', 'success', 'done', 'complete'],
  CheckIcon: ['check', '체크', '확인', '선택', 'tick', 'done'],
  ChevronDownIcon: ['chevron', 'down', '아래', '펼치기', 'expand', 'dropdown', 'caret'],
  ChevronLeftIcon: ['chevron', 'left', '왼쪽', '이전', 'caret'],
  ChevronRightIcon: ['chevron', 'right', '오른쪽', '다음', 'caret'],
  ChevronUpIcon: ['chevron', 'up', '위', '접기', 'collapse', 'caret'],
  ChevronsUpDownIcon: ['chevrons', 'sort', '정렬', '위아래', 'select', 'unfold'],
  ClockIcon: ['clock', '시계', '시간', 'time', 'schedule', 'recent'],
  CloseIcon: ['close', 'x', '닫기', '취소', 'dismiss', 'cancel', 'remove'],
  CopyIcon: ['copy', '복사', '복제', 'duplicate', 'clipboard'],
  DownloadIcon: ['download', '다운로드', '내려받기', 'export', 'save'],
  EditIcon: ['edit', 'pencil', '수정', '편집', '연필', 'write', 'modify'],
  ErrorIcon: ['error', '오류', '실패', '에러', 'danger', 'alert', 'exclamation'],
  ExternalLinkIcon: ['external link', '외부 링크', '새 창', 'open in new', 'launch'],
  EyeIcon: ['eye', '눈', '보기', '표시', 'view', 'show', 'visible', 'preview'],
  EyeOffIcon: ['eye off', '숨기기', '가리기', 'hide', 'hidden', 'invisible'],
  FilterIcon: ['filter', '필터', '거르기', 'sort', 'refine'],
  HelpIcon: ['help', '도움말', '물음표', 'question', 'support', 'faq'],
  InfoIcon: ['info', '정보', '안내', 'information', 'about'],
  MenuIcon: ['menu', '메뉴', '햄버거', 'hamburger', 'navigation', 'bars'],
  MinusIcon: ['minus', '빼기', '제거', 'remove', 'subtract', 'collapse'],
  MoreHorizontalIcon: ['more', '더보기', '점 세개', 'ellipsis', 'overflow', 'options'],
  MoreVerticalIcon: ['more', '더보기', '점 세개', 'ellipsis', 'kebab', 'options'],
  PlusIcon: ['plus', '추가', '더하기', 'add', 'create', 'new'],
  RefreshIcon: ['refresh', '새로고침', '갱신', 'reload', 'sync', 'retry'],
  SearchIcon: ['search', '검색', '돋보기', 'find', 'magnify', 'lookup'],
  SettingsIcon: ['settings', '설정', 'sliders', 'preferences', 'config', 'tune'],
  SpinnerIcon: ['spinner', '로딩', '스피너', 'loading', 'pending', 'progress'],
  StarIcon: ['star', '별', '즐겨찾기', 'favorite', 'bookmark', 'rating'],
  TrashIcon: ['trash', '삭제', '휴지통', '쓰레기통', 'delete', 'remove', 'bin'],
  UploadIcon: ['upload', '업로드', '올리기', 'import', 'attach'],
  UserIcon: ['user', '사용자', '사람', '계정', 'person', 'account', 'profile'],
  WarningIcon: ['warning', '경고', '주의', '느낌표', 'caution', 'alert', 'triangle'],
}
