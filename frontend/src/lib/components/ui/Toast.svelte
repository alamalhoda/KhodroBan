<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { fly } from 'svelte/transition';

  type ToastType = 'success' | 'error' | 'warning' | 'info';

  interface Props {
    message: string;
    type?: ToastType;
    duration?: number;
  }

  let {
    message,
    type = 'info',
    duration = 4000,
  }: Props = $props();

  const dispatch = createEventDispatcher();

  const icons: Record<ToastType, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  function close() {
    dispatch('close');
  }
</script>

<div 
  class="toast toast-{type}" 
  role="alert"
  transition:fly={{ y: -50, duration: 300 }}
>
  <span class="toast-icon">{icons[type]}</span>
  <span class="toast-message">{message}</span>
  <button class="toast-close" onclick={close} aria-label="بستن">
    ✕
  </button>
</div>

<style>
  .toast {
    position: fixed;
    top: 1rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: var(--z-toast);
    
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1.25rem;
    min-width: 280px;
    max-width: 90vw;
    
    border-radius: 12px;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
  }

  .toast-success {
    background: rgba(16, 185, 129, 0.95);
    color: white;
  }

  .toast-error {
    background: rgba(239, 68, 68, 0.95);
    color: white;
  }

  .toast-warning {
    background: rgba(245, 158, 11, 0.95);
    color: white;
  }

  .toast-info {
    background: rgba(30, 58, 138, 0.95);
    color: white;
  }

  .toast-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    font-size: 0.875rem;
    font-weight: bold;
  }

  .toast-message {
    flex: 1;
    font-size: 0.9375rem;
    line-height: 1.4;
  }

  .toast-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    background: rgba(255, 255, 255, 0.1);
    color: inherit;
    border-radius: 50%;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background 0.2s;
  }

  .toast-close:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 480px) {
    .toast {
      left: 1rem;
      right: 1rem;
      transform: none;
      max-width: none;
    }
  }
</style>
