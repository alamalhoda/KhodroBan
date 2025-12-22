<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade, scale } from 'svelte/transition';

  interface Props {
    open?: boolean;
    title?: string;
    size?: 'sm' | 'md' | 'lg' | 'full';
    closeOnBackdrop?: boolean;
    showClose?: boolean;
  }

  let {
    open = $bindable(false),
    title = '',
    size = 'md',
    closeOnBackdrop = true,
    showClose = true,
  }: Props = $props();

  const dispatch = createEventDispatcher();

  function close() {
    open = false;
    dispatch('close');
  }

  function handleBackdropClick() {
    if (closeOnBackdrop) {
      close();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      close();
    }
  }

  onMount(() => {
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  });

  // Prevent body scroll when modal is open
  $effect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
</script>

{#if open}
  <div class="modal-backdrop" transition:fade={{ duration: 200 }} onclick={handleBackdropClick}>
    <div 
      class="modal modal-{size}" 
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      transition:scale={{ start: 0.95, duration: 200 }}
      onclick={(e) => e.stopPropagation()}
    >
      <div class="modal-header">
        {#if title}
          <h2 id="modal-title" class="modal-title">{title}</h2>
        {/if}
        {#if showClose}
          <button class="modal-close" onclick={close} aria-label="بستن">
            ✕
          </button>
        {/if}
      </div>
      
      <div class="modal-body">
        <slot />
      </div>
      
      {#if $$slots.footer}
        <div class="modal-footer">
          <slot name="footer" />
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: var(--z-modal-backdrop);
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  .modal {
    z-index: var(--z-modal);
    background: var(--glass-bg-solid);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: 1px solid var(--glass-border);
    border-radius: var(--glass-radius);
    box-shadow: 0 8px 50px rgba(0, 0, 0, 0.2);
    max-height: 90vh;
    overflow: auto;
    display: flex;
    flex-direction: column;
  }

  /* Sizes */
  .modal-sm {
    width: 100%;
    max-width: 360px;
  }

  .modal-md {
    width: 100%;
    max-width: 500px;
  }

  .modal-lg {
    width: 100%;
    max-width: 700px;
  }

  .modal-full {
    width: calc(100% - 2rem);
    height: calc(100vh - 2rem);
    max-height: none;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  .modal-title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .modal-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: rgba(0, 0, 0, 0.05);
    color: var(--color-text-light);
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s;
  }

  .modal-close:hover {
    background: rgba(0, 0, 0, 0.1);
    color: var(--color-text);
  }

  .modal-body {
    flex: 1;
    padding: 1.5rem;
    overflow: auto;
  }

  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
  }

  @media (max-width: 480px) {
    .modal {
      max-height: 100vh;
      border-radius: 0;
    }

    .modal-backdrop {
      padding: 0;
      align-items: flex-end;
    }

    .modal:not(.modal-full) {
      width: 100%;
      max-width: none;
      border-radius: 20px 20px 0 0;
      max-height: 90vh;
    }
  }
</style>
