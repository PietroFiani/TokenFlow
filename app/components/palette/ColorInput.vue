<script setup lang="ts">
import { ref, computed } from 'vue'
import { parseColorInput } from '~/app/utils/colorConversions'

const emit = defineEmits<{
  addColor: [color: string]
}>()

const inputValue = ref<string>('')
const errorMessage = ref<string>('')

const isValid = computed(() => {
  if (!inputValue.value.trim()) return false

  try {
    parseColorInput(inputValue.value)
    return true
  } catch {
    return false
  }
})

function validateInput() {
  if (!inputValue.value.trim()) {
    errorMessage.value = 'Please enter a color'
    return
  }

  try {
    parseColorInput(inputValue.value)
    errorMessage.value = ''
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Invalid color format'
  }
}

function handleAddColor() {
  validateInput()

  if (isValid.value) {
    emit('addColor', inputValue.value)
    inputValue.value = '' // Clear input after adding
    errorMessage.value = ''
  }
}

function handleKeyPress(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    handleAddColor()
  }
}
</script>

<template>
  <div :class="$style.container">
    <div :class="$style.inputWrapper">
      <DsInput
        v-model="inputValue"
        placeholder="Enter color (HEX, RGB, HSL, or OKLCH)"
        :error="!!errorMessage"
        :error-message="errorMessage"
        @blur="validateInput"
        @keypress="handleKeyPress"
      />
      <DsButton
        :disabled="!isValid"
        @click="handleAddColor"
      >
        Add Color
      </DsButton>
    </div>
  </div>
</template>

<style module>
.container {
  width: 100%;
  max-width: none;
  margin: 0;
}

.inputWrapper {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}
</style>
