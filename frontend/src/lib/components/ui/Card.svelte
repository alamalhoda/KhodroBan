<script lang="ts">
  interface Props {
    title?: string;
    subtitle?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    variant?: 'default' | 'solid' | 'outline';
    hoverable?: boolean;
    clickable?: boolean;
    class?: string;
    onclick?: () => void;
  }

  let {
    title = '',
    subtitle = '',
    padding = 'md',
    variant = 'default',
    hoverable = false,
    clickable = false,
    class: className = '',
    onclick,
  }: Props = $props();
</script>

<div 
  class="card card-{variant} card-padding-{padding} {className}"
  class:hoverable
  class:clickable
  onclick={clickable ? onclick : undefined}
  onkeypress={clickable ? (e) => e.key === 'Enter' && onclick?.() : undefined}
  role={clickable ? 'button' : undefined}
  tabindex={clickable ? 0 : undefined}
>
  {#if title || subtitle}
    <div class="card-header">
      {#if title}
        <h3 class="card-title">{title}</h3>
      {/if}
      {#if subtitle}
        <p class="card-subtitle">{subtitle}</p>
      {/if}
    </div>
  {/if}
  
  <div class="card-body">
    <slot />
  </div>
  
  {#if $$slots.footer}
    <div class="card-footer">
      <slot name="footer" />
    </div>
  {/if}
</div>

<style>
  .card {
    border-radius: var(--glass-radius);
    transition: all 0.2s ease;
    overflow: hidden;
  }

  /* Variants */
  .card-default {
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: 1px solid var(--glass-border);
    box-shadow: var(--glass-shadow);
  }

  .card-solid {
    background: var(--glass-bg-solid);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: 1px solid var(--glass-border);
    box-shadow: var(--glass-shadow);
  }

  .card-outline {
    background: transparent;
    border: 1px solid rgba(30, 58, 138, 0.2);
    box-shadow: none;
  }

  /* Padding sizes */
  .card-padding-none .card-body {
    padding: 0;
  }

  .card-padding-sm .card-body {
    padding: 0.75rem;
  }

  .card-padding-md .card-body {
    padding: 1rem;
  }

  .card-padding-lg .card-body {
    padding: 1.5rem;
  }

  /* Header */
  .card-header {
    padding: 1rem 1rem 0;
  }

  .card-padding-sm .card-header {
    padding: 0.75rem 0.75rem 0;
  }

  .card-padding-lg .card-header {
    padding: 1.5rem 1.5rem 0;
  }

  .card-title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .card-subtitle {
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
    color: var(--color-text-light);
  }

  /* Footer */
  .card-footer {
    padding: 0 1rem 1rem;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    margin-top: 1rem;
    padding-top: 1rem;
  }

  /* Hoverable */
  .hoverable:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
  }

  /* Clickable */
  .clickable {
    cursor: pointer;
  }

  .clickable:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  .clickable:active {
    transform: translateY(0);
  }

  /* Fallback for older browsers */
  @supports not (backdrop-filter: blur(10px)) {
    .card-default {
      background: rgba(255, 255, 255, 0.9);
    }
    .card-solid {
      background: rgba(255, 255, 255, 0.95);
    }
  }
</style>
