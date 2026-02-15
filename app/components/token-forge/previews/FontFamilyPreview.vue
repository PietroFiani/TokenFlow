<script setup lang="ts">
import type { FontFamilyToken } from '~/app/types/designTokens'

interface Props {
  fontFamilyTokens: Record<string, FontFamilyToken>
}

const props = defineProps<Props>()

// Convert font family array to CSS font-family string
function getFontFamilyString(token: FontFamilyToken): string {
  return token.$value.map(font => font.includes(' ') ? `"${font}"` : font).join(', ')
}
</script>

<template>
  <div :class="$style.container">
    <div
      v-for="(token, name) in fontFamilyTokens"
      :key="name"
      :class="$style.fontSection"
    >
      <!-- Font Info -->
      <div :class="$style.fontInfo">
          <h5 :class="$style.fontRole">{{ name }}</h5>
          <p :class="$style.fontStack">{{ token.$value.join(', ') }}</p>
          <p :class="$style.description">{{ token.$description }}</p>
      </div>

      <!-- Font Previews -->
      <div :class="$style.previews">
          <!-- Alphabet Preview -->
          <div
            :class="$style.alphabetPreview"
            :style="{ fontFamily: getFontFamilyString(token) }"
          >
            Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz
          </div>

          <!-- Sample Text in Multiple Sizes -->
          <div :class="$style.sampleText">
            <div
              :class="$style.small"
              :style="{ fontFamily: getFontFamilyString(token) }"
            >
              The quick brown fox jumps over the lazy dog
            </div>
            <div
              :class="$style.medium"
              :style="{ fontFamily: getFontFamilyString(token) }"
            >
              The quick brown fox jumps over the lazy dog
            </div>
            <div
              :class="$style.large"
              :style="{ fontFamily: getFontFamilyString(token) }"
            >
              The quick brown fox jumps over the lazy dog
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<style module>
.container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.fontSection {
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.fontInfo {
  margin-bottom: 1.5rem;
}

.fontRole {
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  text-transform: capitalize;
  margin: 0 0 0.5rem 0;
}

.fontStack {
  font-size: 0.875rem;
  color: #6b7280;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  margin: 0 0 0.25rem 0;
}

.description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.previews {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alphabetPreview {
  padding: 1rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  font-size: 1rem;
  color: #374151;
  line-height: 1.6;
}

.sampleText {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.small,
.medium,
.large {
  padding: 0.75rem 1rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  color: #374151;
}

.small {
  font-size: 0.875rem;
}

.medium {
  font-size: 1rem;
}

.large {
  font-size: 1.25rem;
}
</style>
