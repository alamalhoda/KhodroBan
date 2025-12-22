<script lang="ts">
  interface Props {
    icon?: string;
    title?: string;
    description?: string;
  }

  let {
    icon = '📭',
    title = 'موردی یافت نشد',
    description = '',
  }: Props = $props();
</script>

<div class="empty-state">
  <span class="empty-icon">{icon}</span>
  <h3 class="empty-title">{title}</h3>
  {#if description}
    <p class="empty-description">{description}</p>
  {/if}
  {#if $$slots.default}
    <div class="empty-action">
      <slot />
    </div>
  {/if}
</div>

<style>
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1.5rem;
    text-align: center;
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.8;
  }

  .empty-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .empty-description {
    margin: 0.5rem 0 0;
    font-size: 0.9375rem;
    color: var(--color-text-light);
    max-width: 300px;
  }

  .empty-action {
    margin-top: 1.5rem;
  }
</style>
