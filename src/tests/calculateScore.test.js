const { calculateScore } = require('../utils/calculateScore');


describe('calculateScore', () => {
  test('Team 1 wins', () => {
    expect(calculateScore(13, 10)).toBe('Team 1 wins');
  });

  test('Team 2 wins', () => {
    expect(calculateScore(9, 13)).toBe('Team 2 wins');
  });

  test('Draw', () => {
    expect(calculateScore(11, 11)).toBe('Draw');
  });
});
