/**
 * Basic setup test to verify Jest and fast-check are working
 */

import * as fc from 'fast-check';

describe('Project Setup', () => {
  test('Jest is working correctly', () => {
    expect(true).toBe(true);
  });

  test('fast-check is working correctly', () => {
    fc.assert(
      fc.property(fc.integer(), (n) => {
        return n === n;
      })
    );
  });

  test('TypeScript types are available', () => {
    const testDate: Date = new Date();
    expect(testDate).toBeInstanceOf(Date);
  });
});
