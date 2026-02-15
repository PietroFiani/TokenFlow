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
  gap: var(--spacing-3);
  cursor: pointer;
  user-select: none;
}

.toggle.disabled {
  opacity: var(--opacity-40);
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
  background-color: var(--color-background-neutral-muted-pressed);
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
  background-color: var(--color-white);
  border-radius: 50%;
  transition: transform 0.2s;
}

.checkbox:checked + .slider {
  background-color: var(--color-background-brand-primary-inverse-default);
}

.checkbox:checked + .slider::before {
  transform: translateX(20px);
}

.checkbox:focus + .slider {
  box-shadow: var(--shadow-10);
}

.label {
  font-size: var(--font-size-md);
  color: var(--color-text-neutral-muted-default);
  font-weight: var(--font-weight-medium);
}
</style>
