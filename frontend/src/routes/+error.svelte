<script lang="ts">
  import { navigateTo } from '$lib/utils/navigation';
  import { Button, Card, EmptyState } from '$lib/components/ui';
</script>

<div class="not-found-page">
  <Card variant="solid" padding="lg">
    <EmptyState
      icon="🔍"
      title="صفحه یافت نشد"
      description="صفحه‌ای که به دنبال آن هستید وجود ندارد یا منتقل شده است"
    >
      <Button variant="primary" onclick={() => navigateTo('/dashboard')}>
        بازگشت به داشبورد
      </Button>
    </EmptyState>
  </Card>
</div>

<style>
  .not-found-page {
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }
</style>

