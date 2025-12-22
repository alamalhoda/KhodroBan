<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'date';
  export type { InputType };

  interface Props {
    type?: InputType;
    name?: string;
    value?: string | number | undefined;
    placeholder?: string;
    label?: string;
    error?: string;
    hint?: string;
    disabled?: boolean;
    required?: boolean;
    icon?: string;
    min?: number;
    max?: number;
    step?: number;
    class?: string;
    oninput?: (e: Event) => void;
    onchange?: (e: Event) => void;
  }

  let {
    type = 'text',
    name = '',
    value: valueProp = $bindable(),
    placeholder = '',
    label = '',
    error = '',
    hint = '',
    disabled = false,
    required = false,
    icon = '',
    min,
    max,
    step,
    class: className = '',
    oninput,
    onchange,
  }: Props = $props();

  // Normalize undefined/null to empty string for the input element
  // Use $state that syncs with valueProp for two-way binding
  let value = $state(valueProp ?? '');

  // Sync valueProp changes to local value
  $effect(() => {
    value = valueProp ?? '';
  });

  const dispatch = createEventDispatcher();
  let inputEl: HTMLInputElement;

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    if (type === 'number') {
      const numValue = target.value === '' ? undefined : Number(target.value);
      value = target.value;
      valueProp = numValue;
    } else {
      const strValue = target.value === '' ? undefined : target.value;
      value = target.value;
      valueProp = strValue;
    }
    oninput?.(e);
    dispatch('input', { value: valueProp });
  }

  function handleChange(e: Event) {
    onchange?.(e);
    dispatch('change', { value: valueProp });
  }
</script>

<div class="input-group {className}" class:has-error={error} class:has-icon={icon}>
  {#if label}
    <label for={name} class="input-label">
      {label}
      {#if required}
        <span class="required-mark">*</span>
      {/if}
    </label>
  {/if}
  
  <div class="input-wrapper">
    {#if icon}
      <span class="input-icon">{icon}</span>
    {/if}
    
    <input
      bind:this={inputEl}
      {type}
      {name}
      id={name}
      {value}
      {placeholder}
      {disabled}
      {required}
      {min}
      {max}
      {step}
      class="input"
      oninput={handleInput}
      onchange={handleChange}
    />
  </div>
  
  {#if error}
    <span class="input-error">{error}</span>
  {:else if hint}
    <span class="input-hint">{hint}</span>
  {/if}
</div>

<style>
  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }

  .input-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text);
  }

  .required-mark {
    color: var(--color-danger);
    margin-right: 0.25rem;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input-icon {
    position: absolute;
    right: 1rem;
    font-size: 1.2rem;
    color: var(--color-text-muted);
    pointer-events: none;
  }

  .input {
    width: 100%;
    padding: 0.875rem 1rem;
    font-family: inherit;
    font-size: 1rem;
    color: var(--color-text);
    background: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 12px;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;
    min-height: 48px;
  }

  .has-icon .input {
    padding-right: 3rem;
  }

  .input::placeholder {
    color: var(--color-text-muted);
  }

  .input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.15);
    background: rgba(255, 255, 255, 0.8);
  }

  .input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: rgba(255, 255, 255, 0.3);
  }

  .has-error .input {
    border-color: var(--color-danger);
  }

  .has-error .input:focus {
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
  }

  .input-error {
    font-size: 0.8125rem;
    color: var(--color-danger);
  }

  .input-hint {
    font-size: 0.8125rem;
    color: var(--color-text-muted);
  }

  /* Number input - hide spinners */
  .input[type="number"]::-webkit-outer-spin-button,
  .input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .input[type="number"] {
    -moz-appearance: textfield;
  }

  /* Fallback for older browsers */
  @supports not (backdrop-filter: blur(10px)) {
    .input {
      background: rgba(255, 255, 255, 0.95);
    }
  }
</style>
