import React, { forwardRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { formatCurrency, parseAmount } from '@/lib/currency'

interface CurrencyInputProps extends Omit<React.ComponentProps<"input">, 'onChange' | 'value'> {
  value?: number
  currency?: string
  onChange?: (value: number) => void
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value = 0, currency = 'USD', onChange, onBlur, onFocus, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [displayValue, setDisplayValue] = useState('')

    React.useEffect(() => {
      if (!isFocused) {
        setDisplayValue(value ? formatCurrency(value, currency) : '')
      }
    }, [value, currency, isFocused])

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      setDisplayValue(value ? value.toString() : '')
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      const numericValue = parseAmount(displayValue)
      onChange?.(numericValue)
      onBlur?.(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      
      if (isFocused) {
        // Allow numbers, decimal point, and basic editing while focused
        const cleaned = inputValue.replace(/[^0-9.]/g, '')
        setDisplayValue(cleaned)
      }
    }

    return (
      <Input
        {...props}
        ref={ref}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        inputMode="decimal"
        placeholder={isFocused ? "0.00" : formatCurrency(0, currency)}
      />
    )
  }
)

CurrencyInput.displayName = "CurrencyInput"

export { CurrencyInput }