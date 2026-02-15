<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: boolean
  label: string
  disabled?: boolean
}>(), {
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <label :class="[$style.toggle, { [$style.disabled]: disabled }]">
    <input
      type="checkbox"
      :class="$style.checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <span :class="$style.slider"></span>
    <span :class="$style.label">{{ label }}</span>
  </label>
</template>

<style module>
.toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
}

.toggle.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.checkbox {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: relative;
  width: 44px;
  height: 24px;
  background-color: #d1d5db;
  border-radius: 24px;
  transition: background-color 0.2s;
}

.slider::before {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  left: 3px;
  top: 3px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.2s;
}

.checkbox:checked + .slider {
  background-color: #3b82f6;
}

.checkbox:checked + .slider::before {
  transform: translateX(20px);
}

.checkbox:focus + .slider {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.label {
  font-size: 0.9375rem;
  color: #374151;
  font-weight: 500;
}
</style>
