import React, { forwardRef, useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { formatNumber, parseAmount } from '@/lib/currency'

interface CurrencyInputProps extends Omit<React.ComponentProps<"input">, 'onChange' | 'value'> {
  value?: number
  currency?: string
  onChange?: (value: number) => void
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value = undefined, currency = 'INR', onChange, onBlur, onFocus, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [displayValue, setDisplayValue] = useState('')
    const inputRef = useRef<HTMLInputElement | null>(null)

    React.useEffect(() => {
      if (!isFocused) {
        setDisplayValue(
          value !== undefined && value !== null && !isNaN(value) && value !== 0
            ? formatNumber(value)
            : ''
        )
      }
    }, [value, isFocused])

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      setDisplayValue(value !== undefined && value !== null && !isNaN(value) && value !== 0 ? value.toString() : '')
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      const numericValue = parseAmount(displayValue)
      setDisplayValue(numericValue ? formatNumber(numericValue) : '')
      onChange?.(numericValue)
      onBlur?.(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value
      // Remove all non-numeric except dot
      let cleaned = inputValue.replace(/[^0-9.]/g, '')
      // Prevent multiple dots
      cleaned = cleaned.replace(/(\..*)\./g, '$1')
      // Format with commas if not empty
      if (cleaned) {
        // Only format if not typing decimal
        if (!/\.$/.test(cleaned)) {
          const [intPart, decPart] = cleaned.split('.')
          cleaned =
            decPart !== undefined
              ? `${parseInt(intPart, 10).toLocaleString('en-IN')}.${decPart}`
              : parseInt(intPart, 10).toLocaleString('en-IN')
        }
      }
      setDisplayValue(cleaned)
      // Parse and call onChange
      const numericValue = parseAmount(cleaned)
      onChange?.(numericValue)
    }

    return (
      <Input
        {...props}
        ref={(node) => {
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node
          inputRef.current = node
        }}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        inputMode="decimal"
        placeholder={isFocused ? "0.00" : formatNumber(0)}
        autoComplete="off"
      />
    )
  }
)

CurrencyInput.displayName = "CurrencyInput"

export { CurrencyInput }