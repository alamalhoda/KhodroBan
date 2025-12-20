<script lang="ts">
  import Router from './lib/router/Router.svelte';
  import { wrap, push } from './lib/router';
  import { authStore } from './lib/stores/auth';
  import Toast from './lib/components/common/Toast.svelte';
  import { toastStore } from './lib/stores/ui';

  // Import pages
  import Login from './lib/routes/Login.svelte';
  import Register from './lib/routes/Register.svelte';
  import Dashboard from './lib/routes/Dashboard.svelte';
  import Vehicles from './lib/routes/Vehicles.svelte';
  import VehicleDetail from './lib/routes/VehicleDetail.svelte';
  import AddRecord from './lib/routes/AddRecord.svelte';
  import Reports from './lib/routes/Reports.svelte';
  import Settings from './lib/routes/Settings.svelte';
  import NotFound from './lib/routes/NotFound.svelte';

  // Route guard for authenticated routes
  function authGuard() {
    return authStore.isAuthenticated();
  }

  // Routes definition
  const routes = {
    '/': wrap({
      component: Dashboard,
      conditions: [authGuard],
    }),
    '/login': Login,
    '/register': Register,
    '/dashboard': wrap({
      component: Dashboard,
      conditions: [authGuard],
    }),
    '/vehicles': wrap({
      component: Vehicles,
      conditions: [authGuard],
    }),
    '/vehicles/:id': wrap({
      component: VehicleDetail,
      conditions: [authGuard],
    }),
    '/add': wrap({
      component: AddRecord,
      conditions: [authGuard],
    }),
    '/reports': wrap({
      component: Reports,
      conditions: [authGuard],
    }),
    '/settings': wrap({
      component: Settings,
      conditions: [authGuard],
    }),
    '*': NotFound,
  };

  // Handle route conditions failed
  function conditionsFailed() {
    // Redirect to login if not authenticated
    push('/login');
  }
</script>

<div class="app">
  <Router {routes} onConditionsFailed={conditionsFailed} />
  
  {#if $toastStore.visible}
    <Toast 
      message={$toastStore.message} 
      type={$toastStore.type} 
      on:close={() => toastStore.hide()} 
    />
  {/if}
</div>

<style>
  .app {
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
  }
</style>
