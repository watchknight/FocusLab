import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const HomeIcon: React.FC<IconProps> = ({ className, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
    <path d="M3 8.5L10 3l7 5.5V17a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8.5z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.5 18V10.5h5V18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ className, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.75" />
    <circle cx="10" cy="10" r="2" fill="currentColor" />
    <path d="M10 1v3M10 16v3M1 10h3M16 10h3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

export const FocusIcon: React.FC<IconProps> = ({ className, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.75" />
    <path d="M10 6v4l2.5 2.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

export const ActivitiesIcon: React.FC<IconProps> = ({ className, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
    <rect x="2.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
    <rect x="11.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
    <rect x="2.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
    <rect x="11.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
  </svg>
);

export const MoreDotsIcon: React.FC<IconProps> = ({ className, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
    <circle cx="4.5" cy="10" r="1.5" fill="currentColor" />
    <circle cx="10" cy="10" r="1.5" fill="currentColor" />
    <circle cx="15.5" cy="10" r="1.5" fill="currentColor" />
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ className, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

export const ExperimentsIcon: React.FC<IconProps> = ({ className, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <path d="M6 2h6M9 2v6.5l-4.5 7h11l-4.5-7V2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const InsightsIcon: React.FC<IconProps> = ({ className, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <path d="M3 15h12M4.5 15V9M9 15V4M13.5 15V7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

export const SoundsIcon: React.FC<IconProps> = ({ className, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <path d="M3 8v2M6.5 5.5v7M10 3v12M13.5 6v6M17 8.5v1" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

export const LearnIcon: React.FC<IconProps> = ({ className, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <path d="M2.5 4a2.5 2.5 0 0 1 2.5-2.5H8v13.5H5A2.5 2.5 0 0 0 2.5 17.5V4zM15.5 4a2.5 2.5 0 0 0-2.5-2.5H10v13.5h3a2.5 2.5 0 0 1 2.5 2.5V4z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const AboutIcon: React.FC<IconProps> = ({ className, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.75" />
    <path d="M9 8v5M9 5h.01" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

export const PrivacyIcon: React.FC<IconProps> = ({ className, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <path d="M9 2.5l6 2.5v5c0 4-3.5 6-6 7-2.5-1-6-3-6-7V5l6-2.5z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const DisclaimerIcon: React.FC<IconProps> = ({ className, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <path d="M9 2v14M3 6h12M4.5 6l-2 5h5l-2-5zM13.5 6l-2 5h5l-2-5z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const SystemIcon: React.FC<IconProps> = ({ className, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.75" />
    <path d="M9 2 A7 7 0 0 1 9 16 Z" fill="currentColor" />
  </svg>
);

export const StudioIcon: React.FC<IconProps> = ({ className, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <circle cx="9" cy="9" r="4" stroke="currentColor" strokeWidth="1.75" />
    <path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.7 3.7l1.4 1.4M12.9 12.9l1.4 1.4M3.7 14.3l1.4-1.4M12.9 5.1l1.4-1.4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

export const DarkroomIcon: React.FC<IconProps> = ({ className, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <path d="M15 10.5A6.5 6.5 0 0 1 7.5 3a7 7 0 1 0 7.5 7.5z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ContrastIcon: React.FC<IconProps> = ({ className, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <rect x="2.5" y="2.5" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.75" />
    <path d="M2.5 15.5L15.5 2.5" stroke="currentColor" strokeWidth="1.75" />
  </svg>
);

export const CheckmarkIcon: React.FC<IconProps> = ({ className, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true" className={className}>
    <path d="M2.5 7.5l3.5 3.5 6-7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
