<script setup lang="ts">
// Default layout with header and footer
</script>

<template>
  <div :class="$style.app">
    <AppHeader />

    <main :class="$style.main">
      <slot />
    </main>

    <footer :class="$style.footer">
      <p>
        Built with Nuxt 3 + TypeScript • Using OKLCH color space for perceptual uniformity
      </p>
    </footer>
  </div>
</template>

<style module>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  overflow-x: hidden;
}

.main {
  width: 100%;
  margin: 0 auto;
}

.footer {
  text-align: center;
  margin-top: 4rem;
  padding-top: 2rem;
  color: #9ca3af;
  font-size: 0.875rem;
}

.footer p {
  margin: 0;
}
</style>
