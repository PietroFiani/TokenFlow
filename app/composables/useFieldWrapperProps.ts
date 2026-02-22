import { computed } from 'vue'
import type { FieldWrapperProps } from '~/app/components/ds/field/types'

export function useFieldWrapperProps(props: FieldWrapperProps) {
  return computed(() => ({
    label: props.label,
    hint: props.hint,
    error: props.error,
    errorMessage: props.errorMessage,
    required: props.required,
    showOptional: props.showOptional,
  }))
}
