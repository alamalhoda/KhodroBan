<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { reminderStats } from '../../stores';

  const navItems = [
    { path: '/dashboard', label: 'خانه', icon: '🏠' },
    { path: '/vehicles', label: 'خودروها', icon: '🚗' },
    { path: '/add', label: 'ثبت', icon: '➕', isPrimary: true },
    { path: '/reports', label: 'گزارش', icon: '📊' },
    { path: '/settings', label: 'تنظیمات', icon: '⚙️' },
  ];

  function isActive(path: string): boolean {
    const currentPath = $page.url.pathname;
    // Remove base path for comparison
    const basePath = '/KhodroBan';
    const cleanPath = currentPath.startsWith(basePath) ? currentPath.slice(basePath.length) : currentPath;
    if (path === '/dashboard' && (cleanPath === '/' || cleanPath === '')) return true;
    return cleanPath === path || cleanPath.startsWith(path + '/');
  }

  async function handleNavigation(path: string, event: Event) {
    event.preventDefault();
    await goto(path);
  }
</script>

<nav class="bottom-nav">
  {#each navItems as item}
    {@const active = isActive(item.path)}
    <a
      href={item.path}
      onclick={(event) => handleNavigation(item.path, event)}
      class="nav-item"
      class:active
      class:primary={item.isPrimary}
    >
      <span class="nav-icon" class:has-badge={item.path === '/dashboard' && $reminderStats.overdue > 0}>
        {item.icon}
        {#if item.path === '/dashboard' && $reminderStats.overdue > 0}
          <span class="badge">{$reminderStats.overdue}</span>
        {/if}
      </span>
      <span class="nav-label">{item.label}</span>
    </a>
  {/each}
</nav>

<style>
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: var(--z-fixed);
    display: flex;
    align-items: stretch;
    justify-content: space-around;
    padding: 0.5rem 0.5rem calc(0.5rem + env(safe-area-inset-bottom, 0px));
    background: var(--glass-bg-solid);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border-top: 1px solid var(--glass-border);
    box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.1);
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    padding: 0.5rem 0.75rem;
    text-decoration: none;
    color: var(--color-text-muted);
    border-radius: 12px;
    transition: all 0.2s ease;
    min-width: 56px;
  }

  .nav-item.active {
    color: var(--color-primary);
  }

  .nav-item.active .nav-icon {
    background: rgba(30, 58, 138, 0.1);
  }

  .nav-item.primary {
    margin-top: -1.5rem;
  }

  .nav-item.primary .nav-icon {
    width: 52px;
    height: 52px;
    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
    color: white;
    box-shadow: 0 4px 15px rgba(30, 58, 138, 0.4);
    font-size: 1.5rem;
  }

  .nav-item.primary .nav-label {
    color: var(--color-primary);
    font-weight: 600;
  }

  .nav-icon {
    position: relative;
    width: 40px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    border-radius: 10px;
    transition: background 0.2s;
  }

  .nav-icon.has-badge::after {
    content: '';
    position: absolute;
    top: 2px;
    right: 6px;
    width: 8px;
    height: 8px;
    background: var(--color-danger);
    border-radius: 50%;
  }

  .badge {
    position: absolute;
    top: -2px;
    right: 2px;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    background: var(--color-danger);
    color: white;
    font-size: 0.625rem;
    font-weight: 600;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-label {
    font-size: 0.6875rem;
    font-weight: 500;
  }

  /* Hide on desktop */
  @media (min-width: 1024px) {
    .bottom-nav {
      display: none;
    }
  }
</style>
