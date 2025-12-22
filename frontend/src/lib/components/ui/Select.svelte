<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { SelectOption } from '../../types';

  interface Props {
    name?: string;
    value?: string;
    options: SelectOption[];
    placeholder?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    class?: string;
    onchange?: (value: string) => void;
  }

  let {
    name = '',
    value = $bindable(''),
    options = [],
    placeholder = 'انتخاب کنید...',
    label = '',
    error = '',
    disabled = false,
    required = false,
    class: className = '',
    onchange,
  }: Props = $props();

  const dispatch = createEventDispatcher();

  function handleChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    value = target.value;
    onchange?.(value);
    dispatch('change', { value });
  }
</script>

<div class="select-group {className}" class:has-error={error}>
  {#if label}
    <label for={name} class="select-label">
      {label}
      {#if required}
        <span class="required-mark">*</span>
      {/if}
    </label>
  {/if}
  
  <div class="select-wrapper">
    <select
      {name}
      id={name}
      {value}
      {disabled}
      {required}
      class="select"
      onchange={handleChange}
    >
      {#if placeholder}
        <option value="" disabled selected={!value}>{placeholder}</option>
      {/if}
      {#each options as option}
        <option value={option.value} selected={option.value === value}>
          {option.label}
        </option>
      {/each}
    </select>
    <span class="select-arrow">▼</span>
  </div>
  
  {#if error}
    <span class="select-error">{error}</span>
  {/if}
</div>

<style>
  .select-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }

  .select-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text);
  }

  .required-mark {
    color: var(--color-danger);
    margin-right: 0.25rem;
  }

  .select-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .select {
    width: 100%;
    padding: 0.875rem 2.5rem 0.875rem 1rem;
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
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  .select-arrow {
    position: absolute;
    left: 1rem;
    font-size: 0.75rem;
    color: var(--color-text-muted);
    pointer-events: none;
    transition: transform 0.2s ease;
  }

  .select:focus + .select-arrow {
    transform: rotate(180deg);
  }

  .select:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.15);
    background: rgba(255, 255, 255, 0.8);
  }

  .select:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: rgba(255, 255, 255, 0.3);
  }

  .has-error .select {
    border-color: var(--color-danger);
  }

  .select-error {
    font-size: 0.8125rem;
    color: var(--color-danger);
  }

  /* Fallback for older browsers */
  @supports not (backdrop-filter: blur(10px)) {
    .select {
      background: rgba(255, 255, 255, 0.95);
    }
  }
</style>
