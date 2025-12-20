// Wrap utility for route guards (similar to svelte-spa-router)
export function wrap(config: { component: any; conditions?: (() => boolean)[] }) {
  return config;
}

