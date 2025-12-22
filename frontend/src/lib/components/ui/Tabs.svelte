<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { TabItem } from '../../types';

  interface Props {
    tabs: TabItem[];
    activeTab?: string;
  }

  let {
    tabs,
    activeTab = $bindable(tabs[0]?.id || ''),
  }: Props = $props();

  const dispatch = createEventDispatcher();

  function selectTab(id: string) {
    activeTab = id;
    dispatch('change', { id });
  }
</script>

<div class="tabs">
  <div class="tabs-header">
    {#each tabs as tab}
      <button
        class="tab-button"
        class:active={activeTab === tab.id}
        onclick={() => selectTab(tab.id)}
      >
        {#if tab.icon}
          <span class="tab-icon">{tab.icon}</span>
        {/if}
        {tab.label}
      </button>
    {/each}
  </div>
  
  <div class="tabs-content">
    <slot />
  </div>
</div>

<style>
  .tabs {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .tabs-header {
    display: flex;
    gap: 0.25rem;
    padding: 0.25rem;
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 12px;
    margin-bottom: 1rem;
  }

  .tab-button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border: none;
    background: transparent;
    color: var(--color-text-light);
    font-family: inherit;
    font-size: 0.9375rem;
    font-weight: 500;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .tab-button:hover:not(.active) {
    background: rgba(255, 255, 255, 0.2);
    color: var(--color-text);
  }

  .tab-button.active {
    background: white;
    color: var(--color-primary);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .tab-icon {
    font-size: 1.1em;
  }

  .tabs-content {
    flex: 1;
  }
</style>
