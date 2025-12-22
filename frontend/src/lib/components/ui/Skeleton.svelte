<script lang="ts">
  /**
   * کامپوننت Skeleton برای نمایش وضعیت بارگذاری
   * مطابق با قوانین user-feedback.mdc
   */
  
  interface Props {
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
    width?: string;
    height?: string;
    lines?: number;
    class?: string;
  }

  let {
    variant = 'text',
    width = '100%',
    height = variant === 'text' ? '1em' : '100px',
    lines = 1,
    class: className = '',
  }: Props = $props();
</script>

{#if lines > 1}
  <div class="skeleton-lines {className}">
    {#each Array(lines) as _, i}
      <div 
        class="skeleton skeleton-{variant}"
        style="width: {i === lines - 1 ? '70%' : width}; height: {height};"
      ></div>
    {/each}
  </div>
{:else}
  <div 
    class="skeleton skeleton-{variant} {className}"
    style="width: {width}; height: {height};"
  ></div>
{/if}

<style>
  .skeleton {
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.06) 25%,
      rgba(0, 0, 0, 0.1) 50%,
      rgba(0, 0, 0, 0.06) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  .skeleton-text {
    border-radius: 4px;
  }

  .skeleton-circular {
    border-radius: 50%;
  }

  .skeleton-rectangular {
    border-radius: 0;
  }

  .skeleton-rounded {
    border-radius: 12px;
  }

  .skeleton-lines {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
</style>
