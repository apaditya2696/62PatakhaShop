import React from 'react'

export function IconTrophy({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <defs>
        <linearGradient id="trophyGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF275" />
          <stop offset="50%" stopColor="#FFB800" />
          <stop offset="100%" stopColor="#FF7A00" />
        </linearGradient>
      </defs>
      <path
        d="M6 3H18V8C18 11.3137 15.3137 14 12 14C8.68629 14 6 11.3137 6 8V3Z"
        fill="url(#trophyGold)"
      />
      <path
        d="M6 5H3C2.44772 5 2 5.44772 2 6C2 8.5 3.8 10.6 6 10.9V5Z"
        fill="url(#trophyGold)"
        opacity="0.85"
      />
      <path
        d="M18 5H21C21.5523 5 22 5.44772 22 6C22 8.5 20.2 10.6 18 10.9V5Z"
        fill="url(#trophyGold)"
        opacity="0.85"
      />
      <path d="M10 14V17H14V14" stroke="url(#trophyGold)" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M7 21C7 19.3431 8.34315 18 10 18H14C15.6569 18 17 19.3431 17 21H7Z"
        fill="url(#trophyGold)"
      />
      <circle cx="12" cy="7.5" r="1.5" fill="#ffffff" opacity="0.8" />
    </svg>
  )
}

export function IconBox({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <defs>
        <linearGradient id="boxPink" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF50B8" />
          <stop offset="100%" stopColor="#FF0090" />
        </linearGradient>
      </defs>
      <path
        d="M12 2L21 7V17L12 22L3 17V7L12 2Z"
        stroke="url(#boxPink)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M12 22V12"
        stroke="url(#boxPink)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M21 7L12 12L3 7"
        stroke="url(#boxPink)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M16.5 4.5L7.5 9.5"
        stroke="#FFB800"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx="12" cy="12" r="2.5" fill="#FFB800" />
    </svg>
  )
}

export function IconFlame({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <defs>
        <linearGradient id="flameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF007A" />
          <stop offset="50%" stopColor="#FF5E00" />
          <stop offset="100%" stopColor="#FFD600" />
        </linearGradient>
      </defs>
      <path
        d="M12 2C12 2 7 7.5 7 13C7 15.7614 9.23858 18 12 18C14.7614 18 17 15.7614 17 13C17 7.5 12 2 12 2Z"
        fill="url(#flameGrad)"
      />
      <path
        d="M12 8C12 8 9.5 11 9.5 13.5C9.5 14.8807 10.6193 16 12 16C13.3807 16 14.5 14.8807 14.5 13.5C14.5 11 12 8 12 8Z"
        fill="#FFFFFF"
        opacity="0.8"
      />
      <circle cx="12" cy="13.5" r="1.5" fill="#FF007A" />
    </svg>
  )
}

export function IconPin({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2C8.13401 2 5 5.13401 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13401 15.866 2 12 2Z"
        fill="#FF0090"
        opacity="0.25"
      />
      <path
        d="M12 2C8.13401 2 5 5.13401 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13401 15.866 2 12 2Z"
        stroke="#FF0090"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9" r="3" fill="#FFD800" />
    </svg>
  )
}

export function IconPhone({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M22 16.92V19.92C22 20.48 21.54 20.93 20.97 20.92C18.23 20.65 15.6 19.68 13.29 18.15C11.16 16.74 9.38 14.96 7.97 12.83C6.44 10.51 5.46 7.86 5.2 5.11C5.19 4.54 5.64 4.08 6.2 4.08H9.2C9.69 4.08 10.11 4.44 10.18 4.93C10.31 5.86 10.57 6.77 10.96 7.62C11.11 7.95 11.02 8.34 10.74 8.58L9.2 9.94C10.45 12.39 12.44 14.38 14.89 15.63L16.25 14.09C16.49 13.81 16.88 13.72 17.21 13.87C18.06 14.26 18.97 14.52 19.9 14.65C20.4 14.72 20.76 15.15 20.76 15.65L22 16.92Z"
        fill="#FF0090"
        opacity="0.25"
      />
      <path
        d="M22 16.92V19.92C22 20.48 21.54 20.93 20.97 20.92C18.23 20.65 15.6 19.68 13.29 18.15C11.16 16.74 9.38 14.96 7.97 12.83C6.44 10.51 5.46 7.86 5.2 5.11C5.19 4.54 5.64 4.08 6.2 4.08H9.2C9.69 4.08 10.11 4.44 10.18 4.93C10.31 5.86 10.57 6.77 10.96 7.62C11.11 7.95 11.02 8.34 10.74 8.58L9.2 9.94C10.45 12.39 12.44 14.38 14.89 15.63L16.25 14.09C16.49 13.81 16.88 13.72 17.21 13.87C18.06 14.26 18.97 14.52 19.9 14.65C20.4 14.72 20.76 15.15 20.76 15.65L22 16.92Z"
        stroke="#FF0090"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconMail({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="#FF0090" strokeWidth="2" />
      <path d="M3 7L12 13L21 7" stroke="#FF0090" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="1.5" fill="#FFD800" />
    </svg>
  )
}

export function IconClock({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke="#FF0090" strokeWidth="2" />
      <path d="M12 7V12L15 15" stroke="#FFD800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── Ticker Tape Custom Fireworks Icons ── */

export function IconRocket({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2.5C12 2.5 17 6.5 17 12C17 14 16 16 15 17L12 15L9 17C8 16 7 14 7 12C7 6.5 12 2.5 12 2.5Z"
        fill="#FF0090"
      />
      <path d="M9 17L6 21H10L12 18L14 18L16 21H20L17 17" fill="#FFD800" />
      <circle cx="12" cy="9" r="1.5" fill="#ffffff" />
    </svg>
  )
}

export function IconSkyShot({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" fill="#FF0090" />
      <path d="M12 2V6M12 18V22M2 12H6M18 12H22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" stroke="#FFD800" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function IconFlowerPot({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M7 14L5 21H19L17 14H7Z" fill="#FF0090" />
      <path d="M12 14V3M12 3L9 7M12 3L15 7M12 8L6 5M12 8L18 5" stroke="#FFD800" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function IconSparkler({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <line x1="4" y1="20" x2="14" y2="10" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="8" r="2.5" fill="#FF0090" />
      <path d="M16 2V4M16 12V14M10 8H12M20 8H22M11.8 3.8L13.2 5.2M18.8 10.8L20.2 12.2M11.8 12.2L13.2 10.8M18.8 5.2L20.2 3.8" stroke="#FFD800" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function IconChakri({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke="#FF0090" strokeWidth="2" strokeDasharray="3 3" />
      <circle cx="12" cy="12" r="3.5" fill="#FFD800" />
      <path d="M12 4C14 7 14 9 12 12C10 15 10 17 12 20" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function IconBomb({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="14" r="7" fill="#FF0090" />
      <path d="M16 9L19 6M19 6L21 7M19 6L18 4" stroke="#FFD800" strokeWidth="2" strokeLinecap="round" />
      <circle cx="21" cy="4" r="1.5" fill="#FFFFFF" />
      <circle cx="9.5" cy="12.5" r="2" fill="#FFFFFF" opacity="0.4" />
    </svg>
  )
}

export function IconAerialCake({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="4" y="11" width="16" height="10" rx="2" fill="#FF0090" />
      <line x1="8" y1="11" x2="8" y2="6" stroke="#FFD800" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="12" y1="11" x2="12" y2="4" stroke="#00E5FF" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="16" y1="11" x2="16" y2="6" stroke="#FFD800" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="8" cy="5" r="1.2" fill="#FFFFFF" />
      <circle cx="12" cy="3" r="1.2" fill="#FFFFFF" />
      <circle cx="16" cy="5" r="1.2" fill="#FFFFFF" />
    </svg>
  )
}

export function IconLadi({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <line x1="12" y1="2" x2="12" y2="22" stroke="#FFD800" strokeWidth="1.5" />
      <rect x="6" y="4" width="5" height="2.5" rx="1" fill="#FF0090" />
      <rect x="13" y="6.5" width="5" height="2.5" rx="1" fill="#FF0090" />
      <rect x="6" y="9" width="5" height="2.5" rx="1" fill="#FF0090" />
      <rect x="13" y="11.5" width="5" height="2.5" rx="1" fill="#FF0090" />
      <rect x="6" y="14" width="5" height="2.5" rx="1" fill="#FF0090" />
      <rect x="13" y="16.5" width="5" height="2.5" rx="1" fill="#FF0090" />
    </svg>
  )
}

export function IconStarBurst({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L14.2 8.5L21 9.3L15.8 13.8L17.4 20.5L12 17L6.6 20.5L8.2 13.8L3 9.3L9.8 8.5L12 2Z"
        fill="#FFD800"
      />
      <circle cx="12" cy="12" r="2.5" fill="#FF0090" />
    </svg>
  )
}
