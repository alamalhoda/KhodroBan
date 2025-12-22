import type { LayoutServerLoad } from './$types';

// Note: Authentication is handled client-side via localStorage
// Server-side guards would require cookies, which we're not using yet
export const load: LayoutServerLoad = async () => {
  return {};
};

