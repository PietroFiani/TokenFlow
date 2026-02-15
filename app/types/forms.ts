/**
 * Form component types
 */

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface FieldWrapperProps {
  label?: string
  hint?: string
  error?: boolean
  errorMessage?: string
  required?: boolean
  showOptional?: boolean
}

export interface BaseFieldProps extends FieldWrapperProps {
  modelValue: any
  placeholder?: string
  disabled?: boolean
}
