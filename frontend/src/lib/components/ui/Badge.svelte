<script lang="ts">
  type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'primary';

  interface Props {
    variant?: BadgeVariant;
    size?: 'sm' | 'md';
    icon?: string;
    class?: string;
  }

  let {
    variant = 'default',
    size = 'md',
    icon = '',
    class: className = '',
  }: Props = $props();
</script>

<span class="badge badge-{variant} badge-{size} {className}">
  {#if icon}
    <span class="badge-icon">{icon}</span>
  {/if}
  <slot />
</span>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-weight: 500;
    border-radius: 9999px;
    white-space: nowrap;
  }

  .badge-sm {
    padding: 0.125rem 0.5rem;
    font-size: 0.75rem;
  }

  .badge-md {
    padding: 0.25rem 0.75rem;
    font-size: 0.8125rem;
  }

  .badge-default {
    background: rgba(0, 0, 0, 0.08);
    color: var(--color-text);
  }

  .badge-primary {
    background: rgba(30, 58, 138, 0.1);
    color: var(--color-primary);
  }

  .badge-success {
    background: var(--color-success-bg);
    color: var(--color-success);
  }

  .badge-warning {
    background: var(--color-warning-bg);
    color: var(--color-warning);
  }

  .badge-danger {
    background: var(--color-danger-bg);
    color: var(--color-danger);
  }

  .badge-icon {
    font-size: 0.9em;
  }
</style>
