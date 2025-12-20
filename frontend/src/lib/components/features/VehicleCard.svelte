<script lang="ts">
  import { link } from '../../router';
  import { Card, Badge } from '../common';
  import { formatNumber } from '../../utils/format';
  import { REMINDER_STATUS } from '../../utils/constants';
  import type { Vehicle, Reminder } from '../../types';

  interface Props {
    vehicle: Vehicle;
    status?: Reminder | null;
    showActions?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
  }

  let {
    vehicle,
    status = null,
    showActions = false,
    onEdit,
    onDelete,
  }: Props = $props();

  function getStatusVariant(statusType: string): 'success' | 'warning' | 'danger' {
    if (statusType === 'ok') return 'success';
    if (statusType === 'near') return 'warning';
    return 'danger';
  }
</script>

<Card padding="none" variant="solid" class="vehicle-card">
  <a href="/vehicles/{vehicle.id}" use:link class="vehicle-link">
    <div class="vehicle-main">
      <div class="vehicle-icon">🚗</div>
      <div class="vehicle-info">
        <h3 class="vehicle-model">{vehicle.model}</h3>
        <div class="vehicle-meta">
          <span>{vehicle.plateNumber}</span>
          <span>•</span>
          <span>{formatNumber(vehicle.year)}</span>
        </div>
      </div>
      {#if status}
        <Badge variant={getStatusVariant(status.status)}>
          {REMINDER_STATUS[status.status].label}
        </Badge>
      {/if}
    </div>
    
    <div class="vehicle-stats">
      <div class="stat">
        <span class="stat-value">{formatNumber(vehicle.currentKm)}</span>
        <span class="stat-label">کیلومتر</span>
      </div>
    </div>

    {#if status}
      <div class="vehicle-alert">
        <span class="alert-badge {status.status}">
          {status.message}
        </span>
      </div>
    {/if}
  </a>
  
  {#if showActions}
    <div class="vehicle-actions">
      <button class="action-btn" onclick={onEdit}>
        ✏️ ویرایش
      </button>
      <button class="action-btn danger" onclick={onDelete}>
        🗑️ حذف
      </button>
    </div>
  {/if}
</Card>

<style>
  :global(.vehicle-card) {
    overflow: hidden;
  }

  .vehicle-link {
    display: block;
    padding: 1rem;
    text-decoration: none;
    color: inherit;
  }

  .vehicle-main {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .vehicle-icon {
    font-size: 2.5rem;
  }

  .vehicle-info {
    flex: 1;
  }

  .vehicle-model {
    margin: 0;
    font-size: 1.0625rem;
    font-weight: 600;
  }

  .vehicle-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.25rem;
    font-size: 0.8125rem;
    color: var(--color-text-light);
  }

  .vehicle-stats {
    display: flex;
    gap: 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
  }

  .stat {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .stat-value {
    font-size: 1.125rem;
    font-weight: 600;
  }

  .stat-label {
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }

  .vehicle-alert {
    margin-top: 0.75rem;
  }

  .alert-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    border-radius: 9999px;
  }

  .alert-badge.near {
    background: var(--color-warning-bg);
    color: var(--color-warning);
  }

  .alert-badge.overdue {
    background: var(--color-danger-bg);
    color: var(--color-danger);
  }

  .vehicle-actions {
    display: flex;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: rgba(0, 0, 0, 0.02);
    border-top: 1px solid rgba(0, 0, 0, 0.05);
  }

  .action-btn {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem 0.75rem;
    border: none;
    background: transparent;
    color: var(--color-text-light);
    font-family: inherit;
    font-size: 0.8125rem;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .action-btn:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .action-btn.danger:hover {
    background: rgba(239, 68, 68, 0.1);
    color: var(--color-danger);
  }
</style>
