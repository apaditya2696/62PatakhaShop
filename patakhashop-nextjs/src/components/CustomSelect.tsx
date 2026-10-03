import React, { useState, useRef, useEffect, useId } from 'react'
import styles from './CustomSelect.module.css'

export interface SelectOption {
  value: string
  label: string
  icon?: React.ReactNode
  count?: number | string
  badge?: string
}

interface CustomSelectProps {
  value: string
  onChange: (value: string) => void
  options: (SelectOption | string)[]
  placeholder?: string
  className?: string
  variant?: 'default' | 'admin' | 'shop'
  ariaLabel?: string
  prefixIcon?: React.ReactNode
  disabled?: boolean
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Select option...',
  className = '',
  variant = 'default',
  ariaLabel,
  prefixIcon,
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [alignment, setAlignment] = useState<'left' | 'right'>('left')
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const listboxId = useId()

  // Dynamic menu alignment calculation (left vs right screen edge)
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const screenWidth = window.innerWidth
      const containerCenterX = rect.left + rect.width / 2
      if (containerCenterX > screenWidth / 2) {
        setAlignment('right')
      } else {
        setAlignment('left')
      }
    }
  }, [isOpen])

  // Normalize options to SelectOption objects
  const normalizedOptions: SelectOption[] = options.map(opt => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt }
    }
    return opt
  })

  const selectedOption = normalizedOptions.find(opt => opt.value === value)
  const selectedLabel = selectedOption ? selectedOption.label : placeholder

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside, { passive: true })
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isOpen])

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement
      if (item) {
        item.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [highlightedIndex, isOpen])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!isOpen) {
        setIsOpen(true)
        setHighlightedIndex(0)
      } else {
        setHighlightedIndex(prev => (prev + 1) % normalizedOptions.length)
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!isOpen) {
        setIsOpen(true)
        setHighlightedIndex(normalizedOptions.length - 1)
      } else {
        setHighlightedIndex(prev => (prev - 1 + normalizedOptions.length) % normalizedOptions.length)
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (isOpen && highlightedIndex >= 0 && highlightedIndex < normalizedOptions.length) {
        onChange(normalizedOptions[highlightedIndex].value)
        setIsOpen(false)
      } else {
        setIsOpen(!isOpen)
      }
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      if (isOpen) {
        setIsOpen(false)
      }
    }
  }

  const handleSelect = (val: string) => {
    onChange(val)
    setIsOpen(false)
  }

  const variantClass =
    variant === 'admin' ? styles.admin : variant === 'shop' ? styles.shop : styles.default

  return (
    <div
      ref={containerRef}
      className={`${styles.selectContainer} ${variantClass} ${isOpen ? styles.open : ''} ${
        disabled ? styles.disabled : ''
      } ${className}`}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        className={styles.triggerButton}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-label={ariaLabel || selectedLabel}
        disabled={disabled}
      >
        <span className={styles.triggerContent}>
          {prefixIcon && <span className={styles.prefixIcon}>{prefixIcon}</span>}
          {selectedOption?.icon && (
            <span className={styles.optionIcon}>{selectedOption.icon}</span>
          )}
          <span className={styles.selectedText}>{selectedLabel}</span>
          {selectedOption?.count !== undefined && (
            <span className={styles.countBadge}>({selectedOption.count})</span>
          )}
        </span>

        <span className={styles.chevron} aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <ul
          id={listboxId}
          ref={listRef}
          className={`${styles.optionsList} ${alignment === 'right' ? styles.alignRight : styles.alignLeft}`}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={
            highlightedIndex >= 0 ? `${listboxId}-opt-${highlightedIndex}` : undefined
          }
        >
          {normalizedOptions.map((opt, index) => {
            const isSelected = opt.value === value
            const isHighlighted = index === highlightedIndex

            return (
              <li
                key={`${opt.value}-${index}`}
                id={`${listboxId}-opt-${index}`}
                role="option"
                aria-selected={isSelected}
                className={`${styles.optionItem} ${isSelected ? styles.selected : ''} ${
                  isHighlighted ? styles.highlighted : ''
                }`}
                onClick={() => handleSelect(opt.value)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <div className={styles.optionLabelRow}>
                  {opt.icon && <span className={styles.optionIcon}>{opt.icon}</span>}
                  <span className={styles.optionLabel}>{opt.label}</span>
                </div>

                <div className={styles.optionRight}>
                  {opt.badge && <span className={styles.itemBadge}>{opt.badge}</span>}
                  {opt.count !== undefined && (
                    <span className={styles.optionCount}>{opt.count}</span>
                  )}
                  {isSelected && (
                    <span className={styles.checkIcon} aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
