<script lang="ts">
  import { Card } from '../ui';
  import type { Reminder } from '../../types';

  interface Props {
    reminder: Reminder;
    onDismiss?: (id: string) => void;
  }

  let {
    reminder,
    onDismiss,
  }: Props = $props();

  function handleDismiss() {
    onDismiss?.(reminder.id);
  }
</script>

<Card padding="md" variant="solid" class="alert-card alert-{reminder.status}">
  <div class="alert-content">
    <div class="alert-icon">
      {#if reminder.status === 'overdue'}⚠️{:else}🔔{/if}
    </div>
    <div class="alert-info">
      <span class="alert-vehicle">{reminder.vehicleName}</span>
      <span class="alert-message">{reminder.message}</span>
    </div>
    {#if onDismiss}
      <button class="alert-dismiss" onclick={handleDismiss} aria-label="بستن یادآور">
        ✕
      </button>
    {/if}
  </div>
</Card>

<style>
  :global(.alert-card) {
    border-right: 4px solid var(--color-warning) !important;
  }

  :global(.alert-overdue) {
    border-right-color: var(--color-danger) !important;
  }

  :global(.alert-near) {
    border-right-color: var(--color-warning) !important;
  }

  :global(.alert-ok) {
    border-right-color: var(--color-success) !important;
  }

  .alert-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .alert-icon {
    font-size: 1.5rem;
  }

  .alert-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .alert-vehicle {
    font-weight: 600;
    font-size: 0.9375rem;
  }

  .alert-message {
    font-size: 0.8125rem;
    color: var(--color-text-light);
  }

  .alert-dismiss {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 50%;
    cursor: pointer;
    font-size: 0.75rem;
    color: var(--color-text-light);
    transition: background 0.2s;
  }

  .alert-dismiss:hover {
    background: rgba(0, 0, 0, 0.1);
  }
</style>
