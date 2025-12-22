<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  type ButtonSize = 'sm' | 'md' | 'lg';

  interface Props {
    variant?: ButtonVariant;
    size?: ButtonSize;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    icon?: string;
    class?: string;
    onclick?: () => void;
  }

  let {
    variant = 'primary',
    size = 'md',
    type = 'button',
    disabled = false,
    loading = false,
    fullWidth = false,
    icon = '',
    class: className = '',
    onclick,
  }: Props = $props();

  const dispatch = createEventDispatcher();

  function handleClick() {
    if (!disabled && !loading) {
      onclick?.();
      dispatch('click');
    }
  }
</script>

<button
  {type}
  class="btn btn-{variant} btn-{size} {className}"
  class:btn-full={fullWidth}
  class:btn-loading={loading}
  disabled={disabled || loading}
  onclick={handleClick}
>
  {#if loading}
    <span class="spinner"></span>
  {:else if icon}
    <span class="btn-icon">{icon}</span>
  {/if}
  <slot />
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-family: inherit;
    font-weight: 500;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    
    /* Glassmorphism base */
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .btn:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Sizes */
  .btn-sm {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    min-height: 36px;
  }

  .btn-md {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    min-height: 44px;
  }

  .btn-lg {
    padding: 1rem 2rem;
    font-size: 1.125rem;
    min-height: 52px;
  }

  /* Variants */
  .btn-primary {
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(30, 58, 138, 0.3);
  }

  .btn-primary:hover:not(:disabled) {
    box-shadow: 0 6px 20px rgba(30, 58, 138, 0.4);
    transform: translateY(-1px);
  }

  .btn-primary:active:not(:disabled) {
    transform: translateY(0);
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.25);
    color: var(--color-text);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  .btn-secondary:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.35);
  }

  .btn-success {
    background: linear-gradient(135deg, var(--color-success) 0%, var(--color-success-light) 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
  }

  .btn-success:hover:not(:disabled) {
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
    transform: translateY(-1px);
  }

  .btn-danger {
    background: linear-gradient(135deg, var(--color-danger) 0%, var(--color-danger-light) 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
  }

  .btn-danger:hover:not(:disabled) {
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
    transform: translateY(-1px);
  }

  .btn-ghost {
    background: transparent;
    color: var(--color-primary);
    box-shadow: none;
  }

  .btn-ghost:hover:not(:disabled) {
    background: rgba(30, 58, 138, 0.1);
  }

  /* Full width */
  .btn-full {
    width: 100%;
  }

  /* Icon */
  .btn-icon {
    font-size: 1.2em;
    line-height: 1;
  }

  /* Loading spinner */
  .btn-loading {
    position: relative;
    color: transparent !important;
  }

  .spinner {
    position: absolute;
    width: 20px;
    height: 20px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .btn-loading .spinner {
    color: white;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
