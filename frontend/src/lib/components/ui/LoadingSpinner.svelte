<!--
  @component LoadingSpinner
  Reusable loading spinner with customizable message

  @prop {string} message - Loading message (default: "در حال بارگذاری...")
  @prop {string} size - Spinner size: 'sm' | 'md' | 'lg' (default: 'md')
-->

<script lang="ts">
  interface Props {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
  }

  let { message = 'در حال بارگذاری...', size = 'md' }: Props = $props();

  // Size configurations
  let sizeConfig = $derived(() => {
    const configs = {
      sm: { container: '40px', border: '3px', fontSize: '0.875rem' },
      md: { container: '48px', border: '4px', fontSize: '1rem' },
      lg: { container: '64px', border: '5px', fontSize: '1.125rem' }
    };
    return configs[size];
  });
</script>

<div class="loading-spinner" role="status" aria-label={message}>
  <div
    class="spinner"
    style="--spinner-size: {sizeConfig.container}; --border-width: {sizeConfig.border}"
    aria-hidden="true"
  ></div>
  <p class="loading-message" style="--font-size: {sizeConfig.fontSize}">
    {message}
  </p>
</div>

<style>
  .loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 2rem;
    text-align: center;
  }

  .spinner {
    width: var(--spinner-size, 48px);
    height: var(--spinner-size, 48px);
    border: var(--border-width, 4px) solid var(--color-border);
    border-top: var(--border-width, 4px) solid var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .loading-message {
    margin: 0;
    color: var(--color-text-light);
    font-size: var(--font-size, 1rem);
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Reduce motion for accessibility */
  @media (prefers-reduced-motion: reduce) {
    .spinner {
      animation: none;
    }

    .spinner::after {
      content: '⏳';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: calc(var(--spinner-size, 48px) * 0.6);
      animation: none;
    }
  }
</style>
