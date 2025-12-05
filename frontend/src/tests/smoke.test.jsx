import { describe, test, expect } from 'vitest';

/**
 * Smoke test to verify test infrastructure is working
 */
describe('Frontend Smoke Test', () => {
  test('basic math works', () => {
    expect(1 + 1).toBe(2);
  });

  test('strings work', () => {
    const str = 'TaxiFlow';
    expect(str).toContain('Taxi');
    expect(str.length).toBeGreaterThan(5);
  });

  test('arrays work', () => {
    const rides = ['ride1', 'ride2', 'ride3'];
    expect(rides).toHaveLength(3);
    expect(rides[0]).toBe('ride1');
  });
});
