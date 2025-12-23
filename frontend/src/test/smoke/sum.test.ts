// src/test/smoke/sum.test.ts
import { describe, it, expect } from 'vitest';
import { sum } from '../../utils/math';

describe('sum', () => {
  it('adds two numbers correctly', () => {
    expect(sum(1, 2)).toBe(3);
  });
});
