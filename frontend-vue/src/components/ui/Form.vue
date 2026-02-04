<template>
  <form
    :class="['form', className]"
    :method="method"
    :action="action"
    :novalidate="novalidate"
    @submit.prevent="handleSubmit"
  >
    <fieldset
      v-if="legend || $slots.legend"
      :class="['form-fieldset', { 'form-fieldset-disabled': disabled }]"
      :disabled="disabled"
    >
      <legend v-if="legend || $slots.legend" class="form-legend">
        <slot name="legend">{{ legend }}</slot>
      </legend>
      
      <slot />
    </fieldset>
    
    <div v-else class="form-content" :class="{ 'form-disabled': disabled }">
      <slot />
    </div>
  </form>
</template>

<script setup>
const props = defineProps({
  legend: {
    type: String,
    default: ''
  },
  method: {
    type: String,
    default: 'post'
  },
  action: {
    type: String,
    default: ''
  },
  novalidate: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  className: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['submit'])

const handleSubmit = (event) => {
  if (!props.disabled) {
    emit('submit', event)
  }
}
</script>

<style scoped>
.form {
  width: 100%;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-disabled {
  opacity: 0.6;
  pointer-events: none;
}

.form-fieldset {
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-fieldset-disabled {
  opacity: 0.6;
  pointer-events: none;
}

.form-legend {
  font-size: 1.125rem;
  font-weight: 700;
  color: #121317;
  margin-bottom: 0.5rem;
  padding: 0;
}

.dark .form-legend {
  color: #f3f4f6;
}

/* Form groups */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1rem;
  flex-wrap: wrap;
}

[dir='rtl'] .form-actions {
  justify-content: flex-start;
}

/* Responsive */
@media (max-width: 640px) {
  .form-row {
    flex-direction: column;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions > * {
    width: 100%;
  }
}
</style>

