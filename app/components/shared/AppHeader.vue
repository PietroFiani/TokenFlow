<script setup lang="ts">
// Header component with navigation
</script>

<template>
  <header :class="$style.header">
    <div :class="$style.navContainer">
      <div :class="$style.brand">
        <span :class="$style.brandIcon">🎨</span>
        <h1 :class="$style.brandName">Color Palette Generator</h1>
      </div>

      <nav :class="$style.nav">
        <NuxtLink
          to="/"
          :class="$style.navItem"
          active-class="navItemActive"
        >
          Palette Creator
        </NuxtLink>
        <NuxtLink
          to="/token-forge"
          :class="$style.navItem"
          active-class="navItemActive"
        >
          Token Forge
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<style module>
/* Sticky header bar */
.header {
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  z-index: 1000;
}

/* Container with left-right layout */
.navContainer {
  margin: 0 auto;
  padding: 0 2rem;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Brand section (left) */
.brand {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.brandIcon {
  font-size: 1.5rem;
  line-height: 1;
}

.brandName {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  white-space: nowrap;
}

/* Navigation section (right) */
.nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.navItem {
  display: block;
  padding: 0.75rem 1.25rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #6b7280;
  text-decoration: none;
  background: transparent;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.navItem:hover {
  color: #3b82f6;
  background-color: #eff6ff;
}

.navItemActive {
  color: white;
  background-color: #3b82f6;
  box-shadow: 0 1px 2px rgba(59, 130, 246, 0.3);
}

@media (max-width: 768px) {
  .navContainer {
    padding: 0 1rem;
    height: 56px;
  }

  .brandName {
    font-size: 1.125rem;
  }

  .brandIcon {
    font-size: 1.25rem;
  }

  .nav {
    gap: 0.25rem;
  }

  .navItem {
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .navContainer {
    padding: 0 0.75rem;
  }

  .brandName {
    font-size: 1rem;
  }

  .navItem {
    padding: 0.5rem 0.75rem;
    font-size: 0.8125rem;
  }
}
</style>
