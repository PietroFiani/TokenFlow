<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  error?: boolean
  errorMessage?: string
  type?: 'text' | 'number'
}>(), {
  placeholder: '',
  error: false,
  errorMessage: '',
  type: 'text',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'blur': []
}>()
</script>

<template>
  <div :class="$style.wrapper">
    <input
      :type="type"
      :class="[$style.input, { [$style.error]: error }]"
      :value="modelValue"
      :placeholder="placeholder"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="emit('blur')"
    />
    <span v-if="error && errorMessage" :class="$style.errorMessage">
      {{ errorMessage }}
    </span>
  </div>
</template>

<style module>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.input {
  padding: 0.75rem 1rem;
  font-size: 0.9375rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  color: #111827;
  transition: all 0.15s ease;
  width: 100%;
}

.input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input::placeholder {
  color: #9ca3af;
}

.input.error {
  border-color: #ef4444;
}

.input.error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.errorMessage {
  font-size: 0.875rem;
  color: #ef4444;
}
</style>
