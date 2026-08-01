import { createIcon } from './createIcon'

/* Direction ---------------------------------------------------------------- */

export const ChevronDownIcon = createIcon('ChevronDownIcon', <path d="M6 9.5 12 15.5 18 9.5" />)

export const ChevronUpIcon = createIcon('ChevronUpIcon', <path d="M6 14.5 12 8.5 18 14.5" />)

export const ChevronLeftIcon = createIcon('ChevronLeftIcon', <path d="M14.5 6 8.5 12 14.5 18" />)

export const ChevronRightIcon = createIcon('ChevronRightIcon', <path d="M9.5 6 15.5 12 9.5 18" />)

export const ArrowLeftIcon = createIcon(
  'ArrowLeftIcon',
  <>
    <path d="M20 12H4" />
    <path d="M10 6 4 12 10 18" />
  </>,
)

export const ArrowRightIcon = createIcon(
  'ArrowRightIcon',
  <>
    <path d="M4 12h16" />
    <path d="M14 6l6 6-6 6" />
  </>,
)

export const ChevronsUpDownIcon = createIcon(
  'ChevronsUpDownIcon',
  <>
    <path d="M8 10 12 6 16 10" />
    <path d="M8 14 12 18 16 14" />
  </>,
)

/* Actions ------------------------------------------------------------------ */

export const CheckIcon = createIcon('CheckIcon', <path d="M4.5 12.5 9.5 17.5 19.5 6.5" />)

export const CloseIcon = createIcon(
  'CloseIcon',
  <>
    <path d="M6 6 18 18" />
    <path d="M18 6 6 18" />
  </>,
)

export const PlusIcon = createIcon(
  'PlusIcon',
  <>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </>,
)

export const MinusIcon = createIcon('MinusIcon', <path d="M5 12h14" />)

export const SearchIcon = createIcon(
  'SearchIcon',
  <>
    <circle cx="11" cy="11" r="6.25" />
    <path d="M15.6 15.6 20 20" />
  </>,
)

export const EditIcon = createIcon(
  'EditIcon',
  <>
    <path d="M4 20.5h4L19 9.5a2.1 2.1 0 0 0-3-3L5 17.5v3z" />
    <path d="M14.5 8 17 10.5" />
  </>,
)

export const TrashIcon = createIcon(
  'TrashIcon',
  <>
    <path d="M4 7h16" />
    <path d="M9.5 7V4.5h5V7" />
    <path d="M6.5 7 7.5 20h9L17.5 7" />
    <path d="M10.5 11v5" />
    <path d="M13.5 11v5" />
  </>,
)

export const CopyIcon = createIcon(
  'CopyIcon',
  <>
    <rect height="11" rx="2" width="11" x="9" y="9" />
    <path d="M15 5.5A1.5 1.5 0 0 0 13.5 4h-8A1.5 1.5 0 0 0 4 5.5v8A1.5 1.5 0 0 0 5.5 15" />
  </>,
)

export const DownloadIcon = createIcon(
  'DownloadIcon',
  <>
    <path d="M12 4v10.5" />
    <path d="M8 11 12 15 16 11" />
    <path d="M5 19.5h14" />
  </>,
)

export const UploadIcon = createIcon(
  'UploadIcon',
  <>
    <path d="M12 20V9.5" />
    <path d="M8 13 12 9 16 13" />
    <path d="M5 4.5h14" />
  </>,
)

export const RefreshIcon = createIcon(
  'RefreshIcon',
  <>
    <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" />
    <path d="M19.5 4.5V10h-5.5" />
  </>,
)

export const FilterIcon = createIcon(
  'FilterIcon',
  <>
    <path d="M4 6.5h16" />
    <path d="M7 12h10" />
    <path d="M10 17.5h4" />
  </>,
)

export const SettingsIcon = createIcon(
  'SettingsIcon',
  <>
    <path d="M4 8h8" />
    <path d="M17 8h3" />
    <path d="M4 16h3" />
    <path d="M12 16h8" />
    <circle cx="14.5" cy="8" r="2.5" />
    <circle cx="9.5" cy="16" r="2.5" />
  </>,
)

export const MoreHorizontalIcon = createIcon(
  'MoreHorizontalIcon',
  <>
    <circle cx="5.5" cy="12" fill="currentColor" r="1.3" stroke="none" />
    <circle cx="12" cy="12" fill="currentColor" r="1.3" stroke="none" />
    <circle cx="18.5" cy="12" fill="currentColor" r="1.3" stroke="none" />
  </>,
)

export const MoreVerticalIcon = createIcon(
  'MoreVerticalIcon',
  <>
    <circle cx="12" cy="5.5" fill="currentColor" r="1.3" stroke="none" />
    <circle cx="12" cy="12" fill="currentColor" r="1.3" stroke="none" />
    <circle cx="12" cy="18.5" fill="currentColor" r="1.3" stroke="none" />
  </>,
)

export const ExternalLinkIcon = createIcon(
  'ExternalLinkIcon',
  <>
    <path d="M14 4.5h5.5V10" />
    <path d="M19.5 4.5 11 13" />
    <path d="M18 13.5v4.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 5 18V8a1.5 1.5 0 0 1 1.5-1.5H11" />
  </>,
)

export const MenuIcon = createIcon(
  'MenuIcon',
  <>
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h16" />
  </>,
)

/* Status ------------------------------------------------------------------- */

export const CheckCircleIcon = createIcon(
  'CheckCircleIcon',
  <>
    <circle cx="12" cy="12" r="8.25" />
    <path d="M8.5 12.3 11 14.8 15.5 9.8" />
  </>,
)

export const InfoIcon = createIcon(
  'InfoIcon',
  <>
    <circle cx="12" cy="12" r="8.25" />
    <path d="M12 11.5v5" />
    <circle cx="12" cy="8.2" fill="currentColor" r="1" stroke="none" />
  </>,
)

export const WarningIcon = createIcon(
  'WarningIcon',
  <>
    <path d="M12 4.2 20.6 19.5H3.4z" />
    <path d="M12 10v4" />
    <circle cx="12" cy="17" fill="currentColor" r="1" stroke="none" />
  </>,
)

export const ErrorIcon = createIcon(
  'ErrorIcon',
  <>
    <circle cx="12" cy="12" r="8.25" />
    <path d="M12 7.8v5" />
    <circle cx="12" cy="16.2" fill="currentColor" r="1" stroke="none" />
  </>,
)

export const HelpIcon = createIcon(
  'HelpIcon',
  <>
    <circle cx="12" cy="12" r="8.25" />
    <path d="M9.7 9.6a2.4 2.4 0 1 1 2.9 2.6v1.6" />
    <circle cx="12.5" cy="16.5" fill="currentColor" r="1" stroke="none" />
  </>,
)

export const SpinnerIcon = createIcon('SpinnerIcon', <path d="M12 3.75A8.25 8.25 0 1 0 20.25 12" />)

/* Objects ------------------------------------------------------------------ */

export const CalendarIcon = createIcon(
  'CalendarIcon',
  <>
    <rect height="16" rx="2" width="18" x="3" y="5" />
    <path d="M3 10h18" />
    <path d="M8 3v4" />
    <path d="M16 3v4" />
  </>,
)

export const ClockIcon = createIcon(
  'ClockIcon',
  <>
    <circle cx="12" cy="12" r="8.25" />
    <path d="M12 7.2V12l3.4 2" />
  </>,
)

export const UserIcon = createIcon(
  'UserIcon',
  <>
    <circle cx="12" cy="8.5" r="3.75" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </>,
)

export const EyeIcon = createIcon(
  'EyeIcon',
  <>
    <path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
    <circle cx="12" cy="12" r="2.75" />
  </>,
)

export const EyeOffIcon = createIcon(
  'EyeOffIcon',
  <>
    <path d="M9.9 6.3A9.6 9.6 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-3 3.6" />
    <path d="M6.3 8.2A17 17 0 0 0 2.5 12S6 18 12 18a9.4 9.4 0 0 0 3.6-.7" />
    <path d="M10 10.1a2.75 2.75 0 0 0 3.8 3.9" />
    <path d="M4 4 20 20" />
  </>,
)

export const BellIcon = createIcon(
  'BellIcon',
  <>
    <path d="M6.5 10a5.5 5.5 0 0 1 11 0c0 4.3 1.5 5.5 1.5 5.5H5s1.5-1.2 1.5-5.5z" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </>,
)

export const StarIcon = createIcon(
  'StarIcon',
  <path d="m12 4.3 2.45 5.15 5.55.75-4.05 3.85 1.05 5.55L12 16.9l-5 2.7 1.05-5.55L4 10.2l5.55-.75z" />,
)
