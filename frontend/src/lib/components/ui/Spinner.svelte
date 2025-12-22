<script lang="ts">
  interface Props {
    size?: 'sm' | 'md' | 'lg';
    color?: string;
  }

  let {
    size = 'md',
    color = 'var(--color-primary)',
  }: Props = $props();
</script>

<div class="spinner spinner-{size}" style="--spinner-color: {color}">
  <div class="spinner-ring"></div>
</div>

<style>
  .spinner {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .spinner-sm {
    width: 20px;
    height: 20px;
  }

  .spinner-md {
    width: 32px;
    height: 32px;
  }

  .spinner-lg {
    width: 48px;
    height: 48px;
  }

  .spinner-ring {
    width: 100%;
    height: 100%;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-top-color: var(--spinner-color);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .spinner-sm .spinner-ring {
    border-width: 2px;
  }

  .spinner-lg .spinner-ring {
    border-width: 4px;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
