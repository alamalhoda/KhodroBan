<script lang="ts">
  import { location } from './router';
  import { matchRoute } from './router';

  interface Props {
    routes: Record<string, any>;
    onConditionsFailed?: () => void;
  }

  let { routes = {}, onConditionsFailed }: Props = $props();

  let currentRoute = $derived(findRoute($location));

  function findRoute(path: string): { component: any; params: Record<string, string> } | null {
    // Remove query string
    const cleanPath = path.split('?')[0];
    
    // Try exact match first
    if (routes[cleanPath]) {
      const route = routes[cleanPath];
      if (typeof route === 'function') {
        return { component: route, params: {} };
      }
      if (route.component) {
        // Check conditions
        if (route.conditions) {
          const allPassed = route.conditions.every((condition: () => boolean) => condition());
          if (!allPassed) {
            onConditionsFailed?.();
            return null;
          }
        }
        return { component: route.component, params: {} };
      }
      return { component: route, params: {} };
    }

    // Try pattern matching
    for (const [pattern, routeConfig] of Object.entries(routes)) {
      if (pattern === '*') continue; // Skip catch-all for now
      
      const { matched, params } = matchRoute(pattern, cleanPath);
      if (matched) {
        const route = typeof routeConfig === 'function' 
          ? routeConfig 
          : routeConfig?.component || routeConfig;
        
        if (routeConfig && typeof routeConfig === 'object' && routeConfig.conditions) {
          const allPassed = routeConfig.conditions.every((condition: () => boolean) => condition());
          if (!allPassed) {
            onConditionsFailed?.();
            return null;
          }
        }
        
        return { component: route, params };
      }
    }

    // Catch-all route
    if (routes['*']) {
      return { component: routes['*'], params: {} };
    }

    return null;
  }
</script>

{#if currentRoute}
  {@const Component = currentRoute.component}
  <Component {...currentRoute.params} />
{:else}
  <div>Route not found</div>
{/if}

