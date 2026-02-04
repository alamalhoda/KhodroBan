<template>
  <article
    :class="[
      'card',
      `card-${variant}`,
      `card-padding-${padding}`,
      {
        'card-hoverable': hoverable,
        'card-clickable': clickable
      },
      className
    ]"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
    :aria-label="clickable ? ariaLabel : undefined"
    @click="handleClick"
    @keydown.enter="handleKeydown"
    @keydown.space="handleKeydown"
  >
    <header v-if="title || subtitle || $slots.header" class="card-header">
      <slot name="header">
        <h3 v-if="title" class="card-title">{{ title }}</h3>
        <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
      </slot>
    </header>
    
    <div class="card-body">
      <slot />
    </div>
    
    <footer v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </footer>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  padding: {
    type: String,
    default: 'md',
    validator: (value) => ['none', 'sm', 'md', 'lg'].includes(value)
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'solid', 'outline', 'glass'].includes(value)
  },
  hoverable: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: false
  },
  ariaLabel: {
    type: String,
    default: ''
  },
  className: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
  if (props.clickable) {
    emit('click', event)
  }
}

const handleKeydown = (event) => {
  if (props.clickable && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault()
    emit('click', event)
  }
}
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  border-radius: 1rem;
  transition: all 0.3s ease;
  overflow: hidden;
}

/* Variants */
.card-default {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(229, 231, 235, 0.5);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.dark .card-default {
  background: rgba(30, 41, 59, 0.6);
  border-color: rgba(55, 65, 81, 0.5);
}

.card-solid {
  background: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.dark .card-solid {
  background: #1e293b;
  border-color: #374151;
}

.card-outline {
  background: transparent;
  border: 2px solid #e5e7eb;
}

.dark .card-outline {
  border-color: #374151;
}

.card-glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dark .card-glass {
  background: rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.1);
}

/* Padding */
.card-padding-none {
  padding: 0;
}

.card-padding-sm {
  padding: 1rem;
}

.card-padding-md {
  padding: 1.5rem;
}

.card-padding-lg {
  padding: 2rem;
}

/* Header */
.card-header {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
}

.dark .card-header {
  border-bottom-color: rgba(55, 65, 81, 0.5);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #121317;
  margin: 0 0 0.25rem 0;
}

.dark .card-title {
  color: #f3f4f6;
}

.card-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.dark .card-subtitle {
  color: #9ca3af;
}

/* Body */
.card-body {
  flex: 1;
}

/* Footer */
.card-footer {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(229, 231, 235, 0.5);
}

.dark .card-footer {
  border-top-color: rgba(55, 65, 81, 0.5);
}

/* Hoverable */
.card-hoverable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.dark .card-hoverable:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* Clickable */
.card-clickable {
  cursor: pointer;
}

.card-clickable:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.card-clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.dark .card-clickable:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.card-clickable:active {
  transform: translateY(0);
}
</style>

