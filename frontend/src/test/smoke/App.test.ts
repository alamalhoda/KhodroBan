// src/test/smoke/App.test.ts  (یا مسیر فعلی خودت)
import { render } from '@testing-library/svelte';
import Button from '../../lib/components/ui/Button.svelte';

describe('Button component', () => {
  it.skip('renders without crashing', () => {
    const { getByRole } = render(Button, {
      props: { children: 'Click me' }
    });

    const button = getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
