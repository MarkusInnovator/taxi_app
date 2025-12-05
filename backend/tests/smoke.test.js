/**
 * Smoke test to verify test infrastructure is working
 */
describe('Backend Smoke Test', () => {
  test('basic math works', () => {
    expect(1 + 1).toBe(2);
  });

  test('arrays work', () => {
    const arr = [1, 2, 3];
    expect(arr).toHaveLength(3);
    expect(arr).toContain(2);
  });

  test('objects work', () => {
    const obj = { name: 'TaxiFlow', version: 1 };
    expect(obj).toHaveProperty('name');
    expect(obj.version).toBe(1);
  });
});
